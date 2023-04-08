interface Session {
  accessToken: string;
  expires: string;
  error?: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
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
  username: string;
  password: string;
};

type FormProps = {
  provider: ClientSafeProvider;
};

type User = {
  userId: string;
  username: string;
  photoUrl: string;
  room_name?: string;
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
