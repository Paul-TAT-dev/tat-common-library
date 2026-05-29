import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { format as formatDateFn } from "date-fns";
import { useClickOutside } from "../hooks";
import { parseDate } from "../utils";
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

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

const daysInMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

const startDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1).getDay();

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
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  const formatDate = useCallback(
    (date: Date) => formatDateFn(date, format),
    [format],
  );

  /** Sync with external value. */
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
  }, [value, formatDate]);

  /** Close dropdown when clicking/tapping outside. */
  useClickOutside(wrapperRef, () => setIsOpen(false));

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = startDay(currentMonth);
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);
    return days;
  }, [currentMonth]);

  const handleSelectDate = useCallback(
    (date: Date) => {
      const formatted = formatDate(date);
      setSelectedDate(date);
      setManualInput(formatted);
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      setIsOpen(false);
      onChange(formatted);
    },
    [formatDate, onChange],
  );

  const handleDayClick = (day: number) => {
    handleSelectDate(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day),
    );
  };

  const shiftMonth = (delta: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + delta,
        1,
      ),
    );
  };

  const handleConfirmInput = () => {
    const parsed = parseDate(manualInput);
    if (parsed) {
      handleSelectDate(parsed);
    } else if (selectedDate) {
      setManualInput(formatDate(selectedDate));
    } else {
      setManualInput("");
    }
  };

  /** Delay closing to allow button clicks inside the dropdown to register. */
  const handleBlur = () => {
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
    <div className={`tat-datepicker ${className}`} ref={wrapperRef}>
      {label && (
        <label htmlFor={id} className="tat-datepicker-label">
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
        onChange={(e) => setManualInput(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="tat-datepicker-input"
      />

      {isOpen && !disabled && (
        <div className="tat-datepicker-dropdown">
          <div className="tat-datepicker-header">
            <button
              type="button"
              aria-label="Previous month"
              onMouseDown={shiftMonth(-1)}
            >
              &lt;
            </button>
            <span>
              {currentMonth.toLocaleString("default", { month: "long" })}{" "}
              {currentMonth.getFullYear()}
            </span>
            <button
              type="button"
              aria-label="Next month"
              onMouseDown={shiftMonth(1)}
            >
              &gt;
            </button>
          </div>

          <div className="tat-datepicker-grid">
            {WEEKDAY_LABELS.map((day) => (
              <div key={`label-${day}`} className="tat-datepicker-day-name">
                {day}
              </div>
            ))}

            {calendarDays.map((day, idx) => {
              if (!day) {
                return <div key={`daycell-${idx}`} aria-hidden />;
              }
              const isSelected =
                !!selectedDate &&
                day === selectedDate.getDate() &&
                selectedDate.getMonth() === currentMonth.getMonth() &&
                selectedDate.getFullYear() === currentMonth.getFullYear();

              return (
                <button
                  type="button"
                  key={`daycell-${idx}`}
                  className={`tat-datepicker-day ${
                    isSelected ? "is-selected" : ""
                  }`}
                  aria-pressed={isSelected}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleDayClick(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
