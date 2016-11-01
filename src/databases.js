//Load data, use dummy data for now
const dummyDataClient = require('./data/dummyDataClient.json');
const dummyDataDashboard = require('./data/dummyDataDashboard.json');
const Datastore = require('nedb');
const clientDB = new Datastore({ filename: './data/clientData.db', autoload: true });
const dashboardDB = new Datastore({ filename: './data/dashboardData.db', autoload: true });
const debugDB = false;

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
			console.log(count + " items in clientDB");
		});
		dashboardDB.count({}, (err, count) => {
			console.log(count + " items in dashboardDB");
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
	}
};
