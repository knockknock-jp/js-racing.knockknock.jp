var express = require("express");
var app = express();
var mongoose = require("mongoose");
var db = mongoose.connect("mongodb://localhost/jsracing");

//
app.set("view engine", "jade");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.get("/", function(req, res) {
    res.render("index", {
        title: "JS Racing",
        version: "ver1.2"
    });
});
app.get("/controller.html", function(req, res) {
    res.render("controller", {
        title: "JS Racing",
        version: "ver1.2",
        id: req.query.id
    });
});

app.set("port", process.env.PORT || 3000);
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
server.listen(app.get("port"), function(){
    console.log("Express server listening on port " + app.get("port"));
});

//
var socketArr = [];
io.sockets.on("connection", function(socket){
    socket.emit("emit_id_form_server", socket.id);
    socket.on("emit_carcondition_form_client", function(data){
        var info = {
            id: socket.id,
            name: data.name,
            x: data.x,
            y: data.y,
            bodyAngle: data.bodyAngle,
            wheelAngle: data.wheelAngle,
            speed: data.speed,
            colorBody: data.colorBody,
            colorWing: data.colorWing,
            colorDriver: data.colorDriver
        };
        var flg = true;
        var i = 0, max;
        for (i = 0, max = socketArr.length; i < max; i = i + 1) {
            if (socketArr[i].id == info.id) {
                socketArr[i] = info;
                flg = false;
            }
        }
        if (flg) {
            socketArr.push(info);
        }
        //console.log("connect : " + socket.id + ", " + data.x + ", " + data.y + ", " + data.bodyAngle + ", " + data.wheelAngle + ", " + data.speed + ", " + data.colorBody + ", " + data.colorWing + ", " + data.colorDriver);
    });
    socket.on("emit_controller_data_form_client", function(data){
        var id = data.id;
        var event = data.event;
        var value = data.value;
        //
        var flg = false;
        var sockets = io.sockets.sockets;
        var i = 0, max;
        for (i = 0, max = sockets.length; i < max; i = i + 1) {
            if (sockets[i].id == id) {
                sockets[i].emit("emit_controller_data_from_server", {
                    id: id,
                    event: event,
                    value: value
                });
                flg = true;
            }
        }
        if (!flg) {
            socket.emit("emit_disconnect_client_from_server");
        }
        // console.log("id : " + id + ", event : " + event + ", value : " + value);
    });
    socket.on("disconnect", function(){
        var arr = [];
        var i = 0, max;
        for (i = 0, max = socketArr.length; i < max; i = i + 1) {
            if (socketArr[i].id != socket.id) {
                arr.push(socketArr[i]);
            }
        }
        socketArr = arr;
        // console.log("disconnect : " + socket.id);
    });
    setInterval(function(){
        socket.emit("emit_other_carcondition_from_server", socketArr);
        //socket.broadcast.emit("emit_other_carcondition_from_server", socketArr);
    }, 1000 / 4);
    //
    socket.on("get_ranking_from_client", function(data){
        Users.find().sort("time").skip(data.skip).limit(data.limit).exec(function(err, users){
            if(err) {
                console.log(err);
                return;
            }
            socket.emit("get_ranking_from_server", users);
        });
    });
    socket.on("save_laptime_from_client", function(user){
        var users = new Users(user);
        users.save(function(err) {
            if(err) {
                console.log(err);
                return;
            }
/*
            Users.find().sort("time").update({}, {runningPath: []}, {multi: true}, function(err, numberAffected, raw){
                console.log(numberAffected);
                console.log(raw);
                if(err) {
                    console.log(err);
                    return;
                }
            });
*/
            Users.find().sort("time").skip(10).exec(function(err, users){
                if(err) {
                    console.log(err);
                    return;
                }
                Users.update({
                _id: {
                    $in: users.map(function (user) {
                        return user._id;
                    })
                }}, {runningPath: []}, {multi: true}, function(err, numberAffected, raw){
                    //console.log(numberAffected);
                    //console.log(raw);
                    if(err) {
                        console.log(err);
                        return;
                    }
                });
            });
            Users.find().sort("time").exec(function(err, users){
                if(err) {
                    console.log(err);
                    return;
                }
                //
                var id = null;
                var time = null;
                var rank = null;
                var length = users.length;
                var name = null;
                var comment = null;
                var colorBody = null;
                var colorWing = null;
                var colorDriver = null;
                var runningPath = null;
                var i = 0, max;
                for (i = 0, max = users.length; i < max; i = i + 1) {
                    if (socket.id == users[i].id && user.time == users[i].time) {
                        id = users[i].id;
                        time = users[i].time;
                        rank = i + 1;
                        name = users[i].name;
                        comment = users[i].comment;
                        colorBody = users[i].color.body;
                        colorWing = users[i].color.wing;
                        colorDriver = users[i].color.driver;
                        runningPath = users[i].runningPath;
                        break;
                    }
                }
                socket.emit("save_laptime_from_server", {
                    id: id,
                    time: time,
                    rank: rank,
                    length: length,
                    name: name,
                    comment: comment,
                    colorBody: colorBody,
                    colorWing: colorWing,
                    colorDriver: colorDriver,
                    runningPath: runningPath
                });
            });
        });
    });
});
io.sockets.on("disconnect", function(){

});
io.set("log level", 1);

//
var UserSchema = new mongoose.Schema({
    id:String,
    name:String,
    date:String,
    time:Number,
    comment: String,
    color: {
        body: String,
        wing: String,
        driver: String
    },
    runningPath: Array
});
var Users = db.model("user", UserSchema);