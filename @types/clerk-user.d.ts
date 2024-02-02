import { Role } from "@/models/roles";

declare global {
  interface UserPublicMetadata {
    clinics?: { clinicId: string; roles: Role[] }[];
  }
}
