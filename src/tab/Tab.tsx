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
}

const Tab: FC<TabProps> = ({ value, isSelected, onClick, status }) => {
  const isSelectedClass = isSelected ? "active btnClass" : "border-0";

  const renderStatusIcon = () => {
    switch (status) {
      case "success":
        return (
          <SquareCheckBig height={16} width={16} className="flex-shrink-0" />
        );
      case "alert":
        return (
          <SquareAsterisk height={16} width={16} className="flex-shrink-0" />
        );
      case "error":
        return <SquareX height={16} width={16} className="flex-shrink-0" />;
      case "todo":
        return <SquarePen height={16} width={16} className="flex-shrink-0" />;
      default:
        return "";
    }
  };

  return (
    <div
      className={`tat-tab w-100 btn btn-outline-secondary ${isSelectedClass} px-3 px-md-2 py-2 d-flex tat-${status}`}
      onClick={onClick}
    >
      <div className="col-12 d-flex justify-content-between align-items-center">
        <div className="text-start d-flex align-items-center">
          {renderStatusIcon()}
          <label className="flex-grow-1 ms-1">{value}</label>
        </div>
      </div>
    </div>
  );
};

export default memo(Tab);
