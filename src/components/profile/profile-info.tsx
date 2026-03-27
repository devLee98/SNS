import Image from "next/image";

export default function ProfileInfo({
  id,
  created_at,
  avatar_url,
  nickname,
  bio,
}: {
  id: string;
  created_at: string;
  avatar_url: string | null;
  nickname: string;
  bio: string;
}) {
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
    </div>
  );
}
