;(function(){
    window.onload = function(){
        var puzzleArea = document.getElementById("puzzlearea");
        var puzzlePieces = puzzleArea.getElementsByTagName("div");
        var shuffleBtn = document.getElementById("shufflebutton")
        var columns = 4, isMoving = 0;
        var step = 10;
        var blank = {
            top : getTop(puzzlePieces.length)+'px',
            left : getLeft(puzzlePieces.length)+'px'
        }
        function getTop(index) {
            return Math.floor(index/4)*100;
        }
        function getLeft(index) {
            return index%4*100;
        }
        function swapPosition(element, blank, delay) {
            if (!nearBlank(element) || isMoving == 1) {
                return;
            }
            var tmpTop = element.style.top,
                tmpLeft = element.style.left;
            if (delay == 0) {
                element.style.left = blank.left;
                element.style.top = blank.top;
                blank.top = tmpTop;
                blank.left = tmpLeft;
            } else {
                function movePiece() {
                    if (element.style.top != blank.top || element.style.left != blank.left) {
                        element.style.left = parseInt(element.style.left)+getSign(element).horizon*step+'px';
                        element.style.top = parseInt(element.style.top)+getSign(element).vertical*step+'px';
                        isMoving = 1;
                        timer = setTimeout(movePiece, delay);
                    } else {
                        clearTimeout(timer);
                        isMoving = 0;
                        blank.top = tmpTop;
                        blank.left = tmpLeft;
                    }
                }
                movePiece();
            }
        }
        function nearBlank(element) {
            var dist = distance(element);
            if (dist.vertical == 100 && dist.horizon == 0) {
                return true;
            }
            if (dist.vertical == 0 && dist.horizon == 100) {
                return true;
            }
            return false;
        }
        function distance(element) {
            return {
                vertical : Math.abs(interval(element).vertical),
                horizon  : Math.abs(interval(element).horizon)
            }
        }
        function getSign(element) {
            return {
                vertical : computeSign(element, 'vertical'),
                horizon  : computeSign(element, 'horizon')
            }
        }
        function computeSign(element, direct) {
            var temp = eval("interval(element)."+direct);
            if (temp > 0) return -1;
            else if (temp < 0) return 1;
            else return 0;
        }
        function interval(element) {
            return {
                vertical : parseInt(element.style.top)-parseInt(blank.top),
                horizon  : parseInt(element.style.left)-parseInt(blank.left)
            }
        }
        // 添加类
        function addClass(element, value) {
            if (!hasClass(element, value)) {
                element.className += ' ' + value;
            }
        }
        // 删除类
        function removeClass(element, value) {
            if (hasClass(element, value)) {
                var reg = new RegExp('(\\s|^)'+value+'(\\s|$)');
                element.className = element.className.replace(reg, '');
            }
        }
        // 是否存在该类
        function hasClass(element, value) {
            return element.className.match(new RegExp('(\\s|^)'+value+'(\\s|$)'));
        }
        function isFinish() {
            for (var i = 0; i < puzzlePieces.length; i++) {
                var pos = puzzlePieces[i].style.backgroundPosition.split(" ");
                if (parseInt(puzzlePieces[i].style.top) != -parseInt(pos[1])
                    || parseInt(puzzlePieces[i].style.left) != -parseInt(pos[0])) {
                    return false;
                }
            }
            return true;
        }

        for (var i = 0; i < puzzlePieces.length; i++) {
            addClass(puzzlePieces[i],"puzzlepiece");
            puzzlePieces[i].style.top = getTop(i)+'px';
            puzzlePieces[i].style.left = getLeft(i)+'px';
            puzzlePieces[i].style.backgroundPosition = -1*getLeft(i)+'px '+(-1)*getTop(i)+'px';
            puzzlePieces[i].onclick = function(event) {
                swapPosition(event.target, blank, 10);
                if (isFinish()) {
                    alert("win");
                }
            };
        }

        function refresh() {
            var count = 800;
            while(count--) {
                var index = Math.floor(Math.random()*puzzlePieces.length);
                console.log(index);
                for (var i = 0; i < puzzlePieces.length; i++) {
                    swapPosition(puzzlePieces[i], blank, 0);
                }
            }
        }
        shuffleBtn.onclick = refresh;
    };
})();