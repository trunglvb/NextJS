"use client";

import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
	auth: {
		Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
	},
});

export default socket;
