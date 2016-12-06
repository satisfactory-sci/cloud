import io from 'socket.io-client'

module.exports = {

    listData: [],

    userInfo: {
      userName: "",
      img: "",
      events: [{}]
    },

    socket: {},

    initData() {
        this.listData = require("./dummyListItems.js");

        //Initiate global socket
        this.socket = io();
        //We request initial data
        this.socket.emit('requestItems');
        //We get the initial data
        this.socket.on('newItems', (data) => {
        });
        //We have a connection (Mainly for debugging reasons)
        this.socket.on('connect', () => {
          console.log("Socket connected!")
        })
        //Event listeners if somebody else joins
        this.socket.on('join', (data) => {
          console.log("Somebody else joined some event")
        })
        //Event listener if somebody commented some event
        this.socket.on('comment', (comment) => {
          console.log("Somebody commented something");
        })
    },

    //Start the dataHandler
    start(dataContainerReactComponent) {
        this.dataContainerReactComponent = dataContainerReactComponent;
    },

    //Register star locally and send the information to server
    registerLike(id, container) {
        //Find the event
        let i = this.userInfo.events.findIndex((obj) => {return obj.id == id});
        //Have we already made some action to this object
        if(i > -1 ) {
          //We cannot star joined events so...
          if(this.userInfo.events[i].status != 3){
            //Remove older entry
            this.userInfo.events.splice(i, 1);
            //Do the changes
            this.userInfo.events.push({id: id, status: 1});
            this.socket.emit('star', {id:id, userId: '0'})
          }
        }else{
          //Do the changes
          this.userInfo.events.push({id: id, status: 1});
          this.socket.emit('star', {id:id, userId: '0'})
        }
        //Update components
        this.dataContainerReactComponent.forceUpdate();
    },

    //Register dump locally and send the information to server
    registerDislike(id) {
        //Find the Event
        let i = this.userInfo.events.findIndex((obj) => {return obj.id == id});
        //Have we already made some action to this object
        if(i > -1 ) {
          //We cannot dump joined events so...
          if(this.userInfo.events[i].status != 3){
            //remove the older entry
            this.userInfo.events.splice(i, 1);
            //Do the changes
            this.userInfo.events.push({id: id, status: 2});
            this.socket.emit('dump', {id:id, userId: '0'});
          }
        }else{
          //Do the changes
          this.userInfo.events.push({id: id, status: 2});
          this.socket.emit('dump', {id:id, userId: '0'});
        }
        //update component
        this.dataContainerReactComponent.forceUpdate();
    },

    addNewEvent(createdEventData) {
        var d = new Date();
        createdEventData.id = d.getTime();
        this.listData.push(createdEventData);
    },

    isJoined(id) {
        return this.userInfo.events.findIndex((obj) => {return obj.id == id && obj.status == 3}) >= 0;
    },

    joinEvent(id, container) {
        if (!this.isJoined(id)) {
            var item = this.listData.find((entry) => { return entry.id == id});
            item.joined += 1;
            //Do the changes
            this.userInfo.events.push({id:id, status:3});
            this.socket.emit('join', {id:id, userId: '0'})
            //Update components
            container.forceUpdate();
        }
    },

    unJoinEvent(id, container) {
        if (this.isJoined(id)) {
            var item = this.listData.find((entry) => { return entry.id == id});
            item.joined -= 1;
            var index = this.userInfo.events.findIndex((obj) => {return obj.id == id});
            this.userInfo.events.splice(index, 1);
            //Inform backend
            this.socket.emit('cancel', {id:id, userId: '0'});
            container.forceUpdate();
        }
    },

    addComment(id, commentText, container) {
        var d = new Date();
        var comment = {
            user: this.userInfo.userName,
            time: "" + d.getHours() + ":" + d.getMinutes(),
            date: "" + d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate(),
            text: commentText,
            img: this.userInfo.img,
        };
        var item = this.listData.find((entry) => { return entry.id == id});
        item.comments.unshift(comment);
        //Inform backend
        this.socket.emit('comment', {id:id, comment: comment});
        container.forceUpdate();
    }
}
