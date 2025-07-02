import http from "@/lib/http";
import { ISuccessResponse } from "@/lib/type";
import {
	AccountListResType,
	AccountType,
	ChangePasswordBodyType,
	CreateEmployeeAccountBodyType,
	UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";

const accountApiRequests = {
	getMe: () => http.get<ISuccessResponse<AccountType>>("/accounts/me"),
	updateMe: (data: Pick<AccountType, "name" | "avatar">) =>
		http.put<ISuccessResponse<AccountType>>("/accounts/me", data),
	changePassword: (data: ChangePasswordBodyType) =>
		http.put<ISuccessResponse<AccountType>>(
			"/accounts/change-password",
			data
		),
	list: () => http.get<AccountListResType>("/accounts"),
	addEmployee: (data: CreateEmployeeAccountBodyType) =>
		http.post<ISuccessResponse<AccountType>>("/accounts", data),
	editEmployee: (id: number, data: UpdateEmployeeAccountBodyType) =>
		http.put<ISuccessResponse<AccountType>>(`/accounts/detail/${id}`, data),
	getEmployeeDetail: (id: number) =>
		http.get<ISuccessResponse<AccountType>>(`/accounts/detail/${id}`),
	deleteEmployee: (id: number) =>
		http.delete<ISuccessResponse<AccountType>>(`/accounts/detail/${id}`),
};
export default accountApiRequests;
