"use client";

import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
	auth: {
		Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
	},
});

export default socket;
