import type { Comment } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CommentEditor from "./comment-editor";
export default function CommentItem(props: Comment & { userId: string }) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const isMyComment = props.author_id === props.userId;
  return (
    <div className={"flex flex-col gap-8 border-b pb-5"}>
      <div className="flex items-start gap-4">
        <Link href={"#"}>
          <div className="flex h-full flex-col">
            <Image
              src={props.author.avatar_url || "/default-avatar.png"}
              alt="default avatar"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
        </Link>
        <div className="flex w-full flex-col gap-2">
          <div className="font-bold">{props.author.nickname}</div>
          {isEditing ? (
            <CommentEditor
              type={"EDIT"}
              commentId={props.id}
              initialContent={props.content}
              onClose={toggleEditing}
            />
          ) : (
            <div>{props.content}</div>
          )}
          <div className="text-muted-foreground flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer hover:underline">댓글</div>
              <div className="bg-border h-[13px] w-[2px]"></div>
              <div>{new Date(props.created_at).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              {isMyComment && (
                <>
                  <div
                    className="cursor-pointer hover:underline"
                    onClick={toggleEditing}
                  >
                    수정
                  </div>
                  <div className="bg-border h-[13px] w-[2px]"></div>
                  <div className="cursor-pointer hover:underline">삭제</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
