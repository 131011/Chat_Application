"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if 
        (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var globalVars = require("../service/global");
//var core_2 = require("@angular/core");
//require("/socket.io/socket.io.js");
var NickNameComponent = (function () {
    function NickNameComponent(route, router) {
        this.nickname = null;
        var reference = this;
        this.suggest = true;
        this.route = route;
        this.router = router;

    }
    NickNameComponent.prototype.ngOnInit = function () {

        var _this = this;
        this.suggest = false;
        this.queries = new Array();
        this.name = sessionStorage.getItem('nickName');
        this.route.queryParams.subscribe(function (params) {
            _this.status = params['status'];
        });
        if (_this.status === "false") {
            $("#status").text("*Username Already Exists.");
            this.suggest = true;
            for (let i = 0; i < 3; i++) {
                let randomNo = Math.floor((Math.random() * 99));
                var finalNo = 0;
                if (randomNo <= 9) { finalNo = "0" + randomNo; }
                else if (randomNo <= 100) { finalNo = randomNo; }
                this.queries[i] = this.name + finalNo;
            }
        }
    }

    NickNameComponent.prototype.submit = function (data) {
        this.nickname = data.value;
        sessionStorage.setItem("nickName", this.nickname);
        if (this.nickname) {
            let randomNo = Math.floor((Math.random() * 30));
            let finalNo = 0;
            if (randomNo <= 9) { finalNo = "0" + randomNo; }
            else if (randomNo <= 31) { finalNo = randomNo; }
            let query = this.nickname + finalNo;
            globalVars.socket = io({ query: "userName=" + query });

            this.router.navigate(['/chat'], { queryParams: { name: query } });
        }
    };
    NickNameComponent.prototype.addNickname = function ($event, nickname) {

        if ($event.which === 13) {
            this.submit(nickname);
        }
    };
    return NickNameComponent;
}());
NickNameComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: "nick-name",
        templateUrl: "nickName.component.html"
    }),
   // __param(0, core_2.Inject(router_1.Router)),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router])
], NickNameComponent);
exports.NickNameComponent = NickNameComponent;
