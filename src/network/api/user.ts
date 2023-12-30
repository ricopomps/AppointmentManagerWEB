import { User } from "@/models/user";
import api, { secondaryAxiosInstace } from "@/network/axiosInstance";
import { generateFormData } from "@/utils/utils";
import { Payment } from "@prisma/client";

const baseUrl = "/users";

export async function getAuthenticatedUser() {
  const response = await api.get<User>(`${baseUrl}/me`);
  return response.data;
}

export enum Pagamento {
  CASH = "Dinheiro",
  CREDIT_CARD = "Cartão de crédito",
  DEBIT_CARD = "Cartão de débito",
  PIX = "Pix",
}
export enum Status {
  PENDING = "Pendente",
  COMPLETED = "Completo",
  CANCELED = "Cancelado",
}

export enum Especialidade {
  ORTHODONTICS = "Ortodontia",
  ENDODONTICS = "Endodontia",
  DENTISTRY = "Dentistica",
  PERIODONTICS = "Periodontia",
  GENERAL = "Geral",
  SPECIALIZED = "Especializado",
  OTHER = "Outro",
}

interface SignUpValues {
  username: string;
  email: string;
  password: string;
  verificationCode: string;
}

export async function signUp(credentials: SignUpValues) {
  const response = await api.post<User>(`${baseUrl}/signup`, credentials);
  return response.data;
}

export async function requestEmailVerificationCode(email: string) {
  await api.post(`${baseUrl}/verificationcode`, { email });
}

interface LoginValues {
  username: string;
  password: string;
}

export async function login(credentials: LoginValues) {
  const response = await api.post<User>(`${baseUrl}/login`, credentials);
  return response.data;
}

export async function logout() {
  await api.post(`${baseUrl}/logout`);
}

export async function getUserByUsername(username: string) {
  const response = await api.get<User>(`${baseUrl}/profile/${username}`);
  return response.data;
}

interface UpdateUserValues {
  username?: string;
  displayName?: string;
  about?: string;
  profilePic?: File;
}

export async function updateUser(input: UpdateUserValues) {
  const formData = generateFormData(input);

  const response = await api.patch<User>(`${baseUrl}/me`, formData);
  return response.data;
}

export async function requestPasswordResetCode(email: string) {
  await api.post(`${baseUrl}/resetpasswordcode`, { email });
}

interface ResetPasswordValues {
  email: string;
  password: string;
  verificationCode: string;
}

export async function resetPassword(credentials: ResetPasswordValues) {
  const response = await api.post<User>(
    `${baseUrl}/resetpassword`,
    credentials
  );
  return response.data;
}

export async function findDentists() {
  const response = await api.get<User[]>(`${baseUrl}/dentists`);

  return response.data;
}

export async function findDentistsByClinic(clinicId: string) {
  const response = await api.get<User[]>(`${baseUrl}/dentists/${clinicId}`);

  return response.data;
}

export async function createPayment(formData: Payment) {
  const response = await secondaryAxiosInstace.post<{ payment: Payment }>(
    `api/payment`,
    formData
  );

  return response.data.payment;
}

export async function getPayments() {
  const response = await secondaryAxiosInstace.get<Payment[]>(`api/payment`);
  return response.data;
}

export async function updatePayment(paymentId: string, formData: Payment) {
  const response = await secondaryAxiosInstace.patch<{ payment: Payment }>(
    `api/payment`,
    {
      ...formData,
      id: paymentId,
    }
  );
  return response.data.payment;
}

export async function deletePayment(paymentId: string) {
  const response = await secondaryAxiosInstace.delete<{ payment: Payment }>(
    `api/payment/${paymentId}`
  );
  return response.data.payment;
}
