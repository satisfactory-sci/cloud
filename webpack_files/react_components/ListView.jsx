import React from 'react';
import {Link} from 'react-router';
import ListItem from'./ListItem.jsx';

require("../stylesheets/ListView.scss");


class ListView extends React.Component {

    render() {

        if (!this.props.visible) {
            return (<div ></div>);
        }

        let user = this.props.dataHandler.userInfo;
        let events = this.props.dataHandler.listData;

        //Sorting to different categories
        let joined = events.filter((obj) => {
          let i = user.events.findIndex((e) => {return e._id == obj._id && e.status == 3 });
          if(i > -1){
            return true;
          }
          return false;
        })
        let dumped = events.filter((obj) => {
          let i = user.events.findIndex((e) => {return e._id == obj._id && e.status == 2 });
          if(i > -1){
            return true;
          }
          return false;
        })
        let starred = events.filter((obj) => {
          let i = user.events.findIndex((e) => {return e._id == obj._id && e.status == 1 });
          if(i > -1){
            return true;
          }
          return false;
        })
        let others = events.filter((obj) => {
          let i = user.events.findIndex((e) => {return e._id == obj._id});
          if(i == -1){
            return true;
          }
          return false;
        })

        //Make elements for categories as needed.
        let joinElement;
        let dumpElement;
        let starElement;

        if(joined.length > 0) {
          joinElement = <div><div className="list-category">Joined</div>{joined.map((item, i) => <ListItem key = {i} data = {item} dataHandler={this.props.dataHandler} />)}</div>;
        }else{
          joinElement = undefined
        }
        if(dumped.length > 0) {
          dumpElement = <div><div className="list-category">Dumped</div>{dumped.map((item, i) => <ListItem key = {i} data = {item} dataHandler={this.props.dataHandler} />)}</div>;
        }else{
          dumpElement = undefined
        }
        if(starred.length > 0) {
          starElement = <div><div className="list-category">Starred</div>{starred.map((item, i) => <ListItem key = {i} data = {item} dataHandler={this.props.dataHandler} />)}</div>;
        }else{
          starElement = undefined
        }
        let fadeIn = this.props.first ? "fade-in" : "";

        return (
            <div className={fadeIn} id="list">
                <div id="list-header">
                    <h1 id="list-header-container">
                        <i id="list-header-search" className="fa fa-search" aria-hidden="true"></i>
                        Find
                        <Link to="/add"><i id="list-header-add" className="fa fa-plus" aria-hidden="true"></i></Link>
                    </h1>
                </div>
                <div id="list-padding"></div>
                <div>
                {joinElement}
                {starElement}
                <div>
                  <div className="list-category">Find New</div>
                  {others.map((item, i) => <ListItem key = {i} data = {item} dataHandler={this.props.dataHandler} onChooseEvent={this.props.onChooseEvent} />)}
                </div>
                {dumpElement}
                </div>
            </div>
        );
    }
}

export default ListView;
