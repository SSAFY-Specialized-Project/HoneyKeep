import {customFetchAPI} from "@/shared/api";

const deleteFixedExpenseAPI = (id: number) => customFetchAPI<void, void>({
    url: `/fixed-expenses/${id}`,
    method: "DELETE",
    credentials: "include",
});

export default deleteFixedExpenseAPI;