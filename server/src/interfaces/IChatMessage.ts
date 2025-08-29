export interface IChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  timestamp: Date;
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISendChatMessage {
  roomId: string;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  timestamp: Date;
}

export interface IEditChatMessage {
  roomId: string;
  messageId: string;
  userId: string;
  newContent: string;
}

export interface IDeleteChatMessage {
  roomId: string;
  messageId: string;
  userId: string;
}

export interface IRequestChatHistory {
  roomId: string;
}

export interface IUserTyping {
  roomId: string;
  userId: string;
  userName: string;
}

export interface IStopTyping {
  roomId: string;
  userId: string;
}
