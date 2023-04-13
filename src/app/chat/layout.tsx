import Chat from "@/components/room/chat";
import Header from "@/components/room/header";

const RoomLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex">
      <Header isDrawer={false} />
      {children}
      <Chat isDrawer={false} />
    </div>
  );
};

export default RoomLayout;
