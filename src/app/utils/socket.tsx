"use client";
import { createContext, useContext, useEffect, ReactNode } from "react";
import io, { Socket } from "socket.io-client";

const socket = io(); // Connect to the server's default namespace

interface SocketContextType {
  socket: Socket;
}

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context.socket;
}

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
