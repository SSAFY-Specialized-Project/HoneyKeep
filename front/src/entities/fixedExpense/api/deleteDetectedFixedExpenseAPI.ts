import {customFetchAPI} from "@/shared/api";

const deleteDetectedFixedExpenseAPI = (id: number) => customFetchAPI<void, void>({
    url: `/fixed-expenses/detection/${id}/reject`,
    method: "PATCH",
    credentials: "include",
});

export default deleteDetectedFixedExpenseAPI;