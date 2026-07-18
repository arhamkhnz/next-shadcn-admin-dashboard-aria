"use client";
"use no memo";

import * as React from "react";

import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type PaginationState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Download,
  Settings2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { recentLeadsColumns } from "./columns";
import type { RecentLeadRow } from "./schema";

const COLUMN_LABELS: Record<string, string> = {
  id: "Ref",
  name: "Name",
  company: "Company",
  status: "Status",
  source: "Source",
  lastActivity: "Last Activity",
};

const pageSizeItems = [10, 20, 30, 40, 50].map((pageSize) => ({
  value: `${pageSize}`,
  label: `${pageSize}`,
}));

export function RecentLeadsTable({ data }: { data: RecentLeadRow[] }) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns: recentLeadsColumns,
    state: {
      rowSelection,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  const toggleableColumns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Leads</CardTitle>
        <CardDescription>Track and manage your latest leads and their status.</CardDescription>
        <CardAction>
          <div className="flex items-center gap-2">
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm">
                <Settings2 data-icon="inline-start" />
                View
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
              <DropdownMenu
                placement="bottom end"
                className="w-36"
                selectionMode="multiple"
                selectedKeys={toggleableColumns.filter((column) => column.getIsVisible()).map((column) => column.id)}
                onSelectionChange={(keys) => {
                  if (keys === "all") return;
                  toggleableColumns.forEach((column) => {
                    column.toggleVisibility(keys.has(column.id));
                  });
                }}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  {toggleableColumns.map((column) => (
                    <DropdownMenuItem key={column.id} id={column.id}>
                      {COLUMN_LABELS[column.id] ?? column.id}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenu>
            </DropdownMenuTrigger>
            <Button variant="outline" size="sm">
              <Download data-icon="inline-start" />
              <span className="hidden lg:inline">Export</span>
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().flatMap((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    isRowHeader={
                      header ===
                      headerGroup.headers.find((candidate) => !["select", "actions"].includes(candidate.column.id))
                    }
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )),
              )}
            </TableHeader>
            <TableBody
              className="**:data-[slot=table-cell]:first:w-8"
              renderEmptyState={() => <div className="flex h-24 items-center justify-center">No results.</div>}
            >
              {table.getRowModel().rows.map((row) => (
                <TableRow id={row.id} key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="hidden flex-1 text-muted-foreground text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="recent-leads-rows-per-page" className="font-medium text-sm">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onChange={(key) => {
                  if (key != null) table.setPageSize(Number(key));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="recent-leads-rows-per-page">
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
                className="hidden h-8 w-8 p-0 lg:flex"
                onPress={() => table.setPageIndex(0)}
                isDisabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onPress={() => table.previousPage()}
                isDisabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onPress={() => table.nextPage()}
                isDisabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onPress={() => table.setPageIndex(table.getPageCount() - 1)}
                isDisabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
