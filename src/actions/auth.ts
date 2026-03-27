"use server";

import { createClient } from "@/lib/server";
import { getCurrentUser } from "@/lib/server-auth";
import { getRandomNickname } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOutAction() {
  const supabase = createClient(await cookies());
  await supabase.auth.signOut();
  redirect("/");
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    redirect(
      `/signup?error=${encodeURIComponent("이메일과 비밀번호를 입력하세요.")}`,
    );
  }

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}

export async function signInWithPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    redirect(
      `/signin?error=${encodeURIComponent("이메일과 비밀번호를 입력하세요.")}`,
    );
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/signin?error=${encodeURIComponent(error.message)}`);
  }
  const userId = data.user?.id;
  if (!userId) {
    redirect(`/signin?error=${encodeURIComponent("user_not_found")}`);
  }

  const { error: profileError } = await supabase.from("profile").upsert(
    {
      id: userId,
      nickname: getRandomNickname(),
      bio: "",
      avatar_url: data.user.user_metadata?.avatar_url ?? null,
    },
    {
      onConflict: "id",
      ignoreDuplicates: true,
    },
  );

  if (profileError) {
    redirect(`/signin?error=${encodeURIComponent(profileError.message)}`);
  }

  redirect("/");
}

export async function requestResetPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    redirect(
      `/forgetpassword?error=${encodeURIComponent("이메일을 입력하세요.")}`,
    );
  }

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/resetpassword`,
  });

  if (error) {
    redirect(`/forgetpassword?error=${encodeURIComponent(error.message)}`);
  }
}

export async function updatePasswordAction(formData: FormData) {
  const password = String(formData.get("password") ?? "").trim();

  if (!password) {
    redirect(
      `/resetpassword?error=${encodeURIComponent("비밀번호를 입력하세요.")}`,
    );
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/resetpassword?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/");
}

export async function getUserAction() {
  return getCurrentUser();
}
