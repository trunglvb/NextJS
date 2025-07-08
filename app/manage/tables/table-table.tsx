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
import { getTableLink, getVietnameseTableStatus } from "@/lib/utils";
import { TableListResType } from "@/schemaValidations/table.schema";
import EditTable from "@/app/manage/tables/edit-table";
import AddTable from "@/app/manage/tables/add-table";
import DataTable from "@/components/table";
import { useQuery } from "@tanstack/react-query";
import { tableApiRequests } from "@/apiRequests/tables";
import QRCodeTable from "@/components/qrcode-table";

type TableItem = TableListResType["data"][0];

const TableTableContext = createContext<{
	setTableIdEdit: (value: number) => void;
	tableIdEdit: number | undefined;
	tableDelete: TableItem | null;
	setTableDelete: (value: TableItem | null) => void;
}>({
	setTableIdEdit: (value: number | undefined) => {},
	tableIdEdit: undefined,
	tableDelete: null,
	setTableDelete: (value: TableItem | null) => {},
});

export const columns: ColumnDef<TableItem>[] = [
	{
		accessorKey: "number",
		header: "Số bàn",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("number")}</div>
		),
	},
	{
		accessorKey: "capacity",
		header: "Sức chứa",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("capacity")}</div>
		),
	},
	{
		accessorKey: "status",
		header: "Trạng thái",
		cell: ({ row }) => (
			<div>{getVietnameseTableStatus(row.getValue("status"))}</div>
		),
	},
	{
		accessorKey: "token",
		header: "QR Code",
		cell: ({ row }) => (
			<div>
				<QRCodeTable
					token={row.getValue("token")}
					tableNumber={row.getValue("number")}
				/>
			</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: function Actions({ row }) {
			const { setTableIdEdit, setTableDelete } =
				useContext(TableTableContext);
			const openEditTable = () => {
				setTableIdEdit(row.original.number);
			};

			const openDeleteTable = () => {
				setTableDelete(row.original);
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
						<DropdownMenuItem onClick={openEditTable}>
							Sửa
						</DropdownMenuItem>
						<DropdownMenuItem onClick={openDeleteTable}>
							Xóa
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

function AlertDialogDeleteTable({
	tableDelete,
	setTableDelete,
}: {
	tableDelete: TableItem | null;
	setTableDelete: (value: TableItem | null) => void;
}) {
	return (
		<AlertDialog
			open={Boolean(tableDelete)}
			onOpenChange={(value) => {
				if (!value) {
					setTableDelete(null);
				}
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Xóa bàn ăn?</AlertDialogTitle>
					<AlertDialogDescription>
						Bàn{" "}
						<span className="bg-foreground text-primary-foreground rounded px-1">
							{tableDelete?.number}
						</span>{" "}
						sẽ bị xóa vĩnh viễn
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default function TableTable() {
	// const params = Object.fromEntries(searchParam.entries())
	const [tableIdEdit, setTableIdEdit] = useState<number | undefined>();
	const [tableDelete, setTableDelete] = useState<TableItem | null>(null);

	const { data: tables } = useQuery({
		queryKey: ["tables"],
		queryFn: tableApiRequests.list,
	});

	return (
		<TableTableContext.Provider
			value={{ tableIdEdit, setTableIdEdit, tableDelete, setTableDelete }}
		>
			<div className="w-full">
				<EditTable id={tableIdEdit} setId={setTableIdEdit} />
				<AlertDialogDeleteTable
					tableDelete={tableDelete}
					setTableDelete={setTableDelete}
				/>
				<DataTable
					searchable
					searchKey="number"
					searchPlaceholder="Lọc số bàn"
					data={tables?.payload.data || []}
					columns={columns}
					pathname="/manage/tables"
					AddComponent={AddTable}
				/>
			</div>
		</TableTableContext.Provider>
	);
}
