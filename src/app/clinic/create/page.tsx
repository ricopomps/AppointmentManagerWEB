"use client";

import LoadingButton from "@/components/LoadingButton";
import { handleError } from "@/lib/utils";
import {
  CreateClinicSchema,
  createClinicSchema,
} from "@/lib/validation/clinic";
import { createClinic } from "@/network/api/clinic";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function CreateClinicPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateClinicSchema>({
    resolver: zodResolver(createClinicSchema),
    defaultValues: {},
  });

  async function onSubmit(data: CreateClinicSchema) {
    try {
      const response = await createClinic(data);
      router.push(`/clinic?clinicId=${response.id}`);
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <main className="m-auto min-w-[300px] max-w-7xl p-4">
      <h1 className="mb-3 text-center text-lg font-bold">Criar Clínica</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Nome"
          className="input input-bordered mb-3 w-full"
          {...register("name")}
        />
        {errors.name && (
          <p className="mb-1 text-red-500">{errors.name.message}</p>
        )}

        <LoadingButton loading={isSubmitting} className="btn-block">
          Criar
        </LoadingButton>
      </form>
    </main>
  );
}
