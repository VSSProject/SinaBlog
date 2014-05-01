/// <reference path="jquery.js" />
/// <reference path="uiControl.js" />
/// <reference path="json2.js" />


/*--------------------------------------------------------------------------
Use To：注册页相关页面控制
Author：RaineWang
Data：2011-11-7
----------------------------------------------------------------------------*/


//UI组件集合
UI = {
    mainSwitch: new SwitchDiv("cMid"),
    Page1Content: new BlogMsgBox("cmLeft1 > ul"),
    Page4Star: new StarScore("p4sLi"),
    LoginFinish: new ChildWindow("RegisterFinishJmpDiv"),
    LoginFail: new ChildWindow("LoginFailShowDiv"),
    PageCache: new HashArray(),
    ulUin: 10000
};


//=============================================导航TOP头部分========================================
//初始化切换组件
function InitMainSwitchEvent() {
    for (var i = 1; i < 5; i++) {
        $("#cmPage" + i).data("IDX", i);
    }
    $("#ctBox1").click(function () { UI.mainSwitch.change("cmPage1", 500); });
    $("#ctBox2").click(function () { UI.mainSwitch.change("cmPage2", 500); });
    $("#ctBox3").click(function () { UI.mainSwitch.change("cmPage3", 500); });
    $("#ctBox4").click(function () { UI.mainSwitch.change("cmPage4", 500); });

}
InitMainSwitchEvent();

//初始化缓存

UI.PageCache.add("MidBoardMsg", []); //缓存广播大厅信息
UI.PageCache.add("UserInfo", new HashArray()); //用HashArray来缓存消息

