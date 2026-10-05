import type { Metadata } from "next";
import Docs from "./_docs/Docs";

export const metadata: Metadata = {
  title: "Componenti · Hello World",
};

export default function ComponentsPage() {
  return <Docs />;
}
