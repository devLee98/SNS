"use client";

import type { Post } from "@/lib/types";
import PostItem from "./post-item";

export default function PostDetailClient({
  postId,
  userId,
  initialPost,
}: {
  postId: number;
  userId: string;
  initialPost: Post;
}) {
  return (
    <PostItem
      postId={postId}
      userId={userId}
      type="DETAIL"
      initialPost={initialPost}
    />
  );
}
