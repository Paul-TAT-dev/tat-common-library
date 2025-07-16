import { ChangeEvent, FC, memo } from 'react';

import './select.css';

interface SelectProps {
  id: string;
  placeholder: string;
  label: string;
  options: {
    id: string;
    value?: string;
    text?: string;
  }[];
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const Select: FC<SelectProps> = ({
  id,
  placeholder,
  label,
  options,
  value,
  onChange
}) => {
  return (
    <div className="form-floating-sm form-floating mb-3">
      <select
        className="form-select"
        id={id}
        aria-label={placeholder}
        onChange={onChange}
      >
        <option key="0" value="">
          -- Select an option --
        </option>
        {options.map((option, idx) => (
          <option
            key={option.id}
            value={option.value || option.text}
            selected={option.value === value || option.text === value}
          >
            {option.value || option.text}
          </option>
        ))}
      </select>
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default memo(Select);
