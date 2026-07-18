"use client";

import * as React from "react";

import { type CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { I18nProvider } from "react-aria-components";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

export function CalendarPanel() {
  const [date, setDate] = React.useState<CalendarDate | null>(() => today(getLocalTimeZone()));

  return (
    <Card className="w-full" size="sm">
      <CardContent>
        <I18nProvider locale="en-GB">
          <Calendar value={date} onChange={setDate} className="w-full p-0" />
        </I18nProvider>
      </CardContent>
    </Card>
  );
}
