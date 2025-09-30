import { ChangeEvent, FC, memo } from "react";

import "./checkbox.css";

interface CheckboxProps {
  id: string;
  label: string;
  isChecked?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  hide?: boolean;
  className?: string;
}

const Checkbox: FC<
  CheckboxProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({ id, label, isChecked, onChange, hide, className, ...props }) => {
  return (
    <div
      className={`form-floating-sm form-check ${
        hide ? "d-none" : ""
      } ${className}`}
    >
      <input
        className="form-check-input"
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={onChange}
        {...props}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default memo(Checkbox);
