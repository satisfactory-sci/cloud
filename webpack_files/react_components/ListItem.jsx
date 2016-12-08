import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';

require("../stylesheets/ListItem.scss");

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
        this.swipeBG = ReactDOM.findDOMNode(this.refs.swipebackground);
    }

    componentDidUpdate(prevProps, prevState) {
        this.swipeContainer = ReactDOM.findDOMNode(this.refs.swipecontainer);
        this.swipeBG = ReactDOM.findDOMNode(this.refs.swipebackground);
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
            if(xChange > 0){
              var p = parseInt(255 - ((xChange/this.swipeContainer.clientWidth)*255));
              this.swipeBG.style.backgroundColor = 'rgb(' + p + ',255,' + p + ')';
            }else{
              var p = parseInt(255 - ((-xChange/this.swipeContainer.clientWidth)*255));
              this.swipeBG.style.backgroundColor = 'rgb(255,'+ p + ',' + p + ')';
            }
        }
    }

    swipeContainerTouchEnd(e) {
        var touch = e.changedTouches[0];
        var xChange = touch.pageX - this.touchStartX;
        var minSwipe = this.swipeContainer.clientWidth*0.5;

        if (xChange >= minSwipe) {
            this.props.dataHandler.registerLike(this.props.data._id);
        } else if (xChange <= -1*minSwipe) {
            this.props.dataHandler.registerDislike(this.props.data._id);
        }
        this.swipeContainer.style.left = "";
        this.swipeBG.style.background = '';
        this.swipeBG.style.opacity = 1;
    }

    chooseItem(e) {
        this.props.onChooseEvent(this.props.data);
    }

    render() {

        var fullnessStyle = {
            color: this.props.data.joined >= this.props.data.maxPeople ? 'red' : (this.props.data.joined >= this.props.data.maxPeople/2 ? 'orange' : 'green')
        }

        return (
          <Link to={`event/${this.props.data._id}`}>
            <div className="list-item" ref="swipebackground">
                <div ref="swipecontainer" className="list-item-container" onTouchStart={this.swipeContainerTouchStart} onTouchMove={this.swipeContainerTouchMove} onTouchEnd={this.swipeContainerTouchEnd}>
                    <div className="list-item-text">
                        <h2 className="list-item-header">{this.props.data.title}</h2>
                        <i className='fa fa-map-marker list-item-icon' aria-hidden='true' ></i>{this.props.data.location}<br/>
                        <i className='fa fa-clock-o list-item-icon' aria-hidden='true' ></i>{this.props.data.startTime} - {this.props.data.endTime}<br/>
                        <span style={fullnessStyle}><i className='fa fa-user list-item-icon' aria-hidden='true'></i>{this.props.data.joined}/{this.props.data.maxPeople}</span>
                    </div>
                    <div className="list-item-img-container">
                        <img className="list-item-img" src={this.props.data.img} />
                    </div>
                </div>
            </div>
          </Link>
        );
    }
}

export default ListItem;
