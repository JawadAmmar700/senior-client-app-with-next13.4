const peerConfiguration = {
  secure: true,
  config: {
    iceServers: [
      {
        urls: "stun:relay.metered.ca:80",
      },
      {
        urls: "turn:relay.metered.ca:80",
        username: process.env.NEXT_PUBLIC_TURN_USERNAME,
        credential: process.env.NEXT_PUBLIC_TURN_PASSWORD,
      },
      {
        urls: "turn:relay.metered.ca:443",
        username: process.env.NEXT_PUBLIC_TURN_USERNAME,
        credential: process.env.NEXT_PUBLIC_TURN_PASSWORD,
      },
      {
        urls: "turn:relay.metered.ca:443?transport=tcp",
        username: process.env.NEXT_PUBLIC_TURN_USERNAME,
        credential: process.env.NEXT_PUBLIC_TURN_PASSWORD,
      },
    ],
  },
};

export { peerConfiguration };
