import React from "react";

type PinStreamProps = {
  pinVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  myCamera: boolean;
  image: string;
  userCameraONOFF: string[];
  userScreenShare: string[];
  userPin: string;
  streams: MapOfPeerCalls[];
  isSharing: boolean;
};

const PinStream = ({
  pinVideoRef,
  myCamera,
  image,
  userCameraONOFF,
  userScreenShare,
  userPin,
  streams,
  isSharing,
}: PinStreamProps) => {
  const isSreenShare = userScreenShare.find((s) => s === userPin);
  console.log(isSharing);
  return (
    <>
      <video
        id="pinStream"
        ref={pinVideoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full ${
          isSreenShare || isSharing ? "object-contain" : "object-cover"
        }  -z-30`}
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
      {userCameraONOFF.find((s) => s === userPin) && (
        <div className="absolute w-full bg-slate-800 h-full inset-0 rounded-lg flex items-center justify-center">
          <img
            src={streams.find((s: any) => s.id === userPin)?.user.photoUrl}
            alt="user-image"
            className="rounded-full w-10 h-10"
          />
        </div>
      )}
    </>
  );
};

export default PinStream;
