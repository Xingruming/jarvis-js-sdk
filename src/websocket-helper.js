import humps from 'humps';
import {
  BASE_URL,
  PONG_TIMEOUT,
  PING_INTERVAL,
  MultipleLoginEvent,
  AckEvent,
  PingEvent,
  MessageType,
  MessageEvent, MessageReadEvent, InputtingEvent,
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
    let protocol = 'wss';
    if (window.location.protocol === 'http:') protocol = 'ws';
    let url = `${protocol}://${window.location.host}${BASE_URL}/im/ws?token=${encodeURIComponent(this.token)}`;
    if (this.subChannelId) url = `${url}&sub_channel_id=${this.subChannelId}`;
    this.websocket = new WebSocket(url);
    this.websocket.onopen = () => { this.handler.onOpen(); };
    this.websocket.onclose = this.onWebsocketClose;
    this.websocket.onmessage = this.onWebsocketMessage;
    this.websocket.onerror = (e) => { this.handler.onError(e); };
    this.setPingTimer();
  }

  setPingTimer() {
    this.pingTimer = setTimeout(() => {
      this.sendPing();
      this.pongTimeoutTimer = setTimeout(() => {
        this.websocket.close();
        this.handler.onClose({ code: 1006, reason: 'no pong' });
      }, PONG_TIMEOUT);
      this.setPingTimer();
    }, PING_INTERVAL);
  }

  processMessage(message) {
    message = this.parseMessage(message, message.id);
    this.handler.onMessage(message);
    this.onMessageRead(message.id, message.conversationId);
    // eslint-disable-next-line default-case
    switch (message.messageType) {
      case 'ConversationBuilt':
        if (this.handler.onConversationBuilt) {
          this.handler.onConversationBuilt(message.conversationId,
            message.content.userId, message.content.nickname, message.content.userType);
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
          this.handler.onConversationTransfer(message.conversationId);
        }
        break;
    }
  }

  processEvent(event) {
    if (this.debug && event.event_type !== AckEvent) {
      // eslint-disable-next-line no-console
      console.info(
        new Date().toLocaleString(),
        'Received event:',
        event.event_type,
        (event.payload && event.payload.message_type) || 0,
        event,
      );
    }
    event = humps.camelizeKeys(event);
    switch (event.eventType) {
      case MessageEvent:
        this.processMessage(event.payload);
        break;
      case MultipleLoginEvent:
        if (this.handler.onMultipleLogin) {
          this.handler.onMultipleLogin();
        }
        break;
      case AckEvent:
        this.ackEvent(event.payload);
        break;
      case MessageReadEvent:
        this.onMessageRead(event.payload.messageId, event.payload.conversationId);
        break;
      case InputtingEvent:
        if (this.handler.onInputting) {
          this.handler.onInputting(event.payload.content, event.payload.conversationId);
        }
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
      if (this.debug) {
        // eslint-disable-next-line no-console
        console.info(
          new Date().toLocaleString(),
          'Send event:',
          event.event_type,
          (event.payload && event.payload.message_type) || 0,
          event,
        );
      }
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
    const { content } = message;
    const messageType = MessageType[message.messageType];
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
    let lrmId = lrmIds[otherUserId];
    if (conversation.state === 'ACTIVE' && lastStaff.userType === 'ROBOT' && conversation.messages.length) {
      lrmId = conversation.messages[conversation.messages.length - 1].id;
    }
    const messages = conversation.messages
      .map((message) => this.parseMessage(message, lrmId));
    const myUserId = this.#userInfoMap.me.id;
    const myLrmIdx = conversation.messages
      .findIndex((item) => item.id === lrmIds[myUserId]);
    const unreadCount = messages.slice(myLrmIdx + 1)
      .filter((message) => message.direction && !message.isSystemMessage).length;
    return {
      ...conversation,
      users,
      unreadCount,
      messages,
      isNew: !lrmIds[myUserId] && conversation.state !== 'FINISHED',
    };
  }

  parseMessage(message, lrmId) {
    const isSystemMessage = message.messageType >= 100;
    let { content } = message;
    if (content) {
      content = humps.camelizeKeys(content);
      if (content.userId && !content.nickname && this.#userInfoMap[content.userId]) {
        content.nickname = this.#userInfoMap[content.userId].nickname;
        content.userType = this.#userInfoMap[content.userId].userType;
      }
    }

    const fromUserInfo = this.#userInfoMap[message.fromId];
    const myUserInfo = this.#userInfoMap.me;

    let direction = 1;
    if (!isSystemMessage) {
      if (fromUserInfo) {
        if (myUserInfo.userType === 'CUSTOMER') direction = +(fromUserInfo.userType !== 'CUSTOMER');
        else direction = +(fromUserInfo.userType === 'CUSTOMER');
      }
    }
    const isRead = message.id <= lrmId;
    const resultMessage = {
      isSystemMessage,
      direction,
      content,
      isRead,
      id: message.id,
      fromId: message.fromId,
      nickname: fromUserInfo && fromUserInfo.nickname,
      messageType: MessageType[message.messageType],
      createdAt: message.createdAt,
      conversationId: message.conversationId,
      hasRecommend: message.hasRecommend,
    };
    if (!isRead) {
      this.#unreadMessages[message.id] = resultMessage;
    }
    return resultMessage;
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
