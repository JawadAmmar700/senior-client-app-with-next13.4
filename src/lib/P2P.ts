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
  wrappingElement: HTMLDivElement | null;
};

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

    this.init();

    this.socketEvents();
    this.answerCallEvent();
  }

  private async init() {
    this.myStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: { min: 150, ideal: 1280, max: 1920 },
        height: { min: 100, ideal: 720, max: 1080 },
      },
    });
    const video = document.getElementById("myStream") as HTMLVideoElement;
    video.srcObject = this.myStream;
    video.play();
    const video2 = document.getElementById("pinStream") as HTMLVideoElement;
    video2.srcObject = this.myStream;
    video2.play();
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

  private appendStream(userStream: MediaStream, callPeer: string, user: User) {
    // const container = document.getElementById("container");
    // const userVideo = document.createElement("video");
    // if (container) {
    //   userVideo.srcObject = userStream;
    //   userVideo.play();
    //   container.append(userVideo);
    // }
    // return userVideo;
    const container = document.getElementById("video-grid");
    const firstWrappingDiv = document.createElement("div");
    firstWrappingDiv.id = `div-${callPeer}`;
    firstWrappingDiv.className =
      "w-[150px] h-[100px] bg-slate-900 rounded-lg relative mt-5";
    const userVideo = document.createElement("video");
    userVideo.className = "w-full h-full object-cover -z-30 rounded-lg";
    userVideo.srcObject = userStream;
    userVideo.play();
    firstWrappingDiv.appendChild(userVideo);
    const micAndUsernameDiv = document.createElement("div");
    micAndUsernameDiv.className =
      "absolute inset-0 rounded-lg flex flex-col  w-full h-full justify-end p-2 text-white z-50";
    const innerMicAndUsernameDiv = document.createElement("div");
    innerMicAndUsernameDiv.className =
      "w-full flex items-center justify-between";
    micAndUsernameDiv.appendChild(innerMicAndUsernameDiv);
    const micDiv = document.createElement("div");
    micDiv.className =
      "p-2 rounded-full  backdrop-blur-sm bg-white/10  flex items-center justify-center";
    innerMicAndUsernameDiv.appendChild(micDiv);
    const micIcon = document.createElement("i");
    micIcon.id = `mic-${callPeer}`;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 384 512");
    svg.setAttribute("height", "15px");
    svg.setAttribute("width", "15px");
    svg.setAttribute("fill", "white");
    svg.innerHTML =
      '<path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/>';
    micIcon.appendChild(svg);
    micDiv.appendChild(micIcon);
    const username = document.createElement("p");
    username.className =
      "backdrop-blur-sm bg-white/10 rounded-xl px-2 py-0.5 font-bold text-xs";
    username.innerText = user.username;
    innerMicAndUsernameDiv.appendChild(username);
    firstWrappingDiv.appendChild(micAndUsernameDiv);
    container?.appendChild(firstWrappingDiv);

    return firstWrappingDiv;

    // const container = document.getElementById("video-grid");
    // const div_1 = document.createElement("div");

    // div_1.className = "inline-block px-3";
    // const div_2 = document.createElement("div");
    // div_2.className = "w-[150px] h-[100px] bg-slate-600 rounded-lg relative";
    // div_2.id = `div-${callPeer}`;
    // div_1.appendChild(div_2);
    // const userVideo = document.createElement("video");
    // userVideo.className = "rounded-lg";
    // userVideo.srcObject = userStream;
    // userVideo.play();
    // div_2.appendChild(userVideo);
    // const div_3 = document.createElement("div");
    // div_3.className =
    //   "absolute inset-0 rounded-lg flex flex-col justify-end p-2 text-white w-[150px] h-[113px]";
    // const div_4 = document.createElement("div");
    // div_4.className = "w-full flex items-center justify-between z-50";
    // div_3.appendChild(div_4);
    // const div_5 = document.createElement("div");
    // div_5.className =
    //   "p-2 rounded-full bg-gray-700 bg-opacity-80 flex items-center justify-center z-50";
    // const i = document.createElement("i");
    // i.id = `mic-${callPeer}`;
    // const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg.setAttribute("viewBox", "0 0 384 512");
    // svg.setAttribute("height", "15px");
    // svg.setAttribute("width", "15px");
    // svg.setAttribute("fill", "white");
    // svg.innerHTML =
    //   '<path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/>';
    // i.appendChild(svg);

    // div_5.appendChild(i);
    // const p = document.createElement("p");
    // p.className =
    //   "bg-gray-700 bg-opacity-80 rounded-xl px-4 py-0.5 font-bold text-sm";
    // p.innerText = user.username;
    // div_4.appendChild(div_5);
    // div_4.appendChild(p);
    // div_2.appendChild(div_3);
    // if (container) {
    //   container.appendChild(div_1);
    // }
    // return div_1;
  }

  private callUser(user: User) {
    console.log("call user: ", user);
    const call = this.peer.call(user.userId, this.myStream!, {
      metadata: this.user!,
    });
    call.on("stream", (userStream) => {
      const wrappingElement = this.appendStream(userStream, call.peer, user);
      // TODO: add call.peerConnection to peerConnections variable to use it in  share screen
      this.peerConnections.push(call.peerConnection);
      this.peerCalls.set(call.peer, {
        call,
        stream: userStream,
        wrappingElement: wrappingElement,
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
          const wrappingElement = this.appendStream(
            userStream,
            call.peer,
            call.metadata
          );
          // TODO: add call.peerConnection to peerConnections variable to use it in  share screen
          this.peerConnections.push(call.peerConnection);
          this.peerCalls.set(call.peer, {
            call,
            stream: userStream,
            wrappingElement: wrappingElement,
          });
        }
      });
      call.on("close", () => {
        this.peerCalls.get(call.peer)?.call.close();
        this.peerCalls.get(call.peer)?.wrappingElement?.remove();
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
      userThatLeft?.wrappingElement?.remove();
      this.peerCalls.delete(disconnectedUserId);
    });

    this.socket.on("userMuted", (user) => {
      const micIcon = document.getElementById(
        `mic-${user.userId}`
      ) as HTMLDivElement;
      micIcon.removeChild(micIcon.childNodes[0]);
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 640 512");
      svg.setAttribute("height", "15px");
      svg.setAttribute("width", "15px");
      svg.setAttribute("fill", "white");
      svg.innerHTML =
        '<path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 21.2-5.1 41.1-14.2 58.7L416 300.8V96c0-53-43-96-96-96s-96 43-96 96v54.3L38.8 5.1zM344 430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128v-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6v40c0 89.1 66.2 162.7 152 174.4V464H248c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H344V430.4z"/>';
      micIcon.appendChild(svg);
    });

    this.socket.on("userUnmuted", (user) => {
      const micIcon = document.getElementById(
        `mic-${user.userId}`
      ) as HTMLDivElement;
      micIcon.removeChild(micIcon.childNodes[0]);
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 384 512");
      svg.setAttribute("height", "15px");
      svg.setAttribute("width", "15px");
      svg.setAttribute("fill", "white");
      svg.innerHTML =
        '<path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/>';
      micIcon.appendChild(svg);
    });

    this.socket.on("userCameraOff", (user) => {
      const firstWrappingDiv = document.getElementById(
        `div-${user.userId}`
      ) as HTMLDivElement;

      const cemeraOff = document.createElement("div");
      cemeraOff.id = `camera-off-${user.userId}`;
      cemeraOff.className =
        "absolute w-full bg-slate-800 h-full inset-0 rounded-lg flex items-center justify-center z-0";
      const image = document.createElement("img");
      image.src = `${user.photoUrl}`;
      image.setAttribute("alt", "camera-off");
      image.className = "rounded-full w-10 h-10";
      cemeraOff.appendChild(image);
      firstWrappingDiv.appendChild(cemeraOff);
    });

    this.socket.on("userCameraOn", (user) => {
      const cemeraOff = document.getElementById(
        `camera-off-${user.userId}`
      ) as HTMLDivElement;
      cemeraOff.remove();
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
  }

  async muteStream(isMuted: boolean) {
    this.myStream
      ?.getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));

    if (isMuted) {
      this.socket.emit("userMuted", this.userId);
    } else {
      this.socket.emit("userUnmuted", this.userId);
    }
  }

  toggleOnOff(isCamera: boolean) {
    this.myStream
      ?.getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));

    if (isCamera) {
      this.socket.emit("userCameraOn", this.userId);
    } else {
      this.socket.emit("userCameraOff", this.userId);
    }
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
      peerCall.wrappingElement?.remove();
    });
    this.peerCalls.clear();
    this.socket.disconnect();
  }
}
