"use client";

import logo from "@/assets/images/logo.png";
import ProfileImage from "@/components/ProfileImage";
import { User } from "@/models/user";
import * as UsersApi from "@/network/api/user";
import { generateIntervals } from "@/utils/prepareIntervals";
import { capitalizeFirstLetter } from "@/utils/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Col, Nav, Row } from "react-bootstrap";
import styles from "./Home.module.css";
export interface Interval {
  interval: string;
  startTime: string;
  endTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
}

interface DentistSchedulesInterface {
  dentist: User;
  schedules: {
    day: number;
    intervals: string[];
  }[];
}

export default function Home() {
  const week = Array.from({ length: 7 }, (_, index) => {
    const dayValue = new Date(); // Initialize with the current date
    dayValue.setDate(dayValue.getDate() + index); // Increment the date for each day

    // Define the Portuguese day names
    const dayNames = [
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado",
      "domingo",
    ];

    return {
      dayNumber: index + 1, // Adding 1 to make it 1-based
      dayName: dayNames[index],
      dayValue: dayValue,
    };
  });

  //put consultorio name and day on query params

  return (
    <div className="d-flex gap-4">
      <ClinicView />
      <div>
        <Nav variant="tabs" defaultActiveKey={1}>
          {week.map((day) => (
            <Nav.Item key={day.dayValue.toString()}>
              <Nav.Link eventKey={day.dayNumber}>
                {capitalizeFirstLetter(day.dayName)}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
        <DentistSchedules />
      </div>
    </div>
  );
}

async function DentistSchedules() {
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
  const [dentists, setDentists] = useState<DentistSchedulesInterface[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const dentistsResponse = await UsersApi.findDentists();
      console.log(dentistsResponse);
      setDentists(
        dentistsResponse.map((dentist) => ({
          dentist,
          schedules: data,
        }))
      );
    };
    fetchData();
  }, []);

  const day = 1;
  if (dentists.length === 0) return <></>;
  return (
    <div>
      {dentists.map((dentist) => {
        const daySchedule = dentist.schedules.find(
          (schedule) => schedule.day === day
        );
        return (
          <div className="d-flex gap-2 p-2">
            <div
              className={`d-flex flex-column justify-content-center ${styles.dentistImage}`}
            >
              <ProfileImage />
              <p>{dentist.dentist.username}</p>
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
                <hr />
              </Col>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ClinicView() {
  const [selectedClinic, setSelectedClinic] = useState({
    name: "Abreu e lima",
    address: "Na praça de abreu",
  });
  const consultorios = [
    { name: "Abreu e lima", address: "Na praça de abreu" },
    { name: "Igarassu", address: "No lado do mercado de Igarassu" },
    { name: "Consultório novo", address: "Sala 1605" },
  ];
  return (
    <div className={`p-4 ${styles.border}`}>
      <Nav variant="tabs" defaultActiveKey={1}>
        {consultorios.map((consultorio) => (
          <Nav.Item key={consultorio.name}>
            <Nav.Link
              eventKey={consultorio.name}
              onClick={() => setSelectedClinic(consultorio)}
            >
              {capitalizeFirstLetter(consultorio.name)}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <>
        {selectedClinic && (
          <Row>
            <Col sm="auto">
              <Image
                src={logo}
                width={200}
                height={200}
                alt={`Profile pic user: ${"username"}`}
                priority
                className={`rounded ${styles.profilePic}`}
              />
            </Col>
            <Col className="mt-2 mt-sm-0">
              <h1>{selectedClinic.name}</h1>
              <div>
                <strong>Nome: </strong>
                {selectedClinic.name}
              </div>
              <div>
                <strong>Endereço: </strong>
                {selectedClinic.address}
              </div>
              <div className="pre-line">
                <strong>About me: </strong> <br />
                {"about" || "This user hasn't shared any info yet"}
              </div>
            </Col>
          </Row>
        )}
      </>
    </div>
  );
}
