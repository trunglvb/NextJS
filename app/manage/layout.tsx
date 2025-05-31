import DropdownAvatar from "@/app/manage/dropdown-avatar";
import { AppSidebar } from "@/components/app-sidebar";
import DarkModeToggle from "@/components/dark-mode-toggle";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex justify-between shrink-0 items-center gap-2 border-b px-4 py-2">
					<SidebarTrigger />
					<div className="flex gap-2">
						<DarkModeToggle />
						<DropdownAvatar />
					</div>
				</header>
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
