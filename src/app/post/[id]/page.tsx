import CommentEditor from "@/components/comment/comment-editor";
import CommentList from "@/components/comment/comment-list";
import PostDetailClient from "@/components/post/post-detail-client";
import { QUERY_KEYS } from "@/lib/constants";
import { getCurrentUser } from "@/lib/server-auth";
import { fetchCommentsAction } from "@/lib/server-queries/comment";
import { fetchPostByIdServer } from "@/lib/server-queries/post";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = parseInt(id);

  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.comment.list(postId),
    queryFn: () => fetchCommentsAction(postId),
  });

  const initialPost = await fetchPostByIdServer(postId);

  return (
    <div className="flex flex-col gap-5">
      <PostDetailClient
        postId={postId}
        userId={user.id}
        initialPost={initialPost}
      />
      <div className="text-xl font-bold">댓글</div>
      <CommentEditor type="CREATE" postId={postId} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CommentList postId={postId} userId={user.id} />
      </HydrationBoundary>
    </div>
  );
}
