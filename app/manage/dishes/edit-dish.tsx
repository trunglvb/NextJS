"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getVietnameseDishStatus, handleErrorApi } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	UpdateDishBody,
	UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";
import { DishStatus, DishStatusValues } from "@/constants/type";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dishApiRequests from "@/apiRequests/dish";
import { toast } from "sonner";
import { mediaRequests } from "@/apiRequests/media";

export default function EditDish({
	id,
	setId,
	onSubmitSuccess,
}: {
	id?: number | undefined;
	setId: (value: number | undefined) => void;
	onSubmitSuccess?: () => void;
}) {
	const queryClient = useQueryClient();
	const [file, setFile] = useState<File | null>(null);
	const imageInputRef = useRef<HTMLInputElement | null>(null);
	const form = useForm<UpdateDishBodyType>({
		resolver: zodResolver(UpdateDishBody),
		defaultValues: {
			name: "",
			description: "",
			price: 0,
			image: undefined,
			status: DishStatus.Unavailable,
		},
	});
	const image = form.watch("image");
	const name = form.watch("name");

	const previewAvatarFromFile = useMemo(() => {
		if (file) {
			return URL.createObjectURL(file);
		}
		return image;
	}, [file, image]);

	const { data } = useQuery({
		queryKey: ["dishes", id],
		queryFn: () => dishApiRequests.get(id as number),
		enabled: Boolean(id),
	});

	const dish = data ? data?.payload.data : null;

	useEffect(() => {
		if (dish) {
			form.reset({
				name: dish.name,
				description: dish.description,
				price: dish.price,
				image: dish.image!,
				status: dish.status,
			});
		}
	}, [dish, form]);

	const updateDishMutation = useMutation({
		mutationFn: (data: UpdateDishBodyType) =>
			dishApiRequests.update(id as number, data),
		onSuccess: (res) => {
			reset();
			onSubmitSuccess?.();
			toast.success(res.payload.message);
			queryClient.invalidateQueries({ queryKey: ["dishes"] });
		},
	});

	const onSubmit = form.handleSubmit(async (data: UpdateDishBodyType) => {
		try {
			let imageUrl = image;
			if (file) {
				const formData = new FormData();
				formData.append("file", file);
				const fileResponse = await mediaRequests.upload(formData);
				imageUrl = fileResponse.payload?.data;
			}
			await updateDishMutation.mutateAsync({
				...data,
				image: imageUrl,
			});
		} catch (error) {
			handleErrorApi({ error: error, setError: form.setError });
		}
	});

	const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		setFile(file!);
	};

	const reset = () => {
		setFile(null);
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
			<DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
				<DialogHeader>
					<DialogTitle>Cập nhật món ăn</DialogTitle>
					<DialogDescription>
						Các trường sau đây là bắ buộc: Tên, ảnh
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						noValidate
						className="grid auto-rows-max items-start gap-4 md:gap-8"
						id="edit-dish-form"
						onSubmit={onSubmit}
					>
						<div className="grid gap-4 py-4">
							<FormField
								control={form.control}
								name="image"
								render={({ field }) => (
									<FormItem>
										<div className="flex gap-2 items-start justify-start">
											<Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
												<AvatarImage
													src={previewAvatarFromFile!}
												/>
												<AvatarFallback className="rounded-none">
													{name || "Avatar"}
												</AvatarFallback>
											</Avatar>
											<input
												type="file"
												accept="image/*"
												ref={imageInputRef}
												onChange={(e) => {
													onFileChange(e);
													field.onChange(e);
												}}
												className="hidden"
											/>
											<button
												className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
												type="button"
												onClick={() =>
													imageInputRef.current?.click()
												}
											>
												<Upload className="h-4 w-4 text-muted-foreground" />
												<span className="sr-only">
													Upload
												</span>
											</button>
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<div className="grid grid-cols-4 items-center justify-items-start gap-4">
											<Label htmlFor="name">
												Tên món ăn
											</Label>
											<div className="col-span-3 w-full space-y-2">
												<Input
													id="name"
													className="w-full"
													{...field}
												/>
												<FormMessage />
											</div>
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<div className="grid grid-cols-4 items-center justify-items-start gap-4">
											<Label htmlFor="price">Giá</Label>
											<div className="col-span-3 w-full space-y-2">
												<Input
													id="price"
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
								name="description"
								render={({ field }) => (
									<FormItem>
										<div className="grid grid-cols-4 items-center justify-items-start gap-4">
											<Label htmlFor="description">
												Mô tả sản phẩm
											</Label>
											<div className="col-span-3 w-full space-y-2">
												<Textarea
													id="description"
													className="w-full"
													{...field}
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
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Chọn trạng thái" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{DishStatusValues.map(
															(status) => (
																<SelectItem
																	key={status}
																	value={
																		status
																	}
																>
																	{getVietnameseDishStatus(
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
						</div>
					</form>
				</Form>
				<DialogFooter>
					<Button type="submit" form="edit-dish-form">
						Lưu
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
