import http from "@/lib/http";
import {
	CreateTableBodyType,
	TableListResType,
	TableResType,
	UpdateTableBodyType,
} from "@/schemaValidations/table.schema";

export const tableApiRequests = {
	list: () => http.get<TableListResType>("/tables"),
	add: (body: CreateTableBodyType) =>
		http.post<TableResType>("/tables", body),
	update: (body: UpdateTableBodyType, id: number) =>
		http.put<TableResType>(`/tables/${id}`, body),
	details: (id: number) => http.get<TableResType>(`/tables/${id}`),
	delete: (id: number) => http.delete<TableResType>(`/tables/${id}`),
};
