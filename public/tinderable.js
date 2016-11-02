function Tinderable(tinderableFront) {

    this.tinderableFront = tinderableFront;

    this.likeListener = null;
    this.dislikeListener = null;
    this.superlikeListener = null;
    this.stackEmptyListener = null;
    this.cancelListener = null;
    this.data = [];

    this.stack = [];
    this.stackData = [];
    this.touchStartPosition = null;
    this.lastAction = null;

    this.stackArea = null;
    this.titleArea = null;
    this.descriptionArea = null;

    this._stackPosition = null;
    this._swipelisteners = null

    this.setData = function(data) {
        this.data = this.data.concat(data);
    }

    this.onLike = function(likeListener) {
        this.likeListener = likeListener;
    }

    this.onSuperlike = function(superlikeListener) {
        this.superlikeListener = superlikeListener;
    }

    this.onDislike = function(dislikeListener) {
        this.dislikeListener = dislikeListener;
    }

    this.onStackEmpty = function(stackEmptyListener) {
        this.stackEmptyListener = stackEmptyListener;
    }

    this.onCancelAction = function(cancelListener) {
        this.cancelListener = cancelListener;
    }

    this.start = function() {
        if (this.data.length > 0) {
            data2Html(this);
            setStackTop(this);
        }
    }

    this.triggerLike = function() {
        var item = removeStackTop(this);
        this.lastAction.action = "like";
        if (this.likeListener != null && this.stack.length > 0) {
            this.likeListener(item);
        }
    }

    this.triggerSuperlike = function() {
        var item = removeStackTop(this);
        this.lastAction.action = "superlike";
        if (this.superlikeListener != null && this.stack.length > 0) {
            this.superlikeListener(item);
        }
    }

    this.triggerDislike = function() {
        var item = removeStackTop(this);
        this.lastAction.action = "dislike";
        if (this.dislikeListener != null && this.stack.length > 0) {
            this.dislikeListener(item);
        }
    }

    this.triggerCancel = function() {
        if (this.lastAction != null && this.cancelListener != null && this.stack.length > 0) {
            removeSwipeListeners(this);
            this.stack.unshift(this.lastAction.stackItem);
            this.stackData.unshift(this.lastAction.dataItem);
            this.stackArea.insertBefore(this.lastAction.stackItem, this.stackArea.firstChild);            
            setStackTop(this);
            returnStackTop(this);
            this.cancelListener(this.lastAction.action, this.lastAction.dataItem);
            this.lastAction = null;
        }
    }

    this.destroy = function() {
        this.tinderableFront.innerHTML = "";
    }

    var data2Html = function(self) {
        self.stackArea = document.createElement("div");
        self.titleArea = document.createElement("h4");
        self.descriptionArea = document.createElement("p");
        self._stackPosition = self.tinderableFront.getBoundingClientRect();

        for (var i = 0; i < self.data.length; i++) {
            var stackItem = dataItem2stackItem(self, self.data[i]);
            self.stack.push(stackItem);
            self.stackData.push(self.data[i]);
            self.stackArea.appendChild(stackItem);
        }

        self.data = [];
        self.tinderableFront.appendChild(self.stackArea);
        self.tinderableFront.appendChild(self.titleArea);
        self.tinderableFront.appendChild(self.descriptionArea);

        self.stackArea.style.width = self.tinderableFront.clientWidth + 'px';
        self.stackArea.style.height = self.tinderableFront.clientWidth + 'px';
    }

    var dataItem2stackItem = function(self, dataItem) {

        var stackItem = document.createElement("div");
        stackItem.style.display = "inline-block";
        stackItem.style.backgroundColor = "rgba(255, 255, 255, 1)";
        stackItem.style.position = "absolute";
        stackItem.style.left = self._stackPosition.left + 'px';
        stackItem.style.top = self._stackPosition.top + 'px';
        stackItem.style.width = self.tinderableFront.clientWidth + 'px';
        stackItem.style.height = self.tinderableFront.clientWidth + 'px';
        stackItem.style.overflow = "hidden";
        stackItem.innerHTML = "<img style=\"width:100%\" src='" + dataItem.img + "' />";

        return stackItem;

    }

    var setStackTop = function(self) {
        //Set the ordering of the stack items to html
        for (var i = 0; i < self.stack.length; i++) {
            self.stack[i].style.zIndex = 100-i;
        }

        addSwipeListeners(self);        

        //Show the title and description of the top stack item
        self.titleArea.innerHTML = self.stackData[0].title;
        self.descriptionArea.innerHTML = self.stackData[0].description;
    }

    // Add touch event listeners to the top item of the stack and store them so they can be removed later
    var addSwipeListeners = function(self) {
        var touchStart = stackTopTouchStart(self);
        var touchEnd = stackTopTouchEnd(self);
        var touchMove = stackTopTouchMove(self);
        self.stack[0].addEventListener('touchstart', touchStart, false);
        self.stack[0].addEventListener('touchend', touchEnd, false);
        self.stack[0].addEventListener('touchmove', touchMove, false);
        self._swipelisteners = {
            'touchstart': touchStart,
            'touchend': touchEnd,
            'touchmove': touchMove,
        };

    }

    //Remove touch event listeners from the top item of the stack
    var removeSwipeListeners = function(self) {
        try {
            self.stack[0].removeEventListener('touchstart', self._swipelisteners.touchStart);
            self.stack[0].removeEventListener('touchend', self._swipelisteners.touchEnd);
            self.stack[0].removeEventListener('touchmove', self._swipelisteners.touchMove);
        } catch (err) {}
            
    }

    //The touch event listeners    
    var stackTopTouchStart = function(self) {
        return function(e) {
            self.stack[0].style.transition = "";
            var touch = e.targetTouches[0];
            self.touchStartPosition = {
                x: touch.pageX,
                y: touch.pageY
            };
            e.preventDefault();
        }

    }

    var stackTopTouchEnd = function(self) {
        return function(e) {
            var touch = e.changedTouches[0];
            var xChange = touch.pageX - self.touchStartPosition.x;
            var yChange = touch.pageY - self.touchStartPosition.y;
            var minSwipe = self.tinderableFront.clientWidth/3;

            if (xChange >= minSwipe) {
                self.triggerLike();
            } else if (xChange <= -1*minSwipe) {
                self.triggerDislike();
            } else if (yChange <= -1*minSwipe) {
                self.triggerSuperlike();
            } else {
                returnStackTop(self);
            }
        };
    }

    var stackTopTouchMove = function(self) {
        return function(e) {
            var touch = e.targetTouches[0];
            var xChange = touch.pageX - self.touchStartPosition.x;
            var yChange = touch.pageY - self.touchStartPosition.y;

            self.stack[0].style.left = (self._stackPosition.left + xChange) + 'px';
            self.stack[0].style.top = (self._stackPosition.top + yChange) + 'px';
            var rotationDegree = xChange*35/self.tinderableFront.clientWidth;
            self.stack[0].style.transform = "rotate(" + rotationDegree + "deg)";
            e.preventDefault();
        }
    }

    //Remove the top item of the stack. Called after like, superlike and dislake
    var removeStackTop = function(self) {
        removeSwipeListeners(self);
        self.stackArea.removeChild(self.stack[0]);
        self.lastAction = {
            "stackItem": self.stack.shift(),
            "dataItem": self.stackData.shift()
        };

        if (self.stack.length > 0) {
            setStackTop(self);
        } else if (self.data != null && self.data.length > 0) {
            self.destroy();
            self.start();
        } else if (self.stackEmptyListener != null) {
            window.setTimeout(self.stackEmptyListener, 0);
        }

        return self.lastAction.dataItem;
    }

    //The animation to return the top item of the stack to its initial place after first moving it
    var returnStackTop = function(self) {
        self.stack[0].style.transition = "left 0.5s, top 0.5s, transform 0.5s";
        self.stack[0].style.left = self._stackPosition.left + 'px';
        self.stack[0].style.top = self._stackPosition.top + 'px';
        self.stack[0].style.transform = "";

    }
};
