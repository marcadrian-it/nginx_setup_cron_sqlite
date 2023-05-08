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

process.on('SIGINT', ()=> {
  wss.clients.forEach(function each(client){
    client.close();
  });
  server.close(()=>{
    shutdownDB();
  })
})
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

    db.run(`INSERT INTO visitors (count, time)
      VALUES (${numClients}, datetime('now'))
    `);

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
/**begin database **/
import sqlite3 from 'sqlite3';
const sqlite = sqlite3.verbose();
const db = new sqlite.Database(':memory:');

db.serialize(()=> {
  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    )
  `)
});

function getCounts(){
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row);
  })
}

function shutdownDB(){
  getCounts();
  console.log('Shutting down db');
  db.close();
}
