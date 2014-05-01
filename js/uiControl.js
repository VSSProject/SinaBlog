/// <reference path="jquery.js" />
/// <reference path="json.js" />


//HashArray 组件 用于保存对象.
function HashArray() {
    this.minusLen = 6;
};
HashArray.prototype.getLength = function () {
    var len = 0;
    for (var v in this) {
        len++;
    }
    return len - this.minusLen;
};
HashArray.prototype.exec = function (callBack) {
    var iCnt = 0;
    if (callBack) {
        for (var v in this) {
            callBack(v, this[v]);
            iCnt++;
        } 
        return iCnt;
    }
    else {
        return -1;
    }
};
HashArray.prototype.add = function (key, val) {
    if (key && val) {
        if (this[key]) {
            return this[key];
        }
        else {
            this[key] = val;
            return 0;
        }
    }
    else {
        return -1;
    }
};
HashArray.prototype.set = function (key, val) {
    if (key && val) {
        if (this[key]) {
            this[key] = val;
            return 1;
        }
        else {
            return -1;
        }
    }
    else {
        return -1;
    }
};
HashArray.prototype.clear = function () {
    //此方法未完成 需遍历
    alert("此方法未完成!BUG!");
}
HashArray.prototype.del = function (key, val) {
    var iCnt = 0;
    if (key) {
        if (val) {
            if (this[key] == val) {
                this[key] = undefined;
                iCnt++;
            }
            else return -1; // Return The Key is NOT match the value !  No Remove !
        }
        else {
            this[key] = undefined;
            this.minusLen++;
            return 1; // iCnt=1;
        }
    }
    else {
        if (val) {
            for (var v in this) {
                if (this[v] == val) {
                    this[v] = undefined;
                    iCnt++;
                }
            }
        } else {
            this.clear();
            return 0;
        }
    }
    return iCnt; //Return The Lines to Remove
};


//SwitchDiv 组件 用于页面拉伸
function SwitchDiv(sDiv, sCur) {
    var _this = this;
    this.jqDiv = $("#" + sDiv);
    this.iWaitX = 0;
    this.iWaitY = 0;
    this.jqDivs = $("#" + sDiv + ">div");
    this.jqDivs.animate({ left: 9999, top: 9999 }, 0);
    this.jqCur = sCur ? $(sCur) : this.jqDivs.first();
    this.jqCur.animate({ left: 0, top: 0 }, 0);
    this.jqDiv.height(this.jqCur.height());
};
SwitchDiv.prototype.initPos = function (sMode, iIdx) {
    if (!sMode) {
        if (!iIdx) alert("Use Auto Mode Must Set The iIdx Param!");
        var iCurIdx = this.jqCur.data("IDX");
        sMode = Math.ceil(iCurIdx / 4) == Math.ceil(iIdx / 4) ? (iIdx > iCurIdx ? "RIGHT" : "LEFT") : (iIdx > iCurIdx ? "BOTTOM" : "TOP");
    }
    switch (sMode) {
        case "LEFT":
            this.iWaitY = 0;
            this.iWaitX = -this.jqCur.width();
            break;
        case "RIGHT":
            this.iWaitY = 0;
            this.iWaitX = this.jqDiv.width();
            break;
        case "TOP":
            this.iWaitX = 0;
            this.iWaitY = -this.jqCur.height();
            break;
        case "BOTTOM":
            this.iWaitX = 0;
            this.iWaitY = this.jqDiv.height();
            break;
        default:
            alert("Unknown Mode!");
    }
}
//根据停留时间，依次切换。
SwitchDiv.prototype.begin = function (iMinisec, sMode, iWaitMinisec, iTimes) {
    //保留作为首页八部分中两块的动静切换动画.
};
SwitchDiv.prototype.change = function (sDiv, iMinisec, sMode) {
    var _this = this;
    var jqDiv = $("#" + sDiv); //不再检查参数所表示的DIV是否属于主DIV之内.
    if (this.jqCur.attr("id") == sDiv) return;
    this.initPos(sMode, jqDiv.data("IDX"));
    jqDiv.animate({ left: this.iWaitX, top: this.iWaitY }, 0);
    this.jqCur.animate({ left: 0 - this.iWaitX, top: 0 - this.iWaitY }, iMinisec, "swing", function () {
        _this.jqDiv.animate({ height: jqDiv.height() }, iMinisec, "swing");
    });
    jqDiv.animate({ left: 0, top: 0 }, iMinisec, "swing");
    this.jqCur = jqDiv;
};

