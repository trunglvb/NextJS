/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import authApiRequests from "@/apiRequests/auth";
import {
	clearLocalStorage,
	getAccessTokenFromLocalStorage,
	getRefreshTokenFromLocalStorage,
	setAccessTokenToLocalStorage,
	setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import jwt from "jsonwebtoken";

const RefreshTokenAuth = () => {
	const searchParams = useSearchParams();
	const refreshTokenFromUrl = searchParams.get("refreshToken");
	const redirectPath = searchParams.get("redirect");
	const router = useRouter();
	useEffect(() => {
		let interval: any = null;
		if (
			refreshTokenFromUrl &&
			refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()
		) {
			const checkAndRefreshToken = async () => {
				const accessToken = getAccessTokenFromLocalStorage();
				const refreshToken = getRefreshTokenFromLocalStorage();

				if (!accessToken || !refreshToken) return;

				//thoi diem het han cua token tinh theo epoch time
				//neu dung new Date().getTime thi no se tra ve epocch time(ms)
				const decodeAccessToken = jwt.decode(accessToken) as {
					exp: number;
					iat: number;
				};
				const decodeRefreshToken = jwt.decode(refreshToken) as {
					exp: number;
					iat: number;
				};
				const now = new Date().getTime() / 1000 - 1;
				if (decodeRefreshToken.exp <= now) {
					clearLocalStorage();
					clearInterval(interval);
					return;
				}
				// se goi api refresh token khi thoi gian accessToken con lai 1/3.
				// vi du thoi gian ton tai cua accessToken la 90 giay, thi se goi api refresh token khi thoi gian con lai la 30 giay
				//thoi gian con lai cua accessToken: decodeAccessToken/exp - now
				//thoi gian ton tai cua accessToken: decodeAccessToken.exp - decodeAccessToken.iat

				if (
					decodeAccessToken.exp - now <
					(decodeAccessToken.exp - decodeAccessToken.iat) / 3
				) {
					try {
						const { payload } =
							await authApiRequests.refreshToken();
						setAccessTokenToLocalStorage(payload.data.accessToken);
						setRefreshTokenToLocalStorage(
							payload.data.refreshToken
						);
						router.push(`/${redirectPath}`);
					} catch (error) {
						clearInterval(interval);
						router.push("/logout");
					}
				}
			};

			checkAndRefreshToken();
			interval = setInterval(checkAndRefreshToken, 2000); //timer phai nho hon thoi gian het han cua access token

			return () => {
				clearInterval(interval);
			};
		} else {
			router.push("/");
		}
	}, [refreshTokenFromUrl, redirectPath, router]);
	return null;
};

export default RefreshTokenAuth;
