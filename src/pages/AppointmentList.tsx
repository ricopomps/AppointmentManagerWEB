import { useEffect, useState } from "react";
import { Button, ListGroup, ListGroupItem, Table } from "react-bootstrap";
import { format, parse, parseISO } from "date-fns";
import * as AppointmentApi from "../network/appointmentApi";
import { dateFormat } from "../utils/calendarUtils";
import { Appointment } from "../models/appointment";
import FormAppointmentList from "../components/Form/FormAppointmentList";
import styles from "../styles/AppointmentListPage.module.css";
import { findAppointmentsForm } from "../network/appointmentApi";

interface AppointmentListProps {}
const AppointmentList = ({}: AppointmentListProps) => {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);

  useEffect(() => {
    async function findAppointments() {
      try {
        const appointmentsData = await AppointmentApi.findAppointments({});
        setAppointments(appointmentsData.appointments);
      } catch (error) {
        console.error(error);
      }
    }
    findAppointments();
  }, []);

  const onSubmit = async (filter: findAppointmentsForm) => {
    if (filter.startDate)
      filter.startDate = parse(
        filter.startDate.toString(),
        "yyyy-MM-dd",
        new Date()
      );
    if (filter.endDate)
      filter.endDate = parse(
        filter.endDate.toString(),
        "yyyy-MM-dd",
        new Date()
      );
    const appointmentsFromWeek = await AppointmentApi.findAppointments(filter);
    setAppointments(appointmentsFromWeek.appointments);
  };

  const Empty = () => {
    return (
      <ListGroup>
        <ListGroupItem>
          Não há agendamentos para os parametrôs informados
        </ListGroupItem>
      </ListGroup>
    );
  };

  const AppointmentTable = () =>
    appointments?.length ? (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Paciente</th>
            <th>Consultório</th>
            <th>Dentista</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{appointment.name}</td>
              <td>{appointment.clinic?.name}</td>
              <td>{appointment.dentist?.username}</td>
              <td>
                {format(parseISO(appointment.day.toString()), dateFormat)}{" "}
                {appointment.interval}
              </td>
              <td>
                <Button variant="danger">DELETAR</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : (
      <Empty />
    );
  return (
    <>
      <div className={styles.form}>
        <FormAppointmentList onSubmit={onSubmit} />
      </div>
      <AppointmentTable />
    </>
  );
};

export default AppointmentList;
