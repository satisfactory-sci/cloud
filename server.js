//Setting thins up
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const xml2js = require('xml2js').parseString;
const port = 5000;
const debugServer = true;
const debugClient = true;
const dbs = require('./src/databases.js');
const dashboards = [];
//App definitions
app.use(express.static('public'));
app.use(express.static('public/Dashboard'));
app.use(bodyParser.urlencoded({ extended: true}));

//Fetch items for client
function fetchClientItems() {
  const items = dbs.getMovies();
  if (debugServer) console.log('fetched items: ', items);
  return items;
}

//Client requesting new items
function sendItems(client) {
  if (debugClient) client.emit('debug', 'Server sending items');
  dbs.getMovies( (err, items) => {
    if (items) {
      if (debugClient) client.emit('debug', items);
      client.emit('newItems', items);
      if (debugClient) client.emit('debug', 'Server sent items');
    }
  });
}

function updateAction(action, data) {
  if (debugServer) console.log("updateAction " + action + " with ", data);
  dbs.voteMovie( action, data, (err, count) => {
    if (err) console.log(err);
    if (debugServer) console.log(count + " changes for " + data.id + " (" + action + ")");
  });
}

//Handle proper requests
function handleEvent(client, newEvent, data) {
  //Debug data
  if (debugClient) client.emit('debug', 'Server got ' + newEvent);
  if (debugServer) console.log(newEvent + ' | ', data);
  //Handle different requests
  switch (newEvent) {
    case 'requestItems':
      if (debugServer) console.log('requestItems => sendItems()');
      sendItems(client);
      break;
    case 'requestDashboardData':
      if (debugServer) console.log('requestDashboardData => sendItems()');
      sendItems(client);
      break;
    case 'like':
      updateAction('like', data);
      break;
    case 'dislike':
      updateAction('dislike', data);
      break;
    case 'superlike':
      updateAction('superlike', data);
      break;
    default:
      if (debugServer) console.log('Unrecognized request');
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
    handleEvent(client, 'requestItems');
  })
  //Client liked an item
  client.on('like', (data) => {
    handleEvent(client, 'like', data);
    dashboards.forEach( client => client.emit('like', data));
  });
  //Cliend superliked an item
  client.on('superlike', (data) => {
    handleEvent(client, 'superlike', data);
    dashboards.forEach( client => client.emit('superlike', data));
  });
  //Client disliked an item
  client.on('dislike', (data) => {
    handleEvent(client, 'dislike', data);
    dashboards.forEach( client => client.emit('dislike', data));
  });
  //Client has an empty list
  client.on('empty', (data) => {
    handleEvent(client, 'empty', data);
  });

  //Dashboard requesting items
  client.on('requestDashboardData', (data) => {
    //Add dashboard to listeners
    dashboards.push(client);
    if (debugServer) console.log('dashboards connected: ' + dashboards.length);
    handleEvent(client, 'requestDashboardData', data);
  })

  client.on('disconnect', (data) => {
    //Remove dashboard from listeners
    const index = dashboards.indexOf(client);
    if (index > -1) {
      dashboards.splice(index, 1);
      if (debugServer) console.log('dashboard removed');
    }
  })
});

//Serve HTML when requested
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/public/Dashboard/index.html');
});

//Reset databases with delete TODO REFACTOR/REMOVE
app.delete('/:dbPassword', (req, res) => {
  if (debugServer) console.log('Requesting clientDB deletion: ' + req.params.dbPassword);
  if (req.params.dbPassword === process.env.DBPASSWORD) {
    dbs.resetDB('clientDB');
    res.status(200).json({message: "database reset", targetDB: 'clientDB'});
  } else {
    res.status(403).json({message: "wrong PW"});
  }
})

app.delete('/dashboard/:dbPassword', (req, res) => {
  if (debugServer) console.log('Requesting dashboardDB deletion: ' + req.params.dbPassword);
  if (req.params.dbPassword === process.env.DBPASSWORD) {
    dbs.resetDB('dashboardDB');
    res.status(200).json({message: "database reset", targetDB: 'dashboardDB'});
  } else {
    res.status(403).json({message: "wrong PW"});
  }
})

//Update movie DB with PUT
app.put('/:dbPassword', (req, res) => {
  if (debugServer) console.log('Requesting movieDB updating: ' + req.params.dbPassword);
  if (req.params.dbPassword === process.env.DBPASSWORD) {
    dbs.loadMovies();
    res.status(200).json({message: "database updated", targetDB: 'movieDB'});
  } else {
    res.status(403).json({message: "wrong PW"});
  }
})

//Start server
server.listen(port, () => console.log('Running on ' + port));
module.exports = {app: app, server:server};

//Debug item count
if (debugServer) {
  dbs.debugDBs();
}
