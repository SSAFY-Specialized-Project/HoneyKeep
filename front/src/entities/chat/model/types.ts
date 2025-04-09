export interface ChatItemType{
  type: "BOT" | "USER";
  text: string;
  link: string | null;
}

export interface ChatHistoryResponse {
  senderId: "USER" | "BOT";
  content: string;
}