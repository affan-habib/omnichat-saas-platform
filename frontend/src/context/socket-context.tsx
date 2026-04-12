"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  SOCKET_EVENTS,
  setAgentStatus,
} from "@/lib/socket-client";
import { useUser } from "./user-context";

// ─────────────────────────────────────────────────────────────
// Context Type
// ─────────────────────────────────────────────────────────────

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  presenceMap: Record<string, string>; // userId → status
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  presenceMap: {},
});

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [presenceMap, setPresenceMap] = useState<Record<string, string>>({});
  const connectedRef = useRef(false);

  useEffect(() => {
    // Wait for auth to resolve and user to be present
    if (isLoading) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!user || !token) {
      // User logged out — disconnect and clean up
      if (connectedRef.current) {
        disconnectSocket();
        connectedRef.current = false;
        setSocket(null);
        setIsConnected(false);
        setPresenceMap({});
      }
      return;
    }

    // Already connected — skip
    if (connectedRef.current && getSocket()?.connected) return;

    const s = connectSocket(token);
    connectedRef.current = true;
    setSocket(s);

    // ── Connection Events ──────────────────────────────────────
    const onConnect = () => {
      setIsConnected(true);
      // Tell server this agent is online
      setAgentStatus("ONLINE");
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    // ── Presence Events ────────────────────────────────────────
    const onPresenceUpdate = (data: { userId: string; status: string }) => {
      setPresenceMap((prev) => ({ ...prev, [data.userId]: data.status }));
    };

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on(SOCKET_EVENTS.PRESENCE_UPDATE, onPresenceUpdate);

    // If already connected (reconnect scenario)
    if (s.connected) {
      setIsConnected(true);
    }

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off(SOCKET_EVENTS.PRESENCE_UPDATE, onPresenceUpdate);
    };
  }, [user, isLoading]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, presenceMap }}>
      {children}
    </SocketContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export const useSocket = () => useContext(SocketContext);
