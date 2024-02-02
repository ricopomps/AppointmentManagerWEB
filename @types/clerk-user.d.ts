import { Roles } from "@/models/roles";

declare global {
  interface UserPublicMetadata {
    clinics?: { clinicId: string; roles: Roles[] }[];
  }
}
