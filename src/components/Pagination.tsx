import React from "react";
import Pagination from "react-bootstrap/Pagination";
import Button from "react-bootstrap/Button";

interface PaginationComponentProps {
  onBack: () => void;
  onFront: () => void;
  onCenter: () => void;
}
const PaginationComponent = ({
  onBack,
  onFront,
  onCenter,
}: PaginationComponentProps) => {
  return (
    <Pagination style={{ display: "flex" }}>
      <Button onClick={onBack}>Semana anterior </Button>
      <Button onClick={onCenter} style={{ marginLeft: "auto" }}>
        Semana atual{" "}
      </Button>
      <Button style={{ marginLeft: "auto" }} onClick={onFront}>
        Próxima semana{" "}
      </Button>
    </Pagination>
  );
};

export default PaginationComponent;
