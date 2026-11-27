import { useSelector } from "react-redux";

export const usePermission = (moduleName, action) => {
  const userSetting = useSelector((state) => state.user.userInfo?.response);

  if (["O", "S"].includes(userSetting?.role)) return true; // Allow all actions for 'O' and 'S' roles

  const profile = userSetting?.access;

  if (!profile || !moduleName || !action) return false;

  return profile?.[moduleName]?.[action] ?? false;
};
