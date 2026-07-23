import { useMemo, useRef, useState } from "react";
import { format, isSameDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function FieldShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 bg-charcoal/95 px-5 py-5 backdrop-blur md:px-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="shrink-0 text-gold"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="16" rx="1" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  );
}

function GuestsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="shrink-0 text-gold"
      aria-hidden
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15 20c0-2.5 2-4 4-4s2.5 1 2.5 3" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="shrink-0 text-gold"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function isCompleteRange(range: DateRange | undefined) {
  return Boolean(range?.from && range?.to && !isSameDay(range.from, range.to));
}

export function DatesField({
  placeholder,
  range,
  onChange,
}: {
  placeholder: string;
  range: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  // True after check-in is chosen and we are waiting for a different check-out day
  const pickingEndRef = useRef(false);

  const label = useMemo(() => {
    if (isCompleteRange(range) && range?.from && range?.to) {
      return `${format(range.from, "dd MMM yyyy")} – ${format(range.to, "dd MMM yyyy")}`;
    }
    if (range?.from) {
      return `${format(range.from, "dd MMM yyyy")} – Select check-out`;
    }
    return placeholder;
  }, [range, placeholder]);

  const handleOpenChange = (nextOpen: boolean) => {
    // Stay open while mid-selection (check-in chosen, check-out not yet a different day)
    if (!nextOpen && pickingEndRef.current && !isCompleteRange(range)) {
      return;
    }
    setOpen(nextOpen);
    if (!nextOpen) pickingEndRef.current = false;
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 bg-charcoal/95 px-5 py-5 text-left backdrop-blur md:px-6"
        >
          <CalendarIcon />
          <span
            className={cn(
              "flex-1 text-base",
              range?.from ? "text-bone" : "text-bone/70",
            )}
          >
            {label}
          </span>
          <Chevron />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="z-[80] w-auto border border-gold/30 bg-charcoal p-3 text-bone shadow-xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          if (pickingEndRef.current && !isCompleteRange(range)) {
            e.preventDefault();
          }
        }}
        onFocusOutside={(e) => {
          if (pickingEndRef.current && !isCompleteRange(range)) {
            e.preventDefault();
          }
        }}
      >
        <p className="mb-3 px-1 text-[10px] uppercase tracking-[0.24em] text-gold/80">
          {range?.from && !isCompleteRange(range)
            ? "Select check-out date"
            : "Select check-in, then check-out"}
        </p>
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={range}
          defaultMonth={range?.from ?? new Date()}
          onSelect={(next) => {
            // react-day-picker often sets from === to on first click — keep that as start only
            if (next?.from && next?.to && isSameDay(next.from, next.to)) {
              pickingEndRef.current = true;
              onChange({ from: next.from, to: undefined });
              return;
            }

            if (next?.from && !next?.to) {
              pickingEndRef.current = true;
              onChange(next);
              return;
            }

            if (isCompleteRange(next)) {
              pickingEndRef.current = false;
              onChange(next);
              setOpen(false);
              return;
            }

            onChange(next);
          }}
          disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
          className="rounded-none bg-charcoal text-bone [--cell-size:2.25rem]"
        />
      </PopoverContent>
    </Popover>
  );
}

export function GuestsField({
  adults,
  childrenCount,
  onAdultsChange,
  onChildrenChange,
  adultsLabel,
  childrenLabel,
}: {
  adults: number;
  childrenCount: number;
  onAdultsChange: (n: number) => void;
  onChildrenChange: (n: number) => void;
  adultsLabel: string;
  childrenLabel: string;
}) {
  return (
    <FieldShell className="gap-4 sm:gap-5">
      <GuestsIcon />
      <div className="grid flex-1 grid-cols-2 gap-3">
        <GuestSelect
          label={adultsLabel}
          value={adults}
          min={1}
          max={8}
          onChange={onAdultsChange}
        />
        <GuestSelect
          label={childrenLabel}
          value={childrenCount}
          min={0}
          max={6}
          onChange={onChildrenChange}
        />
      </div>
    </FieldShell>
  );
}

function GuestSelect({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <label className="relative min-w-0">
      <span className="mb-1 block text-[9px] font-medium uppercase tracking-[0.22em] text-gold/80">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full appearance-none bg-transparent pr-5 text-base text-bone focus:outline-none"
          aria-label={label}
        >
          {options.map((n) => (
            <option key={n} value={n} className="bg-charcoal text-bone">
              {n}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2">
          <Chevron />
        </span>
      </div>
    </label>
  );
}
