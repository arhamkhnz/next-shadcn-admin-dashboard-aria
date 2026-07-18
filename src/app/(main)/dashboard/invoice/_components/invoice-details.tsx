import * as React from "react";

import { parseDate } from "@internationalized/date";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Hash } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverTrigger } from "@/components/ui/popover";

import type { InvoiceFormValues } from "./data";

const dateFields: Array<{
  id: string;
  label: string;
  name: "issuedDate" | "paymentDueDate";
}> = [
  {
    id: "issued-date",
    label: "Issued Date",
    name: "issuedDate",
  },
  {
    id: "payment-due-date",
    label: "Due Date",
    name: "paymentDueDate",
  },
];

export function InvoiceDetails() {
  const { control, register } = useFormContext<InvoiceFormValues>();

  return (
    <section className="flex flex-col gap-3">
      <FieldGroup>
        <Field className="gap-1">
          <FieldLabel className="text-xs" htmlFor="reference-number">
            Reference Number
          </FieldLabel>
          <InputGroup>
            <InputGroupInput id="reference-number" {...register("referenceNumber")} />
            <InputGroupAddon align="inline-end">
              <Hash />
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          {dateFields.map((dateField) => (
            <Controller
              key={dateField.name}
              control={control}
              name={dateField.name}
              render={({ field }) => (
                <Field className="gap-1">
                  <FieldLabel className="text-xs" htmlFor={dateField.id}>
                    {dateField.label}
                  </FieldLabel>
                  <DatePicker id={dateField.id} value={field.value} onChange={field.onChange} />
                </Field>
              )}
            />
          ))}
        </div>
      </FieldGroup>
    </section>
  );
}

function DatePicker({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const date = parseDateValue(value);
  const calendarDate = parseCalendarDateValue(value);

  return (
    <PopoverTrigger isOpen={open} onOpenChange={setOpen}>
      <Button
        id={id}
        variant="outline"
        data-empty={!date}
        className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
      >
        {date ? format(date, "PPP") : <span>Pick a date</span>}
        <CalendarIcon className="text-muted-foreground" />
      </Button>
      <Popover className="w-(--trigger-width) p-0" placement="bottom start">
        <Calendar
          className="w-full"
          value={calendarDate}
          onChange={(selectedDate) => {
            onChange(selectedDate.toString());
            setOpen(false);
          }}
        />
      </Popover>
    </PopoverTrigger>
  );
}

function parseDateValue(value: string) {
  const date = parseISO(value);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseCalendarDateValue(value: string) {
  try {
    return parseDate(value);
  } catch {
    return null;
  }
}
