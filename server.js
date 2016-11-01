//Setting thins up
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 5000;
const debugServer = false;
const debugClient = true;
//App definitions
app.use(express.static('public'));
app.use(bodyParser);

//Load data, use dummy data for now
const dummyDataClient = require('./data/dummyDataClient.json');
const dummyDataServer = require('./data/dummyDataDashboard.json');

//Fetch items for client
function fetchClientItems() {
	if (debugServer) console.log("fetched items: ", dummyDataClient);
	return dummyDataClient;
}

//Client requesting new items
function sendItems(client) {
	if (debugClient) client.emit('debug', 'Server sending items');
	client.emit('newItems', fetchClientItems());
	if (debugClient) client.emit('debug', 'Server sent items');
}

//Handle proper requests
function handleEvent(client, newEvent, data) {
	//Debug data
	if (debugClient) client.emit('debug', 'Server got ' + newEvent);
	if (debugServer) console.log(newEvent + ' | ', data);
	//Handle different requests
	switch (newEvent) {
		case "requestItems":
			if (debugServer) console.log("requestItems => sendItems()");
			sendItems(client);
			break;
		default:
			if (debugServer) console.log("Unrecognized request");
		break;
	}
}

//Initialize websocket connection and messages
io.on('connection', (client) => {
	client.on('connect', (data) => {
		handleEvent(client, 'connect', data);
	});
	//Client requesting new items
	client.on('requestItems', (data) => {
		handleEvent(client, 'requestItems')
	})
	//Client liked an item
	client.on('like', (data) => {
		handleEvent(client, 'like', data)
	});
	//Cliend superliked an item
	client.on('superlike', (data) => {
		handleEvent(client, 'superlike', data)
	});
	//Client disliked an item
	client.on('dislike', (data) => {
		handleEvent(client, 'dislike', data)
	});
	//Client has an empty list
	client.on('empty', (data) => {
		handleEvent(client, 'empty', data);
	});
});

//Serve HTML when requested
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

//Start server
server.listen(port, () => console.log('Running on ' + port));
module.exports = {app: app, server:server};
