import { FC, useState, useRef, useEffect, useMemo } from "react";
import "./DatePicker.scss";

interface DatePickerProps {
  id: string;
  label?: string;
  value: string;
  format?: string; // e.g. "YYYY-MM-DD", "MM/DD/YYYY"
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hide?: boolean;
  classNames?: string;
  onChange: (value: string) => void;
}

const DatePicker: FC<DatePickerProps> = ({
  id,
  label,
  value,
  format = "YYYY-MM-DD",
  placeholder = "-- Select date --",
  required = false,
  disabled = false,
  hide = false,
  classNames = "",
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [manualInput, setManualInput] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ✅ sync external value to manual input
  useEffect(() => {
    setManualInput(value);
  }, [value]);

  // ✅ Close dropdown when clicking outside
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

  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const startDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // ✅ Generate calendar days
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = startDay(currentMonth);

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);

    return days;
  }, [currentMonth]);

  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    switch (format) {
      case "MM/DD/YYYY":
        return `${mm}/${dd}/${yyyy}`;
      case "DD/MM/YYYY":
        return `${dd}/${mm}/${yyyy}`;
      case "MM/YY":
        return `${mm}/${yyyy.toString().slice(-2)}`;
      default:
        return `${yyyy}-${mm}-${dd}`;
    }
  };

  const parseDate = (val: string) => {
    const parts = val.split(/[-/]/);
    let yyyy = 0,
      mm = 0,
      dd = 0;

    if (format === "YYYY-MM-DD" && parts.length === 3) {
      [yyyy, mm, dd] = [Number(parts[0]), Number(parts[1]), Number(parts[2])];
    } else if (format === "MM/DD/YYYY" && parts.length === 3) {
      [mm, dd, yyyy] = [Number(parts[0]), Number(parts[1]), Number(parts[2])];
    } else if (format === "DD/MM/YYYY" && parts.length === 3) {
      [dd, mm, yyyy] = [Number(parts[0]), Number(parts[1]), Number(parts[2])];
    }
    if (yyyy && mm && dd) {
      const d = new Date(yyyy, mm - 1, dd);
      if (
        d.getFullYear() === yyyy &&
        d.getMonth() === mm - 1 &&
        d.getDate() === dd
      ) {
        return d;
      }
    }
    return null;
  };

  const handleSelectDate = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const formatted = formatDate(selectedDate);
    setManualInput(formatted);
    onChange(formatted);
    setIsOpen(false);
  };

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualInput(e.target.value);
  };

  const handleBlur = () => {
    const parsed = parseDate(manualInput);
    if (parsed) {
      const formatted = formatDate(parsed);
      setManualInput(formatted);
      onChange(formatted);
    } else {
      // reset if invalid
      setManualInput(value);
    }
  };

  if (hide) return null;

  return (
    <div className={`datepicker-wrapper ${classNames || ""}`} ref={wrapperRef}>
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
        className="datepicker-input"
      />

      {isOpen && !disabled && (
        <div className="datepicker-dropdown">
          <div className="datepicker-header">
            <button onClick={prevMonth}>&lt;</button>
            <span>
              {currentMonth.toLocaleString("default", {
                month: "long",
              })}{" "}
              {currentMonth.getFullYear()}
            </span>
            <button onClick={nextMonth}>&gt;</button>
          </div>
          <div className="datepicker-grid">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="datepicker-day-name">
                {day}
              </div>
            ))}
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={`datepicker-day ${
                  day &&
                  value ===
                    formatDate(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        day
                      )
                    )
                    ? "selected"
                    : ""
                }`}
                onClick={() => day && handleSelectDate(day)}
              >
                {day || ""}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
