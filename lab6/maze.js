(function(){
    window.onload = function(){
        var boundaries = document.getElementsByClassName("boundary");
        var startBtn   = document.getElementById("start");
        var endBtn     = document.getElementById("end");
        var status     = document.getElementById("status");
        var maze       = document.getElementById("maze");
        var body       = document.body;
        // 碰到墙壁
        function outOfPath(element) {
            element.onmouseover = function(event) {
                youLose();
            };
        }
        // 失败状态
        function youLose() {
            traverseAllElements(boundaries, function(elem){
                addClass(elem, "youlose");
                status.innerHTML = "You Lose";
            });
        }
        // 监听是否作弊
        function checkCheat() {
            maze.onmouseover = function(event) {
                stopBubble(event);
            };
            body.onmouseover = function() {
                youLose();
            };
        }
        // 取消事件冒泡
        function stopBubble(e){
            if (e && e.stopPropagation){
                e.stopPropagation();
            } else {
                window.event.cancelBubble = true;
            }
        }
        // 初始化迷宫
        function initMaze() {
            traverseAllElements(boundaries, function(elem){
                removeClass(elem, "youlose");
            });
            traverseAllElements(boundaries, outOfPath);
            status.innerHTML = 'Move your mouse over the "S" to begin.';
            checkCheat();
        }
        // 胜利状态
        function finishGame() {
            if (!hasClass(boundaries[0], "youlose")) {
                status.innerHTML = "You Win";
            }
            body.onmouseover = null;
            traverseAllElements(boundaries, function(element) {
                element.onmouseover = null;
            });
        }
        // 遍历所有墙壁
        function traverseAllElements(elements, func) {
            for (var i = 0; i < elements.length; i++) {
                func(elements[i]);
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

        startBtn.onclick = initMaze;
        endBtn.onmouseover = finishGame;
    };
})();