//----------------------------------消息模版渲染组件-----------------------

// 参数为父DIV
function BlogMsgBox(sDiv) {
    this.jqDiv = $("#" + sDiv);
    this.hMsg = new HashArray();
};

BlogMsgBox.prototype.addMsg = function (sTemp, jMsg, bSlide) { //bSlide控制是否使用上下滑动特效，消耗性能较大，勿同时多个对象使用！
    if (sTemp && jMsg) {
        var strObj = "";
        switch (sTemp) {
            case "MainMsgTemplate":
                strObj += "\
                    <li>\
                        <div class='mcUserPic'>\
                            <a href='javascript:void(0);'>\
                                <img alt='" + jMsg.strNickName + "' src='" + jMsg.imgHeadSrc + "' /></a>\
                        </div>\
                        <div class='ucMessage'>\
                            <div class='ucmText'>\
                                " + jMsg.strContent + "</div>\
                        ";

                if (jMsg.strObjPicUrl != "") {
                    strObj += "\
                        <img width='200px' height='150px' src='API/GetFile.aspx?fileID=" + jMsg.strObjPicUrl + "' />\
                        ";
                }


                //                if (jMsg.bstrReply[1]) { //转播
                //                    strObj += "\
                //                        <div class='ucmTurn'>\
                //                            <span>" + jMsg.TurnNick + "：</span>" + jMsg.TurnText + "\
                //                        </div>\
                //                    ";
                //                } //根据逻辑处理OBJ显示问题。





                strObj += "\
                            <div class='ucmPubInfo'>\
                                <div class='ucmpText'>\
                                    " + jMsg.strWriteDate + " <span> From " + jMsg.strFromClient + "</span></div>\
                        ";

                strObj += "\
                            <div class='ucmpAll'>\
                            <a href='#'>\
                          ";
                if (jMsg.intReplyNum > 0) {
                    strObj += "\
                                全部转播和评论(<b>" + jMsg.intReplyNum + "</b>)\
                            ";
                }
                strObj += "\
                            </a></div>\
                        ";
                if (jMsg.bstrReply[0] == '1')//要根据实际数据再进一步解析！！！未完成！
                {
                    strObj += "\
                                <div class='ucmpCmd'>\
                                    <a href='javascript:void(0);' >转播</a>|<a href='#'>评论</a>|<a href='#'>更多</a></div>\
                            ";
                }
                strObj += "\
                                    </div>\
                                </div>\
                            </li>\
                        ";
                if (this.hMsg.add(jMsg.strMsgID, $(strObj)) == 0) {
                    //在这里没有直接引用$(strObj)而使用HashArray是因为可以防止插入重复消息
                    this.jqDiv.prepend(this.hMsg[jMsg.strMsgID]);
                    if (bSlide) {
                        this.hMsg[jMsg.strMsgID].slideUp(0);
                        this.hMsg[jMsg.strMsgID].slideDown(600);
                    }
                }
                break;

            //-------------------------------------------------------表示渲染好友列表----------------------------------------------------------                        

            case "FindFriendTemplate":
                strObj += "\
                    <li onmouseover='FriendLiMouseOverCallBack(" + '"' + jMsg.strUin + '"' + ")'>\
                        <div class='mcUserPic'>\
                            <a href='javascript:void(0)'>\
                                <img src=" + jMsg.strHeadUrl + " /></a>\
                        </div>\
                        <div class='ucMessage2'>\
                            <div class='ucFindTitle'>\
                                <a href='javascript:void(0)' >" + jMsg.strNick + "</a><span>(@" + jMsg.strUin + ")</span>\
                            </div>\
                            <div class='mcListenList'>\
                                <a href='javascript:void(0)'>听众：<strong>" + jMsg.intFollow + "</strong>人</a>\
                                <a href='javascript:void(0)'>他收听：<strong>" + jMsg.intListen + "</strong>人</a>\
                                <a href='javascript:void(0)'>收录他的名单：<strong>" + jMsg.intSend + "</strong>人</a>\
                            </div>\
                            <div class='ucmPubInfo'>\
                                <div class='ucmPerInfo'>\
                                    个人简介绍：" + jMsg.strPerInfo + "</div>\
                                <div class='ucmPerInfo'>\
                                    家乡：" + jMsg.strHome + "</div>\
                                <div class='ucmPerInfo'>\
                                    行业：" + jMsg.strSubject + "</div>\
                            </div>\
                            <div class='mcFindBlank'>\
                            </div>";
                if (jMsg.ajLabel == 70) {
                    strObj += "<input type='button' style='background-image:url(js/css/image/MidListen.jpg);' onclick='SearchAddListen(this,&quot;" + jMsg.strUin + "&quot;);' />";
                }
                else {
                    strObj += "<input type='button' style='background-image:url(js/css/image/MidNoListen.jpg);' onclick='SearchAddListen(this,&quot;" + jMsg.strUin + "&quot;);' />";
                }
                strObj += "\
                        </div>\
                    </li>\
                        ";
                if (this.hMsg.add(jMsg.strUin, $(strObj)) == 0) {
                    //在这里没有直接引用$(strObj)而使用HashArray是因为可以防止插入重复消息
                    this.hMsg.add("jMsg" + jMsg.strUin, jMsg);
                    this.jqDiv.prepend(this.hMsg[jMsg.strUin]);
                    if (bSlide) {
                        this.hMsg[jMsg.strUin].slideUp(0);
                        this.hMsg[jMsg.strUin].slideDown(600);
                    }
                }
                break;
            case "ListenSelectListTemplate":
                strObj += "\
                <div class='ldBox'>\
                    <div class='ldLeft'>\
                        <a href='javascript:void(0);' class='ldlHead'>\
                            <img src=" + jMsg.strHeadImg + " alt=" + jMsg.strNick + " />\
                        </a>\
                        <div class='ldlListen'>\
                            <input type='button' onclick='WelcomeAddListen(this," + jMsg.strUin + ");' />\
                        </div>\
                    </div>\
                    <div class='ldRight'>\
                        <a href='javascript:void(0);' class='ldrNick'>" + jMsg.strNick + "</a>\
                        <div class='ldrUser'>\
                            @" + jMsg.strUser + "</div>\
                        <div class='ldrListen'>\
                            听众" + jMsg.intListen + "人</div>\
                    </div>\
                </div>\
                ";
                if (this.hMsg.add(jMsg.strUin, $(strObj)) == 0) {
                    //在这里没有直接引用$(strObj)而使用HashArray是因为可以防止插入重复消息
                    this.jqDiv.prepend(this.hMsg[jMsg.strUin]);
                    if (bSlide) {
                        this.hMsg[jMsg.strUin].slideUp(0);
                        this.hMsg[jMsg.strUin].slideDown(600);
                    }
                }
                break;
            default:
                alert("类别错误!");
                break;
        }
        return 0;
    }
    else {
        return -1;
    }
};
jListenBox = {
    strUin: 10005,
    strNick: "寻雨",
    strHeadImg: "css/image/50.jpg",
    strUser: "wmw1989",
    intListen: 434,
    bListen: false
};

