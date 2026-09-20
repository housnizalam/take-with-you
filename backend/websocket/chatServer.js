import { WebSocketServer } from "ws";

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
          connectedUsers.set(
            data.userId,
            socket,
          );

          socket.userId = data.userId;

          console.log(
            `WebSocket user registered: ${data.userId}`,
          );

          return;
        }

        if (data.type === "message") {
          const receiverSocket =
            connectedUsers.get(data.toUserId);

          if (
            receiverSocket &&
            receiverSocket.readyState ===
              receiverSocket.OPEN
          ) {
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
        console.error(
          "WebSocket message error:",
          error,
        );
      }
    });

    socket.on("close", () => {
      if (socket.userId) {
        connectedUsers.delete(
          socket.userId,
        );

        console.log(
          `WebSocket user disconnected: ${socket.userId}`,
        );
      }
    });
  });

  console.log("WebSocket chat server initialized");
}

export { initializeChatServer };