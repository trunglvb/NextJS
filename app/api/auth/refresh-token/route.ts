import authApiRequests from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get("refreshToken")?.value as string;
	console.log("refreshToken", refreshToken);

	if (!refreshToken) {
		return Response.json(
			{ message: "Không nhận được token" },
			{
				status: 401,
			}
		);
	}

	try {
		const { payload } = await authApiRequests.sRefreshToken({
			refreshToken,
		});
		const data = payload.data;

		//can decode de lay ra ngay het han cua token => set cookie
		const decodeAccessToken = jwt.decode(data.accessToken) as {
			exp: number;
		};
		const decodeRefreshToken = jwt.decode(data.refreshToken) as {
			exp: number;
		};

		cookieStore.set("accessToken", data.accessToken, {
			path: "/",
			httpOnly: true,
			secure: true,
			expires: decodeAccessToken.exp * 1000,
			sameSite: "lax",
		});

		cookieStore.set("refreshToken", data.refreshToken, {
			path: "/",
			httpOnly: true,
			secure: true,
			expires: decodeRefreshToken.exp * 1000,
			sameSite: "lax",
		});

		return Response.json(payload, { status: 200 });
	} catch (error: any) {
		if (error instanceof HttpError) {
			return Response.json(error.payload, {
				status: error.status,
			});
		} else {
			return Response.json(
				{ message: error.message ?? "Đã có lỗi xảy ra" },
				{ status: 500 }
			);
		}
	}
}
