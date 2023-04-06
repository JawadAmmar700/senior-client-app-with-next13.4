import { useState, useEffect } from "react";
import { P2P } from "./P2P";

const usePeerEventListener = (peer: P2P) => {
  const [roomName, setRoomName] = useState<string>("");
  const [streams, setStreams] = useState<MapOfPeerCalls[]>([]);
  const [userCameraONOFF, setUserCameraONOFF] = useState<string[]>([]);
  const [userMute, setUserMute] = useState<string[]>([]);
  const [userScreenShare, setUserScreenShare] = useState<string[]>([]);

  useEffect(() => {
    const eventListener = (
      eventName: string,
      data: User | string | User[] | any
    ) => {
      switch (eventName) {
        case "new-user-joined":
          break;
        case "user-disconnected":
          break;
        case "room-name":
          setRoomName(data);
          break;
        case "streams":
          setStreams(data);
          break;
        case "user-operation":
          switch (data.op) {
            case "userCameraOff":
              setUserCameraONOFF(data.data);
              break;
            case "userCameraOn":
              setUserCameraONOFF(data.data);
              break;
            case "userMuted":
              setUserMute(data.data);
              break;
            case "userUnmuted":
              setUserMute(data.data);
              break;
            case "userScreenShareOff":
              setUserScreenShare(data.data);
              break;
            case "userScreenShareOn":
              setUserScreenShare(data.data);
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    };

    peer.eventListeners(eventListener);

    // return () => {
    //   peer.offEventListeners(eventListener);
    // };
  }, [peer]);

  return { roomName, streams, userCameraONOFF, userMute, userScreenShare };
};

export default usePeerEventListener;
