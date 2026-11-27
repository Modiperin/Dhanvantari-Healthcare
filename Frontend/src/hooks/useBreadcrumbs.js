// hooks/useBreadcrumbs.js
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { BREADCRUMB_CONFIG, humanizeText } from "../config/breadcrumbs";

export const useBreadcrumbs = () => {
  const location = useLocation();
  const user = useSelector((state) => state.user?.userInfo?.response);

  const breadcrumbItems = useMemo(() => {
    if (!user) return [];

    const pathParts = location.pathname
      .split("/")
      .filter((part) => part !== "");

    // Start with user name as the first breadcrumb
    const items = [{ title: user.name, path: "/dashboard" }];

    if (pathParts.length === 0) {
      return items;
    }

    const mainModule = pathParts[0];
    const subModule = pathParts[1] || "";

    // Check if we have a configured breadcrumb for this path
    if (BREADCRUMB_CONFIG[mainModule]) {
      const config = BREADCRUMB_CONFIG[mainModule];

      // Add module name breadcrumb
      items.push({
        title: config.moduleName,
        path: `/${mainModule}`,
      });

      // Add sub-module if exists
      if (subModule && config.subModules[subModule]) {
        items.push({
          title: config.subModules[subModule],
          path: location.pathname,
        });
      } else if (config.subModules[""]) {
        // Add default sub-module
        items.push({
          title: config.subModules[""],
          path: `/${mainModule}`,
        });
      }
    } else {
      // Fallback for unconfigured paths - use humanized path segments
      items.push({
        title: humanizeText(mainModule),
        path: `/${mainModule}`,
      });

      if (subModule) {
        items.push({
          title: humanizeText(subModule),
          path: location.pathname,
        });
      }
    }

    return items;
  }, [location.pathname, user]);

  return breadcrumbItems;
};
