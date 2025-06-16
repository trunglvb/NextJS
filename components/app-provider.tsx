"use client";
import RefreshToken from "@/components/refresh-token";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const client = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		},
	},
});
export function AppProvider({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={client}>
			{children}
			<RefreshToken />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
