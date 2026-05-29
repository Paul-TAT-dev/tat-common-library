import {
  SquareAsterisk,
  SquareCheckBig,
  SquarePen,
  SquareX,
} from "lucide-react";
import { FC, memo } from "react";

import "./Tab.scss";

interface TabProps {
  value: string;
  isSelected: boolean;
  onClick: () => void;
  status?: "success" | "alert" | "error" | "todo";
  title?: string;
  disabled?: boolean;
}

const STATUS_ICONS = {
  success: SquareCheckBig,
  alert: SquareAsterisk,
  error: SquareX,
  todo: SquarePen,
} as const;

const Tab: FC<TabProps> = ({
  value,
  isSelected,
  onClick,
  status,
  title,
  disabled = false,
}) => {
  const StatusIcon = status ? STATUS_ICONS[status] : null;
  const selectedClass = isSelected ? "is-active" : "border-0";

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      title={title}
      onClick={onClick}
      className={`tat-tab w-100 btn btn-outline-secondary ${selectedClass} px-3 px-md-2 py-2 d-flex ${
        status ? `tat-tab-${status}` : ""
      } ${disabled ? "is-disabled" : ""}`}
    >
      <div className="col-12 d-flex justify-content-between align-items-center">
        <div className="text-start d-flex align-items-center">
          {StatusIcon && (
            <StatusIcon height={16} width={16} className="flex-shrink-0" />
          )}
          <span className="flex-grow-1 ms-1">{value}</span>
        </div>
      </div>
    </button>
  );
};

export default memo(Tab);
