import http from "@/lib/http";
import { ISuccessResponse } from "@/lib/type";

export const mediaRequests = {
	upload: (formData: FormData) =>
		http.post<ISuccessResponse<string>>("/media/upload", formData),
};
