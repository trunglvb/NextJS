/* eslint-disable @typescript-eslint/no-unused-vars */
import dishApiRequests from "@/apiRequests/dish";
import { DishListResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "next-intl";
import { generateSlugUrl } from "@/lib/utils";

type Props = {
	params: Promise<{ locale: string }>;
};
export default async function Home({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale as Locale);
	let dishList: DishListResType["data"] = [];
	try {
		const res = await dishApiRequests.list();
		dishList = res.payload?.data;
	} catch (error) {
		return <div>Something went wrong</div>;
	}
	const i18n = await getTranslations("HomePage");

	return (
		<div className="w-full space-y-4">
			<div className="relative">
				<span className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></span>
				<Image
					src="/banner.png"
					width={400}
					height={200}
					quality={100}
					alt="Banner"
					className="absolute top-0 left-0 w-full h-full object-cover"
				/>
				<div className="z-10 relative py-10 md:py-20 px-4 sm:px-10 md:px-20">
					<h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold">
						{i18n("name")}
					</h1>
					<p className="text-center text-sm sm:text-base mt-4">
						Vị ngon, trọn khoảnh khắc
					</p>
				</div>
			</div>
			<section className="space-y-10 py-16">
				<h2 className="text-center text-2xl font-bold">
					Đa dạng các món ăn
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
					{dishList.map((item, index) => (
						<Link
							href={`/dishes/${generateSlugUrl({
								name: item.name,
								id: item.id,
							})}`}
							className="flex gap-4 w"
							key={index}
						>
							<div className="flex-shrink-0">
								<Image
									alt={item.name}
									src={item.image}
									width={150}
									height={150}
									quality={100}
									className="object-cover rounded-md"
								/>
							</div>
							<div className="space-y-1">
								<h3 className="text-xl font-semibold">
									{item.name}
								</h3>
								<p className="">{item.description}</p>
								<p className="font-semibold">{item.price}đ</p>
							</div>
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}
