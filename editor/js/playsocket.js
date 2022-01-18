var bisTeacherPlay = false;
var strMsgSendPlay = '';
var heartBeatTimePlay = 180;				//一分钟一次
var urlPlay='';
/**
 * 分析服务器返回信息
 *
 * msg.type : user 普通信息;system 系统信息;handshake 握手信息;login 登陆信息; logout 退出信息;
 * msg.from : 消息来源
 * msg.content: 消息内容
*/

function reconnectPlay(url) {
    if (reconnectPlay.lockreconnectPlay) return;
    setTimeout(function () {     			//没连接上会一直重连，设置延迟避免请求过多
        createWebSocketPlay(url);
        reconnectPlay.lockreconnectPlay = false;
    }, 1000);
}

function initPlay(url)
{
   urlPlay=url;
   createWebSocketPlay();
}

// 实例websocket
function createWebSocketPlay() {
    try {
        if ('WebSocket' in window) {
            wsPlay = new WebSocket(urlPlay);
        } else if ('MozWebSocket' in window) {
            wsPlay = new MozWebSocket(urlPlay);
        } else {
            _alert("当前浏览器不支持websocket协议,建议使用Chrome内核的浏览器。", 3000)
        }
        initEventHandlePlay();
    } catch (e) {
        reconnectPlay(urlPlay);
    }
}

// 初始化事件函数
function initEventHandlePlay() {
    wsPlay.onclose = function () {
        //var d = new Date();
        //var n = d.toLocaleTimeString();
        //var data = "Play系统消息 (" + n + "): 已退出。";
        //listMsgPlay(data);
        reconnectPlay.lockreconnectPlay = false;
        reconnectPlay(urlPlay);
    };
    wsPlay.onerror = function (err) {
        $.post("websocket.php?r=play&t=" + Math.random(), {});//启动远程服务
        //var d = new Date();
        //var n = d.toLocaleTimeString();
        //var data = "Play系统消息 (" + n + ")+: 出错了，正在尝试重新运行服务，请稍候。";
        //listMsgPlay(data);
        reconnectPlay.lockreconnectPlay = false;
        reconnectPlay(urlPlay);
    };
    wsPlay.onopen = function () {
        //var d = new Date();
        //var n = d.toLocaleTimeString();
        //var data = "Play系统消息 (" + n + ")：建立连接成功。";
        //listMsgPlay(data);
        reconnectPlay.lockreconnectPlay = true;
        heartCheckPlay.reset().start();      		//心跳检测重置
    };
    wsPlay.onmessage = function (msg) {    			//如果获取到消息，心跳检测重置
        var msg = JSON.parse(msg.data);
        var sender, user_name, name_list, change_type;
        //var d = new Date();
        //var n = d.toLocaleTimeString();

        heartCheckPlay.reset().start();      		//拿到任何消息都说明当前连接是正常的
        switch (msg.type) {
            case 'system':
                //sender = "Play系统消息(" + n + ")+: ";
                break;
            case 'user':
                //sender = msg.from + "(" + n + ")" + ': ';
                break;
            case 'handshake':
                var user_info = { 'type': 'login', 'content': uname };
                sendMsgPlay(user_info);
                return;
            case 'login':
            case 'logout':
                user_name = msg.content;
                name_list = msg.user_list;
                change_type = msg.type;
                //dealUserPlay(user_name, change_type, name_list);
                return;
            default:
                return;
        }
//      if(msg.content!=undefined)				//处理异常数据
//      {
//         if(msg.content!=strMsgSendPlay)				//非回显数据
           if(msg.from!=uname)				        //非回显数据
           {
              //try{						//学生端不支持这个操作。
              //   if(msg.content.indexOf("KEY_")===0){		//教师端收到学生端发出的速问速答的答案
              //      var reg = new RegExp("KEY_", "g");
	      //    var content = msg.content.replace(reg, ""); //
              //      listScore(msg.from,content);		//学生端发送的数据，教师端需要将数据显示在答题记录页面
              //   }
              //   else if(msg.content.indexOf("SCORE")>0)		//互助加分记录。
              //   {
              //      listScoreHistory($.parseJSON(msg.content));
              //   }
              //}
              //catch(e){ }

              try{						//教师端不支持这个操作。
                //if(msg.to!="")
                //{ 
                //   if(msg.to == uname)
                //      dealCommand($.parseJSON(msg.content));
                //}
                //else
                //   dealCommand($.parseJSON(msg.content));
                if(bPlayer==true)//非播放页面，不执行，防止短时间内二次打开，出现角色倍增现象。
                {
                   if(msg.to == "" || msg.to == uname)//msg.to为空，表示广播；msg.to表示向目标发送
                   {
                      dealCommand($.parseJSON(msg.content));
                   }
                }
              }
              catch(e){ }

              //try{						//学生端不支持这个操作。
              //   dealCommandT($.parseJSON(msg.content));
              //}
              //catch(e){ }

           }
           //else if(bSelfShow==true)
           //{
           //   dealCommandT($.parseJSON(msg.content));

           //   bSelfShow=false;
           //}
           //else if(bQuizStopped==false) document.getElementById("status").innerText="已发送";
//      }
        //var data = sender + msg.content;
        //listMsgPlay(data);						//将接收到的数据显示在消息列表里

    };
}

