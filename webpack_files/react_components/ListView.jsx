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
                {this.props.dataHandler.listData.map((item, i) => <ListItem key = {i} data = {item} dataHandler={this.props.dataHandler} onChooseEvent={this.props.onChooseEvent} />)}
                </div>
            </div>
        );
    }
}

export default ListView;
