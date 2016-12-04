import React from 'react';
import ReactDOM from 'react-dom';
import {Link, browserHistory} from 'react-router';


class AddView extends React.Component {

    constructor(props) {
        super(props);

        this.addEvent = this.addEvent.bind(this);
        this.state = {
          dataHandler: window.dataHandler,
        }
    };

    addEvent(e) {
        var createdEventData = {
            title: ReactDOM.findDOMNode(this.refs.title).value,
            description: ReactDOM.findDOMNode(this.refs.description).value,
            img: ReactDOM.findDOMNode(this.refs.img).value,
            location: ReactDOM.findDOMNode(this.refs.location).value,
            startTime: ReactDOM.findDOMNode(this.refs.startTime).value,
            endTime: ReactDOM.findDOMNode(this.refs.endTime).value,
            date: ReactDOM.findDOMNode(this.refs.date).value,
            maxPeople: parseInt(ReactDOM.findDOMNode(this.refs.maxPeople).value),
            joined: 0,
            comments: []
        };
        this.state.dataHandler.addNewEvent(createdEventData);
        browserHistory.goBack();
    }

    render() {
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
        var formStyle = {
            marginLeft: 10,
        }
        var inputStyle = {
            width: '90%',
            minHeight: 20
        }
        var inputHeaderStyle = {
            marginTop: '5px',
            marginBottom: '5px',
        }

        return (
            <div>
                <div style={headerStyle}>
                    <h1 style={{margin: 10}}>
                      <Link to="/"><i style={{float: 'left', color: 'orange'}} className="fa fa-arrow-left" aria-hidden="true"></i></Link>
                        Add
                      <i onClick={this.addEvent} style={{float: 'right', color: 'green'}} className="fa fa-check" aria-hidden="true"></i>
                    </h1>
                </div>
                <div style={{height: '60px'}}></div>
                <div style={formStyle}>
                    <h3 style={inputHeaderStyle}>Title:</h3>
                    <input style={inputStyle} type="text" ref="title" maxLength="22" /><br/>
                    <h3 style={inputHeaderStyle}>Description:</h3>
                    <textarea rows="4" style={inputStyle} type="text" ref="description" ></textarea><br/>
                    <h3 style={inputHeaderStyle}>Image url:</h3>
                    <input style={inputStyle} type="text" ref="img" /><br/>
                    <h3 style={inputHeaderStyle}>Location:</h3>
                    <input style={inputStyle} type="text" ref="location" maxLength="30" /><br/>
                    <h3 style={inputHeaderStyle}>Starting time:</h3>
                    <input style={inputStyle} type="text" ref="startTime" maxLength="5" /><br/>
                    <h3 style={inputHeaderStyle}>Ending time:</h3>
                    <input style={inputStyle} type="text" ref="endTime" maxLength="5" /><br/>
                    <h3 style={inputHeaderStyle}>Date:</h3>
                    <input style={inputStyle} type="text" ref="date" maxLength="15" /><br/>
                    <h3 style={inputHeaderStyle}>Maximum number of participants:</h3>
                    <input style={inputStyle} type="text" ref="maxPeople" /><br/>
                </div>
            </div>
        );
    }
}

export default AddView;
