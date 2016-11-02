import React from 'react';
import ReactDOM from 'react-dom';
import LikeChart from "./Components/LikeChart";
import 'babel/polyfill'

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      items: []
    }
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    let socket = io();
    socket.on('newItems', (data) => {
      this.setState({items: data})
    })
    /*
    socket.on('dislike', (data) => {
      _updateState(data, 0)
    })
    socket.on('like',(data) => {
      _updateState(data, 1)
    })
    socket.on('superlike', (data) => {
      _updateState(data, 2)
    })*/
    socket.emit('requestDashboardItems')
  }

  _updateState(data, type) {
    let state = this.state.items
    let i = state.findIndex((obj) => {
      obj.id = data.id
    })
    if(type == 0){
      state[i].votes.dislikes += 1
    }else if(type == 1){
      state[i].votes.like += 1
    }else{
      state[i].votes.superlike += 1
    }
    this.setState({items: state})
  }

  onClick() {
    let state = this.state.items;
    let i =  Math.floor((Math.random() * 10) + 1);
    state.push({title:"Doctor Weird" + i, img:"http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg", votes: {dislikes: 1, likes: 4, superlikes: i}})
    this.setState({items: state});
  }

  render() {
      let rdata = this.state.items.map((item) => {return {label: item.title, dislikes:item.votes.dislikes, likes: item.votes.likes, superlikes: item.votes.superlikes}});
      return <div><LikeChart data={rdata} /><button type="button" onClick={this.onClick}>Increase</button></div>
  }
}


ReactDOM.render(
  <App />, document.getElementById('target')
);
