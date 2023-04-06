"use client";
// Import necessary dependencies and components
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { P2P } from "@/lib/P2P";
import usePeerEventListener from "@/lib/usePeerEventListener";
import useHandleTabAction from "@/lib/useHandleTabAction";
import Header from "@/components/room/header";
import Chat from "@/components/room/chat";
import Buttons from "@/components/room/Buttons";
import UserStreams from "@/components/room/user-streams";

import { useSession } from "next-auth/react";
import MyStream from "@/components/room/MyStream";
import PinStream from "@/components/room/pinStream";

// Create a new instance of P2P class to handle peer-to-peer communication
const peer = new P2P();

export default function Home() {
  // Use custom hook to handle tab action
  useHandleTabAction(peer);
  // Use custom hook to get the current user session
  const { data: session } = useSession();
  // Use custom hook to get the search parameters from the URL
  const searchParams = useSearchParams();
  // Use custom hook to handle peer event listeners
  const { roomName, streams, userCameraONOFF, userMute, userScreenShare } =
    usePeerEventListener(peer);
  // Initialize state variables to manage user's muted and camera status
  const [myMuted, setMyMuted] = useState<boolean>(false);
  const [myCamera, setMyCamera] = useState<boolean>(true);
  const [myPin, setMyPin] = useState<boolean>(true);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [userPin, setUserPin] = useState<string>("");
  // Initialize state variable to manage chat window visibility
  const [openChat, setOpenChat] = useState<boolean>(false);
  // Create refs to manage user's pinned stream and own video stream
  const pinVideoRef = useRef<HTMLVideoElement | null>(null);
  const myVideoStreamRef = useRef<HTMLVideoElement | null>(null);
  // Initialize state variable to store user's own video stream
  const [myStream, setMyStream] = useState<MediaStream | null>(null);

  // Use useEffect hook to run code on component mount and unmount
  useEffect(() => {
    // Define an async function to initialize peer connection and set user's own video stream
    const start = async () => {
      // Initialize peer connection and get user's own video stream
      const myStream = await peer.init();

      // Set user's own video stream to state variable and play the stream in the video element
      setMyStream(myStream);
      if (!myVideoStreamRef.current) return;
      myVideoStreamRef.current.srcObject = myStream;
      myVideoStreamRef.current.play();

      // Set user's own video stream to the pinned video element and play the stream in the video element
      if (!pinVideoRef.current) return;
      pinVideoRef.current.srcObject = myStream;
      pinVideoRef.current.play();

      // Join a room with the given search parameters
      peer.joinRoom(
        searchParams?.get("user_name")!,
        searchParams?.get("room_name")!,
        searchParams?.get("meeting_id")!,
        searchParams?.get("user_image")!
      );
    };
    // Call the start function
    start();
  }, [pinVideoRef, myVideoStreamRef]);

  return (
    <main className="w-full h-screen flex  bg-black relative">
      <div className="flex-1 relative overflow-hidden">
        <div className="w-full h-full  relative  rounded-lg">
          <div className="absolute inset-0">
            <Header
              roomName={roomName}
              isSharing={isSharing}
              userPin={userPin}
              userScreenShare={userScreenShare}
            />
          </div>
          <PinStream
            pinVideoRef={pinVideoRef}
            myCamera={myCamera}
            image={session?.user?.image!}
            userCameraONOFF={userCameraONOFF}
            userScreenShare={userScreenShare}
            userPin={userPin}
            streams={streams}
            isSharing={isSharing}
          />
          <Buttons
            peer={peer}
            myCamera={myCamera}
            myMuted={myMuted}
            openChat={openChat}
            setOpenChat={setOpenChat}
            setMyCamera={setMyCamera}
            setMyMuted={setMyMuted}
            myVideoStreamRef={myVideoStreamRef}
            pinVideoRef={pinVideoRef}
            isSharing={isSharing}
            setIsSharing={setIsSharing}
            userPin={userPin}
            userScreenShare={userScreenShare}
          />
        </div>
        <div
          className={`w-4/5 md:w-[400px] h-full block lg:hidden bg-white ${
            openChat ? "block" : "hidden"
          }   rounded-tl-lg rounded-bl-lg  fixed top-0  right-0 z-50 text-white`}
        >
          <Chat setOpenChat={setOpenChat} isDrawer={true} />
        </div>
        <div
          id="video-grid"
          className="w-[150px] h-full overflow-y-scroll  top-16 z-20  absolute  right-2  hide-scroll-bar"
        >
          <MyStream
            image={session?.user?.image!}
            myStream={myStream!}
            myCamera={myCamera}
            myMuted={myMuted}
            myPin={myPin}
            myVideoStreamRef={myVideoStreamRef}
            pinVideoRef={pinVideoRef}
            setMyPin={setMyPin}
            setUserPin={setUserPin}
            username="you"
            userPin={userPin}
          />

          {streams.length > 0 &&
            streams.map((call, id: number) => (
              <UserStreams
                call={call}
                myStream={myStream!}
                pinVideoRef={pinVideoRef}
                setMyPin={setMyPin}
                setUserPin={setUserPin}
                streams={streams}
                userCameraONOFF={userCameraONOFF}
                userMute={userMute}
                userPin={userPin}
                key={id}
              />
            ))}
        </div>
      </div>
      <div
        className={`w-[400px] h-full  bg-[#E5DED6] hidden lg:block   transition-all duration-500 ease-in-out  `}
      >
        <Chat setOpenChat={setOpenChat} isDrawer={false} />
      </div>
    </main>
  );
}
