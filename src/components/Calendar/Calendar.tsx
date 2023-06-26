import Table from "react-bootstrap/Table";
import { add, format, isSameDay, parse, startOfWeek, toDate } from "date-fns";
import { generateIntervals, Interval } from "../../utils/prepareIntervals";
import CalendarDay from "./CalendarDay/CalendarDay";
import {
  Subtitle,
  getTooltip,
  check,
  dayFormat,
  Week,
  getWeekDayNames,
  getWeekAndAppointments,
  dateFormat,
} from "../../utils/calendarUtils";
import { useSelectedDay } from "../../context/SelectedDayContext";
import * as AppointmentApi from "../../network/AppointmentApi";
import { useEffect, useState } from "react";

interface CalendarProps {
  refresh: boolean;
}

const Calendar = ({ refresh }: CalendarProps) => {
  const { selectedDay, setSelectedDay } = useSelectedDay();
  const [week, setWeek] = useState<Week[]>([]);

  useEffect(() => {
    async function getAppointmentsBetweenDates() {
      try {
        const baseWeek = getWeekAndAppointments();
        const appointmentsFromWeek =
          await AppointmentApi.getAppointmentsBetweenDates({
            startDate: parse(
              baseWeek[0].day.toString(),
              dateFormat,
              new Date()
            ),
            endDate: parse(baseWeek[6].day.toString(), dateFormat, new Date()),
          });

        const formatedData = baseWeek.map((w) => {
          return {
            day: w.day,
            schedules: appointmentsFromWeek
              .filter((a) =>
                isSameDay(
                  toDate(Date.parse(a.day.toString())),
                  parse(w.day, dateFormat, new Date())
                )
              )
              .map((a) => a.interval),
          };
        });
        setWeek(formatedData);
      } catch (error) {
        console.error(error);
      }
    }
    getAppointmentsBetweenDates();
  }, [refresh]);

  const intervalValues: Interval = {
    interval: "00:30:00",
    startTime: "08:00:00",
    endTime: "18:00:00",
    breakStartTime: "12:00:00",
    breakEndTime: "14:00:00",
  };

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
                      selected={
                        selectedDay?.index === index &&
                        selectedDay?.interval === interval
                      }
                      onClick={() => {
                        setSelectedDay({ index, interval, day: week.day });
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
