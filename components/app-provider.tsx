/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import RefreshToken from "@/components/refresh-token";
import { clearLocalStorage, getAccessTokenFromLocalStorage } from "@/lib/utils";
import { RoleType, TokenPayload } from "@/types/jwt.types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";

const client = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			// refetchOnMount: false,
		},
	},
});
const AppContext = createContext({
	role: undefined as RoleType | undefined,
	setRole: (role?: RoleType | undefined) => {},
});

export const useAppContext = () => useContext(AppContext);

export function AppProvider({ children }: { children: React.ReactNode }) {
	const [role, setRoleState] = useState<RoleType | undefined>();

	useEffect(() => {
		const accessToken = getAccessTokenFromLocalStorage();
		if (accessToken) {
			const decodeAccessToken = jwt.decode(accessToken) as TokenPayload;
			setRoleState(decodeAccessToken.role as RoleType | undefined);
		}
	}, []);

	const setRole = (role: RoleType | undefined) => {
		if (role) {
			setRoleState(role);
		} else {
			clearLocalStorage();
		}
	};
	return (
		<AppContext value={{ role, setRole }}>
			<QueryClientProvider client={client}>
				{children}
				<RefreshToken />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</AppContext>
	);
}
