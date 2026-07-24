import { FC, memo, useState } from "react";
import "./input.scss";

// Phone input (install: npm install react-phone-input-2)
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Number format (install: npm install react-number-format)
import { NumericFormat, PatternFormat } from "react-number-format";

interface InputProps {
  id: string;
  value: string;
  placeholder?: string;
  label?: string;
  onChange: (value: string) => void; // always string
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  hide?: boolean;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  format?: "currency" | "phone" | "email" | "text";
  maxLength?: number;
}

const Input: FC<InputProps> = ({
  id,
  value,
  placeholder,
  label,
  onChange,
  onKeyDown,
  onBlur,
  hide,
  className,
  required,
  disabled = false,
  format = "text",
  maxLength,
  ...props
}) => {
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Validation helpers
  const validateEmail = (val: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(val);
  };

  const handleBlur = () => {
    setDirty(true);

    if (format === "email") {
      setError(validateEmail(value) ? null : "Invalid email format");
    }

    onBlur?.();
  };

  // Phone input
  if (format === "phone") {
    return (
      <div
        className={`tat-input-wrapper ${hide ? "d-none" : ""} ${
          className || ""
        }`}
      >
        {label && (
          <label className="tat-input-label" htmlFor={id}>
            {label} {required && <span style={{ color: "red" }}>*</span>}
          </label>
        )}
        <PhoneInput
          country={"us"}
          value={value}
          disabled={disabled}
          onChange={(val: string) => onChange(val)}
          inputProps={{
            name: id,
            required,
            autoFocus: false,
          }}
        />
      </div>
    );
  }

  // Currency input
  if (format === "currency") {
    return (
      <div
        className={`tat-input-wrapper ${hide ? "d-none" : ""} ${
          className || ""
        }`}
      >
        {label && (
          <label className="tat-input-label" htmlFor={id}>
            {label} {required && <span style={{ color: "red" }}>*</span>}
          </label>
        )}
        <NumericFormat
          id={id}
          value={value}
          thousandSeparator
          prefix="$ "
          placeholder={placeholder}
          className="tat-input"
          onValueChange={(values) => {
            // maxLength here caps the raw numeric string (values.value —
            // no "$", no thousand separators), matching what actually gets
            // submitted, not the longer formatted display string. Reject
            // the keystroke entirely rather than truncating, so a value
            // already at the cap can't silently lose its last digit.
            if (maxLength && values.value.length > maxLength) return;
            onChange(values.value);
          }}
          disabled={disabled}
          onBlur={handleBlur}
          decimalScale={2}
          fixedDecimalScale={true}
          {...props}
        />
        {error && <div className="tat-input-error">{error}</div>}
      </div>
    );
  }

  // Email & Text input
  return (
    <div
      className={`tat-input-wrapper ${hide ? "d-none" : ""} ${
        className || ""
      } ${error ? "has-error" : ""}`}
    >
      {label && (
        <label className="tat-input-label" htmlFor={id}>
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <input
        id={id}
        type={format === "email" ? "email" : "text"}
        value={value}
        placeholder={placeholder}
        className="tat-input"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        {...props}
      />
      {error && <div className="tat-input-error">{error}</div>}
    </div>
  );
};

export default memo(Input);
