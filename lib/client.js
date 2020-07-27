import { WebsocketHelper } from './websocket-helper';
import {
  CloseConversationEvent,
  InviteRateEvent,
  RecallMessageEvent,
  MessageReadEvent,
  SelectChannelMenuEvent,
} from './consts';
import { createRequest } from './request';

// eslint-disable-next-line import/prefer-default-export
export class Client {
  #websocketHelper

  #request

  /**
   * 构造函数
   * @param handler 回调函数入口
   * @param options 参数，包括：token, subChannelId, debug
   */
  constructor(handler, options = {}) {
    this.#websocketHelper = new WebsocketHelper(handler, options);
    this.#request = createRequest(options.token);
  }

  /**
   * 打开WebSocket连接
   */
  open() {
    if (this.isOpened()) return;
    if (this.isConnecting()) return;
    this.#websocketHelper.open();
  }

  /**
   * 关闭WebSocket连接
   */
  close() {
    this.#websocketHelper.websocket.close(1000);
  }

  /**
   * WebSocket是否已开启
   * @returns {boolean}
   */
  isOpened() {
    return this.#websocketHelper.websocket
      && this.#websocketHelper.websocket.readyState === WebSocket.OPEN;
  }

  /**
   * WebSocket是否正在连接
   * @returns {boolean}
   */
  isConnecting() {
    return this.#websocketHelper.websocket
      && this.#websocketHelper.websocket.readyState === WebSocket.CONNECTING;
  }

  /**
   * 构造一条Message
   * @param messageType 消息类型，可选：Text, Image, Video, Attachment
   * @param content 内容
   * @param conversationId 会话ID
   * @returns {Message}
   */
  buildMessage(messageType, content, conversationId) {
    const myUserInfo = this.#websocketHelper.getCachedUserInfo('me');
    return {
      fromId: myUserInfo.id,
      nickname: myUserInfo.nickname,
      content,
      createdAt: Date.now(),
      direction: 0,
      messageType,
      isRead: false,
      conversationId,
    };
  }

  /**
   * 发送消息
   * @param message 消息，通过buildMessage创建
   * @param toId 目标ID
   * @returns {void|*|Promise<any>}
   */
  sendMessage(message, toId) {
    return this.#websocketHelper.sendMessage(message, toId);
  }

  /**
   * 撤回消息
   * @param messageId 消息ID
   * @returns {Promise | Promise<any>}
   */
  recallMessage(messageId) {
    return this.#websocketHelper.sendEvent(RecallMessageEvent, { messageId });
  }

  /**
   * 消息已读
   * @param messageId 消息ID
   * @returns {Promise | Promise<any>}
   */
  readMessage(messageId) {
    return this.#websocketHelper.sendEvent(MessageReadEvent, { messageId });
  }

  /**
   * 关闭会话
   * @param conversationId 会话ID
   * @returns {Promise | Promise<any>}
   */
  closeConversation(conversationId) {
    return this.#websocketHelper.sendEvent(CloseConversationEvent, { conversationId });
  }

  /**
   * 邀评，仅供客服调用
   * @param userId 用户ID
   * @returns {Promise | Promise<any>}
   */
  inviteRate(userId) {
    return this.#websocketHelper.sendEvent(InviteRateEvent, { userId });
  }

  /**
   * 点选菜单项
   * @param menuItemId
   * @returns {Promise | Promise<any>}
   */
  selectMenuItem(menuItemId) {
    return this.#websocketHelper.sendEvent(SelectChannelMenuEvent, { menuItemId });
  }

  /**
   * 获取个人信息
   * @returns {Promise<AxiosResponse<any>> | IDBRequest<IDBValidKey> | Promise<void>}
   */
  getUserInfo() {
    return this.#request.get('/im/users/me')
      .then((res) => {
        this.#websocketHelper.setUserInfo('me', res.data);
        this.#websocketHelper.setUserInfo(res.data.id, res.data);
        return res;
      });
  }

