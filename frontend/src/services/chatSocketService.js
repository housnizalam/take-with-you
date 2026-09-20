
let socket = null;

function connectChatSocket(userId, onMessage) {
  socket = new WebSocket("ws://localhost:3000");

  socket.addEventListener("open", () => {
    console.log("WebSocket connected");

    socket.send(
      JSON.stringify({
        type: "register",
        userId,
      }),
    );
  });

  socket.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === "message") {
        onMessage(data.message);
      }
    } catch (error) {
      console.error(
        "Error reading WebSocket message:",
        error,
      );
    }
  });

  socket.addEventListener("close", () => {
    console.log("WebSocket disconnected");
  });

  socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });
}

function sendChatMessage(toUserId, message) {
  if (!socket) {
    return;
  }

  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }

  socket.send(
    JSON.stringify({
      type: "message",
      toUserId,
      message,
    }),
  );
}

function disconnectChatSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}

export {
  connectChatSocket,
  sendChatMessage,
  disconnectChatSocket,
};