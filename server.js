const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html");

});

io.on("connection", (socket) => {
    console.log("Usser connected");

    socket.on("chat message", (msg)=>{
        console.log(msg);
        io.emit("chat message", msg);
    });
});
server.listen(process.env.PORT || 8080, () => {
    console.log("Success!")
});