  /**
   * 更新个人信息
   * @param data
   * @returns {Promise<AxiosResponse<any>> | IDBRequest<IDBValidKey> | Promise<void>}
   */
  updateMyProfile(data) {
    return this.#request.put('/im/users/me', data);
  }

  /**
   * 批量获取会话
   * @param params 过滤参数，包括：
   * state, page, limit, search, begin_at, end_at, order, customer_id, show_all
   * @returns {Promise<AxiosResponse<any>> | IDBRequest<IDBValidKey> | Promise<void>}
   */
  getConversations(params) {
    return this.#request.get('/im/conversations', {
      params,
    }).then((res) => {
      res.data.conversations = res.data.conversations
        .map(item => this.#websocketHelper.parseConversation(item));
      return res;
    });
  }

  /**
   * 获取单条会话
   * @param conversationId 会话ID
   * @returns {Promise<AxiosResponse<any>> | IDBRequest<IDBValidKey> | Promise<void>}
   */
  getConversationById(conversationId) {
    return this.#request.get(`/im/conversations/${conversationId}`)
      .then((res) => {
        res.data = this.#websocketHelper.parseConversation(res.data);
        return res;
      });
  }

  /**
   * 更新用户信息
   * @param id 用户ID
   * @param data 用户信息
   * @returns {Promise<AxiosResponse<any>> | IDBRequest<IDBValidKey> | Promise<void>}
   */
  updateUserProfile(id, data) {
    return this.#request.put(`/im/users/${id}`, data);
  }

  /**
   * 评价客服
   * @param score 分数
   * @returns {Promise<AxiosResponse<any>> | IDBRequest<IDBValidKey> | Promise<void>}
   */
  rateStaff(score) {
    return this.#request.post('/im/rates', { score });
  }

  /**
   * 根据会话ID获取用户资料访问信息
   * @param id 会话ID
   * @returns {Promise<AxiosResponse<any>> | IDBRequest<IDBValidKey> | Promise<void>}
   */
  getVisitInfo(id) {
    return this.#request.get(`/im/conversations/${id}/source_info`);
  }

  /**
   * 获取当前排队人数
   * @returns {Promise<AxiosResponse<any>> | IDBRequest<IDBValidKey> | Promise<void>}
   */
  getPendingCount() {
    return this.#request.get('/im/pending_count');
  }

  /**
   * 增加访客标签
   * @param id
   * @param data
   * @returns {Promise<AxiosResponse<any>> | IDBRequest<IDBValidKey> | Promise<void>}
   */
  addCustomerTag(id, data) {
    return this.#request.post(`/im/users/${id}/tags`, data);
  }

  /**
   * 删除访客标签
   * @param id
   * @param tagId
   * @returns {Promise<AxiosResponse<any>> | IDBRequest<IDBValidKey> | Promise<void>}
   */
  deleteCustomerTag(id, tagId) {
    return this.#request.delete(`/im/users/${id}/tags/${tagId}`);
  }

  /**
   * 上传附件
   * @param file 文件
   * @param onUploadProgress 回调函数
   * @returns {Promise<AxiosResponse<any>> | IDBRequest<IDBValidKey> | Promise<void>}
   */
  uploadBlobs(file, onUploadProgress) {
    const params = new FormData();
    params.append('file', file);
    return this.#request.post('/blobs/upload', params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 5 * 60 * 1000,
      onUploadProgress,
    });
  }

  /**
   * 获取匿名Token
   * @param userId 用户Id
   * @returns {Promise<AxiosResponse<any>> | IDBRequest<IDBValidKey> | Promise<void>}
   */
  static getAnonymousToken(userId) {
    const request = createRequest();
    return request.post('/im/tokens', {
      appId: 'u5xDbdGkyBcwKtN4usXutH4CyZ5V6mNw',
      appSecret: 'Qt9umufWkr6beE55UF7SzECE8DXSfZAS',
      userId,
      nickname: userId,
    });
  }
}
