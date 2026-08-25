import { createContext, useContext, type ReactNode } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useMediaQuery } from "../hooks/useMediaQuery";

interface NavigationContextValue {
  showDetail: boolean;
  showSidebar: boolean;
  goToSidebar: () => void;
  goToDetail: () => void;
  goToPreviousView: () => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(
  undefined,
);

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isRootPath = location.pathname === "/";

  const showDetail = !isRootPath;
  const showSidebar = !showDetail || isDesktop;

  const goToSidebar = () => {
    navigate("/");
  };

  const goToDetail = () => {
    navigate("/tickets");
  };

  const goToPreviousView = () => {
    navigate(isDesktop ? "/tickets" : "/");
  };

  return (
    <NavigationContext.Provider
      value={{
        showDetail,
        showSidebar,
        goToSidebar,
        goToDetail,
        goToPreviousView,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }

  return context;
}
