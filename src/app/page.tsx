import Main from "@/components/Main";
import HomeContent from "@/components/HomeContent";
import { redirect } from "next/navigation";

export default function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  if (!searchParams.source || !searchParams.destination) {
    redirect(
      `/?source=${searchParams.source ?? "Sepolia"}&destination=${
        searchParams.destination ?? "Arbitrum+Sepolia"
      }`
    );
  }
  return (
    <Main>
      <HomeContent />
    </Main>
  );
}
