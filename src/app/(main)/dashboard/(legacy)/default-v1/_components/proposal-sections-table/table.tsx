"use client";
"use no memo";

import * as React from "react";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  PlusIcon,
  Settings2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableHead, TableHeader } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DraggableProposalSectionsRow, proposalSectionsColumns } from "./columns";
import type { ProposalSectionsRow } from "./schema";

const VIEW_OPTIONS = [
  { value: "outline", label: "Outline" },
  { value: "past-performance", label: "Past Performance" },
  { value: "key-personnel", label: "Key Personnel" },
  { value: "focus-documents", label: "Focus Documents" },
] as const;

const pageSizeItems = [10, 20, 30, 40, 50].map((pageSize) => ({
  value: `${pageSize}`,
  label: `${pageSize}`,
}));

type ViewOption = (typeof VIEW_OPTIONS)[number]["value"];
export function ProposalSectionsTable({ data: initialData }: { data: ProposalSectionsRow[] }) {
  const [data, setData] = React.useState(() => initialData);
  const [activeView, setActiveView] = React.useState<ViewOption>("outline");
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => data.map(({ id }) => id), [data]);

  const table = useReactTable({
    data,
    columns: proposalSectionsColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  const toggleableColumns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide());

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      setData((currentData) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(currentData, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs
      selectedKey={activeView}
      onSelectionChange={(key) => setActiveView(key as ViewOption)}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select
          placeholder="Select a view"
          value={activeView}
          onChange={(key) => {
            if (key != null) setActiveView(key as ViewOption);
          }}
        >
          <SelectTrigger className="flex @4xl/main:hidden w-fit" size="sm" id="view-selector">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {VIEW_OPTIONS.map((option) => (
                <SelectItem key={option.value} id={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <TabsList className="@4xl/main:flex hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1">
          <TabsTrigger id="outline">Outline</TabsTrigger>
          <TabsTrigger id="past-performance">
            Past Performance <Badge variant="secondary">3</Badge>
          </TabsTrigger>
          <TabsTrigger id="key-personnel">
            Key Personnel <Badge variant="secondary">2</Badge>
          </TabsTrigger>
          <TabsTrigger id="focus-documents">Focus Documents</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenuTrigger>
            <Button variant="outline" size="sm">
              <Settings2 data-icon="inline-start" />
              View
              <ChevronDownIcon data-icon="inline-end" />
            </Button>
            <DropdownMenu
              placement="bottom end"
              className="w-35"
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
                  <DropdownMenuItem key={column.id} id={column.id} className="capitalize">
                    {column.id}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenu>
          </DropdownMenuTrigger>
          <Button variant="outline" size="sm">
            <PlusIcon data-icon="inline-start" />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        </div>
      </div>
      <TabsContent id="outline" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted">
                  {table.getHeaderGroups().flatMap((headerGroup) =>
                    headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        isRowHeader={
                          header ===
                          headerGroup.headers.find(
                            (candidate) => !["drag", "select", "actions"].includes(candidate.column.id),
                          )
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
                    <DraggableProposalSectionsRow key={row.id} row={row} />
                  ))}
                </TableBody>
              </Table>
            </SortableContext>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-muted-foreground text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="font-medium text-sm">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onChange={(key) => {
                  if (key != null) table.setPageSize(Number(key));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
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
                className="size-8"
                size="icon"
                onPress={() => table.previousPage()}
                isDisabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onPress={() => table.nextPage()}
                isDisabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onPress={() => table.setPageIndex(table.getPageCount() - 1)}
                isDisabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent id="past-performance" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
      </TabsContent>
      <TabsContent id="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
      </TabsContent>
      <TabsContent id="focus-documents" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
      </TabsContent>
    </Tabs>
  );
}
