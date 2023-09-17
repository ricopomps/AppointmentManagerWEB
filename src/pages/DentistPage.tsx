import { Col, Container, Row } from "react-bootstrap";
import { User } from "../models/user";
import TextInputField from "../components/Form/TextInputField";
import { useEffect, useState } from "react";
import { Clinic } from "../context/SelectedDayContext";
import * as ClinicsApi from "../network/clinicsApi";
import { useForm } from "react-hook-form";
import stylesUtils from "../styles/utils.module.css";
import AppointmentSchedule, {
  AppointmentScheduleForm,
} from "../components/Form/AppointmentSchedule";
import Calendar from "../components/Calendar/Calendar";
import { Interval, generateIntervals } from "../utils/prepareIntervals";
import DentistCalendar, {
  WeekIntervals,
} from "../components/Calendar/DentistCalendar";

interface DentistPageProps {
  loggedDentist: User;
}

const DentistPage = ({ loggedDentist }: DentistPageProps) => {
  const [clinics, setClinics] = useState<Clinic[] | undefined>(undefined);
  const [selectedDay, setSelectedDay] = useState(1);
  const [intervalValues, setIntervalValues] = useState<Interval>({
    interval: "00:30:00",
    startTime: "08:00:00",
    endTime: "18:00:00",
    breakStartTime: "12:00:00",
    breakEndTime: "14:00:00",
  });
  const week = Array.from({ length: 7 }, (_, index) => index);

  const [weekValues, setWeekValues] = useState<WeekIntervals[]>(
    week.map((we, index) => ({ day: we, interval: intervalValues }))
  );
  const [selectedClinic, setSelectedClinic] = useState<Clinic | undefined>(
    undefined
  );
  useEffect(() => {
    async function fetchClinics() {
      try {
        const clinicsReturn = await ClinicsApi.getClinics();
        setClinics(clinicsReturn);
        if (clinicsReturn) setSelectedClinic(clinicsReturn[0]);
      } catch (error) {}
    }
    fetchClinics();
  }, []);

  const { register } = useForm<any>({
    defaultValues: {
      clinic: clinics?.[0]?._id || "",
      dentist: clinics?.[0].dentists?.[0]?._id || "",
    },
  });

  // let intervalValues: Interval = {
  //   interval: "00:30:00",
  //   startTime: "08:00:00",
  //   endTime: "18:00:00",
  //   breakStartTime: "12:00:00",
  //   breakEndTime: "14:00:00",
  // };
  const [values, setValues] = useState<string[][]>([[]]);

  const onSubmitSucess = (credentials: AppointmentScheduleForm) => {
    const intervalValueReturn: Interval = {
      interval: `00:${credentials.appointmentHourTime}:00`,
      startTime: `${credentials.initialHourTime}:${credentials.initialMinuteTime}:00`,
      endTime: `${credentials.endHourTime}:${credentials.endMinuteTime}:00`,
      breakStartTime: `${credentials.initialBreakHourTime}:${credentials.initialBreakMinuteTime}:00`,
      breakEndTime: `${credentials.endBreakHourTime}:${credentials.endBreakMinuteTime}:00`,
    };
    const newWeekValues = weekValues;

    newWeekValues[selectedDay] = { day: 0, interval: intervalValueReturn };

    setWeekValues(newWeekValues);
    console.log("newWeekValues", newWeekValues);
    const intervalsByWeek = () => {
      return week.map((week, index) => {
        const cara = generateIntervals(newWeekValues[index]?.interval);
        console.log("cara", cara);
        return cara;
      });
    };
    setValues(intervalsByWeek());

    // setIntervalValues(intervalValueReturn);
  };
  return (
    <div>
      <Container>
        <Row className="mb-3">
          <Col>Bem vindo {loggedDentist.username}</Col>
          <Col className={stylesUtils.flexCenter}>
            <div>Clinica:</div>
            <div>
              <TextInputField
                name="clinic"
                options={
                  clinics &&
                  clinics.map((clinic) => ({
                    key: clinic.name,
                    value: clinic._id,
                  }))
                }
                margin={false}
                as="select"
                placeholder="Consultório"
                register={register}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const clinic = clinics?.find((c) => c._id === e.target.value);
                  setSelectedClinic(clinic);
                }}
                registerOptions={{ required: "Campo Obrigatório" }}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <AppointmentSchedule
              day={"segunda"}
              clinic={selectedClinic}
              onSubmitSucess={onSubmitSucess}
            />
          </Col>
          <Col>
            <DentistCalendar
              intervalValues={values}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              maxSlotCount={Math.max(
                0,
                Math.max(...values.map((arr) => arr.length))
              )}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DentistPage;
