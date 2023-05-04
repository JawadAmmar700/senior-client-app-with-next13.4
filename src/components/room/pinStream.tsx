import { RootState } from "@/store/configuration";
import { useSelector } from "react-redux";

type PinStreamProps = {
  pinVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  image: string;
};

const PinStream = ({ pinVideoRef, image }: PinStreamProps) => {
  const { userPin, myCamera, streams } = useSelector(
    (state: RootState) => state.appState
  );
  const pinedUser = streams.find((s: any) => s.id === userPin);
  return (
    <>
      <video
        id="pinStream"
        ref={pinVideoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full aspect-video rounded-lg object-cover 
          -z-30`}
      />
      {!myCamera && !userPin && (
        <div className="absolute w-full bg-slate-800 h-full inset-0 rounded-lg flex items-center justify-center">
          <img
            src={image}
            alt="user-image"
            className="rounded-full w-10 h-10"
          />
        </div>
      )}
      {pinedUser?.user.isCamera && (
        <div className="absolute w-full bg-slate-800 h-full inset-0 rounded-lg flex items-center justify-center">
          <img
            src={pinedUser.user.photoUrl}
            alt="user-image"
            className="rounded-full w-10 h-10"
          />
        </div>
      )}
    </>
  );
};

export default PinStream;
