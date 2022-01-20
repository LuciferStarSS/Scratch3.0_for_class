var strMsgSend = '';
var heartBeatTime = 180;				//一分钟一次
var wsSocket=null;


/**********************
  负责重连操作
***********************/
function reconnect(url) {
    if (reconnect.lockReconnect) return;
    setTimeout(function () {     			//没连接上会一直重连，设置延迟避免请求过多

        wsSocket.onclose=null;				//清除连接失败的WebSocket的各类回显响应
        wsSocket.onerror=null;				//否则，当再次连接上后，会有N个连接成功的消息，
        wsSocket.onopen=null;				//其实是旧连接没有被清理掉。
        wsSocket.onmessage=null;
        wsSocket=null;

        createWebSocket(url);
        reconnect.lockReconnect = false;
    }, 1000);
}

/**********************
  创建连接WebSocket的客户端。
  检查浏览器支持哪种类型的连接。
***********************/
function createWebSocket(url) {
    try {
        if ('WebSocket' in window) {
            wsSocket = new WebSocket(url);
        } else if ('MozWebSocket' in window) {
            wsSocket = new MozWebSocket(url);
        } else {
            _alert("当前浏览器不支持websocket协议,建议使用Chrome内核的浏览器。", 3000)
        }
        initEventHandle();
    } catch (e) {
        reconnect(url);
    }
}

// 初始化事件函数
function initEventHandle() {
    wsSocket.onclose = function () {
        var d = new Date();
        var n = d.toLocaleTimeString();
        var data = "Panel系统消息 (" + n + "): 已退出。";
        listMsg(data,0);
        reconnect.lockReconnect = false;
        reconnect(strWebSocketServerURL);
    };
    wsSocket.onerror = function (err) {
        $.post("websocket.php?t=" + Math.random(), {},function(data)
{
alert(data);
});//启动远程服务
        var d = new Date();
        var n = d.toLocaleTimeString();
        var data = "Panel系统消息 (" + n + "): 出错了，正在尝试重新运行服务，请稍候。";
        listMsg(data,0);

        reconnect.lockReconnect = false;
        reconnect(strWebSocketServerURL);
    };
    wsSocket.onopen = function () {
        var d = new Date();
        var n = d.toLocaleTimeString();
        var data = "Panel系统消息 (" + n + ")：建立连接成功。";
        listMsg(data,0);
        reconnect.lockReconnect = true;
        heartCheck.reset().start();      		//心跳检测重置
    };
    wsSocket.onmessage = function (msg) {    			//如果获取到消息，心跳检测重置
        var msg = JSON.parse(msg.data);
        var sender, user_name, name_list, change_type;
        var d = new Date();
        var n = d.toLocaleTimeString();

        heartCheck.reset().start();      		//拿到任何消息都说明当前连接是正常的
        switch (msg.type) {
            case 'system':
                sender = "Panel系统消息(" + n + ")+: ";
                break;
            case 'user':
                sender = msg.from + "(" + n + ")" + ': ';
                break;
            case 'handshake':
                var user_info = { 'type': 'login', 'content': uname ,'lastID':lastID};
                sendMsg(user_info);
                return;
            case 'login':
            case 'logout':
                user_name = msg.content;
                name_list = msg.user_list;
                change_type = msg.type;
                dealUser(user_name, change_type, name_list);
                return;
            default:
                return;
        }
//      if(msg.content!=undefined)				//处理异常数据
//      {
//         if(msg.content!=strMsgSend)				//非回显数据
           if(msg.from!=uname)				        //非回显数据
           {
              if(msg.lastID!=undefined)
              {
                 lastID=msg.lastID;
                 document.cookie="QuizID=;";
              }

              //try{						//学生端不支持这个操作。
                 if(msg.content.indexOf("QUIZKEY_")===0){		//教师端收到学生端发出的速问速答的答案
                    var reg = new RegExp("QUIZKEY_", "g");
		    var content = msg.content.replace(reg, ""); //
                    listScore(msg.from,content);		//学生端发送的数据，教师端需要将数据显示在答题记录页面
                 }
                 else if(msg.content.indexOf("SCORE")>0)		//互助加分记录。
                 {
                    listScoreHistory($.parseJSON(msg.content));
                 }
              //}
              //catch{ }


              try{						//教师端不支持这个操作。

                if(msg.to == "" || msg.to == undefined || msg.to == uname)//msg.to为空，表示广播；msg.to表示向目标发送
                {
                   dealCommand($.parseJSON(msg.content));
                }

                //if(msg.to!="")
                //{ 
                //   if(msg.to == uname)
                //      dealCommand($.parseJSON(msg.content));
                //}
                //else
                //  dealCommand($.parseJSON(msg.content));

              }
              catch(e){ }

              try{						//学生端不支持这个操作。
                 dealCommandT($.parseJSON(msg.content));
              }
              catch(e){ }

           }
           else if(bSelfShow==true)
           {
              try{
                 dealCommandT($.parseJSON(msg.content));
                 bSelfShow=false;
              }
              catch(e){}
           }
           else if(bQuizStopped==false) document.getElementById("status").innerText="已发送";
//      }
        var data = sender + msg.content;
        listMsg(data,1);						//将接收到的数据显示在消息列表里

    };
}

