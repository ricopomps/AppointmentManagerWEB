import {
  Controller,
  Control,
  FieldError,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

import "react-phone-number-input/style.css";
import { AppointmentForm } from "../../network/notes_api";
import { Form } from "react-bootstrap";
import stylesUtils from "../../styles/utils.module.css";

interface PhoneInputProps {
  error?: FieldError;
  register: UseFormRegister<any>;
  control: Control<AppointmentForm, any>;
  registerOptions?: RegisterOptions;
}

const PhoneInputField = ({ error, control }: PhoneInputProps) => {
  const validate = (value: string) => {
    return isValidPhoneNumber(value);
  };
  return (
    <Form>
      <div>
        <Form.Label htmlFor="phone">Telefone</Form.Label>
        <Controller
          name="phone"
          control={control}
          rules={{
            required: "Campo Obrigatório",
            validate: (value) => validate(value) || "Telefone inválido",
          }}
          render={({ field: { onChange, value } }) => (
            <PhoneInput
              className={error?.message && "input-phone-number"}
              value={value}
              onChange={onChange}
              defaultCountry="BR"
              id="phone"
            />
          )}
        />
        {error?.message && (
          <div className={stylesUtils.errorMessage}>{error.message}</div>
        )}
      </div>
    </Form>
  );
};
export default PhoneInputField;
