import Table from "react-bootstrap/Table";
import { add, format, isSameDay, parse, startOfWeek, toDate } from "date-fns";
import { generateIntervals, Interval } from "../../utils/prepareIntervals";
import CalendarDay from "./CalendarDay/CalendarDay";
import {
  dayFormat,
  Week,
  getWeekDayNames,
  getWeekAndAppointments,
  dateFormat,
} from "../../utils/calendarUtils";
import { useSelectedDay } from "../../context/SelectedDayContext";
import * as AppointmentApi from "../../network/appointmentApi";
import { useEffect, useState } from "react";
import styles from "../../styles/DentistCalendar.module.css";
interface DentistCalendarProps {
  refresh?: boolean;
  intervalValues: string[][];
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  maxSlotCount: number;
}

export interface WeekIntervals {
  day: number;
  interval: Interval;
}

const DentistCalendar = ({
  refresh,
  intervalValues,
  selectedDay,
  setSelectedDay,
  maxSlotCount,
}: DentistCalendarProps) => {
  const { week: numWeek } = useSelectedDay();
  const [week, setWeek] = useState<Week[]>([]);
  //   const [values, setValues] = useState<string[][]>([[]]);

  useEffect(() => {
    async function getAppointmentsBetweenDates() {
      try {
        const baseWeek = getWeekAndAppointments(numWeek);
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
  }, [refresh, numWeek]);

  const dayOfWeek = (index: number) =>
    format(
      add(startOfWeek(new Date()), { weeks: numWeek, days: index }),
      dayFormat
    );
  console.log(intervalValues);

  console.log("maxSlotCount", maxSlotCount);
  console.log("values", intervalValues);
  return (
    <>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            {getWeekDayNames().map((dia, index) => (
              <th
                key={index}
                className={index === selectedDay ? styles.selected : ""}
                onClick={() => setSelectedDay(index)}
              >{`${dia} - ${dayOfWeek(index)}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {maxSlotCount > 0 &&
            [...Array(maxSlotCount)].map((_, timeIndex) => (
              <tr key={timeIndex}>
                {intervalValues.map((timeSlots, dayIndex) => (
                  <td key={dayIndex}>{timeSlots?.[timeIndex] || ""}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default DentistCalendar;
