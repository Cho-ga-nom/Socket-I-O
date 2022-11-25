const sockets = [];

/**
 * connection 이벤트가 발생하면 콜백 소켓이 실행된다.
 * 소켓은 서버와 연결된 브라우저
 */
wss.on("connection", (socket) => {
  sockets.push(socket);              // 서버에 연결된 여러 브라우저들을 저장
  socket["nickname"] = "Anon";       // 소켓에 닉네임을 준다
  console.log("Connected to Browser");
  socket.on("close", () => console.log("DisConnected from the Browser"));

  socket.on("message", (msg) => {     // 프론트엔드에서 소켓에 메세지를 보내면 이벤트 실행
    const message = JSON.parse(msg);

    switch(message.type) {
      case "new_message":
        // 서버에 접속한 모든 브라우저에 socket이 보낸 메시지를 전달
        sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
});