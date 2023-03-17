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
