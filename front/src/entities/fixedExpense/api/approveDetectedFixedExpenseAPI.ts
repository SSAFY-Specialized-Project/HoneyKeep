import {customFetchAPI} from "@/shared/api";
import {FixedExpenseResponse} from "@/entities/fixedExpense/model/types.ts";

const approveDetectedFixedExpenseAPI = (id: number) => customFetchAPI<FixedExpenseResponse, void>({
    url: `/fixed-expenses/detection/${id}/approve`,
    method: "PATCH",
    credentials: "include"
});

export default approveDetectedFixedExpenseAPI; 