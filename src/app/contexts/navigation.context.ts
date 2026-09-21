import { createContext } from "react";

export interface NavigationContextValue {
  isDesktop: boolean;
  toggleDesktopSidebar: () => void;
  showDetail: boolean;
  showSidebar: boolean;
  goToSidebar: () => void;
  goToDetail: () => void;
  goToPreviousView: () => void;
}

export const NavigationContext = createContext<
  NavigationContextValue | undefined
>(undefined);
