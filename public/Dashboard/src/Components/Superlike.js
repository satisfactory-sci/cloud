import React from 'react'
import ReactDOM from 'react-dom'

class SuperLike extends React.Component {
  render() {
    return (
    <div id="toast">
      <div className="card" id="card">
        <img className="card-img-top" id="toast-img" src={this.props.img} alt="Card image cap"></img>
          <h4 className="card-title" id="toast-title">{this.props.title} <br />Got Superliked</h4>
      </div>
    </div>
  )
  }
}


export default SuperLike
