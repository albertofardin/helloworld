import Card from "@/components/Card";
import Icon from "@/components/Icon";
import Text from "@/components/Text";

export interface IInfoCard {
  title: string;
  icon: string;
  name: string;
  details: { label: string; value: string | number }[];
}

export default function InfoCard({ title, icon, name, details }: IInfoCard) {
  return (
    <Card className="flex-col items-stretch justify-start gap-2 p-4 border-primary">
      <div>
        <div className="flex items-center gap-1.5">
          <Icon size="sm" className="text-primary">
            {icon}
          </Icon>
          <Text size={0} className="uppercase text-muted-fg">
            {title}
          </Text>
        </div>
        <Text size={3} weight="bolder" ellipsis>
          {name}
        </Text>
      </div>
      <dl className="m-0 flex flex-col gap-1">
        {details.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-4"
          >
            <dt>
              <Text className="text-muted-fg">{label}</Text>
            </dt>
            <dd className="m-0 min-w-0">
              <Text ellipsis>{value}</Text>
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
