"use client";
import { useEffect, useRef } from "react";

import Chat from "@/components/room/chat";
import Buttons from "@/components/room/Buttons";
import UserStreams from "@/components/room/user-streams";
import RoomName from "@/components/room/room-name";
import RoomInfo from "@/components/room/room-info";
import MyStream from "@/components/room/MyStream";
import PinStream from "@/components/room/pinStream";

import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/configuration";
import { Toaster } from "react-hot-toast";
import { P2P } from "@/lib/P2P";
import RecordingTracker from "@/components/room/recordingTracker";

const peer = new P2P();

export default function Main() {
  const { openChat, streams } = useSelector(
    (state: RootState) => state.appState
  );
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const pinVideoRef = useRef<HTMLVideoElement | null>(null);
  const myVideoStreamRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const start = async () => {
      await peer.init({
        myVideoStreamRef,
        pinVideoRef,
        dispatch,
      });

      peer.joinRoom();
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
    <div className="w-full h-full flex">
      <div className="w-full h-full flex relative flex-1 flex-col p-2">
        <RoomName />
        <RoomInfo />

        <div className="flex-1  rounded w-full h-full">
          <div className="relative w-full h-full flex items-center justify-center overflow-y-scroll hide-scroll-bar">
            <PinStream
              pinVideoRef={pinVideoRef}
              image={session?.user?.image!}
            />

            <div className="absolute inset-0 w-full h-full">
              {/* streams */}
              <div className="absolute right-2 w-[150px] h-full overflow-y-scroll hide-scroll-bar">
                <MyStream
                  myVideoStreamRef={myVideoStreamRef}
                  image={session?.user?.image!}
                  username="you"
                  peer={peer}
                />
                {streams.length > 0 &&
                  streams.map((call, id: number) => (
                    <UserStreams peer={peer} call={call} key={id} />
                  ))}
              </div>
              <Buttons peer={peer} />
            </div>
            <RecordingTracker />
          </div>
        </div>
        <div
          className={`w-4/5 md:w-[400px] h-full block lg:hidden bg-white ${
            openChat ? "block" : "hidden"
          }   rounded-tl-lg rounded-bl-lg  fixed top-0  right-0 z-50 text-black`}
        >
          <Chat isDrawer={true} peer={peer} />
        </div>
      </div>
      <Chat isDrawer={false} peer={peer} />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
