"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateComment } from "@/hooks/mutations/comment/use-create-comment";
import { useUpdateComment } from "@/hooks/mutations/comment/use-update-comment";
import { useState } from "react";
import { toast } from "sonner";

type CreateMode = {
  type: "CREATE";
  postId: number;
};

type EditMode = {
  type: "EDIT";
  commentId: number;
  initialContent: string;
  onClose: () => void;
};

type Props = CreateMode | EditMode;

export default function CommentEditor(props: Props) {
  const { mutate: updateComment, isPending: isUpdateCommentPending } =
    useUpdateComment({
      onError: () => {
        toast.error("댓글 수정에 실패했습니다.", { position: "top-center" });
      },
      onSuccess: () => {
        (props as EditMode).onClose();
      },
    });
  const [content, setContent] = useState(
    props.type === "EDIT" ? props.initialContent : "",
  );

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
    if (props.type === "CREATE") {
      createComment({ content: trimmed, postId: props.postId });
    } else {
      updateComment({ content: trimmed, id: props.commentId });
    }
  };

  const isPending = isCreateCommentPending || isUpdateCommentPending;

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        disabled={isPending}
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        {props.type === "EDIT" && (
          <Button
            disabled={isPending}
            variant={"outline"}
            onClick={() => (props as EditMode).onClose()}
          >
            취소
          </Button>
        )}
        <Button
          disabled={isPending || !content.trim()}
          onClick={handleSubmitClick}
        >
          작성
        </Button>
      </div>
    </div>
  );
}
