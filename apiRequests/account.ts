import http from "@/lib/http";
import { ISuccessResponse } from "@/lib/type";
import { AccountType } from "@/schemaValidations/account.schema";

const accountApiRequests = {
	getMe: () => http.get<ISuccessResponse<AccountType>>("/accounts/me"),
};
export default accountApiRequests;
