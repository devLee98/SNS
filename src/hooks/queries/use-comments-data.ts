import { QUERY_KEYS } from "@/lib/constants";
import { fetchCommentsAction } from "@/lib/server-queries/comment";
import { useQuery } from "@tanstack/react-query";

export default function useCommentsData(postId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.comment.list(postId),
    queryFn: () => fetchCommentsAction(postId),
  });
}
