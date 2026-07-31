import { Download, MoreVertical, Share2, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { FileManagerFile } from "./data";

export function FileActions({ file, onToggleStar }: { file: FileManagerFile; onToggleStar: () => void }) {
  return (
    <DropdownMenuTrigger>
      <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${file.name}`}>
        <MoreVertical />
      </Button>
      <DropdownMenu
        placement="bottom end"
        className="w-48"
        onAction={(key) => {
          if (key === "star") onToggleStar();
        }}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem id="star">
            <Star />
            {file.starred ? "Remove from starred" : "Add to starred"}
          </DropdownMenuItem>
          <DropdownMenuItem id="download">
            <Download />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem id="share">
            <Share2 />
            Copy share link
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem id="trash" variant="destructive">
            <Trash2 />
            Move to trash
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
}
