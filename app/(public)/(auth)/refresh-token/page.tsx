import RefreshTokenAuth from "@/app/(public)/(auth)/refresh-token/refresh-token";
import React, { Suspense } from "react";

const RefreshTokenPage = () => {
	return (
		<Suspense>
			<RefreshTokenAuth />
		</Suspense>
	);
};

export default RefreshTokenPage;
