import Peer, { MediaConnection } from "peerjs";
import io, { Socket } from "socket.io-client";

export class P2P {
  private peer: Peer;
  private socket: Socket;
  private peerCalls = new Map<string, MapOfPeerCalls>();
  private peerConnections: RTCPeerConnection[] = [];
  private myStream: MediaStream | null = null;
  private userId: string | null = null;
  private opts: any = {};
  private user: User | null = null;

  constructor() {
    this.peer = new Peer();
    this.opts["sync disconnect on unload"] = false;
    this.socket = io(`${process.env.NEXT_PUBLIC_SERVER_APP}`, this.opts);
    this.peer.on("open", (id) => {
      this.userId = id;
      console.log("peer id: ", id);
    });

    this.socketEvents();
    this.answerCallEvent();
  }

  async init() {
    this.myStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: { min: 150, ideal: 1280, max: 1920 },
        height: { min: 100, ideal: 720, max: 1080 },
      },
    });
    return this.myStream;
  }

  joinRoom(
    username: string,
    room_name: string,
    roomId: string,
    photoUrl: string
  ) {
    setTimeout(() => {
      this.socket.emit(
        "join-room",
        username,
        room_name,
        roomId,
        this.userId,
        photoUrl
      );
    }, 2000);
    this.user = {
      userId: this.userId!,
      username,
      photoUrl,
    };
  }

  private callUser(user: User) {
    const call = this.peer.call(user.userId, this.myStream!, {
      metadata: this.user!,
    });
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
        this.peerCalls.get(call.peer)?.call.close();
      });
    });
  }

  private socketEvents() {
    this.socket.on("new-user-joined", (user: User) => {
      this.callUser(user);
    });

    this.socket.on("user-disconnected", (disconnectedUserId) => {
      const userThatLeft = this.peerCalls.get(disconnectedUserId);
      userThatLeft?.call.close();
      this.peerCalls.delete(disconnectedUserId);
      this.socket.emit("streams");
    });
  }

  eventListeners(
    callback: (enevtName: string, data: User | string | any) => void
  ) {
    this.socket.on("new-user-joined", (user: User) => {
      return callback("new-user-joined", user);
    });

    this.socket.on("user-disconnected", (disconnectedUserId) => {
      return callback("user-disconnected", disconnectedUserId);
    });

    this.socket.on("users-in-room", (usersInRoom) => {
      return callback("users-in-room", usersInRoom);
    });
    this.socket.on("room-name", (room_name) => {
      return callback("room-name", room_name);
    });
    this.socket.on("streams", () => {
      return callback("streams", Array.from(this.peerCalls.values()));
    });
    this.socket.on("user-operation", (userId, op, data) => {
      console.log("user-operation", userId, op, data);
      return callback("user-operation", {
        userId,
        op,
        data,
      });
    });
  }

  async muteStream(isMuted: boolean) {
    this.myStream
      ?.getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));

    if (isMuted) {
      this.socket.emit("user-operation", this.userId, "userMuted");
    } else {
      this.socket.emit("user-operation", this.userId, "userUnmuted");
    }
  }

  toggleOnOff(isCamera: boolean) {
    this.myStream
      ?.getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));

    if (isCamera) {
      this.socket.emit("user-operation", this.userId, "userCameraOn");
    } else {
      this.socket.emit("user-operation", this.userId, "userCameraOff");
    }
  }

  async shareScreen(
    myVideo: React.MutableRefObject<HTMLVideoElement | null>,
    pinVideoRef: React.MutableRefObject<HTMLVideoElement | null>,
    setIsSharing: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    const screenShare = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always",
        mediaSource: "screen",
      } as MediaTrackConstraints,
      audio: false,
    });
    setIsSharing(true);
    if (myVideo.current) {
      this.socket.emit("user-operation", this.userId, "userScreenShareOn");
      myVideo.current.srcObject = screenShare;
      myVideo.current.play();
    }
    if (pinVideoRef.current) {
      pinVideoRef.current.srcObject = screenShare;
      pinVideoRef.current.play();
    }
    const shareScreenTracks = screenShare.getVideoTracks()[0];
    this.peerConnections.forEach((peerConnection) => {
      const sender = peerConnection.getSenders().find((s) => {
        return s.track?.kind === shareScreenTracks.kind;
      });
      sender?.replaceTrack(shareScreenTracks);
    });

    shareScreenTracks.onended = () => {
      setIsSharing(false);
      if (myVideo.current) {
        this.socket.emit("user-operation", this.userId, "userScreenShareOff");
        myVideo.current.srcObject = this.myStream;
        myVideo.current.play();
      }
      if (pinVideoRef.current) {
        pinVideoRef.current.srcObject = this.myStream;
        pinVideoRef.current.play();
      }
      const returnStream = this.myStream?.getVideoTracks()[0];
      this.peerConnections.forEach((peerConnection) => {
        const sender = peerConnection.getSenders().find((s) => {
          return s.track?.kind === returnStream?.kind;
        });
        sender?.replaceTrack(returnStream!);
      });
    };
  }

  disconnectUser() {
    this.myStream?.getTracks().forEach((track) => track.stop());
    this.peerCalls.forEach((peerCall) => {
      peerCall.call.close();
    });
    this.socket.disconnect();
  }
}
