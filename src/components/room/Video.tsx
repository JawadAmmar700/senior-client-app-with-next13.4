import { useEffect, useRef } from "react";

const Video = ({ stream }: { stream: MediaStream }) => {
  const localVideo = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (localVideo.current) localVideo.current.srcObject = stream;
  }, [stream, localVideo]);

  return (
    <video
      ref={localVideo}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover -z-30 rounded-lg"
    />
  );
};

export default Video;
