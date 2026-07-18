"use client";
"use no memo";

import type { Table } from "@tanstack/react-table";
import { ListFilter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { statuses } from "./data";

interface TaskStatusFilterProps<TData> {
  table: Table<TData>;
}

export function TaskStatusFilter<TData>({ table }: TaskStatusFilterProps<TData>) {
  const column = table.getColumn("status");

  if (!column) {
    return null;
  }

  const statusColumn = column;
  const selectedValues = new Set(statusColumn.getFilterValue() as string[]);

  function clearFilter() {
    statusColumn.setFilterValue(undefined);
    table.setPageIndex(0);
  }

  return (
    <DropdownMenuTrigger>
      <Button
        variant="outline"
        className={cn("border-dashed", selectedValues.size > 0 && "border-solid bg-muted text-foreground")}
      >
        <ListFilter data-icon="inline-start" />
        Status
      </Button>
      <DropdownMenu
        placement="bottom start"
        className="w-50"
        selectionMode="multiple"
        selectedKeys={selectedValues}
        onSelectionChange={(keys) => {
          const filterValues = keys === "all" ? statuses.map((status) => status.value) : [...keys].map(String);
          statusColumn.setFilterValue(filterValues.length ? filterValues : undefined);
          table.setPageIndex(0);
        }}
      >
        <DropdownMenuGroup>
          {statuses.map((status) => (
            <DropdownMenuItem key={status.value} id={status.value}>
              <status.icon className="text-muted-foreground" />
              {status.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {selectedValues.size > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem id="clear" onAction={clearFilter} className="justify-center text-center">
                <X />
                Clear filters
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
}
