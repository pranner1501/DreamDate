let socket;
let role = null;

const joinBtn = document.getElementById('joinBtn');
const player1Box = document.getElementById('player1');
const player2Box = document.getElementById('player2');
const cameraRig = document.getElementById('cameraRig');
const chatInput = document.getElementById('chatInput');
const floatingMessage = document.getElementById('floatingMessage');
const bgMusic = document.getElementById('backgroundMusic');

joinBtn.onclick = () => {
  // Try to play the background music after user interaction
  if (bgMusic.paused) {
    bgMusic.play().catch(err => {
      console.warn("Autoplay prevented:", err);
    });
  }

  socket = new WebSocket(`ws://${location.host}`);

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    if (msg.type === 'assign-role') {
      role = msg.role;
      joinBtn.style.display = 'none';

      if (role === 'player1') {
        player2Box.setAttribute('visible', true);
        cameraRig.setAttribute('position', '0 0 -2.8');
        cameraRig.setAttribute('rotation', '0 180 0');
      } else {
        player1Box.setAttribute('visible', true);
        cameraRig.setAttribute('position', '0 0 2.8');
        cameraRig.setAttribute('rotation', '0 0 0');
      }

      const cam = document.querySelector('#playerCam');
      cam.setAttribute('look-controls', 'enabled', false);
      setTimeout(() => {
        cam.setAttribute('look-controls', 'enabled', true);
      }, 500);
    }

    if (msg.type === 'chat') {
      showFloatingMessage(msg.text);
    }

    if (msg.type === 'disconnect') {
      alert('The other person has left the room.');
      window.location.reload();
    }

    if (msg.type === 'room-full') {
      alert('Room is full. Try again later.');
    }
  };

  socket.onclose = () => {
    if (role) {
      alert('The other person has disconnected.');
      window.location.reload();
    }
  };
};

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && chatInput.value.trim()) {
    const message = chatInput.value.trim();
    socket.send(JSON.stringify({ type: 'chat', text: message }));
    chatInput.value = '';
  }
});

function showFloatingMessage(text) {
  floatingMessage.textContent = text;
  floatingMessage.style.opacity = 1;

  setTimeout(() => {
    floatingMessage.style.opacity = 0;
  }, 3000);
}
