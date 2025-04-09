export interface ChatItemType{
  type: "BOT" | "USER";
  text: string;
}

export interface ChatHistoryResponse {
  senderId: "USER" | "BOT";
  content: string;
}