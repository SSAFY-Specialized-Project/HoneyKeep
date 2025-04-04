import {customFetchAPI} from "@/shared/api";
import {FixedExpenseResponse} from "@/entities/fixedExpense/model/types.ts";

const getAllFixedExpensesAPI = () => customFetchAPI<FixedExpenseResponse[], void>({
    url: "/fixed-expenses",
    method: "GET",
    credentials: "include",
})

export default getAllFixedExpensesAPI;
