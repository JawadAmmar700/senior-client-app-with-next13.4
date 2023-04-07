import React from "react";
import {
  BsMic,
  BsMicMute,
  BsCameraVideo,
  BsCameraVideoOff,
  BsChatDots,
} from "react-icons/bs";
import { MdCallEnd, MdOutlineScreenShare } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

import { P2P } from "@/lib/P2P";
import { RootState } from "@/store/configuration";
import {
  setMyScreenShare,
  setOpenChat,
  setIsSharing,
  setMyMuted,
  setMyCamera,
} from "@/store/features/app-state/app-slice";

type ButtonsProps = {
  peer: P2P;
  // myMuted: boolean;
  // myCamera: boolean;
  // setMyMuted: React.Dispatch<React.SetStateAction<boolean>>;
  // setMyCamera: React.Dispatch<React.SetStateAction<boolean>>;
  // setOpenChat: React.Dispatch<React.SetStateAction<boolean>>;
  // openChat: boolean;
  myVideoStreamRef: React.MutableRefObject<HTMLVideoElement | null>;
  pinVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  // setIsSharing: React.Dispatch<React.SetStateAction<boolean>>;
  // isSharing: boolean;
  // userScreenShare: string[];
  // userPin: string;
  // setMyScreenShare: React.Dispatch<React.SetStateAction<MediaStream | null>>;
};

const Buttons = ({
  peer,
  // myMuted,
  // myCamera,
  // setMyMuted,
  // setMyCamera,
  // setOpenChat,
  // openChat,
  myVideoStreamRef,
  pinVideoRef,
}: // setIsSharing,
// isSharing,
// userPin,
// userScreenShare,
// setMyScreenShare,
ButtonsProps) => {
  const { userScreenShare, userPin, isSharing, myCamera, myMuted, streams } =
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
    // setMyMuted(!myMuted);
    dispatch(setMyMuted());
  };

  const camonoff = () => {
    peer.toggleOnOff(!myCamera);
    // setMyCamera(!myCamera);
    dispatch(setMyCamera());
  };

  return (
    <div className="w-full absolute  bottom-2 p-2 flex space-x-5 items-center justify-center z-40">
      <button
        onClick={mute}
        className={`btn  hover:bg-opacity-20 outline-none border-none backdrop-blur-sm  ${
          isSharing || isSreenShare ? "bg-black/50" : "bg-white/10"
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
        className={`btn hover:bg-opacity-20 outline-none border-none backdrop-blur-sm ${
          isSharing || isSreenShare ? "bg-black/50" : "bg-white/10"
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
        className={`btn hover:bg-opacity-20 outline-none border-none backdrop-blur-sm ${
          isSharing || isSreenShare ? "bg-black/50" : "bg-white/10"
        } cursor-pointer`}
      >
        <MdOutlineScreenShare className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={() => dispatch(setOpenChat())}
        className={`btn hover:bg-opacity-20 outline-none lg:hidden block  border-none backdrop-blur-sm ${
          isSharing || isSreenShare ? "bg-black/50" : "bg-white/10"
        } cursor-pointer`}
      >
        <BsChatDots className="w-5 h-5 text-white" />
      </button>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Buttons;
