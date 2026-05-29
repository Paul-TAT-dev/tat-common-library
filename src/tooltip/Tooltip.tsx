import React, { FC, memo, ReactNode, useEffect, useRef, useState } from "react";
import { Tooltip as BTooltip, Overlay } from "react-bootstrap";

import { useClickOutside } from "../hooks";
import "./Tooltip.scss";

interface TooltipProps {
  id?: string;
  info?: string;
  customInfo?: ReactNode;
  icon: ReactNode;
  isControllable?: boolean;
  controlShow?: boolean;
  setControlShow?: React.Dispatch<React.SetStateAction<string>>;
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
  inverted?: boolean;
}

const Tooltip: FC<TooltipProps> = ({
  id,
  info,
  customInfo,
  icon,
  isControllable,
  controlShow,
  setControlShow,
  placement = "top",
  className = "",
  inverted = true,
}) => {
  const [isShow, setIsShow] = useState(false);

  const targetRef = useRef<HTMLSpanElement | null>(null);

  const tip = info || customInfo;

  useEffect(() => {
    if (isControllable) {
      setIsShow(controlShow || false);
    }
  }, [controlShow, isControllable]);

  const handleOnMouseEnter = () => {
    if (isControllable) {
      setControlShow && setControlShow(id || "");
    } else {
      setIsShow(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (!isControllable) {
      setIsShow(false);
    }
  };

  useClickOutside(targetRef, () => {
    if (isControllable) {
      setControlShow?.("");
    } else {
      setIsShow(false);
    }
  });

  return (
    <>
      <span
        ref={targetRef}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        onClick={handleOnMouseEnter}
        className={`tat-tooltip-icon ${className}`}
      >
        {icon}
      </span>
      <Overlay target={targetRef.current} placement={placement} show={isShow}>
        {(props) => (
          <BTooltip
            id={id || "tat-tooltip"}
            {...props}
            className={`tat-tooltip ${inverted ? "tat-tooltip-inverted" : ""}`}
          >
            <span>{tip}</span>
          </BTooltip>
        )}
      </Overlay>
    </>
  );
};

export default memo(Tooltip);
