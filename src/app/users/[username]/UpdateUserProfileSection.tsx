"use client";

import LoadingButton from "@/components/LoadingButton";
import FormInputField from "@/components/form/FormInputField";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { User } from "@/models/user";
import * as UsersApi from "@/network/api/user";
import { handleError } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const validationSchema = yup.object({
  displayName: yup.string(),
  about: yup.string(),
  profilePic: yup.mixed<FileList>(),
});

type UpdateUserProfileFormData = yup.InferType<typeof validationSchema>;

interface UpdateUserProfileSectionProps {
  user: User;
}

export default function UpdateUserProfileSection({
  user: profileUser,
}: UpdateUserProfileSectionProps) {
  const { user: loggedInUser, mutateUser: mutateLoggegInUser } =
    useAuthenticatedUser();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateUserProfileFormData>();

  function handleUserUpdated(updatedUser: User) {
    mutateLoggegInUser(updatedUser);
    router.refresh();
  }

  async function onSubmit({
    displayName,
    about,
    profilePic,
  }: UpdateUserProfileFormData) {
    if (!displayName && !about && (!profilePic || profilePic.length === 0))
      return;

    try {
      const updatedUser = await UsersApi.updateUser({
        displayName,
        about,
        profilePic: profilePic?.item(0) || undefined,
      });
      handleUserUpdated(updatedUser);
    } catch (error) {
      handleError(error);
    }
  }

  return null;
  //   const profileUserIsLoggedInUser =
  //     (loggedInUser && loggedInUser._id === profileUser._id) || false;

  //   if (!profileUserIsLoggedInUser) return null;

  return (
    <div>
      <hr />
      <h2>Update profile</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormInputField
          register={register("displayName")}
          label="Display name"
          placeholder="Display name"
          maxLength={20}
        />
        <FormInputField
          register={register("about")}
          label="About"
          placeholder="About"
          as="textarea"
          maxLength={160}
        />
        <FormInputField
          register={register("profilePic")}
          label="Profile picture"
          placeholder="Profile picture"
          type="file"
          accept="image/png, image/jpeg"
        />
        <LoadingButton type="submit" isLoading={isSubmitting}>
          Update profile
        </LoadingButton>
      </Form>
    </div>
  );
}
