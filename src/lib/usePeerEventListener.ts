import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { P2P } from "./P2P";
import {
  setChat,
  setRoomName,
  setStreams,
  setUserCameraONOFF,
  setUserMute,
  setUserScreenShare,
} from "@/store/features/app-state/app-slice";

const usePeerEventListener = (peer: P2P) => {
  const dispatch = useDispatch();

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
          dispatch(setRoomName(data));
          break;
        case "streams":
          dispatch(setStreams(data));
          break;
        case "user-operation":
          switch (data.op) {
            case "userCameraOff":
              dispatch(setUserCameraONOFF(data.data));
              break;
            case "userCameraOn":
              dispatch(setUserCameraONOFF(data.data));
              break;
            case "userMuted":
              dispatch(setUserMute(data.data));
              break;
            case "userUnmuted":
              dispatch(setUserMute(data.data));
              break;
            case "userScreenShareOff":
              dispatch(setUserScreenShare(data.data));
              break;
            case "userScreenShareOn":
              dispatch(setUserScreenShare(data.data));
              break;

            default:
              break;
          }
          break;
        case "get-users-muted":
          dispatch(setUserMute(data));
          break;
        case "get-users-camera-status":
          dispatch(setUserCameraONOFF(data));
          break;
        case "get-users-sharescreen-status":
          dispatch(setUserScreenShare(data));
          break;
        case "chat-message":
          dispatch(setChat(data));
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
};

export default usePeerEventListener;
