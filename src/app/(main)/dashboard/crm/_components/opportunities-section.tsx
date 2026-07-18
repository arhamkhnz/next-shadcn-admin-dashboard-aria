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
import { ChevronDownIcon, ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { opportunitiesColumns } from "./opportunities-table/columns";
import opportunitiesData from "./opportunities-table/data.json";
import { opportunitiesSchema } from "./opportunities-table/schema";

const stageOptions = ["all", "Proposal Sent", "Discovery", "Negotiation", "Qualified"] as const;
const healthOptions = ["all", "On Track", "Needs Review", "At Risk", "On Hold"] as const;
const opportunities = opportunitiesSchema.parse(opportunitiesData);

function preventPaginationNavigation(event: { preventDefault(): void }) {
  event.preventDefault();
}

export function OpportunitiesSection() {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: opportunities,
    columns: opportunitiesColumns,
    state: {
      rowSelection,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  });
  const searchQuery = table.getState().globalFilter ?? "";
  const stageFilter = (table.getColumn("stage")?.getFilterValue() as string | undefined) ?? "all";
  const healthFilter = (table.getColumn("health")?.getFilterValue() as string | undefined) ?? "all";
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();
  const filteredOpportunityCount = table.getFilteredRowModel().rows.length;
  const visibleOpportunityCount = table.getRowModel().rows.length;
  const pageNumbers = React.useMemo(() => {
    if (pageCount <= 3) {
      return Array.from({ length: pageCount }, (_, index) => index + 1);
    }

    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];

    return [currentPage - 1, currentPage, currentPage + 1];
  }, [currentPage, pageCount]);

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="leading-none">Recent Opportunities</CardTitle>
          <CardDescription>
            Track qualified leads moving through discovery, proposal, and closing stages.
          </CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <Input
                className="h-7 w-44 md:w-52"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(event) => {
                  table.setGlobalFilter(event.target.value || undefined);
                  table.setPageIndex(0);
                }}
              />
              <DropdownMenuTrigger>
                <Button variant="outline" size="sm">
                  <ListFilter data-icon="inline-start" />
                  Stage
                  <ChevronDownIcon data-icon="inline-end" />
                </Button>
                <DropdownMenu
                  placement="bottom end"
                  className="w-40"
                  selectionMode="single"
                  disallowEmptySelection
                  selectedKeys={[stageFilter]}
                  onSelectionChange={(keys) => {
                    if (keys === "all") return;
                    const [value] = keys;
                    if (value == null) return;
                    table.getColumn("stage")?.setFilterValue(value === "all" ? undefined : value);
                    table.setPageIndex(0);
                  }}
                >
                  <DropdownMenuGroup>
                    {stageOptions.map((option) => (
                      <DropdownMenuItem key={option} id={option}>
                        {option === "all" ? "All stages" : option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenu>
              </DropdownMenuTrigger>
              <DropdownMenuTrigger>
                <Button variant="outline" size="sm">
                  <ListFilter data-icon="inline-start" />
                  Health
                  <ChevronDownIcon data-icon="inline-end" />
                </Button>
                <DropdownMenu
                  placement="bottom end"
                  className="w-40"
                  selectionMode="single"
                  disallowEmptySelection
                  selectedKeys={[healthFilter]}
                  onSelectionChange={(keys) => {
                    if (keys === "all") return;
                    const [value] = keys;
                    if (value == null) return;
                    table.getColumn("health")?.setFilterValue(value === "all" ? undefined : value);
                    table.setPageIndex(0);
                  }}
                >
                  <DropdownMenuGroup>
                    {healthOptions.map((option) => (
                      <DropdownMenuItem key={option} id={option}>
                        {option === "all" ? "All health" : option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenu>
              </DropdownMenuTrigger>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-0">
          <div className="overflow-hidden">
            <Table className="**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4 **:data-[slot='table-cell']:py-4">
              <TableHeader className="border-t **:data-[slot='table-head']:h-11 **:data-[slot='table-head']:font-medium **:data-[slot='table-head']:text-foreground **:data-[slot='table-head']:text-sm">
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
                className="**:data-[slot='table-row']:border-border/50 **:data-[slot='table-row']:hover:bg-transparent"
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
          <div className="flex items-center justify-between gap-4 px-4 pb-1">
            <p className="text-muted-foreground text-sm">
              Viewing {visibleOpportunityCount} out of {filteredOpportunityCount.toLocaleString()} opportunities
            </p>

            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent className="gap-1.5">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : undefined}
                    onClick={(event) => {
                      preventPaginationNavigation(event);
                      table.previousPage();
                    }}
                  />
                </PaginationItem>
                {pageNumbers[0] > 1 ? (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : null}
                {pageNumbers.map((pageNumber) => (
                  <PaginationItem key={`page-${pageNumber}`}>
                    <PaginationLink
                      href="#"
                      isActive={table.getState().pagination.pageIndex === pageNumber - 1}
                      onClick={(event) => {
                        preventPaginationNavigation(event);
                        table.setPageIndex(pageNumber - 1);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {pageNumbers[pageNumbers.length - 1] < pageCount ? (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : null}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : undefined}
                    onClick={(event) => {
                      preventPaginationNavigation(event);
                      table.nextPage();
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
