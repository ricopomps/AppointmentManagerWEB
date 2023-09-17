import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Calendar, { WeekIntervals } from "../components/Calendar/Calendar";
import FormAppointment from "../components/Form/FormAppointment";
import AppointmentSelector from "../components/AppointmentSelector";
import { Interval } from "../utils/prepareIntervals";

interface HomePageProps {}

const HomePage = ({}: HomePageProps) => {
  const [refreshCalendar, setRefreshCalendar] = useState(false);
  const refresh = () => {
    setRefreshCalendar(!refreshCalendar);
  };

  const intervalValues: Interval = {
    interval: "00:30:00",
    startTime: "08:00:00",
    endTime: "18:00:00",
    breakStartTime: "12:00:00",
    breakEndTime: "14:00:00",
  };
  const week = Array.from({ length: 7 }, (_, index) => index);
  return (
    <Container>
      <Row>
        <AppointmentSelector />
        <Col sm={12} md={8}>
          <Calendar refresh={refreshCalendar} />
        </Col>
        <Col sm={12} md={4}>
          <FormAppointment refresh={refresh} />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
