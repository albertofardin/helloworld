import Text from "@/components/Text";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <Text size={8} weight="bolder">
        Hello World
      </Text>
      <Text size={3} className="text-muted-fg">
        Pagina iniziale
      </Text>
    </div>
  );
}
