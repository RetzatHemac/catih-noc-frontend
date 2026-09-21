import { useState, type ReactNode } from "react";

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
  const [desktopSidebarHidden, setDesktopSidebarHidden] = useState(false);

  const showDetail = isDesktop || !isRootPath;
  const showSidebar = isDesktop ? !desktopSidebarHidden : isRootPath;

  const toggleDesktopSidebar = () => {
    if (isDesktop) setDesktopSidebarHidden((hidden) => !hidden);
  };

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
        isDesktop,
        toggleDesktopSidebar,
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
