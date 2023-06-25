import { ReactNode } from "react";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Subtitle } from "../../../utils/calendarUtils";

interface CalendarDayProps {
  onClick: () => void;
  children: ReactNode;
  Vacant: string;
  disabled: boolean;
  tooltip: string;
  selected: boolean;
}
const CalendarDay = ({
  onClick,
  children,
  Vacant,
  disabled,
  tooltip,
  selected,
}: CalendarDayProps) => {
  return (
    <OverlayTrigger
      overlay={<Tooltip id="tooltip-disabled">{tooltip}</Tooltip>}
    >
      <span className="d-inline-block">
        <Button
          variant={selected ? Subtitle.Selected : Vacant}
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </Button>
      </span>
    </OverlayTrigger>
  );
};

export default CalendarDay;
