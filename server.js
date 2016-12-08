//Setting thins up
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const formidable = require('express-formidable');
const moment = require('moment');
const http = require('http');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const xml2js = require('xml2js').parseString;
const port = 5000;
const debugServer = false;
const debugClient = true;
const db = require('./src/databases.js');
const dashboards = [];
//App definitions
app.use(express.static('public'));
app.use(express.static('public/Dashboard'));
app.use('/public/', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(formidable({uploadDir: './public/images/', keepExtensions:true, limit: '5mb'}));

//Client requesting new items
function sendItems(client) {
  if (debugClient) client.emit('debug', 'Server sending items');
  db.getEvents( (err, items) => {
    if (items) {
      if (debugClient) client.emit('debug', items);
      client.emit('newItems', items);
      if (debugClient) client.emit('debug', 'Server sent items');
    } else {
      if (debugClient) console.log('no data found');
    }
  });
}

function updateAction(action, data) {
  if (debugServer) console.log("updateAction " + action + " with ", data);
  db.voteMovie( action, data, (err, count) => {
    if (debugServer) console.log(count + " changes for " + data._id + " (" + action + ")");
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
    case 'star':
      updateAction('star', data);
      break;
    case 'dump':
      updateAction('dump', data);
      break;
    case 'join':
      updateAction('join', data);
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
  //Client stard an item
  client.on('star', (data) => {
    if (debugServer) console.log("Somebody starred!");
    handleEvent(client, 'star', data);
    dashboards.forEach( client => client.emit('star', data));
  });
  //Cliend superstard an item
  client.on('join', (data) => {
    if (debugServer) console.log("Somebody joined!");
    handleEvent(client, 'join', data);
    dashboards.forEach( client => client.emit('join', data));
  });
  //Client dumpd an item
  client.on('dump', (data) => {
    if (debugServer) console.log("Somebody dumped!");
    handleEvent(client, 'dump', data);
    dashboards.forEach( client => client.emit('dump', data));
  });
  //Client commented on an item
  client.on('comment', (data) => {
    if (debugServer) console.log("Somebody commented");
  });
  //Client canceled an item
  client.on('cancel', (data) => {
    if (debugServer) console.log("Somebody cancelled their join");
  })
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

app.get('/tinderable', (req, res) => {
  res.sendFile(__dirname + '/tinderable/index.html');
});

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/public/Dashboard/index.html');
});

//Update movie DB with PUT
app.put('/:dbPassword', (req, res) => {
  if (debugServer) console.log('Requesting eventsDB updating: ' + req.params.dbPassword);
  if (req.params.dbPassword === process.env.DBPASSWORD) {
    db.loadMovies();
    res.status(200).json({message: "database updated", targetDB: 'eventsDB'});
  } else {
    res.status(403).json({message: "wrong PW"});
  }
});

app.get('/blog', (req, res) => {
  res.redirect('http://medium.com/satisfactory');
});

app.get('/proto', (req, res) => {
  res.redirect('http://flinto.com/p/c7b2c2ba');
});

app.get('/database', (req, res) => {
  db.getEvents( (err, data) => {
    if (err) res.status(500).json({err: err});
    else res.json(data)
  })
})

var imgCount = 0;
// Add new event to database
app.post('/newevent', (req, res) => {
  const eventData = {
    title: req.fields.title,
    description: req.fields.description,
    img: 'http://satisfactory.fi/' + req.files.file.path,
    location: req.fields.location,
    startTime: req.fields.startTime, //TODO: format
    endTime: req.fields.endTime,
    date: req.fields.date,
    maxPeople: req.fields.maxPeople,
    joined: 0,
    starred: 0,
    dumped: 0,
    comments: []
  }
  if (debugServer) console.log(JSON.stringify(eventData, null, 2));
  db.addEvent(eventData, (err, docs) => {
    if (err) res.status(500).json({err: err});
    io.sockets.emit('addItem', docs);
    res.json(docs);
  });
});

//Start server
server.listen(port, () => console.log('Running on ' + port));
module.exports = {app: app, server:server};

//Debug item count
if (debugServer) {
  db.debugDB();
}
