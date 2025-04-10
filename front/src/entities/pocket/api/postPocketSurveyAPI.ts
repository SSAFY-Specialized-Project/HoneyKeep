import { customFetchAPI } from "@/shared/api";

const postPocketSurveyAPI = ({pocketId, data}) => customFetchAPI({ url: `/pockets/${pocketId}/overspending-reason`, method:"POST", data});

export default postPocketSurveyAPI;