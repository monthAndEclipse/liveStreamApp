
const socket = io('/');
const divStyle = ['col-lg-4', 'col-md-6', 'col-sm-6','col-12','text-center','rounded-1'];
const videoGrid = document.querySelector('.video-grid');
const myVideo = document.createElement('video');
const myDiv = document.createElement('div');
addDivStyle(myDiv);

const myPeer = new Peer(undefined,{
    host:'/',
    port:3000,
    path:'peerjs'
})
const peers= [];


navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then((stream)=>{
    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video');
        const remoteDiv  =document.createElement('div');
        addDivStyle(remoteDiv);
        call.on('stream', userVideoStream => {
            addVideoStream(remoteDiv,video, userVideoStream)
        })
       
    })



    addVideoStream(myDiv,myVideo,stream);
    socket.on('userConnected',userId=>{
        setTimeout(connectToNewUser,1500,userId,stream)
        // connectToNewUser(userId,stream);
    })
    
})

myPeer.on('open', id => {
    socket.emit('joinRoom',roomId,id);
})

socket.on('userDisconnect',(userId)=>{
    if(peers[userId]){
        peers[userId].close();
    }
})


function connectToNewUser(userId,stream){
    const call = myPeer.call(userId,stream);
    const video = document.createElement('video');
    const div = document.createElement('div');
    addDivStyle(div);
    call.on('stream', userVideoStream => {
        addVideoStream(div,video, userVideoStream)
        })
    call.on('close',()=>{
        video.parentElement.remove()
    })
    peers[userId]  = call;
}


function addVideoStream(div,video,stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',e=>{
        video.play();
    })
    div.appendChild(video);
    videoGrid.append(div);
}

function addDivStyle(div){
    divStyle.forEach(ele=>{
        div.classList.add(ele);
    })
}