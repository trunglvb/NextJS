import http from "@/lib/http";
import {
	LoginBodyType,
	LoginResType,
	LogoutBodyType,
	RefreshTokenBodyType,
	RefreshTokenResType,
} from "@/schemaValidations/auth.schema";

//tu next client goi login toi Next server => next server goi login toi server
const authApiRequests = {
	refreshTokenRequest: null as Promise<{
		status: number;
		payload: RefreshTokenResType;
	}> | null,
	serverLogin: (body: LoginBodyType) =>
		http.post<LoginResType>("/auth/login", body),
	login: (body: LoginBodyType) =>
		http.post<LoginResType>("/api/auth/login", body, {
			baseUrl: "", // khi baseUrl = "" la goi den route handler cua next server
		}), //client goi api den next server, co the cau hinh type cua response tai route handler
	serverLogout: (body: LogoutBodyType & { accessToken: string }) =>
		http.post<{ message: string }>(
			"/auth/logout",
			{
				refreshToken: body.refreshToken,
			},
			{
				headers: {
					Authorization: `Bearer ${body.accessToken}`, //goi o next server nen can them header ( next server se goi api den backend server)
				},
			}
		),
	logout: (body: LogoutBodyType) =>
		http.post<{ message: string }>("/api/auth/logout", body, {
			baseUrl: "", // khi baseUrl = "" la goi den route handler cua next server
		}),

	sRefreshToken: (body: RefreshTokenBodyType) =>
		http.post<RefreshTokenResType>("/auth/refresh-token", body),

	async refreshToken() {
		if (this.refreshTokenRequest) {
			return this.refreshTokenRequest;
		}
		this.refreshTokenRequest = http.post<RefreshTokenResType>(
			"/api/auth/refresh-token",
			null,
			{
				baseUrl: "",
			}
		);
		const res = await this.refreshTokenRequest;
		this.refreshTokenRequest = null;
		return res;
	},
};
export default authApiRequests;
