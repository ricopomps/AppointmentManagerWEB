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

interface TextDateFieldTestProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  getValue: string | undefined;
  setValue: (value: Date | null) => void;
  [x: string]: any;
}

const TextInputField = ({
  name,
  label,
  register,
  registerOptions,
  error,
  getValue,
  setValue,
  ...props
}: TextDateFieldTestProps) => {
  const { onChange } = register(name, registerOptions);
  const { control, handleSubmit } = useForm();

  return (
    <Form.Group className="mb-3" controlId={name + "-input"}>
      <Form.Label>{label}</Form.Label>
      <br></br>
      <Form.Control
        {...props}
        {...register(name, registerOptions)}
        as={ReactDatePicker}
        value={getValue}
        onChange={(e) => {
          console.log(e);
          setValue(Date.parse(e as any) as any);
        }}
        isInvalid={!!error}
      />
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInputField;
