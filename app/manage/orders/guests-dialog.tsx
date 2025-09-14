import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import AutoPagination from "@/components/pagination";
import { Suspense, useEffect, useState } from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	formatDateTimeToLocaleString,
	SearchField,
	simpleMatchText,
} from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { GetListGuestsResType } from "@/schemaValidations/account.schema";
import { endOfDay, format, startOfDay } from "date-fns";
import CustomTable from "@/components/table";
import { useQuery } from "@tanstack/react-query";
import accountApiRequests from "@/apiRequests/account";

type GuestItem = GetListGuestsResType["data"][0];

export const columns: ColumnDef<GuestItem>[] = [
	{
		accessorKey: "name",
		header: "Tên",
		cell: ({ row }) => (
			<div className="capitalize">
				{row.getValue("name")} | (#{row.original.id})
			</div>
		),
		filterFn: (row, columnId, filterValue: string) => {
			if (filterValue === undefined) return true;
			return simpleMatchText(
				row.original.name + String(row.original.id),
				String(filterValue)
			);
		},
	},
	{
		accessorKey: "tableNumber",
		header: "Số bàn",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("tableNumber")}</div>
		),
		filterFn: (row, columnId, filterValue: string) => {
			if (filterValue === undefined) return true;
			return simpleMatchText(
				String(row.original.tableNumber),
				String(filterValue)
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: () => <div>Tạo</div>,
		cell: ({ row }) => (
			<div className="flex items-center space-x-4 text-sm">
				{formatDateTimeToLocaleString(row.getValue("createdAt"))}
			</div>
		),
	},
];

const PAGE_SIZE = 10;
const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

export default function GuestsDialog({
	onChoose,
}: {
	onChoose: (guest: GuestItem) => void;
}) {
	const [open, setOpen] = useState(false);
	const [fromDate, setFromDate] = useState(initFromDate);
	const [toDate, setToDate] = useState(initToDate);

	const { data } = useQuery({
		queryKey: ["guests", fromDate, toDate],
		queryFn: () => accountApiRequests.getGuestsList({ fromDate, toDate }),
	});

	const choose = (guest: GuestItem) => {
		onChoose(guest);
		setOpen(false);
	};

	const resetDateFilter = () => {
		setFromDate(initFromDate);
		setToDate(initToDate);
	};

	const onRenderCustomFilter = () => {
		return (
			<div className="flex flex-wrap gap-2">
				<div className="flex items-center">
					<span className="mr-2">Từ</span>
					<Input
						type="datetime-local"
						placeholder="Từ ngày"
						className="text-sm"
						value={format(fromDate, "yyyy-MM-dd HH:mm").replace(
							" ",
							"T"
						)}
						onChange={(event) =>
							setFromDate(new Date(event.target.value))
						}
					/>
				</div>
				<div className="flex items-center">
					<span className="mr-2">Đến</span>
					<Input
						type="datetime-local"
						placeholder="Đến ngày"
						value={format(toDate, "yyyy-MM-dd HH:mm").replace(
							" ",
							"T"
						)}
						onChange={(event) =>
							setToDate(new Date(event.target.value))
						}
					/>
				</div>
				<Button
					className=""
					variant={"outline"}
					onClick={resetDateFilter}
				>
					Reset
				</Button>
			</div>
		);
	};

	const search: SearchField<GuestItem>[] = [
		{
			field: "name",
			type: "text",
			placeholder: "Tìm theo tên",
			width: "170px",
		},
		{
			field: "tableNumber",
			type: "text",
			placeholder: "Tìm theo số bàn",
			width: "200px",
		},
	];

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Chọn khách</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[700px] max-h-full overflow-auto">
				<DialogHeader>
					<DialogTitle>Chọn khách hàng</DialogTitle>
				</DialogHeader>
				<div>
					<div className="w-full">
						<Suspense>
							<CustomTable
								search={search}
								data={data?.payload.data}
								columns={columns}
								pathname="/manage/guests"
								customFilter={onRenderCustomFilter()}
								onRowEvent={choose}
							/>
						</Suspense>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
