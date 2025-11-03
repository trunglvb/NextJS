/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import authApiRequests from "@/apiRequests/auth";
import { useAppContext } from "@/components/app-provider";
import SearchParamsLoader, {
	useSearchParamsLoader,
} from "@/components/searchParamsLoader";
import { useRouter } from "@/i18n/navigation";
import {
	getAccessTokenFromLocalStorage,
	getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";

const LogoutPage = () => {
	const { setRole, setSocket, socket } = useAppContext();
	const ref = useRef<any>(null);
	const router = useRouter();
	const { searchParams, setSearchParams } = useSearchParamsLoader();
	const refreshTokenFromUrl = searchParams?.get("refreshToken");
	const accessTokenFromUrl = searchParams?.get("accessToken");

	const logoutMutation = useMutation({
		mutationFn: authApiRequests.logout,
	});

	const { mutateAsync } = logoutMutation;

	useEffect(() => {
		if (
			!ref.current &&
			((refreshTokenFromUrl &&
				refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
				(accessTokenFromUrl &&
					accessTokenFromUrl === getAccessTokenFromLocalStorage()))
		) {
			ref.current = mutateAsync;
			mutateAsync({
				refreshToken: getRefreshTokenFromLocalStorage() as string,
			}).then(() => {
				router.push("/login");
				socket?.disconnect();
				setRole(undefined);
				setSocket(undefined);
				setTimeout(() => {
					ref.current = null;
				}, 2000);
			});
		} else {
			router.push("/");
			setRole(undefined);
		}
	}, [mutateAsync, router, accessTokenFromUrl, refreshTokenFromUrl]);
	return (
		<div>
			<SearchParamsLoader onParamsReceived={setSearchParams} />
		</div>
	);
};

export default LogoutPage;
