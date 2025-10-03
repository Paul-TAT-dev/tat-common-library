import React, { FC, memo, ReactNode, useEffect, useRef, useState } from "react";
import { Tooltip as BTooltip, Overlay } from "react-bootstrap";

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
}) => {
  const [isShow, setIsShow] = useState(false);

  const targetRef = useRef<HTMLSpanElement | null>(null);

  const tip = info || customInfo;

  useEffect(() => {
    if (isControllable) {
      setIsShow(controlShow || false);
    }
  }, [controlShow]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        targetRef.current &&
        !targetRef.current.contains(event.target as Node)
      ) {
        if (isControllable) {
          setControlShow && setControlShow("");
        } else {
          setIsShow(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isControllable, setControlShow]);

  return (
    <>
      <span
        ref={targetRef}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        onClick={handleOnMouseEnter}
        className={`tooltip-icon ${className}`}
      >
        {icon}
      </span>
      <Overlay target={targetRef.current} placement={placement} show={isShow}>
        {(props) => (
          <BTooltip id="tat-tooltip" {...props}>
            <span>{tip}</span>
          </BTooltip>
        )}
      </Overlay>
    </>
  );
};

export default memo(Tooltip);
