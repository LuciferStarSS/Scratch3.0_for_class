var strMsgSend = '';
var heartBeatTime = 60;				//一分钟一次
var wsSocket=null;
var bSelfShow=false;
var arrUsers=Array();

/**********************
  负责重连操作
********************** */
function reconnect(url) {
    if (reconnect.lockReconnect) return;
    setTimeout(function () {     			//没连接上会一直重连，设置延迟避免请求过多
       if(wsSocket)
       {
          if( wsSocket.readyState==1)
          {
              wsSocket.close();
          }

           wsSocket.onclose=null;				//清除连接失败的WebSocket的各类回显响应
           wsSocket.onerror=null;				//否则，当再次连接上后，会有N个连接成功的消息，
           wsSocket.onopen=null;				//其实是旧连接没有被清理掉。
           wsSocket.onmessage=null;
           wsSocket=null;
        }
        createWebSocket(url);
        reconnect.lockReconnect = false;
    }, 500);
}

/**********************
  创建连接WebSocket的客户端。
  检查浏览器支持哪种类型的连接。
********************** */
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

        $.post("websocket.php", {});//启动远程服务
        var d = new Date();
        var n = d.toLocaleTimeString();
        var data = "Panel系统消息 (" + n + "): 已退出。";
        listMsg(data,0);
        reconnect.lockReconnect = false;
        reconnect(strWebSocketServerURL);
    };
    wsSocket.onerror = function (err) {
        //if(admin && !wsSocket)
        $.post("websocket.php", {});//启动远程服务
        //$.post("websocket.php?t=" + Math.random(), {});//启动远程服务
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
        if(JSON.stringify(msg)=="{}") return;


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
            case 'chat':
                sender = msg.from + "(" + n + ")" + ': ';
                //if(msg.to==uname || msg.to=='')		//to为空，表示所有人都接收
                //{
                   arrChattingRoom_MSGLIST.push(Array(msg.from,msg.to==uname?"我":"所有人",msg.content));
                   bChattingRoom_NEWMESSAGE=true;
                //}
                break;
            case 'handshake':
                var user_info = { 'type': 'login', 'content': uname ,'lastID':lastID};
                sendMsg(user_info);
                return;
            case 'RELOGIN':
               //    alert("为保证系统稳定运行，请关闭多余的Scratch编辑器。");

                return;
            case 'login':
            case 'logout':
                user_name = msg.content;
                name_list = msg.user_list;
                arrUserList=name_list.filter(function(s){return s && s.trim();});				//过滤空白数据
                //更新聊天室成员名单
                //扩展ID：chattingroom
                //菜单ID：userlist
                var oEM=oVMM.props.vm.extensionManager.runtime._blockInfo.find(function(info){ return info.id ==="chattingroom";});
                if(oEM!=undefined){
                   var oMenu=oEM.menus.find(function (menu){ return menu.json.args0[0].name==="userlist"});
                   if(oMenu!=undefined){
                      oMenu.json.args0[0].options.length=0;
                      arrUserList.sort();
                      //ext[nExtID].menuInfo.userlist.items.length=0;
                      oMenu.json.args0[0].options.push(['所有人','']);
                      for(var j=0;j<arrUserList.length;j++){
                         if(arrUserList[j]!="")								//已经过滤过一遍了，再确认一下。
                            oMenu.json.args0[0].options.push([arrUserList[j],arrUserList[j]]);
                            //oEM.menuInfo.userlist.items.push(arrUserList[j]);				//可以省略
                      }
                      oVMM.props.vm.runtime.emit("BLOCKSINFO_UPDATE", oEM);				//BLOCKSINFO_UPDATE比EXTENSION_ADDED更贴切，但实际上，BLOCKSINFO_UPDATE还是调用了EXTENSION_ADDED。
                   }
                }

                change_type = msg.type;
                dealUser(user_name, change_type, name_list);
                return;
            default:
                return;
        }
