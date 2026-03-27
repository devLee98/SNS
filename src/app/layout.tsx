import { createWithdImagesAction, updatePostAction } from "@/actions/post";
import AlertModal from "@/components/modal/alert-modal";
import PostEditModal from "@/components/modal/post-edit-modal";
import { SunIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import Providers from "./provider";
import ProfileButton from "@/components/header/profile-button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <header className="h-15 border-b">
              <div className="m-auto flex h-full w-full max-w-175 justify-between px-4">
                <Link href={"/"} className="flex items-center gap-2">
                  <Image src={"/logo.png"} alt="logo" width={20} height={20} />
                  <div>SNS</div>
                </Link>
                <div className="flex items-center gap-5">
                  <div className="hover:bg-muted cursor-pointer rounded-full p-2">
                    <SunIcon />
                  </div>
                  <ProfileButton />
                </div>
              </div>
            </header>
            <main className="m-auto w-full max-w-175 flex-1 border-x px-4 py-6">
              {children}
            </main>
            <footer className="text-muted-foreground border-t py-10 text-center">
              @이영찬
            </footer>
          </div>
          <PostEditModal
            createWithdImagesAction={createWithdImagesAction}
            updatePostAction={updatePostAction}
          />
          <AlertModal />
          <div id="modal-root" />
        </Providers>
      </body>
    </html>
  );
}
