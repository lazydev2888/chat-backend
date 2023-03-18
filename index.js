const http=require('http');
const express=require('express');
const cors=require('cors');
const socketio=require('socket.io');

const app=express();
const port=4500 || process.env.PORT;

const users =[{}];


app.use(cors());
    app.get("/",(req,res)=>{
    res.send("Server is running");
});

const server=http.createServer(app);

const io=socketio(server);

io.on('connection',(socket)=>{
console.log("New Connection");


socket.on('Joined',({user})=>{
    users[socket.id]=user;
console.log(`${user} has joined the chat`);
socket.broadcast.emit('userJoined',{user:"Admin", message:`${users[socket.id]} has Joined`});
socket.emit('Welcome',{user:"Admin", message:`Welcome to the chat${users[socket.id]}  `})
})

socket.on('message',({message,id})=>{
    io.emit('sendmessage',{user:users[socket.id], message:message});

socket.on('disconnect',()=>{
    socket.broadcast.emit('userLeft',{user:"Admin", message:`${users[socket.id]} has left the chat`});
    console.log(`${users[socket.id]} has left the chat`);

})

});
server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});