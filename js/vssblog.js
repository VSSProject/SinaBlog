/// <reference path="jquery.js" />
/// <reference path="uiControl.js" />
/// <reference path="json.js" />


UI = {
    ulUin: 0,
    LeftMsgNumBox: new MsgNumBox("userBox"),
    MidMsgBox: new BlogMsgBox("mContent > ul"),
    MidMenuBox: new MidFixedMenu("cmFixed", "mWrite", "mMenu", "cmFirBlank", "cmSecBlank"),
    RightInfoBox: new PersonInfoBox("crContent"),
    WelcomeChildWindow: new ChildWindow("ListenListDiv"),
    WelcomeTeachBox: new TeachBox(),
    AllListenList: new BlogMsgBox("lldList"),
    PageCache: new HashArray(),
    UploadPicBox: new ChildWindow("UploadPicDiv"),
    HomeID: -1,
    NextPic: "",
    AtBox: new ChildWindow("AtDiv"),
    AtList: []
};


//jUpdatePkg结构说明
jUpdatePkg = {
    uNewAll: 0,
    uMention: 0,
    uNewListen: 0,
    uNewFollow: 0,
    uConfig: 0
};

//jMsg的结构：用于展示某一条微博信息内容
Test_Msg = {
    strMsgID: "AJDIEUSJDOEIDKRNDUSJEIDKQPEOTID", //用于表示唯一的微博内容标识
    imgHeadSrc: "css/image/50.jpg",
    strUin: 10005,
    strNickName: "寻雨",
    strContent: "猩球崛起这部片，有点蛋疼。虽然有部分地方还是有些出彩的，比如猿之间的感情……",
    strFromClient: "Cosblog", //来自源，网站还是其他端
    strWriteDate: "十分钟以前", //[NO]表示不显示时间.
    intReplyNum: 1000, //-1表示不显示[全部转播和评论]
    bstrReply: "111000", //第一位表示是否显示此框，其余分别表示转播、评论、删除等权限.
    strObjKind: "PIC", //表示附加信息的类别：是图片PIC、视频MED、音乐MUS……
    strObjPicUrl: "http://.jpg", //表示附加信息的缩略图地址
    strObjUrl: "http://.jpg"//表示实际需要载入的完整内容，作为缩略图的点击请求URL
};

/*
//jPerInfo的结构：用于展示某指定人的信息
jPerInfo = {
strUin: "1098089023A", //标识唯一ID
strNick: "寻雨", //标识用户的饿呢称
strHeadUrl: "http://localhost:24831/VssBlog/API/GetFile.aspx?fileID=alice@cityu92233720354615938541866864416", //标识URL的图标
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
strUrl: "http://www.cnblogs.com/wmw1989/", //个人主页
strPerInfo: "H一个小小的程序员，希望能通过自己的努力，成长起来，通过IT，为社会为国家贡献出自己的一份力！", //个人简介
ajLabel: []//Json数组 存储标签的相关对象
};
*/

//需要收听的列表结构
jListenBox = {
    strUin: 10005,
    strNick: "寻雨",
    strHeadImg: "css/image/50.jpg",
    strUser: "wmw1989",
    intListen: 434,
    bListen: false
};

