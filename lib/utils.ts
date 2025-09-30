/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { DishStatus, OrderStatus, TableStatus } from "@/constants/type";
import { clientEnvConfig } from "@/config";
import { format } from "date-fns";
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react";
import { io } from "socket.io-client";

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

export const formatCurrency = (number: number) => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(number);
};

export const getVietnameseDishStatus = (
	status: (typeof DishStatus)[keyof typeof DishStatus]
) => {
	switch (status) {
		case DishStatus.Available:
			return "Có sẵn";
		case DishStatus.Unavailable:
			return "Không có sẵn";
		default:
			return "Ẩn";
	}
};

export const getVietnameseOrderStatus = (
	status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
	switch (status) {
		case OrderStatus.Delivered:
			return "Đã phục vụ";
		case OrderStatus.Paid:
			return "Đã thanh toán";
		case OrderStatus.Pending:
			return "Chờ xử lý";
		case OrderStatus.Processing:
			return "Đang nấu";
		default:
			return "Từ chối";
	}
};

export const getVietnameseTableStatus = (
	status: (typeof TableStatus)[keyof typeof TableStatus]
) => {
	switch (status) {
		case TableStatus.Available:
			return "Có sẵn";
		case TableStatus.Reserved:
			return "Đã đặt";
		default:
			return "Ẩn";
	}
};

export const getTableLink = ({
	token,
	tableNumber,
}: {
	token: string;
	tableNumber: number;
}) => {
	return (
		clientEnvConfig.NEXT_PUBLIC_URL +
		"/tables/" +
		tableNumber +
		"?token=" +
		token
	);
};

export function removeAccents(str: string) {
	return str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ/g, "d")
		.replace(/Đ/g, "D");
}

export const simpleMatchText = (fullText: string, matchText: string) => {
	return removeAccents(fullText.toLowerCase()).includes(
		removeAccents(matchText.trim().toLowerCase())
	);
};

export const formatDateTimeToLocaleString = (date: string | Date) => {
	return format(
		date instanceof Date ? date : new Date(date),
		"HH:mm:ss dd/MM/yyyy"
	);
};

export const formatDateTimeToTimeString = (date: string | Date) => {
	return format(date instanceof Date ? date : new Date(date), "HH:mm:ss");
};

export const OrderStatusIcon = {
	[OrderStatus.Pending]: Loader,
	[OrderStatus.Processing]: CookingPot,
	[OrderStatus.Rejected]: BookX,
	[OrderStatus.Delivered]: Truck,
	[OrderStatus.Paid]: HandCoins,
};

export interface SearchField<T> {
	field: keyof T;
	type?: "text" | "select";
	width?: string;
	placeholder?: string;
	className?: string;
	options?: { label: string; value: string }[];
}

export const initSocket = (token: string) => {
	return io(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
		auth: {
			Authorization: `Bearer ${token}`,
		},
	});
};
