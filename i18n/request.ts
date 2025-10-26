/* eslint-disable @typescript-eslint/no-unused-vars */
import { getUserLocale } from "@/services/locale";
import { getRequestConfig } from "next-intl/server";

const locales = ["en", "vi"] as const;
export default getRequestConfig(async () => {
	// Static for now, we'll change this later
	//gia tri locale co the lay tu cookie
	const locale = (await getUserLocale()) as (typeof locales)[number];
	return {
		locale,
		messages: (await import(`../messages/${locale}.json`)).default,
	};
});
