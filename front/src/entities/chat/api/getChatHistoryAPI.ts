import { customFetchAPI } from "@/shared/api";
import { ChatHistoryResponse } from "../model/types";

const getChatHistoryAPI = () => customFetchAPI<ChatHistoryResponse[], void>({url: "/chatbot/history", method:"GET", end:"Python"})

export default getChatHistoryAPI;