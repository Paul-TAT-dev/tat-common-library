import React, { FC, useState, useRef, useEffect, useMemo } from "react";
import { parse, parseISO, format as formatDateFn, isValid } from "date-fns";
import "./DatePicker.scss";

interface DatePickerProps {
  id: string;
  label?: string;
  value: string;
  format?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hide?: boolean;
  className?: string;
  onChange: (value: string) => void;
}

const COMMON_FORMATS = [
  "yyyy-MM-dd",
  "MM/dd/yyyy",
  "MM-dd-yyyy",
  "MM.dd.yyyy",
  "MM dd yyyy",
  "MM/dd/yy",
  "MM.dd.yy",
  "MM-dd-yy",
  "MM dd yy",
  "ddMMMyy",
  "dd MMM yy",
  "dd MMM yyyy",
  "MMM dd yyyy",
  "MMMM dd yyyy",
  "MMMM dd",
  "MMM dd",
  "MMMM d, yyyy",
  "MMM d, yyyy",
  "MMMM d",
  "MMM d",
  "MM/dd",
  "MM.dd",
  "MM-dd",
  "MM dd",
];

const DatePicker: FC<DatePickerProps> = ({
  id,
  label,
  value,
  format = "yyyy-MM-dd",
  placeholder = "-- Select date --",
  required = false,
  disabled = false,
  hide = false,
  className = "",
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  /** Parse helper */
  const parseDate = (val: string): Date | null => {
    if (!val) return null;
    const trimmed = val.trim();
    const iso = parseISO(trimmed);
    if (isValid(iso)) return iso;
    for (const fmt of COMMON_FORMATS) {
      const parsed = parse(trimmed, fmt, new Date());
      if (isValid(parsed)) return parsed;
    }
    const jsDate = new Date(trimmed);
    return isValid(jsDate) ? jsDate : null;
  };

  const formatDate = (date: Date) => formatDateFn(date, format);

  /** Sync with external value */
  useEffect(() => {
    const parsed = parseDate(value);
    if (!parsed) {
      setSelectedDate(null);
      setManualInput("");
      return;
    }
    setSelectedDate(parsed);
    setManualInput(formatDate(parsed));
    setCurrentMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
  }, [value, format]);

  /** Close on click outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Calendar helpers */
  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = startDay(currentMonth);
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);
    return days;
  }, [currentMonth]);

  /** Select date */
  const handleSelectDate = (date: Date) => {
    const displayValue = formatDateFn(date, format);
    const isoValue = formatDateFn(date, "yyyy-MM-dd");
    setSelectedDate(date);
    setManualInput(displayValue);
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setIsOpen(false);
    onChange(isoValue);
  };

  /** Day click */
  const handleDayClick = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    handleSelectDate(newDate);
  };

  /** Month navigation (keep dropdown open) */
  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  /** Manual typing */
  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualInput(e.target.value);
  };

  const handleConfirmInput = () => {
    const parsed = parseDate(manualInput);
    if (parsed) {
      handleSelectDate(parsed);
    } else {
      if (selectedDate) setManualInput(formatDate(selectedDate));
      else setManualInput("");
    }
  };

  /**
   * Blur fix — delay closing to allow button clicks inside dropdown
   */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(document.activeElement)
      ) {
        handleConfirmInput();
        setIsOpen(false);
      }
    }, 120);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirmInput();
    }
  };

  if (hide) return null;

  return (
    <div className={`datepicker-wrapper ${className}`} ref={wrapperRef}>
      {label && (
        <label htmlFor={id} className="datepicker-label">
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}

      <input
        id={id}
        type="text"
        value={manualInput}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onFocus={() => !disabled && setIsOpen(true)}
        onChange={handleManualChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="datepicker-input"
      />

      {isOpen && !disabled && (
        <div className="datepicker-dropdown">
          <div className="datepicker-header">
            <button type="button" onMouseDown={prevMonth}>
              &lt;
            </button>
            <span>
              {currentMonth.toLocaleString("default", { month: "long" })}{" "}
              {currentMonth.getFullYear()}
            </span>
            <button type="button" onMouseDown={nextMonth}>
              &gt;
            </button>
          </div>

          <div className="datepicker-grid">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={`label-${day}`} className="datepicker-day-name">
                {day}
              </div>
            ))}

            {calendarDays.map((day, idx) => {
              const isSelected =
                !!selectedDate &&
                day === selectedDate.getDate() &&
                selectedDate.getMonth() === currentMonth.getMonth() &&
                selectedDate.getFullYear() === currentMonth.getFullYear();

              return (
                <div
                  key={`daycell-${idx}`}
                  className={`datepicker-day ${isSelected ? "selected" : ""}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => day && handleDayClick(day)}
                >
                  {day || ""}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
