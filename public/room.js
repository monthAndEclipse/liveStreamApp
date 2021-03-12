
const socket = io('/');
const videoGrid = document.querySelector('.video-grid');
const myVideo = document.createElement('video');
const myPeer = new Peer(undefined,{
    host:'/',
    port:3000,
    path:'peerjs'
})


navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then((stream)=>{
    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
       
    })
    addVideoStream(myVideo,stream);
    socket.on('userConnected',userId=>{
        setTimeout(connectToNewUser,1000,userId,stream)
        // connectToNewUser(userId,stream);
    })
    
})

myPeer.on('open', id => {
    socket.emit('joinRoom',roomId,id);
})



function connectToNewUser(userId,stream){
    const call = myPeer.call(userId,stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
        })
    call.on('close',()=>{
        video.remove();
    })
}


function addVideoStream(video,stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',e=>{
        video.play();
    })
    videoGrid.append(video);
}