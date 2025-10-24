import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const rooms = {};

export default function socketConnection(server) {

  //init
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("chat_message", (data) => {
      io.emit("receive_message", data);
    });

    socket.on("create_room", (callback) => {
      const roomId = uuidv4();
      rooms[roomId] = {
        users: {},
        code: "",
        hostId: socket.id,
      };
      callback(roomId);
    });

    socket.on("join_room", ({ roomId, userName }) => {
      if (!rooms[roomId]) {
        socket.emit("room_not_found");
        return;
      }

      socket.join(roomId);
      rooms[roomId].users[socket.id] = {
        userName,
        code: rooms[roomId].code || "",
        cursorPosition: null,
      };

      // Send initial room data to the newly joined user
      socket.emit("initial_room_data", {
        code: rooms[roomId].code,
        users: rooms[roomId].users,
      });

      // Notify existing users about the new user's arrival and trigger signaling
      Object.keys(rooms[roomId].users).forEach((existingUserId) => {
        if (existingUserId !== socket.id) {
          io.to(existingUserId).emit("user_joined_with_signal", {
            signal: null,
            callerID: socket.id,
            userName,
          });

          socket.emit("user_joined_with_signal", {
            signal: null,
            callerID: existingUserId,
            userName: rooms[roomId].users[existingUserId].userName,
          });
        }
      });

      // Notify other users in the room about the new user joining
      socket.to(roomId).emit("user_joined", {
        userId: socket.id,
        userName,
        users: rooms[roomId].users,
      });
    });

    socket.on("code_change", ({ roomId, code, cursorPosition }) => {
      if (rooms[roomId]?.users[socket.id]) {
        rooms[roomId].code = code;
        rooms[roomId].users[socket.id].cursorPosition = cursorPosition;

        socket.to(roomId).emit("receive_code_change", {
          code,
          cursorPosition,
          userId: socket.id,
        });
      }
    });

    socket.on("cursor_position_change", ({ roomId, cursorPosition }) => {
      if (rooms[roomId]?.users[socket.id]) {
        rooms[roomId].users[socket.id].cursorPosition = cursorPosition;

        socket.to(roomId).emit("receive_cursor_position", {
          userId: socket.id,
          cursorPosition,
        });
      }
    });
    socket.on("sending_signal", ({ userToSignal, signal, roomId }) => {
      io.to(userToSignal).emit("user_joined_with_signal", {
        signal,
        callerID: socket.id,
        userName: rooms[roomId]?.users[socket.id]?.userName,
      });
    });

    socket.on("returning_signal", ({ signal, callerID }) => {
      io.to(callerID).emit("receiving_returned_signal", {
        signal,
        id: socket.id,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      for (const roomId in rooms) {
        if (rooms[roomId].users[socket.id]) {
          delete rooms[roomId].users[socket.id];

          if (Object.keys(rooms[roomId].users).length === 0) {
            delete rooms[roomId];
          } else {
            socket.to(roomId).emit("user_left", {
              userId: socket.id,
              users: rooms[roomId].users,
            });
          }
          break;
        }
      }
    });
  });

  return io;
}
