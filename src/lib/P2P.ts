import Peer, { MediaConnection } from "peerjs";
import io, { Socket } from "socket.io-client";

type User = {
  userId: string;
  username: string;
  photoUrl: string;
};

type MapOfPeerCalls = {
  call: MediaConnection;
  stream: MediaStream;
  videoElement: HTMLVideoElement | null;
};

export class P2P {
  private peer: Peer;
  private socket: Socket;
  private peerCalls = new Map<string, MapOfPeerCalls>();
  private peerConnections: RTCPeerConnection[] = [];
  private myStream: MediaStream | null = null;
  private userId: string | null = null;
  private opts: any = {};

  constructor() {
    this.peer = new Peer();
    this.opts["sync disconnect on unload"] = false;
    this.socket = io("http://localhost:4000", this.opts);
    this.peer.on("open", (id) => {
      this.userId = id;
    });

    this.init();

    this.socketEvents();
    this.answerCallEvent();
  }

  private async init() {
    this.myStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
      },
    });
    const video = document.getElementById("myStream") as HTMLVideoElement;
    video.srcObject = this.myStream;
    video.play();
  }

  joinRoom(username: string, roomId: string, photoUrl: string) {
    setTimeout(() => {
      this.socket.emit("join-room", username, roomId, this.userId, photoUrl);
    }, 2000);
  }

  private appendStream(userStream: MediaStream) {
    const container = document.getElementById("container");
    const userVideo = document.createElement("video");
    if (container) {
      userVideo.srcObject = userStream;
      userVideo.play();
      container.append(userVideo);
    }
    return userVideo;
  }

  private callUser(user: User) {
    const call = this.peer.call(user.userId, this.myStream!);
    call.on("stream", (userStream) => {
      const video = this.appendStream(userStream);
      // TODO: add call.peerConnection to peerConnections variable to use it in  share screen
      this.peerConnections.push(call.peerConnection);
      this.peerCalls.set(call.peer, {
        call,
        stream: userStream,
        videoElement: video,
      });
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
          const video = this.appendStream(userStream);
          // TODO: add call.peerConnection to peerConnections variable to use it in  share screen
          this.peerConnections.push(call.peerConnection);
          this.peerCalls.set(call.peer, {
            call,
            stream: userStream,
            videoElement: video,
          });
        }
      });
      call.on("close", () => {
        this.peerCalls.get(call.peer)?.call.close();
        this.peerCalls.get(call.peer)?.videoElement?.remove();
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
      userThatLeft?.videoElement?.remove();
      this.peerCalls.delete(disconnectedUserId);
    });
  }

  eventListeners(callback: (enevtName: string, data: User | string) => void) {
    this.socket.on("new-user-joined", (user: User) => {
      return callback("new-user-joined", user);
    });

    this.socket.on("user-disconnected", (disconnectedUserId) => {
      return callback("user-disconnected", disconnectedUserId);
    });

    this.socket.on("users-in-room", (usersInRoom) => {
      return callback("users-in-room", usersInRoom);
    });
  }

  async muteStream() {
    this.myStream
      ?.getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
  }

  toggleOnOff() {
    this.myStream
      ?.getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
  }

  async shareScreen() {
    const screenShare = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always",
        mediaSource: "screen",
      } as MediaTrackConstraints,
      audio: false,
    });

    const video = document.getElementById("myStream") as HTMLVideoElement;
    video.srcObject = screenShare;
    video.play();
    const shareScreenTracks = screenShare.getVideoTracks()[0];
    this.peerConnections.forEach((peerConnection) => {
      const sender = peerConnection.getSenders().find((s) => {
        return s.track?.kind === shareScreenTracks.kind;
      });
      sender?.replaceTrack(shareScreenTracks);
    });

    shareScreenTracks.onended = () => {
      video.srcObject = this.myStream;
      video.play();
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
      peerCall.videoElement?.remove();
    });
    this.socket.disconnect();
  }
}
