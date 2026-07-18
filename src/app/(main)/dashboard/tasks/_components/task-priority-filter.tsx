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

import { priorities } from "./data";

interface TaskPriorityFilterProps<TData> {
  table: Table<TData>;
}

export function TaskPriorityFilter<TData>({ table }: TaskPriorityFilterProps<TData>) {
  const column = table.getColumn("priority");

  if (!column) {
    return null;
  }

  const priorityColumn = column;
  const selectedValues = new Set(priorityColumn.getFilterValue() as string[]);

  function clearFilter() {
    priorityColumn.setFilterValue(undefined);
    table.setPageIndex(0);
  }

  return (
    <DropdownMenuTrigger>
      <Button
        variant="outline"
        className={cn("border-dashed", selectedValues.size > 0 && "border-solid bg-muted text-foreground")}
      >
        <ListFilter data-icon="inline-start" />
        Priority
      </Button>
      <DropdownMenu
        placement="bottom start"
        className="w-50"
        selectionMode="multiple"
        selectedKeys={selectedValues}
        onSelectionChange={(keys) => {
          const filterValues = keys === "all" ? priorities.map((priority) => priority.value) : [...keys].map(String);
          priorityColumn.setFilterValue(filterValues.length ? filterValues : undefined);
          table.setPageIndex(0);
        }}
      >
        <DropdownMenuGroup>
          {priorities.map((priority) => (
            <DropdownMenuItem key={priority.value} id={priority.value}>
              <priority.icon className="text-muted-foreground" />
              {priority.label}
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
