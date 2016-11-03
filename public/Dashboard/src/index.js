import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import io from 'socket.io-client';
import LikeChart from "./Components/LikeChart";
import SuperLike from "./Components/Superlike"
import 'babel-polyfill'

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [],
      superlikes: [],
    }
    this.superLike = this.superLike.bind(this)
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
      this.superLike(state[i])
    }
    this.setState({items: state, superlikes: this.state.superlikes})
  }

//Show superlike in the left corner
  superLike(slike) {
    let old = this.state.superlikes
    let i = old.findIndex((item) => {
      return item.movieID == slike.movieID
    })
    if(i < 0){
      old.push(slike)
      this.setState({items: this.state.items, superlikes: old})
      setTimeout(() => {
        let n = this.state.superlikes
        let i = n.findIndex((item) => {
          return item.movieID == slike.movieID
        })
        n.splice(i, 1)
        this.setState({items: this.state.items, superlikes: n})
      }, 900);

    }
  }

  render() {
      let rdata = this.state.items.map((item)  => {return {label: item.title, dislikes:item.dislikes, likes: item.likes, superlikes: item.superlikes}});
      let superlikes = this.state.superlikes.map((like) => {return <SuperLike key={like.movieID} title={like.title} img={like.img} count={like.superlikes} />})
      return (
        <div>
          <div className="toast-container">
            <ReactCSSTransitionGroup
              transitionName="superlike"
              transitionEnterTimeout={200}
              transitionLeaveTimeout={200}
              >
              {superlikes}
            </ReactCSSTransitionGroup>
          </div>
          <nav className="navbar navbar-light bg-faded" id="navbar">
            <div className="container-fluid">
              <div className="navbar-header">
                <a className=""><img src="/Dashboard/public/logo_minified.png" className="d-inline-block align-top" id="logo"></img></a>
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
