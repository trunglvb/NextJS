import http from "@/lib/http";
import {
	CreateOrdersBodyType,
	GetOrderDetailResType,
} from "@/schemaValidations/order.schema";

const orderApis = {
	getOrders: () => http.get<GetOrderDetailResType>("/orders"),
	updateOrder: (id: number, body: CreateOrdersBodyType) =>
		http.put<GetOrderDetailResType>(`/orders/${id}`, body),
};

export default orderApis;
