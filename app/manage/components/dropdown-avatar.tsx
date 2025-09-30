"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import authApiRequests from "@/apiRequests/auth";
import accountApiRequests from "@/apiRequests/account";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppContext } from "@/components/app-provider";

export default function DropdownAvatar() {
	const { setRole, setSocket, socket } = useAppContext();
	const router = useRouter();
	const { data } = useQuery({
		queryKey: ["account-me"],
		queryFn: accountApiRequests.getMe,
	});
	const loginMutation = useMutation({
		mutationFn: authApiRequests.logout,
	});

	const account = data?.payload.data;

	const handleLogout = async () => {
		await loginMutation.mutateAsync({
			refreshToken: localStorage.getItem("refreshToken") as string,
		});
		socket?.disconnect();
		setRole(undefined);
		setSocket(undefined);
		toast.success("Đăng xuất thành công");
		router.push("/");
		// clearLocalStorage(); config tai http.ts
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="overflow-hidden rounded-full"
				>
					<Avatar>
						<AvatarImage
							src={account?.avatar as string}
							alt={account?.name}
						/>
						<AvatarFallback>
							{account?.name.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>{account?.name}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href={"/manage/setting"} className="cursor-pointer">
						Cài đặt
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout}>
					Đăng xuất
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
