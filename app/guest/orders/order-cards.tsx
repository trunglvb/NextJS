"use client";
import guestApiRequests from "@/apiRequests/guest";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";

const OrderCards = () => {
	const { data } = useQuery({
		queryKey: ["orders-list"],
		queryFn: () => guestApiRequests.getOrders(),
	});
	const orders = data?.payload.data;

	const totalPrice = orders?.reduce((total, order) => {
		return total + order.dishSnapshot.price * order.quantity;
	}, 0);

	return (
		<div>
			{orders?.map((order) => (
				<div key={order.id} className="flex gap-4 mb-4 justify-between">
					<div className="flex-shrink-0 relative">
						<Image
							src={order.dishSnapshot.image}
							alt={order.dishSnapshot.name}
							height={100}
							width={100}
							quality={100}
							className="object-cover w-[80px] h-[80px] rounded-md"
						/>
					</div>

					<div className="space-y-1">
						<h3 className="text-sm">{order.dishSnapshot.name}</h3>
						<p className="text-xs font-semibold">
							{formatCurrency(order.dishSnapshot.price)} x{" "}
							<Badge>{order.quantity}</Badge>
						</p>
					</div>

					<Badge className="h-[20%]">
						{getVietnameseOrderStatus(order.status)}
					</Badge>
				</div>
			))}
			<div className="sticky bottom-0">
				<div className="w-full justify-between">
					<span>Giá tiền: </span>
					<span>{formatCurrency(totalPrice!)}</span>
				</div>
			</div>
		</div>
	);
};

export default OrderCards;
