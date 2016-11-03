function Tinderable(tinderableFront) {

    this.tinderableFront = tinderableFront;

    this._likeListener = null;
    this._dislikeListener = null;
    this._superlikeListener = null;
    this._stackEmptyListener = null;
    this._cancelListener = null;
    this._data = [];

    this._stack = [];
    this._stackData = [];
    this._touchStartPosition = null;
    this._lastAction = null;

    this._stackArea = null;
    this._buttonsArea = null;

    this._stackPosition = null;

    this.setData = function(data) {
        this._data = this._data.concat(data);
    }

    this.onLike = function(likeListener) {
        this._likeListener = likeListener;
    }

    this.onSuperlike = function(superlikeListener) {
        this._superlikeListener = superlikeListener;
    }

    this.onDislike = function(dislikeListener) {
        this._dislikeListener = dislikeListener;
    }

    this.onStackEmpty = function(stackEmptyListener) {
        this._stackEmptyListener = stackEmptyListener;
    }

    this.onCancelAction = function(cancelListener) {
        this._cancelListener = cancelListener;
    }

    this.start = function() {
        if (this._data.length > 0) {
            data2Html(this);
            setStackTop(this);
        }
    }

    this.triggerLike = function() {
        if (this._stack.length > 0) {
            var item = removeStackTop(this);
            this._lastAction.action = "like";
            if (this._likeListener != null) {
                this._likeListener(item);
            }
        }
    }

    this.triggerSuperlike = function() {
        if (this._stack.length > 0) {
            var item = removeStackTop(this);
            this._lastAction.action = "superlike";
            if (this._superlikeListener != null) {
                this._superlikeListener(item);
            }
        }
    }

    this.triggerDislike = function() {
        if (this._stack.length > 0) {
            var item = removeStackTop(this);
            this._lastAction.action = "dislike";
            if (this._dislikeListener != null) {
                this._dislikeListener(item);
            }
        }
    }

    this.triggerCancel = function() {
        if (this._lastAction != null) {
            //Re-render tinderable to make sure there are no previous event listeners left
            var prevAction = this._lastAction.action;
            var prevDataItem = this._lastAction.dataItem;
            var prevData = this._data;
            this._data = [this._lastAction.dataItem];
            this.setData(this._stackData);
            this.setData(prevData);
            this.destroy();
            this.start();

            //Disable the cancel button. You can only cancel the last action which was already cancelled
            this._buttonsArea.firstChild.disabled = true;
            this._buttonsArea.firstChild.style.color = "lightgrey";

            if (this._cancelListener != null) {
                this._cancelListener(prevAction, prevDataItem);
            }            
            
        }
    }

    this.destroy = function() {
        this.tinderableFront.innerHTML = "";
        this._stack = [];
        this._stackData = [];
        this._touchStartPosition = null;
        this._lastAction = null;
        this._stackArea = null;
        this._stackPosition = null;
    }

    //Private functions

    var data2Html = function(self) {
        self._stackPosition = self.tinderableFront.getBoundingClientRect();

        self._buttonsArea = createButtons(self);
        self._stackArea = document.createElement("div");

        for (var i = 0; i < self._data.length; i++) {
            var stackItem = dataItem2stackItem(self, self._data[i]);
            self._stack.push(stackItem);
            self._stackData.push(self._data[i]);
            self._stackArea.appendChild(stackItem);
        }
        self.tinderableFront.appendChild(self._stackArea);
        self.tinderableFront.appendChild(self._buttonsArea);

        self._data = [];
        self._stackArea.style.width = self._stackArea.firstChild.clientWidth + 'px';        

        //Find the height of the tallest stack item and set all items to have that height
        var maxHeight = 0;
        for (var i = 0; i < self._stack.length; i++) {
            maxHeight = self._stack[i].clientHeight > maxHeight ? self._stack[i].clientHeight : maxHeight;
        }
        for (var i = 0; i < self._stack.length; i++) {
            self._stack[i].style.height = maxHeight + 'px';
        }
        self._stackArea.style.height = maxHeight + 'px';
    }

    var dataItem2stackItem = function(self, dataItem) {

        var stackItem = document.createElement("div");
        stackItem.style.display = "inline-block";
        stackItem.style.backgroundColor = "rgba(255, 255, 255, 1)";
        stackItem.style.position = "absolute";
        stackItem.style.left = self._stackPosition.left + 'px';
        stackItem.style.top = self._stackPosition.top + 'px';
        stackItem.style.width = self.tinderableFront.clientWidth + 'px';
        stackItem.style.border = "1px solid lightgrey";
        stackItem.style.borderRadius = "10px";

        var imgArea = document.createElement("div");
        imgArea.style.width = self.tinderableFront.clientWidth + 'px';
        imgArea.style.height = self.tinderableFront.clientWidth + 'px';
        imgArea.style.overflow = "hidden";
        imgArea.style.borderRadius = "10px";
        imgArea.innerHTML = "<img style=\"width:100%\" src='" + dataItem.img + "' />";
        stackItem.appendChild(imgArea);

        var titleArea = document.createElement("h3");
        titleArea.style.marginTop = "5px";
        titleArea.style.marginBottom = "2px";
        titleArea.style.marginLeft = "10px";
        titleArea.innerHTML = dataItem.title;
        stackItem.appendChild(titleArea);

        var descriptionArea = document.createElement("p");
        descriptionArea.style.marginTop = "0px";
        descriptionArea.style.marginBottom = "10px";
        descriptionArea.style.marginLeft = "10px";
        descriptionArea.innerHTML = dataItem.description.length > 75 ? dataItem.description.substring(0,75)+"..." : dataItem.description;
        stackItem.appendChild(descriptionArea);

        return stackItem;

    }

    var createButtons = function(self) {
        var buttonsArea = document.createElement("div");
        buttonsArea.style.marginTop = "10px";

        var cancelButton = document.createElement("button");
        cancelButton.style.backgroundColor = "yellow";
        cancelButton.style.width = "24%";
        cancelButton.style.marginRight = "1%";
        cancelButton.style.float = "left";
        cancelButton.style.borderRadius = "5px";
        cancelButton.innerHTML = "<h4>Cancel</h4>";
        cancelButton.addEventListener('click', function (e) { self.triggerCancel() }, false);
        buttonsArea.appendChild(cancelButton);

        var dislikeButton = document.createElement("button");
        dislikeButton.style.backgroundColor = "red";
        dislikeButton.style.color = "white";
        dislikeButton.style.width = "24%";
        dislikeButton.style.marginRight = "1%";
        dislikeButton.style.float = "left";
        dislikeButton.style.borderRadius = "5px";
        dislikeButton.innerHTML = "<h4>Dislike</h4>";
        dislikeButton.addEventListener('click', function (e) { self.triggerDislike() }, false);
        buttonsArea.appendChild(dislikeButton);

        var likeButton = document.createElement("button");
        likeButton.style.backgroundColor = "green";
        likeButton.style.color = "white";
        likeButton.style.width = "24%";
        likeButton.style.marginRight = "1%";
        likeButton.style.float = "left";
        likeButton.style.borderRadius = "5px";
        likeButton.innerHTML = "<h4>Like</h4>";
        likeButton.addEventListener('click', function (e) { self.triggerLike() }, false);
        buttonsArea.appendChild(likeButton);

        var superlikeButton = document.createElement("button");
        superlikeButton.style.backgroundColor = "blue";
        superlikeButton.style.color = "white";
        superlikeButton.style.width = "24%";
        superlikeButton.style.marginRight = "1%";
        superlikeButton.style.float = "left";
        superlikeButton.style.borderRadius = "5px";
        superlikeButton.innerHTML = "<h4>Superlike</h4>";
        superlikeButton.addEventListener('click', function (e) { self.triggerSuperlike() }, false);
        buttonsArea.appendChild(superlikeButton);

        //Disable the cancel button.
        cancelButton.disabled = true;
        cancelButton.style.color = "lightgrey";

        return buttonsArea;
    }

    var setStackTop = function(self) {
        //Set the ordering of the stack items to html
        for (var i = 0; i < self._stack.length; i++) {
            self._stack[i].style.zIndex = 100-i;
        }

        //Add touch event listeners
        var touchStart = stackTopTouchStart(self);
        var touchEnd = stackTopTouchEnd(self);
        var touchMove = stackTopTouchMove(self);
        self._stack[0].addEventListener('touchstart', touchStart, false);
        self._stack[0].addEventListener('touchend', touchEnd, false);
        self._stack[0].addEventListener('touchmove', touchMove, false);
    }    

    //Remove the top item of the stack. Called after like, superlike and dislake
    var removeStackTop = function(self) {
        self._stackArea.removeChild(self._stack[0]);
        self._stack.shift();
        self._lastAction = {
            "dataItem": self._stackData.shift()
        };

        if (self._stack.length > 0) {
            setStackTop(self);
        } else if (self._data != null && self._data.length > 0) {
            self.destroy();
            self.start();
        } else if (self._stackEmptyListener != null) {
            window.setTimeout(self._stackEmptyListener, 0);
        }

        //Make sure the cancel button is enabled
        self._buttonsArea.firstChild.disabled = false;
        self._buttonsArea.firstChild.style.color = "black";
        return self._lastAction.dataItem;
    }

    //Create the touch event listeners

    var stackTopTouchStart = function(self) {
        return function(e) {
            self._stack[0].style.transition = "";
            var touch = e.targetTouches[0];
            self._touchStartPosition = {
                x: touch.pageX,
                y: touch.pageY
            };
            e.preventDefault();
        }

    }

    var stackTopTouchEnd = function(self) {
        return function(e) {
            var touch = e.changedTouches[0];
            var xChange = touch.pageX - self._touchStartPosition.x;
            var yChange = touch.pageY - self._touchStartPosition.y;
            var minSwipe = self.tinderableFront.clientWidth/3;

            if (xChange >= minSwipe) {
                self.triggerLike();
            } else if (xChange <= -1*minSwipe) {
                self.triggerDislike();
            } else if (yChange <= -1*minSwipe) {
                self.triggerSuperlike();
            } else {
                self._stack[0].style.transition = "left 0.5s, top 0.5s, transform 0.5s";
                self._stack[0].style.left = self._stackPosition.left + 'px';
                self._stack[0].style.top = self._stackPosition.top + 'px';
                self._stack[0].style.transform = "";
            }
        };
    }

    var stackTopTouchMove = function(self) {
        return function(e) {
            var touch = e.targetTouches[0];
            var xChange = touch.pageX - self._touchStartPosition.x;
            var yChange = touch.pageY - self._touchStartPosition.y;

            self._stack[0].style.left = (self._stackPosition.left + xChange) + 'px';
            self._stack[0].style.top = (self._stackPosition.top + yChange) + 'px';
            var rotationDegree = xChange*35/self.tinderableFront.clientWidth;
            self._stack[0].style.transform = "rotate(" + rotationDegree + "deg)";
            e.preventDefault();
        }
    }
};
