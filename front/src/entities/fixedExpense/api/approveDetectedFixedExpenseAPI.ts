import {customFetchAPI} from "@/shared/api";
import {FixedExpenseRequest, FixedExpenseResponse} from "@/entities/fixedExpense/model/types.ts";

const approveDetectedFixedExpenseAPI = (params: {
    id: number;
    data: FixedExpenseRequest
}) =>
    customFetchAPI<FixedExpenseResponse, FixedExpenseRequest>({
        url: `/fixed-expenses/detection/${params.id}/approve`,
        method: "PATCH",
        credentials: "include",
        data: params.data,
    });

export default approveDetectedFixedExpenseAPI; 