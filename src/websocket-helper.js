import humps from 'humps';
import {
  BASE_URL,
  PONG_TIMEOUT,
  PING_INTERVAL,
  MessageListEvent,
  MultipleLoginEvent,
  AckEvent,
  PingEvent,
  MessageType,
  MessageEvent, MessageReadEvent,
} from './consts';

// eslint-disable-next-line import/prefer-default-export
export class WebsocketHelper {
  pingTimer = null;

  pongTimeoutTimer = null;

  sequenceId = 0;

  #unconfirmedEvents = {};

  #userInfoMap = {};

  #unreadMessages = {};

  constructor(handler, options) {
    this.handler = handler;
    this.token = options.token;
    this.debug = options.debug;
    this.subChannelId = options.subChannelId;
  }

  setUserInfo(id, userInfo) {
    this.#userInfoMap[id] = userInfo;
  }

  getCachedUserInfo(id) {
    return this.#userInfoMap[id];
  }

  open() {
    let url = `wss://${window.location.host}${BASE_URL}/im/ws?token=${encodeURIComponent(this.token)}`;
    if (this.subChannelId) url = `${url}&sub_channel_id=${this.subChannelId}`;
    this.websocket = new WebSocket(url);
    this.websocket.onopen = this.handler.onOpen;
    this.websocket.onclose = this.onWebsocketClose;
    this.websocket.onmessage = this.onWebsocketMessage;
    this.websocket.onerror = this.handler.onError;
    this.setPingTimer();
  }

  setPingTimer() {
    this.pingTimer = setTimeout(() => {
      this.sendPing();
      this.pongTimeoutTimer = setTimeout(() => {
        this.websocket.close(1006, 'no pong');
      }, PONG_TIMEOUT);
      this.setPingTimer();
    }, PING_INTERVAL);
  }

  processMessage(message) {
    message = this.parseMessage(message, message.id);
    this.handler.onMessage(message);
    // eslint-disable-next-line default-case
    switch (message.messageType) {
      case 'ConversationBuilt':
        if (this.handler.onConversationBuilt) {
          this.handler.onConversationBuilt(message.conversationId,
            message.content.userId, message.content.nickname);
        }
        break;
      case 'ConversationEnd':
        if (this.handler.onConversationClosed) {
          this.handler.onConversationClosed(message.conversationId, message.content.reason);
        }
        break;
      case 'MessageRecall':
        if (this.handler.onMessageRecall) {
          this.handler.onMessageRecall(message.conversationId, message.content.messageId);
        }
        break;
      case 'ManualServiceStart':
        if (this.handler.onManualServiceStart) {
          this.handler.onManualServiceStart();
        }
        break;
      case 'StaffBusyEvent':
        if (this.handler.onStaffBusy) {
          this.handler.onStaffBusy();
        }
        break;
      case 'StaffOfflineEvent':
        if (this.handler.onStaffOffline) {
          this.handler.onStaffOffline();
        }
        break;
      case 'ConversationTransfer':
        if (this.handler.onConversationTransfer) {
          this.handler.onConversationTransfer();
        }
        break;
    }
  }

  processEvent(event) {
    // eslint-disable-next-line no-console
    if (this.debug) console.info('Received event:', event);
    event = humps.camelizeKeys(event);
    switch (event.eventType) {
      case MessageEvent:
        this.processMessage(event.payload);
        break;
      case MessageListEvent:
        event.payload.forEach((item) => {
          this.processMessage(item);
        });
        break;
      case MultipleLoginEvent:
        this.handler.onMultipleLogin();
        break;
      case AckEvent:
        this.ackEvent(event.payload);
        break;
      case MessageReadEvent:
        this.onMessageRead(event.payload.messageId, event.payload.conversationId);
        break;
      default:
        this.handler.onError(event);
    }
  }

  onWebsocketMessage= (event) => {
    clearTimeout(this.pongTimeoutTimer);
    const data = JSON.parse(event.data);
    this.processEvent(data);
  }

  onWebsocketClose= (event) => {
    clearTimeout(this.pingTimer);
    clearTimeout(this.pongTimeoutTimer);
    this.handler.onClose(event);
  }

