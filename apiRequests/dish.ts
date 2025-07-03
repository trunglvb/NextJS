import http from "@/lib/http";
import {
	CreateDishBodyType,
	DishResType,
	UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";

const dishApiRequests = {
	list: () => http.get<DishResType[]>("/dishes"),
	get: (id: string) => http.get<DishResType>(`/dishes/${id}`),
	create: (body: CreateDishBodyType) =>
		http.post<DishResType>("/dishes", body),
	update: (id: string, body: UpdateDishBodyType) =>
		http.put<DishResType>(`/dishes/${id}`, body),
	delete: (id: string) => http.delete<DishResType>(`/dishes/${id}`),
};

export default dishApiRequests;
