"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import {
	ChangePasswordBody,
	ChangePasswordBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import accountApiRequests from "@/apiRequests/account";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/utils";

export default function ChangePasswordForm() {
	const form = useForm<ChangePasswordBodyType>({
		resolver: zodResolver(ChangePasswordBody),
		defaultValues: {
			oldPassword: "",
			password: "",
			confirmPassword: "",
		},
	});

	const changePasswordMutation = useMutation({
		mutationFn: accountApiRequests.changePassword,
	});

	const onSubmit = form.handleSubmit(async (data: ChangePasswordBodyType) => {
		try {
			const res = await changePasswordMutation.mutateAsync(data);
			toast.success(res.payload.message);
			form.reset();
		} catch (error) {
			handleErrorApi({ error: error, setError: form.setError });
		}
	});

	const onReset = () => {
		form.reset();
	};

	return (
		<Form {...form}>
			<form
				noValidate
				className="grid auto-rows-max items-start gap-4 md:gap-8"
				onReset={onReset}
				onSubmit={onSubmit}
			>
				<Card
					className="overflow-hidden"
					x-chunk="dashboard-07-chunk-4"
				>
					<CardHeader>
						<CardTitle>Đổi mật khẩu</CardTitle>
						{/* <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription> */}
					</CardHeader>
					<CardContent>
						<div className="grid gap-6">
							<FormField
								control={form.control}
								name="oldPassword"
								render={({ field }) => (
									<FormItem>
										<div className="grid gap-3">
											<Label htmlFor="oldPassword">
												Mật khẩu cũ
											</Label>
											<Input
												id="oldPassword"
												type="password"
												className="w-full"
												{...field}
											/>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<div className="grid gap-3">
											<Label htmlFor="password">
												Mật khẩu mới
											</Label>
											<Input
												id="password"
												type="password"
												className="w-full"
												{...field}
											/>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<div className="grid gap-3">
											<Label htmlFor="confirmPassword">
												Nhập lại mật khẩu mới
											</Label>
											<Input
												id="confirmPassword"
												type="password"
												className="w-full"
												{...field}
											/>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<div className=" items-center gap-2 md:ml-auto flex">
								<Button variant="outline" size="sm">
									Hủy
								</Button>
								<Button size="sm">Lưu thông tin</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</form>
		</Form>
	);
}
