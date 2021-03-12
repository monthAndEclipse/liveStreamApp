const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4:uuidV4} = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: '/'
  });

app.use('/peerjs', peerServer);  

app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.redirect(`/${uuidV4()}`)
})

app.get('/:roomId',(req,res)=>{   
    res.render('room',{roomId:req.params.roomId})
})


io.on("connection",(socket)=>{
   socket.on('joinRoom',(roomId,userId)=>{
     socket.join(roomId);
     socket.broadcast.to(roomId).emit('userConnected',userId);
   })
})

server.listen(3000,()=>{
    console.log('server started successfully');
})

