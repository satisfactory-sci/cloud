module.exports = {

    listData: [],

    userInfo: {},

    initData() {
        this.listData = require("./dummyListItems.js");
        this.userInfo = {
            userName: "Sanni69",
            img: "/images/sanni.jpg",
            joinedEvents: []
        }
    },

    start(dataContainerReactComponent) {
        this.dataContainerReactComponent = dataContainerReactComponent;
    },

    registerLike(id) {
        var item = this.listData.find((entry) => { return entry.id == id});
        var index = this.listData.indexOf(item);
        this.listData.splice(index, 1);
        this.listData.unshift(item);
        this.dataContainerReactComponent.forceUpdate();
    },

    registerDislike(id) {
        var item = this.listData.find((entry) => { return entry.id == id});
        var index = this.listData.indexOf(item);
        this.listData.splice(index, 1);
        this.dataContainerReactComponent.forceUpdate();
    },

    addNewEvent(createdEventData) {
        var d = new Date();
        createdEventData.id = d.getTime();
        this.listData.push(createdEventData);
        this.dataContainerReactComponent.forceUpdate();
    },

    isJoined(id) {
        return this.userInfo.joinedEvents.indexOf(id) >= 0;
    },

    joinEvent(id) {
        if (!this.isJoined(id)) {
            var item = this.listData.find((entry) => { return entry.id == id});
            item.joined += 1;
            this.userInfo.joinedEvents.push(id);
            this.dataContainerReactComponent.forceUpdate();
        }
    },

    unJoinEvent(id) {
        if (this.isJoined(id)) {
            var item = this.listData.find((entry) => { return entry.id == id});
            item.joined -= 1;
            var index = this.userInfo.joinedEvents.indexOf(id);
            this.userInfo.joinedEvents.splice(index, 1);
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
        this.dataContainerReactComponent.forceUpdate();
    }


}