import http from "@/lib/http";
import {
	CreateDishBodyType,
	DishListResType,
	DishResType,
	UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";

const dishApiRequests = {
	list: () => http.get<DishListResType>("/dishes"),
	get: (id: number) => http.get<DishResType>(`/dishes/${id}`),
	create: (body: CreateDishBodyType) =>
		http.post<DishResType>("/dishes", body),
	update: (id: number, body: UpdateDishBodyType) =>
		http.put<DishResType>(`/dishes/${id}`, body),
	delete: (id: number) => http.delete<DishResType>(`/dishes/${id}`),
};

export default dishApiRequests;