var heartCheckPlay = {
    timeout: heartBeatTimePlay * 1000,  			// 心跳检测时长
    timeoutObj: null, 					// 定时变量
    reset: function () { 				// 重置定时
        clearTimeout(this.timeoutObj);
        return this;
    },
    start: function () { 				// 开启定时
        var self = this;
        this.timeoutObj = setTimeout(function () { 	// 心跳时间内收不到消息，主动触发连接关闭，开始重连
            wsPlay.close();
        }, this.timeout)
    }
}

/**
 * 在输入框内按下回车键时发送消息
 *
 * @param event
 *
 * @returns {boolean}
 */
/*
function confirmSendingPlay(event) {
    var key_num = event.keyCode;
    if (13 == key_num) {
        sendPlay();
    } else {
        return false;
    }
}
*/
/**
 * 发送并清空消息输入框内的消息
 */
function sendPlay() {
    var msg_box = document.getElementById("msg_box");
    //bQuizStopped=false;
    strMsgSendPlay = msg_box.value;

    var reg = new RegExp("\n", "g");
    content = strMsgSendPlay = strMsgSendPlay.replace(reg, "");

    var msg = { 'content': content.trim(), 'type': 'user' };

    //if(strMsgSendPlay.indexOf("QUIZ")>0)
    //{
    //   document.getElementById("msg_score").innerHTML="";
    //   document.getElementById("msg_list").style.display="none";
    //   document.getElementById("msg_scorehistory").style.display="none";
    //   document.getElementById("msg_scorehistory").style.border="";
    //   document.getElementById("msg_score").style.display="block";

    //   Quiz2($.parseJSON(msg_box.value));
    //}
    //else
    //{
    //   document.getElementById("msg_list").style.display="block";
    //   document.getElementById("msg_scorehistory").style.display="block";
    //   document.getElementById("msg_scorehistory").style.border="1px solid gray;";
    //   document.getElementById("msg_score").style.display="none";
    //}
    sendMsgPlay(msg);
}