//jMsg的结构：用于展示某一条微博信息内容
Test_Msg = {
    strMsgID: "AJDIEUSJDOEIDKRNDUSJEIDKQPEOTID", //用于表示唯一的微博内容标识
    imgHeadSrc: "css/image/50.jpg",
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

/*---------------------------------内容页Page1部分---------------------------------*/
//初始化内容循环页循环效果
function InitPage1Content() {
    ShowBoardBtnCallBack();
}
InitPage1Content();



//==================================注册页Page2内容=============================

//------------------------------------出生年月列表框---------------------------

function GetOptionHTML(i) {
    return $('<option value="' + i + '">' + i + '</option>')[0];
}

//初始化列表框年信息
function InitSelectYear() {
    var nowYear = new Date().getFullYear() + "";
    var objSelect = document.getElementById("bir_year");
    selgroup = document.createElement("optgroup");
    selgroup.label = "Select";
    objSelect.appendChild(selgroup);
    while (nowYear > 1900) {
        nowYear += "";
        selgroup.appendChild(GetOptionHTML(nowYear));
        if (nowYear.charAt(3) == "0") {
            selgroup = document.createElement("optgroup");
            selgroup.label = "After " + nowYear.charAt(2) + "0";
            objSelect.appendChild(selgroup);
        }
        nowYear--;
    }
}

/*初始化列表框月信息*/

function InitSelectMonth() {
    var objSelect = document.getElementById("bir_month");
    for (var i = 1; i < 13; i++) {
        objSelect.appendChild(GetOptionHTML(i));
    }
}
/*初始化列表框日信息*/
function InitSelectDay() {
    var objSelect = document.getElementById("bir_day");
    for (var i = 1; i < 32; i++) {
        objSelect.appendChild(GetOptionHTML(i));
    }
}
/*日选择的焦点获取回调*/
function DaySelectCallBack() {
    var pacMonth = [1, 3, 5, 7, 8, 10, 12];
    var Syear = document.getElementById("bir_year").value;
    var Smonth = document.getElementById("bir_month").value;
    var objSelect = document.getElementById("bir_day");
    var FullSelect = function (max) {
        for (var i = objSelect.options.length + 1; i <= max; i++) {
            objSelect.appendChild(GetOptionHTML(i));
        }
        objSelect.options.length = max;
    };
    for (var mon in pacMonth) {
        if (Smonth == pacMonth[mon]) {
            FullSelect(31);
            return;
        }
    }
    if (Smonth == 2) {
        if (Syear % 4 && Syear % 100 && Syear % 400 && Syear % 4000) {
            FullSelect(28);
            return;
        }
        else {
            FullSelect(29);
            return;
        }
    }
    else
        FullSelect(30);
}

//将年月日信息初始化
InitSelectYear();
InitSelectMonth();
InitSelectDay();

/*
------------------------------------用户验证通用函数-----------------------------
*/
//通用部分
AlertText = {
    UserNameUntest: "The Account Should be 6 to 12 character.",
    UserNameExists: "The VssID is already Exists.",
    PasswordUntest: "The Password Should be 8 to 15 character",
    PasswordWrong: "Two Password is not Same.",
    PasswordRepeat: "Please Input the Information Above.",
    NikeNameUntest: "Please Input a Nickname.",
    ShowPicOK: "<img src='cssindex/image/OK.jpg' />",
    None: ""
};
function HideDiv(obj) {
    obj = obj.nextSibling.nextSibling;
    obj.style.borderColor = "White";
}
function ShowDiv(obj) {
    obj = obj.nextSibling.nextSibling;
    obj.style.display = "";
    obj.style.borderColor = "#E7E7E7";
}
function SetAlertStyle(obj) {
    obj = obj.nextSibling.nextSibling;
    obj.style.color = "Red";
}
function CleanAlertStyle(obj) {
    obj = obj.nextSibling.nextSibling;
    obj.style.color = "Gray";
}
function SetAlertText(obj, str) {
    obj = obj.nextSibling.nextSibling;
    obj.innerHTML = str;
}
function CheckByReg(str, reg) {
    return reg.test(str);
}
//验证函数部分
function CheckUserNameAjaxCallBack(e) {
    var jCheckPkt = {
        sName: e
    };
    $.ajax({
        type: "POST",
        url: "/cgi-bin/isblog_verify_username_cgi",
        data: PackingPkg(jCheckPkt),
        success: CheckUserNameDomCallBack
    });
}

function CheckUserNameDomCallBack(msg) {
    msg = UnpackingjRet(msg);
    if (msg.RetCode != 0) {
        //错误
        var obj = document.getElementById("id_user");
        $("#id_user").data("REP", true);
        SetAlertText(obj, "The Same Account, Please Change a new Account Name.");
        SetAlertStyle(obj);
    }
    else {
        $("#id_user").data("REP", false);
    }
}

function CheckUserName(obj) {
    if (!CheckByReg(obj.value, /^[a-zA-Z0-9@]{6,20}$/)) {
        SetAlertText(obj, AlertText.UserNameUntest);
        SetAlertStyle(obj);
    }
    else {
        SetAlertText(obj, AlertText.ShowPicOK);
        CleanAlertStyle(obj);
        HideDiv(obj);
        CheckUserNameAjaxCallBack(obj.value);
        return 1;
    }
}
function CheckPasswd(obj) {
    if (!CheckByReg(obj.value, /^[a-zA-Z0-9]{6,15}$/)) {
        SetAlertText(obj, AlertText.PasswordUntest);
        SetAlertStyle(obj);
        CheckRepsw(document.getElementById("id_repsw"));
    }
    else {
        SetAlertText(obj, AlertText.ShowPicOK);
        CleanAlertStyle(obj);
        HideDiv(obj);
        CheckRepsw(document.getElementById("id_repsw"));
        return 1;
    }

}
function CheckRepsw(obj) {
    if (!CheckByReg(obj.value, /^[a-zA-Z0-9]{6,15}$/)) {
        SetAlertText(obj, AlertText.PasswordUntest);
        SetAlertStyle(obj);
    }
    else {
        if (obj.value != document.getElementById("id_psw").value) {
            SetAlertText(obj, AlertText.PasswordWrong);
            SetAlertStyle(obj);
            ShowDiv(obj);
        }
        else {
            SetAlertText(obj, AlertText.ShowPicOK);
            CleanAlertStyle(obj);
            HideDiv(obj);
            return 1;
        }
    }
}


function CheckNikeName(obj) {
    if (!CheckByReg(obj.value, /^[\u4E00-\u9FA5]{1,8}$/)) {
        SetAlertText(obj, AlertText.NikeNameUntest);
        SetAlertStyle(obj);
    }
    else {
        SetAlertText(obj, AlertText.ShowPicOK);
        CleanAlertStyle(obj);
        HideDiv(obj);
        return 1;
    }
}

//------------------------注册页行为-----------------------
function AddZeroToMonth(mon) {
    if (mon > 0 && mon < 10) {
        return "0" + mon;
    }
    else
        return mon;
}

function RegisterBtnCallBack(e) {
    if (!$("#id_user").data("REP")) {
        if (CheckUserName($("#id_user")[0]) && CheckPasswd($("#id_psw")[0]) && CheckRepsw($("#id_repsw")[0]) && CheckNikeName($("#id_name")[0])) {
            var jRegPkt = {
                sName: $("#id_user").val(),
                sPsw: $("#id_psw").val(),
                sNick: $("#id_name").val(),
                cSex: $("#male").attr("check") == "checked" ? 66 : 71,
                sBirth: $("#bir_year").val() + "-" + AddZeroToMonth($("#bir_month").val()) + "-" + AddZeroToMonth($("#bir_day").val())
            };
            $.ajax({
                type: "POST",
                url: "/cgi-bin/isblog_user_register_cgi",
                data: PackingPkg(jRegPkt),
                success: function (msg) {
                    var jRet = UnpackingjRet(msg);
                    if (jRet.RetCode != 0) {
                        alert("注册失败!");
                    }
                    else {
                        location.href = "vssblog.htm#" + jRet.Data.ulUin;
                    }
                }
            });
        }
    }
}


//------------------------登陆页行为-----------------------

function CheckByRegexp(obj, regExp) {
    if (!CheckByReg(obj.value, regExp)) {
        obj.style.borderColor = "Red";
    }
    else {
        obj.style.borderColor = "#bdc7d8";
        return 1;
    }
}

function LoginBtnCallBack(e) {

    if (CheckByRegexp($("#cmr1Usr")[0], /^[a-zA-Z0-9@]{6,20}$/) && CheckByRegexp($("#cmr1Psw")[0], /^[a-zA-Z0-9]{6,15}$/)) {
        var jLogPkt = {
            sName: $("#cmr1Usr").val(),
            sPsw: $("#cmr1Psw").val()
            //sCode: $("#cmr1Code").val() 验证码功能预留字段
        };

        $.ajax({
            type: "POST",
            url: "API/Login.aspx",
            data: jLogPkt,
            success: function (msg) {
                if (msg == "SUCCESS") {
                    location.href = 'vssblog.htm#' + jLogPkt.sName;
                }
                else {
                    UI.LoginFail.show(LoginFailShowCallBack, true);
                }
            }
        });
    }

}

function LoginFailShowCallBack() {
    setTimeout("UI.LoginFail.close()", 1000);
}

function LoginFinishShowCallBack(e) {
    location.href = 'vssblog.htm#' + e;
}

//-----------------------------------------------------------------处理首页拉取广播大厅三条----------------------------
//拉取广播大厅消息
function ShowBoardBtnCallBack() {
    GrepBoardByUin(UI.ulUin, 1, GrepBoardByUinCallBack);
}

function GrepBoardByUin(strUin, intPage, func) {
    var jGrepMsg = {
        ulUin: strUin,
        ulPage: intPage
    };
    $.ajax({
        type: "POST",
        url: "/cgi-bin/isblog_get_broad_msg_cgi",
        data: PackingPkg(jGrepMsg),
        success: function (msg) {
            if (func) func(msg);
        }
    });
}

function GrepBoardByUinCallBack(msg) {
    AddMsg(msg, ["MidBoardMsg"], function () {
        AddCacheToPage("MidBoardMsg", 4);
    });
}

///处理拉取消息部分
function SetCacheToPage(strCache) {
    UI.MidMsgBox.clear();
    for (var i = 0; i < UI.PageCache[strCache].length; i++) {
        UI.Page1Content.addMsg("MainMsgTemplate", UI.PageCache[strCache][i], false);
    }
}

function AddCacheToPage(strCache, n) {
    for (var i = 0; i < n; i++) {
        UI.Page1Content.addMsg("MainMsgTemplate", UI.PageCache[strCache][i], true);
    }
}

function AddMsg(jMsg, arStrCacheName, func) {
    jMsg = UnpackingjRet(jMsg);
    var arData = jMsg.Data.stMsg;
    var iMsgNum = jMsg.Data.ulMsgNum;
    var jUinArray = {
        ulCount: iMsgNum,
        ulUin: []
    };
    for (var i = 0; i < iMsgNum; i++) {
        if (!UI.PageCache["UserInfo"][arData[i].ulUin]) {
            jUinArray.ulUin.push(arData[i].ulUin);
        }
        var jMsgUn = {
            strMsgID: arData[i].ullMsgId,
            strUin: arData[i].ulUin,
            imgHeadSrc: "",
            strNickName: "",
            strContent: decodeURI(arData[i].stMsg),
            strFromClient: "Cosblog",
            strWriteDate: arData[i].ulCTime,
            intReplyNum: 1,
            bstrReply: "000000",
            strObjKind: arData[i].ucIsImg == 1 ? "PIC" : "None",
            strObjPicUrl: "",
            strObjUrl: ""
        };

        for (var strCN in arStrCacheName) {
            UI.PageCache[arStrCacheName[strCN]].push(jMsgUn);
        }
    }
    if (jUinArray.ulUin.length != 0) {
        $.ajax({
            type: "POST",
            url: "/cgi-bin/isblog_load_userinfo_array_cgi",
            data: PackingPkg(jUinArray),
            success: function (e) {
                AddMsgCommonCallBack(e, arStrCacheName, func);
            }
        });   ///缺传输消息
    }
    else {
        AddMsgCommonCallBack(null, arStrCacheName, func);
    }
}

function AddMsgCommonCallBack(msg, arStrCacheName, func) {
    if (msg != null) {
        var jUser = UnpackingjRet(msg);
        for (var iUser = 0; iUser < jUser.Data.RetCode; iUser++) {
            UI.PageCache["UserInfo"][jUser.Data.Data[iUser].strUin] = jUser.Data.Data[iUser];
        }
    }
    for (var strCN in arStrCacheName) {
        for (var iMsg = 0; iMsg < UI.PageCache[arStrCacheName[strCN]].length; iMsg++) {
            var arUserList = UI.PageCache["UserInfo"];
            var arMsgList = UI.PageCache[arStrCacheName[strCN]];
            if (arMsgList[iMsg].strNickName == "") {
                if (arUserList[arMsgList[iMsg].strUin]) {
                    arMsgList[iMsg].imgHeadSrc = arUserList[arMsgList[iMsg].strUin].strHeadImg;
                    arMsgList[iMsg].strNickName = arUserList[arMsgList[iMsg].strUin].strNick;
                }
            }
        }
    }
    if (func) func();
}