"use strict";
//Load data, use dummy data for now
const http = require('http');
const moment = require('moment');
const Datastore = require('nedb');
const eventsDB = new Datastore({ filename: './data/events.db', autoload: true });
const defaultItems = require('./data/defaultItems.js');
const parseString = require('xml2js').parseString;
const movieTheaterString = "Tennispalatsi, Helsinki";
const apiURL = "http://www.finnkino.fi/xml/Schedule/?area=1031";
const debugDB = true;

function xmlToJson(url, callback) {
  http.get(url, (res) => {
    let xml = '';
    res.on('data', (chunk) => {
      xml += chunk;
    });
    res.on('error', (err) => {
      callback(e, null);
    });
    res.on('timeout', (err) => {
      callback(e, null);
    });
    res.on('end', () => {
      parseString(xml, (err, res) => {
        callback(null, res);
      });
    });
  });
}



function parseMovie(movie) {
  if (movie && movie.ID && movie.Title && movie.Genres && movie.Images) {
    return {
      title: movie.Title[0],
      description: movie.Genres[0],
      img: movie.Images[0].EventMediumImagePortrait[0],
      location: movieTheaterString,
      startTime: moment(movie.dttmShowStart[0]).format('HH:MM'), //TODO: format
      endTime: moment(movie.dttmShowEnd[0]).format('HH:MM'),
      date: moment(movie.dttmShowStart[0]).format('DD.MM.YYYY'),
      maxPeople: 10,
      joined: 0,
      starred: 0,
      dumped: 0,
      comments: []
    }
  } else {
    return null;
  }
}

function addMovies(json) {
  const titlesAdded = [];
  const movies = json.Schedule.Shows[0].Show.map(parseMovie);
  movies.forEach( (movie) => {
    if (movie && titlesAdded.indexOf(movie.title) === -1) {
      titlesAdded.push(movie.title);
      eventsDB.insert(movie);
    }
  });
  if (debugDB) console.log(titlesAdded.length + ' movies added to eventsDB');
}

function addDefault() {
  defaultItems.forEach( (item) => {
    if (item) {
      eventsDB.insert(item);
    }
  })
  if (debugDB) console.log(defaultItems.length + ' events added to eventsDB')
}

function resetEvents(json) {
  eventsDB.remove({}, { multi: true }, (err, numRemoved) => {
    if (debugDB) console.log(numRemoved + ' items removed from eventsDB');
    addMovies(json);
    addDefault();
  });
}

module.exports = {
  debugDB() {
    eventsDB.count({}, (err, count) => {
      if (debugDB) console.log(count + " items in eventsDB");
    });
  },
  loadMovies() {
    xmlToJson(apiURL, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        resetEvents(data);
      }
    });
  },
  getEvents(callback) {
    eventsDB.find({}, (err, docs) => {
      if (err) callback(err, null);
      //if (debugDB) docs.forEach( movie => console.log(movie.title));
      callback(null, docs);
    });
  },
  addEvent(json, callback) {
    eventsDB.insert(json, (err, docs) => {
      if (err) callback(err, null);
      callback(null, docs);
    });
  },
  voteMovie(action, data, callback) {
    switch (action) {
      case 'star':
        eventsDB.find({_id: data._id}, (err, doc) => {
          if (debugDB) console.log(doc);
          if (err) callback(err, null);
          if (doc && doc[0]) {
            const starred = doc[0].starred;
            if (debugDB) console.log(starred + ", " + data.vote);
            if (debugDB) console.log(starred + data.vote);
            eventsDB.update({_id: data._id}, { $set: { starred: starred + data.vote}}, (err, doc) => {
              if (err) callback(err, null);
              callback(null, doc);
            });
          } else {
            callback("Invalid data", null);
          }
        });
        break;
      case 'join':
        eventsDB.find({_id: data._id}, (err, doc) => {
          if (err) callback(err, null);
          if (doc && doc[0]) {
            const joined = doc[0].joined;
            eventsDB.update({_id: data._id}, { $set: { joined: joined + data.vote}}, (err, doc) => {
              if (err) callback(err, null);
              callback(null, doc);
            });
          } else {
            callback("Invalid data", null);
          }
        });
        break;
      case 'dump':
        eventsDB.find({_id: data._id}, (err, doc) => {
          if (err) callback(err, null);
          if (doc && doc[0] && data) {
            const dumped = doc[0].dumped;
            eventsDB.update({_id: data._id}, { $set: { dumped: dumped + data.vote}}, (err, doc) => {
              if (err) callback(err, null);
              callback(null, doc);
            });
          } else {
            callback("Invalid data", null);
          }
       });
       break;
      default:
        callback('Invalid action', null);
    }
  }
};
