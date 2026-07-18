import { Ellipsis, FileDown, FileUp, RefreshCw, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AnalyticsToolbar() {
  return (
    <div className="flex items-center gap-2">
      <Select defaultValue="last-4-weeks" placeholder="Select range">
        <SelectTrigger className="w-34">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem id="last-7-days">Last 7 days</SelectItem>
            <SelectItem id="last-4-weeks">Last 4 weeks</SelectItem>
            <SelectItem id="last-3-months">Last 3 months</SelectItem>
            <SelectItem id="year-to-date">Year to date</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <DropdownMenuTrigger>
        <Button size="icon" variant="outline" aria-label="More analytics actions">
          <Ellipsis />
        </Button>
        <DropdownMenu placement="bottom end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Analytics actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <FileDown />
              Export report
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileUp />
              Import data
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 />
              Share dashboard
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <RefreshCw />
              Refresh metrics
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenu>
      </DropdownMenuTrigger>
    </div>
  );
}