var heartCheck = {
    timeout: heartBeatTime * 1000,  			// 心跳检测时长
    timeoutObj: null, 					// 定时变量
    reset: function () { 				// 重置定时
        clearTimeout(this.timeoutObj);
        return this;
    },
    start: function () { 				// 开启定时
        var self = this;
        this.timeoutObj = setTimeout(function () { 	// 心跳时间内收不到消息，主动触发连接关闭，开始重连
            wsSocket.close();
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
function confirmSending(event) {
    var key_num = event.keyCode;
    if (13 == key_num) {
        send();
    } else {
        return false;
    }
}

/**
 * 发送并清空消息输入框内的消息
 */
function send() {
    var msg_box = document.getElementById("msg_box");
    bQuizStopped=false;
    strMsgSend = msg_box.value;

    var reg = new RegExp("\n", "g");
    content = strMsgSend = strMsgSend.replace(reg, "");

    var msg = { 'content': content.trim(), 'type': 'user' };

    if(strMsgSend.indexOf("QUIZ")>0)
    {
       document.getElementById("msg_score").innerHTML="";
       document.getElementById("msg_list").style.display="none";
       document.getElementById("msg_scorehistory").style.display="none";
       document.getElementById("msg_scorehistory").style.border="";
       document.getElementById("msg_score").style.display="block";

       Quiz2($.parseJSON(msg_box.value));
    }
    else
    {
       document.getElementById("msg_list").style.display="block";
       document.getElementById("msg_scorehistory").style.display="block";
       document.getElementById("msg_scorehistory").style.border="1px solid gray;";
       document.getElementById("msg_score").style.display="none";
    }
    sendMsg(msg);
}

/**
 * 教师端发送WebSocket重启命令
 */
function reboot1() {
    reconnect.lockReconnect=false;
    var msg = { 'content': '["REBOOT"]', 'type': 'user' };
    sendMsg(msg);
}


function add(name) {
    if (name == 'car') {
        strMsgSend = "oGUI.props.vm.addSprite(\"{\\\"name\\\":\\\"Car\\\",\\\"tags\\\":[\\\"people\\\",\\\"drawing\\\"],\\\"isStage\\\":false,\\\"variables\\\":{},\\\"costumes\\\":[{\\\"assetId\\\":\\\"48668e557594bc148a7d353fbd13878a\\\",\\\"name\\\":\\\"Car\\\",\\\"bitmapResolution\\\":1,\\\"md5ext\\\":\\\"48668e557594bc148a7d353fbd13878a.png\\\",\\\"dataFormat\\\":\\\"png\\\",\\\"rotationCenterX\\\":31,\\\"rotationCenterY\\\":100}],\\\"sounds\\\":[{\\\"assetId\\\":\\\"83a9787d4cb6f3b7632b4ddfebf74367\\\",\\\"name\\\":\\\"pop\\\",\\\"dataFormat\\\":\\\"wav\\\",\\\"format\\\":\\\"\\\",\\\"rate\\\":44100,\\\"sampleCount\\\":1032,\\\"md5ext\\\":\\\"83a9787d4cb6f3b7632b4ddfebf74367.wav\\\"}],\\\"blocks\\\":{}}\")";
        var msg = { 'content': strMsgSend, 'type': 'user' };
        sendMsg(msg);
    }
    else if (name == 'backdrop') {
        strMsgSend = "var vmBackdrop = {name: \"RaceDrop2\", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};\n  oGUI.props.vm.addBackdrop(\"d35120a611f99b1ad29465141f4e1324.png\",vmBackdrop);";
        var msg = { 'content': strMsgSend, 'type': 'user' };
        sendMsg(msg);
    }
    else if (name == "menu") {
        strMsgSend = "hideAllMenu();";
        var msg = { 'content': strMsgSend, 'type': 'user' };
        sendMsg(msg);
    }
    else if (name == "checkpoint") {
        strMsgSend = "Question(\"ready\");";
        var msg = { 'content': strMsgSend, 'type': 'user' };
        document.getElementById("msg_list").style.display="none";
        document.getElementById("msg_scorehistory").style.display="none";
        document.getElementById("msg_scorehistory").style.border="";

        document.getElementById("msg_score").style.display="block";
        document.getElementById("msg_score").innerHTML="";
        sendMsg(msg);
    }
    else
    {
	strMsgSend =name;
        if(strMsgSend.indexOf("QUIZ")>0)
        {
           bQuizStopped=false;
           document.getElementById("msg_list").style.display="none";
           document.getElementById("msg_scorehistory").style.display="none";
           document.getElementById("msg_scorehistory").style.border="";
           document.getElementById("msg_score").style.display="block";
           if(strMsgSend!="[\"QUIZ\",[\"0\",\"\"]]")
           {
              Quiz2($.parseJSON(strMsgSend));
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
        var msg =   to=='全体'? { 'content': strMsgSend , 'type': 'user'  ,'to':''} : { 'content': strMsgSend , 'type': 'user'  ,'to':to};
        bSelfShow=  (to=='全体'?true:false);
        if(confirm("是否要向“ "+ to +" ”发送此命令？")==1)
        {
           //if(strMsgSend.indexOf("INVITATION")>0)  sendMsgPlay(msg);
           //else if(strMsgSend.indexOf("GREENFLAG")>0)  sendMsgPlay(msg);
           //else if(strMsgSend.indexOf("STOPALL")>0)  sendMsgPlay(msg);
           //else if(to=="Stage")  sendMsgPlay(msg);

           sendMsg(msg);	//上课管理广播
           sendMsgPlay(msg);    //同台竞技广播
        }

        //var msg = { 'content': strMsgSend , 'type': 'user' };
        //sendMsg(msg);
    }
}

function listScoreHistory(data) {
    var msg_list = document.getElementById("msg_scorehistory");
    var d = new Date();
    var n = d.toLocaleTimeString();

    var msg = document.createElement("p");
    msg.innerHTML = "互帮互助("+n+")："+ data[1]+"给"+data[2]+"加了"+data[3]+"分";
    msg.style.color = "red";
    msg.style.fontSize = "8px";

    msg_list.appendChild(msg);
    msg_list.scrollTop = msg_list.scrollHeight;
}

function listScore(strUser,strKey)
{
    var msg_score = document.getElementById("msg_score");
    var msg = document.createElement("P");
    msg.innerHTML = strUser+"<br>"+strKey;
    msg.style.color = "black";
    msg.style.fontSize = "10px";
    msg.style.float = "left";
    msg.style.margin = "4px 0px 0px 4px";
    msg.style.width="70px";
    msg.style.height="30px";

    msg.style.background = "aliceblue";
    msg.style.textAlign = "center";

    msg_score.appendChild(msg);
    msg_score.scrollTop = msg_score.scrollHeight;

    document.getElementById("status").innerHTML="["+ msg_score.childElementCount +"/"+ (parseInt(document.getElementById("user_num").innerText)-1) +"]";
    if(msg_score.childElementCount==(parseInt(document.getElementById("user_num").innerText)-1))
    {
       document.getElementById("status").innerHTML='已结束';
       if(bQuizStopped==false)
       {
          bQuizStopped=true;
          addCheckButton();
       }
    }
}

function addCheckButton()
{
    var msg_score = document.getElementById("msg_score");

    var checkButton = document.createElement("input");

    checkButton.type="button";

    checkButton.value= "阅卷";

    checkButton.style.fontSize = "10px";

    checkButton.style.float = "left";

    checkButton.style.margin = "4px 0 0 4";

    checkButton.style.width="70px";

    checkButton.style.height="30px";


    checkButton.style.background = "aliceblue";

    checkButton.style.textAlign = "center";
    checkButton.onclick=function(){ showRightKey(checkButton);};//{checkAnswer();}
    msg_score.appendChild(checkButton);
}

function showRightKey(checkButton)
{
    document.getElementById("quiz").style.visibility="visible";	//显示窗口
}

function checkAnswer(value)
{
   var a=document.getElementById("msg_score");
   var arrNames=Array();
   for(var i=0;i<a.childElementCount;i++)
   { 
      if(a.children[i].tagName=="P")
      {
         if(a.children[i].innerText.split("\n")[1]==value)
         {
            arrNames.push(a.children[i].innerText.split("\n")[0].split("_")[0]);
            a.children[i].style.background="cyan";
         }
         else
         {
            a.children[i].style.background="red";
         }
      }
   }
   document.getElementById("quiz").style.visibility="hidden";	//隐藏窗口
   if(arrNames!=null)
   {
      if(confirm("是否更新学生成绩？")==1)
      {
         $.post("saveScores.php?t=" + Math.random(), { "S": arrNames.join()}, function (data) {
           if(data.length>0) alert(data);
         });
      }
   }
}

/**
 * 将消息内容添加到输出框中,并将滚动条滚动到最下方
 */
function listMsg(data,type) {
   try{
    var msg_list = document.getElementById("msg_list");
    var msg = document.createElement("p");
    if(type==1)
    {
       data=data.replace(/</g,"[");
       data=data.replace(/>/g,"]");

       msg.innerHTML = "<pre>"+data+"</pre>";
    }
    else
       msg.innerHTML = data;

    msg.style.color = "gray";
    msg.style.fontSize = "8px";

    msg_list.appendChild(msg);
    msg_list.scrollTop = msg_list.scrollHeight;
    }
    catch(e){}
}

/**
 * 处理用户登陆消息
 *
 * @param user_name 用户名
 * @param type  login/logout
 * @param name_list 用户列表
 */
function dealUser(user_name, type, name_list) {

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

    var change = type == "login" ? ("<a onclick='chooseME(this);'><font color=green>" + user_name + "</font></a> 已上线") : ( user_name + " 已下线");
    var d = new Date();
    var n = d.toLocaleTimeString();

    var data = "Panel系统消息(" + n + "): " + change;
    listMsg(data,0);
   }
   catch(e){}
}

function chooseME(o)
{
   document.getElementById("to").innerText=o.innerText;
}

/**
 * 将数据转为json并发送
 * @param msg
 */
function sendMsg(msg) {
    var data = JSON.stringify(msg);
    wsSocket.send(data);
}

/**
 * 生产一个全局唯一ID作为用户名的默认值;
 *
 * @param len
 * @param radix
 * @returns {string}
 */
function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        var r;

        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}