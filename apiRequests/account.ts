import http from "@/lib/http";
import { ISuccessResponse } from "@/lib/type";
import { AccountType } from "@/schemaValidations/account.schema";

const accountApiRequests = {
	getMe: () => http.get<ISuccessResponse<AccountType>>("/accounts/me"),
	updateMe: (data: Pick<AccountType, "name" | "avatar">) =>
		http.put<ISuccessResponse<AccountType>>("/accounts/me", data),
};
export default accountApiRequests;
