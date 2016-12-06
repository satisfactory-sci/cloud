import React from 'react';
import {Link, browserHistory} from 'react-router'
import CommentView from'./CommentView.jsx'
import ReactDOM from 'react-dom';

class DetailsView extends React.Component {

    constructor(props) {
        super(props);

        this.joinEvent = this.joinEvent.bind(this);
        this.unJoinEvent = this.unJoinEvent.bind(this);
        this.addComment = this.addComment.bind(this);

        let event = window.dataHandler.listData.find((obj) => {
            return obj.id == this.props.params.id;
        })
        window.scrollTo(0,0);
        this.state = {
          dataHandler: window.dataHandler,
          data: event
        }

    };

    joinEvent(e) {
        this.state.dataHandler.joinEvent(this.state.data.id, this);
    }

    unJoinEvent(e) {
        this.state.dataHandler.unJoinEvent(this.state.data.id, this);
    }

    addComment(e) {
        var commentText = ReactDOM.findDOMNode(this.refs.newComment).value;
        if (commentText.length > 0) {
            this.state.dataHandler.addComment(this.state.data.id, commentText, this);
            this.refs.newComment.value = "";
        }            
    }

    moveBack() {
      browserHistory.goBack();
    }

    render() {

        var isJoined = this.state.dataHandler.isJoined(this.state.data.id);

        var headerStyle = {
            width: '100%',
            color: 'orange',
            textAlign: 'center',
            borderBottom: '1px solid lightgrey',
            position: 'fixed',
            opacity: '1',
            backgroundColor: 'white',
            zIndex: '10',
        }

        var itemHeaderStyle = {
            marginTop: '5px',
            marginBottom: '5px',
        }
        var fullnessStyle = {
            color: this.state.data.joined >= this.state.data.maxPeople ? 'red' : (this.state.data.joined >= this.state.data.maxPeople/2 ? 'orange' : 'green')
        }
        var textContainerStyle = {
            borderBottom: '1px solid lightgrey',
            fontSize: '1.1em'
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
                <div style={headerStyle}>
                    <h1 style={{margin: 10}}>
                        <i onClick={this.moveBack} style={{float: 'left', color: 'orange'}} className="fa fa-arrow-left" aria-hidden="true"></i>
                        Join
                        <i onClick={this.joinEvent} style={joinEventBtnStyle} className="fa fa-check" aria-hidden="true"></i>
                        <i onClick={this.unJoinEvent} style={unjoinEventBtnStyle} className="fa fa-times" aria-hidden="true"></i>
                    </h1>
                </div>
                <div style={{height: '60px'}}></div>
                <h2 style={joinedIndicatorStyle}>JOINED</h2>
                <img style={{width: '100%'}} src={this.state.data.img} />
                <div style={textContainerStyle}>
                    <div style={{borderBottom: '1px solid lightgrey', paddingLeft: 10}}>
                        <h2 style={itemHeaderStyle}>{this.state.data.title}</h2>
                        <i className='fa fa-map-marker' aria-hidden='true' style={{width:'18px'}}></i> {this.state.data.location}<br/>
                        <i className='fa fa-clock-o' aria-hidden='true' style={{width:'18px'}}></i> {this.state.data.startTime} - {this.state.data.endTime}<br/>
                        <span style={fullnessStyle}><i className='fa fa-user' aria-hidden='true' style={{width:'18px'}}></i> {this.state.data.joined}/{this.state.data.maxPeople}</span>
                    </div>
                    <div style={{marginTop: 5, paddingLeft: 10}}>{this.state.data.description}</div>
                    <br/>
                    <h2 style={{marginTop: 5, marginLeft: 10, marginBottom: 5}}>Comments</h2>
                </div>
                <div ref="addCommentBox" style={{padding: '10px', display: 'flex', flexDirection: 'row'}}>
                    <textarea placeholder="Write down your comment" rows="3" style={{padding: 5, flex: 1, border: 0}} type="text" ref="newComment" ></textarea>
                    <i onClick={this.addComment} className='fa fa-paper-plane' aria-hidden='true' style={{marginLeft: 5, marginTop: 20, fontSize: 25, color: 'blue', flex:'0 0 25px'}}></i>
                </div>
                {this.state.data.comments.map((item, i) => <CommentView key = {i} data = {item} />)}
            </div>
        );
    }
}

export default DetailsView;
