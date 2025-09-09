"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { DishListResType } from "@/schemaValidations/dish.schema";
import { Suspense, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
	formatCurrency,
	getVietnameseDishStatus,
	SearchField,
	simpleMatchText,
} from "@/lib/utils";
import Image from "next/image";
import CustomTable from "@/components/table";
import { useQuery } from "@tanstack/react-query";
import dishApiRequests from "@/apiRequests/dish";

type DishItem = DishListResType["data"][0];
export const columns: ColumnDef<DishItem>[] = [
	{
		id: "name",
		accessorKey: "name",
		header: "Món ăn",
		cell: ({ row }) => (
			<div className="flex items-center space-x-4">
				<Image
					src={row.original.image}
					alt={row.original.name}
					width={50}
					height={50}
					className="rounded-md object-cover w-[50px] h-[50px]"
				/>
				<span>{row.original.name}</span>
			</div>
		),
		filterFn: (row, columnId, filterValue: string) => {
			if (filterValue === undefined) return true;
			return simpleMatchText(
				String(row.original.name),
				String(filterValue)
			);
		},
	},
	{
		accessorKey: "price",
		header: "Giá cả",
		cell: ({ row }) => (
			<div className="capitalize">
				{formatCurrency(row.getValue("price"))}
			</div>
		),
	},
	{
		accessorKey: "status",
		header: "Trạng thái",
		cell: ({ row }) => (
			<div>{getVietnameseDishStatus(row.getValue("status"))}</div>
		),
	},
];

export function DishesDialog({
	onChoose,
}: {
	onChoose: (dish: DishItem) => void;
}) {
	const [open, setOpen] = useState(false);
	const { data: dishes } = useQuery({
		queryKey: ["dishes"],
		queryFn: dishApiRequests.list,
	});

	const choose = (dish: DishItem) => {
		onChoose(dish);
		setOpen(false);
	};

	const search: SearchField<DishItem>[] = [
		{
			field: "name",
			type: "text",
			placeholder: "Tìm theo tên",
		},
	];

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Thay đổi</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px] max-h-full overflow-auto">
				<DialogHeader>
					<DialogTitle>Chọn món ăn</DialogTitle>
				</DialogHeader>
				<div>
					<div className="w-full">
						<Suspense>
							<CustomTable
								search={search}
								data={dishes?.payload.data}
								columns={columns}
								pathname="/manage/dishes"
								onRowEvent={choose}
							/>
						</Suspense>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
