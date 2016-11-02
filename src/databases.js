//Load data, use dummy data for now
const dummyDataClient = require('./data/dummyDataClient.json');
const dummyDataDashboard = require('./data/dummyDataDashboard.json');
const Datastore = require('nedb');
const http = require('http');
const clientDB = new Datastore({ filename: './data/clientData.db', autoload: true });
const dashboardDB = new Datastore({ filename: './data/dashboardData.db', autoload: true });
const movieDB = new Datastore({ filename: './data/movies.db', autoload: true });
const debugDB = false;
const parseString = require('xml2js').parseString;
const movieTheaterString = "Tennispalatsi, Helsinki";
const apiURL = "http://www.finnkino.fi/xml/Schedule/?area=1031";

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
		return {
			movieID: movie.ID[0],
			title: movie.Title[0],
			description: movie.Genres[0],
			img: movie.Images[0].EventMediumImagePortrait[0],
			likes: 0,
			dislikes: 0,
			superlikes: 0,
	}
}

function addMovies(json) {
	const titlesAdded = [];
	const movies = json.Schedule.Shows[0].Show.map(parseMovie);
	movies.forEach( movie => {
		if (titlesAdded.indexOf(movie.title) === -1) {
			titlesAdded.push(movie.title);
			movieDB.insert(movie);
		}
	});
	if (debugDB) console.log(titlesAdded.length + " movies added to movieDB");
}

function resetMovies(json) {
	movieDB.remove({}, { multi: true }, (err, numRemoved) => {
		if (debugDB) console.log(numRemoved + ' items removed from movieDB');
		addMovies(json);
	});
}

function resetClientDB() {
	clientDB.remove({}, {multi:true}, (err, numRemoved) => {
		if (debugDB) console.log(numRemoved + ' items removed from clientDB');
		clientDB.insert(dummyDataClient, (err, docs) => {
			if (debugDB) {
				console.log('Initializing clientDB');
				docs.forEach(d => console.log('Adding \n', d));
				console.log('clientDB reset done');
			}
		});
	});
}

function resetDashboardDB() {
	dashboardDB.remove({}, {multi:true}, (err, numRemoved) => {
		if (debugDB) console.log(numRemoved + ' items removed from dashboardDB');
		dashboardDB.insert(dummyDataDashboard, (err, docs) => {
			if (debugDB) {
			 	console.log('Initializing dashboardDB');
				docs.forEach(d => console.log('Adding \n', d));
				console.log('dashboardDB reset done');
			}
		});
	});
}

module.exports = {
	dummyDataClient,
	dummyDataDashboard,
	debugDBs() {
		clientDB.count({}, (err, count) => {
			if (debugDB) console.log(count + " items in clientDB");
		});
		dashboardDB.count({}, (err, count) => {
			if (debugDB) console.log(count + " items in dashboardDB");
		});
	},
	resetDB(database) {
		switch (database) {
			//Reset clientDB
			case 'clientDB':
				resetClientDB();
				break;
			//Reset dashboardDB
			case 'dashboardDB':
				resetDashboardDB();
				break;
			default:
				if (debugDB) console.log(database + ' not found')
				break;
		}
	},
	loadMovies() {
		xmlToJson(apiURL, (err, data) => {
			if (err) {
				console.log(err);
			} else {
				resetMovies(data);
			}
		});
	},
	getMovies(callback) {
		movieDB.find({}, (err, docs) => {
			if (err) callback(err, null);
			//if (debugDB) docs.forEach( movie => console.log(movie.title));
			callback(null, docs);
		});
	},
	voteMovie(action, data, callback) {
		switch (action) {
			case 'like':
				movieDB.find({movieID: data.id}, (err, doc) => {
					if (err) callback(err, null);
					const likes = doc[0].likes;
					movieDB.update({movieID: data.id}, { $set: { likes: likes + data.vote}}, (err, doc) => {
						if (err) callback(err, null);
						callback(null, doc);
					});
				});
				break;
			case 'superlike':
				movieDB.find({movieID: data.id}, (err, doc) => {
					if (err) callback(err, null);
					const superlikes = doc[0].superlikes;
					movieDB.update({movieID: data.id}, { $set: { superlikes: superlikes + data.vote}}, (err, doc) => {
						if (err) callback(err, null);
						callback(null, doc);
					});
				});
				break;
			case 'dislike':
				movieDB.find({movieID: data.id}, (err, doc) => {
					if (err) callback(err, null);
					const dislikes = doc[0].dislikes;
					movieDB.update({movieID: data.id}, { $set: { dislikes: dislikes + data.vote}}, (err, doc) => {
						if (err) callback(err, null);
						callback(null, doc);
					});
			 });
			 break;
			default:
				callback('Invalid action', null);
		}
	}
};
