import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({
	experimental: {
		// Provide the path to the messages that you're using in `AppConfig`
		createMessagesDeclaration: "./messages/en.json",
	},
	// ...
});

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		dangerouslyAllowSVG: true,
		contentSecurityPolicy:
			"default-src 'self'; script-src 'none'; sandbox;",
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "4000",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "placehold.co",
				pathname: "/**",
			},
		],
	},
	swcMinify: false,
	// webpack(config) {
	//   config.optimization.minimize = false; // ép không minify
	//   return config;
	// },
};

export default withNextIntl(nextConfig);
