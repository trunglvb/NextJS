/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequests from "@/apiRequests/auth";
import {
	clearLocalStorage,
	getAccessTokenFromLocalStorage,
	getRefreshTokenFromLocalStorage,
	setAccessTokenToLocalStorage,
	setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { TokenPayload } from "@/types/jwt.types";
import { Role } from "@/constants/type";
import guestApiRequests from "@/apiRequests/guest";
import { useAppContext } from "@/components/app-provider";
import { toast } from "sonner";

const undauthenticatedPaths = ["/login", "/refresh-token"];
const RefreshToken = () => {
	const { socket, setSocket } = useAppContext();
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		if (undauthenticatedPaths.includes(pathname)) return;
		if (socket?.connected) {
			onConnect();
		}
		function onConnect() {
			console.log(socket?.id);
		}
		function onDisconnect() {
			console.log("disconnect");
		}

		let interval: any = null;
		const checkAndRefreshToken = async (forceRefresh?: boolean) => {
			const accessToken = getAccessTokenFromLocalStorage();
			const refreshToken = getRefreshTokenFromLocalStorage();

			if (!accessToken || !refreshToken) return;

			//thoi diem het han cua token tinh theo epoch time
			//neu dung new Date().getTime thi no se tra ve epocch time(ms)
			const decodeAccessToken = jwt.decode(accessToken) as TokenPayload;
			const decodeRefreshToken = jwt.decode(refreshToken) as TokenPayload;
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
				forceRefresh ||
				decodeAccessToken.exp - now <
					(decodeAccessToken.exp - decodeAccessToken.iat) / 3
			) {
				try {
					const { payload } =
						decodeRefreshToken.role === Role.Guest
							? await guestApiRequests.refreshToken()
							: await authApiRequests.refreshToken();
					setAccessTokenToLocalStorage(payload.data.accessToken);
					setRefreshTokenToLocalStorage(payload.data.refreshToken);
				} catch (error) {
					clearInterval(interval);
					socket?.disconnect();
					setSocket(undefined);
					router.push("/login");
				}
			}
		};

		checkAndRefreshToken();
		interval = setInterval(checkAndRefreshToken, 2000); //timer phai nho hon thoi gian het han cua access token

		function forceRefreshToken() {
			checkAndRefreshToken(true);
			toast.success("Cập nhật role thành công");
		}

		socket?.on("connect", onConnect);
		socket?.on("disconnect", onDisconnect);
		socket?.on("refresh-token", forceRefreshToken);

		return () => {
			clearInterval(interval);
			socket?.off("connect", onConnect);
			socket?.off("disconnect", onDisconnect);
			socket?.off("refresh-token", forceRefreshToken);
		};
	}, [pathname, router, socket]);
	return null;
};

export default RefreshToken;
