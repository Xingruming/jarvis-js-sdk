export const BASE_URL = '/api/v1';

export const PING_INTERVAL = 30 * 1000;
export const PONG_TIMEOUT = 5 * 1000;

export const MessageType = {
  1: 'Text',
  2: 'Image',
  3: 'Video',
  4: 'Attachment',
  5: 'ChannelMenu',
  6: 'RobotChitchatMessage',
  7: 'RobotCanAnswerMessage',
  8: 'RobotNotAnswerMessage',
  9: 'RobotMayAnswerMessage',
  10: 'FAQAnswerMessage',
  101: 'ManualServiceStart',
  102: 'ConversationBuilt',
  103: 'MessageRecall',
  104: 'ConversationEnd',
  105: 'RateInvite',
  106: 'RateInviteError',
  107: 'StaffBusyEvent',
  108: 'StaffOfflineEvent',
  109: 'ConversationTransfer',
  110: 'CustomerRate',
  Text: 1,
  Image: 2,
  Video: 3,
  Attachment: 4,
};

// Common Event
export const MessageEvent = 101;
export const MessageListEvent = 102;
export const AckEvent = 103;
export const MessageReadEvent = 104;
export const InputtingEvent = 105;

// Request Event
export const PingEvent = 201;
export const CloseConversationEvent = 202;
export const RecallMessageEvent = 203;
export const InviteRateEvent = 204;
export const SelectChannelMenuEvent = 205;

// Response Event
export const MultipleLoginEvent = 301;
