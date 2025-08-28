import Main from "@/components/Main";
import HomeContent from "@/components/HomeContent";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  redirect("/bridge");
}
