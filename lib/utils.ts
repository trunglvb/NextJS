/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
	return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
	error,
	setError,
	duration,
}: {
	error: any;
	setError?: UseFormSetError<any>;
	duration?: number;
}) => {
	if (error instanceof EntityError && setError) {
		console.log(error);
		error.payload.errors.forEach((item) => {
			setError(item.field, {
				type: "server",
				message: item.message,
			});
		});
	} else {
		toast.error("Lỗi", {
			description: error?.payload?.message ?? "Lỗi không xác định",
			duration: duration ?? 5000,
		});
	}
};

const isClient = typeof window !== "undefined";
export const getAccessTokenFromLocalStorage = () =>
	isClient ? localStorage.getItem("accessToken") : null;

export const getRefreshTokenFromLocalStorage = () =>
	isClient ? localStorage.getItem("refreshToken") : null;

export const setAccessTokenToLocalStorage = (accessToken: string) =>
	isClient && localStorage.setItem("accessToken", accessToken);

export const setRefreshTokenToLocalStorage = (refreshToken: string) =>
	isClient && localStorage.setItem("refreshToken", refreshToken);

export const clearLocalStorage = () => {
	localStorage.removeItem("accessToken");
	localStorage.removeItem("refreshToken");
};
