$(document).ready(function() {
    //mainNav
    var posLeft =$(".mainNav").find(".current").position().left+10;
    $(".current").addClass("locate");
    $(".currentBlock").css("left", posLeft+"px");

    $(".item").hover(function(){
      var elementLeft = $(this).position().left+10;
      var before = $(this);
      $(".currentBlock").stop().animate({
        left:elementLeft
      },300, function(){
        before.find(".mainA").addClass("active");
      });
      $(".current").removeClass("locate");
    },function(){
      $(".currentBlock").stop().animate({
        left:posLeft
      },300);
      $(this).find(".mainA").removeClass("active");
      $(".current").addClass("locate");
    });


    //childNav
    $(".dropdown").mouseover(function(){
      $(this).find("ul").css("visibility", "visible");
    });

    $(".dropdown").mouseout(function(){
      $(this).find("ul").css("visibility", "hidden");
    });

    //waterfall flow design
    imgLocation("childContainer");

    function imgLocation(child) {
      var content = $("."+child);
      var colHeights = [];
      var cols = 4;
      var containerPadding = 5;

      for (var i = 0; i < content.length; i++) {
        if (i < cols) {
          colHeights[i] = content.eq(i).offset().top+content.eq(i).height()+10;
        } else {
          var minHeight = Math.min.apply(null, colHeights);
          var minIndex = getMinHeightLocation(colHeights, minHeight);
          content.eq(i).css("position", "absolute");
          content.eq(i).css("top", minHeight + "px");
          content.eq(i).css("left", content.eq(minIndex).position().left + "px");
          colHeights[minIndex] += content.eq(i).height()+containerPadding*2;
        }
      }
    }
    function getMinHeightLocation(array, minH) {
      for(var i in array) {
        if(array[i] == minH) {
          return i;
        }
      }
    }

    //refresh
    $(window).scroll(function(){
      //database
      var topp = $(window).scrollTop();
      var topc = $(".childContainer").eq(0).position().top;
      if (topp >= topc) {
        $("header").addClass("shadow");
      } else {
        $("header").removeClass("shadow");
      }
      var imageData = {
        "data":[
        {"src" : "images/activity/1.jpg", "title" : "11参观广州腾讯 T.I.T 创意园", "description" : "TIT创意园的前身是建于1956年的广州纺织机械厂，广州纺织工贸集团积极响应广州市政府“退二进三”政策..."},
        {"src" : "images/activity/3.jpg", "title" : "12参观广州腾讯 T.I.T 创意园", "description" : "TIT创意园的前身是建于1956年的广州纺织机械厂，广州纺织工贸集团积极响应广州市政府“退二进三”政策..."},
        {"src" : "images/activity/2.jpg", "title" : "13参观广州腾讯 T.I.T 创意园", "description" : "TIT创意园的前身是建于1956年的广州纺织机械厂，广州纺织工贸集团积极响应广州市政府“退二进三”政策..."},
        {"src" : "images/activity/8.jpg", "title" : "14参观广州腾讯 T.I.T 创意园", "description" : "TIT创意园的前身是建于1956年的广州纺织机械厂，广州纺织工贸集团积极响应广州市政府“退二进三”政策..."},
        {"src" : "images/activity/5.jpg", "title" : "15参观广州腾讯 T.I.T 创意园", "description" : "TIT创意园的前身是建于1956年的广州纺织机械厂，广州纺织工贸集团积极响应广州市政府“退二进三”政策..."},
        {"src" : "images/activity/7.jpg", "title" : "16参观广州腾讯 T.I.T 创意园", "description" : "TIT创意园的前身是建于1956年的广州纺织机械厂，广州纺织工贸集团积极响应广州市政府“退二进三”政策..."},
        {"src" : "images/activity/3.jpg", "title" : "17参观广州腾讯 T.I.T 创意园", "description" : "TIT创意园的前身是建于1956年的广州纺织机械厂，广州纺织工贸集团积极响应广州市政府“退二进三”政策..."},
        {"src" : "images/activity/4.jpg", "title" : "18参观广州腾讯 T.I.T 创意园", "description" : "TIT创意园的前身是建于1956年的广州纺织机械厂，广州纺织工贸集团积极响应广州市政府“退二进三”政策..."},
        {"src" : "images/activity/2.jpg", "title" : "19参观广州腾讯 T.I.T 创意园", "description" : "TIT创意园的前身是建于1956年的广州纺织机械厂，广州纺织工贸集团积极响应广州市政府“退二进三”政策..."},
        {"src" : "images/activity/9.jpg", "title" : "20参观广州腾讯 T.I.T 创意园", "description" : "TIT创意园的前身是建于1956年的广州纺织机械厂，广州纺织工贸集团积极响应广州市政府“退二进三”政策..."},
        {"src" : "images/activity/6.jpg", "title" : "21参观广州腾讯 T.I.T 创意园", "description" : "TIT创意园的前身是建于1956年的广州纺织机械厂，广州纺织工贸集团积极响应广州市政府“退二进三”政策..."},
        {"src" : "images/activity/7.jpg", "title" : "22参观广州腾讯 T.I.T 创意园", "description" : "TIT创意园的前身是建于1956年的广州纺织机械厂，广州纺织工贸集团积极响应广州市政府“退二进三”政策..."}
        ]};
      
      if (checkBottom()) {
        for (var i = 0; i < imageData.data.length; i++) {
          var child = $("<div class=\"childContainer\"></div>");
          var a = $("<a href="+imageData.data[i].src+"></a>");
          var box = $("<div class=\"box\"></div>");
          var boxImg = $("<div class=\"boxImage\"></div>");
          boxImg.append("<img src="+imageData.data[i].src+" alt=\""+imageData.data[i].title+"\"/>");
          var boxDes = $("<div class=\"boxDescription\"></div>");
          var h1 = $("<h1></h1>").text(imageData.data[i].title);
          var p = $("<p></p>").text(imageData.data[i].description);
          boxDes.append(h1, p);
          box.append(boxImg,boxDes);
          a.append(box);
          child.append(a);
          $("#container").append(child);
        }
        imgLocation("childContainer");
      }
    });
    function checkBottom() {
      var top=$(window).scrollTop();
      var last = $(".childContainer").length;
      var topa = $(".childContainer").eq(last-1).position().top;
      var topb = $(window).height();
      if (topa < top+topb) {
        return true;
      }
    };

    //resize
    $(window).resize(function(){
      imgLocation("childContainer");
    });

    $(".topp").click(function(){
      $("html,body").animate({
        scrollTop: 0
      }, 1000);
    });
});



