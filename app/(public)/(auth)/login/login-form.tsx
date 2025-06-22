/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import authApiRequests from "@/apiRequests/auth";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "@/components/app-provider";

export default function LoginForm() {
	const { setIsAuth } = useAppContext();
	const searchParams = useSearchParams();
	const isClearTokens = searchParams.get("clearTokens");

	const form = useForm<LoginBodyType>({
		resolver: zodResolver(LoginBody),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		if (isClearTokens) {
			setIsAuth(false);
		}
	}, [isClearTokens, setIsAuth]);

	const loginMutation = useMutation({
		mutationFn: authApiRequests.login,
	});

	const onSubmit = form.handleSubmit(async (data: LoginBodyType) => {
		try {
			await loginMutation.mutateAsync(data);
			toast.success("Đăng nhập thành công");
			setIsAuth(true);
		} catch (error: any) {
			handleErrorApi({ error: error, setError: form.setError });
		}
	});

	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Đăng nhập</CardTitle>
				<CardDescription>
					Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
						noValidate
					>
						<div className="grid gap-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<div className="grid gap-2">
											<Label htmlFor="email">Email</Label>
											<Input
												id="email"
												type="email"
												placeholder="m@example.com"
												required
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
										<div className="grid gap-2">
											<div className="flex items-center">
												<Label htmlFor="password">
													Password
												</Label>
											</div>
											<Input
												id="password"
												type="password"
												required
												{...field}
											/>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								className="w-full cursor-pointer"
								onClick={onSubmit}
							>
								Đăng nhập
							</Button>
							<Button
								variant="outline"
								className="w-full cursor-pointer"
								type="button"
							>
								Đăng nhập bằng Google
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
