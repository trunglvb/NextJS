"use client";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dishApiRequests from "@/apiRequests/dish";
import { useMutation, useQuery } from "@tanstack/react-query";
import guestApiRequests from "@/apiRequests/guest";
import { toast } from "sonner";
import { useState } from "react";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import Quantity from "@/app/guest/menu/quantity";
import { formatCurrency } from "@/lib/utils";

const MenuOrder = () => {
	const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);
	const { data: dishes } = useQuery({
		queryKey: ["dishes"],
		queryFn: () => dishApiRequests.list(),
	});

	const onOrderMutation = useMutation({
		mutationKey: ["dishes"],
		mutationFn: guestApiRequests.order,
		onSuccess: (res) => {
			toast.success(res.payload.message);
		},
	});

	const totalPrice = orders.reduce((total, order) => {
		const dish = dishes?.payload.data.find((d) => d.id === order.dishId);
		return total + (dish?.price || 0) * order.quantity;
	}, 0);

	console.log(totalPrice);

	const handleChange = (id: number, quantity: number) => {
		setOrders((prev) => {
			const index = prev.findIndex((order) => order.dishId === id);
			if (quantity === 0) {
				return prev.filter((order) => order.dishId !== id);
			}
			if (index === -1) {
				return [...prev, { dishId: id, quantity }];
			}
			const newOrders = [...prev];
			newOrders[index].quantity = quantity;
			return [...newOrders];
		});
	};

	console.log(orders);

	return (
		<>
			{dishes?.payload.data?.map((dish) => (
				<div key={dish.id} className="flex gap-4 mb-2">
					<div className="flex-shrink-0">
						<Image
							src={dish.image}
							alt={dish.name}
							height={100}
							width={100}
							quality={100}
							className="object-cover w-[80px] h-[80px] rounded-md"
						/>
					</div>
					<div className="space-y-1">
						<h3 className="text-sm">{dish.name}</h3>
						<p className="text-xs">{dish.description}</p>
						<p className="text-xs font-semibold">
							{formatCurrency(dish.price)} đ
						</p>
					</div>
					<Quantity
						onChange={(value) => handleChange(dish.id, value)}
						value={
							orders.find((order) => order.dishId === dish.id)
								?.quantity ?? 0
						}
					/>
				</div>
			))}
			<div className="sticky bottom-0">
				<Button className="w-full justify-between">
					<span>Giỏ hàng · {orders.length} món</span>
					<span>{formatCurrency(totalPrice)} đ</span>
				</Button>
			</div>
		</>
	);
};

export default MenuOrder;
