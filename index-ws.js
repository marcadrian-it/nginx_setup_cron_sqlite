import express from 'express';
import { createServer } from 'http';



const app = express();
const server = createServer(app);

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: process.cwd() });
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});
/* Begin websocket */
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ server: server });
wss.on('connection', function connection(ws) {
    const numClients = wss.clients.size;
    console.log('Client connected', numClients);

    wss.broadcast(`Current visitors: ${numClients}`);

    if (ws.readyState === ws.OPEN){
        ws.send('Welcome to my chat');
    }

    ws.on('close', function close() {
        console.log('Client has disconnected');
        wss.broadcast(`Current visitors: ${numClients}`);
    });

});
    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
                client.send(data); 
    });
    };



