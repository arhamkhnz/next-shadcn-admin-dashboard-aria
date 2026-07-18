"use client";

import { format } from "date-fns/format";
import {
  Archive,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Forward,
  MailOpen,
  Paperclip,
  Pin,
  Reply,
  ReplyAll,
  Send,
  Smile,
  Tag,
  Trash2,
  X,
} from "lucide-react";

import { SimpleIcon } from "@/components/simple-icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type { Mail } from "./data";
import { useMail } from "./use-mail";

interface MailDisplayProps {
  mail: Mail | null;
  onClose?: () => void;
}

export function MailView({ mail, onClose }: MailDisplayProps) {
  const [, setMail] = useMail();

  function handleClose() {
    setMail({ selected: null });
    onClose?.();
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 px-2 py-3">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <TooltipTrigger>
            <Button variant="ghost" size="icon-sm" aria-label="Close message" onPress={handleClose}>
              <X />
            </Button>
            <Tooltip>Close message</Tooltip>
          </TooltipTrigger>
          <Separator className="h-4 data-vertical:self-center" orientation="vertical" />
          <div className="flex items-center gap-0">
            <TooltipTrigger>
              <Button variant="ghost" size="icon-sm" aria-label="Previous message">
                <ChevronLeft />
              </Button>
              <Tooltip>Previous message</Tooltip>
            </TooltipTrigger>
            <TooltipTrigger>
              <Button variant="ghost" size="icon-sm" aria-label="Next message">
                <ChevronRight />
              </Button>
              <Tooltip>Next message</Tooltip>
            </TooltipTrigger>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <TooltipTrigger>
            <Button variant="ghost" size="icon-sm" aria-label="Pin thread">
              <Pin />
            </Button>
            <Tooltip>Pin thread</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <Button variant="ghost" size="icon-sm" aria-label="Archive">
              <Archive />
            </Button>
            <Tooltip>Archive</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <Button variant="ghost" size="icon-sm" aria-label="Reply">
              <Reply />
            </Button>
            <Tooltip>Reply</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon-sm" aria-label="More actions">
                <EllipsisVertical />
              </Button>
              <DropdownMenu placement="bottom end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <ReplyAll />
                    Reply all
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward />
                    Forward
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <MailOpen />
                    Mark as unread
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Tag />
                    Add label
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenu>
            </DropdownMenuTrigger>
            <Tooltip>More actions</Tooltip>
          </TooltipTrigger>
          <Separator className="h-4 data-vertical:self-center" orientation="vertical" />
          <TooltipTrigger>
            <Button variant="ghost" size="icon-sm" aria-label="Move to trash">
              <Trash2 className="text-destructive" />
            </Button>
            <Tooltip>Move to trash</Tooltip>
          </TooltipTrigger>
        </div>
      </div>

      <Separator />

      <div className="flex min-h-0 flex-1 flex-col">
        {mail ? (
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="space-y-1.5">
              <div className="font-medium leading-none">{mail.subject}</div>

              <div className="text-muted-foreground text-xs leading-none">
                {format(new Date(mail.receivedAt), "EEE, d MMM yyyy, h:mm a")}
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Avatar className="size-9 after:rounded-sm">
                <AvatarFallback className="rounded-sm bg-background">{mail.from.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex h-full flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="text-xs">{mail.from.name}</div>
                  <Separator className="h-3 data-vertical:self-center" orientation="vertical" />
                  <div className="text-muted-foreground text-xs">{mail.from.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground text-xs">
                    To: <span className="text-foreground">{mail.to.map((recipient) => recipient.name).join(", ")}</span>
                  </div>

                  {mail.cc?.length ? (
                    <div className="text-muted-foreground text-xs">
                      Cc:{" "}
                      <span className="text-foreground">{mail.cc.map((recipient) => recipient.name).join(", ")}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <Separator />

            {mail.attachments?.length ? (
              <>
                <Collapsible defaultExpanded>
                  <CollapsibleTrigger
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "group p-0 font-normal text-muted-foreground hover:bg-transparent hover:text-muted-foreground",
                    )}
                  >
                    Attachments ({mail.attachments.length})
                    <ChevronDown className="transition-transform group-aria-expanded:rotate-180" />
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="flex flex-wrap gap-2">
                      {mail.attachments.map((attachment) => (
                        <Button size="xs" variant="secondary" key={attachment.id}>
                          <SimpleIcon icon={attachment.icon} data-icon="inline-start" className="size-3 fill-current" />
                          <span className="font-normal">{attachment.name}</span>
                          <span className="font-normal text-muted-foreground">{attachment.size}</span>
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator className="my-2" />
              </>
            ) : null}

            <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap text-sm">{mail.body}</div>

            <div className="mt-auto flex flex-col gap-3">
              <Separator />
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Reply />
                </InputGroupAddon>
                <InputGroupInput className="text-xs" placeholder={`Reply ${mail.from.name}...`} />
                <InputGroupAddon className="gap-1" align="inline-end">
                  <InputGroupButton variant="ghost">
                    <Smile />
                  </InputGroupButton>
                  <InputGroupButton variant="ghost">
                    <Paperclip />
                  </InputGroupButton>
                  <InputGroupButton variant="ghost">
                    <Send />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground text-sm">No email selected</div>
        )}
      </div>
    </div>
  );
}
