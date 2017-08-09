"use strict";
let express = require("express");
var path = require('path');
let chatApp = require('express')();
//var server = chatApp.listen(process.env.PORT || 3000);
let http = require('http').createServer(chatApp);
//let http = require('http').Server(chatApp);
//let io = require('socket.io')(http);
//let io = require('socket.io').listen(server);
var io = require('socket.io')({ transports: ['websocket'] }); 

io.attach(http); //working

let clientListNames = [];
let nameArr = [];
let userEntry = true;

chatApp.use(express.static(__dirname, '/'));
chatApp.use(express.static(__dirname + '/client/'));
chatApp.use(express.static(__dirname + '/node_modules'));

chatApp.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

chatApp.get('/chat', function (req, res) {
    res.redirect('/');
});

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return day + ":" + month + ":" + year + " " + hour + ":" + min + ":" + sec;

}

io.on('connection', function (socket) {

    if (nameArr.indexOf(socket.handshake.query.userName.slice(0, -2)) > -1) {
        userEntry = false;
    } else {
        userEntry = true;
        clientListNames.push(socket.handshake.query.userName);
        let name = socket.handshake.query.userName;

        io.emit("status", userEntry);
        io.emit("updateSocketList", clientListNames);
        io.emit("addUserToSocketList", socket.handshake.query.userName);
        nameArr.push(socket.handshake.query.userName.slice(0, -2));
        socket.on('disconnect', function () {
            let name = socket.handshake.query.userName;
            let userIndex = clientListNames.indexOf(socket.handshake.query.userName);
            if (userIndex !== -1) {
                clientListNames.splice(userIndex, 1);
                io.emit("updateSocketList", clientListNames);
                io.emit("removeUserFromSocketList", name);
            }
        });

        socket.on('chatMessageToSocketServer', function (msg, selName, func) {
            func("Message Sent!", socket.handshake.query.userName);
            let name = socket.handshake.query.userName;
            let dt = getDateTime();
            let sockectObj = { name, msg, dt, selName }
            io.emit('broadcastToAll_chatMessage', sockectObj);
        });
        let respArr = [];
        socket.on('msgResp', function (msg) {
            respArr.push(msg);
            io.emit('broadcastToAll_userResponse', respArr);
        });

        socket.on('userTyping', function (msg, func) {
            func("Message Sent!", socket.handshake.query.userName);
            let name = socket.handshake.query.userName;
            let sockectObj = { name, msg }
            io.emit('typingBroadcastToAll_chatMessage', sockectObj);
        });

    }

});

http.listen(process.env.PORT || 3000, function () {
    console.log('listening...');
});

//require('socket.io-client')('http://localhost:3000');