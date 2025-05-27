"use client";
import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
	{
		title: "Món ăn",
		href: "/menu", //authRequired: undefined nghia la luon hien thi
	},
	{
		title: "Đơn hàng",
		href: "/orders",
		authRequired: true,
	},
	{
		title: "Đăng nhập",
		href: "/login",
		authRequired: false,
	},
	{
		title: "Quản lý",
		href: "/manage/dashboard",
		authRequired: true,
	},
];

export default function NavItems({ className }: { className?: string }) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(Boolean(getAccessTokenFromLocalStorage()));
	}, []);

	return menuItems.map((item) => {
		if (
			(item.authRequired === true && !isClient) ||
			(item.authRequired === false && isClient)
		) {
			return null;
		}
		return (
			<Link href={item.href} key={item.href} className={className}>
				{item.title}
			</Link>
		);
	});
}
