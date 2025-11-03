/* eslint-disable @typescript-eslint/no-unused-vars */
import dishApiRequests from "@/apiRequests/dish";
import { DishResType } from "@/schemaValidations/dish.schema";
import DishDetails from "@/app/[locale]/(public)/dishes/[slug]/dish-details";
import { getIdFromSlugUrl } from "@/lib/utils";

export default async function DishPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	let dish: DishResType["data"];
	try {
		const res = await dishApiRequests.get(Number(getIdFromSlugUrl(slug)));
		dish = res.payload?.data;
	} catch (error) {
		return <div>Something went wrong</div>;
	}

	return <DishDetails dish={dish} />;
}
