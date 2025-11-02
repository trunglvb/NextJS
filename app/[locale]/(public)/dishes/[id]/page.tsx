/* eslint-disable @typescript-eslint/no-unused-vars */
import dishApiRequests from "@/apiRequests/dish";
import { DishResType } from "@/schemaValidations/dish.schema";
import DishDetails from "@/app/[locale]/(public)/dishes/[id]/dish-details";

export default async function DishPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	let dish: DishResType["data"];
	try {
		const res = await dishApiRequests.get(Number(id));
		dish = res.payload?.data;
	} catch (error) {
		return <div>Something went wrong</div>;
	}

	return <DishDetails dish={dish} />;
}
