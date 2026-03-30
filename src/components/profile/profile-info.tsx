import type { EditableProfile } from "@/lib/types";
import Image from "next/image";
import EditProfileButton from "./edit-profile-button";

export default async function ProfileInfo({
  id,
  created_at,
  avatar_url,
  nickname,
  bio,
  userId,
}: {
  id: string;
  created_at: string;
  avatar_url: string | null;
  nickname: string;
  bio: string;
  userId: string;
}) {
  const isMe = userId === id;
  const editableProfile: EditableProfile = { id, nickname, bio, avatar_url };
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <Image
        src={avatar_url ?? "/default-avatar.png"}
        alt={nickname}
        width={120}
        height={120}
        className="rounded-full object-cover"
      />
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="text-xl font-bold">{nickname}</div>
        <div className="text-muted-foreground">{bio}</div>
      </div>
      {isMe && <EditProfileButton profile={editableProfile} />}
    </div>
  );
}
