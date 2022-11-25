import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

 /**
  * view, static, redirection 등을 위해 HTTP 프로토콜이 필요하다
  * WebSocket 프로토콜은 양방향 실시간 통신에 사용한다
  */
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);    // HTTP로 서버 실행
const io = SocketIO(httpServer);   // SocketIO로 서버를 실행

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event:${event}`);
  })
  socket.on("enter_room", (roomName, done) => {    // 이벤트 이름, 프론트에서 받은 데이터, 프론트의 메소드
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");       // roomName에 있는 모든 사람에게 welcome 이벤트 전송
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.io(room).emit("bye"));
  })
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", msg);  // 메시지를 보낸 방으로 msg 전송
    done();                                    // 프론트엔드에서 메소드 실행
  })
});


httpServer.listen(3000, handleListen);    // 포트 3000에서 HTTP, WebSocket 둘 다 처리할 수 있다.