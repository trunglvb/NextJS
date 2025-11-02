import LoginForm from "@/app/[locale]/(public)/(auth)/login/login-form";
import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

type Props = {
	params: Promise<{ locale: string }>;
};
export default async function Login({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale as Locale);

	return (
		<Suspense>
			<LoginForm />
		</Suspense>
	);
}
