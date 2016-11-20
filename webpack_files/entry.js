import React from 'react';
import ReactDOM from 'react-dom';
import App from './react_components/App.jsx';

var dataHandler = require("./data/dataHandler.js");
dataHandler.initData();

ReactDOM.render(<App dataHandler={dataHandler}/>, document.getElementById('app'));