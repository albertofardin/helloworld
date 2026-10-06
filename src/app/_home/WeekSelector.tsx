"use client";

import * as React from "react";
import { useWeekNavigation } from "./WeekNavigation";
import Btn from "@/components/Btn";
import Card from "@/components/Card";
import FieldDate from "@/components/FieldDate";
import Icon from "@/components/Icon";
import Text from "@/components/Text";

export interface IWeekSelector {
  /** Primo giorno della settimana mostrata, "YYYY-MM-DD". */
  value: string;
  /** Ultimo giorno selezionabile, "YYYY-MM-DD". */
  max: string;
  /** true se la settimana è stata scelta dall'utente. */
  selected: boolean;
  /** Avviso sulla settimana mostrata, nascosto durante il cambio settimana. */
  children?: React.ReactNode;
}

export default function WeekSelector({
  value,
  max,
  selected,
  children,
}: IWeekSelector) {
  const { pending, navigate } = useWeekNavigation();

  return (
    <Card className="flex-wrap items-stretch justify-start gap-4 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Icon size="sm" className="text-primary">
            event
          </Icon>
          <Text size={0} className="uppercase text-muted-fg">
            Settimana dal
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <FieldDate
            className="w-[200px]"
            value={value}
            max={max}
            disabled={pending}
            onChange={navigate}
          />
          {selected && (
            <Btn
              label="Più recente"
              icon="history"
              disabled={pending}
              onClick={() => navigate()}
            />
          )}
        </div>
      </div>
      {!pending && children}
    </Card>
  );
}
