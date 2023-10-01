const socket = io();
const userColors = {};
let name;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");

// Function to initialize the online users list
function initializeOnlineUsers(onlineUsers) {
  const onlineUsersList = document.getElementById("onlineUsersList");
  onlineUsersList.innerHTML = "";

  onlineUsers.forEach((user) => {
    const listItem = document.createElement("li");
    listItem.textContent = user;
    listItem.id = `user-${user}`;
    updateUserColor(user);
    onlineUsersList.appendChild(listItem);
  });
}

do {
  name = prompt("Please enter your name:");
} while (!name);

// When the user connects, send their user name to the server
socket.emit("userConnected", name);

textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});

// Generate a random color for the user
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Assign a color to the user
userColors[name] = getRandomColor();

function updateUserColor(user) {
  const userListItem = document.querySelector(`#user-${user}`);
  if (userListItem) {
    userListItem.style.color = userColors[user];
  }
}

function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim(),
  };

  // Append the message to the UI
  appendMessage(msg, "outgoing");
  textarea.value = "";
  scrollToBottom();

  // Send to server
  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");

  let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
      `;

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

// Receive messages
socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  scrollToBottom();
});

// Update the list of online users when it changes
socket.on("updateOnlineUsers", (onlineUsers) => {
  // Call the function to initialize the online users list
  initializeOnlineUsers(onlineUsers);
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
