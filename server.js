const express = require('express');
const port = 5000;
const app = express();

const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({server:app});

wss.on('connection', (ws) => {
	ws.on('message', (data, flags) => {
		console.log(data);
		ws.send('Server got: ' + data);
	});
})

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
})
.listen(port, () => console.log('Running on ' + port));
