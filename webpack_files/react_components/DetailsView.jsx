import React from 'react';
import CommentView from'./CommentView.jsx'
import ReactDOM from 'react-dom';

class DetailsView extends React.Component {

    constructor(props) {
        super(props);

        this.joinEvent = this.joinEvent.bind(this);
        this.unJoinEvent = this.unJoinEvent.bind(this);
        this.addComment = this.addComment.bind(this);
    };

    joinEvent(e) {
        this.props.dataHandler.joinEvent(this.props.data.id);
    }

    unJoinEvent(e) {
        this.props.dataHandler.unJoinEvent(this.props.data.id);
    }

    addComment(e) {
        var commentText = ReactDOM.findDOMNode(this.refs.newComment).value;
        this.props.dataHandler.addComment(this.props.data.id, commentText);
        this.refs.newComment.value = "";
    }

    render() {

        if (!this.props.visible) {
            return (<div></div>);
        }

        var isJoined = this.props.dataHandler.isJoined(this.props.data.id);

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
            color: this.props.data.joined >= this.props.data.maxPeople ? 'red' : (this.props.data.joined >= this.props.data.maxPeople/2 ? 'orange' : 'green')
        }
        var textContainerStyle = {
            marginLeft: 10,
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
                        <i onClick={this.props.onCancelClicked} style={{float: 'left', color: 'orange'}} className="fa fa-arrow-left" aria-hidden="true"></i>
                        Join
                        <i onClick={this.joinEvent} style={joinEventBtnStyle} className="fa fa-check" aria-hidden="true"></i>
                        <i onClick={this.unJoinEvent} style={unjoinEventBtnStyle} className="fa fa-times" aria-hidden="true"></i>
                    </h1>
                </div>
                <div style={{height: '60px'}}></div>
                <h2 style={joinedIndicatorStyle}>JOINED</h2>
                <img style={{width: '100%'}} src={this.props.data.img} />
                <div style={textContainerStyle}>
                    <div style={{borderBottom: '1px solid lightgrey'}}>
                        <h2 style={itemHeaderStyle}>{this.props.data.title}</h2>
                        <i className='fa fa-map-marker' aria-hidden='true'></i> {this.props.data.location}<br/>
                        <i className='fa fa-clock-o' aria-hidden='true'></i> {this.props.data.startTime} - {this.props.data.endTime}<br/>
                        <span style={fullnessStyle}><i className='fa fa-user' aria-hidden='true'></i> {this.props.data.joined}/{this.props.data.maxPeople}</span>
                    </div>
                    <div style={{marginTop: 5}}>{this.props.data.description}</div>
                    <br/>
                    <h2 style={itemHeaderStyle}>Comments</h2>
                </div>
                {this.props.data.comments.map((item, i) => <CommentView key = {i} data = {item} />)}
                <div style={{padding: '10px'}}>
                    <textarea rows="3" style={{width: '95%'}} type="text" ref="newComment" ></textarea><br/>
                    <button onClick={this.addComment}>Add comment</button>
                </div>
            </div>
        );
    }
}

export default DetailsView;
