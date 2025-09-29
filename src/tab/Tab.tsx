import { FC, memo } from "react";

interface TabProps {
  value: string;
  isSelected: boolean;
  onClick: () => void;
}

const Tab: FC<TabProps> = ({ value, isSelected, onClick }) => {
  const isSelectedClass = isSelected ? "active btnClass" : "border-0";

  return (
    <div
      className={`w-100 btn btn-outline-secondary ${isSelectedClass} px-3 px-md-2 py-2 d-flex`}
      onClick={onClick}
    >
      <div className="col-12 d-flex justify-content-between align-items-center">
        <div className="text-start">{value}</div>
      </div>
    </div>
  );
};

export default memo(Tab);
