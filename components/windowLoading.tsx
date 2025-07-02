"use client";
import {
	ClipLoader,
	BeatLoader,
	PulseLoader,
	RingLoader,
	ScaleLoader,
	HashLoader,
	GridLoader,
	BarLoader,
} from "react-spinners";
import { cn } from "@/lib/utils";

export type SpinnerType =
	| "clip"
	| "beat"
	| "pulse"
	| "ring"
	| "scale"
	| "hash"
	| "grid"
	| "bar";

interface WindowLoadingProps {
	isLoading: boolean;
	spinner?: SpinnerType;
	message?: string;
	size?: number | string;
	color?: string;
	fullScreen?: boolean;
	className?: string;
	overlayOpacity?: number;
	blurBackground?: boolean;
}

const spinnerComponents = {
	clip: ClipLoader,
	beat: BeatLoader,
	pulse: PulseLoader,
	ring: RingLoader,
	scale: ScaleLoader,
	hash: HashLoader,
	grid: GridLoader,
	bar: BarLoader,
};

export function WindowLoading({
	isLoading,
	spinner = "ring",
	message = "Loading...",
	size = 50,
	color = "#3b82f6",
	fullScreen = true,
	className,
	overlayOpacity = 0.5,
	blurBackground = false,
}: WindowLoadingProps) {
	if (!isLoading) return null;

	const SpinnerComponent = spinnerComponents[spinner];

	const overlayClasses = cn(
		"flex flex-col items-center justify-center gap-4 z-50",
		fullScreen ? "fixed inset-0" : "absolute inset-0",
		blurBackground ? "backdrop-blur-sm" : "",
		className
	);

	const overlayStyle = {
		backgroundColor: `rgba(255, 255, 255, ${overlayOpacity})`,
	};

	return (
		<div className={overlayClasses} style={overlayStyle}>
			<div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-white shadow-lg border min-w-[300px]">
				<SpinnerComponent
					size={size}
					color={color}
					loading={isLoading}
				/>
				{message && (
					<p className="text-sm font-medium text-gray-700 text-center">
						{message}
					</p>
				)}
			</div>
		</div>
	);
}
