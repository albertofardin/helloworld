import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Api",
};

export default function ApiDocsPage() {
  return (
    <iframe
      src="https://testing.higeco.com/docapiv2/"
      title="Higeco API Doc V2"
      className="min-h-0 w-full flex-1 border-0 bg-white"
    />
  );
}
