import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory} from 'react-router';


class AddView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
          dataHandler: window.dataHandler,
        }

        this.addEvent = this.addEvent.bind(this);
        this.validateFormData = this.validateFormData.bind(this);
        this.postEvent = this.postEvent.bind(this);
        this.fileChanged = this.fileChanged.bind(this);
    };

    addEvent(e) {
        var rawDate = new Date();
        if (ReactDOM.findDOMNode(this.refs.date).value == "tomorrow") {
            rawDate.setDate(rawDate.getDate() + 1);
        }
        var formData = {
            title: ReactDOM.findDOMNode(this.refs.title).value,
            description: ReactDOM.findDOMNode(this.refs.description).value,
            location: ReactDOM.findDOMNode(this.refs.location).value,
            startTime: ReactDOM.findDOMNode(this.refs.startTime).value,
            endTime: ReactDOM.findDOMNode(this.refs.endTime).value,
            date: rawDate.toISOString().substring(0, 10),
            maxPeople: parseInt(ReactDOM.findDOMNode(this.refs.maxPeople).value)
        };
        var imgFile = ReactDOM.findDOMNode(this.refs.img).files[0];
        if(this.validateFormData(formData, imgFile)) {
            this.postEvent(formData, imgFile);
        }
    }

    validateFormData(formData, imgFile) {
        var isValid = true;

        if (!imgFile || (imgFile.type != 'image/png' && imgFile.type != 'image/jpeg' && imgFile.type != 'image/gif')) {
            isValid = false;
            ReactDOM.findDOMNode(this.refs.imgInputContainer).style.color = "red";
        } else {
            ReactDOM.findDOMNode(this.refs.imgInputContainer).style.color = "";
        }

        if (formData.title.length > 0) {
            ReactDOM.findDOMNode(this.refs.title).className = "add-view-input title";
        } else {
            isValid = false;
            ReactDOM.findDOMNode(this.refs.title).className += " invalid";
        }

        if (formData.description.length > 0) {
            ReactDOM.findDOMNode(this.refs.description).className = "add-view-input";
        } else {
            isValid = false;
            ReactDOM.findDOMNode(this.refs.description).className += " invalid";
        }

        if (formData.location.length > 0) {
            ReactDOM.findDOMNode(this.refs.location).className = "add-view-input";
        } else {
            isValid = false;
            ReactDOM.findDOMNode(this.refs.location).className += " invalid";
        }

        if (formData.startTime.length > 0) {
            var splitted = formData.startTime.split(":");
            if (splitted.length == 2) {
                var hour = parseInt(splitted[0]);
                var min = parseInt(splitted[1]);
                if (!isNaN(hour) && !isNaN(min) && hour >= 0 && hour <= 23 && min >= 0 && min <= 59) {
                    ReactDOM.findDOMNode(this.refs.startTime).className = "add-view-input";
                } else {
                    isValid = false;
                    ReactDOM.findDOMNode(this.refs.startTime).className += " invalid";
                }

            } else {
                isValid = false;
                ReactDOM.findDOMNode(this.refs.startTime).className += " invalid";
            }
        } else {
            isValid = false;
            ReactDOM.findDOMNode(this.refs.startTime).className += " invalid";
        }

        if (formData.endTime.length > 0) {
            var splitted = formData.endTime.split(":");
            if (splitted.length == 2) {
                var hour = parseInt(splitted[0]);
                var min = parseInt(splitted[1]);
                if (!isNaN(hour) && !isNaN(min) && hour >= 0 && hour <= 23 && min >= 0 && min <= 59) {
                    ReactDOM.findDOMNode(this.refs.endTime).className = "add-view-input";
                } else {
                    isValid = false;
                    ReactDOM.findDOMNode(this.refs.endTime).className += " invalid";
                }

            } else {
                isValid = false;
                ReactDOM.findDOMNode(this.refs.endTime).className += " invalid";
            }
        } else {
            isValid = false;
            ReactDOM.findDOMNode(this.refs.endTime).className += " invalid";
        }

        if (isNaN(formData.maxPeople)) {
            isValid = false;
            ReactDOM.findDOMNode(this.refs.maxPeople).className += " invalid";
        } else {
            ReactDOM.findDOMNode(this.refs.maxPeople).className = "add-view-input";
        }

        return isValid;
    }

    postEvent(formData, imgFile) {
        var saveIndicator = ReactDOM.findDOMNode(this.refs.saveIndicator)
        saveIndicator.style.display = "block";

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/newevent");

        var postData = new FormData();
        for(var key in formData){
            postData.append(key, formData[key]);
        }
        postData.append('file', imgFile);

        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4){
                if(xhr.status === 204){
                    saveIndicator.style.display = "none";
                    browserHistory.goBack();
                } else {
                    alert("An error occurred. Please try again later.");
                }
            }
        };
        xhr.send(postData);
    }

    moveBack() {
      browserHistory.goBack();
    }

    fileChanged(e) {
        var file = ReactDOM.findDOMNode(this.refs.img).files[0];
        var imgNameContainer = ReactDOM.findDOMNode(this.refs.imgFileName)
        imgNameContainer.textContent = file.name;
        if (file.type != 'image/png' && file.type != 'image/jpeg' && file.type != 'image/gif') {
            imgNameContainer.style.color = "red";
        } else {
            imgNameContainer.style.color = "";
        }

    }

    render() {

        var addFileStyle = {
            fontSize: parseInt(window.innerWidth*0.7),
            margin: 'auto',
            width: parseInt(window.innerWidth*0.8)
        }

        return (
            <div style={{color: 'lightgrey'}}>
                <div ref="saveIndicator" className="saving-data-indicator"><h1>Saving ..</h1></div>
                <div className='header'>
                    <h1 style={{margin: 10}}>
                      <i onClick={this.moveBack} style={{float: 'left', color: 'orange'}} className="fa fa-arrow-left" aria-hidden="true"></i>
                        Add
                      <i onClick={this.addEvent} style={{float: 'right', color: 'green'}} className="fa fa-check" aria-hidden="true"></i>
                    </h1>
                </div>
                <div style={{height: '60px'}}></div>
                <label>
                    <div ref="imgFileName" className="add-view-img-file-name"></div>
                    <div style={addFileStyle} ref='imgInputContainer'><i className='fa fa-camera' aria-hidden='true' ></i></div>
                    <input onChange={this.fileChanged} type="file" ref="img" style={{display: 'none'}} />
                </label>
                <div>
                    <div className="add-view-text-container">
                        <div className="add-view-input-row"><input className="add-view-input title" type="text" ref="title" placeholder="Title" maxLength="22" /></div>
                        <div className="add-view-input-row"><i className='fa fa-map-marker' aria-hidden='true' style={{flex: '0 0 18px'}}></i><input className="add-view-input" placeholder="Location" type="text" ref="location" maxLength="30" /></div>
                        <div className="add-view-input-row">
                            <i className='fa fa-clock-o' aria-hidden='true' style={{flex: '0 0 18px'}}></i>
                            <input className="add-view-date-select" placeholder="Starts (hh:mm)" type="text" ref="startTime" maxLength="5" /> - 
                            <input className="add-view-date-select" placeholder="Ends (hh:mm)" type="text" ref="endTime" maxLength="5" />                            
                        </div>
                        <div className="add-view-input-row">
                            <select ref='date' className="add-view-input">
                                <option value="today">Today</option>
                                <option value="tomorrow">Tomorrow</option>
                            </select>
                        </div>
                        <div className="add-view-input-row"><i className='fa fa-user' aria-hidden='true' style={{flex: '0 0 18px'}}></i><input className="add-view-input" placeholder="Max participants" type="text" ref="maxPeople" /></div>
                    </div>
                    <div style={{marginTop: 5, paddingLeft: 10, display: 'flex'}}><textarea rows="4" className="add-view-input" type="text" ref="description" placeholder="A nice description about your very own event :)" ></textarea></div>
                </div>
            </div>
        );
    }
}

export default AddView;
