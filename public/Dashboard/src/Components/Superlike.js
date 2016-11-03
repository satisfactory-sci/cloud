import React from 'react'
import ReactDOM from 'react-dom'

class SuperLike extends React.Component {
  render() {
    return (
    <div id="toast">
      <div className="card card-block" id="card">
        <img className="card-img-top img-thumbnail" id="toast-img" src={this.props.img} alt="Card image cap"></img>
          <h4 className="card-title" id="toast-title">{this.props.title} <br />Got MegaLiked <br /> Mega Count: {this.props.count}</h4>
      </div>
    </div>
  )
  }
}

export default SuperLike