BlogMsgBox.prototype.clear = function () {
    this.hMsg = new HashArray();
    this.jqDiv.html("");
}

BlogMsgBox.prototype.delMsg = function (strMsgID, bSlide) {//bSlide控制是否使用上下滑动特效，消耗性能较大，勿同时多个对象使用！
    if (!strMsgID) return -1;
    var _this = this;
    this.hMsg[strMsgID].slideUp(600, function () {
        _this.hMsg[strMsgID].remove(); //这里有个小BUG，日后处理下，关于HashArray中remove后getLength()的计算！！！
        _this.hMsg.del(strMsgID);
    });
};

//---------------------组件最左测消息提示框---------------------------//
function MsgNumBox(sDiv) {
    var jqDiv = $("#" + sDiv);
}

MsgNumBox.prototype.setUpdate = function (jUpdatePkg, func) {
    if (jUpdatePkg) {
        for (var v in jUpdatePkg) {
            if (jUpdatePkg[v] != 0) {
                if (jUpdatePkg[v] != $("#" + v + ">div").text()) {
                    $("#" + v + ">div").show();
                    $("#" + v + ">div").text(jUpdatePkg[v]);
                    if (func) func(v);
                }
            }
            else {
                $("#" + v + ">div").hide();
            }
        }
    }
}

