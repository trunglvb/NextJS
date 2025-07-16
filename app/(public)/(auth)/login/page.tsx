import LoginForm from "@/app/(public)/(auth)/login/login-form";
import { Suspense } from "react";

export default function Login() {
	return (
		<Suspense>
			<LoginForm />
		</Suspense>
	);
}
