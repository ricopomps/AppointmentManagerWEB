import Table from "react-bootstrap/Table";
import { add, format, startOfWeek } from "date-fns";
import { generateIntervals, Interval } from "../../utils/prepareIntervals";
import CalendarDay from "./CalendarDay/CalendarDay";
import {
  Subtitle,
  getTooltip,
  check,
  dayFormat,
  Week,
  getWeekDayNames,
} from "../../utils/calendarUtils";

const Calendar = () => {
  const intervalValues: Interval = {
    interval: "00:30:00",
    startTime: "08:00:00",
    endTime: "18:00:00",
    breakStartTime: "12:00:00",
    breakEndTime: "14:00:00",
  };

  const week: Week[] = [
    { day: "11/06/2023", schedules: [] },
    { day: "12/06/2023", schedules: [] },
    { day: "13/06/2023", schedules: [] },
    { day: "14/06/2023", schedules: [] },
    { day: "15/06/2023", schedules: [] },
    { day: "16/06/2023", schedules: [] },
    { day: "17/06/2023", schedules: [] },
  ];
  const numWeek = 0;

  const dayOfWeek = (index: number) =>
    format(
      add(startOfWeek(new Date()), { weeks: numWeek, days: index }),
      dayFormat
    );

  return (
    <>
      {/* <PaginationComponent
        onBack={() =>
          numWeek > 0 &&
          dispatch({
            type: CHANGE_WEEK,
            payload: { numWeek: numWeek - 1 },
          })
        }
        onCenter={() =>
          dispatch({
            type: CHANGE_WEEK,
            payload: { numWeek: 0 },
          })
        }
        onFront={() =>
          dispatch({
            type: CHANGE_WEEK,
            payload: { numWeek: numWeek + 1 },
          })
        }
      ></PaginationComponent> */}
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            {getWeekDayNames().map((dia, index) => (
              <th key={index}>{`${dia} - ${dayOfWeek(index)}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {generateIntervals(intervalValues).map((interval, index) => (
            <tr key={index}>
              {week.map((week, index) => {
                const checking = check(interval, week);
                return (
                  <td key={index}>
                    <CalendarDay
                      Vacant={checking}
                      tooltip={getTooltip(checking)}
                      disabled={checking === Subtitle.Occupied}
                      onClick={() => {
                        console.log("clicado!");
                        // dispatch({
                        //   type: SET_FORM,
                        //   payload: {
                        //     schedule: interval,
                        //     date: (day.day, dateFormat).toDate(),
                        //   },
                        // });
                      }}
                    >
                      {interval}
                    </CalendarDay>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Calendar;
