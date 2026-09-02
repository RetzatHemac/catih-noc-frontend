import type { ReactNode } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useMediaQuery } from "../hooks/useMediaQuery";
import { NavigationContext } from "../contexts/navigation.context";

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
