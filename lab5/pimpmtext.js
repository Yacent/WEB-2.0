$(function(){
    $("body").on("click", "button[name='bigger']", function(){
        var $text = $("textarea");
        var timer = setInterval(function(){
            $text.css({
                fontSize: '+=2'
            });
        },500);
        
        if (!!$("input[name='bling']").attr("checked")) {
            $text.css({
                fontWeight: 'bold',
                textDecoration: 'underline',
                color: 'green'
            });
        }
    });

    $("body").on("click", "button[name='snoopify']", function(){
        var $text = $("textarea");
        var str = $text.val().toUpperCase()+"!";
        var strList = str.split(".");
        for (var i = 0; i < strList.length-1; i++) {
            strList[i] += "-izzle";
        }
        str = strList.join(".");
        $text.val(str);
    });
    
    $("body").on("click", "button[name='malkovitch']", function(){
        var $text = $("textarea");
        var str = $text.val();
        var strList = str.replace(". ", " ").replace(".", "").split(" ");
        for (var i = 0; i < strList.length; i++) {
            if (strList[i].length >= 5) {
                strList[i] = "Malkovitch";
            }
        }
        str = strList.join(" ");
        $text.val(str);
    });
});