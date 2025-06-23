/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import authApiRequests from "@/apiRequests/auth";
import { useAppContext } from "@/components/app-provider";
import {
	getAccessTokenFromLocalStorage,
	getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

const Logout = () => {
	const { setIsAuth } = useAppContext();
	const ref = useRef<any>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const refreshTokenFromUrl = searchParams.get("refreshToken");
	const accessTokenFromUrl = searchParams.get("accessToken");

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
				setIsAuth(false);
				setTimeout(() => {
					ref.current = null;
				}, 2000);
			});
		} else {
			router.push("/");
		}
	}, [mutateAsync, router, accessTokenFromUrl, refreshTokenFromUrl]);
	return <div></div>;
};

export default Logout;
