"use client";
import { useEffect, useState } from "react";
import { P2P } from "@/lib/P2P";
import { useRouter, useSearchParams } from "next/navigation";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
const peer = new P2P();
const names = ["jawad", "ali", "ahm", "sajid", "jad", "jafar", "nano", "jafri"];

export default function Home() {
  const [roomUsers, setRoomUsers] = useState<User[]>([]);
  const [roomName, setRoomName] = useState<string>("");
  const [muted, setMuted] = useState<boolean>(false);
  const [camera, setCamera] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  // const { data: session, status } = useSession();

  useEffect(() => {
    const name = names[Math.floor(Math.random() * names.length)];
    peer.joinRoom(
      searchParams?.get("user-name")!,
      searchParams?.get("room-name")!,
      searchParams?.get("meeting-id")!,
      searchParams?.get("user-image")!
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
    <main className="w-full h-screen bg-black">
      <nav className="flex items-center text-white justify-between p-4 border-b border-b-slate-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center p-2 bg-blue-500 rounded-lg">
            <AiOutlineVideoCamera className="text-lg text-white" />
          </div>
          <div className="divider divider-horizontal bg-slate-400 w-0.5"></div>
          <p className="font-bold text-xl">Room name</p>
        </div>
        <div className="block lg:hidden pr-4">
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-white text-black rounded-box w-60"
            >
              <li tabIndex={0} className="relative flex flex-col items-start">
                <div className="flex space-x-1">
                  <div className="w-10 rounded-full">
                    <img
                      src={searchParams?.get("user-image")!}
                      alt="Profile Picture"
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-0 text-xs">
                    <h1>Jawad Ammar</h1>
                    <p>jawadgithub@gmail.com</p>
                  </div>
                </div>
              </li>

              <li onClick={() => signOut()}>
                <p>Logout</p>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden mt-2 lg:mt-0 bg-white lg:bg-transparent text-black p-4 lg:p-0 z-20"
          id="nav-content"
        >
          <div className="list-reset lg:flex justify-end flex-1 items-center lg:pr-4">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={searchParams?.get("user-image")!}
                    alt="Profile Picture"
                    className="rounded-full"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-60"
              >
                <li className="flex flex-col items-start">
                  <div className="flex space-x-1">
                    <div className="flex flex-col items-start gap-0 text-xs">
                      <h1>Jawad Ammar</h1>
                      <p>jawadgithub@gmail.com</p>
                    </div>
                    <div className="w-10 rounded-full">
                      {/* <Image
                              src={session?.user?.image!}
                              width={40}
                              height={40}
                              alt="Profile Picture"
                              className="rounded-full"
                            /> */}
                      <img
                        src={searchParams?.get("user-image")!}
                        alt="Profile Picture"
                        className="rounded-full"
                      />
                    </div>
                  </div>
                </li>

                <li onClick={() => signOut()}>
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full h-full bg-black flex p-2 lg:p-4">
        <div className="flex overflow-x-scroll pb-10 lg:w-3/4 w-full h-[150px]  hide-scroll-bar">
          <div className="flex flex-nowrap" id="video-grid">
            <div className="inline-block px-3">
              <div className="w-[200px] h-[150px] bg-slate-600 rounded-lg relative">
                {!camera && (
                  <div className="absolute w-full bg-slate-800 h-full inset-0 rounded-lg flex items-center justify-center">
                    <img
                      src={searchParams?.get("user-image")!}
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
                  className="rounded-lg"
                />
                <div className="absolute inset-0 rounded-lg flex flex-col justify-end p-2 text-white">
                  <div className="w-full flex items-center justify-between">
                    <div className="p-2 rounded-full bg-gray-700 bg-opacity-80  flex items-center justify-center">
                      {muted ? (
                        <BiMicrophoneOff className="w-4 h-4" />
                      ) : (
                        <BiMicrophone className="w-4 h-4" />
                      )}
                    </div>
                    <p className="bg-gray-700 bg-opacity-80 rounded-xl px-4 py-0.5 font-bold text-sm">
                      {searchParams?.get("user-name")!}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/4 bg-zinc-800 hidden lg:block"></div>

      <div id="container"></div>
      {/* <h1>{searchParams?.get("meeting-id")!}</h1>
      <h1>{roomName}</h1>
      <div className="p-5 bg-slate-100 w-full relative  h-screen">
        <video
          id="myStream"
          autoPlay
          playsInline
          className={` rounded-lg ${
            roomUsers.length > 1
              ? "w-[200px] absolute top-0 right-0 "
              : "w-full"
          }`}
        />
        */}
      <div id="container"></div>
      <button onClick={endCall}>EndCall</button>
      <button onClick={mute}>mute</button>
      <button onClick={shareScreen}>share screen</button>
      <button onClick={camonoff}>on/off</button>
    </main>
  );
}
