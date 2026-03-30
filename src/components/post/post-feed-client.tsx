"use client";

import Loader from "@/components/loader";
import useInfinitePostData from "@/hooks/queries/use-infinite-post-data";
import { QUERY_KEYS } from "@/lib/constants";
import type { Post } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Fallback from "../fallback";
import PostItem from "./post-item";

type Props = {
  initialPosts: Post[];
  initialNextCursor: number | null;
  userId: string;
  authorId?: string;
};

export default function PostFeedClient({
  initialPosts,
  initialNextCursor,
  userId,
  authorId,
}: Props) {
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const { data, fetchNextPage, isFetchingNextPage, error, hasNextPage } =
    useInfinitePostData({ initialPosts, initialNextCursor, userId, authorId });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  useEffect(() => {
    initialPosts.forEach((post) => {
      queryClient.setQueryData(QUERY_KEYS.post.byId(post.id), post);
    });
  }, [initialPosts, queryClient]);

  const postIds = data?.pages.flatMap((page) => page.postIds) ?? [];

  if (error) return <Fallback />;
  return (
    <div className="flex flex-col gap-10">
      {postIds.map((postId) => (
        <PostItem key={postId} postId={postId} userId={userId} />
      ))}
      {isFetchingNextPage && <Loader />}
      <div ref={ref}></div>
    </div>
  );
}
