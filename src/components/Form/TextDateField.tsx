import { Form } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import {
  RegisterOptions,
  UseFormRegister,
  FieldError,
  Controller,
  useForm,
} from "react-hook-form";
import ControllerDateField from "./ControllerDateField";

interface TextDateFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  [x: string]: any;
}

const TextInputField = ({
  name,
  label,
  register,
  registerOptions,
  error,
  ...props
}: TextDateFieldProps) => {
  const { onChange } = register(name, registerOptions);
  const { control, handleSubmit, getValues, setValue } = useForm();

  return (
    <Form.Group className="mb-3" controlId={name + "-input"}>
      <Form.Label>{label}</Form.Label>
      <br></br>
      <Form.Control
        {...props}
        {...register(name, registerOptions)}
        // as={() => {
        //   return (
        //     <ControllerDateField
        //       name="time"
        //       label="Horário"
        //       type="select"
        //       placeholder="data"
        //       register={register}
        //       registerOptions={{ required: "Campo Obrigatório" }}
        //     />
        //   );
        // }}
        // as={() => {
        //   return (
        //     <ReactDatePicker
        //       placeholderText="Select date"
        //       onChange={(date) => field.onChange(date)}
        //       selected={field.value}
        //     />
        //   );
        // }}
        value={name}
        onChange={onChange}
        isInvalid={!!error}
      />
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInputField;
