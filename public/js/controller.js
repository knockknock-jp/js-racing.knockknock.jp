$(function () {

    // socket.io
    if (window.io) {
        window.socket = window.io.connect();
    }

    // imjcarté¿çs
    var controller = new imjcart.display.controller.Controller($("#controller"));
    controller.open();

});