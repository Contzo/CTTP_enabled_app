import Main from "@/components/Main";
import HomeContent from "@/components/HomeContent";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const params = await searchParams;
  if (!params.source || !params.destination) {
    redirect(
      `/bridge?source=${params.source ?? "Sepolia"}&destination=${
        params.destination ?? "Arbitrum+Sepolia"
      }`
    );
  }
  return (
    <Main>
      <HomeContent />
    </Main>
  );
}
