import Chat from "@/components/room/chat";
import Header from "@/components/room/header";
import HandleTabActionWrapper from "@/lib/HandleTabActionWrapper";
import React from "react";

const RoomLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <HandleTabActionWrapper>
      <div className="w-full h-screen flex">
        <Header isDrawer={false} />
        {children}
        <Chat isDrawer={false} />
      </div>
    </HandleTabActionWrapper>
  );
};

export default RoomLayout;
