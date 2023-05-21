interface Session {
  expires: string;
  error?: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    provider: string;
  };
}

type FetcherProps = {
  url: string;
  obj: {
    username?: string;
    email: string;
    password: string;
  };
};

type HandleSubmitProps = {
  email: string;
  username?: string;
  password: string;
};

type FormProps = {
  type: string;
};

type User = {
  userId: string;
  username: string;
  email: string;
  photoUrl: string;
  room_name?: string;
  isCamera: boolean;
  isMic: boolean;
  isScreenShare: boolean;
  joinedAt: string;
};
type MapOfPeerCalls = {
  call: MediaConnection;
  stream: MediaStream;
  user: User;
  id: string;
};

type Chat = {
  user_name: string;
  photoUrl: string;
  email: string;
  time: number;
  message: string;
};

type ReminderType = {
  id: string;
  title: string;
  description: string;
  date: string;
  unix: number;
  isDone: boolean;
  notificationSent: boolean;
  time: string;
  userId: string;
};

type State = {
  clock: LooseValue;
  calendar: LooseValue;
  title: string;
  description: string;
};

type POSTBody = {
  title: string;
  description: string;
  date: string;
  unix: number;
  userId: string;
  time: string;
};
// added for server actions
type ReminderBody = {
  title: string;
  description: string;
  date: string;
  unix: number;
  userId: string;
  time: string;
  isDone: boolean;
  notificationSent: boolean;
};

type PUTBody = {
  todoId: string;
  title: string;
  description: string;
  date: string;
  isDone: boolean;
  notificationSent: boolean;
  unix: number;
  userId: string;
  time: string;
};

type ToastPromiseArgsTypes = {
  loading: string;
  success: string;
  error: string;
  method: "POST" | "PUT";
};

type ReocoordingUIProps = {
  id: string;
  file_name: string;
  video_url: string;
};

type RecorderPostType = {
  userId: string;
  file_name: string;
  videoBlob: string;
};

type RecorderDeleteType = {
  recordId: string;
};

type ReminderPostType = {
  title: string;
  description: string;
  date: string;
  unix: number;
  userId: string;
  time: string;
};

type ReminderPutType = {
  todoId: string;
  title: string;
  description: string;
  date: string;
  unix: number;
  userId: string;
  time: string;
  notificationSent: boolean;
  isDone: boolean;
};

type OP = {
  userMuted: string[];
  userCameraOnOff: string[];
  userScreenShare: string[];
};

type FileDataType = {
  username: string;
  email: string;
};

type Participant = {
  userId: string;
  username: string;
  photoUrl: string;
  email: string;
  joinedAt: string;
  leftAt: string | null;
};
