"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/configuration";

const HandleTabActionWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { peer } = useSelector((state: RootState) => state.appState);
  useEffect(() => {
    const handleCloseReloadTab = async (e: any) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave this room?";
      await peer.disconnectUser();
    };

    window.addEventListener("beforeunload", handleCloseReloadTab);

    return () => {
      window.removeEventListener("beforeunload", handleCloseReloadTab);
      // peer.disconnectUser();
    };
  }, []);

  return <>{children}</>;
};

export default HandleTabActionWrapper;
