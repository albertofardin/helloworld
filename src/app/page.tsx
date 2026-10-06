import type { Metadata } from "next";
import { Suspense } from "react";
import HomeLoading from "./_home/HomeLoading";
import PhotovoltaicData from "./_home/PhotovoltaicData";

export const metadata: Metadata = {
  // il template del layout non si applica alla page dello stesso segmento
  title: "Higeco - Esercizio",
};

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <PhotovoltaicData />
    </Suspense>
  );
}
