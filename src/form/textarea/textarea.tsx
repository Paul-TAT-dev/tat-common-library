import React, { ChangeEvent, FC } from "react";

import "./textarea.scss";

interface TTextAreaProps {
  id: string;
  label?: string;
  value: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  hide?: boolean;
  className?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: FC<
  TTextAreaProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({
  id,
  label,
  value,
  placeholder = "-- Enter text --",
  rows = 4,
  required = false,
  disabled = false,
  hide = false,
  className,
  onChange,
  ...props
}) => {
  if (hide) return null;

  return (
    <div className={`textarea-wrapper ${className || ""}`}>
      {label && (
        <label htmlFor={id} className="textarea-label">
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        onChange={onChange}
        className="textarea-field"
        {...props}
      />
    </div>
  );
};

export default TextArea;
