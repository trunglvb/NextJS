"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createContext, useContext, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatCurrency, getVietnameseDishStatus } from "@/lib/utils";
import { DishListResType } from "@/schemaValidations/dish.schema";
import EditDish from "@/app/manage/dishes/edit-dish";
import AddDish from "@/app/manage/dishes/add-dish";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dishApiRequests from "@/apiRequests/dish";
import { toast } from "sonner";
import DataTable from "@/components/table";

type DishItem = DishListResType["data"][0];

const DishTableContext = createContext<{
	setDishIdEdit: (value: number) => void;
	dishIdEdit: number | undefined;
	dishDelete: DishItem | null;
	setDishDelete: (value: DishItem | null) => void;
}>({
	setDishIdEdit: (value: number | undefined) => {},
	dishIdEdit: undefined,
	dishDelete: null,
	setDishDelete: (value: DishItem | null) => {},
});

export const columns: ColumnDef<DishItem>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "image",
		header: "Ảnh",
		cell: ({ row }) => (
			<div>
				<Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
					<AvatarImage src={row.getValue("image")} />
					<AvatarFallback className="rounded-none">
						{row.original.name}
					</AvatarFallback>
				</Avatar>
			</div>
		),
	},
	{
		accessorKey: "name",
		header: "Tên",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("name")}</div>
		),
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
		accessorKey: "description",
		header: "Mô tả",
		cell: ({ row }) => (
			<div
				dangerouslySetInnerHTML={{
					__html: row.getValue("description"),
				}}
				className="whitespace-pre-line"
			/>
		),
	},
	{
		accessorKey: "status",
		header: "Trạng thái",
		cell: ({ row }) => (
			<div>{getVietnameseDishStatus(row.getValue("status"))}</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: function Actions({ row }) {
			const { setDishIdEdit, setDishDelete } =
				useContext(DishTableContext);
			const openEditDish = () => {
				setDishIdEdit(row.original.id);
			};

			const openDeleteDish = () => {
				setDishDelete(row.original);
			};
			return (
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<DotsHorizontalIcon className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={openEditDish}>
							Sửa
						</DropdownMenuItem>
						<DropdownMenuItem onClick={openDeleteDish}>
							Xóa
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

function AlertDialogDeleteDish({
	dishDelete,
	setDishDelete,
}: {
	dishDelete: DishItem | null;
	setDishDelete: (value: DishItem | null) => void;
}) {
	const queryClient = useQueryClient();
	const deleteDishMutation = useMutation({
		mutationFn: dishApiRequests.delete,
		onSuccess: () => {
			setDishDelete(null);
			queryClient.invalidateQueries({ queryKey: ["dishes"] });
		},
	});
	const handleDeleteEmployee = async () => {
		if (!dishDelete) return;
		const res = await deleteDishMutation.mutateAsync(dishDelete.id);
		toast.success(res?.payload.message);
	};
	return (
		<AlertDialog
			open={Boolean(dishDelete)}
			onOpenChange={(value) => {
				if (!value) {
					setDishDelete(null);
				}
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Xóa món ăn?</AlertDialogTitle>
					<AlertDialogDescription>
						Món{" "}
						<span className="bg-foreground text-primary-foreground rounded px-1">
							{dishDelete?.name}
						</span>{" "}
						sẽ bị xóa vĩnh viễn
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDeleteEmployee}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default function DishTable() {
	const [dishIdEdit, setDishIdEdit] = useState<number | undefined>();
	const [dishDelete, setDishDelete] = useState<DishItem | null>(null);

	const { data: dishes } = useQuery({
		queryKey: ["dishes"],
		queryFn: dishApiRequests.list,
	});

	return (
		<DishTableContext.Provider
			value={{ dishIdEdit, setDishIdEdit, dishDelete, setDishDelete }}
		>
			<div className="w-full">
				<EditDish id={dishIdEdit} setId={setDishIdEdit} />
				<AlertDialogDeleteDish
					dishDelete={dishDelete}
					setDishDelete={setDishDelete}
				/>
				<DataTable
					data={dishes?.payload.data || []}
					columns={columns}
					pathname="/manage/dishes"
					AddComponent={AddDish}
				/>
			</div>
		</DishTableContext.Provider>
	);
}
