import { format, addMinutes, startOfDay, isBefore } from "date-fns";

interface Interval {
  interval: string;
  startTime: string;
  endTime: string;
}

export function generateIntervals(value: Interval): string[] {
  const { interval, startTime, endTime } = value;

  const inputFormat = "HH:mm:ss";
  const outputFormat = "HH:mm";
  const intervals: string[] = [];

  const startTimeDate = parseTime(startTime, inputFormat);
  const endTimeDate = parseTime(endTime, inputFormat);

  let currentTime = startTimeDate;
  while (isBefore(currentTime, endTimeDate)) {
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
