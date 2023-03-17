"use client";
import { createContext, useContext } from "react";

import Peer from "peerjs";
import { peerConfiguration } from "./configuration";

const peerConnection = new Peer();

export const PeerContext = createContext<Peer | null>(null);

export const usePeer = () => {
  const peer = useContext(PeerContext);

  return {
    peer,
  };
};

type PeerProviderProps = {
  children: React.ReactNode;
};

const PeerProvider = ({ children }: PeerProviderProps) => {
  return (
    <PeerContext.Provider value={peerConnection}>
      {children}
    </PeerContext.Provider>
  );
};

export default PeerProvider;
