## Classes

<dl>
<dt><a href="#Client">Client</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#OnOpen">OnOpen</a> : <code>function</code></dt>
<dd><p>WebSocket建立成功回调函数</p>
</dd>
<dt><a href="#OnClose">OnClose</a> : <code>function</code></dt>
<dd><p>WebSocket关闭回调函数</p>
</dd>
<dt><a href="#OnError">OnError</a> : <code>function</code></dt>
<dd><p>WebSocket错误回调函数</p>
</dd>
<dt><a href="#OnMessage">OnMessage</a> : <code>function</code></dt>
<dd><p>收到消息回调函数</p>
</dd>
<dt><a href="#Message">Message</a> : <code>Object</code></dt>
<dd><p>消息</p>
</dd>
<dt><a href="#MessageType">MessageType</a> : <code>&#x27;Text&#x27;</code> | <code>&#x27;Image&#x27;</code> | <code>&#x27;Video&#x27;</code> | <code>&#x27;Attachment&#x27;</code></dt>
<dd><p>消息类型，可以是以下字符串中任意一个</p>
</dd>
<dt><a href="#OnConversationBuilt">OnConversationBuilt</a> : <code>function</code></dt>
<dd><p>会话建立回调函数</p>
</dd>
<dt><a href="#OnConversationClosed">OnConversationClosed</a> : <code>function</code></dt>
<dd><p>会话关闭回调函数</p>
</dd>
<dt><a href="#OnMessageRecall">OnMessageRecall</a> : <code>function</code></dt>
<dd><p>消息被撤回回调函数</p>
</dd>
<dt><a href="#OnManualServiceStart">OnManualServiceStart</a> : <code>function</code></dt>
<dd><p>人工会话建立回调函数</p>
</dd>
<dt><a href="#OnStaffBusy">OnStaffBusy</a> : <code>function</code></dt>
<dd><p>客服繁忙回调函数</p>
</dd>
<dt><a href="#OnStaffOffline">OnStaffOffline</a> : <code>function</code></dt>
<dd><p>客服不在线回调函数</p>
</dd>
<dt><a href="#OnMultipleLogin">OnMultipleLogin</a> : <code>function</code></dt>
<dd><p>多端登录回调函数</p>
</dd>
<dt><a href="#OnConversationTransfer">OnConversationTransfer</a> : <code>function</code></dt>
<dd><p>会话转接回调函数</p>
</dd>
<dt><a href="#OnInputting">OnInputting</a> : <code>function</code></dt>
<dd><p>会话转接回调函数</p>
</dd>
</dl>

<a name="Client"></a>

## Client
**Kind**: global class  

