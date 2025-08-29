import { ChangeEvent, FC, memo } from "react";

import "./checkbox.css";

interface CheckboxProps {
  id: string;
  label: string;
  isChecked?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: FC<
  CheckboxProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({ id, label, isChecked, onChange, ...props }) => {
  return (
    <div className="form-floating-sm form-check mb-3">
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
