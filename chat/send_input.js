jQuery.fn.css2 = jQuery.fn.css;
jQuery.fn.css = function() {
    if (arguments.length) return jQuery.fn.css2.apply(this, arguments);
    var attr = ['font-family','font-size','font-weight','font-style','color',
        'text-transform','text-decoration','letter-spacing', 'box-shadow',
        'line-height','text-align','vertical-align','direction','background-color',
        'background-image','background-repeat','background-position',
        'background-attachment','opacity','width','height','top','right','bottom',
        'left','margin-top','margin-right','margin-bottom','margin-left',
        'padding-top','padding-right','padding-bottom','padding-left',
        'border-top-width','border-right-width','border-bottom-width',
        'border-left-width','border-top-color','border-right-color',
        'border-bottom-color','border-left-color','border-top-style',
        'border-right-style','border-bottom-style','border-left-style','position',
        'display','visibility','z-index','overflow-x','overflow-y','white-space',
        'clip','float','clear','cursor','list-style-image','list-style-position',
        'list-style-type','marker-offset'];
    var len = attr.length, obj = {};
    for (var i = 0; i < len; i++) 
        obj[attr[i]] = jQuery.fn.css2.call(this, attr[i]);
    return obj;
};

$(function(){
    $('textarea').keyup(function () {
        var t = $(this);
        
        if (!this.justifyDoc) {
            this.justifyDoc = $(document.createElement('div'));
            // copy css
            this.justifyDoc.css(t.css()).css({
                'display'   :   'none',
                'word-wrap' :   'break-word',
                'min-height':   t.height(),
                'height'    :   'auto'
            }).insertAfter(t.css('overflow-y', 'hidden'));
        }

        var html = t.val().replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/'/g, '&#039;')
            .replace(/"/g, '&quot;')
            .replace(/ /g, '&nbsp;')
            .replace(/((&nbsp;)*)&nbsp;/g, '$1 ')
            .replace(/\n/g, '<br />')
            .replace(/<br \/>[ ]*$/, '<br />-')
            .replace(/<br \/> /g, '<br />&nbsp;');

        this.justifyDoc.html(html);
        t.height(this.justifyDoc.height());
    });
    var isFocus = 0;
    $("textarea").focus(function(){
        isFocus = 1;
    });
    $("textarea").blur(function(){
        isFocus = 0;
    });
    $("textarea").click(function() {
        setTimeout(function(){
            $("html, body").scrollTop($(document).height());
        }, 500);
    });
    $(".append-record").click(function(){
        $(".record-mode").addClass('mode-active');
        $("form").addClass('form-outside');
    });
    $(".keyboard-btn").click(function() {
        $(".record-mode").removeClass('mode-active');
        $("form").removeClass('form-outside');
    });
    var isCancel = false;
    $(".record-btn").on("touchstart", function(event) {
        event.preventDefault();
        $(".record-btn").find("p").text("松开结束");
        $(".popup").css('display', 'block');
        $(this).css({
            "background-color": '#DDD'
        });
        var lastY = event.originalEvent.targetTouches[0].clientY;
        var criticalLine = $('.input-area').position().top - 160;
        console.log(criticalLine);
        var statusJudge = function(event) {
            var curY = event.originalEvent.targetTouches[0].clientY;
            if (curY > criticalLine) {
                isCancel = false;
                $(".cancel-warning p").text("上滑取消发送");
                $(".record-btn").find("p").text("松开结束");
            } else {
                isCancel = true;
                $(".cancel-warning p").text("松开取消");
                $(".record-btn").find("p").text("松开结束，取消发送");
            }
        };
        $("body").on("touchmove", statusJudge);
    })
    .on("touchend", function(event) {
        event.preventDefault();
        $(".record-btn").find("p").text("按住录音");
        $(this).css({
            "background-color": '#FFF'
        });
        $(".popup").css('display', 'none');
        if (isCancel) {
            console.log('cancel');
        } else {
            console.log('send');
        }
        $("body").off("touchmove");
    });
    m = 0;
    $('.wrapper').on("touchmove", function() {
        if ($("textarea").is(":focus")) {
            $("textarea").blur();
        }
    });
    $('.msg-voise').on("click", function() {
        $(this).find('.voise-btn').toggleClass('voise-btn-active');
    });
});