* [Client](#Client)
    * [new Client(handler, options)](#new_Client_new)
    * _instance_
        * [.open()](#Client+open)
        * [.close()](#Client+close)
        * [.isOpened()](#Client+isOpened) ⇒ <code>boolean</code>
        * [.isConnecting()](#Client+isConnecting) ⇒ <code>boolean</code>
        * [.buildMessage(messageType, content, conversationId)](#Client+buildMessage) ⇒ [<code>Message</code>](#Message)
        * [.sendMessage(message, toId)](#Client+sendMessage) ⇒ <code>Promise</code>
        * [.recallMessage(messageId)](#Client+recallMessage) ⇒ <code>Promise</code>
        * [.readMessage(messageId)](#Client+readMessage) ⇒ <code>Promise</code>
        * [.closeConversation(conversationId)](#Client+closeConversation) ⇒ <code>Promise</code>
        * [.inviteRate(userId)](#Client+inviteRate) ⇒ <code>Promise</code>
        * [.selectMenuItem(menuItemId)](#Client+selectMenuItem) ⇒ <code>Promise</code>
        * [.inputting(content, conversationId, toId)](#Client+inputting) ⇒ <code>Promise</code>
        * [.getUserInfo()](#Client+getUserInfo) ⇒ <code>Promise</code>
        * [.updateMyProfile(data)](#Client+updateMyProfile) ⇒ <code>Promise</code>
        * [.getConversations(params)](#Client+getConversations) ⇒ <code>Promise</code>
        * [.getConversationById(conversationId)](#Client+getConversationById) ⇒ <code>Promise</code>
        * [.updateUserProfile(id, data)](#Client+updateUserProfile) ⇒ <code>Promise</code>
        * [.rateStaff(score)](#Client+rateStaff) ⇒ <code>Promise</code>
        * [.getVisitInfo(id)](#Client+getVisitInfo) ⇒ <code>Promise</code>
        * [.getPendingCount()](#Client+getPendingCount) ⇒ <code>Promise</code>
        * [.addCustomerTag(id, data)](#Client+addCustomerTag) ⇒ <code>Promise</code>
        * [.deleteCustomerTag(id, tagId)](#Client+deleteCustomerTag) ⇒ <code>Promise</code>
        * [.getQuickReply()](#Client+getQuickReply) ⇒ <code>Promise</code>
        * [.addQuickReply(data)](#Client+addQuickReply) ⇒ <code>Promise</code>
        * [.editQuickReply(id, data)](#Client+editQuickReply) ⇒ <code>Promise</code>
        * [.deleteQuickReply(id)](#Client+deleteQuickReply) ⇒ <code>Promise</code>
        * [.adminCloseConversation(id)](#Client+adminCloseConversation) ⇒ <code>\*</code>
        * [.exportHistoryConversations(data)](#Client+exportHistoryConversations) ⇒ <code>Promise</code>
        * [.getTransferServiceList(params)](#Client+getTransferServiceList) ⇒ <code>Promise</code>
        * [.conversationTransfer(id, data)](#Client+conversationTransfer) ⇒ <code>Promise</code>
        * [.requestConversations(data)](#Client+requestConversations) ⇒ <code>Promise</code>
        * [.getConversationsCount(params)](#Client+getConversationsCount) ⇒ <code>Promise</code>
        * [.uploadBlobs(file, onUploadProgress)](#Client+uploadBlobs) ⇒ <code>Promise</code>
        * [.likeRobotAnswer(id)](#Client+likeRobotAnswer) ⇒ <code>Promise</code>
        * [.dislikeRobotAnswer(msgId)](#Client+dislikeRobotAnswer) ⇒ <code>Promise</code>
        * [.getSuggestions(query)](#Client+getSuggestions) ⇒ <code>Promise</code>
        * [.getPendingPosition(convId)](#Client+getPendingPosition) ⇒ <code>Promise</code>
    * _static_
        * [.getAnonymousToken()](#Client.getAnonymousToken) ⇒ <code>Promise</code>

<a name="new_Client_new"></a>

### new Client(handler, options)
构造函数


| Param | Type | Description |
| --- | --- | --- |
| handler | <code>Object</code> | 回调函数入口 |
| handler.onOpen | [<code>OnOpen</code>](#OnOpen) | WebSocket建立成功回调函数 |
| handler.onClose | [<code>OnClose</code>](#OnClose) | WebSocket关闭回调函数 |
| handler.onError | [<code>OnError</code>](#OnError) | WebSocket错误回调函数 |
| handler.onMessage | [<code>OnMessage</code>](#OnMessage) | 收到消息回调函数 |
| handler.onConversationBuilt | [<code>OnConversationBuilt</code>](#OnConversationBuilt) | 会话建立回调函数 |
| handler.onConversationClosed | [<code>OnConversationClosed</code>](#OnConversationClosed) | 会话关闭回调函数 |
| handler.onMessageRecall | [<code>OnMessageRecall</code>](#OnMessageRecall) | 消息被撤回回调函数 |
| handler.onManualServiceStart | [<code>OnManualServiceStart</code>](#OnManualServiceStart) | 人工会话建立回调函数 |
| handler.onStaffBusy | [<code>OnStaffBusy</code>](#OnStaffBusy) | 客服繁忙回调函数 |
| handler.onStaffOffline | [<code>OnStaffOffline</code>](#OnStaffOffline) | 客服不在线回调函数 |
| handler.onMultipleLogin | [<code>OnMultipleLogin</code>](#OnMultipleLogin) | 多端登录回调函数 |
| handler.onConversationTransfer | [<code>OnConversationTransfer</code>](#OnConversationTransfer) | 会话转接回调函数 |
| options | <code>Object</code> | 参数 |
| options.token | <code>string</code> | Token |
| options.subChannelId | <code>number</code> | 子渠道ID |
| options.debug | <code>boolean</code> | 开启调试模式 |

<a name="Client+open"></a>

### client.open()
打开WebSocket连接

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+close"></a>

### client.close()
关闭WebSocket连接

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+isOpened"></a>

### client.isOpened() ⇒ <code>boolean</code>
WebSocket是否已开启

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+isConnecting"></a>

### client.isConnecting() ⇒ <code>boolean</code>
WebSocket是否正在连接

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+buildMessage"></a>

### client.buildMessage(messageType, content, conversationId) ⇒ [<code>Message</code>](#Message)
构造一条Message

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| messageType | [<code>MessageType</code>](#MessageType) | 消息类型 |
| content | <code>string</code> \| <code>Object</code> | 内容，文本消息为string，其他消息为Object，包含url，filename等信息 |
| conversationId | <code>number</code> | 消息所在会话的ID |

<a name="Client+sendMessage"></a>

### client.sendMessage(message, toId) ⇒ <code>Promise</code>
发送消息

**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <code>Promise</code> - 当消息发送成功时resolve  

| Param | Type | Description |
| --- | --- | --- |
| message | [<code>Message</code>](#Message) | 消息，通过buildMessage创建 |
| toId | <code>number</code> | 目标ID |

<a name="Client+recallMessage"></a>

### client.recallMessage(messageId) ⇒ <code>Promise</code>
撤回消息

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| messageId | <code>number</code> | 消息ID |

<a name="Client+readMessage"></a>

### client.readMessage(messageId) ⇒ <code>Promise</code>
消息已读

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| messageId | <code>number</code> | 消息ID |

<a name="Client+closeConversation"></a>

### client.closeConversation(conversationId) ⇒ <code>Promise</code>
关闭会话

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| conversationId | <code>number</code> | 会话ID |

<a name="Client+inviteRate"></a>

### client.inviteRate(userId) ⇒ <code>Promise</code>
邀评，仅供客服调用

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>number</code> | 用户ID |

<a name="Client+selectMenuItem"></a>

### client.selectMenuItem(menuItemId) ⇒ <code>Promise</code>
点选菜单项，仅供客户调用

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type |
| --- | --- |
| menuItemId | <code>number</code> | 

<a name="Client+inputting"></a>

### client.inputting(content, conversationId, toId) ⇒ <code>Promise</code>
正在输入

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type |
| --- | --- |
| content | <code>string</code> | 
| conversationId | <code>number</code> | 
| toId | <code>number</code> | 

<a name="Client+getUserInfo"></a>

### client.getUserInfo() ⇒ <code>Promise</code>
获取个人信息

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+updateMyProfile"></a>

### client.updateMyProfile(data) ⇒ <code>Promise</code>
更新个人信息

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type |
| --- | --- |
| data | <code>Object</code> | 

<a name="Client+getConversations"></a>

### client.getConversations(params) ⇒ <code>Promise</code>
批量获取会话

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | 过滤参数 |
| params.state | <code>&#x27;ACTIVE&#x27;</code> \| <code>&#x27;PENDING&#x27;</code> \| <code>&#x27;FINISHED&#x27;</code> | 会话状态 |
| params.page | <code>number</code> | 页码 |
| params.limit | <code>number</code> | 每页显示条数 |
| params.search | <code>string</code> | 搜索关键字 |
| params.begin_at | <code>number</code> | 开始时间 |
| params.end_at | <code>number</code> | 结束时间 |
| params.order | <code>&#x27;DESC&#x27;</code> \| <code>&#x27;ASC&#x27;</code> | 排序 |
| params.customer_id | <code>number</code> | 客户ID |
| params.show_all | <code>boolean</code> | 显示全部 |

<a name="Client+getConversationById"></a>

### client.getConversationById(conversationId) ⇒ <code>Promise</code>
获取单条会话

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| conversationId | <code>number</code> | 会话ID |

<a name="Client+updateUserProfile"></a>

### client.updateUserProfile(id, data) ⇒ <code>Promise</code>
更新用户信息

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | 用户ID |
| data | <code>Object</code> | 用户信息 |

<a name="Client+rateStaff"></a>

### client.rateStaff(score) ⇒ <code>Promise</code>
评价客服

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| score | <code>number</code> | 分数, 1-5 |

<a name="Client+getVisitInfo"></a>

### client.getVisitInfo(id) ⇒ <code>Promise</code>
根据会话ID获取用户资料访问信息

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | 会话ID |

<a name="Client+getPendingCount"></a>

### client.getPendingCount() ⇒ <code>Promise</code>
获取当前排队人数

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+addCustomerTag"></a>

### client.addCustomerTag(id, data) ⇒ <code>Promise</code>
增加访客标签

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type |
| --- | --- |
| id | <code>number</code> | 
| data | <code>Object</code> | 

<a name="Client+deleteCustomerTag"></a>

### client.deleteCustomerTag(id, tagId) ⇒ <code>Promise</code>
删除访客标签

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type |
| --- | --- |
| id | <code>number</code> | 
| tagId | <code>number</code> | 

<a name="Client+getQuickReply"></a>

### client.getQuickReply() ⇒ <code>Promise</code>
获取快速回复

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Client+addQuickReply"></a>

### client.addQuickReply(data) ⇒ <code>Promise</code>
增加快速回复

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type |
| --- | --- |
| data | <code>Object</code> | 

<a name="Client+editQuickReply"></a>

### client.editQuickReply(id, data) ⇒ <code>Promise</code>
修改快速回复

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type |
| --- | --- |
| id | <code>number</code> | 
| data | <code>Object</code> | 

<a name="Client+deleteQuickReply"></a>

### client.deleteQuickReply(id) ⇒ <code>Promise</code>
删除快速回复

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="Client+adminCloseConversation"></a>

### client.adminCloseConversation(id) ⇒ <code>\*</code>
管理员强制关闭会话

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | 会话ID |

<a name="Client+exportHistoryConversations"></a>

### client.exportHistoryConversations(data) ⇒ <code>Promise</code>
导出历史会话

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param |
| --- |
| data | 

<a name="Client+getTransferServiceList"></a>

### client.getTransferServiceList(params) ⇒ <code>Promise</code>
获取客服用户列表（转接使用）

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param |
| --- |
| params | 

<a name="Client+conversationTransfer"></a>

### client.conversationTransfer(id, data) ⇒ <code>Promise</code>
会话转接

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param |
| --- |
| id | 
| data | 

<a name="Client+requestConversations"></a>

### client.requestConversations(data) ⇒ <code>Promise</code>
历史会话发起会话

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param |
| --- |
| data | 

<a name="Client+getConversationsCount"></a>

### client.getConversationsCount(params) ⇒ <code>Promise</code>
获取会话统计

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param |
| --- |
| params | 

<a name="Client+uploadBlobs"></a>

### client.uploadBlobs(file, onUploadProgress) ⇒ <code>Promise</code>
上传附件

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>File</code> | 文件 |
| onUploadProgress | <code>function</code> | 回调函数 |

<a name="Client+likeRobotAnswer"></a>

### client.likeRobotAnswer(id) ⇒ <code>Promise</code>
机器人满意回答

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param |
| --- |
| id | 

<a name="Client+dislikeRobotAnswer"></a>

### client.dislikeRobotAnswer(msgId) ⇒ <code>Promise</code>
机器人不满意回答

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param |
| --- |
| msgId | 

<a name="Client+getSuggestions"></a>

### client.getSuggestions(query) ⇒ <code>Promise</code>
问题自动补全

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param |
| --- |
| query | 

<a name="Client+getPendingPosition"></a>

### client.getPendingPosition(convId) ⇒ <code>Promise</code>
当前排队位置

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param |
| --- |
| convId | 

<a name="Client.getAnonymousToken"></a>

### Client.getAnonymousToken() ⇒ <code>Promise</code>
获取匿名Token

**Kind**: static method of [<code>Client</code>](#Client)  
<a name="OnOpen"></a>

## OnOpen : <code>function</code>
WebSocket建立成功回调函数

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Event</code> | 事件 |

<a name="OnClose"></a>

## OnClose : <code>function</code>
WebSocket关闭回调函数

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>CloseEvent</code> | 事件 |

<a name="OnError"></a>

## OnError : <code>function</code>
WebSocket错误回调函数

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Event</code> | 事件 |

<a name="OnMessage"></a>

## OnMessage : <code>function</code>
收到消息回调函数

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| message | [<code>Message</code>](#Message) | 消息 |

<a name="Message"></a>

## Message : <code>Object</code>
消息

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | 消息ID |
| fromId | <code>number</code> | 发送者ID |
| nickname | <code>string</code> | 发送者昵称 |
| content | <code>string</code> \| <code>Object</code> | 内容，文本消息为string，其他消息为Object，包含url，filename等信息 |
| createdAt | <code>number</code> | 消息创建时间戳 |
| direction | <code>number</code> | 发送方向，0代表发出，1代表收到 |
| messageType | [<code>MessageType</code>](#MessageType) | 消息类型 |
| isRead | <code>boolean</code> | 是否已读 |
| conversationId | <code>number</code> | 会话ID |

<a name="MessageType"></a>

## MessageType : <code>&#x27;Text&#x27;</code> \| <code>&#x27;Image&#x27;</code> \| <code>&#x27;Video&#x27;</code> \| <code>&#x27;Attachment&#x27;</code>
消息类型，可以是以下字符串中任意一个

**Kind**: global typedef  
<a name="OnConversationBuilt"></a>

## OnConversationBuilt : <code>function</code>
会话建立回调函数

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| conversationId | <code>number</code> | 会话ID |
| userId | <code>number</code> | 用户ID |
| nickname | <code>string</code> | 用户名 |
| userType | <code>string</code> | 用户类型 |

<a name="OnConversationClosed"></a>

## OnConversationClosed : <code>function</code>
会话关闭回调函数

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| conversationId | <code>number</code> | 会话ID |
| reason | <code>number</code> | 关闭原因 1: 客户主动关闭, 2: 客服主动关闭, 3: 超时自动关闭, 4: 管理员强制关闭 |

<a name="OnMessageRecall"></a>

## OnMessageRecall : <code>function</code>
消息被撤回回调函数

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| conversationId | <code>number</code> | 会话ID |
| messageId | <code>number</code> | 消息ID |

<a name="OnManualServiceStart"></a>

## OnManualServiceStart : <code>function</code>
人工会话建立回调函数

**Kind**: global typedef  
<a name="OnStaffBusy"></a>

## OnStaffBusy : <code>function</code>
客服繁忙回调函数

**Kind**: global typedef  
<a name="OnStaffOffline"></a>

## OnStaffOffline : <code>function</code>
客服不在线回调函数

**Kind**: global typedef  
<a name="OnMultipleLogin"></a>

## OnMultipleLogin : <code>function</code>
多端登录回调函数

**Kind**: global typedef  
<a name="OnConversationTransfer"></a>

## OnConversationTransfer : <code>function</code>
会话转接回调函数

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| conversationId | <code>number</code> | 会话ID |

<a name="OnInputting"></a>

## OnInputting : <code>function</code>
会话转接回调函数

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | 消息内容 |
| conversationId | <code>number</code> | 会话ID |

