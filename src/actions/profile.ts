"use server";

import { deleteImageAction, uploadImageAction } from "@/actions/image";
import { createClient } from "@/lib/server";
import { getCurrentUser } from "@/lib/server-auth";
import { ProfileEntity } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fetchProfileAction(
  userId: string,
): Promise<ProfileEntity> {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) {
    redirect(`/profile?error=${encodeURIComponent(error.message)}`);
  }
  if (!data) redirect("/profile?error=profile_not_found");

  return data;
}

export async function updateProfileAction(formData: FormData) {
  const supabase = createClient(await cookies());
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("unauthorized");
  }
  const userId = user.id;

  const nickname = String(formData.get("nickname") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const avatarImageFile = formData.get("avatar");

  let newAvatarImageUrl: string | undefined;

  // 1) 기존 아바타 이미지 삭제
  if (avatarImageFile instanceof File && avatarImageFile.size > 0) {
    await deleteImageAction(`${userId}/avatar`);

    // 2) 새로운 아바타 이미지 업로드
    const fileExtension = avatarImageFile.name.split(".").pop() || "webp";
    const filePath = `${userId}/avatar/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

    newAvatarImageUrl = await uploadImageAction({
      file: avatarImageFile,
      filePath,
    });
  }

  // 3) 프로필 테이블 업데이트
  const updatePayload: Partial<ProfileEntity> = {
    nickname,
    bio,
  };

  if (newAvatarImageUrl) {
    updatePayload.avatar_url = newAvatarImageUrl;
  }

  const { data, error } = await supabase
    .from("profile")
    .update(updatePayload)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
