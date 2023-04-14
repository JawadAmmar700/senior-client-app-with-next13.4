"use client";
import React from "react";
import {
  BsMic,
  BsMicMute,
  BsCameraVideo,
  BsCameraVideoOff,
  BsChatDots,
  BsRecord2Fill
} from "react-icons/bs";
import { MdCallEnd, MdOutlineScreenShare } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { RootState } from "@/store/configuration";
import {
  setMyScreenShare,
  setOpenChat,
  setIsSharing,
  setMyMuted,
  setMyCamera,
  setRecordingState
} from "@/store/features/app-state/app-slice";
import { P2P } from "@/lib/P2P";
import { startRecording } from "@/lib/recordingFncs";

type ButtonsProps = {
  myVideoStreamRef: React.MutableRefObject<HTMLVideoElement | null>;
  pinVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  peer: P2P;
};

const Buttons = ({ myVideoStreamRef, pinVideoRef, peer }: ButtonsProps) => {
  const { userScreenShare, userPin, isSharing, myCamera, myMuted, streams,recordingState } =
    useSelector((state: RootState) => state.appState);
  const dispatch = useDispatch();

  const router = useRouter();
  const isSreenShare = userScreenShare?.find((s) => s === userPin);

  const endCall = () => {
    peer.disconnectUser();
    router.push("/");
  };
  const shareScreen = () => {
    if (streams.length > 0) {
      peer.shareScreen(
        myVideoStreamRef,
        pinVideoRef,
        setMyScreenShare,
        setIsSharing,
        dispatch
      );
    } else {
      toast.error("No one in this room to share screen with 😔");
    }
  };

  const mute = () => {
    peer.muteStream(!myMuted);
    dispatch(setMyMuted());
  };

  const camonoff = () => {
    peer.toggleOnOff(!myCamera);
    dispatch(setMyCamera());
  };


  const handleRecording = async() => {
    await startRecording()
    dispatch(setRecordingState())
  }

  return (
    <div className="w-full absolute  bottom-2 p-2 flex space-x-5 items-center justify-center z-40">
      <button
        onClick={mute}
        className={`btn outline-none border-none backdrop-blur-sm  ${
          isSharing || isSreenShare
            ? "bg-black"
            : "bg-white/10 hover:bg-opacity-20"
        } cursor-pointer`}
      >
        {myMuted ? (
          <BsMicMute className="w-5 h-5 text-white" />
        ) : (
          <BsMic className="w-5 h-5 text-white" />
        )}
      </button>
      <button
        onClick={camonoff}
        className={`btn outline-none border-none backdrop-blur-sm ${
          isSharing || isSreenShare
            ? "bg-black"
            : "bg-white/10 hover:bg-opacity-20"
        } cursor-pointer`}
      >
        {myCamera ? (
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
        className={`btn outline-none border-none backdrop-blur-sm ${
          isSharing || isSreenShare
            ? "bg-black"
            : "bg-white/10 hover:bg-opacity-20"
        } cursor-pointer`}
      >
        <MdOutlineScreenShare className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={() => dispatch(setOpenChat())}
        className={`btn outline-none lg:hidden block  border-none backdrop-blur-sm ${
          isSharing || isSreenShare
            ? "bg-black"
            : "bg-white/10 hover:bg-opacity-20"
        } cursor-pointer`}
      >
        <BsChatDots className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={handleRecording}
        className={`btn outline-none border-none backdrop-blur-sm ${
          isSharing || isSreenShare
            ? "bg-black"
            : "bg-white/10 hover:bg-opacity-20"
        } cursor-pointer`}
      >
        {
          recordingState ?
        <BsRecord2Fill className="w-5 h-5 text-red-500 animate-pulse" />:
        <BsRecord2Fill className="w-5 h-5 text-white" />
        }
      </button>
    </div>
  );
};

export default Buttons;
