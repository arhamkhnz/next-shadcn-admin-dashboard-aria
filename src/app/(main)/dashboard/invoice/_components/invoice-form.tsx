import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ClientSelector } from "./client-selector";
import { InvoiceAdjustments } from "./invoice-adjustments";
import { InvoiceDetails } from "./invoice-details";
import { InvoiceItems } from "./invoice-items";

export function InvoiceForm() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4">
      <Tabs defaultSelectedKey="invoice">
        <TabsList className="w-full">
          <TabsTrigger id="invoice">Invoice</TabsTrigger>
          <TabsTrigger id="payment">Payment</TabsTrigger>
          <TabsTrigger id="business">Business</TabsTrigger>
        </TabsList>
      </Tabs>

      <InvoiceDetails />

      <Separator />

      <ClientSelector />

      <Separator />

      <InvoiceItems />

      <Separator />

      <InvoiceAdjustments />
    </div>
  );
}
