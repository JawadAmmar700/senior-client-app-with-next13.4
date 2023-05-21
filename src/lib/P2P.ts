import {
  setChat,
  setIsSharing,
  setMyCamera,
  setMyMuted,
  setMyPin,
  setMyScreenShare,
  setMyStream,
  setParticipants,
  setRoomName,
  setStreams,
  setUserPin,
} from "@/store/features/app-state/app-slice";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import Peer from "peerjs";
import { toast } from "react-hot-toast";
import io, { Socket } from "socket.io-client";

interface SetPeerStatesArgs {
  myVideoStreamRef: React.MutableRefObject<HTMLVideoElement | null>;
  pinVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  dispatch: Dispatch<AnyAction>;
}

export class P2P {
  private peer: Peer;
  private socket: Socket;
  private peerCalls = new Map<string, MapOfPeerCalls>();
  private peerConnections: RTCPeerConnection[] = [];
  private myStream: MediaStream | null = null;
  private myScreenShare: MediaStream | null = null;
  private isSharing: boolean = false;
  private userId: string | null = null;
  private opts: any = {};
  private me: User | null = null;
  private pinVideoRef: React.MutableRefObject<HTMLVideoElement | null> | null =
    null;
  private myVideoStreamRef: React.MutableRefObject<HTMLVideoElement | null> | null =
    null;
  private dispatch: Dispatch<AnyAction> | null = null;

  constructor() {
    this.peer = new Peer();
    this.opts["sync disconnect on unload"] = false;
    this.socket = io(`${process.env.NEXT_PUBLIC_SERVER_APP}`, this.opts);
    this.peer.on("open", (id) => {
      this.userId = id;
    });

    this.socketEvents();
    this.eventListeners();
    this.answerCallEvent();
  }

