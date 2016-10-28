function Tinderable(tinderableFront) {

    this.tinderableFront = tinderableFront;

    this.likeListener = null;
    this.dislikeListener = null;
    this.superlikeListener = null;
    this.stackEmptyListener = null;
    this.data = [];

    this.stack = [];
    this.stackData = [];
    this.touchStartPosition = null;

    this.stackArea = null;
    this.titleArea = null;
    this.descriptionArea = null;

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

    this.start = function() {
        if (this.data.length > 0) {
            data2Html(this);
            setStackTop(this);
        }
    }

    this.triggerLike = function() {
        var item = removeStackTop(this);
        if (this.likeListener != null) {
            this.likeListener(item);
        }
    }

    this.triggerSuperlike = function() {
        var item = removeStackTop(this);
        if (this.superlikeListener != null) {
            this.superlikeListener(item);
        }
    }

    this.triggerDislike = function() {
        var item = removeStackTop(this);
        if (this.dislikeListener != null) {
            this.dislikeListener(item);
        }
    }

    this.destroy = function() {
        this.tinderableFront.innerHTML = "";
    }

    var data2Html = function(self) {
        self.stackArea = document.createElement("div");
        self.titleArea = document.createElement("h4");
        self.descriptionArea = document.createElement("p");

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
        var stackPosition = self.tinderableFront.getBoundingClientRect();

        var stackItem = document.createElement("div");
        stackItem.style.display = "inline-block";
        stackItem.style.backgroundColor = "rgba(255, 255, 255, 1)";
        stackItem.style.position = "absolute";
        stackItem.style.left = stackPosition.left + 'px';
        stackItem.style.top = stackPosition.top + 'px';
        stackItem.style.width = self.tinderableFront.clientWidth + 'px';
        stackItem.style.height = self.tinderableFront.clientWidth + 'px';
        stackItem.style.overflow = "hidden";
        stackItem.innerHTML = "<img style=\"width:100%\" src='" + dataItem.img + "' />";

        return stackItem;

    }

    var setStackTop = function(self) {
        self.stack[0].style.zIndex = 100;
        if (self.stack.length > 1) {
            self.stack[1].style.zIndex = 50;
        }

        var touchStart = stackTopTouchStart(self);
        var touchEnd = stackTopTouchEnd(self);
        var touchMove = stackTopTouchMove(self);

        self.stack[0].addEventListener('touchstart', touchStart, false);
        self.stack[0].addEventListener('touchend', touchEnd, false);
        self.stack[0].addEventListener('touchmove', touchMove, false);
        self.titleArea.innerHTML = self.stackData[0].title;
        self.descriptionArea.innerHTML = self.stackData[0].description;

    }

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
                var stackPosition = self.tinderableFront.getBoundingClientRect();
                self.stack[0].style.transition = "left 0.5s, top 0.5s, transform 0.5s";
                self.stack[0].style.left = stackPosition.left + 'px';
                self.stack[0].style.top = stackPosition.top + 'px';
                self.stack[0].style.transform = "";
            }
        };
    }

    var stackTopTouchMove = function(self) {
        return function(e) {
            var touch = e.targetTouches[0];
            var xChange = touch.pageX - self.touchStartPosition.x;
            var yChange = touch.pageY - self.touchStartPosition.y;
            var stackPosition = self.tinderableFront.getBoundingClientRect();

            self.stack[0].style.left = (stackPosition.left + xChange) + 'px';
            self.stack[0].style.top = (stackPosition.top + yChange) + 'px';
            var rotationDegree = xChange*35/self.tinderableFront.clientWidth;
            self.stack[0].style.transform = "rotate(" + rotationDegree + "deg)";
            e.preventDefault();
        }
    }

    var removeStackTop = function(self) {
        self.stackArea.removeChild(self.stack[0]);
        self.stack.shift();
        var data = self.stackData.shift();

        if (self.stack.length > 0) {
            setStackTop(self);
        } else if (self.data != null && self.data.length > 0) {
            self.destroy();
            self.start();
        } else if (self.stackEmptyListener != null) {
            window.setTimeout(self.stackEmptyListener, 0);
        }

        return data;
    }
};
