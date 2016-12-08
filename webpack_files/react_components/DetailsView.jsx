import React from 'react';
import {Link, browserHistory} from 'react-router'
import CommentView from'./CommentView.jsx'
import ReactDOM from 'react-dom';

require("../stylesheets/DetailsView.scss");

class DetailsView extends React.Component {

    constructor(props) {
        super(props);

        this.joinEvent = this.joinEvent.bind(this);
        this.unJoinEvent = this.unJoinEvent.bind(this);
        this.addComment = this.addComment.bind(this);

        let event = window.dataHandler.listData.find((obj) => {
            return obj._id == this.props.params._id;
        })
        window.scrollTo(0,0);
        this.state = {
          dataHandler: window.dataHandler,
          data: event
        }

    };

    joinEvent(e) {
        this.state.dataHandler.joinEvent(this.state.data._id, this);
    }

    unJoinEvent(e) {
        this.state.dataHandler.unJoinEvent(this.state.data._id, this);
    }

    addComment(e) {
        var commentText = ReactDOM.findDOMNode(this.refs.newComment).value;
        if (commentText.length > 0) {
            this.state.dataHandler.addComment(this.state.data._id, commentText, this);
            this.refs.newComment.value = "";
        }
    }

    moveBack() {
      browserHistory.goBack();
    }

    render() {

        var isJoined = this.state.dataHandler.isJoined(this.state.data._id);
        var fullnessStyle = {
            color: this.state.data.joined >= this.state.data.maxPeople ? 'red' : (this.state.data.joined >= this.state.data.maxPeople/2 ? 'orange' : 'green')
        }
        var joinEventBtnStyle = {
            float: 'right',
            color: 'green',
            display: isJoined ? 'none' : ''
        }
        var unjoinEventBtnStyle = {
            float: 'right',
            color: 'red',
            display: isJoined ? '' : 'none'
        }
        var joinedIndicatorStyle = {
            color: 'green',
            display: isJoined ? '' : 'none',
            border: '4px solid green',
            position: 'absolute',
            top: 70,
            right: 20,
            padding: 7,
            transform: 'rotate(20deg)'

        }

        return (
            <div>
                <div id="detail-header">
                    <h1 id="detail-header-container">
                        <i onClick={this.moveBack} id="detail-header-back" className="fa fa-arrow-left" aria-hidden="true"></i>
                        Join
                        <i onClick={this.joinEvent} style={joinEventBtnStyle} className="fa fa-check" aria-hidden="true"></i>
                        <i onClick={this.unJoinEvent} style={unjoinEventBtnStyle} className="fa fa-times" aria-hidden="true"></i>
                    </h1>
                </div>
                <div id="list-padding"></div>
                <h2 style={joinedIndicatorStyle}>JOINED</h2>
                <img id="detail-img" src={this.state.data.img} />
                <div id="detail-container">
                    <div id="detail-meta-container">
                        <h2 id="detail-description-header">{this.state.data.title}</h2>
                        <i className='fa fa-map-marker detail-icon' aria-hidden='true' ></i> {this.state.data.location}<br/>
                        <i className='fa fa-clock-o detail-icon' aria-hidden='true'></i> {this.state.data.startTime} - {this.state.data.endTime}<br/>
                        <span style={fullnessStyle}><i className='fa fa-user detail-icon' aria-hidden='true'></i> {this.state.data.joined}/{this.state.data.maxPeople}</span>
                    </div>
                    <div id="detail-description">{this.state.data.description}</div>
                    <br/>
                    <h2 id="detail-comment">Comments</h2>
                </div>
                <div ref="addCommentBox" id="detail-comment-container">
                    <textarea id="detail-comment-input" placeholder="Write down your comment" rows="3" type="text" ref="newComment" ></textarea>
                    <i onClick={this.addComment} className='fa fa-paper-plane detail-comment-submit' aria-hidden='true' ></i>
                </div>
                {this.state.data.comments.map((item, i) => <CommentView key = {i} data = {item} />)}
            </div>
        );
    }
}

export default DetailsView;
