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
  className?: string;
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
  className,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const wrapperRef = useRef<HTMLDivElement>(null);

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

    // empty slots before start
    for (let i = 0; i < firstDay; i++) days.push(null);

    // actual days
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
      default:
        return `${yyyy}-${mm}-${dd}`;
    }
  };

  const handleSelectDate = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    onChange(formatDate(selectedDate));
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

  if (hide) return null;

  return (
    <div className={`datepicker-wrapper ${className || ""}`} ref={wrapperRef}>
      {label && (
        <label htmlFor={id} className="datepicker-label">
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onFocus={() => !disabled && setIsOpen(true)}
        readOnly
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
