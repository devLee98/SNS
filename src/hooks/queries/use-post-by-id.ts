import { fetchPostByIdClient } from "@/lib/client-queries/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { Post } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export function usePostById({
  postId,
  type,
  initialData,
}: {
  postId: number;
  type: "FEED" | "DETAIL";
  initialData?: Post;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.post.byId(postId),
    queryFn: () => fetchPostByIdClient(postId),
    initialData,
    enabled: type === "FEED" ? false : true,
  });
}
