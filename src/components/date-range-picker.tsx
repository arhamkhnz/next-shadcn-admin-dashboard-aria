"use client";

import * as React from "react";

import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { format, subDays } from "date-fns";

import { Button } from "@/components/ui/button";
import { RangeCalendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";

export interface DateRange {
  from?: Date;
  to?: Date;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (value: DateRange | undefined) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [internalDateRange, setInternalDateRange] = React.useState<DateRange | undefined>(() => {
    const to = new Date();
    const from = subDays(to, 29);
    return { from, to };
  });
  const dateRange = value ?? internalDateRange;
  let dateRangeLabel = "Select date";

  if (dateRange?.from) {
    dateRangeLabel = format(dateRange.from, "d MMM yyyy");
  }

  if (dateRange?.from && dateRange.to) {
    dateRangeLabel = `${format(dateRange.from, "d MMM yyyy")} - ${format(dateRange.to, "d MMM yyyy")}`;
  }

  const handleDateChange = (nextValue: DateRange | undefined) => {
    if (!value) {
      setInternalDateRange(nextValue);
    }
    onChange?.(nextValue);
  };

  const calendarValue =
    dateRange?.from && dateRange.to
      ? {
          start: toCalendarDate(dateRange.from),
          end: toCalendarDate(dateRange.to),
        }
      : null;

  return (
    <PopoverTrigger isOpen={open} onOpenChange={setOpen}>
      <Button variant="outline" id="date" className="font-normal">
        {dateRangeLabel}
      </Button>
      <Popover className="w-auto overflow-hidden p-0" placement="bottom end">
        <RangeCalendar
          value={calendarValue}
          onChange={(nextValue) => {
            const timeZone = getLocalTimeZone();
            handleDateChange({
              from: nextValue.start.toDate(timeZone),
              to: nextValue.end.toDate(timeZone),
            });
          }}
          numberOfMonths={2}
        />
      </Popover>
    </PopoverTrigger>
  );
}

function toCalendarDate(date: Date) {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}
