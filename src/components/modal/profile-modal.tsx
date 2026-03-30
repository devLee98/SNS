"use client";

import { updateProfileAction } from "@/actions/profile";
import { useProfileEditorModal } from "@/app/store/profile-editor-modal";
import { QUERY_KEYS } from "@/lib/constants";
import type { Post } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type AvatarImage = {
  file: File;
  previewUrl: string;
};

export default function ProfileModal() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const modal = useProfileEditorModal();
  const profile = modal.profile;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<AvatarImage | null>(null);

  const clearAvatarPreview = () => {
    if (!avatar) return;
    URL.revokeObjectURL(avatar.previewUrl);
    setAvatar(null);
  };

  const handleCloseModal = () => {
    clearAvatarPreview();
    modal.actions.close();
  };

  useEffect(() => {
    return () => {
      if (avatar) {
        URL.revokeObjectURL(avatar.previewUrl);
      }
    };
  }, [avatar]);

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatar) URL.revokeObjectURL(avatar.previewUrl);
    setAvatar({ file, previewUrl: URL.createObjectURL(file) });
    e.target.value = "";
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (avatar?.file) {
      formData.set("avatar", avatar.file);
    }
    const updatedProfile = await updateProfileAction(formData);
    const targetAuthorId = profile.id;

    queryClient.setQueriesData(
      { queryKey: ["post", "byId"] },
      (old: Post | undefined) => {
        if (!old) return old;
        if (old.author.id !== targetAuthorId) return old;
        return {
          ...old,
          author: {
            ...old.author,
            nickname: updatedProfile.nickname,
            bio: updatedProfile.bio,
            avatar_url: updatedProfile.avatar_url,
          },
        };
      },
    );
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.post.authorList(updatedProfile.id),
    });

    await queryClient.refetchQueries({
      queryKey: QUERY_KEYS.post.authorList(updatedProfile.id),
      type: "active",
    });

    router.refresh();
    handleCloseModal();
  };

  return createPortal(
    <Dialog
      open={modal.isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleCloseModal();
        }
      }}
    >
      <DialogContent className="flex flex-col gap-5">
        <DialogTitle>프로필 수정하기</DialogTitle>
        <form className="mt-5 flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground">프로필 이미지</div>
            <input
              onChange={handleSelectImage}
              type="file"
              name="avatar"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
            />
            <Image
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              src={
                avatar?.previewUrl ??
                profile.avatar_url ??
                "/default-avatar.png"
              }
              alt="프로필 이미지"
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground">닉네임</div>
            <Input
              name="nickname"
              type="text"
              defaultValue={profile.nickname ?? ""}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground">소개</div>
            <Textarea name="bio" defaultValue={profile.bio ?? ""} />
          </div>

          <Button type="submit">저장하기</Button>
        </form>
      </DialogContent>
    </Dialog>,
    modalRoot,
  );
}