  async init({ myVideoStreamRef, pinVideoRef, dispatch }: SetPeerStatesArgs) {
    this.myVideoStreamRef = myVideoStreamRef;
    this.pinVideoRef = pinVideoRef;
    this.dispatch = dispatch;

    this.myStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: { min: 150, ideal: 1280, max: 1920 },
        height: { min: 100, ideal: 720, max: 1080 },
      },
    });

    dispatch(setMyStream(this.myStream));
    if (myVideoStreamRef.current && pinVideoRef.current) {
      myVideoStreamRef.current.srcObject = this.myStream;
      myVideoStreamRef.current.play();
      pinVideoRef.current.srcObject = this.myStream;
      pinVideoRef.current.play();
    }
  }

  dateToString() {
    return new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
      timeZone: "Europe/Istanbul",
    });
  }

  joinRoom() {
    const username = sessionStorage.getItem("user_name")!;
    const email = sessionStorage.getItem("user_email")!;
    const roomName = sessionStorage.getItem("roomName")!;
    const meetingId = sessionStorage.getItem("meetingId")!;
    const userImage = sessionStorage.getItem("user_image")!;
    const isRoomCreator = sessionStorage.getItem("isRoomCreator")! === "true";

    setTimeout(() => {
      this.socket.emit(
        "join-room",
        username,
        roomName,
        meetingId,
        this.userId!,
        userImage,
        email,
        isRoomCreator
      );
    }, 2000);
    this.me = {
      userId: this.userId!,
      username,
      email,
      photoUrl: userImage,
      joinedAt: this.dateToString(),
      isCamera: false,
      isMic: false,
      isScreenShare: false,
    };
  }

  private callUser(user: User) {
    const call = this.peer.call(
      user.userId,
      this.isSharing ? this.myScreenShare! : this.myStream!,
      {
        metadata: this.me,
      }
    );
    call.on("stream", (userStream) => {
      this.peerConnections.push(call.peerConnection);
      this.peerCalls.set(call.peer, {
        call,
        id: call.peer,
        user: user,
        stream: userStream,
      });
      this.socket.emit("streams");
    });

    call.on("close", () => {
      this.peerCalls.delete(call.peer);
    });
  }

  private answerCallEvent() {
    this.peer.on("call", (call) => {
      call.answer(this.myStream!);
      call.on("stream", (userStream) => {
        const isPeerCallExist = this.peerCalls.has(call.peer);
        if (!isPeerCallExist) {
          this.peerConnections.push(call.peerConnection);
          this.peerCalls.set(call.peer, {
            call,
            id: call.peer,
            user: call.metadata,
            stream: userStream,
          });
        }

        this.socket.emit("streams");
      });
      call.on("close", () => {
        this.peerCalls.delete(call.peer);
      });
    });
  }

  private socketEvents() {
    this.socket.on("new-user-joined", (user: User) => {
      this.callUser(user);
    });

    this.socket.on(
      "user-disconnected",
      ({ userId }: { username: string; userId: string }) => {
        const userThatLeft = this.peerCalls.get(userId);
        userThatLeft?.call.close();
        this.peerCalls.delete(userId);
        this.socket.emit("streams");
      }
    );
  }

  private updatePeerCall(callPeerId: string, update: Partial<any>) {
    const currentCall = this.peerCalls.get(callPeerId);
    if (currentCall) {
      this.peerCalls.set(callPeerId, {
        ...currentCall,
        user: {
          ...currentCall.user,
          ...update.user,
        },
      });
    }
  }

  private handleUserOperation(operation: string, callPeerId: string) {
    if (this.dispatch) {
      switch (operation) {
        case "userCameraOnOff":
          this.updatePeerCall(callPeerId, {
            user: { isCamera: !this.peerCalls.get(callPeerId)!.user.isCamera },
          });
          break;
        case "userMuted":
          this.updatePeerCall(callPeerId, {
            user: { isMic: !this.peerCalls.get(callPeerId)!.user.isMic },
          });
          break;
        case "userScreenShare":
          this.updatePeerCall(callPeerId, {
            user: {
              isScreenShare:
                !this.peerCalls.get(callPeerId)!.user.isScreenShare,
            },
          });
          break;
        default:
          break;
      }
      this.dispatch(setStreams(Array.from(this.peerCalls.values())));
    }
  }

  private eventListeners() {
    const eventListenerMap = {
      "new-user-joined": (user: User) =>
        toast.success(`${user.username} joined the room`),
      "user-disconnected": ({
        username,
      }: {
        username: string;
        userId: string;
      }) => toast.success(`${username} left the room`),
      "room-name": (roomName: string) =>
        this.dispatch && this.dispatch(setRoomName(roomName)),
      "media-streams": () => {
        if (this.dispatch) {
          this.dispatch(setStreams(Array.from(this.peerCalls.values())));
        }
      },
      "user-operation": (op: string, callPeerId: string) =>
        this.handleUserOperation(op, callPeerId),

      "chat-message": (data: Chat) => {
        this.dispatch && this.dispatch(setChat(data));
      },
      participants: (participants: Participant[]) => {
        this.dispatch && this.dispatch(setParticipants(participants));
      },
    };

    for (const [eventName, listener] of Object.entries(eventListenerMap)) {
      this.socket.on(eventName, listener);
    }
  }

  async muteStream() {
    this.myStream
      ?.getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));

    this.dispatch && this.dispatch(setMyMuted());

    this.me = {
      ...this.me!,
      isMic: !this.me?.isMic,
    };

    this.socket.emit("user-operation", this.userId, "userMuted");
  }

  toggleOnOff() {
    this.myStream
      ?.getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    this.dispatch && this.dispatch(setMyCamera());

    this.me = {
      ...this.me!,
      isCamera: !this.me?.isCamera,
    };
    this.socket.emit("user-operation", this.userId, "userCameraOnOff");
  }

  async switchStreams(isSharing: boolean, stream: MediaStream) {
    if (
      this.myVideoStreamRef?.current &&
      this.pinVideoRef?.current &&
      this.dispatch
    ) {
      this.dispatch(setIsSharing(isSharing));
      this.dispatch(setMyScreenShare(isSharing ? stream : null));
      this.myVideoStreamRef.current.srcObject = stream;
      this.pinVideoRef.current.srcObject = stream;
      this.socket.emit("user-operation", this.userId, "userScreenShare");
    }
  }

  async shareScreen() {
    this.myScreenShare = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always",
        mediaSource: "screen",
      } as MediaTrackConstraints,
      audio: false,
    });

    this.isSharing = true;
    await this.switchStreams(true, this.myScreenShare);

    const shareScreenTracks = this.myScreenShare.getVideoTracks()[0];
    this.peerConnections.forEach((peerConnection) => {
      const sender = peerConnection.getSenders().find((s) => {
        return s.track?.kind === shareScreenTracks.kind;
      });
      sender?.replaceTrack(shareScreenTracks);
    });

    shareScreenTracks.onended = async () => {
      this.isSharing = false;
      await this.switchStreams(false, this.myStream!);
      const returnStream = this.myStream?.getVideoTracks()[0];

      this.peerConnections.forEach((peerConnection) => {
        const sender = peerConnection.getSenders().find((s) => {
          return s.track?.kind === returnStream?.kind;
        });
        sender?.replaceTrack(returnStream!);
      });
    };
  }

  sendMessage(message: Chat) {
    console.log("message", message);
    this.socket.emit("chat-message", message);
  }

  pinMyStream(myPin: boolean) {
    if (this.pinVideoRef?.current && this.dispatch) {
      if (myPin) {
        this.pinVideoRef.current.srcObject = null;

        this.dispatch(setMyPin(false));
        this.dispatch(setUserPin(""));
      } else {
        this.pinVideoRef.current.srcObject = this.isSharing
          ? this.myScreenShare
          : this.myStream;
        this.pinVideoRef.current.play();

        this.dispatch(setMyPin(true));
        this.dispatch(setUserPin(""));
      }
    }
  }

  pinUserStream(userId: string, userPin: string) {
    if (this.pinVideoRef?.current && this.dispatch) {
      const stream = Array.from(this.peerCalls.values()).find(
        (s) => s.id === userId
      );
      if (stream) {
        if (userId === userPin) {
          this.pinVideoRef.current.srcObject = this.isSharing
            ? this.myScreenShare
            : this.myStream;
          this.dispatch(setMyPin(true));
          this.dispatch(setUserPin(""));
          return;
        }
        this.pinVideoRef.current.srcObject = stream.stream;
        this.dispatch(setUserPin(userId));
        this.dispatch(setMyPin(false));
      }
    }
  }

  disconnectUser() {
    this.myStream?.getTracks().forEach((track) => track.stop());
    this.peerCalls.forEach((peerCall) => {
      peerCall.call.close();
    });

    this.socket.disconnect();
  }
}