/*
function addPlay(name) {
    if (name == 'car') {
        strMsgSendPlay = "oGUI.props.vm.addSprite(\"{\\\"name\\\":\\\"Car\\\",\\\"tags\\\":[\\\"people\\\",\\\"drawing\\\"],\\\"isStage\\\":false,\\\"variables\\\":{},\\\"costumes\\\":[{\\\"assetId\\\":\\\"48668e557594bc148a7d353fbd13878a\\\",\\\"name\\\":\\\"Car\\\",\\\"bitmapResolution\\\":1,\\\"md5ext\\\":\\\"48668e557594bc148a7d353fbd13878a.png\\\",\\\"dataFormat\\\":\\\"png\\\",\\\"rotationCenterX\\\":31,\\\"rotationCenterY\\\":100}],\\\"sounds\\\":[{\\\"assetId\\\":\\\"83a9787d4cb6f3b7632b4ddfebf74367\\\",\\\"name\\\":\\\"pop\\\",\\\"dataFormat\\\":\\\"wav\\\",\\\"format\\\":\\\"\\\",\\\"rate\\\":44100,\\\"sampleCount\\\":1032,\\\"md5ext\\\":\\\"83a9787d4cb6f3b7632b4ddfebf74367.wav\\\"}],\\\"blocks\\\":{}}\")";
        var msg = { 'content': strMsgSendPlay, 'type': 'user' };
        sendMsgPlay(msg);
    }
    else if (name == 'backdrop') {
        strMsgSendPlay = "var vmBackdrop = {name: \"RaceDrop2\", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};\n  oGUI.props.vm.addBackdrop(\"d35120a611f99b1ad29465141f4e1324.png\",vmBackdrop);";
        var msg = { 'content': strMsgSendPlay, 'type': 'user' };
        sendMsgPlay(msg);
    }
    else if (name == "menu") {
        strMsgSendPlay = "hideAllMenu();";
        var msg = { 'content': strMsgSendPlay, 'type': 'user' };
        sendMsgPlay(msg);
    }
    else if (name == "checkpoint") {
        strMsgSendPlay = "Question(\"ready\");";
        var msg = { 'content': strMsgSendPlay, 'type': 'user' };
        document.getElementById("msg_list").style.display="none";
        document.getElementById("msg_scorehistory").style.display="none";
        document.getElementById("msg_scorehistory").style.border="";

        document.getElementById("msg_score").style.display="block";
        document.getElementById("msg_score").innerHTML="";
        sendMsgPlay(msg);
    }
    else
    {
	strMsgSendPlay =name;
        if(strMsgSendPlay.indexOf("QUIZ")>0)
        {
           bQuizStopped=false;
           document.getElementById("msg_list").style.display="none";
           document.getElementById("msg_scorehistory").style.display="none";
           document.getElementById("msg_scorehistory").style.border="";
           document.getElementById("msg_score").style.display="block";
           if(strMsgSendPlay!="[\"QUIZ\",[\"0\",\"\"]]")
           {
              Quiz2($.parseJSON(strMsgSendPlay));
              document.getElementById("status").innerHTML='已发送';
              document.getElementById("msg_score").innerHTML="";
           }
           else
           {
              document.getElementById("status").innerHTML='已结束';
              if(bQuizStopped==false)
              {
                 bQuizStopped=true;
                 addCheckButton();
              }
           }
        }
        else
        {
           document.getElementById("msg_list").style.display="block";
           document.getElementById("msg_scorehistory").style.display="block";
           document.getElementById("msg_scorehistory").style.border="1px solid gray;"
           document.getElementById("msg_score").style.display="none";
           //document.getElementById("msg_score").innerHTML="";
        }

        var to = document.getElementById("to").innerText;
        var msg =   to=='全体'? { 'content': strMsgSendPlay , 'type': 'user'  ,'to':''} : { 'content': strMsgSendPlay , 'type': 'user'  ,'to':to};
        bSelfShow=  (to=='全体'?true:false);
        if(confirm("是否要向“ "+ to +" ”发送此命令？")==1)
        {
           sendMsgPlay(msg);
        }
        //var msg = { 'content': strMsgSendPlay , 'type': 'user' };
        //sendMsgPlay(msg);
    }
}
*/


/**
 * 将消息内容添加到输出框中,并将滚动条滚动到最下方
 */
/*
function listMsgPlay(data) {
   try{
    var msg_list = document.getElementById("msg_list");
    var msg = document.createElement("p");
    msg.innerHTML = data;
    msg.style.color = "red";
    msg.style.fontSize = "8px";

    msg_list.appendChild(msg);
    msg_list.scrollTop = msg_list.scrollHeight;
    }
    catch(e){}
}
*/
/**
 * 处理用户登陆消息
 *
 * @param user_name 用户名
 * @param type  login/logout
 * @param name_list 用户列表
 */
/*
function dealUserPlay(user_name, type, name_list) {

   try{
    var user_list = document.getElementById("user_list");
    var user_num = document.getElementById("user_num");
    user_list.innerHTML='';

    name_list=name_list.filter(function(s){return s && s.trim();});
    name_list.sort();
    var nUserCounter=0;
    for (var index in name_list) {
        var user = document.createElement("p");
        user.innerHTML = name_list[index];
        user.style.color = "green";
        user.style.fontSize = "8px";
        user.onclick=function(){chooseME(this);};
        user_list.appendChild(user);
    }
    user_num.innerHTML = name_list.length;//nUserCounter;
    user_list.scrollTop = user_list.scrollHeight;

    var change = type == "login" ? "上线" : "下线";
    var d = new Date();
    var n = d.toLocaleTimeString();

    var data = "Play系统消息(" + n + "): " + user_name + " 已" + change;
    listMsgPlay(data);
   }
   catch(e){}
}

/**
 * 教师端发送WebSocket重启命令
 */
function reboot2() {
    reconnect.lockReconnect=false;
    var msg = { 'content': '["REBOOT"]', 'type': 'user' };
    sendMsg(msg);
}

function chooseME(o)
{
   document.getElementById("to").innerText=o.innerText;
}


/**
 * 将数据转为json并发送
 * @param msg
 */
function sendMsgPlay(msg) {
    var data = JSON.stringify(msg);
    wsPlay.send(data);
}
