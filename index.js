const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 線上人數計數
let onlineCount = 0;

io.on('connection', (socket) => {
  //連線成功
    onlineCount++;
    //傳送人數
    io.emit("online", onlineCount);
    io.emit("someOneCome");
    

    socket.on("greet", () => {
        socket.emit("greet", onlineCount);
    });
    //傳送訊息
    socket.on("send", (msg) => {
        if (Object.keys(msg).length < 2) return;
        io.emit("msg", msg);
    });
    
  //離開連線
    socket.on('disconnect', () => {
    onlineCount--;
    io.emit("online", onlineCount);
    
  });


});

http.listen(3000, () => {
  console.log('listening on *:3000');
});