import React from "react";
import { TbPinnedOff, TbPinned } from "react-icons/tb";
import { BsMic, BsMicMute } from "react-icons/bs";

type MyStreamProps = {
  myVideoStreamRef: React.MutableRefObject<HTMLVideoElement | null>;
  myCamera: boolean;
  myMuted: boolean;
  myPin: boolean;
  username: string;
  image: string;
  pinVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  setMyPin: React.Dispatch<React.SetStateAction<boolean>>;
  setUserPin: React.Dispatch<React.SetStateAction<string>>;
  myStream: MediaStream;
  userPin: string;
  myScreenShare: MediaStream | null;
  isSharing: boolean;
};

const MyStream = ({
  myVideoStreamRef,
  myCamera,
  myMuted,
  myPin,
  username,
  image,
  pinVideoRef,
  setMyPin,
  setUserPin,
  myStream,
  userPin,
  myScreenShare,
  isSharing,
}: MyStreamProps) => {
  const pinMyStream = () => {
    if (pinVideoRef.current) {
      if (myPin) {
        pinVideoRef.current.srcObject = null;
        setMyPin(false);
        setUserPin("");
      } else {
        pinVideoRef.current.srcObject = isSharing ? myScreenShare : myStream;
        pinVideoRef.current.play();
        setMyPin(true);
        setUserPin("");
      }
    }
  };

  return (
    <div
      className={`w-[150px] h-[100px] rounded-lg relative ${
        userPin ? "block" : "hidden"
      }`}
    >
      <video
        id="myStream"
        ref={myVideoStreamRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover -z-30  rounded-lg"
      />
      {!myCamera && (
        <div className="absolute w-full bg-slate-700 h-full inset-0 rounded-lg flex items-center justify-center">
          <img
            src={image}
            alt="user-image"
            className="rounded-full w-10 h-10"
          />
        </div>
      )}
      <div className="absolute inset-0 rounded-lg flex flex-col  w-full h-full justify-start text-white z-50">
        <div className="w-full flex items-center space-x-1 p-1">
          <div className="p-2 rounded-full  backdrop-blur-sm bg-white/10  flex items-center justify-center">
            {myMuted ? (
              <BsMicMute className="w-4 h-4" />
            ) : (
              <BsMic className="w-4 h-4" />
            )}
          </div>
          <button
            id="my-pin"
            onClick={pinMyStream}
            className="p-2 rounded-full  backdrop-blur-sm bg-white/10  flex items-center justify-center"
          >
            {myPin ? (
              <TbPinnedOff className="w-4 h-4" />
            ) : (
              <TbPinned className="w-4 h-4" />
            )}
          </button>

          <p className=" backdrop-blur-sm bg-white/10 rounded-xl px-2 py-0.5 font-bold text-xs">
            {username}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyStream;
