import { Form } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import {
  RegisterOptions,
  UseFormRegister,
  FieldError,
  Controller,
  useForm,
} from "react-hook-form";

interface ControllerDateFieldProps {
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
}: ControllerDateFieldProps) => {
  const { onChange } = register(name, registerOptions);
  const { control, handleSubmit } = useForm();

  return (
    // <Form.Group className="mb-3" controlId={name + "-input"}>
    //   <Form.Label>{label}</Form.Label>
    //   <br></br>
    //   <Form.Control
    //     {...props}
    //     {...register(name, registerOptions)}
    //     as={ReactDatePicker}
    //     value={name}
    //     onChange={onChange}
    //     isInvalid={!!error}
    //   />
    //   <Form.Control.Feedback type="invalid">
    //     {error?.message}
    //   </Form.Control.Feedback>
    // </Form.Group>
    <Controller
      control={control}
      name="date-input"
      render={({ field }) => (
        <ReactDatePicker
          placeholderText="Select date"
          onChange={(date) => field.onChange(date)}
          selected={field.value}
        />
      )}
    />
  );
};

export default TextInputField;
