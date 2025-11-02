import GuestLoginForm from "@/app/[locale]/(public)/tables/[number]/guest-login-form";
import { Suspense } from "react";

export default function TableNumberPage() {
	return (
		<Suspense>
			<GuestLoginForm />
		</Suspense>
	);
}
