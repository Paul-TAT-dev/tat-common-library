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
    <div className="tat-input-wrapper mb-3">
      <label className="tat-input-label" htmlFor={id}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default memo(Input);
