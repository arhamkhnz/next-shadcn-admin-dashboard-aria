"use client";
"use no memo";

import * as React from "react";

import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  Search,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { recentCustomersColumns } from "./columns";
import type { RecentCustomerRow } from "./schema";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "Subscribed", label: "Subscribed" },
  { value: "Inactive", label: "Inactive" },
  { value: "Unsubscribed", label: "Unsubscribed" },
] as const;

const billingOptions = [
  { value: "all", label: "All" },
  { value: "Paid", label: "Paid" },
  { value: "Pending", label: "Pending" },
  { value: "Overdue", label: "Overdue" },
  { value: "Trial", label: "Trial" },
] as const;

const joinedDateOptions = [
  { value: "all", label: "All time" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
] as const;

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
] as const;

const sortOptionState = {
  newest: [{ id: "joined", desc: true }],
  oldest: [{ id: "joined", desc: false }],
  "name-asc": [{ id: "name", desc: false }],
  "name-desc": [{ id: "name", desc: true }],
} satisfies Record<(typeof sortOptions)[number]["value"], SortingState>;

const pageSizeItems = [10, 20, 30, 40, 50].map((pageSize) => ({
  value: `${pageSize}`,
  label: `${pageSize}`,
}));

export function RecentCustomersTable({ data }: { data: RecentCustomerRow[] }) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "joined", desc: true }]);
  const [columnVisibility] = React.useState<VisibilityState>({
    search: false,
    joinedWindow: false,
  });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns: recentCustomersColumns,
    state: {
      rowSelection,
      columnFilters,
      sorting,
      columnVisibility,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const searchQuery = (table.getColumn("search")?.getFilterValue() as string | undefined) ?? "";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string | undefined) ?? "all";
  const billingFilter = (table.getColumn("billing")?.getFilterValue() as string | undefined) ?? "all";
  const joinedDateFilter = (table.getColumn("joinedWindow")?.getFilterValue() as string | undefined) ?? "all";
  const sortValue = React.useMemo(() => {
    const currentSort = sorting[0];

    if (!currentSort) return "newest";
    if (currentSort.id === "joined" && currentSort.desc) return "newest";
    if (currentSort.id === "joined" && !currentSort.desc) return "oldest";
    if (currentSort.id === "name" && !currentSort.desc) return "name-asc";
    if (currentSort.id === "name" && currentSort.desc) return "name-desc";

    return "newest";
  }, [sorting]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-7 rounded-[min(var(--radius-md),12px)] pl-8"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(event) => {
                table.getColumn("search")?.setFilterValue(event.target.value || undefined);
                table.setPageIndex(0);
              }}
            />
          </div>
          <DropdownMenuTrigger>
            <Button variant="outline" size="sm">
              <UsersRound data-icon="inline-start" />
              Status
            </Button>
            <DropdownMenu
              className="w-35"
              placement="bottom start"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) => {
                if (keys === "all") return;
                const [value] = keys;
                if (value == null) return;
                table.getColumn("status")?.setFilterValue(value === "all" ? undefined : value);
                table.setPageIndex(0);
              }}
            >
              <DropdownMenuGroup>
                {statusOptions.map((status) => (
                  <DropdownMenuItem key={status.value} id={status.value}>
                    {status.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenu>
          </DropdownMenuTrigger>
          <DropdownMenuTrigger>
            <Button variant="outline" size="sm">
              <CalendarDays data-icon="inline-start" />
              Joined date
            </Button>
            <DropdownMenu
              className="w-40"
              placement="bottom start"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={[joinedDateFilter]}
              onSelectionChange={(keys) => {
                if (keys === "all") return;
                const [value] = keys;
                if (value == null) return;
                table.getColumn("joinedWindow")?.setFilterValue(value === "all" ? undefined : value);
                table.setPageIndex(0);
              }}
            >
              <DropdownMenuGroup>
                {joinedDateOptions.map((option) => (
                  <DropdownMenuItem key={option.value} id={option.value}>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenu>
          </DropdownMenuTrigger>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center xl:w-auto">
          <DropdownMenuTrigger>
            <Button variant="outline" size="sm">
              <CreditCard data-icon="inline-start" />
              Billing
            </Button>
            <DropdownMenu
              placement="bottom end"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={[billingFilter]}
              onSelectionChange={(keys) => {
                if (keys === "all") return;
                const [value] = keys;
                if (value == null) return;
                table.getColumn("billing")?.setFilterValue(value === "all" ? undefined : value);
                table.setPageIndex(0);
              }}
            >
              <DropdownMenuGroup>
                {billingOptions.map((billing) => (
                  <DropdownMenuItem key={billing.value} id={billing.value}>
                    {billing.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenu>
          </DropdownMenuTrigger>
          <DropdownMenuTrigger>
            <Button variant="outline" size="sm">
              <ArrowUpDown data-icon="inline-start" />
              Sort
            </Button>
            <DropdownMenu
              placement="bottom end"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={[sortValue]}
              onSelectionChange={(keys) => {
                if (keys === "all") return;
                const [value] = keys;
                if (value == null) return;
                table.setSorting(sortOptionState[value as keyof typeof sortOptionState] ?? sortOptionState.newest);
                table.setPageIndex(0);
              }}
            >
              <DropdownMenuGroup>
                {sortOptions.map((option) => (
                  <DropdownMenuItem key={option.value} id={option.value}>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenu>
          </DropdownMenuTrigger>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader className="bg-muted/15">
            {table.getHeaderGroups().flatMap((headerGroup) =>
              headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  isRowHeader={
                    header ===
                    headerGroup.headers.find((candidate) => !["select", "actions"].includes(candidate.column.id))
                  }
                  className="h-11 p-3 font-medium"
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              )),
            )}
          </TableHeader>
          <TableBody renderEmptyState={() => <div className="flex h-24 items-center justify-center">No results.</div>}>
            {table.getRowModel().rows.map((row) => (
              <TableRow id={row.id} key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="p-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-1">
        <div className="hidden flex-1 text-muted-foreground text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="recent-customers-rows-per-page" className="font-medium text-sm">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onChange={(key) => {
                if (key != null) table.setPageSize(Number(key));
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="recent-customers-rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent placement="top">
                <SelectGroup>
                  {pageSizeItems.map((item) => (
                    <SelectItem key={item.value} id={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center font-medium text-sm">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onPress={() => table.setPageIndex(0)}
              isDisabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onPress={() => table.previousPage()}
              isDisabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onPress={() => table.nextPage()}
              isDisabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onPress={() => table.setPageIndex(table.getPageCount() - 1)}
              isDisabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
