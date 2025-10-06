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
  hide?: boolean;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  format?: "currency" | "phone" | "email" | "text";
}

const Input: FC<InputProps> = ({
  id,
  value,
  placeholder,
  label,
  onChange,
  onKeyDown,
  hide,
  className,
  required,
  disabled = false,
  format = "text",
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
          onValueChange={(values) => onChange(values.value)} // raw numeric string
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
      } ${error ? "error" : ""}`}
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
        {...props}
      />
      {error && <div className="tat-input-error">{error}</div>}
    </div>
  );
};

export default memo(Input);
