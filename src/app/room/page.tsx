"use client";
import { useEffect, useState } from "react";
import { P2P } from "@/lib/P2P";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MdCallEnd,
  MdOutlineScreenShare,
  MdOutlineStopScreenShare,
} from "react-icons/md";
import {
  BsMic,
  BsMicMute,
  BsCameraVideo,
  BsCameraVideoOff,
  BsChatDots,
} from "react-icons/bs";
import Header from "@/components/room/header";
import Chat from "@/components/room/chat";
import { useSession } from "next-auth/react";

const peer = new P2P();
const names = ["jawad", "ali", "ahm", "sajid", "jad", "jafar", "nano", "jafri"];

export default function Home() {
  const [roomUsers, setRoomUsers] = useState<User[]>([]);
  const [roomName, setRoomName] = useState<string>("");
  const [muted, setMuted] = useState<boolean>(false);
  const [camera, setCamera] = useState<boolean>(true);
  const [openChat, setOpenChat] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    const name = names[Math.floor(Math.random() * names.length)];
    peer.joinRoom(
      searchParams?.get("user_name")!,
      searchParams?.get("room_name")!,
      searchParams?.get("meeting_id")!,
      searchParams?.get("user_image")!
    );

    peer.eventListeners(
      (eventName: string, data: User | string | User[] | any) => {
        switch (eventName) {
          case "new-user-joined":
            // console.log("new user joined", data);
            break;
          case "user-disconnected":
            // console.log("user disconnected", data);
            break;
          case "users-in-room":
            setRoomUsers(data as User[]);
            break;
          case "room-name":
            setRoomName(data as string);
            break;
          case "streams":
            break;

          default:
            break;
        }
      }
    );

    const handleCloseReloadTab = (e: any) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave this room?";
      peer.disconnectUser();
    };

    window.addEventListener("beforeunload", handleCloseReloadTab);

    return () => {
      window.removeEventListener("beforeunload", handleCloseReloadTab);
      peer.disconnectUser();
    };
  }, []);

  const endCall = () => {
    peer.disconnectUser();
    router.push("/");
  };
  const shareScreen = () => {
    peer.shareScreen();
  };
  const mute = () => {
    const isMuted = muted;
    peer.muteStream(!isMuted);
    setMuted(!muted);
  };

  const camonoff = () => {
    const isCamera = camera;
    peer.toggleOnOff(!isCamera);
    setCamera(!camera);
  };

  return (
    <main className="w-full h-screen flex  bg-white relative">
      <div className="flex-1 relative overflow-hidden">
        <div className="w-full h-full  relative  rounded-lg">
          <div className="absolute inset-0">
            <Header roomName={roomName} />
          </div>
          <video
            id="pinStream"
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover -z-30"
          />
          {!camera && (
            <div className="absolute w-full bg-slate-800 h-full inset-0 rounded-lg flex items-center justify-center">
              <img
                src={session?.user?.image!}
                alt="user-image"
                className="rounded-full w-10 h-10"
              />
            </div>
          )}
          <div className="w-full absolute  bottom-2 p-2 flex space-x-5 items-center justify-center z-20">
            <button
              onClick={mute}
              className="btn  hover:bg-opacity-20 outline-none border-none backdrop-blur-sm bg-white/10 cursor-pointer"
            >
              {muted ? (
                <BsMicMute className="w-5 h-5 text-white" />
              ) : (
                <BsMic className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={camonoff}
              className="btn hover:bg-opacity-20 outline-none border-none backdrop-blur-sm bg-white/10 cursor-pointer"
            >
              {camera ? (
                <BsCameraVideo className="w-5 h-5  text-white" />
              ) : (
                <BsCameraVideoOff className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={endCall}
              className="btn btn-lg  border-none hover:bg-red-600 rounded-2xl bg-red-500"
            >
              <MdCallEnd className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={shareScreen}
              className="btn  hover:bg-opacity-20 outline-none border-none backdrop-blur-sm bg-white/10 cursor-pointer"
            >
              <MdOutlineScreenShare className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setOpenChat(!openChat)}
              className="btn block lg:hidden  hover:bg-opacity-20 outline-none border-none backdrop-blur-sm bg-white/10 cursor-pointer"
            >
              <BsChatDots className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        <div
          className={`w-4/5 md:w-[400px] h-full block lg:hidden bg-white ${
            openChat ? "block" : "hidden"
          }   rounded-tl-lg rounded-bl-lg  fixed top-0  right-0 z-30 text-white`}
        >
          {/* <button onClick={() => setOpenChat(!openChat)}>close</button> */}
          <Chat setOpenChat={setOpenChat} isDrawer={true} />
        </div>
        <div
          id="video-grid"
          className="w-[150px] h-full overflow-y-scroll  top-16 z-20  absolute  right-2  hide-scroll-bar"
        >
          <div className="w-[150px] h-[100px] bg-slate-900 rounded-lg relative">
            <video
              id="myStream"
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover -z-30  rounded-lg"
            />
            {!camera && (
              <div className="absolute w-full bg-slate-800 h-full inset-0 rounded-lg flex items-center justify-center">
                <img
                  src={session?.user?.image!}
                  alt="user-image"
                  className="rounded-full w-10 h-10"
                />
              </div>
            )}
            <div className="absolute inset-0 rounded-lg flex flex-col  w-full h-full justify-end p-2 text-white z-50">
              <div className="w-full flex items-center justify-between">
                <div className="p-2 rounded-full  backdrop-blur-sm bg-white/10  flex items-center justify-center">
                  {muted ? (
                    <BsMicMute className="w-4 h-4" />
                  ) : (
                    <BsMic className="w-4 h-4" />
                  )}
                </div>
                <p className=" backdrop-blur-sm bg-white/10 rounded-xl px-2 py-0.5 font-bold text-xs">
                  {session?.user?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`w-[400px] h-full  bg-[#E5DED6] hidden lg:block   transition-all duration-500 ease-in-out  `}
      >
        <Chat setOpenChat={setOpenChat} isDrawer={false} />
      </div>

      {/* <div
        className={`w-[300px] bg-slate-800 hidden lg:block  rounded-lg transition-all duration-500 ease-in-out  `}
      ></div> */}

      {/* <div className="w-full h-full bg-black flex p-2 lg:p-4">
        <div className="w-full h-full flex flex-col space-y-5 bg-slate-800">
          <div className="flex items-center overflow-y-hidden overflow-x-scroll w-full   bg-red-500 z-50 py-5 hide-scroll-bar">
            <div
              className="flex flex-nowrap items-center bg-green-500 "
              id="video-grid"
            >
              <div className="inline-block px-3 ">
                <div className="w-[150px] h-[100px] bg-slate-600 rounded-lg relative">
                  {!camera && (
                    <div className="absolute w-full bg-slate-800 h-[113px] inset-0 rounded-lg flex items-center justify-center">
                      <img
                        src={session?.user?.image!}
                        alt="user-image"
                        className="rounded-full w-10 h-10"
                      />
                    </div>
                  )}
                  <video
                    id="myStream"
                    autoPlay
                    playsInline
                    muted
                    className="rounded-lg object-fill"
                  />

                  <div className="absolute inset-0 rounded-lg flex flex-col  w-[150px] h-[113px] justify-end p-2 text-white">
                    <div className="w-full flex items-center justify-between">
                      <div className="p-2 rounded-full bg-gray-700 bg-opacity-80  flex items-center justify-center">
                        {muted ? (
                          <BiMicrophoneOff className="w-4 h-4" />
                        ) : (
                          <BiMicrophone className="w-4 h-4" />
                        )}
                      </div>
                      <p className="bg-gray-700 bg-opacity-80 rounded-xl px-4 py-0.5 font-bold text-sm">
                        {session?.user?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="w-full h-full bg-slate-300  mt-14 flex justify-center items-center"
            id="pin-video"
          >
            <video
              id="pinStream"
              autoPlay
              playsInline
              muted
              className="rounded-lg object-fill md:w-[600px] md:h-[400px]"
            />
          </div>
          <div className=" bg-orange-500 p-3">
            <button onClick={endCall}>EndCall</button>
            <button onClick={mute}>mute</button>
            <button onClick={shareScreen}>share screen</button>
            <button onClick={camonoff}>on/off</button>
          </div>
        </div>
        <div className="w-1/4 bg-zinc-800 hidden lg:block"></div>
      </div> */}
    </main>
  );
}
