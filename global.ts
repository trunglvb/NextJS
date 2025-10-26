/* eslint-disable @typescript-eslint/no-unused-vars */
// Potentially imported from a shared config
const locales = ["en", "vi"] as const;
import messages from "./messages/en.json";

declare module "next-intl" {
	interface AppConfig {
		// ...
		Locale: (typeof locales)[number];
		Messages: typeof messages;
	}
}
