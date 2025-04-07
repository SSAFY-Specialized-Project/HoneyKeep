import {customFetchAPI} from "@/shared/api";
import {FixedExpenseRequest, FixedExpenseResponse} from "@/entities/fixedExpense/model/types.ts";

const updateFixedExpenseAPI = (params: {
    id: number;
    data: FixedExpenseRequest
}) => customFetchAPI<FixedExpenseResponse, FixedExpenseRequest>({
    url: `/fixed-expenses/${params.id}`,
    method: "PUT",
    credentials: "include",
    data: params.data
});

export default updateFixedExpenseAPI; 