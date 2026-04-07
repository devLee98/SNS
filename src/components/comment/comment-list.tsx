"use client";
import CommentItem from "@/components/comment/comment-item";
import Fallback from "@/components/fallback";
import Loader from "@/components/loader";
import useCommentsData from "@/hooks/queries/use-comments-data";

export default function CommentList({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) {
  const {
    data: comments,
    isPending: isFetchCommentsPending,
    error: fetchCommentsError,
  } = useCommentsData(postId);
  if (isFetchCommentsPending) return <Loader />;
  if (fetchCommentsError) return <Fallback />;
  return (
    <div className="flex flex-col gap-5">
      {comments?.map((comment) => (
        <CommentItem key={comment.id} {...comment} userId={userId} />
      ))}
    </div>
  );
}
