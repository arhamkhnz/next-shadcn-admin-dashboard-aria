"use client";
"use no memo";

import type { Table } from "@tanstack/react-table";
import { Settings2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { TaskPriorityFilter } from "./task-priority-filter";
import { TaskStatusFilter } from "./task-status-filter";

interface TasksToolbarProps<TData> {
  table: Table<TData>;
}

export function TasksToolbar<TData>({ table }: TasksToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const searchValue = (table.getColumn("title")?.getFilterValue() as string | undefined) ?? "";
  const hideableColumns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide());
  const hiddenColumns = hideableColumns.filter((column) => !column.getIsVisible());

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Filter tasks..."
          value={searchValue}
          onChange={(event) => {
            table.getColumn("title")?.setFilterValue(event.target.value);
            table.setPageIndex(0);
          }}
          className="w-full bg-background text-foreground placeholder:text-muted-foreground sm:w-64"
        />
        <TaskStatusFilter table={table} />
        <TaskPriorityFilter table={table} />
        {isFiltered && (
          <Button
            variant="destructive"
            onPress={() => {
              table.resetColumnFilters();
              table.setPageIndex(0);
            }}
          >
            <X data-icon="inline-start" />
            Reset
          </Button>
        )}
      </div>
      <div className="flex justify-end">
        <DropdownMenuTrigger>
          <Button
            variant="outline"
            size="sm"
            className={cn("ml-auto hidden lg:flex", hiddenColumns.length > 0 && "bg-muted text-foreground")}
          >
            <Settings2 data-icon="inline-start" />
            View
          </Button>
          <DropdownMenu
            placement="bottom end"
            className="w-38"
            selectionMode="multiple"
            selectedKeys={hideableColumns.filter((column) => column.getIsVisible()).map((column) => column.id)}
            onSelectionChange={(keys) => {
              if (keys === "all") return;
              hideableColumns.forEach((column) => {
                column.toggleVisibility(keys.has(column.id));
              });
            }}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {hideableColumns.map((column) => (
                <DropdownMenuItem key={column.id} id={column.id} className="capitalize">
                  {column.id}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenu>
        </DropdownMenuTrigger>
      </div>
    </div>
  );
}
