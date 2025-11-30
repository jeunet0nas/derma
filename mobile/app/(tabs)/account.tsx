import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccountHistory } from "@/hooks/useAccountHistory";
import { createMenuItems } from "@/constants/accountMenuItems";
import GuestAccountView from "@/components/account/GuestAccountView";
import LoggedInAccountView from "@/components/account/LoggedInAccountView";

export default function AccountScreen() {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const {
    history,
    loadingHistory,
    refreshing,
    showAllHistory,
    handleRefresh,
    handleDeleteHistory,
    toggleShowAll,
    clearHistory,
  } = useAccountHistory(isLoggedIn);

  const menuItems = createMenuItems().map((item) => ({
    ...item,
    onPress: () => console.log(item.title),
  }));

  const handleLogout = async () => {
    await logout();
    clearHistory();
  };

  if (!isLoggedIn) {
    return <GuestAccountView />;
  }

  return (
    <LoggedInAccountView
      user={user!}
      onLogout={handleLogout}
      history={history}
      loadingHistory={loadingHistory}
      refreshing={refreshing}
      showAllHistory={showAllHistory}
      onRefresh={handleRefresh}
      onDeleteHistory={handleDeleteHistory}
      onToggleShowAll={toggleShowAll}
      menuItems={menuItems}
    />
  );
}
