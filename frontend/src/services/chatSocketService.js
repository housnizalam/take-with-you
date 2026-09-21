let socket = null;

function connectChatSocket(userId, onMessage, onTripCompletion,) {
  const newSocket = new WebSocket("ws://localhost:3000");

  socket = newSocket;

  newSocket.addEventListener("open", () => {
    console.log("WebSocket connected");

    newSocket.send(
      JSON.stringify({
        type: "register",
        userId,
      }),
    );
  });

newSocket.addEventListener("message", (event) => {
  try {
    const data = JSON.parse(event.data);

    if (data.type === "message") {
      onMessage(data.message);
      return;
    }

    if (data.type === "trip_completion") {
      onTripCompletion(data.completion);
      return;
    }
  } catch (error) {
    console.error(
      "Error reading WebSocket message:",
      error,
    );
  }
});

  newSocket.addEventListener("close", () => {
    console.log("WebSocket disconnected");

    if (socket === newSocket) {
      socket = null;
    }
  });

  newSocket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });
}

function sendChatMessage(toUserId, message) {
  if (!socket) {
    console.log("No WebSocket connection");
    return;
  }

  if (socket.readyState !== WebSocket.OPEN) {
    console.log("WebSocket is not ready");
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
  if (!socket) {
    return;
  }

  const socketToClose = socket;

  socket = null;

  if (socketToClose.readyState === WebSocket.OPEN) {
    socketToClose.close();
    return;
  }

  if (socketToClose.readyState === WebSocket.CONNECTING) {
    socketToClose.addEventListener(
      "open",
      () => {
        socketToClose.close();
      },
      { once: true },
    );
  }
}

function sendTripCompletionUpdate(
  toUserId,
  completion,
) {
  if (!socket) {
    return;
  }

  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }

  socket.send(
    JSON.stringify({
      type: "trip_completion",
      toUserId,
      completion,
    }),
  );
}

export {
  connectChatSocket,
  sendChatMessage,
  disconnectChatSocket,
  sendTripCompletionUpdate,
};