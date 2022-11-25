const socket = io();

const welcome = document.getElementById("welcom");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {   // 서버로 메시지 전송
    addMessage(`You: ${value}`);            // 서버에서 addMessage 실행
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit(
    "enter_room", // 이벤트 이름
    input.value,  // 서버로 보낼 데이터
    showRoom  // 서버에서 실행시킬 메소드. 서버에서 이 메소드의 실행 버튼을 눌러주는 개념
    );
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {          // welcome 메시지를 받으면
  addMessage("someone joined!");      // someone joined 메시지를 추가
});

socket.on("bye", () => {
  addMessage("Someone left!");
});

socket.on("new_message", addMessage);   // 서버에 접속한 다른 브라우저에게 메시지를 보낸다.