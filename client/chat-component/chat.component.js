"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if
        (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var globalVars = require("../service/global");
//require("/socket.io/socket.io.js");
var ChatComponent = (function () {
    function ChatComponent(route, router) {
        this.router = router;
        this.route = route;
        this.resFlag = false;
        this.newUser = false;
        this.typingFlag = false;
        this.exitedUser = false;
        this.newUserName = null;
        this.exitedUserName = null;
        this.sentMessageUsername = null;
        this.sentMessageUsername1 = null;
        this.sentMessageUsername2 = null;
        this.msgCount = 0;
        this.textMessage = null;
        var reference = this;
        this.userEntry = false;
        this.selectedUser = "ALL";
        this.resp = [];
        this.msgResponses = [];
        this.sidebar = false;

        this.route.queryParams.subscribe(function (params) {
            reference.currentUser = params['name'];
        });
        var temp;
        var colors = ['red', 'green', 'blue', 'orange', 'fuchsia', 'aqua', 'aquamarine', 'blueviolet',
            'brown', 'burlywood', 'crimson', 'chocolate', 'coral', 'chartreuse', 'cyan', 'darkcyan',
            'cadetblue', 'saddlebrown', 'salmon', 'firebrick', 'goldenrod', 'dodgerblue', 'deepskyblue',
            'navy', 'darkslategray', 'greenyellow', 'cornflowerblue', 'darkorchid', 'deeppink', 'darkolivegreen', 'indigo'];
      
        globalVars.socket.on("broadcastToAll_chatMessage", function (resObj) {
            this.reference = this;
            reference.msgCount++;
            reference.resFlag = false;
            reference.typingFlag = false;
            reference.toShow = true;
            if (reference.sentMessageUsername !== resObj.name) {
                if (resObj.selName !== "ALL") {
                    if (reference.currentUser === resObj.selName) {
                        reference.msgClass = 'left-msg1';
                        reference.myMsg = false;
                    } else { reference.toShow = false; }
                } else {
                    reference.msgClass = 'left-msg';
                    reference.myMsg = false;
                }
            }
            else if (reference.sentMessageUsername === resObj.name) {
                reference.msgClass = 'right-msg';
                reference.myMsg = true;
                reference.sentMessageUsername = null;
            }
            if (reference.toShow) {
                var lasttwo = resObj.name.substr(resObj.name.length - 2);
                let last;
                let finalname = resObj.name.slice(0, -2) + " : ";
                if (lasttwo.charAt(0) == 0) {
                    last = lasttwo.charAt(1);
                } else {
                    last = lasttwo;
                }
                $("#messages").append($("<li data-index=" + reference.msgCount + ">"));
                $("li[data-index=" + reference.msgCount + "]").append($("<div class=" + reference.msgClass + " data-index=" + reference.msgCount + ">"));
                if (!reference.myMsg) {
                    reference.resp[reference.msgCount] = true;
                    $("div[data-index=" + reference.msgCount + "]").append($("<span class='name' style='color:" + colors[last] + "'>").text(finalname));
                } 
                $("div[data-index=" + reference.msgCount + "]").append($("<span class='msg'>").text(resObj.msg));
                if (reference.myMsg) {
                    reference.resp[reference.msgCount] = false;
                    $("div[data-index=" + reference.msgCount + "]").append($("<span data-index=" + reference.msgCount + " class='tick'>&#10003;</span>"));
                }
                $("div[data-index=" + reference.msgCount + "]").append($("<span class='date'>").text(resObj.dt));
                $("#messages").append($("<br>"));
                globalVars.socket.emit("msgResp", reference.resp[reference.msgCount]);
            }
        });
       
        globalVars.socket.on("typingBroadcastToAll_chatMessage", function (resObj) {
            reference.typingFlag = true;
            let finalname = resObj.name.slice(0, -2) + " : ";
            if (reference.sentMessageUsername1 !== resObj.name) {
                $("#typings").text(finalname + " typing...");
                setTimeout(() => $("#typings").text(""), 9000);
            }
            else if (reference.sentMessageUsername1 === resObj.name) {
                reference.typingFlag = false;
                $("#typings").text("");
            }
        });
        globalVars.socket.on("updateSocketList", function (list) {
            this.reference = this;
            reference.clientsNameList = list;
        });
        globalVars.socket.on("broadcastToAll_userResponse", function (list) {
            this.reference = this;
            reference.msgResponses = list;
            if (reference.msgResponses[reference.msgCount - 1] === true) {
                $(".tick").text("dt");
            }
        });
        globalVars.socket.on("status", function (entry) {
            this.reference = this;
            reference.userEntry = entry;
        });
        setTimeout(function () {
            if (!reference.userEntry) {
                router.navigate([''], { queryParams: { status: reference.userEntry } });
            }
        }, 1000);
        globalVars.socket.on("addUserToSocketList", function (username) {
            this.reference = this;
            reference.exitedUser = false;
            reference.newUser = true;
            reference.newUserName = username.slice(0, -2);
        });
        globalVars.socket.on("removeUserFromSocketList", function (username) {
            this.reference = this;
            reference.newUser = false;
            reference.exitedUser = true;
            reference.exitedUserName = username.slice(0, -2);
        });
    }
    ChatComponent.prototype.updateCheckedOptions = function ($event, name) {
        if ($event.target.checked) {
            this.selectedUser = name;
        }
    };
    ChatComponent.prototype.sendMessage = function (data) {
        let reference = this;
        this.typingFlag = false;
        this.sendTime = new Date();
        this.textMessage = data.value;
        let user = reference.selectedUser;
        if (this.textMessage) {
            this.resFlag = true;
            this.reference = this;
            globalVars.socket.emit("chatMessageToSocketServer",
                data.value,
                user,
                function (respMsg, username) {
                    reference.sentMessageUsername = username;
                    reference.response = respMsg;
                });
            $("#message-boxID").val("");
        }
    };
    ChatComponent.prototype.sendTyping = function (data) {
        this.typingFlag = true;
        this.resFlag = false;
        let reference = this;
        globalVars.socket.emit("userTyping", data.value, function (respMsg, username) {
            reference.sentMessageUsername1 = username;
            reference.response = respMsg;
        });

    };
    ChatComponent.prototype.closeAlert = function () {
        this.newUser = false;
        this.exitedUser = false;
    };
    
    ChatComponent.prototype.openSidebar = function () {
        this.sidebar = true;
    };
    ChatComponent.prototype.closeSidebar = function () {
        this.sidebar = false;
    };
    ChatComponent.prototype.sendMessageOnEnter = function ($event, messagebox) {
            this.sendTyping(messagebox);
            this.typingFlag = true;
    };
    ChatComponent.prototype.update = function () {
        this.resFlag = false;
        this.newUser = false;
        this.exitedUser = false;
    };
    return ChatComponent;
}());
ChatComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: "chat-page",
        templateUrl: "./chat.component.html"
    }),
     __metadata("design:paramtypes", [
        router_1.ActivatedRoute,
        router_1.Router])
], ChatComponent);
exports.ChatComponent = ChatComponent;