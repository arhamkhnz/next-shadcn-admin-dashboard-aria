import { format } from "date-fns";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { CustomerReviews } from "./_components/customer-reviews";
import { Inventory } from "./_components/inventory";
import { KpiStrip } from "./_components/kpi-strip";
import { RecentOrders } from "./_components/recent-orders";
import { StoreTraffic } from "./_components/store-traffic";
import { TopProducts } from "./_components/top-products";
import { TrafficSources } from "./_components/traffic-sources";

export default function Page() {
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">Store Overview</h1>
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
        </div>

        <div className="flex flex-wrap items-end justify-end gap-2 lg:w-fit">
          <Select defaultValue="this-month" placeholder="This Month">
            <SelectTrigger className="w-34" id="ecommerce-period" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem id="this-month">This Month</SelectItem>
                <SelectItem id="last-month">Last Month</SelectItem>
                <SelectItem id="last-30-days">Last 30 Days</SelectItem>
                <SelectItem id="year-to-date">Year to Date</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select defaultValue="all-channels" placeholder="All Channels">
            <SelectTrigger className="w-40" id="ecommerce-channel" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem id="all-channels">All Channels</SelectItem>
                <SelectItem id="online-store">Online Store</SelectItem>
                <SelectItem id="marketplace">Marketplace</SelectItem>
                <SelectItem id="social">Social</SelectItem>
                <SelectItem id="retail">Retail</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" />

          <Button size="icon-sm" variant="outline">
            <Settings2 />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <KpiStrip />
        <div className="xl:col-span-5">
          <StoreTraffic />
        </div>
        <div className="xl:col-span-7">
          <TrafficSources />
        </div>
        <div className="xl:col-span-4">
          <TopProducts />
        </div>
        <div className="xl:col-span-4">
          <Inventory />
        </div>
        <div className="xl:col-span-4">
          <CustomerReviews />
        </div>
        <div className="xl:col-span-12">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
