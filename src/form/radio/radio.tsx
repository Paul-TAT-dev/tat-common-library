import React from "react";

export interface OptionObject {
  id: string;
  label: string;
}

type RadioGroupProps<T extends string | OptionObject> = {
  id: string;
  name: string;
  value: T | null;
  options: T[];
  onChange: (value: T) => void;
  getLabel?: (option: T) => string;
  getKey?: (option: T, idx: number) => string;
  required?: boolean;
  disabled?: boolean;
  hide?: boolean;
  color?: string; // ✅ new prop
  className?: string;
};

function RadioGroup<T extends string | OptionObject>({
  id,
  name,
  value,
  options,
  onChange,
  getLabel,
  getKey,
  required = false,
  disabled = false,
  hide = false,
  color = "#005fcc", // ✅ default color (blue)
  className,
}: RadioGroupProps<T>) {
  if (hide) return null;

  const isObjectMode = typeof options[0] === "object";

  const resolveLabel = (opt: T) =>
    getLabel
      ? getLabel(opt)
      : isObjectMode
      ? (opt as OptionObject).label
      : (opt as string);

  const resolveKey = (opt: T, idx: number) =>
    getKey
      ? getKey(opt, idx)
      : isObjectMode
      ? (opt as OptionObject).id
      : `${opt}-${idx}`;

  const isSelected = (opt: T) =>
    isObjectMode
      ? (value as OptionObject | null)?.id === (opt as OptionObject).id
      : value === opt;

  return (
    <div id={id} className={className}>
      {options.map((opt, idx) => {
        const key = resolveKey(opt, idx);
        const label = resolveLabel(opt);
        const selected = isSelected(opt);

        return (
          <label
            key={key}
            style={{
              display: "block",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
              color: selected ? color : "inherit", // ✅ label text color
              marginRight: "10px",
            }}
          >
            <input
              type="radio"
              name={name}
              value={key}
              checked={selected}
              onChange={() => onChange(opt)}
              required={required}
              disabled={disabled}
              style={{
                accentColor: color, // ✅ modern browsers (Chrome/Edge/Firefox)
              }}
            />
            <span style={{ marginLeft: "6px" }}>{label}</span>
          </label>
        );
      })}
    </div>
  );
}

export default RadioGroup;
