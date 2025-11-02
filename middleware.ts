// import { NextResponse } from "next/server";
import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { TokenPayload } from "@/types/jwt.types";
import { Role } from "@/constants/type";
const managePaths = ["/vi/manage", "/en/manage"];
const guestPaths = ["/vi/guest", "/en/guest"];
const authPaths = ["/vi/login", "/en/login"];
const privatePaths = ["/vi/manage", "/vi/guest", "/en/manage", "/en/guest"];
const onlyOwnerPaths = ["/vi/manage/accounts", "/en/manage/accounts"];
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { defaultLocale } from "@/config";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const handleI18nRouting = createMiddleware(routing);

	const response = handleI18nRouting(request);

	const { pathname } = request.nextUrl;
	const refreshTokenValue = request.cookies.get("accessToken")?.value;
	const refreshToken = Boolean(request.cookies.get("refreshToken")?.value);
	const accessToken = Boolean(request.cookies.get("accessToken")?.value);
	const locale = request.cookies.get("NEXT_LOCALE")?.value ?? defaultLocale;
	const role = (jwt.decode(refreshTokenValue as string) as TokenPayload)
		?.role;

	//Route cache mac dinh cua Nextjs la 30s ke tu lan request gan nhat

	// Chưa đăng nhập thì không cho vào private paths
	if (
		privatePaths.some((path) => pathname.startsWith(path)) &&
		!refreshToken
	) {
		const url = new URL(`/${locale}/login`, request.url);
		url.searchParams.set("clearTokens", "true");
		return NextResponse.redirect(url);
		// response.headers.set("x-middleware-rewrite", url.toString());
		// return response;
	}

	//truong hop da dang nhap
	// Đăng nhập rồi thì không cho vào login/register nữa => ve trang chu
	if (authPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
		return NextResponse.redirect(new URL(`/${locale}`, request.url));
	}

	//Đăng nhập rồi nhưng accessToken hết hạn
	//kiem tra role tai refreshToken page
	if (
		privatePaths.some((path) => pathname.startsWith(path)) &&
		!accessToken &&
		refreshToken
	) {
		const url = new URL(`/${locale}/refresh-token`, request.url);
		url.searchParams.set(
			"refreshToken",
			request.cookies.get("refreshToken")?.value || ""
		);
		url.searchParams.set("redirect", pathname);
		return NextResponse.redirect(url);
	}

	//neu khach muon truy cap vao trang manage cua owner
	if (
		(managePaths.some((path) => pathname.startsWith(path)) &&
			role === Role.Guest) ||
		(guestPaths.some((path) => pathname.startsWith(path)) &&
			role !== Role.Guest)
	) {
		return NextResponse.redirect(new URL(`/${locale}`, request.url));
	}

	//neu employee muon truy cap vao trang manage cua owner
	if (
		onlyOwnerPaths.some((path) => pathname.startsWith(path)) &&
		role !== Role.Owner
	) {
		return NextResponse.redirect(new URL(`/${locale}`, request.url));
	}

	return response;
	// return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
