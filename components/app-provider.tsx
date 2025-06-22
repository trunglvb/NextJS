"use client";
import RefreshToken from "@/components/refresh-token";
import { clearLocalStorage, getAccessTokenFromLocalStorage } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, useContext, useEffect, useState } from "react";

const client = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		},
	},
});
const AppContext = createContext({
	isAuth: false,
	setIsAuth: (isAuth: boolean) => {},
});

export const useAppContext = () => useContext(AppContext);

export function AppProvider({ children }: { children: React.ReactNode }) {
	const [isAuth, setIsAuthState] = useState(false);

	useEffect(() => {
		const isAuth = getAccessTokenFromLocalStorage();
		if (isAuth) {
			setIsAuthState(true);
		}
	}, []);

	const setIsAuth = (isAuth: boolean) => {
		if (isAuth) {
			setIsAuthState(true);
		} else {
			setIsAuth(false);
			clearLocalStorage();
		}
	};
	return (
		<AppContext value={{ isAuth, setIsAuth }}>
			<QueryClientProvider client={client}>
				{children}
				<RefreshToken />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</AppContext>
	);
}
