"use client";
import { createContext, useCallback, useContext } from "react";
import io from "socket.io-client";

const socket = io(`${process.env.NEXT_PUBLIC_SERVER_APP}`);

export const SocketContext = createContext<typeof socket | null>(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);

  return {
    socket,
  };
};

type PeerProviderProps = {
  children: React.ReactNode;
};

const SocketProvider = ({ children }: PeerProviderProps) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
