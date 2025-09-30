"use client";

import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import { io } from "socket.io-client";

//socket chi goi 1 lan duy nhat ban dau
const socket = io(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
	auth: {
		Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
	},
	autoConnect: false,
});

export default socket;
