import OrderCards from "@/app/[locale]/guest/orders/order-cards";
import React from "react";

const GuestOrders = () => {
	return (
		<div className="max-w-[400px] mx-auto space-y-4">
			<h1 className="text-center text-xl font-bold">🍕 Đơn hàng</h1>
			<OrderCards />
		</div>
	);
};

export default GuestOrders;
