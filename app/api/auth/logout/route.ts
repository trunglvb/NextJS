/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from "next/headers";
import authApiRequests from "@/apiRequests/auth";

export async function POST(req: Request) {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value as string;
	const refreshToken = cookieStore.get("refreshToken")?.value as string;

	cookieStore.delete("accessToken");
	cookieStore.delete("refreshToken");

	if (!accessToken || !refreshToken) {
		return Response.json(
			{ message: "Không nhận được token" },
			{
				status: 200,
			}
		);
	}

	try {
		const { payload } = await authApiRequests.serverLogout({
			refreshToken,
			accessToken,
		});

		return Response.json(payload, { status: 200 }); //tra ve du lieu cho client
	} catch (error) {
		return Response.json(
			{ message: "Đã có lỗi xảy ra khi gọi api đến server" },
			{ status: 200 }
		);
	}
}
