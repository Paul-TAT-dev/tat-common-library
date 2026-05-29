import { CSSProperties } from "react";
import { OptionObject } from "../../types";
import "./radio.scss";

export type { OptionObject };

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
  /** Accent color for the selected radio. Defaults to the library's primary. */
  color?: string;
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
  color,
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

  // Forward the color prop to CSS via custom property.
  const wrapperStyle = color
    ? ({ "--tat-radio-color": color } as CSSProperties)
    : undefined;

  return (
    <div
      id={id}
      className={`tat-radio-group ${className ?? ""}`}
      style={wrapperStyle}
      role="radiogroup"
    >
      {options.map((opt, idx) => {
        const key = resolveKey(opt, idx);
        const label = resolveLabel(opt);
        const selected = isSelected(opt);

        return (
          <label
            key={key}
            className={`tat-radio-option ${selected ? "is-selected" : ""} ${
              disabled ? "is-disabled" : ""
            }`}
          >
            <input
              type="radio"
              className="tat-radio-input"
              name={name}
              value={key}
              checked={selected}
              onChange={() => onChange(opt)}
              required={required}
              disabled={disabled}
            />
            <span className="tat-radio-label">{label}</span>
          </label>
        );
      })}
    </div>
  );
}

export default RadioGroup;
