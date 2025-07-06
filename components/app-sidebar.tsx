"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Home,
	ShoppingCart,
	Table,
	Salad,
	LineChart,
	Users2,
} from "lucide-react";

const iconMap = {
	home: Home,
	cart: ShoppingCart,
	table: Table,
	salad: Salad,
	chart: LineChart,
	users: Users2,
};

export type IconKey = keyof typeof iconMap;

interface IMenuItems {
	title: string;
	icon: IconKey;
	href: string;
}
interface ISidebarProps {
	items: IMenuItems[];
}

export function AppSidebar({ items }: ISidebarProps) {
	const pathName = usePathname();

	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Quản lý quán ăn</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => {
								const Icon = iconMap[item.icon];
								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											isActive={item.href === pathName}
										>
											<Link href={item.href}>
												<Icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
