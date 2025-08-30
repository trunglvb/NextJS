"use client";
import guestApiRequests from "@/apiRequests/guest";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import { toast } from "sonner";

const OrderCards = () => {
	const { data, refetch } = useQuery({
		queryKey: ["orders-list"],
		queryFn: () => guestApiRequests.getOrders(),
	});
	const orders = data?.payload.data;

	const totalPrice = orders?.reduce((total, order) => {
		return total + order.dishSnapshot.price * order.quantity;
	}, 0);

	useEffect(() => {
		if (socket.connected) {
			onConnect();
		}

		function onConnect() {
			console.log(socket.id);
		}

		function onDisconnect() {
			console.log("disconnect");
		}

		function onUpdateOrder(data: UpdateOrderResType["data"]) {
			toast.success(
				`Món ${
					data.dishSnapshot.name
				} đã được cập nhật sang trạng thái ${getVietnameseOrderStatus(
					data.status
				)}`
			);
			refetch();
		}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("update-order", onUpdateOrder);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("update-order", onUpdateOrder);
		};
	}, []);

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
