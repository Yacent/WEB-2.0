$(document).ready(function() {
     //mainNav
    var posLeft = getCurrentLeft();
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
    
    function getCurrentLeft() {
      var posLeft = $(".mainNav").find(".current").position().left+10;
      $(".currentBlock").css("left", posLeft+"px");
      $(".current").addClass("locate");
      return posLeft;
    }


    //responsive for big screen
    $(window).resize(function(){
      getCurrentLeft();
      initialBtnPos();
    });


    //childNav
    $(".dropdown").mouseover(function(){
      $(this).find("ul").css("visibility", "visible");
    });
    $(".dropdown").mouseout(function(){
      $(this).find("ul").css("visibility", "hidden");
    });


    //slidePlay
    var slideIndex = 0;
    var slideLength = $(".slideLi").length;
    var timer;
    var windowWidth = $(window).width();
    showDescription(0);
    function switchSlide() {
      var currentLeft = $(".navCurrent").position().left;
      $(".slideLi").eq(slideIndex).fadeOut(0);
      hideDescription(slideIndex);
      $(".slideLi").eq(slideIndex+1).fadeIn();
      showDescription(slideIndex+1);
      slideIndex++;
      if (slideIndex == slideLength) {
        slideIndex = 0;
        $(".slideLi").eq(slideIndex).fadeIn();
        showDescription(slideIndex);
      }
      slideBarNav(slideIndex);
    }


    //set slideBtn position
    function initialBtnPos() {
      var clientHeight = $(window).height();
      $(".slideControll").css("top", clientHeight/2 + "px");
    }
    initialBtnPos();


    //slideBtn hover and click
    $(".slideBtn").hover(function(){
      clearInterval(timer);
    }, function(){
      timer = setInterval(switchSlide, 3000);
    });

    $("#toLeft").click(function(){
      if (slideIndex == 0) {
        hideDescription(slideIndex);
        slideIndex = slideLength;
        $(".slideLi").hide();
        slideIndex--;
        $(".slideLi").eq(slideIndex).fadeIn();
        showDescription(slideIndex);
        slideBarNav(slideIndex);
      } else {
        $(".slideLi").hide();
        hideDescription(slideIndex);
        slideIndex--;
        $(".slideLi").eq(slideIndex).fadeIn();
        showDescription(slideIndex);
        slideBarNav(slideIndex);
      }
    });

    $("#toRight").click(function(){
      if (slideIndex == slideLength-1) {
        slideIndex = -1;
      }
      $(".slideLi").hide();
      hideDescription(slideIndex);
      slideIndex++;
      $(".slideList").children().eq(slideIndex).fadeIn();
      showDescription(slideIndex);
      slideBarNav(slideIndex);
    });


    //bottomNav slide effects
    function slideBarNav(num) {
      var barLeft = $(".navBar").position().left;
      for (var i = 0; i < slideLength; i++) {
        if (i == num) {
          $(".navCurrent").animate({
            left: barLeft+i*30
          }, 500);
        }
      }
    }


    //slide description effects
    function showDescription(num) {
      $(".showDescription").eq(num).animate({
        left: windowWidth*.55
      }, 1000); 
    }
    function hideDescription(num) {
      $(".showDescription").eq(slideIndex).animate({
        left: windowWidth*(-1)
      }, 1000); 
    }

    // slide timer
    timer = setInterval(switchSlide, 4000);
  });