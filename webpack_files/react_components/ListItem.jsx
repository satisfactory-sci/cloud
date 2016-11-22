import React from 'react';
import ReactDOM from 'react-dom';

class ListItem extends React.Component {

    constructor(props) {
        super(props);
        
        this.swipeContainerTouchStart = this.swipeContainerTouchStart.bind(this);
        this.swipeContainerTouchMove = this.swipeContainerTouchMove.bind(this);
        this.swipeContainerTouchEnd = this.swipeContainerTouchEnd.bind(this);
        this.chooseItem = this.chooseItem.bind(this);
    };

    componentDidMount() {
        this.swipeContainer = ReactDOM.findDOMNode(this.refs.swipecontainer);
    }

    componentDidUpdate(prevProps, prevState) {
        this.swipeContainer = ReactDOM.findDOMNode(this.refs.swipecontainer);
    }

    swipeContainerTouchStart(e) {
        var touch = e.targetTouches[0];
        this.touchStartX = touch.pageX;
    }

    swipeContainerTouchMove(e) {
        var touch = e.targetTouches[0];
        var xChange = touch.pageX - this.touchStartX;
        var minSwipe = this.swipeContainer.clientWidth*0.2;
        if (xChange >= minSwipe || xChange <= -1*minSwipe) {
            this.swipeContainer.style.left = xChange + 'px';
        }
    }

    swipeContainerTouchEnd(e) {
        var touch = e.changedTouches[0];
        var xChange = touch.pageX - this.touchStartX;
        var minSwipe = this.swipeContainer.clientWidth*0.5;

        if (xChange >= minSwipe) {
            this.props.dataHandler.registerLike(this.props.data.id);
        } else if (xChange <= -1*minSwipe) {
            this.props.dataHandler.registerDislike(this.props.data.id);
        } 
        this.swipeContainer.style.left = "";
    }

    chooseItem(e) {
        this.props.onChooseEvent(this.props.data);
    }

    render() {

        var itemStyle = {
            width: '100%',
            height: '125px',
            borderBottom: '1px solid lightgrey',
        }
        var swipeContainerStyle = {
            position: 'absolute',
            width: '100%',
            height: '125px',
        }
        var textContainerStyle = {
            fontSize: '1.1em',
            marginLeft: '10px',
        }
        var itemHeaderStyle = {
            marginTop: '5px',
            marginBottom: '5px',
        }
        var imgContainerStyle = {
            position: 'absolute',
            right: 0,
            top: 0
        }
        var imgStyle = {
            width: '125px',
            height: '125px',
        }
        var fullnessStyle = {
            color: this.props.data.joined >= this.props.data.maxPeople ? 'red' : (this.props.data.joined >= this.props.data.maxPeople/2 ? 'orange' : 'green')
        }
        return (
            <div onClick={this.chooseItem} style={itemStyle}>
                <div ref="swipecontainer" style={swipeContainerStyle} onTouchStart={this.swipeContainerTouchStart} onTouchMove={this.swipeContainerTouchMove} onTouchEnd={this.swipeContainerTouchEnd}>
                    <div style={textContainerStyle}>
                        <h2 style={itemHeaderStyle}>{this.props.data.title}</h2>
                        <i className='fa fa-map-marker' aria-hidden='true'></i> {this.props.data.location}<br/>
                        <i className='fa fa-clock-o' aria-hidden='true'></i> {this.props.data.startTime} - {this.props.data.endTime}<br/>
                        <span style={fullnessStyle}><i className='fa fa-user' aria-hidden='true'></i> {this.props.data.joined}/{this.props.data.maxPeople}</span>
                    </div>
                    <div style={imgContainerStyle}>
                        <img style={imgStyle} src={this.props.data.img} />
                    </div>

                </div>
            </div>
        );
    }
}

export default ListItem;