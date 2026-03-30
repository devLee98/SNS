"use client";

import { useOpenProfileEditorModal } from "@/app/store/profile-editor-modal";
import type { EditableProfile } from "@/lib/types";
import { Button } from "../ui/button";

export default function EditProfileButton({
  profile,
}: {
  profile: EditableProfile;
}) {
  const open = useOpenProfileEditorModal();
  const openProfileEditorModal = () => {
    open(profile);
  };

  return (
    <Button
      variant={"secondary"}
      className="cursor-pointer"
      onClick={openProfileEditorModal}
    >
      프로필 수정하기
    </Button>
  );
}
