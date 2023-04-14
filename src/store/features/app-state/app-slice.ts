import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  myMuted: boolean;
  myCamera: boolean;
  myPin: boolean;
  isSharing: boolean;
  userPin: string;
  openChat: boolean;
  myScreenShare: MediaStream | null;
  myStream: MediaStream | null;
  roomName: string;
  streams: MapOfPeerCalls[];
  userCameraONOFF: string[];
  userMute: string[];
  userScreenShare: string[];
  chat: Chat[];
  recordingState: boolean
}

const initialState: AppState = {
  myMuted: false,
  myCamera: true,
  myPin: true,
  isSharing: false,
  userPin: "",
  openChat: false,
  myScreenShare: null,
  myStream: null,
  roomName: "",
  streams: [],
  userCameraONOFF: [],
  userMute: [],
  userScreenShare: [],
  chat: [],
  recordingState: false
};

export const AppSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setMyMuted: (state) => {
      state.myMuted = !state.myMuted;
    },
    setMyCamera: (state) => {
      state.myCamera = !state.myCamera;
    },
    setMyPin: (state, action: PayloadAction<boolean>) => {
      state.myPin = action.payload;
    },
    setIsSharing: (state, action: PayloadAction<boolean>) => {
      state.isSharing = action.payload;
    },
    setUserPin: (state, action: PayloadAction<string>) => {
      state.userPin = action.payload;
    },
    setOpenChat: (state) => {
      state.openChat = !state.openChat;
    },
    setMyScreenShare: (state, action: PayloadAction<MediaStream | null>) => {
      state.myScreenShare = action.payload;
    },
    setMyStream: (state, action: PayloadAction<MediaStream | null>) => {
      state.myStream = action.payload;
    },
    setRoomName: (state, action: PayloadAction<string>) => {
      state.roomName = action.payload;
    },
    setStreams: (state, action: PayloadAction<MapOfPeerCalls[]>) => {
      state.streams = action.payload;
    },
    setUserCameraONOFF: (state, action: PayloadAction<string[]>) => {
      state.userCameraONOFF = action.payload;
    },
    setUserMute: (state, action: PayloadAction<string[]>) => {
      state.userMute = action.payload;
    },
    setUserScreenShare: (state, action: PayloadAction<string[]>) => {
      state.userScreenShare = action.payload;
    },
    setChat: (state, action: PayloadAction<Chat>) => {
      state.chat = [...state.chat, action.payload];
    },
    setRecordingState: (state) => {
      state.recordingState = !state.recordingState;
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  setIsSharing,
  setMyCamera,
  setMyMuted,
  setMyPin,
  setMyScreenShare,
  setMyStream,
  setOpenChat,
  setUserPin,
  setRoomName,
  setStreams,
  setUserCameraONOFF,
  setUserMute,
  setUserScreenShare,
  setChat,
  setRecordingState
} = AppSlice.actions;

export default AppSlice.reducer;
