import React, { useEffect, useState } from "react";
import websocketService from "@/services/WebsocketService";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { userData } from "@/components/chat/data";
import { Sidebar } from "@/components/sidebar";
import { Chat } from "@/components/chat/chat";
import { Card } from "@/components/ui/card";
interface ChatProps {
  sendUser: string;
  receiveUser: string;
  ws: WebSocket | null; // Assuming ws is a WebSocket instance
}
// interface ChatLayoutProps {
//   defaultLayout: number[] | undefined;
//   defaultCollapsed?: boolean;
//   navCollapsedSize: number;
// }

const ChatLayout = () => {
  const defaultLayout = [320, 480];
  const defaultCollapsed = false;
  const navCollapsedSize = 8;

  const [message, setMessage] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedUser, setSelectedUser] = React.useState(userData[0]);
  const [isMobile, setIsMobile] = useState(false);
  // const [chat, setChat] = useState<
  //   { message: string; timeStamp: string; userId: string; roomId: string }[]
  // >([]);
  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <div className="flex h-[calc(100dvh)] flex-col items-center justify-center p-4 md:px-24 py-16 gap-4">
      <div className="z-10 border rounded-lg max-w-7xl w-full h-full text-sm lg:flex">
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout=${JSON.stringify(
              sizes
            )}`;
          }}
          className="h-full items-stretch"
        >
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            collapsedSize={navCollapsedSize}
            collapsible={true}
            minSize={isMobile ? 0 : 24}
            maxSize={isMobile ? 8 : 30}
            onCollapse={() => {
              setIsCollapsed(true);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                true
              )}`;
            }}
            onExpand={() => {
              setIsCollapsed(false);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                false
              )}`;
            }}
            className={cn(
              isCollapsed &&
                "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
            )}
          >
            <Sidebar
              isCollapsed={isCollapsed || isMobile}
              links={userData.map((user) => ({
                name: user.name,
                messages: user.messages ?? [],
                avatar: user.avatar,
                variant: selectedUser.name === user.name ? "grey" : "ghost",
              }))}
              isMobile={isMobile}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
            <Chat
              messages={selectedUser.messages}
              selectedUser={selectedUser}
              isMobile={isMobile}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ChatLayout;