//---------------------中间迷你顶层菜单组件---------------------------
function MidFixedMenu(sDiv, sFir, sSec, sFB, sSB) {
    MidFixedMenu.getObject = this;
    this.jqDiv = $("#" + sDiv);
    this.jqFirDiv = $("#" + sFir);
    this.jqSecDiv = $("#" + sSec);
    this.jqFB = $("#" + sFB);
    this.jqSB = $("#" + sSB);
    this.bFixed = true; //配置是否响应Window.Scroll事件!响应的话菜单会跟随滚动固定.
    this.bShowWrite = true; //配置是否显示写入框
    this.bSetWrite = true; //用于在滚动切换时记录下当前的写入框状态,将在滚动回归时进行配置.
    this.bBlockWrite = false; //配置响应Windows.Scroll时,使写入框也跟随滚动固定.
    this.bTopZone = true; //描述用户滚动是否在上部区域
    this.iMenuHeight = this.jqSecDiv.height();
    this.iFirHeight = this.jqFirDiv.height();
    this.iBlockHeight = this.iFirHeight + this.iMenuHeight;
    this.jqFB.height(this.iFirHeight);
    this.jqSB.height(this.iMenuHeight);
    this.jqFB.slideUp(0);
    this.jqSB.slideUp(0);
    this.jqDiv.css("z-index", 80);
    this.jqFirDiv.css("z-index", 80);
    this.jqSecDiv.css("z-index", 80);
    if (this.bFixed && this.bBlockWrite) {
        this.jqDiv.css("position", "fixed");
        this.jqDiv.parent().height(this.iMenuHeight);
        this.jqFB.slideDown(0);
    }
    else {
        //        this.jqFB.slideUp(0);
        //        this.jqSB.slideUp(0);
    }
    $(window).scroll(this.winScrollCallBack);
}

MidFixedMenu.prototype.winScrollCallBack = function () {
    var _this = MidFixedMenu.getObject;
    if (_this.bFixed) {
        if (_this.bBlockWrite) return;
        if ($(window).scrollTop() >= _this.iFirHeight) {
            if (_this.bTopZone) {
                if (!_this.bShowWrite) return;
                _this.bSetWrite = _this.bShowWrite;
                _this.jqDiv.css("position", "fixed");
                _this.bShowWrite = false;
                _this.jqFirDiv.slideUp(0);
                _this.jqDiv.scrollTop(0);
                _this.bTopZone = false;
            }
        }
        else {
            if ($(window).scrollTop() >= _this.iMenuHeight && _this.bTopZone && !_this.bShowWrite) {
                _this.jqDiv.parent().height(_this.iMenuHeight);
                _this.jqDiv.css("position", "fixed");
                _this.jqDiv.scrollTop(0);
            }
            if (!_this.bTopZone) {//换区
                _this.bShowWrite = _this.bSetWrite; //还原用户意愿设置
                if (_this.bShowWrite) {
                    _this.jqFirDiv.slideDown(0);
                    _this.jqFB.slideUp(0);
                    _this.jqSB.slideUp(0);
                    _this.jqDiv.parent().height(_this.iBlockHeight);
                    _this.jqDiv.parent().slideDown(0);
                    _this.jqDiv.scrollTop(0);
                    $(window).scrollTop(0);
                    _this.jqDiv.css("position", "static");
                }
                else {
                    _this.jqFirDiv.slideUp(0);
                    _this.jqDiv.parent().height(_this.iMenuHeight);
                    _this.jqDiv.scrollTop(0);
                }
            }
            _this.bTopZone = true;
        }
    }
}

