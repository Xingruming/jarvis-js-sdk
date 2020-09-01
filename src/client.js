import { WebsocketHelper } from './websocket-helper';
import {
  CloseConversationEvent,
  InviteRateEvent,
  RecallMessageEvent,
  MessageReadEvent,
  SelectChannelMenuEvent,
} from './consts';
import { createRequest } from './request';

/**
 * WebSocket建立成功回调函数
 * @callback OnOpen
 * @param {Event} event 事件
 */

/**
 * WebSocket关闭回调函数
 * @callback OnClose
 * @param {CloseEvent} event 事件
 */

/**
 * WebSocket错误回调函数
 * @callback OnError
 * @param {Event} event 事件
 */

/**
 * 收到消息回调函数
 * @callback OnMessage
 * @param {Message} message 消息
 */

/**
 * 消息
 * @typedef {Object} Message
 * @property {number} id 消息ID
 * @property {number} fromId 发送者ID
 * @property {string} nickname 发送者昵称
 * @property {(string|Object)} content 内容，文本消息为string，其他消息为Object，包含url，filename等信息
 * @property {number} createdAt 消息创建时间戳
 * @property {number} direction 发送方向，0代表发出，1代表收到
 * @property {MessageType} messageType 消息类型
 * @property {boolean} isRead 是否已读
 * @property {number} conversationId 会话ID
 */

/**
 * 消息类型，可以是以下字符串中任意一个
 * @typedef {('Text'|'Image'|'Video'|'Attachment')} MessageType
 */

/**
 * 会话建立回调函数
 * @callback OnConversationBuilt
 * @param {number} conversationId 会话ID
 * @param {number} userId 用户ID
 * @param {string} nickname 用户名
 */

/**
 * 会话关闭回调函数
 * @callback OnConversationClosed
 * @param {number} conversationId 会话ID
 * @param {number} reason 关闭原因 1: 客户主动关闭, 2: 客服主动关闭, 3: 超时自动关闭, 4: 管理员强制关闭
 */

/**
 * 消息被撤回回调函数
 * @callback OnMessageRecall
 * @param {number} conversationId 会话ID
 * @param {number} messageId 消息ID
 */

/**
 * 人工会话建立回调函数
 * @callback OnManualServiceStart
 */

/**
 * 客服繁忙回调函数
 * @callback OnStaffBusy
 */

/**
 * 客服不在线回调函数
 * @callback OnStaffOffline
 */

/**
 * 多端登录回调函数
 * @callback OnMultipleLogin
 */

/**
 * 会话转接回调函数
 * @callback OnConversationTransfer
 * @param {number} conversationId 会话ID
 */

class Client {
  #websocketHelper

  #request

