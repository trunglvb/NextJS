import DropdownAvatar from "@/app/[locale]/manage/components/dropdown-avatar";
import { AppSidebar } from "@/components/app-sidebar";
import DarkModeToggle from "@/components/dark-mode-toggle";
import LocaleSwitcherSelect from "@/components/locale-switcher";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import menuItems from "@/constants/menu";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar items={menuItems} />
			<SidebarInset>
				<header className="flex justify-between shrink-0 items-center gap-2 border-b px-4 py-2">
					<SidebarTrigger />
					<div className="flex gap-2">
						<DarkModeToggle />
						<DropdownAvatar />
						<LocaleSwitcherSelect />
					</div>
				</header>
				<div className="my-4">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
