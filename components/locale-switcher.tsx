"use client";

import { Suspense, useTransition } from "react";
import { Check, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/config";
import {
	useParams,
	usePathname,
	useSearchParams,
	useRouter,
} from "next/navigation";

type Props = {
	items?: Array<{ value: string; label: string }>;
};
function LocaleSwitcherDropdown(props: Props) {
	const i18n = useTranslations("SwitchLanguage");
	const locale = useLocale();
	const defaultItems = [
		{ value: "vi", label: i18n("vi") },
		{ value: "en", label: i18n("en") },
	];
	const [isPending, startTransition] = useTransition();
	const pathname = usePathname();
	const params = useParams();
	const router = useRouter();
	const searchParams = useSearchParams();

	const { items = defaultItems } = props;

	function onChange(value: string) {
		const nextLocale = value as Locale;
		startTransition(() => {
			const locale = params?.locale as Locale;
			const newPathName = pathname.replace(
				`/${locale}`,
				`/${nextLocale}`
			);
			const fullUrl = `${newPathName}?${searchParams.toString()}`;
			router.replace(fullUrl);
			router.refresh();
		});
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					disabled={isPending}
					className="relative"
				>
					<Languages className="h-[1.2rem] w-[1.2rem] text-slate-700 dark:text-slate-200" />
					<span className="sr-only">Change language</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				{items.map((item) => (
					<DropdownMenuItem
						key={item.value}
						onClick={() => onChange(item.value)}
						className="flex items-center justify-between"
					>
						<span>{item.label}</span>
						{locale === item.value && <Check className="h-4 w-4" />}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default function LocaleSwitcherMain() {
	return (
		<Suspense>
			<LocaleSwitcherDropdown />
		</Suspense>
	);
}
