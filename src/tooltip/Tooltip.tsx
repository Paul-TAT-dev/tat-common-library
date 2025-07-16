import parse from 'html-react-parser';
import { CircleHelp } from 'lucide-react';
import React, { FC, memo } from 'react';
import { Tooltip as BTooltip, OverlayTrigger } from 'react-bootstrap';

interface TooltipProps {
  info: string;
}

const Tooltip: FC<TooltipProps> = ({ info }) => {
  return (
    <OverlayTrigger
      placement="top" // or any other placement option
      overlay={<BTooltip>{parse(info)}</BTooltip>}
    >
      <CircleHelp height={16} width={16} />
    </OverlayTrigger>
  );
};

export default memo(Tooltip);
