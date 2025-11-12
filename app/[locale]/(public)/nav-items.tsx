"use client";

import { useAppContext } from "@/components/app-provider";
import { Role } from "@/constants/type";
import { RoleType } from "@/types/jwt.types";
import { Link } from "@/i18n/navigation";

interface IMenuItems {
	title: string;
	href: string;
	role?: RoleType[];
	hideLogined?: boolean;
}

const menuItems: IMenuItems[] = [
	{
		title: "Trang chủ",
		href: "/",
	},
	{
		title: "Món ăn",
		href: "/guest/menu",
		role: [Role.Guest],
	},
	{
		title: "Đăng nhập",
		href: "/login",
		hideLogined: true,
	},
	{
		title: "Quản lý",
		href: "/manage/dashboard",
		role: [Role.Owner, Role.Employee],
	},
];

export default function NavItems({ className }: { className?: string }) {
	const { role } = useAppContext();
	return menuItems.map((item) => {
		const isAuth = role && item?.role && item.role.includes(role);
		const canshow = item.hideLogined && !role;

		if (isAuth || canshow) {
			return (
				<Link href={item.href} key={item.href} className={className}>
					{item.title}
				</Link>
			);
		}

		return null;
	});
}
