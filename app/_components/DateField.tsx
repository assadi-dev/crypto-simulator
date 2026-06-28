"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateFieldProps = {
  id?: string;
  value?: Date;
  onChange: (date?: Date) => void;
  /** Dates à désactiver (ex. futures). */
  disabled?: (date: Date) => boolean;
  placeholder?: string;
};

/** Sélecteur de date (Popover + Calendar) piloté de manière contrôlée. */
export function DateField({
  id,
  value,
  onChange,
  disabled,
  placeholder = "Choisir une date",
}: DateFieldProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn(
            "h-10 w-full justify-start gap-2 px-3 font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="size-4 opacity-70" />
          {value ? format(value, "d MMMM yyyy", { locale: fr }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          onSelect={onChange}
          disabled={disabled}
          locale={fr}
          captionLayout="dropdown"
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
