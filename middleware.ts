import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/manage"];
const authPaths = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const refreshToken = Boolean(request.cookies.get("refreshToken")?.value);
	const accessToken = Boolean(request.cookies.get("accessToken")?.value);

	//Route cache mac dinh cua Nextjs la 30s ke tu lan request gan nhat

	// Chưa đăng nhập thì không cho vào private paths
	if (
		privatePaths.some((path) => pathname.startsWith(path)) &&
		!refreshToken
	) {
		const url = new URL("/login", request.url);
		url.searchParams.set("clearTokens", "true");
		return NextResponse.redirect(url);
	}

	// Đăng nhập rồi thì không cho vào login/register nữa
	if (authPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	//Đăng nhập rồi nhưng accessToken hết hạn
	if (
		privatePaths.some((path) => pathname.startsWith(path)) &&
		!accessToken &&
		refreshToken
	) {
		const url = new URL("/refresh-token", request.url);
		url.searchParams.set(
			"refreshToken",
			request.cookies.get("refreshToken")?.value || ""
		);
		url.searchParams.set("redirect", pathname);
		return NextResponse.redirect(url);
	}
	return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ["/manage/:path*", "/login"],
};