MidFixedMenu.prototype.setFixed = function (isFixed) {
    this.bFixed = isFixed;
}

MidFixedMenu.prototype.showBlock = function () {
    //暂不验证sDiv是否一定存在于jqDiv中
    var _this = this;
    if (!this.bShowWrite) {
        this.bShowWrite = true;
        if (this.bTopZone) {
            this.jqFirDiv.slideDown(599);
            this.jqFB.slideDown(599, function () {
                _this.jqDiv.parent().height(_this.iBlockHeight);
                _this.jqFB.slideUp(0);
                _this.jqDiv.css("position", "static");
                _this.jqDiv.scrollTop(0);
            });
        } else {
            this.jqFirDiv.slideDown(599);
            if ($(window).scrollTop() >= this.iFirHeight) {
                this.jqFB.slideDown(599);
            } else {
                this.jqFB.slideDown(599, function () {
                    _this.jqDiv.parent().height(_this.iBlockHeight);
                    _this.jqFB.slideUp(0);
                });
            }
        }
    }
    this.bSetWrite = this.bShowWrite;
}

MidFixedMenu.prototype.hideBlock = function () {
    //暂不验证sDiv是否一定存在于jqDiv中
    var _this = this;
    if (this.bShowWrite) {
        this.bShowWrite = false;
        if (this.bTopZone) {
            _this.jqDiv.parent().height(_this.iMenuHeight);
            _this.jqDiv.css("position", "fixed");
            _this.jqDiv.scrollTop(0);
            this.jqFB.slideDown(0);
            this.jqFB.slideUp(599);
            this.jqFirDiv.slideUp(599, function () {
                _this.jqSB.slideUp(0);
            });
        }
        else {
            this.jqFirDiv.slideUp(599);
            if ($(window).scrollTop() >= this.iFirHeight) {
                this.jqFB.slideUp(599);
            } else {
                this.jqDiv.parent().height(this.iMenuHeight);
                this.jqFB.slideDown(0);
                this.jqFB.slideUp(599);
            }
        }
    }
    this.bSetWrite = this.bShowWrite;
}

//-----------------------------个人信息组件---------------------------

jPerInfo = {
    strUin: "1098089023A", //标识唯一ID
    strHeadUrl: "css/image/50.jpg", //标识URL的图标
    intListen: 800, //被听众数
    intFollow: 1600, //收听别人数
    intSend: 2048, // 发送的广播数
    intSave: 10, //被收录数
    strSex: "男A", //男OR女
    strStar: "双子座B", //星座
    strOld: "80后C", //微缩年龄
    strSubject: "互联网、IT技术D", //表示行业
    strHome: "河北省石家庄市E", //家乡
    strPlace: "广东省深圳市F", //现居地
    strUrl: "http://www.cnblogs.com/wmw1989/G", //个人主页
    strPerInfo: "H一个小小的程序员，希望能通过自己的努力，成长起来，通过IT，为社会为国家贡献出自己的一份力！", //个人简介
    ajLabel: []//Json数组 存储标签的相关对象
};

//存储标签的相关对象
function jLabel(strLbl, strUrl, strID) {
    this.strID = strID;
    this.strName = strLbl;
    this.strUrl = strUrl;
}

function PersonInfoBox(sDiv) {
    this.jqDiv = $("#" + sDiv);
}

