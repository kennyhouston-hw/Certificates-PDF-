import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format, isValid, parse } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DISPLAY_FORMAT = "dd.MM.yyyy";

function isoToDate(iso: string): Date | undefined {
  if (!iso) return undefined;
  const date = new Date(`${iso}T00:00:00`);
  return isValid(date) ? date : undefined;
}

function dateToIso(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function DateInput({ value, onChange, className }: DateInputProps) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(() => {
    const date = isoToDate(value);
    return date ? format(date, DISPLAY_FORMAT) : "";
  });

  React.useEffect(() => {
    const date = isoToDate(value);
    setText(date ? format(date, DISPLAY_FORMAT) : "");
  }, [value]);

  return (
    <div className={cn("relative flex items-center", className)}>
      <Input
        value={text}
        placeholder={DISPLAY_FORMAT}
        className="pr-10"
        onChange={(e) => {
          setText(e.target.value);
          const parsed = parse(e.target.value, DISPLAY_FORMAT, new Date());
          if (isValid(parsed)) {
            onChange(dateToIso(parsed));
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-1 size-7 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Выбрать дату</span>
            </Button>
          }
        />
        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
          <Calendar
            mode="single"
            selected={isoToDate(value)}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (date) {
                onChange(dateToIso(date));
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
