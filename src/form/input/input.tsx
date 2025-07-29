import { ChangeEvent, FC, memo } from "react";

import "./input.scss";

interface InputProps {
  id: string;
  value: string;
  placeholder: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({ id, value, placeholder, label, onChange }) => {
  return (
    <div className="form-floating-sm form-floating mb-3">
      <input
        type="text"
        value={value}
        className="form-control"
        id={id}
        placeholder={placeholder}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default memo(Input);
