"use client";
import { useEffect, useRef } from "react";
import usePeerEventListener from "@/lib/usePeerEventListener";

import Chat from "@/components/room/chat";
import Buttons from "@/components/room/Buttons";
import UserStreams from "@/components/room/user-streams";
import RoomName from "@/components/room/room-name";
import RoomInfo from "@/components/room/room-info";
import MyStream from "@/components/room/MyStream";
import PinStream from "@/components/room/pinStream";

import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { setMyStream } from "@/store/features/app-state/app-slice";
import { RootState } from "@/store/configuration";
import { Toaster } from "react-hot-toast";
import { P2P } from "@/lib/P2P";

const peer = new P2P();

export default function Home() {
  const { openChat, streams } = useSelector(
    (state: RootState) => state.appState
  );
  const dispatch = useDispatch();
  const { data: session } = useSession();
  usePeerEventListener(peer);
  const pinVideoRef = useRef<HTMLVideoElement | null>(null);
  const myVideoStreamRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const start = async () => {
      const myStream = await peer.init();
      dispatch(setMyStream(myStream));

      if (myVideoStreamRef.current) {
        myVideoStreamRef.current.srcObject = myStream;
        myVideoStreamRef.current.play();
      }
      if (pinVideoRef.current) {
        pinVideoRef.current.srcObject = myStream;
        pinVideoRef.current.play();
      }
      peer.joinRoom(
        sessionStorage.getItem("user_name")!,
        sessionStorage.getItem("roomName")!,
        sessionStorage.getItem("meetingId")!,
        sessionStorage.getItem("user_image")!
      );
    };

    start();
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
  }, [pinVideoRef, myVideoStreamRef]);

  return (
    <main className="w-full h-screen flex relative flex-1 flex-col p-2">
      <RoomName />
      <RoomInfo />

      <div className="flex-1  rounded w-full h-full">
        <div className="relative w-full h-full flex items-center justify-center overflow-y-scroll hide-scroll-bar">
          <PinStream pinVideoRef={pinVideoRef} image={session?.user?.image!} />

          <div className="absolute inset-0 w-full h-full">
            {/* streams */}
            <div className="absolute right-2 w-[150px] h-full overflow-y-scroll hide-scroll-bar">
              <MyStream
                image={session?.user?.image!}
                myVideoStreamRef={myVideoStreamRef}
                pinVideoRef={pinVideoRef}
                username="you"
              />
              {streams.length > 0 &&
                streams.map((call, id: number) => (
                  <UserStreams call={call} pinVideoRef={pinVideoRef} key={id} />
                ))}
            </div>
            <Buttons
              myVideoStreamRef={myVideoStreamRef}
              pinVideoRef={pinVideoRef}
              peer={peer}
            />
          </div>
        </div>
      </div>
      <div
        className={`w-4/5 md:w-[400px] h-full block lg:hidden bg-white ${
          openChat ? "block" : "hidden"
        }   rounded-tl-lg rounded-bl-lg  fixed top-0  right-0 z-50 text-black`}
      >
        <Chat isDrawer={true} peer={peer} />
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </main>
  );
}
