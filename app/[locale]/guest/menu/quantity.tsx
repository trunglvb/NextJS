import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

export default function Quantity({
	onChange,
	value,
	isDisabled = false,
}: {
	onChange: (value: number) => void;
	value: number;
	isDisabled?: boolean;
}) {
	return (
		<div className="flex-shrink-0 ml-auto flex justify-center items-center">
			<Button
				className="h-6 w-6 p-0"
				disabled={value === 0}
				onClick={() => onChange(value - 1)}
			>
				<Minus className="w-3 h-3" />
			</Button>
			<Input
				type="text"
				inputMode="numeric"
				pattern="[0-9]*"
				className="h-6 p-1 w-8 text-center"
				value={value}
				onChange={(e) => {
					const value = e.target.value;
					const numberValue = Number(value);
					if (isNaN(numberValue)) {
						return;
					}
					onChange(numberValue);
				}}
			/>
			<Button
				className="h-6 w-6 p-0"
				onClick={() => onChange(value + 1)}
				disabled={isDisabled}
			>
				<Plus className="w-3 h-3" />
			</Button>
		</div>
	);
}