PersonInfoBox.prototype.SetJsonContent = function (jPerInfo) {
    for (var v in jPerInfo) {
        if (v == "strUser") continue; //为了兼容好友
        if (typeof (jPerInfo[v]) != "object") {
            var jq = $("#" + v);
            if (jq[0]) {
                if (jq[0].tagName == "IMG") {
                    jq.attr("src", jPerInfo[v]);
                }
                else if (jq[0].tagName == "A") {
                    if (jq.attr("href") == "#") {
                        jq.attr("href", jPerInfo[v]);
                    }
                    jq.text(jPerInfo[v]);
                }
                else {
                    jq.text(jPerInfo[v]);
                }
            }
        }
    }
    return;
}

//-------------------------------------评分组件-------------------------------
function StarScore(sDiv) {
    this.jqDiv = $("#" + sDiv);
    this.iScore = 0;
    this.sBlankSrc = "cssindex/image/p4ImgBlankStar.jpg";
    this.sFullSrc = "cssindex/image/p4ImgStar.jpg";
}
StarScore.prototype.SetStarFullByInt = function (i) { //OnClick
    this.SetStarEmpty();
    for (var cur = 0; cur < i; cur++) {
        this.jqDiv.children()[cur].src = this.sFullSrc;
    }
    this.iScore = i;
}
StarScore.prototype.SetStarEmpty = function () {
    for (var cur = 0; cur < 5; cur++) {
        this.jqDiv.children()[cur].src = this.sBlankSrc;
    }
}
StarScore.prototype.SetStarFullByIscore = function () {
    this.SetStarFullByInt(this.iScore);
}


//-----------------通讯转JSON---------------------------
function PackingPkg(jMsg) {
    return JSON.stringify(jMsg);
}

function UnpackingjRet(jRet) {
    if (typeof jRet == "string") {
        if (jRet == "NOPARAMS") {
            window.alert("Called No Params!");
            return null;
        }
        else if (jRet == "NOLOGIN") {
            location.href = "index.htm";
            return null;
        } else if (jRet == "SUCCESS") {
            return null;
        } else if (jRet == "") {
            return {};
        }

        return eval('(' + jRet + ')');
    }
    else {
        return jRet;
    }
}

//----------------------------窗口组件------------------------

function ChildWindow(sDiv) {
    this.jqDiv = $("#" + sDiv);
    this.strBkgColor = "#2B2B2B";
    //构造遮罩层
    if (!ChildWindow.prototype.hideDiv) {
        var jqHideDiv = $("<div id='UI__ChildWindow__HideDiv__' ></div>");
        ChildWindow.prototype.hideDiv = jqHideDiv;
        jqHideDiv.css("position", "fixed");
        jqHideDiv.css("background-color", this.strBkgColor);
        jqHideDiv.css("z-index", "10");
        this.hideDiv.fadeTo(0, 0.3);
        this.hideDiv.animate({ left: $(window).width() / 2, top: $(window).height() / 2, height: 0, width: 0 }, 0);
        jqHideDiv.hide();
        jqHideDiv.appendTo($("body"));
    }
    this.jqDiv.hide();
    this.jqDiv.css("position", "absolute");
    this.jqDiv.css("z-index", "80");
    this.jqDiv.animate({
        left: ($(window).width() - this.jqDiv.width()) / 2,
        top: ($(window).height() - this.jqDiv.height()) / 2
    }, 0);
}

ChildWindow.prototype.showPage = function () {
    this.jqDiv.fadeIn(300);
}

ChildWindow.prototype.closePage = function () {
    this.jqDiv.fadeOut(300);
}

ChildWindow.prototype.loadUrl = function (url, sDiv) { //GET URL 并分析取得其中的sDiv展示出来
}

ChildWindow.prototype.show = function (func, bDiv) { // 显示整个界面 等遮罩完全打开后执行func函数
    var _this = this;
    this.hideDiv.show();
    if (bDiv) this.showPage();
    this.hideDiv.animate({ left: 0, top: 0, height: $(window).height(), width: $(window).width() }, 300, function () {
        if (func) func(_this.hideDiv, _this.jqDiv);
    });
}
ChildWindow.prototype.close = function (func) { // 隐藏整个界面 等遮罩完全关闭后执行func函数
    var _this = this;
    this.closePage();
    this.hideDiv.animate({ left: $(window).width() / 2, top: $(window).height() / 2, height: 0, width: 0 }, 300, function () {
        if (func) func(_this.hideDiv, _this.jqDiv);
    });
}

