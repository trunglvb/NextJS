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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { getTableLink, getVietnameseTableStatus } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	UpdateTableBody,
	UpdateTableBodyType,
} from "@/schemaValidations/table.schema";
import { TableStatus, TableStatusValues } from "@/constants/type";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tableApiRequests } from "@/apiRequests/tables";
import { useEffect } from "react";
import QRCodeTable from "@/components/qrcode-table";
import { toast } from "sonner";

export default function EditTable({
	id,
	setId,
}: {
	id?: number | undefined;
	setId: (value: number | undefined) => void;
	onSubmitSuccess?: () => void;
}) {
	const queryClient = useQueryClient();
	const form = useForm<UpdateTableBodyType>({
		resolver: zodResolver(UpdateTableBody),
		defaultValues: {
			capacity: 2,
			status: TableStatus.Hidden,
			changeToken: false,
		},
	});

	const { data } = useQuery({
		queryKey: ["tables", id],
		queryFn: () => tableApiRequests.details(id as number),
		enabled: Boolean(id),
	});

	const tableDetails = data?.payload.data;

	useEffect(() => {
		if (tableDetails) {
			form.reset({
				capacity: tableDetails.capacity,
				status: tableDetails.status,
				changeToken: form.getValues("changeToken"),
			});
		}
	}, [form, tableDetails]);

	const handleUpdate = useMutation({
		mutationFn: (data: UpdateTableBodyType) =>
			tableApiRequests.update(data, id as number),
		onSuccess: (res) => {
			reset();
			toast.success(res.payload.message);
			queryClient.invalidateQueries({ queryKey: ["tables"] });
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		handleUpdate.mutate(data);
	});

	const reset = () => {
		setId(undefined);
		form.reset();
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
			<DialogContent
				className="sm:max-w-[600px] max-h-screen overflow-auto"
				onCloseAutoFocus={() => {
					reset();
				}}
			>
				<DialogHeader>
					<DialogTitle>Cập nhật bàn ăn</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						noValidate
						className="grid auto-rows-max items-start gap-4 md:gap-8"
						id="edit-table-form"
						onSubmit={onSubmit}
					>
						<div className="grid gap-4 py-4">
							<FormItem>
								<div className="grid grid-cols-4 items-center justify-items-start gap-4">
									<Label htmlFor="name">Số hiệu bàn</Label>
									<div className="col-span-3 w-full space-y-2">
										<Input
											id="number"
											type="number"
											className="w-full"
											value={tableDetails?.number || 0}
											readOnly
										/>
										<FormMessage />
									</div>
								</div>
							</FormItem>
							<FormField
								control={form.control}
								name="capacity"
								render={({ field }) => (
									<FormItem>
										<div className="grid grid-cols-4 items-center justify-items-start gap-4">
											<Label htmlFor="price">
												Sức chứa (người)
											</Label>
											<div className="col-span-3 w-full space-y-2">
												<Input
													id="capacity"
													className="w-full"
													{...field}
													type="number"
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
											<Label htmlFor="description">
												Trạng thái
											</Label>
											<div className="col-span-3 w-full space-y-2">
												<Select
													onValueChange={
														field.onChange
													}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Chọn trạng thái" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{TableStatusValues.map(
															(status) => (
																<SelectItem
																	key={status}
																	value={
																		status
																	}
																>
																	{getVietnameseTableStatus(
																		status
																	)}
																</SelectItem>
															)
														)}
													</SelectContent>
												</Select>
											</div>

											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="changeToken"
								render={({ field }) => (
									<FormItem>
										<div className="grid grid-cols-4 items-center justify-items-start gap-4">
											<Label htmlFor="price">
												Đổi QR Code
											</Label>
											<div className="col-span-3 w-full space-y-2">
												<div className="flex items-center space-x-2">
													<Switch
														id="changeToken"
														checked={field.value}
														onCheckedChange={
															field.onChange
														}
													/>
												</div>
											</div>

											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<FormItem>
								<div className="grid grid-cols-4 items-center justify-items-start gap-4">
									<Label>QR Code</Label>
									<div className="col-span-3 w-full space-y-2">
										<QRCodeTable
											token={
												tableDetails?.token as string
											}
											tableNumber={
												tableDetails?.number as number
											}
										/>
									</div>
								</div>
							</FormItem>
							<FormItem>
								<div className="grid grid-cols-4 items-center justify-items-start gap-4">
									<Label>URL gọi món</Label>
									<div className="col-span-3 w-full space-y-2">
										<Link
											href={getTableLink({
												token: tableDetails?.token as string,
												tableNumber:
													tableDetails?.number as number,
											})}
											target="_blank"
											className="break-all"
										>
											{getTableLink({
												token: tableDetails?.token as string,
												tableNumber:
													tableDetails?.number as number,
											})}
										</Link>
									</div>
								</div>
							</FormItem>
						</div>
					</form>
				</Form>
				<DialogFooter>
					<Button type="submit" form="edit-table-form">
						Lưu
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
