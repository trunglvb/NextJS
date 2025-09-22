import http from "@/lib/http";
import { DashboardIndicatorResType } from "@/schemaValidations/indicator.schema";
import { GetOrdersQueryParamsType } from "@/schemaValidations/order.schema";
import { get } from "http";
import queryString from "query-string";

const indicatorsApiRequest = {
	getDashboard: (params: GetOrdersQueryParamsType) =>
		http.get<DashboardIndicatorResType>(
			`/indicators/dashboard?${queryString.stringify({
				fromDate: params.fromDate?.toISOString(),
				toDate: params.toDate?.toISOString(),
			})}`
		),
};

export default indicatorsApiRequest;