//------------------------------教学组件-------------------------

Test_Teach = {
    Attr: {
        left: 50,
        top: 50,
        width: 100,
        height: 100
    },
    strAttr:
    {
        left: 0,
        top: 0
    },
    str: "这里是用来测试的!这里是用来测试的!这里是用来测试的<br />!这里是用来测试的!这里是用来测试的!"
};

function TeachBox(func) {
    this.strBkgColor = "Red";
    this.ajTeachList = [];
    this.funcFinishCallBack = func;
    if (!TeachBox.prototype.teachDiv) {
        var jqTeachDiv = $("<div id='UI__TeachBox__TeachDiv__' ></div>");
        TeachBox.prototype.teachDiv = jqTeachDiv;
        jqTeachDiv.css("position", "fixed");
        jqTeachDiv.css("border", "2px solid Red");
        jqTeachDiv.css("z-index", "50");
        jqTeachDiv.hide();
        jqTeachDiv.appendTo($("body"));
    }
    if (!TeachBox.prototype.speakDiv) {
        var jqSpeakDiv = $("<div id='UI__TeachBox__SpeakDiv__' ></div>");
        TeachBox.prototype.speakDiv = jqSpeakDiv;
        jqSpeakDiv.css("position", "fixed");
        jqSpeakDiv.css("border", "1px solid #5B5B5B");
        jqSpeakDiv.css("background-color", "#F0F0F0");
        jqSpeakDiv.fadeTo(0, 0.95);
        jqSpeakDiv.css("line-height", "25px");
        jqSpeakDiv.css("padding", "15px");
        jqSpeakDiv.css("z-index", "50");
        jqSpeakDiv.css("font-size", "14px");
        jqSpeakDiv.hide();
        jqSpeakDiv.appendTo($("body"));
    }
    //测试
    //this.add(Test_Teach);
}

TeachBox.prototype.show = function (iTeach) {
    var _this = this;
    if (iTeach != undefined) {
        if (iTeach >= this.ajTeachList.length) {
            this.teachDiv.hide(300);
            this.speakDiv.hide(300);
            this.funcFinishCallBack();
            return;
        }
        this.ajTeachList[iTeach].strAttr.left = ($(window).width() / 2 + this.ajTeachList[iTeach].Attr.left) / 2;
        this.ajTeachList[iTeach].strAttr.top = ($(window).height() / 2 + this.ajTeachList[iTeach].Attr.top) / 2;
        this.speakDiv.animate(this.ajTeachList[iTeach].strAttr, 300, function () {
            _this.speakDiv.html(_this.ajTeachList[iTeach].str);
        });

        this.teachDiv.animate(this.ajTeachList[iTeach].Attr, 300, function () {
            _this.teachDiv.animate(_this.ajTeachList[iTeach].Attr, 2500, function () {
                _this.show(++iTeach);
            });
        })
        return;
    }
    else {
        if (this.ajTeachList.length == 0) {
            alert("None List!!!");
        }
        else {
            this.teachDiv.show();
            this.speakDiv.show();
            this.show(0);
        }
    }
}

TeachBox.prototype.add = function (jTeach) {
    this.ajTeachList.push(jTeach);
};

TeachBox.prototype.addDiv = function (sDiv, str) {
    var jqDiv = $("#" + sDiv);
    var jTeach = {
        Attr: {
            left: jqDiv.offset().left,
            top: jqDiv.offset().top,
            width: jqDiv.width(),
            height: jqDiv.height()
        },
        strAttr:
    {
        left: 0,
        top: 0
    },
        str: str
    };
    this.add(jTeach);
}

//错误LOG

function LOG(j) {
    alert(JSON.stringify(j));
}