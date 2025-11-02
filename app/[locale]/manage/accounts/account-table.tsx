/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

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
import {
	AccountListResType,
	AccountType,
} from "@/schemaValidations/account.schema";
import AddEmployee from "@/app/[locale]/manage/accounts/add-employee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditEmployee from "@/app/[locale]/manage/accounts/edit-employee";
import { createContext, Suspense, useContext, useState } from "react";
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
import { MoreHorizontal, SortAscIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import accountApiRequests from "@/apiRequests/account";
import { toast } from "sonner";
import CustomTable from "@/components/table";
import { SearchField } from "@/lib/utils";

type AccountItem = AccountListResType["data"][0];

const AccountTableContext = createContext<{
	setEmployeeIdEdit: (value: number) => void;
	employeeIdEdit: number | undefined;
	employeeDelete: AccountItem | null;
	setEmployeeDelete: (value: AccountItem | null) => void;
}>({
	setEmployeeIdEdit: (value: number | undefined) => {},
	employeeIdEdit: undefined,
	employeeDelete: null,
	setEmployeeDelete: (value: AccountItem | null) => {},
});

export const columns: ColumnDef<AccountType>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "avatar",
		header: "Avatar",
		cell: ({ row }) => (
			<div>
				<Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
					<AvatarImage src={row.getValue("avatar")} />
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
		accessorKey: "email",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Email
					<SortAscIcon className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="lowercase">{row.getValue("email")}</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: function Actions({ row }) {
			const { setEmployeeIdEdit, setEmployeeDelete } =
				useContext(AccountTableContext);
			const openEditEmployee = () => {
				setEmployeeIdEdit(row.original.id);
			};

			const openDeleteEmployee = () => {
				setEmployeeDelete(row.original);
			};
			return (
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={openEditEmployee}>
							Sửa
						</DropdownMenuItem>
						<DropdownMenuItem onClick={openDeleteEmployee}>
							Xóa
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

function AlertDialogDeleteAccount({
	employeeDelete,
	setEmployeeDelete,
}: {
	employeeDelete: AccountItem | null;
	setEmployeeDelete: (value: AccountItem | null) => void;
}) {
	const queryClient = useQueryClient();

	const deleteEmployeeMutation = useMutation({
		mutationFn: accountApiRequests.deleteEmployee,
		onSuccess: () => {
			setEmployeeDelete(null);
			queryClient.invalidateQueries({ queryKey: ["accounts"] });
		},
	});

	const handleDeleteEmployee = async () => {
		if (!employeeDelete) return;
		const res = await deleteEmployeeMutation.mutateAsync(employeeDelete.id);
		toast.success(res?.payload.message);
	};
	return (
		<AlertDialog
			open={Boolean(employeeDelete)}
			onOpenChange={(value) => {
				if (!value) {
					setEmployeeDelete(null);
				}
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
					<AlertDialogDescription>
						Tài khoản{" "}
						<span className="bg-foreground text-primary-foreground rounded px-1">
							{employeeDelete?.name}
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

export default function AccountTable() {
	const [employeeIdEdit, setEmployeeIdEdit] = useState<number | undefined>();
	const [employeeDelete, setEmployeeDelete] = useState<AccountItem | null>(
		null
	);

	const { data: tableData } = useQuery({
		queryKey: ["accounts"],
		queryFn: accountApiRequests.list,
	});
	const search: SearchField<AccountType>[] = [
		{
			field: "name",
			type: "text",
			placeholder: "Tìm theo tên",
		},
	];

	return (
		<AccountTableContext.Provider
			value={{
				employeeIdEdit,
				setEmployeeIdEdit,
				employeeDelete,
				setEmployeeDelete,
			}}
		>
			<div className="w-full">
				<EditEmployee id={employeeIdEdit} setId={setEmployeeIdEdit} />
				<AlertDialogDeleteAccount
					employeeDelete={employeeDelete}
					setEmployeeDelete={setEmployeeDelete}
				/>
				<Suspense>
					<CustomTable
						search={search}
						data={tableData?.payload.data}
						columns={columns}
						pathname="/manage/accounts"
						AddComponent={AddEmployee}
					/>
				</Suspense>
			</div>
		</AccountTableContext.Provider>
	);
}
