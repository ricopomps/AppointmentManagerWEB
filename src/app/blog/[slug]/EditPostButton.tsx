"use client";

import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";

interface EditPostButtonProps {
  slug: string;
  authorId: string;
}

export default function EditPostButton({
  slug,
  authorId,
}: EditPostButtonProps) {
  const { user } = useAuthenticatedUser();

  return null;

  //   return (
  //     <Link
  //       href={`/blog/edit-post/${slug}`}
  //       className="btn btn-outline-primary d-inline-flex align-items-center gap-1 mb-2"
  //     >
  //       <FiEdit />
  //       Edit post
  //     </Link>
  //   );
}
