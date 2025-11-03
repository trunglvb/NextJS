"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	GuestLoginBodyType,
	GuestLoginBody,
} from "@/schemaValidations/guest.schema";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import guestApiRequests from "@/apiRequests/guest";
import { handleErrorApi, initSocket } from "@/lib/utils";
import { useAppContext } from "@/components/app-provider";
import { useRouter } from "@/i18n/navigation";
import SearchParamsLoader, {
	useSearchParamsLoader,
} from "@/components/searchParamsLoader";

export default function GuestLoginForm() {
	const { setRole, setSocket } = useAppContext();
	const router = useRouter();
	const { searchParams, setSearchParams } = useSearchParamsLoader();
	const params = useParams();
	const tableNumber = params?.number;
	const tableToken = searchParams?.get("token");

	const form = useForm<GuestLoginBodyType>({
		resolver: zodResolver(GuestLoginBody),
		defaultValues: {
			name: "",
			token: tableToken ?? "",
			tableNumber: Number(tableNumber),
		},
	});

	useEffect(() => {
		if (!tableToken) {
			router.push(`/`);
		}
	}, [tableToken, router]);

	const loginMutation = useMutation({
		mutationFn: guestApiRequests.login,
		onSuccess: (res) => {
			setRole(res.payload.data.guest.role);
			router.push("/guest/menu");
			setSocket(initSocket(res.payload.data.accessToken));
		},
		onError: (error) => {
			handleErrorApi({ error: error, setError: form.setError });
		},
	});

	const onSubmit = form.handleSubmit(async (data: GuestLoginBodyType) => {
		await loginMutation.mutateAsync(data);
	});

	return (
		<Card className="mx-auto max-w-sm">
			<SearchParamsLoader onParamsReceived={setSearchParams} />
			<CardHeader>
				<CardTitle className="text-2xl">Đăng nhập gọi món</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
						noValidate
						onSubmit={onSubmit}
					>
						<div className="grid gap-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<div className="grid gap-2">
											<Label htmlFor="name">
												Tên khách hàng
											</Label>
											<Input
												id="name"
												type="text"
												required
												{...field}
											/>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full">
								Đăng nhập
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
