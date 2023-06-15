import { Container } from "react-bootstrap";
import Calendar from "../components/Calendar/Calendar";
import stylesUtils from "../styles/utils.module.css";

interface HomePageProps {}

const HomePage = ({}: HomePageProps) => {
  return (
    <Container>
      <div className={stylesUtils.width50}>
        <Calendar />
      </div>
    </Container>
  );
};

export default HomePage;
