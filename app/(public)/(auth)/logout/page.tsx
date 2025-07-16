import LogoutPage from "@/app/(public)/(auth)/logout/logout";
import React, { Suspense } from "react";

const Logout = () => {
	return (
		<Suspense>
			<LogoutPage />
		</Suspense>
	);
};

export default Logout;
