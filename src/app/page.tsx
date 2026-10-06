import { Suspense } from "react";
import HomeLoading from "./_home/HomeLoading";
import PhotovoltaicData from "./_home/PhotovoltaicData";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <PhotovoltaicData />
    </Suspense>
  );
}
