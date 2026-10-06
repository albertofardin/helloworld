import CircularProgress from "@/components/CircularProgress";

export default function HomeLoading() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <CircularProgress />
    </div>
  );
}
