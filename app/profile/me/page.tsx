import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileClient from "@/components/profile/profile-client";

export const dynamic = "force-dynamic";

export default async function MyProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: profile }, { count: followers }, { count: following }, { data: posts }] = await Promise.all([
    supabase.from("profiles").select("id,username,display_name,bio,avatar_url,cover_url,website,created_at").eq("id", user.id).single(),
    supabase.from("follows").select("follower_id", { count: "exact", head: true }).eq("following_id", user.id),
    supabase.from("follows").select("following_id", { count: "exact", head: true }).eq("follower_id", user.id),
    supabase.from("posts").select("id,caption,created_at").eq("author_id", user.id).order("created_at", { ascending: false }).limit(30),
  ]);

  return <ProfileClient profile={profile} followers={followers ?? 0} following={following ?? 0} posts={posts ?? []} />;
}
