import { useEffect } from "react";
import { P2P } from "./P2P";

const useHandleTabAction = (peer: P2P) => {
  return useEffect(() => {
    const handleCloseReloadTab = (e: any) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave this room?";
      peer.disconnectUser();
    };

    window.addEventListener("beforeunload", handleCloseReloadTab);

    return () => {
      window.removeEventListener("beforeunload", handleCloseReloadTab);
      peer.disconnectUser();
    };
  }, [peer]);
};

export default useHandleTabAction;
