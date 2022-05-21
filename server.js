const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const fs = require('fs');
const io = require("socket.io")(server);
const ejs = require("ejs");
app.use(express.static('public'));
app.set("view enjine","ejs");
app.engine("ejs",ejs.renderFile);
app.get("/", (req,res)=>{
    res.render(__dirname + "/world.ejs");

});
app.get("/world.ejs", (req,res)=>{
    res.render(__dirname + "/world.ejs");

});

app.get("/livecam.ejs", (req,res)=>{
    res.render(__dirname + "/livecam.ejs");

});

io.on("connection", (socket) => {
    socket.on("codes", ()=>{
        const codes = JSON.parse(fs.readFileSync('public/json/live.json','utf-8'));
        socket.emit("codes",codes);      
    });
    socket.on("req_camlist", (cnt)=>{
        const camlist = JSON.parse(fs.readFileSync('public/json/live.json','utf-8'));
        let chat_hist='';
        if(fs.existsSync("public/chattxt/"+cnt+".txt")){
            chat_hist=fs.readFileSync("public/chattxt/"+cnt+".txt",'utf-8');
        }else{
            fs.writeFile("public/chattxt/"+cnt+".txt",'', function(err){
                if(err){throw err;}
            });
        }
        socket.emit("res_camlist",camlist[cnt]);      
        socket.emit("chat_hist",chat_hist);      
    });
    socket.on("chat message", (msg,cnt)=>{
        io.emit("chat message",msg); 
        const options={
            flag:'a'
        };
        fs.writeFile("public/chattxt/"+cnt+".txt",msg+' , ', options,function(err){
            if(err){throw err;}
        });
        
        console.log(msg)     
    });
});
server.listen(process.env.PORT || 8080, () => {
    console.log("Success!")
});
