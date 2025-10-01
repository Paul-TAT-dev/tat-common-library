import { ChangeEvent, FC, memo } from "react";

import "./input.scss";

interface InputProps {
  id: string;
  value: string;
  placeholder: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  hide?: boolean;
  className?: string;
  required?: boolean;
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
  ...props
}) => {
  return (
    <div className={`tat-input-wrapper ${hide ? "d-none" : ""} ${className}`}>
      <label className="tat-input-label" htmlFor={id}>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <input
        type="text"
        value={value}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        {...props}
      />
    </div>
  );
};

export default memo(Input);
