/* eslint-disable @typescript-eslint/no-unused-vars */
import dishApiRequests from "@/apiRequests/dish";
import { DishResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DishDetails({
	dish,
}: {
	dish: DishResType["data"];
}) {
	return (
		<div className="flex justify-center p-6">
			<Card className="max-w-2xl w-full">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						{dish.name}
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="w-full aspect-video relative overflow-hidden rounded-lg">
						<Image
							src={dish.image}
							alt={dish.name}
							fill
							className="object-cover"
						/>
					</div>

					<div>
						<p className="text-gray-700">{dish.description}</p>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-lg font-semibold text-green-600">
							{dish.price.toLocaleString("vi-VN")} ₫
						</span>

						<Badge
							variant={
								dish.status === "Available"
									? "default"
									: "secondary"
							}
						>
							{dish.status}
						</Badge>
					</div>

					<div className="text-sm text-gray-500 space-y-1">
						<p>
							Created at:{" "}
							{new Date(dish.createdAt).toLocaleString("vi-VN")}
						</p>
						<p>
							Updated at:{" "}
							{new Date(dish.updatedAt).toLocaleString("vi-VN")}
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
