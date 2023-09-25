import { addMinutes, format, isBefore, startOfDay } from "date-fns";

export interface Interval {
  interval: string;
  startTime: string;
  endTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
}

export function generateIntervals(value: Interval): string[] {
  const { interval, startTime, endTime, breakStartTime, breakEndTime } = value;

  const inputFormat = "HH:mm:ss";
  const outputFormat = "HH:mm";
  const intervals: string[] = [];

  const startTimeDate = parseTime(startTime, inputFormat);
  const endTimeDate = parseTime(endTime, inputFormat);
  let breakStartDateTime: Date | undefined;
  let breakEndDateTime: Date | undefined;

  if (breakStartTime && breakEndTime) {
    breakStartDateTime = parseTime(breakStartTime, inputFormat);
    breakEndDateTime = parseTime(breakEndTime, inputFormat);
  }
  let currentTime = startTimeDate;

  while (isBefore(currentTime, endTimeDate)) {
    const isOnABreak =
      breakStartDateTime &&
      breakEndDateTime &&
      currentTime >= breakStartDateTime &&
      currentTime < breakEndDateTime;

    if (isOnABreak) {
      currentTime = breakEndDateTime!;
    }
    const endTimeOfInterval = addMinutes(
      currentTime,
      getIntervalMinutes(interval)
    );
    const intervalFormat =
      format(currentTime, outputFormat) +
      " - " +
      format(endTimeOfInterval, outputFormat);
    intervals.push(intervalFormat);
    currentTime = endTimeOfInterval;
  }

  return intervals;
}

function parseTime(time: string, format: string): Date {
  const now = new Date();
  const [hours, minutes, seconds] = time.split(":");
  return setHoursMinutesSeconds(now, {
    hours: +hours,
    minutes: +minutes,
    seconds: +seconds,
  });
}

function setHoursMinutesSeconds(
  date: Date,
  {
    hours,
    minutes,
    seconds,
  }: { hours: number; minutes: number; seconds: number }
): Date {
  const updatedDate = startOfDay(date);
  updatedDate.setHours(hours);
  updatedDate.setMinutes(minutes);
  updatedDate.setSeconds(seconds);
  return updatedDate;
}

function getIntervalMinutes(interval: string): number {
  const [hours, minutes, seconds] = interval.split(":").map(Number);
  return hours * 60 + minutes + seconds / 60;
}
