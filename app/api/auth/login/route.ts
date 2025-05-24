import { cookies } from "next/headers";
import authApiRequests from "@/apiRequests/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";

export async function POST(req: Request) {
	const body = (await req.json()) as LoginBodyType; // body o day chinh la body client gui len

	const cookieStore = await cookies();
	try {
		const { payload } = await authApiRequests.serverLogin(body);
		const { accessToken, refreshToken } = payload.data;

		//can decode de lay ra ngay het han cua token => set cookie
		const decodeAccessToken = jwt.decode(accessToken) as { exp: number };
		const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number };

		cookieStore.set("accessToken", accessToken, {
			path: "/",
			httpOnly: true,
			secure: true,
			expires: decodeAccessToken.exp * 1000,
			sameSite: "lax",
		});

		cookieStore.set("refreshToken", refreshToken, {
			path: "/",
			httpOnly: true,
			secure: true,
			expires: decodeRefreshToken.exp * 1000,
			sameSite: "lax",
		});

		return Response.json(payload, { status: 200 }); //tra ve du lieu cho client
	} catch (error) {
		if (error instanceof HttpError) {
			return Response.json(error.payload, {
				status: error.status,
			});
		} else {
			return Response.json(
				{ message: "Đã có lỗi xảy ra" },
				{ status: 500 }
			);
		}
	}
}
