const express = require('express');
const app = express();
const http = require('http');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 5000;
const debugServer = false;
const debugClient = true;

app.use(express.static('public'));

function handleEvent(client, newEvent, data) {
	if (debugClient)
		client.emit('debug', 'server got ' + newEvent);
	if (debugServer)
		console.log(newEvent + ' | ', data);
}

io.on('connection', (client) => {
	client.on('connect', (data) => {
		handleEvent(client, 'connect', data);
	});

	client.on('like', (data) => {
		handleEvent(client, 'like', data)
	});

	client.on('superlike', (data) => {
		handleEvent(client, 'superlike', data)
	});

	client.on('dislike', (data) => {
		handleEvent(client, 'dislike', data)
	});

	client.on('empty', (data) => {
		handleEvent(client, 'empty', data);
	});
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

server.listen(port, () => console.log('Running on ' + port));

module.exports = {app: app, server:server};