//      if(msg.content!=undefined)				//处理异常数据
//      {
//         if(msg.content!=strMsgSend)				//非回显数据
           if(msg.from!="" && msg.from!=uname)				        //非回显数据
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
                 else if(dataCollecting==true && msg.content.indexOf("RACING_")===0){		//教师端收到学生端发出的速问速答的答案
                    var reg = new RegExp("QUIZKEY_", "g");
                    var content = msg.content.replace(reg, ""); //
                    listArg(msg.from,content);		//学生端发送的数据，教师端需要将数据显示在答题记录页面
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

              //try{						//学生端不支持这个操作。
              //   if(admin)
              //      dealCommandT($.parseJSON(msg.content));
              //   else
              //dealCommand($.parseJSON(msg.content));

              //}
              //catch(e){ }

           }
           else if(msg.from!="" && dataCollecting==true && msg.content.indexOf("RACING_")===0){		//教师端收到学生端发出的速问速答的答案
               var reg = new RegExp("QUIZKEY_", "g");
               var content = msg.content.replace(reg, ""); //
               listArg(msg.from,content);		//学生端发送的数据，教师端需要将数据显示在答题记录页面
           }

           else if(bSelfShow==true)
           {
              //try{
              //   if(admin)
              //      dealCommandT($.parseJSON(msg.content));
              //   else
              dealCommand($.parseJSON(msg.content));
              bSelfShow=false;
              //}
              //catch(e){}
           }
           else if(bQuizStopped==false && document.getElementById("status")!=undefined) document.getElementById("status").innerText="已发送";