  sendEvent(eventType, payload) {
    return new Promise((resolve, reject) => {
      if (this.websocket.readyState === WebSocket.CLOSED) {
        this.onWebsocketClose();
        reject();
        return;
      }
      this.sequenceId += 1;
      let event = {
        sequenceId: this.sequenceId,
        eventType,
        payload,
      };
      event = humps.decamelizeKeys(event);
      // eslint-disable-next-line no-console
      if (this.debug) console.info('Send event:', event);
      this.websocket.send(JSON.stringify(event));
      this.#unconfirmedEvents[this.sequenceId] = {
        event,
        resolve,
        reject,
      };
    });
  }

  sendPing() {
    this.sendEvent(PingEvent, 'ping');
  }

  sendMessage(message, toId) {
    let { content } = message;
    const messageType = MessageType[message.messageType];
    if (messageType !== MessageType.Text) {
      content = JSON.stringify(content);
    }
    return this.sendEvent(MessageEvent, {
      messageType,
      content,
      toId,
    }).then((ack) => {
      message.id = ack.messageId;
      this.#unreadMessages[message.id] = message;
    });
  }

  ackEvent(payload) {
    this.#unconfirmedEvents[payload.sequenceId].resolve(payload);
    delete this.#unconfirmedEvents[payload.sequenceId];
  }

  parseConversation(conversation) {
    const { customer, lastStaff } = conversation;
    const users = conversation.users.reduce((m, obj) => {
      m[obj.id] = obj;
      this.setUserInfo(obj.id, obj);
      return m;
    }, {});
    const lrmIds = conversation.conversationsUser.reduce((m, obj) => {
      m[obj.userId] = obj.latestReadMessageId;
      return m;
    }, {});
    const otherUserId = this.#userInfoMap.me.userType === 'CUSTOMER' ? lastStaff.id : customer.id;
    const messages = conversation.messages
      .map((message) => this.parseMessage(message, lrmIds[otherUserId]));
    const myUserId = this.#userInfoMap.me.id;
    const myLrmIdx = conversation.messages
      .findIndex((item) => item.id === lrmIds[myUserId]);
    const unreadCount = messages.slice(myLrmIdx + 1)
      .filter((message) => message.direction).length;
    return {
      ...conversation,
      users,
      unreadCount,
      messages,
    };
  }

  parseMessage(message, lrmId) {
    const isSystemMessage = message.messageType >= 100;
    let { content } = message;
    if (message.messageType === 8) message.messageType = 1;
    if (content) {
      if (message.messageType !== 1) {
        content = JSON.parse(message.content);
        content = humps.camelizeKeys(content);
        if (content.userId && !content.nickname && this.#userInfoMap[content.userId]) {
          content.nickname = this.#userInfoMap[content.userId].nickname;
          content.userType = this.#userInfoMap[content.userId].userType;
        }
      }
    }

    const fromUserInfo = this.#userInfoMap[message.fromId];
    const myUserInfo = this.#userInfoMap.me;

    const result = {
      id: message.id,
      fromId: message.fromId,
      nickname: fromUserInfo && fromUserInfo.nickname,
      messageType: MessageType[message.messageType],
      createdAt: message.createdAt,
      content,
      isRead: message.id <= lrmId,
      conversationId: message.conversationId,
    };
    if (isSystemMessage) {
      result.isSystemMessage = true;
    } else if (fromUserInfo) {
      if (myUserInfo.userType === 'CUSTOMER') result.direction = +((fromUserInfo.id) !== myUserInfo.id);
      else result.direction = +(fromUserInfo.userType === 'CUSTOMER');
    } else {
      result.direction = 1;
    }
    return result;
  }

  onMessageRead(msgId, convId) {
    this.#unreadMessages = Object.keys(this.#unreadMessages)
      .filter((id) => {
        if (this.#unreadMessages[id].conversationId === convId && id <= msgId) {
          this.#unreadMessages[id].isRead = true;
          return false;
        }
        return true;
      })
      .reduce((res, key) => {
        res[key] = this.#unreadMessages[key];
        return res;
      }, {});
  }
}
