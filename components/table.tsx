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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ComponentType, JSX, useEffect, useState } from "react";
import AutoPagination from "@/components/pagination";
import SearchParamsLoader, {
	useSearchParamsLoader,
} from "@/components/searchParamsLoader";

interface SearchField<T> {
	field: keyof T;
	type?: "text" | "select";
	width?: string;
	placeholder?: string;
	className?: string;
	options?: { label: string; value: string }[];
}

interface DataTableProps<T> {
	data?: T[];
	columns: ColumnDef<T>[];
	search?: SearchField<T>[];
	AddComponent?: ComponentType<any>;
	pathname?: string;
	pageSize?: number;
	useRadio?: boolean;
	onChange?: (value: any) => void;
	onRowEvent?: (value: any) => void;
	customFilter?: JSX.Element;
	renderTop?: JSX.Element;
	isLink?: boolean;
}

export default function CustomTable<T>({
	data = [],
	columns,
	search = [],
	AddComponent,
	pathname = "",
	pageSize = 10,
	useRadio = false,
	onChange,
	customFilter,
	onRowEvent,
	renderTop,
	isLink = true,
}: DataTableProps<T>) {
	const { searchParams, setSearchParams } = useSearchParamsLoader();
	const page = searchParams?.get("page")
		? Number(searchParams?.get("page"))
		: 1;
	const pageIndex = page - 1;
	const [searchValues, setSearchValues] = useState<Record<string, string>>(
		{}
	);
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
		if (isLink) {
			table.setPagination({
				pageIndex,
				pageSize: pageSize,
			});
		}
	}, [table, pageIndex, pageSize, isLink]);

	useEffect(() => {
		onChange?.(selectedRows);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rowSelection]);

	const handleSearchChange = (field: keyof T, value: string) => {
		setSearchValues((prev) => ({ ...prev, [field as string]: value }));
		table.getColumn(field as string)?.setFilterValue(value);
	};

	const handleSelectChange = (field: keyof T, value: string) => {
		const filterValue = value === "all" ? "" : value;
		setSearchValues((prev) => ({
			...prev,
			[field as string]: filterValue,
		}));
		table.getColumn(field as string)?.setFilterValue(filterValue);
	};

	const textSearchFields = search.filter(
		(field) => !field.type || field.type === "text"
	);
	const selectFilterFields = search.filter(
		(field) => field.type === "select"
	);

	const onPaginationClick = (pageNumber: number) => {
		if (!isLink) {
			table.setPagination({
				pageIndex: pageNumber - 1,
				pageSize: pageSize,
			});
		}
		return;
	};

	return (
		<div>
			{(textSearchFields.length > 0 || selectFilterFields.length > 0) && (
				<div className="flex items-start py-3 gap-4">
					<div className="flex-1" style={{ width: "60%" }}>
						{textSearchFields.length > 0 && (
							<div className="flex items-center gap-3 flex-wrap mb-3">
								{customFilter && <>{customFilter}</>}
								{textSearchFields.map((searchField, index) => (
									<Input
										key={index}
										placeholder={searchField.placeholder}
										value={
											searchValues[
												searchField.field as string
											] || ""
										}
										onChange={(event) => {
											handleSearchChange(
												searchField.field,
												event.target.value
											);
										}}
										className={
											searchField.width
												? `max-w-[${searchField.width}]`
												: "max-w-sm"
										}
									/>
								))}
							</div>
						)}
						{selectFilterFields.length > 0 && (
							<div className="flex items-center gap-3 flex-wrap">
								{selectFilterFields.map(
									(searchField, index) => (
										<Select
											key={index}
											value={
												searchValues[
													searchField.field as string
												] || "all"
											}
											onValueChange={(value) =>
												handleSelectChange(
													searchField.field,
													value
												)
											}
										>
											<SelectTrigger
												className={
													searchField.className ||
													"w-[140px]"
												}
											>
												<SelectValue
													placeholder={
														searchField.placeholder
													}
												/>
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">
													All{" "}
													{
														searchField.field as string
													}
												</SelectItem>
												{searchField.options?.map(
													(option) => (
														<SelectItem
															key={option.value}
															value={option.value}
														>
															{option.label}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									)
								)}
							</div>
						)}
					</div>
					{AddComponent && (
						<div
							className="flex items-center justify-end"
							style={{ width: "40%" }}
						>
							<AddComponent />
						</div>
					)}
				</div>
			)}

			{textSearchFields.length === 0 &&
				selectFilterFields.length === 0 &&
				AddComponent && (
					<div className="flex items-center justify-end py-3">
						<AddComponent />
					</div>
				)}
			{renderTop && <div>{renderTop}</div>}

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
									onClick={() => onRowEvent?.(row.original)}
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
						isLink={isLink}
						onClick={onPaginationClick}
					/>
				</div>
			</div>
			<SearchParamsLoader onParamsReceived={setSearchParams} />
		</div>
	);
}
