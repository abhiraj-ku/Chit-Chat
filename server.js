
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

// Initialize an empty object to store online users
const onlineUsers = {};

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('Connected...');

  // When a new user connects, add them to the onlineUsers object
  socket.on('userConnected', (userName) => {
    onlineUsers[socket.id] = userName;
    io.emit('updateOnlineUsers', Object.values(onlineUsers));
  });

  // When a user disconnects, remove them from the onlineUsers object
  socket.on('disconnect', () => {
    delete onlineUsers[socket.id];
    io.emit('updateOnlineUsers', Object.values(onlineUsers));
  });

  // Handle incoming messages
  socket.on('message', (msg) => {
    console.log(msg);
    socket.broadcast.emit('message', msg);
  });
});

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
