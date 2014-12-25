;(function(){
    window.onload = function(){
        var puzzleArea = document.getElementById("puzzlearea");
        var puzzlePieces = puzzleArea.getElementsByTagName("div");
        var shuffleBtn = document.getElementById("shufflebutton");
        var columns = 4,
           isMoving = 0,
              steps = 0,
               step = 10;
        var blank = {
            top : getTop(puzzlePieces.length)+'px',
            left : getLeft(puzzlePieces.length)+'px'
        }
        
        // 获得顶部位置算法
        function getTop(index) {
            return Math.floor(index/4)*100;
        }
        // 获得左边位置算法
        function getLeft(index) {
            return index%4*100;
        }
        // 交换滑块与空白位置
        function swapPosition(element, blank, delay) {
            // 不相邻或者正在移动则返回
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
                pieceHover();
            } else {
                // 移动滑块
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
                        pieceHover();
                        if (isFinish() && steps != 0) {
                            youWin();
                        }
                    }
                }
                movePiece();
                steps++;
                refreshScreen();
            }
        }
        // 判断滑块是否相邻
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
        // 获得滑块间绝对距离
        function distance(element) {
            return {
                vertical : Math.abs(interval(element).vertical),
                horizon  : Math.abs(interval(element).horizon)
            }
        }
        // 获得相对距离的符号
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
        // 获得滑块间相对距离
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
        // 判断是否完成游戏
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
        // 初始化并监听滑块点击事件
        function addListener() {
            for (var i = 0; i < puzzlePieces.length; i++) {
                addClass(puzzlePieces[i],"puzzlepiece");
                puzzlePieces[i].style.top = getTop(i)+'px';
                puzzlePieces[i].style.left = getLeft(i)+'px';
                puzzlePieces[i].style.backgroundPosition = -1*getLeft(i)+'px '+(-1)*getTop(i)+'px';
                puzzlePieces[i].onclick = function(event) {
                    swapPosition(event.target, blank, 5);
                };
            }
        }
        // 胜利
        function youWin() {
            var slt = document.getElementsByTagName("select")[0];
            puzzleArea.style.backgroundImage = 'url('+ slt.value +'.jpg)';
            var pp = document.createElement("h2");
            pp.innerHTML = "youwin!";
            puzzleArea.appendChild(pp);
            for (var i = 0; i < puzzlePieces.length; i++) {
                puzzlePieces[i].style.display = 'none';
            }
        }
        // 洗牌
        function refresh() {
            var slt = document.getElementsByTagName("select")[0];
            var spp = puzzleArea.getElementsByTagName("h2")[0];
            puzzleArea.style.backgroundImage = 'none';
            spp.style.display = 'none';
            for (var i = 0; i < puzzlePieces.length; i++) {
                puzzlePieces[i].style.display = 'block';
            }
            var count = 500;
            while(count--) {
                var index = Math.floor(Math.random()*puzzlePieces.length);
                for (var i = 0; i < puzzlePieces.length; i++) {
                    swapPosition(puzzlePieces[i], blank, 0);
                }
            }
            steps = 0;
            refreshScreen();
        }
        // 更换背景图片
        function selectOnChange() {
            var slt = document.getElementsByTagName("select")[0];  
            slt.onchange = function() {
                var val = slt.value;
                for (var i = 0; i < puzzlePieces.length; i++) {
                    puzzlePieces[i].style.backgroundImage = 'url('+val+'.jpg)';
                }
            };
        }
        // 增加控制组件
        function addController(callback) {
            var ctrls = document.getElementById("controls");
            var bgList = ["background", "background1", "background2", "background3"];
            var changeBg = document.createElement("select");
            for (var i = 0; i < 4; i++) {
                var option = document.createElement("option");
                option.innerHTML = bgList[i];
                option.setAttribute("value", bgList[i]);
                changeBg.appendChild(option);
            }
            ctrls.appendChild(changeBg);
            callback();
        }
        // 增加步数屏幕
        function addScreen() {
            var scrn = document.createElement("span");
            var ctrls = document.getElementById("controls");
            scrn.setAttribute("id", "screen");
            ctrls.appendChild(scrn);
            refreshScreen();
        }
        // 刷新步数屏幕
        function refreshScreen() {
            var scrn = document.getElementById("screen");
            scrn.innerHTML = steps;
        }
        // 可移动块鼠标悬停事件
        function pieceHover() {
            for (var i = 0; i < puzzlePieces.length; i++) {
                removeClass(puzzlePieces[i], 'movablepiece');
                if (nearBlank(puzzlePieces[i])) {
                    addClass(puzzlePieces[i], 'movablepiece');
                }
            }
        }
        addListener();
        shuffleBtn.onclick = refresh;
        addController(selectOnChange);
        addScreen();
    };
})();
