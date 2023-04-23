import Header from "@/components/reminder/header";
import React from "react";

const ReminderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default ReminderLayout;
