import React, { createContext, useContext, useEffect } from "react";
import websocketService from "@/services/WebsocketService";

const WebSocketContext = createContext<typeof websocketService | null>(null);

interface WebSocketProviderProps {
  url: string;
  isAuthenticated: boolean;
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  url,
  isAuthenticated,
  children,
}) => {
  useEffect(() => {
    // console.log(isAuthenticated);
    if (isAuthenticated) {
      websocketService.connect(url);
    }

    return () => {
      if (isAuthenticated) {
        websocketService.close();
      }
    };
  }, [url, isAuthenticated]);

  return (
    <WebSocketContext.Provider value={websocketService}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