//jFriendInfo的结构：用于展示某指定人的信息
jFriendInfo = {
    strUin: "1098089023A", //标识唯一ID
    strUser: "wmw1989", //用户登陆时用的用户名
    strNick: "寻雨", //标识用户的饿呢称
    strHeadUrl: "css/image/Alice_Icon.jpg", //标识URL的图标
    intListen: 0, //被听众数
    intFollow: 0, //收听别人数
    intSend: 0, // 发送的广播数
    intSave: 0, //被收录数
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

//总初始化函数
function InitUI(bLoop) {
    if (location.href.match(/[#].*/)) {
        UI.ulUin = location.href.match(/[#].*/)[0].replace('#', '');
    }
    else {
        //暂时处理为返回index.htm
        //location.href = "index.htm";
    }
    if (UI.HomeID == -1) {
        UI.HomeID = UI.ulUin;
    }


    UI.LeftMsgNumBox.setUpdate(jUpdatePkg); //初始化左边消息均为0

    if (!bLoop) {
        setInterval("LoopGetNewNum(LoopGetNewNumCallBack)", 30000);  //设置轮循数据
    }

    InitAndSetTheFlowPage();    //流布局

    InitPageCacheSystem();   //初始化缓存

    //加载个人信息
    GetUserInfo(UI.ulUin, function (jInfo) {
        UI.UserInfo = jInfo;
        //渲染本地
        UI.RightInfoBox.SetJsonContent(jInfo);
        UI.PageCache["MyInfo"] = jInfo; //设置缓存


        /*
        if (jInfo.intListen == 0) {
        InitAndBeginTheWelcome();   //执行教程
        GrepManyUser(12, GrepSomeInfoToBeFollowCallBack);
        }
        else {
        //执行首页信息拉取
        GrepMsgByUin(UI.ulUin, 1, GrepMainPageMsgByUinCallBack);
        }
        */


        //执行首页信息拉取
        GrepMsgByUin(UI.ulUin, 2, function (msg) {
            AddMsg(msg, ["MidAllMsg"], function () {
                SetCacheToPage("MidAllMsg");
            });
        });


    });


}


InitUI();

//-------------------------------------------------------------------------------------------------------------------------------------------


function GetUserInfo(vssID, func) {
    //首先拉取个人信息
    GrepInfoByUin("", vssID, function (jInfo) {

        if (!jInfo["strUin"]) {
            var userInfo = {
                strUin: UI.ulUin, //标识唯一ID
                strNick: "", //标识用户的饿呢称
                strHeadUrl: "API/GetFile.aspx?fileID=polyu|bob@polyu92233720354559518851696223703", //标识URL的图标
                intListen: 0, //被听众数
                intFollow: 0, //收听别人数
                intSend: 0, // 发送的广播数
                intSave: 0, //被收录数
                strSex: "F", //男OR女
                strStar: "Libra", //星座
                strOld: "24", //微缩年龄
                strSubject: "IT", //表示行业
                strHome: "Hong Kong", //家乡
                strPlace: "Hong Kong City One", //现居地
                strUrl: "http://facebook.com/Alice/", //个人主页
                strPerInfo: "A PhD student of CityU.", //个人简介
                ajLabel: ["Computer", "Study"]//Json数组 存储标签的相关对象
            };
        }
        else {
            userInfo = jInfo;
        }

        //拉取一下收听数等信息
        GrepTNumberByUin(function (jNumber) {

            userInfo.intListen = jNumber.FocusNum;
            userInfo.intFollow = jNumber.FollowNum;
            userInfo.intSend = jNumber.PublishNum + jNumber.ProvideNum;

            //处理完个人信息整合后，保存一份信息到服务端。
            GrepInfoByUin(PackingPkg(userInfo), null, null);

            if (func) {
                func(userInfo);
            }

        });
    });
}


//操作关系链
function DoFriends(iKind, arID, func) {

    $.ajax({
        type: "POST",
        url: "API/GetFriends.aspx",
        data: {
            opKind: iKind,
            friID: arID == "" ? arID : typeof arID == "string" ? arID : arID.join('|')
        },
        success: function (msg) {
            var jRet = UnpackingjRet(msg);
            if (jRet) {
                func(jRet.Data);
            }
            else {
                func(null);
            }
        }
    });
}



//----------------------------------------------------------------------响应用户操作回调---------------------------------------------------

function GrepMentionMe() {
    UI.PageCache["MidMentionMsg"] = [];
    GrepMsgByUin(UI.ulUin, 1, GrepMentionMsgByUinCallBack);
}

function ClickLogoHome() {
    location.href = "vssblog.htm#" + UI.HomeID;
    InitUI(true);
}

//抓取收听列表和听众
function GrepListenList() {

    DoFriends(5, "", function (jMsg) {
        //调用渲染听众表
        GrepListenListCallBack(jMsg)
    });

}

function GrepFollow() {

    DoFriends(4, "", function (jMsg) {
        //调用渲染关注表
        GrepFollowCallBack(jMsg)
    });

}

//拉取个人首页消息
function ShowHomeBtnCallBack() {

    UI.PageCache["MidAllMsg"] = [];
    GrepMsgByUin(UI.ulUin, 2, GrepMainPageMsgByUinCallBack);

}

//拉取个人自己的消息
function ShowMineBtnCallBack() {
    UI.PageCache["MidMyMsg"] = [];
    GrepMsgByUin(UI.ulUin, 0, GrepMineByUinCallBack);
}

//拉取广播大厅消息
function ShowBoardBtnCallBack() {
    UI.PageCache["MidBoardMsg"] = [];
}

//上传图片
function AddPicCallBack() {
    UI.UploadPicBox.show(null, true);
}

//关闭上传图片框
function ClosePicCallBack() {
    UI.UploadPicBox.close(null, true);
}

function CancelAllLitenCallBack() { //点取消收听时操作
    UI.WelcomeChildWindow.close();
    UI.PageCache["MyInfo"].intFollow = $("#intListen").text();
    GrepMsgByUin(UI.ulUin, 1, GrepMainPageMsgByUinCallBack); //拉取自己消息
}

function FullAllLitenCallBack() { //点收听全部操作
    UI.WelcomeChildWindow.close();
    //处理全部收听代码
    var jAddListen = {
        ulCount: UI.PageCache["SomeSelectFollowList"].length,
        ulUin: UI.ulUin,   //当前人的UIN
        ulAddUin: UI.PageCache["SomeSelectFollowList"]
    };
    UI.PageCache["MyInfo"].intFollow += jAddListen.ulCount;
    $("#intListen").text(UI.PageCache["MyInfo"].intFollow);
    $.ajax({
        type: "POST",
        url: "/cgi-bin/isblog_add_follow_cgi",
        data: PackingPkg(jAddListen),
        success: function () {
            GrepMsgByUin(UI.ulUin, 1, GrepMainPageMsgByUinCallBack); //拉取自己消息
        }
    });
}

function SearchClearTextCallBack() {
    $("#lsInput").val("");
}

function SearchUserCallBack() { //搜索某好友 模拟
    //处理全部收听代码
    var searchVssID = $("#lsInput").val();

    GrepInfoByUin("", searchVssID, function (jInfo) {

        var friInfo = null;
        if (!jInfo["strUin"]) {
            UI.MidMsgBox.clear();
            return;
        }
        else {
            friInfo = jInfo;
        }

        //拉取一下收听数等信息
        GrepTNumberByUin(function (jNumber) {

            friInfo.intListen = jNumber.FocusNum;
            friInfo.intFollow = jNumber.FollowNum;
            friInfo.intSend = jNumber.PublishNum + jNumber.ProvideNum;
            friInfo.strUser = friInfo.strUin;

            UI.MidMsgBox.clear();

            var cacheFollow = UI.PageCache["FollowList"];
            friInfo.ajLabel = 70;
            for (var i = 0; i < cacheFollow.length; i++)
            {
                var fol = cacheFollow[i];
                if (fol.strUin == friInfo.strUin) {
                    friInfo.ajLabel == 0;
                }
            }

            UI.MidMsgBox.addMsg("FindFriendTemplate", friInfo, 1);


        });

    });
}

function FriendLiMouseOverCallBack(strUin) {

    //    UI.RightInfoBox.SetJsonContent(UI.MidMsgBox.hMsg["jMsg" + strUin][0]);
}

function LeftAllNewMsgCallBack() { //点左边的全部消息
    //模拟新拉消息
    GrepNewAllMsg(UI.ulUin, 1, GrepNewAllMsgCallBack);
}

function WelcomeAddListen(e, strUin) {
    if ($(e).data("bListen") == undefined) {
        $(e).data("bListen", true);
        e.style.backgroundImage = "url(js/css/image/SmallCancelBtn.jpg)";
        AddListen(strUin);
    }
    else {
        if ($(e).data("bListen")) {
            e.style.backgroundImage = "url(js/css/image/SmallListenBtn.jpg)";
            $(e).data("bListen", false);
            //取消收听某人
            DelListen(strUin);
        }
        else {
            e.style.backgroundImage = "url(js/css/image/SmallCancelBtn.jpg)";
            $(e).data("bListen", true);
            //增加收听某人
            AddListen(strUin);
        }
    }
}

function SearchAddListen(e, strUin) {
    if ($(e).data("bListen") == undefined) {
        var bkgText = $(e).css("background-image");
        if (/MidListen/.test(bkgText)) {
            $(e).data("bListen", true);
            e.style.backgroundImage = "url(js/css/image/MidNoListen.jpg)";
            AddListen(strUin);
        } else {
            e.style.backgroundImage = "url(js/css/image/MidListen.jpg)";
            $(e).data("bListen", false);
            //取消收听某人
            DelListen(strUin);
        }
    }
    else {
        if ($(e).data("bListen")) {
            e.style.backgroundImage = "url(js/css/image/MidListen.jpg)";
            $(e).data("bListen", false);
            //取消收听某人
            DelListen(strUin);
        }
        else {
            e.style.backgroundImage = "url(js/css/image/MidNoListen.jpg)";
            $(e).data("bListen", true);
            //增加收听某人
            AddListen(strUin);
        }
    }
}

//当用户点击某人物名后进入某人主页
function MsgNickPicClickCallBack(strUin) {
    location.href = "#" + strUin;
    InitUI(true);
}

//回调用户输入信息 主要用于判断输入内容以及字数减少判断
function WorkOutWordNumCallBack() {
    $("#LastWordSpan").text(140 - $("#cmwbInput").val().length);
    if ($("#cmwbInput").val().length >= 140) {
        alert("There are too many words .");
    }
}

function TurnMsg(msg) {
    $("#cmwbInput").val("转播：" + decodeURI(msg));
}


//发送消息按扭回调
function SendMsgCallBack() {

    var jMsgUn = {
        strMsgID: "[REPLACE_STRMSGID]",
        strUin: UI.ulUin,
        imgHeadSrc: UI.UserInfo.strHeadUrl,
        strNickName: UI.UserInfo.strNick,
        strContent: encodeURI($("#cmwbInput").val()),
        strFromClient: "VssBlog",
        strWriteDate: new Date().toLocaleString(),
        intReplyNum: -1,
        bstrReply: "100000",
        strObjKind: "None",
        strObjPicUrl: UI.NextPic,
        strObjUrl: ""
    };

    if (UI.NextPic != "") {
        UI.NextPic = "";
    }

    $.ajax({
        type: "POST",
        url: "API/PutBlog.aspx",
        data: {
            data: PackingPkg(jMsgUn)
        },
        success: function (msg) {
            jMsgUn.strMsgID = msg;
            jMsgUn.strContent = decodeURI(jMsgUn.strContent);
            var addMsg = {
                Data: [jMsgUn],
                Num: 1
            };

            var friList = "";
            if (UI.AtList.length != 0) {
                friList = UI.AtList.join('|');
                UI.AtList = [];
            }

            //做一个微博内容的授权
            $.ajax({
                type: "POST",
                url: "API/Provide.aspx",
                data: {
                    friID: friList,
                    fileID: jMsgUn.strMsgID
                },
                success: function (msg) {
                    AddMsg(addMsg, ["MidMyMsg"], function () {
                        AddCacheToPage("MidMyMsg", 1);
                        $("#cmwbInput").val("");
                        UI.PageCache["MyInfo"].intSend++;
                        $("#intSend").text(UI.PageCache["MyInfo"].intSend);

                    });
                }
            });


            //同时，如果包含图片，那么图片也需要同样的授权！
            if (jMsgUn.strObjPicUrl != "") {
                $.ajax({
                    type: "POST",
                    url: "API/Provide.aspx",
                    data: {
                        friID: friList,
                        fileID: jMsgUn.strObjPicUrl
                    },
                    success: null
                });
            }



        }
    });
}

//-------------------------------------------------------------------------内部逻辑处理---------------------------------------------

function SearchUserMsgCallBack(msg) {
    msg = UnpackingjRet(msg);
    if (msg.Data == "") return;
    UI.MidMsgBox.clear();
    UI.MidMsgBox.addMsg("FindFriendTemplate", msg.Data, 1);
}

function GrepSomeInfoToBeFollowCallBack(msg) {
    $("#lldBtn").data("HeadNum", 0);
    UI.PageCache["SomeSelectFollowList"] = [];
    msg = UnpackingjRet(msg);
    var arUinList = [];
    for (var i = 0; i < msg.Data.length; i++) {
        UI.AllListenList.addMsg("ListenSelectListTemplate", msg.Data[i], 1);
        UI.PageCache["SomeSelectFollowList"].push(msg.Data[i].strUin);
    }
}

function GrepMainPageMsgByUinCallBack(msg) {
    AddMsg(msg, ["MidAllMsg"], function () {
        SetCacheToPage("MidAllMsg");
    });
}

function LoopGetNewNumCallBack(msg) {
    msg = UnpackingjRet(msg);
    if (msg.Data != "") {
        UI.LeftMsgNumBox.setUpdate(NewNumjPkg(msg.Data), function (vKey) {
            if (vKey == "uNewAll") { //设置我收听的广播缓存过期
                UI.PageCache["CacheList"].MidAllMsg = true;
            }
            if (vKey == "uMention") { //设置提到我的消息缓存过期
                UI.PageCache["CacheList"].MidMyMsg = true;
            }
            if (vKey == "uNewFollow") { //设置我的收听人列表缓存过期
                UI.PageCache["CacheList"].ListenList = true;
            }
        });
    }
}


function GrepManyUser(strNum, func) {
    var jGrepMany = {
        ulNum: strNum   //拉取的数量
    };
    $.ajax({
        type: "POST",
        url: "/cgi-bin/isblog_get_userinfo_list_cgi",
        data: PackingPkg(jGrepMany),
        success: function (msg) {
            if (func) func(msg);
        }
    });
}

function AddListen(strUin, func) {

    DoFriends(2, strUin, function (jMsg) {
        UI.PageCache["MyInfo"].intListen++;
        $("#intListen").text(UI.PageCache["MyInfo"].intListen);
        //调用渲染关注表
        if (func) func(jMsg)
    });

}

function DelListen(strUin, func) {

    DoFriends(3, strUin, function (jMsg) {
        UI.PageCache["MyInfo"].intListen--;
        $("#intListen").text(UI.PageCache["MyInfo"].intListen);
        //调用渲染关注表
        if (func) func(jMsg)
    });

}


//拉取用户TNumber
function GrepTNumberByUin(func) {

    $.ajax({
        type: "POST",
        url: "API/GetNumber.aspx",
        success: function (msg) {
            var jMsg = UnpackingjRet(msg);
            if (func && jMsg) func(jMsg);
        }
    });

}


//根据情况拉取或设置用户消息
function GrepInfoByUin(paramData, vssid, func) {

    var sendData = {
        data: paramData
    };
    if (vssid) {
        sendData["vssid"] = vssid;
    }
    $.ajax({
        type: "POST",
        url: "API/UserInfo.aspx",
        data: sendData,
        success: function (msg) {
            var jMsg = UnpackingjRet(msg);
            if (func && jMsg) func(jMsg);
        }
    });
}

function GrepMsgByUin(strUin, kind, func) {

    $.ajax({
        type: "POST",
        url: "API/GetMsg.aspx",
        data: {
            vssID: strUin,
            opKind: kind
        },
        success: function (msg) {
            msg = UnpackingjRet(msg);
            var addMsg = {
                Data: msg.Data,
                Num: msg.Data.length
            };

            var iEnd = msg.Data.length;

            for (var i = 0; i < msg.Data.length; i++) {
                addMsg.Data[i].strContent = decodeURI(addMsg.Data[i].strContent);
                //如果几个字段没写，则补充。

                if (addMsg.Data[i].strNickName == "") {
                    addMsg.Data[i].strNickName = UI.UserInfo.strNick;
                }

                if (addMsg.Data[i].imgHeadSrc == "") {

                    (function a(xx){
                        GrepInfoByUin("", addMsg.Data[xx].strUin, function (jInfo) {

                            if (jInfo["strUin"]) {
                                addMsg.Data[xx].imgHeadSrc = jInfo.strHeadUrl;
                            }

                            if (--iEnd == 0) {
                                if (func) func(addMsg);
                                return;
                            }

                        });
                    })(i);
                }
                else
                {
                    if (--iEnd == 0) {
                        if (func) func(addMsg);
                        return;
                    }
                }

            }
            
        }
    });

}

function GrepMentionByUin(strUin, intPage, func) {
    var jGrepMsg = {
        ulUin: strUin,
        ulPage: intPage
    };
    $.ajax({
        type: "POST",
        url: "/cgi-bin/isblog_mention_me_cgi",
        data: PackingPkg(jGrepMsg),
        success: function (msg) {
            if (func) func(msg);
        }
    });
}

function GrepMentionMsgByUinCallBack(msg) {
    AddMsg(msg, ["MidMentionMsg"], function () {
        SetCacheToPage("MidMentionMsg");
    });
}

function GrepListenListCallBack(msg) {
    arData = msg;
    UI.MidMsgBox.clear();
    
    DoFriends(4, "", function (jMsg) {
        //调用渲染关注表

        var MAP = {};

        if (jMsg) {
            for (var i = 0; i < jMsg.length; i++) {
                MAP[jMsg[i].strUin] = true;
            }
        }

        if (arData) {
            UI.PageCache["ListenList"] = [];
            for (var i = 0; i < arData.length; i++) {
                if (MAP[arData[i].strUin])
                {
                    arData[i].ajLabel = 0;
                }
                else
                {
                    arData[i].ajLabel = 70;
                }
                UI.MidMsgBox.addMsg("FindFriendTemplate", arData[i], true);
                UI.PageCache["ListenList"].push(arData[i]);
            }
        }

    });
    
}

function GrepFollowCallBack(msg) {
    arData = msg;
    UI.MidMsgBox.clear();
    if (arData) {
        UI.PageCache["FollowList"] = [];
        for (var i = 0; i < arData.length; i++) {
            arData[i].ajLabel = 0;
            UI.MidMsgBox.addMsg("FindFriendTemplate", arData[i], true);
            UI.PageCache["FollowList"].push(arData[i]);
        }
    }
}

function GrepNewAllMsg(strUin, intPage, func) {
    var jGrepNewMsg = {
        ulUin: strUin,
        ulPage: intPage
    };
    $.ajax({
        type: "POST",
        url: "/cgi-bin/isblog_get_new_msg_cgi",
        data: PackingPkg(jGrepNewMsg),
        success: function (msg) {
            if (func) func(msg);
        }
    });
}

function GrepNewAllMsgCallBack(msg) {
    AddMsg(msg, ["MidAllMsg"], function () {
        LoopGetNewNum(LoopGetNewNumCallBack)
        SetCacheToPage("MidAllMsg");
    });
}

function GrepMineByUinCallBack(msg) {
    AddMsg(msg, ["MidMyMsg"], function () {
        SetCacheToPage("MidMyMsg");
    });
}

function LoopGetNewNum(func) {
    var jLoop = {
        ulUin: UI.ulUin
    };
    $.ajax({
        type: "POST",
        url: "/cgi-bin/isblog_get_new_num_cgi",
        data: PackingPkg(jLoop),
        success: function (msg) {
            if (func) func(msg);
        }
    });
}

///处理拉取消息部分
function SetCacheToPage(strCache) {
    UI.MidMsgBox.clear();
    for (var i = UI.PageCache[strCache].length; i >= 0; i--) {
        UI.MidMsgBox.addMsg("MainMsgTemplate", UI.PageCache[strCache][i], false);
    }
}

function AddCacheToPage(strCache, n) {
    for (var i = UI.PageCache[strCache].length; i >= 0; i--) {
        UI.MidMsgBox.addMsg("MainMsgTemplate", UI.PageCache[strCache][i], true);
    }
}

function AddMsg(jMsg, arStrCacheName, func) {

    var arData = jMsg.Data;
    var iMsgNum = jMsg.Num;

    for (var i = 0; i < iMsgNum; i++) {

        for (var strCN in arStrCacheName) {
            UI.PageCache[arStrCacheName[strCN]].push(jMsg.Data[i]);
        }
    }
    if (func) func();
}



//-------------------------内部通信转换函数---------------------------

function NewNumjPkg(jPkg) {
    var jRet = {
        uNewAll: jPkg.ulNewMsgNum,
        uMention: jPkg.ulMentionme,
        uNewListen: jPkg.ulNewFollow,
        uNewFollow: 0,
        uConfig: 0
    };
    return jRet;
}

function DateTurnToStringDescript(strDate) {

}


//---------------------------------页面初始化------------------------------

//教学欢迎系统
function InitAndBeginTheWelcome() {
    UI.WelcomeTeachBox.funcFinishCallBack = function () {
        $("#mContent").height($(window).height() - 258);
        UI.WelcomeChildWindow.showPage();
    };
    UI.WelcomeTeachBox.addDiv("lLogo", "点击这里可以重载页面！");
    UI.WelcomeTeachBox.addDiv("userBox", "这里依次显示最新的收听消息数、关于我的消息数、最新收听我的人！");
    UI.WelcomeTeachBox.addDiv("mWrite", "这里可以输入自己想说的话，发表一条微博！");
    UI.WelcomeTeachBox.addDiv("mmUpdown", "这里可以隐藏和显示写入框！");
    UI.WelcomeTeachBox.addDiv("crFixed", "这里显示自己的详细信息或者当前查看人的个人详细信息！");
    UI.WelcomeTeachBox.addDiv("lsShadow", "在这里输入朋友的呢称，可以进行搜索！");
    UI.WelcomeChildWindow.show(function () {
        UI.WelcomeTeachBox.show()
    });
}

//基本页面布局设置
function InitAndSetTheFlowPage() {
    $("#clFixed").css("position", "fixed");
    $("#crFixed").css("position", "fixed");
    $("#mContent").height($(window).height() - 258);
    $("#pageBox").css("position", "fixed");
    $("#pageBox").animate({ top: ($(window).height() - $("#pageBox").height()) }, 0);
    $("#mmuHide").click(function () { UI.MidMenuBox.showBlock(); });
    $("#mmuShow").click(function () { UI.MidMenuBox.hideBlock(); });
}

//初始化页面缓存 在不拉取的情况下 将自动渲染这些信息
function InitPageCacheSystem() {
    UI.PageCache.add("MidAllMsg", []); //缓存我的全部消息ID
    UI.PageCache.add("MidMentionMsg", []); //缓存提到我的消息ID 
    UI.PageCache.add("MidBoardMsg", []); //缓存广播大厅信息
    UI.PageCache.add("MidMyMsg", []); //缓存我自己发的消息
    UI.PageCache.add("MyInfo", null); //缓存个人信息
    UI.PageCache.add("ListenList", []); //缓存收听我的人的列表
    UI.PageCache.add("FollowList", []); //缓存我收听的人的列表
    UI.PageCache.add("CacheList", {
        MidAllMsg: false,
        MidMyMsg: false,
        MyInfo: false,
        ListenList: false,
        FollowList: false
    });   // 判断缓存是否需要更新 为True则拉取时不直接拉取缓存 而是拉取服务器信息
    UI.PageCache.add("UserInfo", new HashArray()); //用HashArray来缓存消息
    UI.PageCache.add("SomeSelectFollowList", null);  //缓存一下推荐人小表 到收听全部时释放 作为临时存放
}

//------------------------------------图片上传-------------------------------
function previewImage(fileInput, containerId) {
    // w3c
    if (fileInput.files) {
        var fs = fileInput.files;
        if (fs.length != 1) {
            alert("只可以上传一张图！");
            return false;
        }
        var file = fs[0];
        if (!/image.*/.test(file.type)) {
            alert("只可以上传JPG图片！");
            return false;
        }
        try {
            // firefox support this way
            displayImage(file.getAsDataURL());
        }
        catch (e) {
            var reader = new FileReader();
            reader.onload = function (e) {
                displayImage(e.target.result);
            }
            reader.readAsDataURL(file);
        }

    }
    else {
        displayImage(fileInput.value);
    }
}

function displayImage(dataURL) {
    //alert(dataURL);
}

function uploadBtnCallBack() {
    var fileInput = $("#UploadInput")[0];
    if (fileInput.files) {
        var fs = fileInput.files;
        if (fs.length != 1) {
            alert("只能上传一张图片！");
            return false;
        }
        var file = fs[0];
        if (!/image.*/.test(file.type)) {
            alert("禁止上传图片以外的文件。");
            return false;
        }
    }
}

function okImage() {
    var src = $("#mypic", document.frames['check_file_frame'].document)[0].src;
    UI.NextPic = src.match(/fileID=(.*)$/)[1];
    ClosePicCallBack();
}



//@功能-------------------------------------------------------------------------------

function CloseAtCallBack() {

    UI.AtBox.close(null, true);

}


function AtCallBack() {

    DoFriends(5, "", function (jMsg) {
        //调用渲染听众表
        $("#atSelect").empty();
        for (var i = 0; i < jMsg.length; i++) {
            $("#atSelect").append("<option value='" + jMsg[i].strUin + "'>" + jMsg[i].strUin + "</option>");
        }
        UI.AtBox.show(null, true);
    });



}

function okAt() {
    UI.AtList = [];
    $("#atSelect option").each(function () {
        UI.AtList.push($(this).val());
    });

    UI.AtBox.close(null, true);
}