import { IconKey } from "@/components/app-sidebar";

export interface IMenuItem {
	title: string;
	icon: IconKey;
	href: string;
}

const menuItems: IMenuItem[] = [
	{ title: "Trang chủ", icon: "home", href: "/" },
	{ title: "Đơn hàng", icon: "cart", href: "/manage/orders" },
	{ title: "Bàn ăn", icon: "table", href: "/manage/tables" },
	{ title: "Món ăn", icon: "salad", href: "/manage/dishes" },
	{ title: "Phân tích", icon: "chart", href: "/manage/analytics" },
	{ title: "Nhân viên", icon: "users", href: "/manage/accounts" },
];
export default menuItems;
