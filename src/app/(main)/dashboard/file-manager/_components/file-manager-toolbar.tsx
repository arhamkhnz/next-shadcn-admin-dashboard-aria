import { ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export function FileManagerToolbar() {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
      <InputGroup className="md:max-w-lg">
        <InputGroupInput placeholder="Search files and folders..." aria-label="Search files and folders" />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <div className="flex flex-1 flex-wrap items-center gap-2 xl:justify-end">
        <DropdownMenuTrigger>
          <Button variant="outline" size="sm">
            <SlidersHorizontal data-icon="inline-start" />
            Filter & sort
          </Button>
          <DropdownMenu placement="bottom end" className="w-48" selectionMode="single" selectedKeys={["all"]}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Show</DropdownMenuLabel>
              <DropdownMenuItem id="all">All files</DropdownMenuItem>
              <DropdownMenuItem id="starred">Starred</DropdownMenuItem>
              <DropdownMenuItem id="shared">Shared</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger id="file-type">
                  <SlidersHorizontal />
                  File type
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent selectionMode="single" selectedKeys={["all-types"]}>
                  <DropdownMenuGroup>
                    <DropdownMenuItem id="all-types">All types</DropdownMenuItem>
                    <DropdownMenuItem id="archive">Archive</DropdownMenuItem>
                    <DropdownMenuItem id="design">Design</DropdownMenuItem>
                    <DropdownMenuItem id="document">Document</DropdownMenuItem>
                    <DropdownMenuItem id="pdf">PDF</DropdownMenuItem>
                    <DropdownMenuItem id="spreadsheet">Spreadsheet</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger id="sort-by">
                  <ArrowUpDown />
                  Sort by
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent selectionMode="single" selectedKeys={["modified"]}>
                  <DropdownMenuGroup>
                    <DropdownMenuItem id="modified">Last modified</DropdownMenuItem>
                    <DropdownMenuItem id="name">Name</DropdownMenuItem>
                    <DropdownMenuItem id="size">File size</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </DropdownMenu>
        </DropdownMenuTrigger>
      </div>
    </div>
  );
}
