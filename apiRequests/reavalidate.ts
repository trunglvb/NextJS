import http from "@/lib/http";

export const revalidateApiRequests = {
	revalidate: (tag: string) =>
		http.get(`/api/revalidate?tag=${tag}`, {
			baseUrl: "",
		}),
};
