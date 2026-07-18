import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { type InvoiceFormValues, invoiceTaxOptions } from "./data";

export function InvoiceAdjustments() {
  const { control, register } = useFormContext<InvoiceFormValues>();
  const discountType = useWatch({ control, name: "discountType" });

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-medium tracking-tight">Adjustments</h2>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <Controller
          control={control}
          name="taxId"
          render={({ field }) => (
            <Field className="gap-1">
              <FieldLabel className="text-xs">Tax</FieldLabel>
              <Select
                placeholder="Select tax"
                value={field.value}
                onChange={(key) => {
                  if (key != null) field.onChange(key);
                }}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {invoiceTaxOptions.map((taxOption) => (
                      <SelectItem key={taxOption.id} id={taxOption.id}>
                        {taxOption.name} ({taxOption.rate}%)
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <div className="grid grid-cols-[1fr_112px] gap-4">
          <Controller
            control={control}
            name="discountType"
            render={({ field }) => (
              <Field className="gap-1">
                <FieldLabel className="text-xs">Discount</FieldLabel>
                <Select
                  placeholder="Discount type"
                  value={field.value}
                  onChange={(key) => {
                    if (key != null) field.onChange(key);
                  }}
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem id="fixed">Fixed amount</SelectItem>
                      <SelectItem id="percent">Percent</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Field className="gap-1">
            <FieldLabel className="text-xs opacity-0">Value</FieldLabel>
            <InputGroup>
              <InputGroupInput
                type="number"
                step="0.01"
                aria-label="Discount value"
                {...register("discountValue", { valueAsNumber: true })}
              />
              <InputGroupAddon align="inline-end">{discountType === "fixed" ? "$" : "%"}</InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
      </div>
    </section>
  );
}
