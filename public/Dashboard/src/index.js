import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import LikeChart from "./Components/LikeChart";
import 'babel-polyfill'

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    let socket = io();
    socket.on('newItems', (data) => {
      this.setState({items: data})
    })
    socket.on('dislike', (data) => {
      this._updateState(data, 0)
    })
    socket.on('like',(data) => {
      this._updateState(data, 1)
    })
    socket.on('superlike', (data) => {
      this._updateState(data, 2)
    })
    socket.emit('requestDashboardData')
  }

  _updateState(data, type) {
    let state = this.state.items
    let i = state.findIndex((obj) => {
      return obj.movieID == data.id
    })
    if(i == -1){
      return;
    }
    if(type == 0){
      state[i].dislikes += data.vote
    }else if(type == 1){
      state[i].likes += data.vote
    }else{
      state[i].superlikes += data.vote
    }
    this.setState({items: state})
  }

  render() {
      let rdata = this.state.items.map((item)  => {return {label: item.title, dislikes:item.dislikes, likes: item.likes, superlikes: item.superlikes}});
      return (
        <div>
          <LikeChart data={rdata} />
        </div>
      )
  }
}


ReactDOM.render(
  <App />, document.getElementById('target')
);
