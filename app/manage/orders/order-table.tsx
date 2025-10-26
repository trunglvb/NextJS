/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
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
import {
	CreateOrdersResType,
	GetOrdersResType,
	PayGuestOrdersResType,
	UpdateOrderBodyType,
	UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import AddOrder from "@/app/manage/orders/add-order";
import EditOrder from "@/app/manage/orders/edit-order";
import { createContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AutoPagination from "@/components/pagination";
import { getVietnameseOrderStatus, handleErrorApi } from "@/lib/utils";
import { OrderStatusValues } from "@/constants/type";
import OrderStatics from "@/app/manage/orders/order-statics";
import orderTableColumns from "@/app/manage/orders/order-table-columns";
import { useOrderService } from "@/app/manage/orders/order.service";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { endOfDay, format, startOfDay } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import orderApis from "@/apiRequests/order";
import { tableApiRequests } from "@/apiRequests/tables";
import { toast } from "sonner";
import { useAppContext } from "@/components/app-provider";

export const OrderTableContext = createContext({
	setOrderIdEdit: (value: number | undefined) => {},
	orderIdEdit: undefined as number | undefined,
	changeStatus: (payload: {
		orderId: number;
		dishId: number;
		status: (typeof OrderStatusValues)[number];
		quantity: number;
	}) => {},
	orderObjectByGuestId: {} as OrderObjectByGuestID,
});

export type StatusCountObject = Record<
	(typeof OrderStatusValues)[number],
	number
>;
export type Statics = {
	status: StatusCountObject;
	table: Record<number, Record<number, StatusCountObject>>;
};
export type OrderObjectByGuestID = Record<number, GetOrdersResType["data"]>;
export type ServingGuestByTableNumber = Record<number, OrderObjectByGuestID>;

const PAGE_SIZE = 10;
const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());
export default function OrderTable() {
	const { socket } = useAppContext();
	const searchParam = useSearchParams();
	const [openStatusFilter, setOpenStatusFilter] = useState(false);
	const [fromDate, setFromDate] = useState(initFromDate);
	const [toDate, setToDate] = useState(initToDate);
	const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
	const pageIndex = page - 1;
	const [orderIdEdit, setOrderIdEdit] = useState<number | undefined>();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [rowSelection, setRowSelection] = useState({});
	const [pagination, setPagination] = useState({
		pageIndex,
		pageSize: PAGE_SIZE,
	});

	const { data: orderData, refetch: refetchOrders } = useQuery({
		queryKey: ["orders", fromDate, toDate],
		queryFn: () => orderApis.getOrders({ fromDate, toDate }),
	});

	const { data: tableData } = useQuery({
		queryKey: ["tables"],
		queryFn: tableApiRequests.list,
	});

	useEffect(() => {
		if (socket?.connected) {
			onConnect();
		}

		function onConnect() {
			console.log(socket?.id);
		}

		function onDisconnect() {
			console.log("disconnect");
		}

		const refetch = () => {
			const now = new Date();
			if (now >= fromDate && now <= toDate) {
				refetchOrders();
			}
		};

		function onUpdateOrder(data: UpdateOrderResType["data"]) {
			toast.success(
				`Món ${
					data.dishSnapshot.name
				} đã được cập nhật sang trạng thái ${getVietnameseOrderStatus(
					data.status
				)}`
			);
			refetch();
		}

		function onPayment(data: PayGuestOrdersResType["data"]) {
			const { guest } = data[0];
			toast.success(
				`${guest?.name} tại bàn ${guest?.tableNumber} vừa thanh toán ${data.length} đơn`
			);
			refetch();
		}

		function onNewOrder(data: CreateOrdersResType["data"]) {
			const { guest } = data[0];
			toast.success(
				`${guest?.name} tại bàn ${guest?.tableNumber} vừa đặt ${data.length} đơn`
			);
			refetch();
		}

		socket?.on("connect", onConnect);
		socket?.on("disconnect", onDisconnect);
		socket?.on("new-order", onNewOrder);
		socket?.on("update-order", onUpdateOrder);
		socket?.on("payment", onPayment);

		return () => {
			socket?.off("connect", onConnect);
			socket?.off("disconnect", onDisconnect);
			socket?.off("new-order", onNewOrder);
			socket?.off("update-order", onUpdateOrder);
			socket?.off("payment", onPayment);
		};
	}, [refetchOrders]);

	const updateOrderMutation = useMutation({
		mutationKey: ["update-order"],
		mutationFn: ({
			orderId,
			...data
		}: UpdateOrderBodyType & { orderId: number }) =>
			orderApis.updateOrder(orderId, data),
	});

	const orderList = orderData?.payload.data ?? [];
	const tableList = tableData?.payload.data ?? [];

	const { statics, orderObjectByGuestId, servingGuestByTableNumber } =
		useOrderService(orderList);
	const tableListSortedByNumber = tableList.sort(
		(a, b) => a.number - b.number
	);

	const changeStatus = async (body: {
		orderId: number;
		dishId: number;
		status: (typeof OrderStatusValues)[number];
		quantity: number;
	}) => {
		try {
			await updateOrderMutation.mutateAsync(body);
		} catch (error) {
			handleErrorApi({ error: error });
		}
	};

	const table = useReactTable({
		data: orderList,
		columns: orderTableColumns,
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
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination,
		},
	});

	useEffect(() => {
		table.setPagination({
			pageIndex,
			pageSize: PAGE_SIZE,
		});
	}, [table, pageIndex]);

	const resetDateFilter = () => {
		setFromDate(initFromDate);
		setToDate(initToDate);
	};

	return (
		<OrderTableContext.Provider
			value={{
				orderIdEdit,
				setOrderIdEdit,
				changeStatus,
				orderObjectByGuestId,
			}}
		>
			<div className="w-full">
				<EditOrder
					id={orderIdEdit}
					setId={setOrderIdEdit}
					onSubmitSuccess={() => {}}
				/>
				<div className=" flex items-center">
					<div className="flex flex-wrap gap-2">
						<div className="flex items-center">
							<span className="mr-2">Từ</span>
							<Input
								type="datetime-local"
								placeholder="Từ ngày"
								className="text-sm"
								value={format(
									fromDate,
									"yyyy-MM-dd HH:mm"
								).replace(" ", "T")}
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
								value={format(
									toDate,
									"yyyy-MM-dd HH:mm"
								).replace(" ", "T")}
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
					<div className="ml-auto">
						<AddOrder />
					</div>
				</div>
				<div className="flex flex-wrap items-center gap-4 py-4">
					<Input
						placeholder="Tên khách"
						value={
							(table
								.getColumn("guestName")
								?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table
								.getColumn("guestName")
								?.setFilterValue(event.target.value)
						}
						className="max-w-[100px]"
					/>
					<Input
						placeholder="Số bàn"
						value={
							(table
								.getColumn("tableNumber")
								?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table
								.getColumn("tableNumber")
								?.setFilterValue(event.target.value)
						}
						className="max-w-[80px]"
					/>
					<Popover
						open={openStatusFilter}
						onOpenChange={setOpenStatusFilter}
					>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={openStatusFilter}
								className="w-[150px] text-sm justify-between"
							>
								{table.getColumn("status")?.getFilterValue()
									? getVietnameseOrderStatus(
											table
												.getColumn("status")
												?.getFilterValue() as (typeof OrderStatusValues)[number]
									  )
									: "Trạng thái"}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[200px] p-0">
							<Command>
								<CommandGroup>
									<CommandList>
										{OrderStatusValues.map((status) => (
											<CommandItem
												key={status}
												value={status}
												onSelect={(currentValue) => {
													table
														.getColumn("status")
														?.setFilterValue(
															currentValue ===
																table
																	.getColumn(
																		"status"
																	)
																	?.getFilterValue()
																? ""
																: currentValue
														);
													setOpenStatusFilter(false);
												}}
											>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														table
															.getColumn("status")
															?.getFilterValue() ===
															status
															? "opacity-100"
															: "opacity-0"
													)}
												/>
												{getVietnameseOrderStatus(
													status
												)}
											</CommandItem>
										))}
									</CommandList>
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
				</div>
				<OrderStatics
					statics={statics}
					tableList={tableListSortedByNumber}
					servingGuestByTableNumber={servingGuestByTableNumber}
				/>
				{/* <TableSkeleton /> */}
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
															header.column
																.columnDef
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
										colSpan={orderTableColumns.length}
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
						<strong>
							{table.getPaginationRowModel().rows.length}
						</strong>{" "}
						trong <strong>{orderList.length}</strong> kết quả
					</div>
					<div>
						<AutoPagination
							page={table.getState().pagination.pageIndex + 1}
							pageSize={table.getPageCount()}
							pathname="/manage/orders"
						/>
					</div>
				</div>
			</div>
		</OrderTableContext.Provider>
	);
}
