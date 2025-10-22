/* eslint-disable @typescript-eslint/no-unused-vars */
import dishApiRequests from "@/apiRequests/dish";
import { DishResType } from "@/schemaValidations/dish.schema";
import Modal from "@/app/(public)/@modal/(.)dishes/[id]/modal";
import DishDetails from "@/app/(public)/dishes/[id]/dish-details";

//(.) la 1 cấp
//(..) la 2 cấp, ví dụ tạo (..)dishes bên trong dishes (hoac route segment cấp 1 nào khác) dua vao route segment
//khai bao interepting route ở đâu thì những page ở level đó và con của nó sẽ bị chặn (nghĩa là navigate từ route này)

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

	return (
		<Modal>
			<DishDetails dish={dish} />
		</Modal>
	);
}
