import { Col, Container, Row } from "react-bootstrap";
import Calendar from "../components/Calendar/Calendar";
import FormAppointment from "../components/Form/FormAppointment";

interface HomePageProps {}

const HomePage = ({}: HomePageProps) => {
  return (
    <Container>
      <Row>
        <Col sm={12} md={8}>
          <Calendar />
        </Col>
        <Col sm={12} md={4}>
          <FormAppointment />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
