import { Col, Container, Row } from "react-bootstrap";
import Calendar from "../components/Calendar/Calendar";
import FormAppointment from "../components/Form/FormAppointment";
import { useState } from "react";

interface HomePageProps {}

const HomePage = ({}: HomePageProps) => {
  const [refreshCalendar, setRefreshCalendar] = useState(false);
  const refresh = () => {
    setRefreshCalendar(!refreshCalendar);
  };
  return (
    <Container>
      <Row>
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