  /**
   * 构造函数
   * @param {Object} handler 回调函数入口
   * @param {OnOpen} handler.onOpen WebSocket建立成功回调函数
   * @param {OnClose} handler.onClose WebSocket关闭回调函数
   * @param {OnError} handler.onError WebSocket错误回调函数
   * @param {OnMessage} handler.onMessage 收到消息回调函数
   * @param {OnConversationBuilt} handler.onConversationBuilt 会话建立回调函数
   * @param {OnConversationClosed} handler.onConversationClosed 会话关闭回调函数
   * @param {OnMessageRecall} handler.onMessageRecall 消息被撤回回调函数
   * @param {OnManualServiceStart} handler.onManualServiceStart 人工会话建立回调函数
   * @param {OnStaffBusy} handler.onStaffBusy 客服繁忙回调函数
   * @param {OnStaffOffline} handler.onStaffOffline 客服不在线回调函数
   * @param {OnMultipleLogin} handler.onMultipleLogin 多端登录回调函数
   * @param {OnConversationTransfer} handler.onConversationTransfer 会话转接回调函数
   * @param {Object} options 参数
   * @param {string} options.token Token
   * @param {number} options.subChannelId 子渠道ID
   * @param {boolean} options.debug 开启调试模式
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
   * @param {MessageType} messageType 消息类型
   * @param {(string|Object)} content 内容，文本消息为string，其他消息为Object，包含url，filename等信息
   * @param {number} conversationId 消息所在会话的ID
   * @returns {Message}
   */
  buildMessage(messageType, content, conversationId) {
    const myUserInfo = this.#websocketHelper.getCachedUserInfo('me');
    return {
      id: 0,
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
   * @param {Message} message 消息，通过buildMessage创建
   * @param {number} toId 目标ID
   * @returns {Promise} 当消息发送成功时resolve
   */
  sendMessage(message, toId) {
    return this.#websocketHelper.sendMessage(message, toId);
  }

  /**
   * 撤回消息
   * @param {number} messageId 消息ID
   * @returns {Promise}
   */
  recallMessage(messageId) {
    return this.#websocketHelper.sendEvent(RecallMessageEvent, { messageId });
  }

  /**
   * 消息已读
   * @param {number} messageId 消息ID
   * @returns {Promise}
   */
  readMessage(messageId) {
    return this.#websocketHelper.sendEvent(MessageReadEvent, { messageId });
  }

  /**
   * 关闭会话
   * @param {number} conversationId 会话ID
   * @returns {Promise}
   */
  closeConversation(conversationId) {
    return this.#websocketHelper.sendEvent(CloseConversationEvent, { conversationId });
  }

  /**
   * 邀评，仅供客服调用
   * @param {number} userId 用户ID
   * @returns {Promise}
   */
  inviteRate(userId) {
    return this.#websocketHelper.sendEvent(InviteRateEvent, { userId });
  }

  /**
   * 点选菜单项，仅供客户调用
   * @param {number} menuItemId
   * @returns {Promise}
   */
  selectMenuItem(menuItemId) {
    return this.#websocketHelper.sendEvent(SelectChannelMenuEvent, { menuItemId });
  }

  /**
   * 获取个人信息
   * @returns {Promise}
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
   * @param {Object} data
   * @returns {Promise}
   */
  updateMyProfile(data) {
    return this.#request.put('/im/users/me', data);
  }

  /**
   * 批量获取会话
   * @param {Object} params 过滤参数
   * @param {('ACTIVE'|'PENDING'|'FINISHED')} params.state 会话状态
   * @param {number} params.page 页码
   * @param {number} params.limit 每页显示条数
   * @param {string} params.search 搜索关键字
   * @param {number} params.begin_at 开始时间
   * @param {number} params.end_at 结束时间
   * @param {('DESC'|'ASC')} params.order 排序
   * @param {number} params.customer_id 客户ID
   * @param {boolean} params.show_all 显示全部
   * @returns {Promise}
   */
  getConversations(params) {
    return this.#request.get('/im/conversations', {
      params,
    }).then((res) => {
      res.data.conversations = res.data.conversations
        .map((item) => this.#websocketHelper.parseConversation(item));
      return res;
    });
  }

  /**
   * 获取单条会话
   * @param {number} conversationId 会话ID
   * @returns {Promise}
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
   * @param {number} id 用户ID
   * @param {Object} data 用户信息
   * @returns {Promise}
   */
  updateUserProfile(id, data) {
    return this.#request.put(`/im/users/${id}`, data);
  }

  /**
   * 评价客服
   * @param {number} score 分数, 1-5
   * @returns {Promise}
   */
  rateStaff(score) {
    return this.#request.post('/im/rates', { score });
  }

  /**
   * 根据会话ID获取用户资料访问信息
   * @param {number} id 会话ID
   * @returns {Promise}
   */
  getVisitInfo(id) {
    return this.#request.get(`/im/conversations/${id}/source_info`);
  }

  /**
   * 获取当前排队人数
   * @returns {Promise}
   */
  getPendingCount() {
    return this.#request.get('/im/pending_count');
  }

  /**
   * 增加访客标签
   * @param {number} id
   * @param {Object} data
   * @returns {Promise}
   */
  addCustomerTag(id, data) {
    return this.#request.post(`/im/users/${id}/tags`, data);
  }

  /**
   * 删除访客标签
   * @param {number} id
   * @param {number} tagId
   * @returns {Promise}
   */
  deleteCustomerTag(id, tagId) {
    return this.#request.delete(`/im/users/${id}/tags/${tagId}`);
  }

  /**
   * 获取快速回复
   * @returns {Promise}
   */
  getQuickReply() {
    return this.#request.get('/im/common_words');
  }

  /**
   * 增加快速回复
   * @param {Object} data
   * @returns {Promise}
   */
  addQuickReply(data) {
    return this.#request.post('/im/common_words', data);
  }

  /**
   * 修改快速回复
   * @param {number} id
   * @param {Object} data
   * @returns {Promise}
   */
  editQuickReply(id, data) {
    return this.#request.put(`/im/common_words/${id}`, data);
  }

  /**
   * 删除快速回复
   * @param {number} id
   * @returns {Promise}
   */
  deleteQuickReply(id) {
    return this.#request.delete(`/im/common_words/${id}`);
  }

  /**
   * 管理员强制关闭会话
   * @param {number} id 会话ID
   * @returns {*}
   */
  adminCloseConversation(id) {
    return this.#request.put(`/im/conversations/${id}/terminate`);
  }

  /**
   * 导出历史会话
   * @param data
   * @returns {Promise}
   */
  exportHistoryConversations(data) {
    return this.#request.post('/im/conversations/export', data);
  }

  /**
   * 获取客服用户列表（转接使用）
   * @param params
   * @returns {Promise}
   */
  getTransferServiceList(params) {
    return this.#request.get('/im/users', { params });
  }

  /**
   * 会话转接
   * @param id
   * @param data
   * @returns {Promise}
   */
  conversationTransfer(id, data) {
    return this.#request.put(`/im/conversations/${id}/transfer`, data);
  }

  /**
   * 历史会话发起会话
   * @param data
   * @returns {Promise}
   */
  requestConversations(data) {
    return this.#request.post('/im/conversations', data);
  }

  /**
   * 获取会话统计
   * @param params
   * @returns {Promise}
   */
  getConversationsCount(params) {
    return this.#request.get('/im/conversations_count', { params });
  }

  /**
   * 上传附件
   * @param {File} file 文件
   * @param {Function} onUploadProgress 回调函数
   * @returns {Promise}
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
   * @returns {Promise}
   */
  static getAnonymousToken() {
    const request = createRequest();
    return request.post('/im/tokens');
  }
}

export default Client;
