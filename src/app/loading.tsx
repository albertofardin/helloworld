import CircularProgress from "@/components/CircularProgress";

// Mostrato subito al cambio pagina, finché la nuova pagina non è pronta
export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <CircularProgress />
    </div>
  );
}
