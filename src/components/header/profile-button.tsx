import { getUserAction, signOutAction } from "@/actions/auth";
import { PopoverClose } from "@radix-ui/react-popover";
import Image from "next/image";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default async function ProfileButton() {
  const userId = await getUserAction();
  if (!userId) {
    return null;
  }
  return (
    <Popover>
      <PopoverTrigger>
        <Image src={"/default-avatar.png"} alt="logo" width={24} height={24} />
      </PopoverTrigger>
      <PopoverContent className="flex w-40 flex-col p-0">
        <PopoverClose asChild>
          <Link href={`/profile/${userId.id}`}>
            <div className="hover:bg-muted cursor-pointer px-4 py-3 text-sm">
              프로필
            </div>
          </Link>
        </PopoverClose>
        <PopoverClose asChild>
          <div
            onClick={signOutAction}
            className="hover:bg-muted cursor-pointer px-4 py-3 text-sm"
          >
            로그아웃
          </div>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}
