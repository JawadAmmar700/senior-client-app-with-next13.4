import dynamic from "next/dynamic";
const Main = dynamic(() => import("@/components/room/Main"), { ssr: false });
const Header = dynamic(() => import("@/components/room/header"), {
  ssr: false,
});

const Page = () => {
  return (
    <div className="w-full h-screen flex">
      <Header isDrawer={false} />
      <div className="w-full h-full flex relative flex-1 flex-col p-2">
        <Main />
      </div>
    </div>
  );
};

export default Page;
