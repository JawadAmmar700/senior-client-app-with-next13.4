"use client";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  setChat,
  setRoomName,
  setStreams,
  setUserCameraONOFF,
  setUserMute,
  setUserScreenShare,
} from "@/store/features/app-state/app-slice";

const socket = io(`${process.env.NEXT_PUBLIC_SERVER_APP}`);

const useSocket = () => {
  const dispatch = useDispatch();

  const socketEvents = () => {
    socket.on("new-user-joined", (user: User) => {
      // return callback("new-user-joined", user);
    });

    socket.on("user-disconnected", (disconnectedUserId) => {
      // return callback("user-disconnected", disconnectedUserId);
    });

    socket.on("users-in-room", (usersInRoom) => {
      // return callback("users-in-room", usersInRoom);
    });
    socket.on("room-name", (room_name) => {
      // return callback("room-name", room_name);
      dispatch(setRoomName(room_name));
    });
    socket.on("streams", () => {
      // return callback("streams", Array.from(peerCalls.values()));
      // dispatch(setStreams(Array.from(peer.peerCalls.values())));
    });
    socket.on("user-operation", (userId, op, data) => {
      // return callback("user-operation", {
      //   userId,
      //   op,
      //   data,
      // });
    });
    socket.on("get-users-muted", (usersMuted) => {
      // return callback("get-users-muted", usersMuted);
    });
    socket.on("get-users-cameraOnOff", (usersCameraONOFF) => {
      // return callback("get-users-camera-status", usersCameraONOFF);
    });
    socket.on("get-users-shareScreen", (usersScreenShare) => {
      // return callback("get-users-sharescreen-status", usersScreenShare);
    });
    socket.on("chat-message", (data) => {
      // return callback("chat-message", data);
    });
  };
};

export default useSocket;

//   socketEvents()
