$(function () {

    var $window = $(window);
    var $error = $("#error");
    var $errorMsg = $("#errorMsg");
    var ua = navigator.userAgent;
    var msg = null;
    if (!window.WebGLRenderingContext || !document.createElement("canvas").getContext("experimental-webgl")) {
        msg = "Because it is not enabled on your browser or not supported by WebGL, you can not use this content.<br>";
    } else if (ua.indexOf("iPhone") > 0 || ua.indexOf("iPod") > 0 || ua.indexOf("Android") > 0 && ua.indexOf("Mobile") > 0) {
        msg += "You can not use this content on smartphones.<br>";
    } else if (ua.indexOf("iPad") > 0 || ua.indexOf("Android") > 0) {
        msg += "You can not use this content in the tablet.<br>";
    }
    if (msg) {
        $error.css({
            display: "block",
            height: $window.height()
        });
        $errorMsg.html(msg);
        return;
    }

    if (window.io) {
        window.socket = window.io.connect();
    }

/*
    var stats = new Stats();
    stats.domElement.style.position = "fixed";
    stats.domElement.style.right = "5px";
    stats.domElement.style.top = "5px";
    document.body.appendChild(stats.domElement);
    setInterval(function(){
        stats.update();
    }, 1000 / 30);
*/

    var imagesLoader = new lib.loader.ImagesLoader();
    var preloader = new imjcart.display.preloader.Preloader($("#preloader"));
    var main = new imjcart.display.main.Main($("#main"));
    //
    imagesLoader.addEventListener(lib.event.Event.LOADER_PROGRESS_EVENT, function(evt) {
        preloader.loaded = evt.loaded + 1;
    });
    imagesLoader.addEventListener(lib.event.Event.LOADER_COMPLETE_EVENT, function(evt) {
        preloader.close();
        main.open();
    });
    //
    preloader.open();
    var arr = [
        "img/sky.jpg",
        "img/base.jpg",
        "img/base2.png",
        "img/field.jpg",
        "img/grass.jpg",
        "img/grassLB.png",
        "img/grassLT.png",
        "img/grassRB.png",
        "img/grassRT.png",
        "img/sky.jpg",
        "img/startline.png"
    ];
    preloader.total = arr.length;
    imagesLoader.load(arr, 100);

});