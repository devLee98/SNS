"use client";

import { useProfileEditorModal } from "@/app/store/profile-editor-modal";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function ProfileModal() {
  const modal = useProfileEditorModal();
  const profile = modal.profile;

  if (!profile) {
    return null;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <Dialog
      open={modal.isOpen}
      onOpenChange={(open) => {
        if (!open) {
          modal.actions.close();
        }
      }}
    >
      <DialogContent className="flex flex-col gap-5">
        <DialogTitle>프로필 수정하기</DialogTitle>
        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground">프로필 이미지</div>
          <Image
            src={profile.avatar_url ?? "/default-avatar.png"}
            alt={profile.nickname}
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground">닉네임</div>
          <Input
            key={`nickname-${profile.id}`}
            type="text"
            defaultValue={profile.nickname ?? ""}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground">소개</div>
          <Textarea
            key={`bio-${profile.id}`}
            defaultValue={profile.bio ?? ""}
          />
        </div>

        <Button type="button">저장하기</Button>
      </DialogContent>
    </Dialog>,
    modalRoot,
  );
}
