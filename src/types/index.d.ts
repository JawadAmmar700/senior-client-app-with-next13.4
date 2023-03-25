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
};
