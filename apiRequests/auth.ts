import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

//tu next client goi login toi Next server => next server goi login toi server
const authApiRequests = {
	serverLogin: (body: LoginBodyType) =>
		http.post<LoginResType>("/auth/login", body),
	login: (body: LoginBodyType) =>
		http.post<LoginResType>("/api/auth/login", body, {
			baseUrl: "", // khi baseUrl = "" la goi den route handler cua next server
		}), //goi api den next server, co the cau hinh type cua response tai route handler
};
export default authApiRequests;
