import { Form } from "react-bootstrap";
import {
  FieldError,
  RegisterOptions,
  UseFormRegisterReturn,
} from "react-hook-form";

export interface Option {
  value: string | number;
  key: string | number;
  disabled?: boolean;
  show?: boolean;
}
interface TextInputFieldProps {
  label?: string;
  register: UseFormRegisterReturn;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  options?: Option[];
  hasDefaultValue?: boolean;
  margin?: boolean;
  nullable?: boolean;
  [x: string]: any;
}

const TextInputField = ({
  label,
  placeholder,
  register,
  registerOptions,
  error,
  hasDefaultValue,
  options,
  margin = true,
  nullable = false,
  ...props
}: TextInputFieldProps) => {
  return (
    <Form.Group className={margin ? "mb-3" : undefined}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        {...register}
        {...props}
        placeholder={placeholder}
        isInvalid={!!error}
      >
        {options ? (
          <>
            {hasDefaultValue && (
              <option value={undefined} disabled={!nullable} selected>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <>
                {option.show ? (
                  <></>
                ) : (
                  <option
                    key={option.key}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.key}
                  </option>
                )}
              </>
            ))}
          </>
        ) : null}
      </Form.Control>
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInputField;
