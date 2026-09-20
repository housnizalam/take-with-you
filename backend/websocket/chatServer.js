import { WebSocket, WebSocketServer } from "ws";
const connectedUsers = new Map();

function initializeChatServer(server) {
  const wss = new WebSocketServer({
    server,
  });

  wss.on("connection", (socket) => {
    console.log("WebSocket client connected");

    socket.on("message", (rawMessage) => {
      try {
        const data = JSON.parse(rawMessage.toString());

        if (data.type === "register") {
          connectedUsers.set(data.userId, socket);

          socket.userId = data.userId;

          console.log(`WebSocket user registered: ${data.userId}`);

          console.log("Connected users:", [...connectedUsers.keys()]);

          return;
        }

        if (data.type === "message") {
          const receiverSocket = connectedUsers.get(data.toUserId);
          console.log(`Sending live message to: ${data.toUserId}`);

          console.log("Connected users:", [...connectedUsers.keys()]);
          if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
            receiverSocket.send(
              JSON.stringify({
                type: "message",
                message: data.message,
              }),
            );
          }

          return;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    socket.on("close", () => {
      if (!socket.userId) {
        return;
      }

      const registeredSocket = connectedUsers.get(socket.userId);

      if (registeredSocket === socket) {
        connectedUsers.delete(socket.userId);

        console.log(`WebSocket user disconnected: ${socket.userId}`);
      }
    });
  });

  console.log("WebSocket chat server initialized");
}

export { initializeChatServer };