//      }
        var data = sender + msg.content;
        //listMsg(data,1);						//将接收到的数据显示在消息列表里

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
        this.timeoutObj = setInterval(function () { 	// 心跳时间内检测连接状态，若非连通状态，就重连
            if(wsSocket.readyState!=1)
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

function BDUpdated() {
    reconnect.lockReconnect=false;
    var msg = { 'content': '["BDUPDATED"]', 'type': 'user' };
    sendMsg(msg);
}

function doCleaning()
{
    reconnect.lockReconnect=false;
    var msg = { 'content': '["CLEAN"]', 'type': 'user' };
    sendMsg(msg);
}

function setBGColor(color)
{
   document.getElementById('WB').style.background=color;
   var msg = { 'content': '["SETBGCOLOR","'+color+'"]', 'type': 'user' };
   sendMsg(msg);
}


function add(name) {
    if (name == 'car') {
        strMsgSend = "oVMM.props.vm.addSprite(\"{\\\"name\\\":\\\"Car\\\",\\\"tags\\\":[\\\"people\\\",\\\"drawing\\\"],\\\"isStage\\\":false,\\\"variables\\\":{},\\\"costumes\\\":[{\\\"assetId\\\":\\\"48668e557594bc148a7d353fbd13878a\\\",\\\"name\\\":\\\"Car\\\",\\\"bitmapResolution\\\":1,\\\"md5ext\\\":\\\"48668e557594bc148a7d353fbd13878a.png\\\",\\\"dataFormat\\\":\\\"png\\\",\\\"rotationCenterX\\\":31,\\\"rotationCenterY\\\":100}],\\\"sounds\\\":[{\\\"assetId\\\":\\\"83a9787d4cb6f3b7632b4ddfebf74367\\\",\\\"name\\\":\\\"pop\\\",\\\"dataFormat\\\":\\\"wav\\\",\\\"format\\\":\\\"\\\",\\\"rate\\\":44100,\\\"sampleCount\\\":1032,\\\"md5ext\\\":\\\"83a9787d4cb6f3b7632b4ddfebf74367.wav\\\"}],\\\"blocks\\\":{}}\")";
        var msg = { 'content': strMsgSend, 'type': 'user' };
        sendMsg(msg);
    }
    else if (name == 'backdrop') {
        strMsgSend = "var vmBackdrop = {name: \"RaceDrop2\", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};\n  oVMM.props.vm.addBackdrop(\"d35120a611f99b1ad29465141f4e1324.png\",vmBackdrop);";
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
    msg.style.fontSize = "12px";

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


var argArr=Array();
var argArr2=Array();
function showDataRecord()
{
    var argViewer=document.getElementById("msg_argviewer_data");
    argViewer.innerHTML='';

    var d=document.createElement("div");
    d.style="position: relative;height: 20px;border-bottom: 1px solid green;background:lightgrey;font-size:16px;font-weight:bold;";

    for(var i=0;i<argArr.length;i++)
    {
        var d=document.createElement("div");
        d.style="position: relative; height:18px;border-bottom: 1px solid red;";
        d.setAttribute("n",argArr[i][4].split("_")[0]);
        d.title="单击高亮，双击加分。";
        d.onclick=function(){
           this.style.background="yellow";
        };
        d.ondblclick=function(){
           //var arrNames=Array();
           //arrNames.push(this.getAttribute("n"));
           $.post("./CM/saveScores.php?t=" + Math.random(), { "S": this.getAttribute("n"),"T": "CARRACING"}, function (data) {
           if(data.length>0) alert(data);
         });
        };
        //argViewer.add(new Option(argArr[i][4]+"用时 "+argArr[i][0]+" 秒的参数=>\t步长："+argArr[i][1]+"\t左拐："+argArr[i][2]+"\t右拐："+argArr[i][3],''));
        var b1=document.createElement("span");
        b1.innerText=argArr[i][4];
        b1.style="left: 14px;position: absolute; width:100px; text-align:center;";
        d.append(b1);

        var b2=document.createElement("span");
        b2.innerText=argArr[i][0];
        b2.style="left: 120px;position: absolute;text-align: center;width: 80px;top:3px;";
        d.append(b2);

        var b3=document.createElement("span");
        b3.innerText=argArr[i][1];
        b3.style="left: 210px;position: absolute;text-align: center;width: 80px;top:3px;";
        d.append(b3);

        var b4=document.createElement("span");
        b4.innerText=argArr[i][2];
        b4.style="left: 300px;position: absolute;text-align: center;width: 80px;top:3px;";
        d.append(b4);

        var b5=document.createElement("span");
        b5.innerText=argArr[i][3];
        b5.style="left: 390px;position: absolute;text-align: center;width: 80px;top:3px;";
        d.append(b5);

        var b6=document.createElement("span");
        b6.innerText=argArr[i][5];
        b6.style="left: 488px;top:3px;position: absolute;text-align: center;width: 80px;height:20px;";
        //b6.onclick=(function(o){ return function(){argArr.splice(o,1);}}(i));
        d.append(b6);


        var b7=document.createElement("input");
        b7.type="button";
        b7.value="删除";
        b7.style="left: 560px;top:-1px;position: absolute;text-align: center;width: 61px;height:20px;";
        b7.onclick=(function(o){ return function(){argArr.splice(o,1); showDataRecord();}}(i));
        d.append(b7);

        argViewer.append(d);
        
    }
}

function showDataRecord2()
{
    var argViewer=document.getElementById("msg_argviewer2_data");
    argViewer.innerHTML='';

    var d=document.createElement("div");
    d.style="position: relative;height: 20px;border-bottom: 1px solid green;background:lightgrey;font-size:16px;font-weight:bold;";

    for(var i=0;i<argArr2.length;i++)
    {
        var d=document.createElement("div");
        d.style="position: relative; height:18px;border-bottom: 1px solid red;";
        d.setAttribute("n",argArr2[i][2].split("_")[0]);
        //d.title="单击高亮，双击加分。";
        d.onclick=function(){
           this.style.background="yellow";
        };
        d.ondblclick=function(){
           $.post("./CM/saveScores.php?t=" + Math.random(), { "S": this.getAttribute("n"),"T": "CARRACING"}, function (data) {
           if(data.length>0) alert(data);
         });
        };
        //argViewer.add(new Option(argArr[i][4]+"用时 "+argArr[i][0]+" 秒的参数=>\t步长："+argArr[i][1]+"\t左拐："+argArr[i][2]+"\t右拐："+argArr[i][3],''));

        var b1=document.createElement("span");//玩家
        b1.innerText=argArr2[i][2];
        b1.style="left: 0px;position: absolute;text-align: center;width: 80px;top:3px;";
        d.append(b1);


        var b1=document.createElement("span");//作者
        b1.innerText=argArr2[i][0];
        b1.style="left: 90px;position: absolute;text-align: center;width: 200px;top:3px;";
        d.append(b1);

        var b2=document.createElement("span");//消息
        b2.innerText=argArr2[i][1];
        b2.style="left: 280px;position: absolute;text-align: center;width: 80px;top:3px;";
        d.append(b2);

        var b3=document.createElement("span");//时间
        b3.innerText=argArr2[i][3];
        b3.style="left: 400px;position: absolute;text-align: center;width: 80px;top:3px;";
        d.append(b3);

        var b7=document.createElement("input");
        b7.type="button";
        b7.value="删除";
        b7.style="left: 560px;top:-1px;position: absolute;text-align: center;width: 61px;height:20px;";
        b7.onclick=(function(o){ return function(){argArr2.splice(o,1); showDataRecord2();}}(i));
        d.append(b7);

        argViewer.append(d);
        
    }
}

function listArg(strUser,strKey)
{
    var args=strKey.split("_");

    var date = new Date();
    var strTimestring = date.toLocaleTimeString();
    if(args.length==5 && args[1]!=0 && args[2]!=0 && args[3]!=0 && args[4]!=0)   			//args[0]=="RACING"
    {
       //var nUIndex=-1;
       //nUIndex=findKey2(argArr,strUser);
       //if(nUIndex>=0)
       //{
       //   argArr[nUIndex]=Array(args[1],strUser,strTimestring);
       //}
       //else
          argArr.push(Array(parseFloat(args[4]),args[1],args[2],args[3],strUser,strTimestring));
       argArr.sort(function(a,b){ var m=a[0];var n=b[0];return m-n;});
       showDataRecord();
    }
    else if(args.length==3)
    {
       var nUIndex=-1;
       nUIndex=findKey2(argArr2,strUser);
       if(nUIndex>=0)
       {
          argArr2[nUIndex]=Array(args[1],args[2],strUser,strTimestring);//文件名,得分,用户,时间戳
       }
       else
          argArr2.push(Array(args[1],args[2],strUser,strTimestring));
       argArr2.sort(function(a,b){ var m=a[1];var n=b[1];return -(m-n);});
       showDataRecord2();
    }
}

function findKey2(obj, value, compare =(a,b) => a===b){
   return Object.keys(obj).find( k => compare(obj[k][2],value))		//要寻找的用户名数据在[2]处。
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
         $.post("./CM/saveScores.php?t=" + Math.random(), { "S": arrNames.join()}, function (data) {
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
    msg.style.fontSize = "12px";

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

    arrUsers=name_list.filter(function(s){return s && s.trim();});
    arrUsers.sort();
    var nUserCounter=0;
    for (var index in arrUsers) {
        var user = document.createElement("p");
        user.innerHTML = arrUsers[index];
        user.style="color:green;font-Size:12px;cursor:grab";
        user.onclick=function(){chooseME(this);};
        user_list.appendChild(user);
    }
    user_num.innerHTML = arrUsers.length;//name_list.length;//nUserCounter;
    user_list.scrollTop = user_list.scrollHeight;

    var change = type == "login" ? ("<a onclick='chooseME(this);' style='cursor:grab;'><font color=green>" + user_name + "</font></a> 已上线") : ( user_name + " 已下线");
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
    if(wsSocket!=null && wsSocket.readyState==1)
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