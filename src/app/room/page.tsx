"use client";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { P2P } from "@/lib/P2P";
import { useRouter } from "next/navigation";

const peer = new P2P();
const names = ["jawad", "ali", "ahm", "sajid", "jad", "jafar", "nano", "jafri"];

export default function Home() {
  const [roomUsers, setRoomUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const name = names[Math.floor(Math.random() * names.length)];
    peer.joinRoom(name, "room-1", "image");

    peer.eventListeners((eventName: string, data: User | string | User[]) => {
      switch (eventName) {
        case "new-user-joined":
          console.log("new user joined", data);
          break;
        case "user-disconnected":
          console.log("user disconnected", data);
          break;
        case "users-in-room":
          setRoomUsers(data as User[]);
          break;

        default:
          break;
      }
    });

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
    peer.muteStream();
  };

  const camonoff = () => {
    peer.toggleOnOff();
  };

  return (
    <main>
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
        <div id="container"></div>
        <button onClick={endCall}>EndCall</button>
        <button onClick={mute}>mute</button>
        <button onClick={shareScreen}>share screen</button>
        <button onClick={camonoff}>on/off</button>
      </div>
    </main>
  );
}
