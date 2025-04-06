import {customFetchAPI} from "@/shared/api";
import {DetectedFixedExpenseResponse} from "@/entities/fixedExpense/model/types.ts";

const getAllFixedExpensesAPI = () => customFetchAPI<DetectedFixedExpenseResponse[], void>({
    url: "/fixed-expenses/detection",
    method: "GET",
    credentials: "include",
})

export default getAllFixedExpensesAPI;
