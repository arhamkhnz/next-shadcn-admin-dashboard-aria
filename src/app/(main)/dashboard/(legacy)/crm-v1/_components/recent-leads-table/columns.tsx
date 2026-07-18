"use client";
"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { RecentLeadRow } from "./schema";

export const recentLeadsColumns: ColumnDef<RecentLeadRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          slot={null}
          isSelected={table.getIsAllPageRowsSelected()}
          isIndeterminate={!table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()}
          onChange={table.toggleAllPageRowsSelected}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox slot={null} isSelected={row.getIsSelected()} onChange={row.toggleSelected} aria-label="Select row" />
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Ref",
    cell: ({ row }) => <span className="tabular-nums">{row.original.id}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
    enableHiding: false,
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => row.original.company,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant="secondary">{row.original.status}</Badge>,
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => <Badge variant="outline">{row.original.source}</Badge>,
  },
  {
    accessorKey: "lastActivity",
    header: "Last Activity",
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{row.original.lastActivity}</span>,
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="flex size-8 text-muted-foreground">
          <EllipsisVertical />
          <span className="sr-only">Open menu</span>
        </Button>
        <DropdownMenu placement="bottom end" className="w-32">
          <DropdownMenuGroup>
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem>Assign</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenu>
      </DropdownMenuTrigger>
    ),
    enableHiding: false,
  },
];
