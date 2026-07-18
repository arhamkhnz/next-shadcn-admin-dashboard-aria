import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AnalyticsKpiStrip } from "./_components/analytics-kpi-strip";
import { AnalyticsToolbar } from "./_components/analytics-toolbar";
import { RealtimeVisitors } from "./_components/realtime-visitors";
import { TopPages } from "./_components/top-pages";
import { TopTrafficSources } from "./_components/top-traffic-sources";
import { TrafficQuality } from "./_components/traffic-quality";

// Import this stylesheet in any page or component that renders country flag classes.
import "@/styles/flag-icons/flags.css";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">Hello, Aiy</h1>
        <p className="text-muted-foreground text-sm">
          Monitor traffic, engagement, and conversion performance in one view.
        </p>
      </div>

      <Tabs defaultSelectedKey="overview" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="gap-1">
            <TabsTrigger id="overview">Overview</TabsTrigger>
            <TabsTrigger id="audience">Audience</TabsTrigger>
            <TabsTrigger id="acquisition">Acquisition</TabsTrigger>
            <TabsTrigger id="engagement">Engagement</TabsTrigger>
            <TabsTrigger id="conversions">Conversions</TabsTrigger>
          </TabsList>

          <AnalyticsToolbar />
        </div>

        <TabsContent id="overview" className="flex flex-col gap-4">
          <AnalyticsKpiStrip />

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TrafficQuality />
            </div>
            <div className="xl:col-span-5">
              <RealtimeVisitors />
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TopPages />
            </div>
            <div className="xl:col-span-5 xl:col-start-8">
              <TopTrafficSources />
            </div>
          </div>
        </TabsContent>

        <TabsContent id="audience">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Audience view coming soon.
          </div>
        </TabsContent>

        <TabsContent id="acquisition">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Acquisition view coming soon.
          </div>
        </TabsContent>

        <TabsContent id="engagement">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Engagement view coming soon.
          </div>
        </TabsContent>

        <TabsContent id="conversions">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Conversions view coming soon.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
