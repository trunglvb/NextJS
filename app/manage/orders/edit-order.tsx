"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	UpdateOrderBody,
	UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { getVietnameseOrderStatus, handleErrorApi } from "@/lib/utils";
import { OrderStatus, OrderStatusValues } from "@/constants/type";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DishesDialog } from "@/app/manage/orders/dishes-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { DishListResType } from "@/schemaValidations/dish.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import orderApis from "@/apiRequests/order";

export default function EditOrder({
	id,
	setId,
	onSubmitSuccess,
}: {
	id?: number | undefined;
	setId: (value: number | undefined) => void;
	onSubmitSuccess?: () => void;
}) {
	const [selectedDish, setSelectedDish] = useState<
		DishListResType["data"][0] | null
	>(null);

	const form = useForm<UpdateOrderBodyType>({
		resolver: zodResolver(UpdateOrderBody),
		defaultValues: {
			status: OrderStatus.Pending,
			dishId: 0,
			quantity: 1,
		},
	});

	const { data } = useQuery({
		queryKey: ["orders", id],
		queryFn: () => orderApis.getOrdeDetails(id as number),
		enabled: Boolean(id),
	});

	const updateOrderMutation = useMutation({
		mutationKey: ["update-order"],
		mutationFn: ({
			orderId,
			...data
		}: UpdateOrderBodyType & { orderId: number }) =>
			orderApis.updateOrder(orderId, data),
	});
	const orderDetail = data?.payload.data;

	useEffect(() => {
		if (orderDetail) {
			const {
				status,
				dishSnapshot: { dishId },
				quantity,
			} = orderDetail;
			setSelectedDish(orderDetail.dishSnapshot);
			form.reset({
				status,
				dishId: dishId ?? 0,
				quantity,
			});
		}
	}, [orderDetail, form]);

	const onSubmit = async (values: UpdateOrderBodyType) => {
		try {
			const body = {
				...values,
				orderId: id as number,
			};
			await updateOrderMutation.mutateAsync(body);
			onSubmitSuccess?.();
			reset();
		} catch (error) {
			handleErrorApi({ error: error });
		}
	};

	const reset = () => {
		setId(undefined);
	};

	return (
		<Dialog
			open={Boolean(id)}
			onOpenChange={(value) => {
				if (!value) {
					reset();
				}
			}}
		>
			<DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
				<DialogHeader>
					<DialogTitle>Cập nhật đơn hàng</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						noValidate
						className="grid auto-rows-max items-start gap-4 md:gap-8"
						id="edit-order-form"
						onSubmit={form.handleSubmit(onSubmit, console.log)}
					>
						<div className="grid gap-4 py-4">
							<FormField
								control={form.control}
								name="dishId"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center justify-items-start gap-4">
										<FormLabel>Món ăn</FormLabel>
										<div className="flex items-center col-span-2 space-x-4">
											<Avatar className="aspect-square w-[50px] h-[50px] rounded-md object-cover">
												<AvatarImage
													src={selectedDish?.image}
												/>
												<AvatarFallback className="rounded-none">
													{selectedDish?.name}
												</AvatarFallback>
											</Avatar>
											<div>{selectedDish?.name}</div>
										</div>

										<DishesDialog
											onChoose={(dish) => {
												field.onChange(dish.id);
												setSelectedDish(dish);
											}}
										/>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="quantity"
								render={({ field }) => (
									<FormItem>
										<div className="grid grid-cols-4 items-center justify-items-start gap-4">
											<Label htmlFor="quantity">
												Số lượng
											</Label>
											<div className="col-span-3 w-full space-y-2">
												<Input
													id="quantity"
													inputMode="numeric"
													pattern="[0-9]*"
													className="w-16 text-center"
													{...field}
													value={field.value}
													onChange={(e) => {
														const value =
															e.target.value;
														const numberValue =
															Number(value);
														if (
															isNaN(numberValue)
														) {
															return;
														}
														field.onChange(
															numberValue
														);
													}}
												/>
												<FormMessage />
											</div>
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<div className="grid grid-cols-4 items-center justify-items-start gap-4">
											<FormLabel>Trạng thái</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl className="col-span-3">
													<SelectTrigger className="w-[200px]">
														<SelectValue placeholder="Trạng thái" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{OrderStatusValues.map(
														(status) => (
															<SelectItem
																key={status}
																value={status}
															>
																{getVietnameseOrderStatus(
																	status
																)}
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
						</div>
					</form>
				</Form>
				<DialogFooter>
					<Button type="submit" form="edit-order-form">
						Lưu
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
