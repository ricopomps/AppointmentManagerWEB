"use client";

import PaginationBar from "@/components/PaginationBar";
import BlogPostsGrid from "@/components/blog/BlogPostsGrid";
import { User } from "@/models/user";
import * as BlogsApi from "@/network/api/blog";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import useSWR from "swr";

interface UserBlogPostsSectionProps {
  user: User;
}

export default function UserBlogPostsSection({
  user,
}: UserBlogPostsSectionProps) {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading: blogPostsLoading,
    error: blogPostsLoadingError,
  } = useSWR([user._id, page, "user_posts"], ([userId, page]) =>
    BlogsApi.getBlogPostsByUser(userId, page)
  );

  const blogPosts = data?.blogPosts || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div>
      <hr />
      <h2>Blog posts</h2>
      {blogPosts.length > 0 && <BlogPostsGrid posts={blogPosts} />}

      <div className="d-flex flex-column align-items-center">
        {blogPosts.length > 0 && (
          <PaginationBar
            currentPage={page}
            pageCount={totalPages}
            onPageItemClicked={(page) => setPage(page)}
            className="mt-4"
          />
        )}
        {blogPostsLoading && <Spinner animation="border" />}
        {blogPostsLoadingError && <p>Blog posts could not be loaded</p>}
        {!blogPostsLoading &&
          !blogPostsLoadingError &&
          blogPosts.length === 0 && (
            <p>This user hasn&apos;t posted anything yet</p>
          )}
      </div>
    </div>
  );
}
