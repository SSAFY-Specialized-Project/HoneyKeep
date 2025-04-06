import {customFetchAPI} from "@/shared/api";
import {FixedExpenseRequest, FixedExpenseResponse} from "@/entities/fixedExpense/model/types.ts";

const createFixedExpenseAPI = (data: FixedExpenseRequest) => customFetchAPI<FixedExpenseResponse, FixedExpenseRequest>({
    url: "/fixed-expenses",
    method: "POST",
    credentials: "include",
    data
});

export default createFixedExpenseAPI; 