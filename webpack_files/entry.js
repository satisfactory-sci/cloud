import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory,IndexRoute } from 'react-router'
import HomeView from './react_components/HomeView.jsx';
import App from './react_components/App.jsx';
import DetailsView from './react_components/DetailsView.jsx'
import AddView from './react_components/AddView.jsx'


var dataHandler = require("./data/dataHandler.js");
dataHandler.initData();
window.dataHandler = dataHandler;

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={HomeView} />
      <Route path="add" component={AddView} />
      <Route path="event/:id" component={DetailsView} />
    </Route>
  </Router>
),document.getElementById('app'));
