import { customFetchAPI } from "@/shared/api";
import { Notification } from "../model/types";

const getNotificationsAPI = () => customFetchAPI<Notification[], void>({
  url: "/notifications/",
  method: "GET",
})

export default getNotificationsAPI;