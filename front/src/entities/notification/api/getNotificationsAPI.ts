import { customFetchAPI } from "@/shared/api";

const getNotificationsAPI = () => customFetchAPI({
  url: "/notifications",
  method: "GET",
})

export default getNotificationsAPI;