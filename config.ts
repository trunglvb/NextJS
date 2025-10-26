import { z } from "zod";

// Các biến không phải NEXT_PUBLIC_môi trường chỉ khả dụng trong môi trường Node.js, nghĩa là trình duyệt không thể truy cập chúng (máy khách chạy trong một môi trường khác ).

const configClientEnv = z.object({
	NEXT_PUBLIC_API_ENDPOINT: z.string(),
	NEXT_PUBLIC_URL: z.string(),
});

const clientEnv = configClientEnv.safeParse({
	NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
	NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
});

if (!clientEnv.success) {
	console.error(clientEnv.error.errors);
	throw new Error("Invalid environment variables");
}

const clientEnvConfig = clientEnv.data;
export { clientEnvConfig };

export type Locale = (typeof locales)[number];

export const locales = ["en", "vi"] as const;
export const defaultLocale: Locale = "vi";
