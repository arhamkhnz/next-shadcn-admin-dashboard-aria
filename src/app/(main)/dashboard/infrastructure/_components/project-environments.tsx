import {
  ArrowUpDown,
  Bell,
  ChevronDown,
  CircleDashed,
  CircleGauge,
  Clock3,
  Copy,
  EllipsisVertical,
  FileText,
  Plus,
  RefreshCw,
  Settings,
  SquareTerminal,
  Terminal,
} from "lucide-react";

import { SimpleIcon } from "@/components/simple-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { InfrastructureEnvironment, InfrastructureGroup } from "./infrastructure-data";

export function ProjectEnvironments({ group }: { group: InfrastructureGroup }) {
  return (
    <Collapsible
      defaultExpanded
      className="flex flex-col overflow-hidden rounded-xl border bg-card py-3 text-card-foreground data-expanded:gap-3 data-expanded:pb-0"
    >
      <div className="flex flex-col gap-2 px-4 sm:flex-row sm:items-center">
        <Button
          slot="trigger"
          variant="ghost"
          className="group -ml-2 h-auto w-full justify-start gap-2 px-2 py-1 hover:bg-transparent aria-expanded:bg-transparent sm:flex-1"
        >
          <ChevronDown className="transition-transform group-aria-expanded:rotate-180" />
          <div className="flex min-w-0 items-baseline gap-1.5 text-left">
            <span className="shrink-0 font-medium leading-none">{group.organization}</span>
            <span className="min-w-0 truncate text-muted-foreground text-sm">({group.name})</span>
          </div>
        </Button>
        <div className="flex w-full items-center justify-between gap-2 sm:ml-auto sm:w-auto sm:justify-end">
          <Button variant="ghost" size="sm" className="-ml-1.5 sm:ml-0">
            <Plus data-icon="inline-start" />
            Add Environment
          </Button>
          <DropdownMenuTrigger>
            <Button variant="outline" size="icon-sm">
              <EllipsisVertical />
            </Button>
            <DropdownMenu className="w-40" placement="bottom end">
              <DropdownMenuGroup>
                {group.rows.length > 0 ? (
                  <DropdownMenuItem>
                    <FileText />
                    Activity Logs
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem>
                  <Terminal />
                  Open Console
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  Project Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RefreshCw />
                  Sync Status
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Manage Alerts
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Copy />
                  Copy Project ID
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenu>
          </DropdownMenuTrigger>
        </div>
      </div>

      <CollapsibleContent>
        {group.rows.length > 0 ? <EnvironmentTable rows={group.rows} /> : <EmptyProjectState />}
      </CollapsibleContent>
    </Collapsible>
  );
}

function EnvironmentTable({ rows }: { rows: InfrastructureEnvironment[] }) {
  return (
    <div className="scrollbar-thin overflow-x-auto [scrollbar-color:var(--border)_transparent] **:data-[slot=table-container]:overflow-visible [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1">
      <Table className="min-w-[1700px] table-fixed **:data-[slot='table-cell']:px-5 **:data-[slot='table-head']:px-5">
        <TableHeader className="bg-muted/50 [&_tr]:border-y">
          <TableHead isRowHeader className="w-90 font-medium">
            <span className="inline-flex items-center gap-1">
              Domain <ArrowUpDown className="size-4" />
            </span>
          </TableHead>
          <TableHead className="w-40">Platform</TableHead>
          <TableHead className="w-42">Environment</TableHead>
          <TableHead className="w-35">Health</TableHead>
          <TableHead className="w-35">Latency</TableHead>
          <TableHead className="w-38">Uptime</TableHead>
          <TableHead className="w-98">Resources</TableHead>
          <TableHead className="w-55">Server</TableHead>
          <TableHead className="w-18" aria-label="Actions" />
        </TableHeader>
        <TableBody className="**:data-[slot='table-row']:hover:bg-transparent">
          {rows.map((row) => (
            <TableRow id={row.domain} key={row.domain}>
              <TableCell>
                <span className="block truncate font-medium" title={row.domain}>
                  {row.domain}
                </span>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-2 font-medium text-muted-foreground">
                  <SimpleIcon icon={row.platform.icon} className="size-4 fill-current" />
                  {row.platform.name}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={row.environment === "Expired" ? "destructive" : "secondary"}
                  className={cn(
                    "rounded-sm px-1.5 py-0.5",
                    row.environment === "Production" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                    row.environment === "Staging" && "bg-sky-500/10 text-sky-600 dark:text-sky-400",
                  )}
                >
                  {row.environment}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={row.status === "Online" ? "secondary" : "destructive"}
                  className={cn(
                    "rounded-sm px-1.5 py-0.5",
                    row.status === "Online" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      row.status === "Online" ? "bg-emerald-500" : "bg-destructive",
                    )}
                  />
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground tabular-nums">
                  <CircleGauge className="size-4" />
                  {row.latency}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground tabular-nums">
                  <Clock3 className="size-4" />
                  {row.uptime}
                </span>
              </TableCell>
              <TableCell>
                <div className="grid grid-cols-3 gap-4">
                  <ResourceMeter label="CPU" value={row.resources.cpu} />
                  <ResourceMeter label="RAM" value={row.resources.ram} />
                  <ResourceMeter label="Disk" value={row.resources.disk} />
                </div>
              </TableCell>
              <TableCell>
                <span className="flex flex-col font-medium">
                  {row.server}
                  <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <span
                      aria-hidden="true"
                      className={cn("shrink-0 rounded-xs text-sm ring-1 ring-foreground/10", `flag:${row.countryCode}`)}
                    />
                    {row.countryCode} · {row.plan}
                  </span>
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenuTrigger>
                  <Button variant="ghost" size="icon-sm" className="-mr-2">
                    <SquareTerminal />
                  </Button>
                  <DropdownMenu className="w-40" placement="bottom end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <FileText />
                        View Logs
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Terminal />
                        Open Console
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RefreshCw />
                        Restart
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Copy />
                        Copy URL
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenu>
                </DropdownMenuTrigger>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ResourceMeter({ label, value }: { label: string; value: number }) {
  const isCritical = value >= 70;
  const isWarning = value >= 55;

  return (
    <span className="min-w-0 space-y-1">
      <span className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span
          className={cn(
            "font-medium text-emerald-600 tabular-nums dark:text-emerald-400",
            isWarning && "text-amber-600 dark:text-amber-400",
            isCritical && "text-destructive",
          )}
        >
          {value}%
        </span>
      </span>
      <span className="block h-1.5 overflow-hidden rounded-full bg-muted-foreground/20">
        <span
          className={cn(
            "block h-full rounded-full bg-emerald-500",
            isWarning && "bg-amber-500",
            isCritical && "bg-destructive",
          )}
          style={{ width: `${value}%` }}
        />
      </span>
    </span>
  );
}

function EmptyProjectState() {
  return (
    <div className="flex min-h-24 items-center justify-center border-t bg-muted/50 p-4">
      <div className="flex items-center gap-2">
        <CircleDashed className="size-4" />
        <p className="font-medium text-sm">No environments in this project</p>
      </div>
    </div>
  );
}
