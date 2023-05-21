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
  chat: Chat[];
  recordingState: boolean;
  elapsedTime: number;
  Participants: Participant[];
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
  chat: [],
  recordingState: false,
  elapsedTime: 0,
  Participants: [],
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
    setChat: (state, action: PayloadAction<Chat>) => {
      state.chat = [...state.chat, action.payload];
    },
    setRecordingState: (state) => {
      state.recordingState = !state.recordingState;
    },
    setElapsedTime: (state, action: PayloadAction<number>) => {
      state.elapsedTime += action.payload;
    },
    ResetElapsedTime: (state, action: PayloadAction<number>) => {
      state.elapsedTime = action.payload;
    },
    setParticipants: (state, action: PayloadAction<Participant[]>) => {
      state.Participants = action.payload;
    },
  },
});

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
  setChat,
  setRecordingState,
  setElapsedTime,
  setParticipants,
  ResetElapsedTime,
} = AppSlice.actions;

export default AppSlice.reducer;
