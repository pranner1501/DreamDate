const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

const wss = new WebSocket.Server({ noServer: true });

let players = [];

wss.on('connection', (ws) => {
  if (players.length < 2) {
    const role = players.length === 0 ? 'player1' : 'player2';
    players.push({ ws, role });
    ws.send(JSON.stringify({ type: 'assign-role', role }));

    ws.on('message', (message) => {
      const msg = JSON.parse(message);
      players.forEach(p => {
        if (p.ws !== ws) {
          p.ws.send(JSON.stringify(msg));
        }
      });
    });

    ws.on('close', () => {
      players = players.filter(p => p.ws !== ws);
      players.forEach(p => {
        p.ws.send(JSON.stringify({ type: 'disconnect' }));
        p.ws.close();
      });
      players = [];
    });
  } else {
    ws.send(JSON.stringify({ type: 'room-full' }));
    ws.close();
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, ws => {
    wss.emit('connection', ws, req);
  });
});


