import io from 'socket.io-client'

module.exports = {

    dataContainerReactComponent: null,

    listData: [],

    userInfo: {
      userName: "",
      img: "",
      events: [{}]
    },

    socket: {},

    initData() {
        //this.listData = require("./dummyListItems.js");

        //Initiate global socket
        this.socket = io();
        //We request initial data
        this.socket.emit('requestItems');
        //We get the initial data
        this.socket.on('newItems', (data) => {
          this.listData = data;
        });
        this.socket.on('addItem', (data) => {
          this.listData = this.listData.concat(data);
          this.dataContainerReactComponent.forceUpdate();
        })
        //We have a connection (Mainly for debugging reasons)
        this.socket.on('connect', () => {
        })
        //Event listeners if somebody else joins
        this.socket.on('join', (data) => {
          let i = this.listData.findIndex((obj) => { return obj.id == data._id});
          this.listData[i].joined += data.vote;
          this.dataContainerReactComponent.forceUpdate();
        })
        //Event listener if somebody commented some event
        this.socket.on('comment', (comment) => {
          let i = this.listData.findIndex((obj) => { return obj.id == data._id});
          this.listData[i].comments.push(comment.comment);
          this.dataContainerReactComponent.forceUpdate();
        })

    },

    //Start the dataHandler
    start(dataContainerReactComponent) {
        this.dataContainerReactComponent = dataContainerReactComponent;
    },

    //Register star locally and send the information to server
    registerLike(_id, container) {
        //Find the event
        let i = this.userInfo.events.findIndex((obj) => {return obj._id == _id});
        //Have we already made some action to this object
        if(i > -1 ) {
          //Cancel a dump
          if(this.userInfo.events[i].status == 2){
            //Remove older entry
            this.userInfo.events.splice(i, 1);
            //Do the changes
            this.socket.emit('dump', {_id:_id, vote: -1});
          }
        }else{
          //Do the changes
          this.userInfo.events.push({_id: _id, status: 1});
          this.socket.emit('star', {_id:_id, vote:  1})
        }
        //Update components
        this.dataContainerReactComponent.forceUpdate();
    },

    //Register dump locally and send the information to server
    registerDislike(_id) {
        //Find the Event
        let i = this.userInfo.events.findIndex((obj) => {return obj._id == _id});
        //Have we already made some action to this object
        if(i > -1 ) {
          //Cancel a like
          if(this.userInfo.events[i].status == 1){
            //remove the older entry
            this.userInfo.events.splice(i, 1);
            //Do the changes
            this.socket.emit('star', {_id: _id, vote: -1})
          }
        }else{
          //Do the changes
          this.userInfo.events.push({_id: _id, status: 2});
          this.socket.emit('dump', {_id:_id, vote: 1});
        }
        //update component
        this.dataContainerReactComponent.forceUpdate();
    },

    addNewEvent(createdEventData) {
        var d = new Date();
        createdEventData._id = d.getTime();
        this.listData.push(createdEventData);
    },

    isJoined(_id) {
        return this.userInfo.events.findIndex((obj) => {return obj._id == _id && obj.status == 3}) >= 0;
    },

    joinEvent(_id, container) {
        if (!this.isJoined(_id)) {
            var item = this.listData.find((entry) => { return entry._id == _id});
            item.joined += 1;
            //Do the changes
            this.userInfo.events.push({_id:_id, status:3});
            this.socket.emit('join', {_id:_id, vote: 1})
            //Update components
            container.forceUpdate();
        }
    },

    unJoinEvent(_id, container) {
        if (this.isJoined(_id)) {
            var item = this.listData.find((entry) => { return entry._id == _id});
            item.joined -= 1;
            var index = this.userInfo.events.findIndex((obj) => {return obj._id == _id});
            this.userInfo.events.splice(index, 1);
            //Inform backend
            this.socket.emit('join', {_id:_id, vote: -1});
            container.forceUpdate();
        }
    },

    addComment(_id, commentText, container) {
        var d = new Date();
        var comment = {
            user: this.userInfo.userName,
            time: "" + d.getHours() + ":" + d.getMinutes(),
            date: "" + d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate(),
            text: commentText,
            img: this.userInfo.img,
        };
        var item = this.listData.find((entry) => { return entry._id == _id});
        item.comments.unshift(comment);
        //Inform backend
        this.socket.emit('comment', {_id:_id, comment: comment});
        container.forceUpdate();
    }
}
