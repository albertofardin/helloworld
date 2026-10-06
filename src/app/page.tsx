import type { Metadata } from "next";
import { Suspense } from "react";
import HomeLoading from "./_home/HomeLoading";
import PhotovoltaicData from "./_home/PhotovoltaicData";

export const metadata: Metadata = {
  // il template del layout non si applica alla page dello stesso segmento
  title: "Higeco - Esercizio",
};

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string | string[] }>;
}) {
  const { week } = await searchParams;
  const weekFrom = typeof week === "string" ? week : undefined;

  return (
    // spinner a tutta pagina solo al primo caricamento: il cambio settimana è
    // una transition gestita da WeekNavigationProvider
    <Suspense fallback={<HomeLoading />}>
      <PhotovoltaicData weekFrom={weekFrom} />
    </Suspense>
  );
}
