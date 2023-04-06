import React from "react";
import Video from "./Video";
import { TbPinnedOff, TbPinned } from "react-icons/tb";
import { BsMic, BsMicMute } from "react-icons/bs";

type UserStreamsProps = {
  call: MapOfPeerCalls;
  userCameraONOFF: string[];
  userMute: string[];
  pinVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  streams: MapOfPeerCalls[];
  myStream: MediaStream;
  userPin: string;
  setUserPin: React.Dispatch<React.SetStateAction<string>>;
  setMyPin: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserStreams = ({
  call,
  userCameraONOFF,
  userMute,
  pinVideoRef,
  streams,
  myStream,
  userPin,
  setUserPin,
  setMyPin,
}: UserStreamsProps) => {
  const isCamera = userCameraONOFF.find((s) => s === call.id);
  const isMute = userMute.find((s) => s === call.id);

  const pinUserStream = (userId: string) => {
    if (pinVideoRef.current) {
      const stream = streams.find((s) => s.id === userId);
      if (stream) {
        if (userId === userPin) {
          pinVideoRef.current.srcObject = myStream;
          setMyPin(true);
          setUserPin("");
          return;
        }
        pinVideoRef.current.srcObject = stream.stream;
        setUserPin(userId);
        setMyPin(false);
      }
    }
  };

  return (
    <div className="w-[150px] h-[100px] rounded-lg relative mt-5">
      <Video stream={call.stream} />
      {isCamera && (
        <div className="absolute w-full bg-slate-700 h-full inset-0 rounded-lg flex items-center justify-center">
          <img
            src={call.user.photoUrl}
            alt="user-image"
            className="rounded-full w-10 h-10"
          />
        </div>
      )}
      <div className="absolute inset-0 rounded-lg flex flex-col  w-full h-full justify-start text-white z-50">
        <div className="w-full flex items-center space-x-1 p-1">
          <div className="p-2 rounded-full  backdrop-blur-sm bg-white/10  flex items-center justify-center">
            {isMute ? (
              <BsMicMute className="w-4 h-4" />
            ) : (
              <BsMic className="w-4 h-4" />
            )}
          </div>
          <button
            onClick={() => pinUserStream(call.id)}
            className="p-2 rounded-full  backdrop-blur-sm bg-white/10  flex items-center justify-center"
          >
            {call.id === userPin ? (
              <TbPinnedOff className="w-4 h-4" />
            ) : (
              <TbPinned className="w-4 h-4" />
            )}
          </button>

          <p
            className={`backdrop-blur-sm ${
              call.id === userPin ? "bg-sky-500" : " bg-white/10"
            } rounded-xl px-2 py-0.5 font-bold text-xs `}
          >
            {call.user.username}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserStreams;
