const config = require("./config.js");
const app = require("./app");
const socket = require("socket.io");

const server = app.listen(config.PORT, () => {
  console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const activeUsers = new Map();
io.on("connection", (socket) => {
  socket.on("add-user", (data) => {
    socket.userId = data;
    activeUsers.set(data, socket.id);
    io.emit("add-user", [...activeUsers]);
  });
  socket.on("send-message", (data) => {
    const sendUserSocket = activeUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("message-recieve", data.message);
    }
  });
  // socket.on("disconnect", () => {
  //   activeUsers.delete(socket.userId);
  //   io.emit("user-disconnected", socket.userId);
  // });
});
