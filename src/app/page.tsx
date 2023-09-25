"use client";

import ProfileImage from "@/components/ProfileImage";
import { generateIntervals } from "@/utils/prepareIntervals";
import { Button, Col } from "react-bootstrap";

export interface Interval {
  interval: string;
  startTime: string;
  endTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
}
export default function Home() {
  return (
    <div>
      <DentistGuy />
    </div>
  );
}

function DentistGuy() {
  const intervalValues: Interval = {
    interval: "00:30:00",
    startTime: "08:00:00",
    endTime: "18:00:00",
    breakStartTime: "12:00:00",
    breakEndTime: "14:00:00",
  };

  const week = Array.from({ length: 7 }, (_, index) => index);

  const data = week.map((week) => ({
    day: week + 1,
    intervals: generateIntervals(intervalValues),
  }));

  const dentists = [
    {
      dentist: "Julia",
      schedules: data,
    },
    {
      dentist: "Naty",
      schedules: data,
    },
  ];

  const day = 1;
  return (
    <div>
      {dentists.map((dentist) => {
        const daySchedule = dentist.schedules.find(
          (schedule) => schedule.day === day
        );
        return (
          <div className="d-flex gap-2 p-2">
            <div className="d-flex flex-column justify-content-center">
              <ProfileImage />
              <p>{dentist.dentist}</p>
            </div>
            <div className="d-flex gap-2">
              <Col className="p-2 ">
                {daySchedule &&
                  daySchedule.intervals.map((schedules) => {
                    return (
                      <Button
                        variant="outline-primary"
                        className="text-nowrap m-2"
                      >
                        {schedules}
                      </Button>
                    );
                  })}
              </Col>
            </div>
          </div>
        );
      })}
    </div>
  );
}
