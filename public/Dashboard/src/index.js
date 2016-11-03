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
      this.superLike(state[i].title, state[i].img)
    }
    this.setState({items: state})
  }

  onClick() {
      let toast = document.getElementById("toast")
      toast.className = "show"
      setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
  }

  superLike(title, img) {
    let toast = document.getElementById("toast")
    let card = document.getElementById("card")
    document.getElementById("toast-title").innerHTML = title + "<br> Got Superliked!"
    let timg = document.getElementById("toast-img")
    timg.src = img
    setTimeout(100)

    //toast.style.marginRight= (toast.clientWidth / 2) + "px"
    //toast.style.marginBottom= (toast.clientHeight / 2) + "px"
    toast.className = "show"
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
  }

  render() {
      let rdata = this.state.items.map((item)  => {return {label: item.title, dislikes:item.dislikes, likes: item.likes, superlikes: item.superlikes}});
      return (
        <div>
          <div className="toast-container">
            <div id="toast">
              <div className="card" id="card">
                <img className="card-img-top" id="toast-img" src="http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg" alt="Card image cap"></img>
                  <h4 className="card-title" id="toast-title">Got Superliked</h4>
              </div>
            </div>
          </div>
          <nav className="navbar navbar-light bg-faded" id="navbar">
            <div className="container-fluid nav-container">
              <div className="navbar-header">
                  Satisfactory
              </div>
            </div>
          </nav>
          <LikeChart data={rdata} />
        </div>
      )
  }
}


ReactDOM.render(
  <App />, document.getElementById('target')
);
