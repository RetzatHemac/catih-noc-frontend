import type { ReactNode } from "react";

import { AuthProvider } from "../../auth";
import { PendingNotificationsProvider } from "../../features/tickets/context/PendingNotificationsProvider";
import { ThemeProvider } from "./ThemeProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <PendingNotificationsProvider>{children}</PendingNotificationsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
