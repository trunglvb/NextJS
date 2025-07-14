/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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

import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ComponentType, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AutoPagination from "@/components/pagination";

interface DataTableProps<T> {
	data: T[];
	columns: ColumnDef<T>[];
	searchable?: boolean;
	searchPlaceholder?: string;
	AddComponent?: ComponentType<any>;
	pathname?: string;
	pageSize?: number;
	useRadio?: false;
	onChange?: (value: any) => void;
	searchKey?: keyof T;
}

export default function DataTable<T>({
	data = [],
	columns,
	searchable = false,
	searchPlaceholder = "Lọc tên",
	AddComponent,
	pathname = "",
	pageSize = 10,
	useRadio = false,
	searchKey,
	onChange,
}: DataTableProps<T>) {
	const searchParam = useSearchParams();
	const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
	const pageIndex = page - 1;
	const [search, setSearch] = useState("");
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [rowSelection, setRowSelection] = useState({});
	const [pagination, setPagination] = useState({
		pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
		pageSize: pageSize, //default page size
	});

	const table = useReactTable({
		data: data || [],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		autoResetPageIndex: false,
		enableMultiRowSelection: !useRadio,
		enableSubRowSelection: !useRadio,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination,
		},
	});

	const selectedRows = table
		.getFilteredSelectedRowModel()
		.flatRows.map((item) => item.original);

	useEffect(() => {
		table.setPagination({
			pageIndex,
			pageSize: pageSize,
		});
	}, [table, pageIndex, pageSize]);

	useEffect(() => {
		onChange?.(selectedRows);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rowSelection]);

	return (
		<div>
			<div className="flex items-center py-4">
				{searchable && (
					<Input
						placeholder={searchPlaceholder}
						value={search}
						onChange={(event) => {
							table
								?.getColumn(searchKey as string)
								?.setFilterValue(event.target.value);
							setSearch(event.target.value);
						}}
						//need define filterFn in columnDef if column value is not string
						className="max-w-sm"
					/>
				)}

				<div className="ml-auto flex items-center gap-2">
					{AddComponent && <AddComponent />}
				</div>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="text-xs text-muted-foreground py-4 flex-1 ">
					Hiển thị{" "}
					<strong>{table.getPaginationRowModel().rows.length}</strong>{" "}
					trong <strong>{data.length}</strong> kết quả
				</div>
				<div>
					<AutoPagination
						page={table.getState().pagination.pageIndex + 1}
						pageSize={table.getPageCount()}
						pathname={pathname}
					/>
				</div>
			</div>
		</div>
	);
}
