$(function () {

    // socket.io
    if (window.io) {
        window.socket = window.io.connect();
    }

    // imjcart���s
    var controller = new imjcart.display.controller.Controller($("#controller"));
    controller.open();

});