// src/services/websocketService.ts
type ListenerCallback = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null;
  private listeners: Record<string, ListenerCallback[]>;

  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect(url: string): void {
    if (url === null) return;
    this.socket = new WebSocket(url);
    this.socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);
      this.notifyListeners("message", message);
    };

    this.socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    this.socket.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
    };
  }

  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open");
    }
  }

  addListener(event: string, callback: ListenerCallback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  removeListener(event: string, callback: ListenerCallback): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    }
  }

  notifyListeners(event: string, data: any): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }

  close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}

const websocketService = new WebSocketService();
export default websocketService;
