import type { NextConfig } from "next";

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
};

export default nextConfig;
