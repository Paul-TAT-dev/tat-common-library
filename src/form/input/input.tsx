import { ChangeEvent, FC, memo, useState } from "react";
import "./input.scss";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface InputProps {
  id: string;
  value: string;
  placeholder?: string;
  label?: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  hide?: boolean;
  className?: string;
  required?: boolean;
  format?: "currency" | "phone" | "email" | "creditCard" | "text";
}

const Input: FC<InputProps & React.InputHTMLAttributes<HTMLInputElement>> = ({
  id,
  value,
  placeholder,
  label,
  onChange,
  onKeyDown,
  hide,
  className,
  required,
  format = "text",
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (val: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(val);
  };

  const validateCreditCard = (val: string) => {
    const digits = val.replace(/\D/g, "");
    return digits.length >= 15 && digits.length <= 19;
  };

  const handleCurrencyChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d.]/g, "");
    if (val) {
      const num = parseFloat(val);
      val = isNaN(num) ? "" : `$ ${num.toFixed(2)}`;
    }
    setInternalValue(val);
    onChange(val);
  };

  const handleCreditCardChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    val = val.replace(/(.{4})/g, "$1 ").trim();
    setInternalValue(val);
    onChange(val);

    if (dirty) {
      setError(
        validateCreditCard(val) ? null : "Credit card must be 15–19 digits"
      );
    }
  };

  const handleDefaultChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange(e.target.value);

    if (dirty && format === "email") {
      setError(validateEmail(e.target.value) ? null : "Invalid email format");
    }
  };

  const handleBlur = () => {
    setDirty(true);
    if (format === "email") {
      setError(validateEmail(internalValue) ? null : "Invalid email format");
    }
    if (format === "creditCard") {
      setError(
        validateCreditCard(internalValue)
          ? null
          : "Credit card must be 15–19 digits"
      );
    }
  };

  // Special: Phone input
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
          onChange={(val) => onChange(val)}
          inputProps={{
            name: id,
            required,
            autoFocus: false,
          }}
        />
      </div>
    );
  }

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
        placeholder={placeholder}
        value={internalValue}
        onChange={
          format === "currency"
            ? handleCurrencyChange
            : format === "creditCard"
            ? handleCreditCardChange
            : handleDefaultChange
        }
        onKeyDown={onKeyDown}
        onBlur={handleBlur}
        required={required}
        {...props}
      />
      {error && <div className="tat-input-error">{error}</div>}
    </div>
  );
};

export default memo(Input);
