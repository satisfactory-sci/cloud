import React from 'react';
import ListItem from'./ListItem.jsx'

class ListView extends React.Component {

    render() {

        if (!this.props.visible) {
            return (<div></div>);
        }

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

        let user = this.props.dataHandler.userInfo;
        let events = this.props.dataHandler.listData;
        let categoryStyle = {
            width: '100%',
            textAlign: 'center',
            paddingTop: '6px',
            paddingBottom: '6px',
            color: 'orange',
            fontWeight: 'bold',
            fontSize: '1.1em',
            borderBottom: '1px solid lightgrey',
        };


        //Sorting to different categories
        let joined = events.filter((obj) => {
          let i = user.events.findIndex((e) => {return e.id == obj.id && e.status == 3 });
          if(i > -1){
            return true;
          }
          return false;
        })

        let joinElement;
        if(joined.length > 0) {
          joinElement = <div><div style={categoryStyle}>Joined</div>{joined.map((item, i) => <ListItem key = {i} data = {item} dataHandler={this.props.dataHandler} onChooseEvent={this.props.onChooseEvent} />)}</div>;
        }else{
          joinElement = undefined
        }


        let dumped = events.filter((obj) => {
          let i = user.events.findIndex((e) => {return e.id == obj.id && e.status == 2 });
          if(i > -1){
            return true;
          }
          return false;
        })

        let dumpElement;
        if(dumped.length > 0) {
          dumpElement = <div><div style={categoryStyle}>Dumped</div>{dumped.map((item, i) => <ListItem key = {i} data = {item} dataHandler={this.props.dataHandler} onChooseEvent={this.props.onChooseEvent} />)}</div>;
        }else{
          dumpElement = undefined
        }

        let starred = events.filter((obj) => {
          let i = user.events.findIndex((e) => {return e.id == obj.id && e.status == 1 });
          if(i > -1){
            return true;
          }
          return false;
        })
        let starElement;
        if(starred.length > 0) {
          starElement = <div><div style={categoryStyle}>Starred</div>{starred.map((item, i) => <ListItem key = {i} data = {item} dataHandler={this.props.dataHandler} onChooseEvent={this.props.onChooseEvent} />)}</div>;
        }else{
          starElement = undefined
        }

        let others = events.filter((obj) => {
          let i = user.events.findIndex((e) => {return e.id == obj.id});
          if(i == -1){
            return true;
          }
          return false;
        })

        return (
            <div>
                <div style={headerStyle}>
                    <h1 style={{margin: 10}}>
                        <i style={{float: 'left'}} className="fa fa-search" aria-hidden="true"></i>
                        Find
                        <span onClick={this.props.onClickAddButton}><i style={{float: 'right', marginTop: '4px'}} className="fa fa-plus" aria-hidden="true"></i></span>
                    </h1>
                </div>
                <div style={{height: '60px'}}></div>
                <div>
                {joinElement}
                {starElement}
                <div>
                  <div style={categoryStyle}>Find New</div>
                  {others.map((item, i) => <ListItem key = {i} data = {item} dataHandler={this.props.dataHandler} onChooseEvent={this.props.onChooseEvent} />)}
                </div>
                {dumpElement}
                </div>
            </div>
        );
    }
}

export default ListView;
