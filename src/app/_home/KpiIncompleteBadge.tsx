import Badge from "@/components/Badge";

export default function KpiIncompleteBadge() {
  return (
    <Badge
      color="var(--warn)"
      icon="warning"
      label="Dati incompleti"
      labelClassName="text-fg"
      iconClassName="text-fg"
    />
  );
}
