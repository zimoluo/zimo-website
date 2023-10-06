import React from "react";
import { clearSessionToken, deleteUserAccount } from "@/lib/accountClientManager";
import { useUser } from "./contexts/UserContext";
import { useSettings } from "./contexts/SettingsContext";
import { defaultSettings } from "@/interfaces/defaultSettings";

type Props = {
  utility: "logOut" | "resetSettings" | "deleteAccount";
};

const SettingsUtilityButton: React.FC<Props> = ({ utility }) => {
  const { user, setUser } = useUser();
  const { updateSettings } = useSettings();

  const utilityFunctionMap: { [key: string]: () => void } = {
    logOut,
    resetSettings,
    deleteAccount,
  };

  const utilityTextMap: { [key: string]: string } = {
    logOut: 'Log Out',
    resetSettings: 'Reset Settings to Default',
    deleteAccount: 'Delete My Account',
  };

  function resetSettings() {
    const {syncSettings, ...defaultSettingsWithoutSync} = defaultSettings;
    updateSettings(defaultSettingsWithoutSync);
  }

  async function logOut(): Promise<void> {
    await clearSessionToken();
    setUser(null);
  }

  async function deleteAccount(): Promise<void> {
    const sub = user?.sub;
    if (!sub) return;
    await deleteUserAccount(sub);
    await logOut();
  }

  return (
    <button onClick={utilityFunctionMap[utility]} className="w-full h-10 my-2 font-normal text-base md:text-lg">
        {utilityTextMap[utility]}
    </button>
  );
};

export default SettingsUtilityButton;
