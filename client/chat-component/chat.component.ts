import * as globalVars from "../service/global";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


/// <reference path="../../typings/globals/jquery/index.d.ts/>


import "/node_modules/browser-sync/node_modules/socket.io-client/socket.io.js";


@Component({
    moduleId: module.id,
    selector: "chat-page",
    templateUrl: "./chat.component.html"
})

export class ChatComponent {
    reference: any;
    resFlag: boolean = false;
    newUser: boolean = false;
    exitedUser: boolean = false;
    typingFlag: boolean = false;
    newUserName: string = null;
    selectedUser: string = "ALL";
    exitedUserName: string = null;
    sentMessageUsername: string = null;
    sentMessageUsername1: string = null;
    response: string;
    clientsNameList: number[];
    msgResponses: boolean[];
    resp: boolean[];
    toShow: boolean;
    message: string;
    currentUser: string;
    msgClass: string;
    myMsg: boolean;
    msgCount: number = 0;
    textMessage: string = null;
    userEntry: boolean = false;
    sidebar: boolean = false;
    constructor(private route: ActivatedRoute,
        private router: Router, ) {
        let reference = this;
        this.router = router;
        this.route = route;
        this.route.queryParams.subscribe(params => {
            this.currentUser = params['name'];
        });
        let temp;
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
                setTimeout(() => $("#typings").text(""), 3000);
            }
            else if (reference.sentMessageUsername1 === resObj.name) {
                reference.typingFlag = false;
                $("#typings").text("");
            }
        });

        globalVars.socket.on("updateSocketList", function (list) {
            reference.clientsNameList = list;
        });

        globalVars.socket.on("broadcastToAll_userResponse", function (list) {
            reference.msgResponses = list;
            if (reference.msgResponses[reference.msgCount - 1] === true) {
                $('.tick').text("dt");
            }
        });

        globalVars.socket.on("status", function (entry) {
            reference.userEntry = entry;
        });
        setTimeout(function () {
            if (!reference.userEntry) {
                router.navigate([''], { queryParams: { status: reference.userEntry } });
            }
        }, 1000);

        globalVars.socket.on("addUserToSocketList", function (username) {
            reference.exitedUser = false;
            reference.newUser = true;
            reference.newUserName = username.slice(0, -2);
        });

        globalVars.socket.on("removeUserFromSocketList", function (username) {
            reference.newUser = false;
            reference.exitedUser = true;
            reference.exitedUserName = username.slice(0, -2);
        });
    }

    updateCheckedOptions($event, name) {
        if ($event.target.checked) {
            this.selectedUser = name;
        }
    }

    sendMessage(data) {
        let reference = this;
        this.typingFlag = false;
        this.textMessage = data.value;
        let user = reference.selectedUser;
        if (this.textMessage) {
            this.resFlag = true;
            this.reference = this;
            globalVars.socket.emit("chatMessageToSocketServer", data.value, user, function (respMsg, username) {
                reference.sentMessageUsername = username;
                reference.response = respMsg;
            });
            $("#message-boxID").val("");
        }
    }
    closeAlert() {
        this.newUser = false;
        this.exitedUser = false;
    }

    openSidebar() {
        this.sidebar = true;
    }
    closeSidebar() {
        this.sidebar = false;
    }
    sendTyping(data) {
        this.typingFlag = true;
        this.resFlag = false;
        let reference = this;
        globalVars.socket.emit("userTyping", data.value, function (respMsg, username) {
            reference.sentMessageUsername1 = username;
            reference.response = respMsg;
        });
    }
    sendMessageOnEnter($event, messagebox) {
            this.sendTyping(messagebox);
            this.typingFlag = true;
    }

    update() {
        this.resFlag = false;
        this.newUser = false;
        this.exitedUser = false;
    }

}