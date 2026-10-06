"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import HomeLoading from "./HomeLoading";

interface IWeekNavigation {
  /** true mentre si caricano i dati della nuova settimana. */
  pending: boolean;
  /** Mostra la settimana che parte da day ("YYYY-MM-DD"); senza, la più recente. */
  navigate: (day?: string) => void;
}

const WeekNavigationContext = React.createContext<IWeekNavigation>({
  pending: false,
  navigate: () => {},
});

export const useWeekNavigation = () => React.useContext(WeekNavigationContext);

// Il cambio settimana avviene in una transition: la pagina corrente resta
// visibile (niente fallback del Suspense) e `pending` dice a chi sta sotto
// che i nuovi dati sono in arrivo.
export function WeekNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  const navigate = React.useCallback(
    (day?: string) => {
      startTransition(() => {
        router.push(day ? `/?week=${day}` : "/");
      });
    },
    [router]
  );

  const value = React.useMemo(
    () => ({ pending, navigate }),
    [pending, navigate]
  );

  return (
    <WeekNavigationContext.Provider value={value}>
      {children}
    </WeekNavigationContext.Provider>
  );
}

// Contenuto legato alla settimana: sostituito dallo spinner durante il cambio
export function WeekContent({ children }: { children: React.ReactNode }) {
  const { pending } = useWeekNavigation();
  return pending ? <HomeLoading /> : children;
}
