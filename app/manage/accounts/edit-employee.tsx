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
import {
	UpdateEmployeeAccountBody,
	UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import accountApiRequests from "@/apiRequests/account";
import { toast } from "sonner";
import { mediaRequests } from "@/apiRequests/media";
import { handleErrorApi } from "@/lib/utils";

export default function EditEmployee({
	id,
	setId,
}: {
	id?: number | undefined;
	setId: (value: number | undefined) => void;
}) {
	const queryClient = useQueryClient();
	const [file, setFile] = useState<File | null>(null);
	const avatarInputRef = useRef<HTMLInputElement | null>(null);
	const form = useForm<UpdateEmployeeAccountBodyType>({
		resolver: zodResolver(UpdateEmployeeAccountBody),
		defaultValues: {
			name: "",
			email: "",
			avatar: undefined,
			password: undefined,
			confirmPassword: undefined,
			changePassword: false,
		},
	});
	const avatar = form.watch("avatar");
	const name = form.watch("name");
	const changePassword = form.watch("changePassword");
	const previewAvatarFromFile = file ? URL.createObjectURL(file) : avatar;

	const { data } = useQuery({
		queryKey: ["accounts", id],
		queryFn: () => accountApiRequests.getEmployeeDetail(id as number),
		enabled: Boolean(id),
	});

	const employee = data ? data?.payload?.data : null;

	useEffect(() => {
		if (employee) {
			form.reset({
				name: employee.name,
				email: employee.email,
				avatar: employee.avatar as string,
			});
		}
	}, [employee, form]);

	const updateEmployeeMutation = useMutation({
		mutationFn: (data: UpdateEmployeeAccountBodyType) =>
			accountApiRequests.editEmployee(id as number, data),
		onSuccess: (res) => {
			reset();
			queryClient.invalidateQueries({ queryKey: ["accounts"] });
			toast.success(res?.payload.message);
		},
	});

	const reset = () => {
		setFile(null);
		setId(undefined);
		form.reset();
	};

	const onSubmit = form.handleSubmit(
		async (data: UpdateEmployeeAccountBodyType) => {
			try {
				let imageUrl = avatar;
				if (file) {
					const formData = new FormData();
					formData.append("file", file);
					const fileResponse = await mediaRequests.upload(formData);
					imageUrl = fileResponse.payload?.data;
				}
				await updateEmployeeMutation.mutateAsync({
					name: data.name,
					email: data.email,
					avatar: imageUrl,
					changePassword: data.changePassword,
					password: data.password,
					confirmPassword: data.confirmPassword,
				});
			} catch (error) {
				handleErrorApi({ error: error, setError: form.setError });
			}
		}
	);

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
					<DialogTitle>Cập nhật tài khoản</DialogTitle>
					<DialogDescription>
						Các trường tên, email, mật khẩu là bắt buộc
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						noValidate
						className="grid auto-rows-max items-start gap-4 md:gap-8"
						id="edit-employee-form"
						onSubmit={onSubmit}
					>
						<div className="grid gap-4 py-4">
							<FormField
								control={form.control}
								name="avatar"
								render={({ field }) => (
									<FormItem>
										<div className="flex gap-2 items-start justify-start">
											<Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
												<AvatarImage
													src={previewAvatarFromFile}
												/>
												<AvatarFallback className="rounded-none">
													{name || "Avatar"}
												</AvatarFallback>
											</Avatar>
											<input
												type="file"
												accept="image/*"
												ref={avatarInputRef}
												onChange={(e) => {
													const file =
														e.target.files?.[0];
													if (file) {
														setFile(file);
														field.onChange(
															"http://localhost:3000/" +
																file.name
														);
													}
												}}
												className="hidden"
											/>
											<button
												className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
												type="button"
												onClick={() =>
													avatarInputRef.current?.click()
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
											<Label htmlFor="name">Tên</Label>
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
								name="email"
								render={({ field }) => (
									<FormItem>
										<div className="grid grid-cols-4 items-center justify-items-start gap-4">
											<Label htmlFor="email">Email</Label>
											<div className="col-span-3 w-full space-y-2">
												<Input
													id="email"
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
								name="changePassword"
								render={({ field }) => (
									<FormItem>
										<div className="grid grid-cols-4 items-center justify-items-start gap-4">
											<Label htmlFor="email">
												Đổi mật khẩu
											</Label>
											<div className="col-span-3 w-full space-y-2">
												<Switch
													checked={field.value}
													onCheckedChange={
														field.onChange
													}
												/>
												<FormMessage />
											</div>
										</div>
									</FormItem>
								)}
							/>
							{changePassword && (
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<div className="grid grid-cols-4 items-center justify-items-start gap-4">
												<Label htmlFor="password">
													Mật khẩu mới
												</Label>
												<div className="col-span-3 w-full space-y-2">
													<Input
														id="password"
														className="w-full"
														type="password"
														{...field}
													/>
													<FormMessage />
												</div>
											</div>
										</FormItem>
									)}
								/>
							)}
							{changePassword && (
								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<div className="grid grid-cols-4 items-center justify-items-start gap-4">
												<Label htmlFor="confirmPassword">
													Xác nhận mật khẩu mới
												</Label>
												<div className="col-span-3 w-full space-y-2">
													<Input
														id="confirmPassword"
														className="w-full"
														type="password"
														{...field}
													/>
													<FormMessage />
												</div>
											</div>
										</FormItem>
									)}
								/>
							)}
						</div>
					</form>
				</Form>
				<DialogFooter>
					<Button type="submit" form="edit-employee-form">
						Lưu
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
