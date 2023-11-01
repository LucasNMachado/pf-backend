const initChat = () => {
    const socket = io();
  
    const sendMessage = () => {
      const user = document.querySelector('#user').value;
      const message = document.querySelector('#message').value;
      socket.emit('chatMessage', { user, message });
      document.querySelector('#message').value = '';
    };
  
    socket.on('chatMessage', (data) => {
      const { user, message } = data;
      const chatContainer = document.querySelector('#chatContainer');
      const messageElement = document.createElement('p');
      messageElement.innerHTML = `<strong>${user}:</strong> ${message}`;
      chatContainer.appendChild(messageElement);
    });
  
    document.querySelector('#sendBtn').addEventListener('click', sendMessage);
  };
  
  document.addEventListener('DOMContentLoaded', initChat);