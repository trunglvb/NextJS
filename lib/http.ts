/* eslint-disable @typescript-eslint/no-explicit-any */
import { clientEnvConfig } from "@/config";
import { normalizePath } from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, "method"> & {
	baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
	message: string;
	errors: {
		field: string;
		message: string;
	}[];
};

export class HttpError extends Error {
	status: number;
	payload: {
		message: string;
		[key: string]: any;
	};
	constructor({
		status,
		payload,
		message = "Lỗi HTTP",
	}: {
		status: number;
		payload: any;
		message?: string;
	}) {
		super();
		this.status = status;
		this.payload = payload;
		this.message = message; // neu khong dung super thi phai dung this.message
	}
}

export class EntityError extends HttpError {
	status: 422;
	payload: EntityErrorPayload;
	constructor({
		status,
		payload,
	}: {
		status: 422;
		payload: EntityErrorPayload;
	}) {
		super({ status, payload }); // ke thua tu HttpError, constructor co gi thi phai add trong super
		this.status = status;
		this.payload = payload;
	}
}

let clientLogoutRequest: null | Promise<any> = null;
export const isClient = () => typeof window !== "undefined";
const request = async <Response>(
	method: "GET" | "POST" | "PUT" | "DELETE",
	url: string,
	options?: CustomOptions | undefined
) => {
	let body: FormData | string | undefined = undefined;
	if (options?.body instanceof FormData) {
		body = options.body;
	} else if (options?.body) {
		body = JSON.stringify(options.body);
	}
	const baseHeaders: {
		[key: string]: string;
	} =
		body instanceof FormData
			? {}
			: {
					"Content-Type": "application/json",
			  };
	if (isClient()) {
		const accessToken = localStorage.getItem("accessToken");
		if (accessToken) {
			baseHeaders.Authorization = `Bearer ${accessToken}`;
		}
	}
	// Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ clientEnvConfig.NEXT_PUBLIC_API_ENDPOINT
	// Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc gọi API đến Next.js Server

	const baseUrl =
		options?.baseUrl === undefined
			? clientEnvConfig.NEXT_PUBLIC_API_ENDPOINT
			: options.baseUrl;

	const fullUrl = `${baseUrl}/${normalizePath(url)}`;

	const res = await fetch(fullUrl, {
		...options,
		headers: {
			...baseHeaders,
			...options?.headers,
		} as any,
		body,
		method,
	});
	const payload: Response = await res.json();
	const data = {
		status: res.status,
		payload,
	};

	// Interceptor là nời chúng ta xử lý request và response trước khi trả về cho phía component
	if (!res.ok) {
		if (res.status === ENTITY_ERROR_STATUS) {
			throw new EntityError(
				data as {
					status: 422;
					payload: EntityErrorPayload;
				}
			);
		} else if (res.status === AUTHENTICATION_ERROR_STATUS) {
			if (isClient()) {
				if (!clientLogoutRequest) {
					clientLogoutRequest = fetch("/api/auth/logout", {
						method: "POST",
						body: null, //luon cho phep logout ke ca truong hop accessToken  hoac refreshToken het han
						headers: {
							...baseHeaders,
						} as any,
					});
					try {
						await clientLogoutRequest;
					} catch (_error) {
						console.log(_error);
					} finally {
						localStorage.removeItem("accessToken");
						localStorage.removeItem("refreshToken");
						clientLogoutRequest = null;

						//redirect ve login co the dan den loop vo han neu tai trang login => can goi cac api can accessToken ma token da bi xoa => no tiep tuc chay vao day va loop vo han
						location.href = "/login";
					}
				}
			} else {
				// truong hop van con access token
				// goi api tu Next server den Backend server
				const accessToken = (
					options?.headers as any
				)?.Authorization.split("Bearer ")[1];
				redirect(`/logout?accessToken=${accessToken}`);
			}
		} else {
			throw new HttpError(data);
		}
	}
	// Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
	if (isClient()) {
		const normalizeUrl = normalizePath(url);
		if (normalizeUrl === "api/auth/login") {
			const { accessToken, refreshToken } = (payload as LoginResType)
				.data;
			localStorage.setItem("accessToken", accessToken);
			localStorage.setItem("refreshToken", refreshToken);
		} else if ("api/auth/logout" === normalizeUrl) {
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
		}
	}
	return data;
};

const http = {
	get<Response>(
		url: string,
		options?: Omit<CustomOptions, "body"> | undefined
	) {
		return request<Response>("GET", url, options);
	},
	post<Response>(
		url: string,
		body: any,
		options?: Omit<CustomOptions, "body"> | undefined
	) {
		return request<Response>("POST", url, { ...options, body });
	},
	put<Response>(
		url: string,
		body: any,
		options?: Omit<CustomOptions, "body"> | undefined
	) {
		return request<Response>("PUT", url, { ...options, body });
	},
	delete<Response>(
		url: string,
		options?: Omit<CustomOptions, "body"> | undefined
	) {
		return request<Response>("DELETE", url, { ...options });
	},
};

export default http;
