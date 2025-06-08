"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import {
	UpdateMeBody,
	UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mediaRequests } from "@/apiRequests/media";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import accountApiRequests from "@/apiRequests/account";

export default function UpdateProfileForm() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const form = useForm<UpdateMeBodyType>({
		resolver: zodResolver(UpdateMeBody),
		defaultValues: {
			name: "",
			avatar: undefined,
		},
	});
	const { data: profileData } = useQuery({
		queryKey: ["account-me"],
		queryFn: accountApiRequests.getMe,
	});
	const profile = profileData?.payload?.data;

	useEffect(() => {
		if (profile) {
			form.reset({
				name: profile.name,
				avatar: profile.avatar as string,
			});
		}
	}, [profile, form]);

	const [file, setFile] = useState<File | null>(null);

	const uploadMutatuion = useMutation({
		mutationFn: mediaRequests.upload,
	});

	const avatar = form.watch("avatar");
	const previewImage = file ? URL.createObjectURL(file) : avatar;

	const handleUploadFile = () => {
		fileInputRef?.current?.click();
	};

	const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		let imageUrl = avatar;
		if (file) {
			setFile(file);
			const formData = new FormData();
			formData.append("file", file);
			const fileResponse = await uploadMutatuion.mutateAsync(formData);
			imageUrl = fileResponse.payload?.data;
		}
	};

	const handleUploadSameImageError = (
		event: React.MouseEvent<HTMLInputElement, MouseEvent>
	) => {
		(event.target as any).value = null;
	};

	return (
		<Form {...form}>
			<form
				noValidate
				className="grid auto-rows-max items-start gap-4 md:gap-8"
			>
				<Card x-chunk="dashboard-07-chunk-0">
					<CardHeader>
						<CardTitle>Thông tin cá nhân</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-6">
							<FormField
								control={form.control}
								name="avatar"
								render={({ field }) => (
									<FormItem>
										<div className="flex gap-2 items-start justify-start">
											<Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
												<AvatarImage
													src={previewImage}
												/>
												<AvatarFallback className="rounded-none">
													{form.watch("name")}
												</AvatarFallback>
											</Avatar>
											<input
												type="file"
												accept="image/*"
												className="hidden"
												ref={fileInputRef}
												onChange={onFileChange}
												onClick={
													handleUploadSameImageError
												}
											/>
											<button
												className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
												type="button"
												onClick={handleUploadFile}
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
										<div className="grid gap-3">
											<Label htmlFor="name">Tên</Label>
											<Input
												id="name"
												type="text"
												className="w-full"
												{...field}
											/>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<div className=" items-center gap-2 md:ml-auto flex">
								<Button
									variant="outline"
									size="sm"
									type="reset"
								>
									Hủy
								</Button>
								<Button size="sm" type="submit">
									Lưu thông tin
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</form>
		</Form>
	);
}
