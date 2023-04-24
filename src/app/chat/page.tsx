import dynamic from "next/dynamic";
const Main = dynamic(() => import("@/components/room/Main"), { ssr: false });
import Chat from "@/components/room/chat";
import Header from "@/components/room/header";

const Page = () => {
  return (
    <div className="w-full h-screen flex">
      <Header isDrawer={false} />
      <div className="w-full h-full flex relative flex-1 flex-col p-2">
        <Main />
      </div>
      <Chat isDrawer={false} />
    </div>
  );
};

export default Page;
