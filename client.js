const socket = io('http://127.0.0.1:8000',{
    transports: ["websocket"]
});

//Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

//Audio that will play on receiving messages
var audio = new Audio('ting.mp3');
//function which will append event info to the container
const append = (message,position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
    audio.play();
    }
}

//If the form gets submitted, send server the message
form.addEventListener('submit',(e)=>{
    e.preventDefault(); //doesnt reloads
    const message = messageInput.value ;
    append(`You:${message}`,'right');
    socket.emit('send',message);
    messageInput.value ='';
})
//Ask new user for his/her name and let the server know
const nam = prompt("Enter your name to join");
socket.emit('new-user-joined', nam)

//If a new user joins,receive his name from the server
socket.on('user-joined',name =>{
    append(`${name} joined the chat`,'right')

})

//If server sends a message receive it
socket.on('receive',data =>{
    append(`${data.name}: ${data.message}`,'left')

})
//If a user leaves the chat, append the info to the container
socket.on('left',name =>{
    append(`${name} left the chat`,'left')

})

