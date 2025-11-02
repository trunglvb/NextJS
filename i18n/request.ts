// import { locales } from "@/config";
// import { getUserLocale } from "@/services/locale";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// use for i18n without routing
// export default getRequestConfig(async () => {
// 	// Static for now, we'll change this later
// 	//gia tri locale co the lay tu cookie
// 	const locale = (await getUserLocale()) as (typeof locales)[number];
// 	return {
// 		locale,
// 		messages: (await import(`../messages/${locale}.json`)).default,
// 	};
// });

export default getRequestConfig(async ({ requestLocale }) => {
	// Typically corresponds to the `[locale]` segment
	const requested = await requestLocale;
	const locale = hasLocale(routing.locales, requested)
		? requested
		: routing.defaultLocale;

	return {
		locale,
		messages: (await import(`../messages/${locale}.json`)).default,
	};
});
