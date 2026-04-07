"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateComment } from "@/hooks/mutations/comment/use-create-comment";
import { useState } from "react";
import { toast } from "sonner";

export default function CommentEditor({ postId }: { postId: number }) {
  const [content, setContent] = useState("");

  const { mutate: createComment, isPending: isCreateCommentPending } =
    useCreateComment({
      onError: () => {
        toast.error("댓글 작성에 실패했습니다.");
      },
      onSuccess: () => {
        setContent("");
      },
    });

  const handleSubmitClick = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    createComment({ content: trimmed, postId });
  };

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end">
        <Button
          disabled={isCreateCommentPending || !content.trim()}
          onClick={handleSubmitClick}
        >
          작성
        </Button>
      </div>
    </div>
  );
}
