/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import authApiRequests from "@/apiRequests/auth";
import { getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

const Logout = () => {
	const ref = useRef<any>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const refreshTokenFromUrl = searchParams.get("refreshToken");

	const logoutMutation = useMutation({
		mutationFn: authApiRequests.logout,
	});

	const { mutateAsync } = logoutMutation;

	useEffect(() => {
		if (
			ref.current ||
			refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()
		)
			return;
		ref.current = mutateAsync;
		mutateAsync({
			refreshToken: localStorage.getItem("refreshToken") as string,
		}).then(() => {
			router.push("/login");
			setTimeout(() => {
				ref.current = null;
			}, 2000);
		});
	}, [mutateAsync, router]);
	return <div></div>;
};

export default Logout;
