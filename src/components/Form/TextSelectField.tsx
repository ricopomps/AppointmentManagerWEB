import { Form, FormControl } from "react-bootstrap";
import { RegisterOptions, UseFormRegister, FieldError } from "react-hook-form";

interface TextSelectFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  [x: string]: any;
}

const TextSelectField = ({
  name,
  label,
  register,
  registerOptions,
  error,
  ...props
}: TextSelectFieldProps) => {
  return (
    <Form.Group className="mb-3" controlId={name + "-input"}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        {...props}
        {...register(name, registerOptions)}
        isInvalid={!!error}
        defaultValue="re"
      >
        <option value="DICTUM">Dictamen</option>
        <option value="CONSTANCY">Constancia</option>
        <option value="COMPLEMENT">Complemento</option>
      </Form.Control>
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextSelectField;
