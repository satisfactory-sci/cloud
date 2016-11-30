import io from 'socket.io-client'

module.exports = {

    listData: [],

    userInfo: {},

    socket: {},

    initData() {
        this.listData = require("./dummyListItems.js");
        this.userInfo = {
            userName: "Sanni69",
            img: "/images/sanni.jpg",
            events: [{}]
        }
        this.socket = io();
        this.socket.emit('requestItems');
        this.socket.on('newItems', (data) => {
          console.log(data);
        });
        this.socket.on('connect', () => {
          console.log("Socket connected!")
        })
        this.socket.on('join', (data) => {
          console.log("Somebody else joined some event")
        })
        this.socket.on('comment', (comment) => {
          console.log("Somebody commented something");
        })
    },

    start(dataContainerReactComponent) {
        this.dataContainerReactComponent = dataContainerReactComponent;
    },

    registerLike(id) {
        let i = this.userInfo.events.findIndex((obj) => {return obj.id == id});
        if(i > -1 ) {
          if(this.userInfo.events[i].status != 3){
            this.userInfo.events.splice(i, 1);
            this.userInfo.events.push({id: id, status: 1});
            this.socket.emit('star', {id:id, userId: '0'})
          }
        }else{
          this.userInfo.events.push({id: id, status: 1});
          this.socket.emit('star', {id:id, userId: '0'})
        }
        this.dataContainerReactComponent.forceUpdate();
    },

    registerDislike(id) {
        let i = this.userInfo.events.findIndex((obj) => {return obj.id == id});
        if(i > -1 ) {
          if(this.userInfo.events[i].status != 3){
            this.userInfo.events.splice(i, 1);
            this.userInfo.events.push({id: id, status: 2});
            this.socket.emit('dump', {id:id, userId: '0'});
          }
        }else{
          this.userInfo.events.push({id: id, status: 2});
          this.socket.emit('dump', {id:id, userId: '0'});
        }
        this.dataContainerReactComponent.forceUpdate();
    },

    addNewEvent(createdEventData) {
        var d = new Date();
        createdEventData.id = d.getTime();
        this.listData.push(createdEventData);
        this.dataContainerReactComponent.forceUpdate();
    },

    isJoined(id) {
        return this.userInfo.events.findIndex((obj) => {return obj.id == id && obj.status == 3}) >= 0;
    },

    joinEvent(id) {
        if (!this.isJoined(id)) {
            var item = this.listData.find((entry) => { return entry.id == id});
            item.joined += 1;
            this.userInfo.events.push({id:id, status:3});
            this.socket.emit('join', {id:id, userId: '0'})
            this.dataContainerReactComponent.forceUpdate();
        }
    },

    unJoinEvent(id) {
        if (this.isJoined(id)) {
            var item = this.listData.find((entry) => { return entry.id == id});
            item.joined -= 1;
            var index = this.userInfo.events.findIndex((obj) => {return obj.id == id});
            this.userInfo.events.splice(index, 1);
            this.socket.emit('cancel', {id:id, userId: '0'});
            this.dataContainerReactComponent.forceUpdate();
        }
    },

    addComment(id, commentText) {
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
        this.socket.emit('comment', {id:id, comment: comment});
        this.dataContainerReactComponent.forceUpdate();
    }
}
