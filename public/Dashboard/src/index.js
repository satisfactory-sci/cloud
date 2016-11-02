import React from 'react';
import ReactDOM from 'react-dom';
import LikeChart from "./Components/LikeChart";
//Mock data
const data = [
    {title:"Doctor Strange", img:"http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg", votes: {dislikes: 2, likes: 4, superlikes: 2}},
    {title:"Doctor Weird", img:"http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg", votes: {dislikes: 1, likes: 6, superlikes: 1}},
    {title:"Doctor Not Strange oh god no", img:"http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg", votes: {dislikes: 2, likes: 3, superlikes: 0}},
    {title:"Doctor Not Weird", img:"http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg", votes: {dislikes: 5, likes: 1, superlikes: 1}},
    {title:"Haa haa", img:"http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg", votes: {dislikes: 5, likes: 1, superlikes: 1}}
  ]


//used to "emulate" network
function downloadState() {
  return data
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      items: []
    }
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    let state = downloadState();
    this.setState({items: state});
  }

  _updateState(data) {
    this.setState({items: data});
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
