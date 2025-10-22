"use client";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";

import { useState } from "react";
export default function Modal({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [open, setOpen] = useState(true);

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				setOpen(open);
				if (!open) router.back();
			}}
		>
			<DialogHeader>
				<DialogTitle></DialogTitle>
			</DialogHeader>
			<DialogContent className="max-h-full overflow-auto">
				{children}
			</DialogContent>
		</Dialog>
	);
}
