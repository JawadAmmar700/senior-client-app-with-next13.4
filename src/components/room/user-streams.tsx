import Video from "./Video";
import { TbPinnedOff, TbPinned } from "react-icons/tb";
import { BsMic, BsMicMute } from "react-icons/bs";
import { RootState } from "@/store/configuration";
import { useSelector } from "react-redux";
import { P2P } from "@/lib/P2P";

type UserStreamsProps = {
  call: MapOfPeerCalls;
  peer: P2P;
};

const UserStreams = ({ peer, call }: UserStreamsProps) => {
  const { userPin } = useSelector((state: RootState) => state.appState);

  return (
    <div className="w-[150px] h-[100px] rounded-lg relative mt-5 border-2 border-white">
      <Video stream={call.stream} />
      {call.user.isCamera && (
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
            {call.user.isMic ? (
              <BsMicMute className="w-4 h-4" />
            ) : (
              <BsMic className="w-4 h-4" />
            )}
          </div>
          <button
            onClick={() => peer.pinUserStream(call.id, userPin)}
            className="p-2 rounded-full  backdrop-blur-sm bg-white/10  flex items-center justify-center"
          >
            {call.id === userPin ? (
              <TbPinnedOff className="w-4 h-4" />
            ) : (
              <TbPinned className="w-4 h-4" />
            )}
          </button>
        </div>

        <p
          className={`backdrop-blur-sm ${
            call.id === userPin ? "bg-sky-500" : " bg-white/10"
          } rounded-xl px-2 py-0.5 font-bold text-xs absolute bottom-1 right-1 `}
        >
          {call.user.username}
        </p>
      </div>
    </div>
  );
};

export default UserStreams;
