import http from "@/lib/http";
import {
	CreateOrdersBodyType,
	GetOrderDetailResType,
	GetOrdersQueryParamsType,
	GetOrdersResType,
	PayGuestOrdersBodyType,
	PayGuestOrdersResType,
	UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
import queryString from "query-string";

const orderApis = {
	getOrders: (params: GetOrdersQueryParamsType) =>
		http.get<GetOrdersResType>(
			`/orders?${queryString.stringify({
				fromDate: params.fromDate?.toISOString(),
				toDate: params.toDate?.toISOString(),
			})}`
		),
	updateOrder: (id: number, body: UpdateOrderBodyType) =>
		http.put<GetOrderDetailResType>(`/orders/${id}`, body),
	getOrdeDetails: (id: number) =>
		http.get<GetOrderDetailResType>(`/orders/${id}`),
	pay: (body: PayGuestOrdersBodyType) =>
		http.post<PayGuestOrdersResType>(`/orders/pay`, body),
};

export default orderApis;
