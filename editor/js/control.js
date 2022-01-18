/***********************************************************
项目加载后，每次积木的变化，都会触发备份操作；
保存操作将会清除备份。或者，让学生选择是否要清除备份。
************************************************************/
var scratch = null;			//Scratch主窗口
var bLoaded = false;			//检测是否已经加载项目文件
var bPlayMode = true;			//Scratch模式：  true:播放模式	false:编辑模式
var bFirstTimeSaving = true;		//新建后第一次保存，需要刷新文件夹。
var bReady=true;			//界面已经打开完毕。

var nBKFileIndex = 0;
var nBKFileTotal = 0;
var arrBKFiles = Array();

var bViewSourceAllowed = true;
var bFullScreenStatus = false;		//true:全屏播放模式 false:编辑模式
var bCodeViewableFile = true;		//true:允许查看源码的文件 false:只能播放的文件

var strSelectedFilename = '';
var bInvited=false;
var strInvited="";
var lastViewed = '';//最后一次查看的佳作

var arrBlocks = Array(
    //Array('[["procDef", "新模块 %n %s %b 文本", ["数字", "字符串", "布尔"], [1, "", false], false]]','新模块'),
    //Array('[["procDef", "新模块 %n %s %b 文本", ["数字", "字符串", "布尔"], [1, "", false], false]]','新模块'),
    //Array('[["procDef", "新模块 %n %s %b 文本", ["数字", "字符串", "布尔"], [1, "", false], false]]','新模块'),
    Array('INSERTSPRITE', '请找到并双击资源库中的角色', 'Cat1'),

    Array('[["whenGreenFlag"]]', '添加一个“当绿旗被点击”事件'),
    Array('[["forward:",10]]', '前进10步'),
    Array('[["nextCostume"]]', '下一个造型'),
    Array('[["bounceOffEdge"]]', '遇到边界就反弹'),
    Array('[["doForever"]]', '把刚才添加的代码全部包裹住。完成后，请点绿旗。')
);

var script_1 = '[["whenGreenFlag"],["deleteLine:ofList:", "all", "轨迹"],["setVar:to:", "尾巴数量", "0"],["append:toList:", ["xpos"], "轨迹"],["append:toList:", ["ypos"], "轨迹"],["append:toList:", ["heading"], "轨迹"],["doForever",[["nextCostume"],["wait:elapsed:from:", 0.1],["setVar:to:", "循环计数器", "0"],["doUntil",[">", ["readVariable", "循环计数器"], ["readVariable", "尾巴数量"]],[["changeVar:by:", "循环计数器", 1],["setLine:ofList:to:",["+", ["*", ["-", ["readVariable", "循环计数器"], 1], 3], 1],"轨迹",["getLine:ofList:", ["+", ["*", ["readVariable", "循环计数器"], 3], 1], "轨迹"]],["setLine:ofList:to:",["+", ["*", ["-", ["readVariable", "循环计数器"], 1], 3], 2],"轨迹",["getLine:ofList:", ["+", ["*", ["readVariable", "循环计数器"], 3], 2], "轨迹"]],["setLine:ofList:to:",["+", ["*", ["-", ["readVariable", "循环计数器"], 1], 3], 3],"轨迹",["getLine:ofList:", ["+", ["*", ["readVariable", "循环计数器"], 3], 3], "轨迹"]]]],["forward:", 15],["setLine:ofList:to:", ["+", ["*", ["readVariable", "尾巴数量"], 3], 1], "轨迹", ["xpos"]],["setLine:ofList:to:", ["+", ["*", ["readVariable", "尾巴数量"], 3], 2], "轨迹", ["ypos"]],["setLine:ofList:to:", ["+", ["*", ["readVariable", "尾巴数量"], 3], 3], "轨迹", ["heading"]],["doIf",["touching:", "Shark"],[["broadcast:", "被吃了"],["broadcast:", ["concatenate:with:", "减少", ["readVariable", "尾巴数量"]]],["changeVar:by:", "尾巴数量", -1],["deleteLine:ofList:", "last", "轨迹"],["deleteLine:ofList:", "last", "轨迹"],["deleteLine:ofList:", "last", "轨迹"],["doIf",["<", ["readVariable", "尾巴数量"], "0"],[["say:duration:elapsed:from:", "Hello!", 2], ["stopScripts", "all"]]]]],["doIf",["touching:", "角色2"],[["changeVar:by:", "尾巴数量", 1],["broadcast:", ["readVariable", "尾巴数量"]],["broadcast:", "吃到了"],["append:toList:", ["xpos"], "轨迹"],["append:toList:", ["ypos"], "轨迹"],["append:toList:", ["heading"], "轨迹"]]],["doIf", ["color:sees:", -65536, -10066330], [["say:duration:elapsed:from:", "踩到自己的舌头了，好疼！", 2], ["wait:elapsed:from:", 2]]]]]]]';


var script_2 = '';


//var auto_1='[["procDef", "画星星 角数 %n 边长 %n", ["角数", "边长"], [1, 1], false],["doRepeat",["getParam", "角数", "r"],[["forward:", ["getParam", "边长", "r"]],["turnRight:", ["-", 180, ["\/", 180, ["getParam", "角数", "r"]]]]]]]]';

var auto_1 = '[["procDef", "花朵 花瓣数 %n",["花瓣数"], [1, 1], false]]';


//var auto_2='[["procDef", "画多边形 边数 %n 边长 %n", ["边数", "边长"], [1, 1], false],["doRepeat",["getParam", "边数", "r"],[["forward:", ["getParam", "边长", "r"]],["turnRight:", ["\/", 360, ["getParam", "边数", "r"]]]]]]]';

function auto1() {
    ////scratch.insertBlock(auto_1);	//添加新积木
}

function auto2() {
    ////scratch.insertBlock(auto_2);	//添加新积木
}

function startScript1() {
    ////scratch.insertBlock(script_1);	//添加新积木
}

function startScript2() {
    ////scratch.insertBlock(script_2);	//添加新积木

}
//alert(arrBlocks);
var nBlockLen = arrBlocks.length;
var nBlock = 0;
var bWaitforINSERTED = false;
var bDemoBegin = 0;

function showthisinfo(o) {
    var currentstep = document.getElementById("infotext");
    currentstep.innerHTML = "<textarea readonly style='margin: 0px; width: 240px; height: 125px;'>" + o.options[o.selectedIndex].value + "</textarea>";
}

function showthislabinfo(o) {
    var currentstep = document.getElementById("labinfotext");
    currentstep.innerHTML = "<textarea readonly style='margin: 0px; width: 240px; height: 125px;'>" + o.options[o.selectedIndex].value + "</textarea>";
}

var stepshow = false;
var talkshow = false;
var fileshow = false;
var taskshow = true;
var labshow = false;

function hideAll() {
    talkshow = true;
    fileshow = true;
    taskshow = true;
    labshow = true;
    showtasks();
    showfiles();
    showtalks();
    showlabs();
}


function hideAllMenu() {
    talkshow = true;
    fileshow = true;
    taskshow = false;
    labshow = true;
    showtasks();
    showfiles();
    showtalks();
    showlabs();
}

function showmenu(nBar) {
  if(bReady==true)
  {
    if (nBar == 1)//任务
    {
        if (taskshow == true) {
            showtasks();
        }
        else//任务页面不需要跟其它三个页面互斥。
        {
            taskshow = false;
            showtasks();
        }
    }
    else if (nBar == 2)//文件
    {
        if (fileshow == true) {
            showfiles();
        }
        else {
            fileshow = false;
            showfiles();
            //labshow=true;
            //showlabs();
            //talkshow=true;
            //showtalks();
        }
    }
    else if (nBar == 3)//社区
    {
        if (talkshow == true) {
            showtalks();
        }
        else {
            //fileshow=true;
            //showfiles();
            //labshow=true;
            //showlabs();
            talkshow = false;
            showtalks();
        }
    }
    else if (nBar == 4)//实验室
    {
        if (labshow == true) {
            showlabs();
        }
        else {
            //fileshow=true;
            //showfiles();
            //talkshow=true;
            //showtalks();
            labshow = false;
            showlabs();
        }
    }
  }
  else alert("页面尚未加载完毕，请稍等。");
}

function showsteps() {
    var o = document.getElementById("info");
    var m = document.getElementById("moresteps");
    if (stepshow == false) {
        m.innerHTML = "<font size=2>↑</font>"
        o.style.display = "block";
    }
    else {
        m.innerHTML = "<font size=2>↓</font>"
        o.style.display = "none";
    }
    stepshow = !stepshow;
}

function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg))
 
        return unescape(arr[2]);
    else
        return null;
}


function showtasks() {
    var o = document.getElementById("task");
    var m = document.getElementById("moretask");
    if (taskshow == false) {
        m.innerHTML = "↑任务↑";
        o.style.display = "block";
        o.style.top="196px";
        o.style.left="485px";

        var d=document.getElementsByClassName("div-inline");
        for(var i=0;i<d.length;i++)
        {
           if(getCookie(d[i].id) =="true")
              d[i].style.visibility="visible";
        }
    }
    else {
        m.innerHTML = "↓任务↓";
        o.style.display = "none";
    }
    taskshow = !taskshow;
}


function showfiles() {
    var o = document.getElementById("files");
    var m = document.getElementById("morefiles");
    if (fileshow == false) {
        m.innerHTML = "↑文件↑";
        o.style.display = "block";
        o.style.top = "49px";
        o.style.left = "343px";
        if (classid != '') {
            var s = document.getElementById('c');
            if (s != null) {
                for (var i = 0; i < c.length; i++) {
                    if (s[i].value == classid) s.selectedIndex = i;
                }
            }
            loadFolder(classid);
        }

        if (talkshow == true)//如果文件窗口已打开，则社区窗口停靠在文件窗口右侧
        {
            var t = document.getElementById("talk");
            o.style.top = t.style.top;
            o.style.left = (parseInt(t.style.left) - parseInt(o.style.width) - 1);
            if (labshow == true)//如果此时佳作欣赏窗口已打开，则挤开佳作欣赏窗口
            {
                var l = document.getElementById("lab");
                l.style.top = o.style.top;
                l.style.left = (parseInt(t.style.left) + parseInt(t.style.width) + 1);
            }
        }
        else if (labshow == true)//如果此时佳作欣赏窗口已打开，则挤开佳作欣赏窗口
        {
            var l = document.getElementById("lab");
            o.style.top = l.style.top;
            o.style.left = (parseInt(l.style.left) - parseInt(o.style.width) - 1);
        }
    }
    else {
        m.innerHTML = "↓文件↓";
        o.style.display = "none";
    }
    fileshow = !fileshow;
}

function showtalks() {
    var o = document.getElementById("talk");
    var m = document.getElementById("moremsg");
    if (talkshow == false) {
        m.innerHTML = "↑社区↑";
        o.style.display = "block";
        o.style.top = "49px";
        o.style.left = "431px";

        if (fileshow == true)//如果文件窗口已打开，则社区窗口停靠在文件窗口右侧
        {
            var f = document.getElementById("files");
            o.style.top = f.style.top;
            o.style.left = (parseInt(f.style.left) + parseInt(f.style.width) + 1);
            if (labshow == true)//如果此时佳作欣赏窗口已打开，则挤开佳作欣赏窗口
            {
                var l = document.getElementById("lab");
                l.style.top = o.style.top;
                l.style.left = (parseInt(o.style.left) + parseInt(o.style.width) + 1);
            }
        }
        else if (labshow == true)//如果此时佳作欣赏窗口已打开，则挤开佳作欣赏窗口
        {
            var l = document.getElementById("lab");
            o.style.top = l.style.top;
            o.style.left = (parseInt(l.style.left) - parseInt(o.style.width) - 1);
        }
    }
    else {
        m.innerHTML = "↓社区↓";
        o.style.display = "none";
        if (fileshow == true && labshow == true)//如果文件和佳作欣赏窗口都被打开，则将佳作欣赏窗口停靠在文件窗口右侧
        {
            var f = document.getElementById("files");
            var l = document.getElementById("lab");
            l.style.top = f.style.top;
            l.style.left = (parseInt(f.style.left) + parseInt(f.style.width) + 1);
        }
    }
    talkshow = !talkshow;
}

function showlabs() {
    var o = document.getElementById("lab");
    var m = document.getElementById("moretocome");
    if (labshow == false) {
        getTopList();
        m.innerHTML = "↑佳作欣赏↑";
        o.style.display = "block";
        o.style.top = "49px";
        o.style.left = "519px";

        if (talkshow == true) {
            var t = document.getElementById("talk");
            o.style.top = t.style.top;
            o.style.left = (parseInt(t.style.left) + parseInt(t.style.width) + 1);
        }
        else if (fileshow == true) {
            var f = document.getElementById("files");
            o.style.top = f.style.top;
            o.style.left = (parseInt(f.style.left) + parseInt(f.style.width) + 1);
        }
    }
    else {
        m.innerHTML = "↓佳作欣赏↓";
        o.style.display = "none";
    }
    labshow = !labshow;
}

function startDemo() {
    bDemoBegin = 1;

    if (nBlock == 0) {
        var steps = document.getElementById("steps");
        steps.length = 0;
        bLoaded = false;
        bPlayMode = false;
        setMode();
    }
    insert();
}

function insert() {
    labshow = false;
    showlabs();

    var currentstep = document.getElementById("labinfotext");
    var steps = document.getElementById("steps");

    if (arrBlocks[nBlock][0] == "INSERTSPRITE") {
        currentstep.innerHTML = "<textarea readonly style='margin: 0px; width: 210px; height: 125px;'>" + arrBlocks[nBlock][1] + arrBlocks[nBlock][2] + "</textarea>";  		//显示提示信息
        steps.add(new Option(arrBlocks[nBlock][1] + arrBlocks[nBlock][2], arrBlocks[nBlock][1] + arrBlocks[nBlock][2]))
        bWaitforINSERTED = true;
        ////scratch.insertSprite();				//添加新角色
        nBlock++;
    }
    else if (arrBlocks[nBlock][0] == '[["whenGreenFlag"]]' || arrBlocks[nBlock][0].indexOf("procDef") > 0)//部分起点积木，需要用这种方式来激发后续的执行操作。
    {
        currentstep.innerHTML = "<textarea readonly style='margin: 0px; width: 210px; height: 125px;'>" + arrBlocks[nBlock][1] + "</textarea>";  		//显示提示信息
        steps.add(new Option(arrBlocks[nBlock][1], arrBlocks[nBlock][1]))
        bWaitforINSERTED = false;
        ////scratch.insertBlock(arrBlocks[nBlock][0]);	//添加新积木
        nBlock++;
    }
    else {
        currentstep.innerHTML = "<textarea readonly style='margin: 0px; width: 210px; height: 125px;'>" + arrBlocks[nBlock][1] + "</textarea>";  		//显示提示信息
        steps.add(new Option(arrBlocks[nBlock][1], arrBlocks[nBlock][1]))
        bWaitforINSERTED = true;
        ////scratch.insertBlock(arrBlocks[nBlock][0]);	//添加新积木
        nBlock++;
    }
    if (nBlock == nBlockLen) { bDemoBegin = 0; nBlock = 0; }
}


/******
*
**  多人竞技投屏的信息更新。
*
******/
function  updateNP(nType,strArg)
{
   //if(strInvited==true)//已被邀请，可以发送数据。
   //{
      var content="[\"NP\",\""+uname+"\","+nType+",["+strArg+"]]";	//发送数据：当前用户名，(X坐标，Y坐标，方向，大小，造型文件，造型编号)
      var msg = {'content':content, 'type': 'user', 'to':'Stage'};	//定向发送到Stage
      sendMsgPlay(msg);
   //}
}
/***********************************************************
接收来自//scratch的回调消息，共四种。
var str:
LOADED:加载完毕
RELOAD:重新加载
INSERTED:已插入
REMOVED:已移除
SAVENEEDED:需要保存

在LOADED后，INSERTED和REMOVED会触发自动备份
************************************************************/
function scratchStatus(str) 
{
    if (str == "LOADED") 
    {
       bLoaded = true;
       if(bWaiting==true)							//界面屏蔽控制
          document.getElementById('waiting').style.visibility = "visible";
       else
          document.getElementById('waiting').style.visibility = "hidden";

       setTimeout("bReady=true;setNewControl();",500);					//1秒后隐藏角色和背景添加按钮，默认隐藏

       oGUI.props.vm.runtime.ioDevices.userData._username=strCurrentUser;//当前用户名初始化。
       showRecord();
       //if(admin==1)
       //  getSprites("sprites");
       //getSprites("spritestoshare");
    }			//项目文件加载完毕
    else if (str == "RELOAD") bLoaded = false;		//开始打开其它项目文件
    //else if(bLoaded==true)				//项目文件加载完毕后，其它消息将触发自动保存操作。
    //   asAutoSaveOnLine();

    //if(str=="STOPALL") bInvited=false;

    if (bLoaded == true && str == "BACKUPNEEDED") asAutoSaveOnLine();

    //以下是实验室功能
    if (bWaitforINSERTED == false && str == "SAVENEEDED")	//有些积木，在插入后，是不会激发INSERTED消息的，需要单独处理。
    {
        if (bDemoBegin == 1) {
            insert();
            bWaitforINSERTED = true;				//插入后，需要恢复信号控制量，防止重复进入。
        }
    }
    else if (str == "INSERTED" && nBlock < nBlockLen) 	//正常的INSERTED消息处理
    {
        if (bDemoBegin == 1)
            insert();
    }
    else if(str == "NEWOPT")//检查是否允许新建操作             NEWCHAR==1  BD==1   sprite:visible   stage:visible   box:visible
    {                       //                                NEWCHAR==1  BD==0   sprite:visible   stage:hidden    box:checkTabName
                            //				      NEWCHAR==0  BD==1   sprite:hidden    stage:visible   box:checkTabName
                            //                                NEWCHAR==0  BD==0   sprite:hidden    stage:hidden    box:hidden
        setNewControl();
    }
}

function setNewControl()
{

   var bBD=getCookie("BD");
   var bNC=getCookie("CHAR");
   if(bBD==bNC)//两者一致
   {
      if(bBD==1)
      {

         document.getElementsByClassName("action-menu_menu-container_3a6da sprite-selector_add-button_1XCwG")[0].style.visibility="visible";//角色
         document.getElementsByClassName("action-menu_menu-container_3a6da stage-selector_add-button_1sKuU")[0].style.visibility="visible";//舞台
         if(document.getElementsByClassName("selector_new-buttons_2qHDd box_box_2jjDp").length==1)
            document.getElementsByClassName("selector_new-buttons_2qHDd box_box_2jjDp")[0].style.visibility="visible";//编辑区的控制入口
      }
      else
      {
         document.getElementsByClassName("action-menu_menu-container_3a6da sprite-selector_add-button_1XCwG")[0].style.visibility="hidden";//角色
         document.getElementsByClassName("action-menu_menu-container_3a6da stage-selector_add-button_1sKuU")[0].style.visibility="hidden";//舞台
         if(document.getElementsByClassName("selector_new-buttons_2qHDd box_box_2jjDp").length==1)
            document.getElementsByClassName("selector_new-buttons_2qHDd box_box_2jjDp")[0].style.visibility="hidden";//编辑区的控制入口
      }
   }
   else
   {
      if(bBD==1)
      {
         document.getElementsByClassName("action-menu_menu-container_3a6da stage-selector_add-button_1sKuU")[0].style.visibility="visible";//舞台
         if(document.getElementsByClassName("react-tabs_react-tabs__tab--selected_EW0CL")[0].innerText=="背景")
            document.getElementsByClassName("selector_new-buttons_2qHDd box_box_2jjDp")[0].style.visibility="visible";//编辑区的控制入口
      }
      else
      {
         document.getElementsByClassName("action-menu_menu-container_3a6da stage-selector_add-button_1sKuU")[0].style.visibility="hidden";//舞台
         if(document.getElementsByClassName("react-tabs_react-tabs__tab--selected_EW0CL")[0].innerText=="背景")
            document.getElementsByClassName("selector_new-buttons_2qHDd box_box_2jjDp")[0].style.visibility="hidden";//编辑区的控制入口
      }

      if(bNC==1)
      {
         document.getElementsByClassName("action-menu_menu-container_3a6da sprite-selector_add-button_1XCwG")[0].style.visibility="visible";//角色
         if(document.getElementsByClassName("react-tabs_react-tabs__tab--selected_EW0CL")[0].innerText=="造型")
            document.getElementsByClassName("selector_new-buttons_2qHDd box_box_2jjDp")[0].style.visibility="visible";//编辑区的控制入口
      }
      else
      {
         document.getElementsByClassName("action-menu_menu-container_3a6da sprite-selector_add-button_1XCwG")[0].style.visibility="hidden";//角色
         if(document.getElementsByClassName("react-tabs_react-tabs__tab--selected_EW0CL")[0].innerText=="造型")
            document.getElementsByClassName("selector_new-buttons_2qHDd box_box_2jjDp")[0].style.visibility="hidden";//编辑区的控制入口
      }
   }
}

/************************************************************
自动备份到服务器
************************************************************/
function asAutoSaveOnLine() {
   //if(bPlayMode==false)			//如果非播放模式，意味着学生有权修改，那么这个文件就是学生自己的，可以备份。
   oGUI.props.vm.saveonlineProject(true);
   //scratch.autosaveOnLine(); 
}

//分享角色给他人
//type:1 o.value->spritename
//type:2 o.value->membername
function shareSprite(){

   var o1=document.getElementById("spritestoshare");
   var strSprite=o1.options[o1.selectedIndex].value;

   var o2=document.getElementById("memberstoshare");
   var strMember=o2.options[o2.selectedIndex].value;

   if(strSprite=="" && strMember!="")//选了名字没选角色
   {
      //alert("请选择要分享的角色名。");
      o1.focus();return;
   }
   else if(strSprite!="" && strMember=="")//选了角色没选名字
   {
      //alert("请选择一个同学的名字。");
      o2.focus();return;
   }
   else if(strSprite=="" && strMember=="")//选了角色没选名字
   {
      //alert("请选择要分享的角色名和被分享的同学名。");
      o1.focus();return;
   }

   //if(arrSpritesSent[]
   arrSpritesSent[o1.options[o1.selectedIndex].text]=1;					//当前角色已被分享，下次本地更新时，需要重设ID
   bSelfShow=false;
   var strMsgSend="[\"SPRITEX\",\""+uname+"\",\""+ o1.options[o1.selectedIndex].text+"\",\""+strSprite+"\"]";
   var msg = { 'content': strMsgSend , 'type': 'user', 'to':strMember };
   sendMsg(msg);
}

function findKey(obj, value, compare =(a,b) => a===b){
   return Object.keys(obj).find( k => compare(obj[k],value))
}

//获取当前项目中的所有的角色
//并将角色的造型和脚本保存到文件
//每次修改都要执行备份，服务器压力比较大，需要调整。
function getSprites(ID){
   var arrExistedID=new Array();
   var arrSprites=document.getElementById(ID);

   if(ID=="spritestoshare")//顶部分享菜单中角色列表
   {
      if(arrSprites.length>1)
      {
         for(var i=1;i<arrSprites.length;i++)
         {
            arrExistedID[arrSprites[i].value]=arrSprites[i].text.replace(/ /,"");//过滤掉空格
         }
         arrSprites.length=0;
         arrSprites.add(new Option("请选择角色",""));
      }
      else if(arrSprites.length==0)
         arrSprites.add(new Option("请选择角色",""));
   }
   else//上课管理中角色列表
   {
      var arrExistedSprites=document.getElementById("spritestoshare");//从顶部菜单获取已经存在的角色的ID值
      if(arrExistedSprites.length>1)
      {
         for(var i=1;i<arrExistedSprites.length;i++)
         {
            arrExistedID[arrExistedSprites[i].value]=arrExistedSprites[i].text.replace(/ /,"");//过滤掉空格;
         }
         arrSprites.length=0;
         arrSprites.add(new Option("请选择要分享的角色",""));
      }
      else if(arrSprites.length>1)//如果获取失败，从上课管理页面获取
      {
         for(var i=1;i<arrSprites.length;i++)
         {
            arrExistedID[arrSprites[i].value]=arrSprites[i].text.replace(/ /,"");//过滤掉空格;
         }
         arrSprites.length=0;
         arrSprites.add(new Option("请选择要分享的角色",""));
      }
      else if(arrSprites.length==0){//都没数据
         arrSprites.add(new Option("请选择要分享的角色",""));
      }
   }
   var project_json=JSON.parse(oGUI.props.vm.toJSON());
   for( var i=1;i<oGUI.props.vm.runtime.targets.length;i++)//i=0为背景
   {
      var strSpriteName=oGUI.props.vm.runtime.targets[i].sprite.name.replace(/ /g,"");//过滤掉空格;

      var sp={//角色数据模板
         "name":strSpriteName,//(ID=="sprites")?strSpriteName:uname,//使用原本的角色名，这样，教师端同样的数据，不用生成两份类似的数据。 教师发送的角色用本来的名字，学生发送的用学生名
         "tags":[],
         "isStage":false,
         "variables":{},
         "costumes":[],
         "sounds":[],
         "blocks":{}
      };
      sp.blocks=project_json.targets[i].blocks;
      sp.variables=project_json.targets[i].variables;
      sp.costumes=oGUI.props.vm.runtime.targets[i].getCostumes();//这里比project_json.targets[i].costumes;多了造型的实际数据。这样，图片就不用通过saveSprite.php另存了。

      var strSpriteID=findKey(arrExistedID,strSpriteName);
      //再把角色的脚本保存到文件
      $.ajax({												//同步请求
         type:"POST",
         url:"saveScript.php?t=" + Math.random(),
         data: { "S":JSON.stringify(sp), "ID": ( arrSpritesSent[strSpriteName]==1?"":strSpriteID) },
         success: function (data) 
	 {
            arrSpritesSent[strSpriteName]=0;
            if(data.length==32) arrSprites.add(new Option(strSpriteName, data));
         },
         async:false
      });
   }
}

/*更新组员名单*/
function updateGroupMember(n)
{
   var o=document.getElementById("memberstoshare");		//菜单初始化
   if(o.length==0) 
   {
      o.add(new Option("请选择组员",""));
   }
   else
   {
      o.length=0;
      o.add(new Option("请选择组员",""));
   }

   $.ajax({												//同步请求
      type:"POST",
      url:"getMember.php?t=" + Math.random(),
      data: { "N":uname },			  //当前用户名
      success: function (data) 
               {
                  if(data)//有返回数据
                  {
                     var members=JSON.parse(data);//当前用户所在组

                     var o=document.getElementById("memberstoshare");		//菜单初始化
                     if(o.length) o.length=0;
                     o.add(new Option("请选择组员",""));

                     var userlists=new Array();					//已登录人员名单
                     var user_list = document.getElementById("user_list");
                     for(var i=0;i<user_list.childElementCount;i++)
                     {
                        userlists.push(user_list.children[i].textContent);
                     }

                     for(var i=0;i<members.length;i++)				//过滤
                     {
                        if(members[i]!=null && members[i].indexOf(uname)==-1 && userlists.indexOf(members[i])!=-1)//先排除当前用户，再确认同组成员是否已登录。
                        {
                           o.add(new Option(members[i],members[i]));
                        }
                     }
                  }
               },
      async:false
   });
}
/************************************************************
保存到服务器
************************************************************/
function saveOnline() {
    oGUI.props.vm.saveonlineProject(false);
    //scratch.saveOnLine();
    //document.getElementById("hidden").style.visibility="visible";

}

/************************************************************
新建项目
************************************************************/
function createNew() {
    //由于每步操作都会触发自动备份，所以新建项目不会丢失数据。
    var strNewFilename = filename;
    if (strNewFilename == "") {
        alert("文件名不能为空。");
        return;
    }
    else if (strNewFilename.indexOf("ALL_") > -1 || strNewFilename.indexOf("\\") > -1 || strNewFilename.indexOf("/") > -1 || strNewFilename.indexOf(":") > -1 || strNewFilename.indexOf("*") > -1 || strNewFilename.indexOf("?") > -1 || strNewFilename.indexOf("\"") > -1 || strNewFilename.indexOf("<") > -1 || strNewFilename.indexOf(">") > -1 || strNewFilename.indexOf("|") > -1) {
        alert("文件名不合法。");
        return;
    }
    var o = document.getElementById("newp");
    o.value = strNewFilename;

    $.post("setPrjname.php?t=" + Math.random(), { "prjname": strNewFilename }, function (data) {	//通过COOKIE方式传递新建项目的名字。
        //data= eval(data);
        //alert(data);
    });

    bFirstTimeSaving = true;

    //filename = strNewFilename;
    bLoaded = false;
    //自定义空项目（没有角色，没有声音，只有一个空白背景。）
    oGUI.props.vm.loadProject({"targets":[{"isStage":true,"name":"Stage","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"assetId":"cd21514d0531fdffb22204e0ec5ed84a","name":"背景1","md5ext":"cd21514d0531fdffb22204e0ec5ed84a.svg","dataFormat":"svg","rotationCenterX":240,"rotationCenterY":180}],"sounds":[],"volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"on","textToSpeechLanguage":null}],"monitors":[],"extensions":[],"meta":{"semver":"3.0.0","vm":"0.2.0-prerelease.20210120142104","agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36"}});
    //系统默认空项目（有一个角色猫，一个声音和一个空白背景。）
    //oGUI.loadProject({"targets":[{"isStage":true,"name":"Stage","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"assetId":"cd21514d0531fdffb22204e0ec5ed84a","name":"背景1","md5ext":"cd21514d0531fdffb22204e0ec5ed84a.svg","dataFormat":"svg","rotationCenterX":240,"rotationCenterY":180}],"sounds":[],"volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"on","textToSpeechLanguage":null}],"monitors":[],"extensions":[],"meta":{"semver":"3.0.0","vm":"0.2.0-prerelease.20210120142104","agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36"}});

    //scratch.createNewProject();
    bPlayMode = false;
    setMode();
    //document.getElementById('ul').style.visibility="visible";
    document.getElementById("cancel").style.visibility = "hidden";
    document.getElementById("redo").style.visibility = "hidden";
    document.getElementById("cancelleft").innerHTML = '';
    document.getElementById("redoleft").innerHTML = '';
}

function createNew2() {
    //由于每步操作都会触发自动备份，所以新建项目不会丢失数据。
    var strNewFilename = '';
    if ((strNewFilename = prompt("请输入要创建的项目的名称。\r\n注意：\r\n  1.不要与你自己现有的项目名称相同；\r\n  2.文件名中不能包含如下字符串关键词或英文符号：\r\nALL_ _EDITABLE_ \\ / : * ? \" < > |", '')) != null) {
        if (strNewFilename == "") {
            alert("文件名不能为空。");
            return;
        }
        else if (strNewFilename.indexOf("ALL_") > -1 || strNewFilename.indexOf("_EDITABLE_") > -1 || strNewFilename.indexOf("\\") > -1 || strNewFilename.indexOf("/") > -1 || strNewFilename.indexOf(":") > -1 || strNewFilename.indexOf("*") > -1 || strNewFilename.indexOf("?") > -1 || strNewFilename.indexOf("\"") > -1 || strNewFilename.indexOf("<") > -1 || strNewFilename.indexOf(">") > -1 || strNewFilename.indexOf("|") > -1) {
            alert("文件名不合法。");
            return;
        }
        var o = document.getElementById("newp");
        o.value = strNewFilename;

        $.post("setPrjname.php?t=" + Math.random(), { "prjname": strNewFilename }, function (data) {	//通过COOKIE方式传递新建项目的名字。
            //data= eval(data);
            //alert(data);
            //loadMSG(classid);
            loadBKFilelist(classid, folder);
            //输入项目名后，要更新一次历史数据。
        });

        bFirstTimeSaving = true;

        filename = strNewFilename;
        bLoaded = false;
        oGUI.loadProject("0");
        //scratch.createNewProject();
        bPlayMode = false;
        setMode();
        //document.getElementById('ul').style.visibility="visible";
        document.getElementById("cancel").style.visibility = "hidden";
        document.getElementById("redo").style.visibility = "hidden";
        document.getElementById("cancelleft").innerHTML = '';
        document.getElementById("redoleft").innerHTML = '';

    }
    else alert("您没有输入游戏名称，将无法新建游戏。");
}


function findNPos(str, ch, num) {
    var x = str.indexOf(ch);
    for (var i = 0; i < num; i++) {
        x = str.indexOf(ch, x + 1);
    }
    return x;
}

/************************************************************
打开已交作业
id为select中的option，数据为文件名路径
************************************************************/
function loadOldProjectFile(id) {
    filename = id.value;
    strSelectedFilename=filename;

    if (bGroup==true || filename.indexOf(strCurrentUser) > -1 || filename.indexOf("_EDITABLE_") > -1) 	//可编辑文件
    {//用户名匹配，编辑模式
        //      bPlayMode=false;
        //      setMode();
        bCodeViewableFile = true;
        //document.getElementById('ul').style.visibility="visible";
        if (document.getElementById("mode")) {
            document.getElementById("mode").value = "编辑模式";
        }
    }
    else											//不可编辑文件
    {//用户名不匹配，播放模式
        bCodeViewableFile = false;
        //      bViewSourceAllowed=false;
        //      bPlayMode=true;
        //      setMode();
        //document.getElementById('ul').style.visibility="hidden";
        if (document.getElementById("mode")) {
            document.getElementById("mode").value = "播放模式";
        }
    }


    //if(strCurrentUser==strTeacher)
    //{
    //bPlayMode=false;
    ////document.getElementById('ul').style.visibility="visible";
    //}
    document.getElementById('waiting').style.visibility = "visible";
    if (filename) {
        bLoaded = false;
        //bPlayMode=false;
        $.get("view.php?SB2=" + filename + "&C=" + classid + "&D=" + folder + "&t=" + Math.random(), function (data)//获取文件URL
        {
            oGUI.props.vm.downloadProjectId(data);//通过URL打开文件
            updateScreenMode();


            var strOldProjectName = filename.substr(findNPos(filename, '_', 1) + 1);
            strOldProjectName = strOldProjectName.substr(0, strOldProjectName.lastIndexOf('.'));

            if (strOldProjectName != '') {
                document.getElementById("newp").value = strOldProjectName;
                filename = strOldProjectName;
                $.post("setPrjname.php?t=" + Math.random(), { "prjname": strOldProjectName });//, function(data){	//通过COOKIE方式传递新建项目的名字。
            }

            var IMGFILE = folder + '' + filename;						//用于生成快照
            $.post("setPrjname.php?t=" + Math.random(), { "fname": encodeURI(IMGFILE) },function(data)
            {
               loadMSG(classid);
               loadBKFilelist(classid, folder);
             });	//选择文件后，更新ProjectName（一人可创建多个项目。）
        });
    }
    //var o=document.getElementById("infotext");
    //o.innerHTML="等待刷新中。。。";
    document.getElementById("snap").innerHTML = "";//清理榜单。
    document.getElementById("snap").style.display = "none";
    if (lastViewed)//给查看过的项目加上颜色标记。
    {
        lastViewed.setAttribute("class", "viewed");
        lastViewed = '';//上次查看过的项目
    }
}


/************************************************************
打开备份文件
id为select中的option，数据为文件名路径
************************************************************/
function loadBackupProjectFile(bkfilename) {
    if (bkfilename) {
        $.get("viewb.php?SB2=" + bkfilename + "&C=" + classid + "&D=" + folder + "&t=" + Math.random(), function (data) {
            bCodeViewableFile = true;	//可编辑文件
            bLoaded = false;
            oGUI.props.vm.downloadProjectId(data);						//通过URL打开文件
            //updateScreenMode();
        });
    }
}


/************************************************************
更新屏幕模式
   oVIEW.props.setFullScreen(true)是播放模式，看不到脚本源码
   oVIEW.props.setFullScreen(false)是编辑模式，可编辑脚本源码
************************************************************/
function updateScreenMode() {
    if (document.getElementById("ViewMode").checked == true) {

    }
    else {
        if (bCodeViewableFile == true)			//当前为可查看源码的文件
        {
            if (bFullScreenStatus == true)		//当前为全屏播放模式
            {
                oVIEW.props.setFullScreen(false);	//切换到编辑模式
                //document.getElementById('ul').style.visibility="visible";
            }
        }
        else						//当前为不可查看源码的文件
        {
            if (bFullScreenStatus == false)		//当前为编辑模式
            {
                oVIEW.props.setFullScreen(true);	//切换到全屏播放模式
            }
        }
    }
}


/************************************************************
FullScreen按钮回调
   oVIEW.props.setFullScreen(isFullScreen)回调，用于防止不允许查看源码的文件被曝光
   2.0版本通过添加控制代码来强制禁止模式切换
   3.0版本则尽量不动原项目。

//scratch:///./~/scratch-gui/dist/scratch-gui.js?:Line 32549
var setFullScreen = function setFullScreen(isFullScreen) {
  bFullScreenStatus=!bFullScreenStatus;       	//新加代码
  checkScreenStatus();				//新加代码
  return {
    type: SET_FULL_SCREEN,
    isFullScreen: isFullScreen
  };
};

************************************************************/
function checkScreenStatus() {
    if (bCodeViewableFile == false && bFullScreenStatus == false) {
        bCodeViewableFile = true;
        if (admin == 0) {
            if (nBKFileTotal > 0) {
                cancelit();					//返回原来正在编辑的项目
            }
            else oGUI.loadProject("0");			//打开默认项目，用于覆盖掉禁止查看源码的项目
        }
    }
}


function setMode() {
    return;
    if (bPlayMode == true) {
        oVIEW.props.setFullScreen(true);
        //document.getElementById('ul').style.visibility="hidden";
    }
    else {
        oVIEW.props.setFullScreen(false);
        //document.getElementById('ul').style.visibility="visible";
    }
}


/************************************************************
保存操作已完成
************************************************************/
function saveStatus(str) {
    if(admin==-1) return;//播放页面，自动屏蔽。
    var s = document.getElementById("autosavestatus");
    if (str == "LOGINERROR") {
       alert("登录超时，本次自动保存失败，请刷新页面重新登录。");
           s.innerHTML = "<br><font size=2 color=red>登录超时，请<a href=../ target=_blank>重新登录</a>。</font>";
    }
    else if (str == "ADMINERROR") {
       alert("在执行保存前，请先选择班级。");
       s.innerHTML = "<br><font size=2 color=red>在执行保存前，请先选择班级。</font>";
    }
    else {
        //alert(str);
        if (str.indexOf("保存已完成") == 0)	//保存操作，需要刷新文件夹
        {
            var msg = { 'content': "<font color=green>已保存作业</font>", 'type': 'user' };
            sendMsg(msg);				//websocket功能调用。
            if (bFirstTimeSaving == true)
                loadFolder(classid);
            bFirstTimeSaving = false;
        }
        s.innerHTML = "<br><font size=2 color=green>" + str + "</font>";
        loadBKFilelist(classid, folder);
        hideShare();
        //getSprites("spritestoshare");
    }
}

/************************************************************
自动保存已完成
************************************************************/

function autosaveStatus(str) {
    if(admin==-1) return;//播放页面，自动屏蔽。
    var s = document.getElementById("autosavestatus");
    if (str == "LOGINERROR") {
        alert("登录超时，本次自动保存失败，请刷新页面重新登录。");
        s.innerHTML = "<br><font size=2 color=red>登录超时，请<a href=../ target=_blank>重新登录</a>。</font>";
    }
    else if (str == "ADMINERROR") {
        alert("在执行保存前，请先选择班级。");
        s.innerHTML = "<br><font size=2 color=red>在执行保存前，请先选择班级。</font>";
    }
    else if (str.indexOf("SNAP|") === 0) {
        //alert("快照已生成："+str.substring(5));
        $.post("release.php?t=" + Math.random(), { "cid": classid, "f": folder, "fn": strSelectedFilename }, function (data) {//提送榜单
            alert(data);
            getTopList();
        });
        //var snap=document.getElementById("snap");
        //snap.innerHTML="<img width=370 src=./"+ str.substring(5) +"?t="+Math.random()+"  onclick=\"refreshScreenshot('"+tfid+"')\">";
        //snap.style.display="block";
    }
    else if (str.indexOf("REFSNAP|") === 0) {
        //alert("快照已更新："+str.substring(8));
        var snapimg = document.getElementById("snapimg");
        snapimg.src = "./" + str.substring(8) + "?t=" + Math.random();		//更新榜单中图片
    }
    else {
        s.innerHTML = "<br><font size=2 color=green>" + str + "</font>";
        loadBKFilelist(classid, folder);
    }
}

/************************************************************
加载文件夹
***********************************************************/
function loadFolder(class_id) {
    if (class_id == "") {
        var c = document.getElementById("c"); c.focus();//alert("请先选择班级。");
    }
    else {
        classid = class_id;
        setCookie(class_id);
        document.getElementById("f").length = 0;

        //document.getElementById("toplist").innerHTML="";//清理榜单。
        //document.getElementById("snap").innerHTML="";//清理榜单。
        //document.getElementById("snap").style.display="none";

        document.getElementById("cancel").style.visibility = "hidden";
        document.getElementById("redo").style.visibility = "hidden";

        document.getElementById("cancelleft").innerHTML = '';
        document.getElementById("redoleft").innerHTML = '';

        nBKFileTotal = 0;//清空数据
        nBKFileIndex = 0;
        arrBKFiles = null;

        lastViewed = '';//上次查看过的项目

        var o = document.getElementById("d");
        o.length = 0;

        var m = document.getElementById("moremsg");		//社区聊天记录显示
        m.innerHTML = "↓社区↓";

        $.post("getFolders.php?t=" + Math.random(), { "C": classid }, function (data) {

            data = eval(data);
            if (data.length > 0) {
                o.add(new Option("请选择一个日期", ""));
                for (var i = 0; i < data.length; i++) {
                    o.add(new Option(data[i], data[i]));
                }
                o.selectedIndex = 1;
                folder = o.value;
                loadFilelist(classid, folder);
            }
            else {
                o.selectedIndex = 0;
                folder = '';
            }
        });
    }
}

/************************************************************
加载备份文件列表
************************************************************/
function loadBKFilelist(classid, date) {
    folder = date;
    $.post("getBackup.php?t=" + Math.random(), { "C": classid, "D": folder }, function (data) {
        data = eval(data);

        document.getElementById("recovery").style.visibility = "hidden";//恢复

        if (data.length > 0) {
            var c = document.getElementById("cancel");//撤销按钮
            c.style.visibility = "visible";//显示
            var r = document.getElementById("redo");
            r.style.visibility = "hidden";

            nBKFileTotal = data.length;//备份文件总数
            nBKFileIndex = data.length;//当前备份文件索引值，从最后一个备份开始恢复。
            arrBKFiles = data;//备份文件信息

            document.getElementById("cancelleft").innerHTML = data.length;
            document.getElementById("redoleft").innerHTML = '';
        }
        else {
            var c = document.getElementById("cancel");//撤销和重做按钮全部消失
            c.style.visibility = "hidden";
            var r = document.getElementById("redo");
            r.style.visibility = "hidden";

            nBKFileTotal = 0;//清空数据
            nBKFileIndex = 0;
            arrBKFiles = null;
            document.getElementById("cancelleft").innerHTML = '';
            document.getElementById("redoleft").innerHTML = '';
        }
    });
}

function cancelit() {
    if (nBKFileIndex > 0) {
        document.getElementById('waiting').style.visibility = "visible";
        nBKFileIndex--;
        ////scratch.autoLoadProject(arrBKFiles[nBKFileIndex],"1","0");
        loadBackupProjectFile(arrBKFiles[nBKFileIndex]);
        bLoaded = false;

        document.getElementById("cancelleft").innerHTML = nBKFileIndex;
        if ((arrBKFiles.length - nBKFileIndex) - 1 > 0)
            document.getElementById("redoleft").innerHTML = (arrBKFiles.length - nBKFileIndex) - 1;
        else
            document.getElementById("redoleft").innerHTML = '';

        if (nBKFileIndex == arrBKFiles.length - 2) {
            document.getElementById("redo").style.visibility = "visible";
            document.getElementById("recovery").style.visibility = "visible";//恢复
        }
        else if (nBKFileIndex == 0) {
            document.getElementById("cancel").style.visibility = "hidden";
            document.getElementById("cancelleft").innerHTML = '';
        }

        document.getElementById("snap").innerHTML = "";//清理榜单。
        document.getElementById("snap").style.display = "none";
        if (lastViewed)//给查看过的项目加上颜色标记。
        {
            lastViewed.setAttribute("class", "viewed");
            lastViewed = '';//上次查看过的项目
        }
    }
    else alert("没有了。");
}

function redoit() {
    if (nBKFileIndex < nBKFileTotal - 1) {
        document.getElementById('waiting').style.visibility = "visible";

        nBKFileIndex++;
        ////scratch.autoLoadProject(arrBKFiles[nBKFileIndex],"1","0");
        loadBackupProjectFile(arrBKFiles[nBKFileIndex]);
        bLoaded = false;

        document.getElementById("cancelleft").innerHTML = nBKFileIndex;
        document.getElementById("redoleft").innerHTML = (arrBKFiles.length - nBKFileIndex) - 1;

        if (nBKFileIndex == nBKFileTotal - 1) {
            var r = document.getElementById("redo");
            r.style.visibility = "hidden";
            document.getElementById("redoleft").innerHTML = '';

            if (lastViewed)//给查看过的项目加上颜色标记。
            {
                lastViewed.setAttribute("class", "viewed");
                lastViewed = '';//上次查看过的项目
            }
        }
        else if (nBKFileIndex > 0) {
            document.getElementById("cancel").style.visibility = "visible";
            document.getElementById("recovery").style.visibility = "visible";//恢复
        }
    }
}



/************************************************************
加载文件夹列表
************************************************************/
function loadFilelist(classid, date) {
    if (classid == "") {
        var c = document.getElementById("c"); c.focus(); alert("请先选择班级。");
    }
    else if (date == "") {
        var c = document.getElementById("d"); c.focus(); alert("请先选择日期。");
    }
    else {
        var o = document.getElementById("f");
        o.length = 0;
        folder = date;

        var m = document.getElementById("moremsg");		//社区聊天记录显示
        m.innerHTML = "↓社区↓";

        $.post("getFiles.php?t=" + Math.random(), { "C": classid, "D": folder }, function (data) {
            data = eval(data);
            if (data.length > 0) {
                o.add(new Option("请选择一个文件", ""));
                for (var i = 0; i < data.length; i++) {
                    if (data[i] != "") {
                        var filename = data[i].split("/");
                        o.add(new Option(filename[filename.length - 1], data[i]));
                    }
                }
            }
        });

        loadBKFilelist(classid, date);//加载可能存在的备份文件
    }
}

String.prototype.trim = function (char, type) {
    if (char) {
        if (type == 'left') {
            return this.replace(new RegExp('^\\' + char + '+', 'g'), '');
        } else if (type == 'right') {
            return this.replace(new RegExp('\\' + char + '+$', 'g'), '');
        }
        return this.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
    }
    return this.replace(/^\s+|\s+$/g, '');
};


/*
获取佳作列表
*/
function getTopList() {
    if (classid == "") {
        //      showmenu(2);
        var files = document.getElementById("files");
        var tops = document.getElementById("lab");
        if (fileshow == false) showfiles();
        files.style.top = tops.style.top;
        files.style.left = (parseInt(tops.style.left) - parseInt(files.style.width) - 1);

        try{
           var c = document.getElementById("c"); c.focus(); alert("请先选择班级。");
        }catch(err){
        }
    }
    else {
        document.getElementById("toplist").innerHTML = "";

        $.get("getToplist.php?CID=" + classid + "&t=" + Math.random(), function (data) {
            var tops = eval(data);
            if (tops.length > 0) {
                if (tops[0].length > 0) {
                    var strDate = "";
                    for (i = 0; i < tops.length; i++) {
                        var strDate_t = tops[i][0].substring(0, 10);
                        if (strDate != strDate_t) {
                            strDate = strDate_t;//alert(strDate);
                            var x2 = document.createElement("DIV");
                            x2.innerHTML = "<div style=\"width: 80px;margin: 4 4 4 4;font-size: 12px;color: red;\">" + strDate + "</div>";
                            document.getElementById("toplist").appendChild(x2);
                        }
                        var x2 = document.createElement("DIV");
                        x2.innerHTML = "<div style=\"width:80px;height:56px; margin: 4 4 4 4;font-size: 4px;\"><input title=\"要撤销请点我\" alt=\"要撤销请点我\" style=\"position: relative;height:54px;width: 2px;background-color: #4CAF50;border: none;\" type=\"button\" onclick=\"deltop('" + tops[i][1] + "','" + tops[i][0] + "');\"><img title=\"作品所有者点击图片可执行刷新截图操作\" alt=\"作品所有者点击图片可执行刷新截图操作\"  style=\"position: relative;top: -54px;left: 8px;\" width=90% src=\"../top/" + classid + "/" + tops[i][1] + ".PNG?t=" + Math.random() + "\" alt=\"" + tops[i][0] + "\" title=\"" + tops[i][0] + "\" onclick=\"showTop(this,'" + tops[i][1] + "','" + tops[i][0] + "')\"></div>";
                        document.getElementById("toplist").appendChild(x2);
                    }
                }
            }
            //else {
            //    var x = new Option("等你来上榜！", "");
            //    o.add(x);
            //}
        });
    }
}

function deltop(tfid, fn) {
    if (confirm("警告：\r\n        该操作不可撤销。\r\n        您确定要撤销当前的上榜信息么？") == 1) {
        if (tfid) {
            $.post("delTop.php?t=" + Math.random(), { "cid": classid, "fid": tfid, "fn": fn }, function (data) {
                if (data.indexOf("DEL|") === 0) {
                    alert("上榜信息已撤销。");
                }else alert(data);
                getTopList();
            });
        }
    }
}


function showTop(thisobj, tfid, info) {
    if (tfid) {
        bPlayMode = true;
        setMode();
        bViewSourceAllowed = false;

        if (lastViewed)//给查看过的项目加上颜色标记。
            lastViewed.setAttribute("class", "viewed");
        thisobj.parentNode.setAttribute("class", "clicked");
        lastViewed = thisobj.parentNode;

        var snap = document.getElementById("snap");
        snap.innerHTML = "<img id=snapimg name=snapimg  width=368 src=\"../top/" + classid + "/" + tfid + ".PNG?t=" + Math.random() + "\" onclick=\"refreshScreenshot('" + tfid + "','" + info + "')\">" + info.substr(0, info.length - 4);
        snap.style.display = "block";

        bCodeViewableFile = false;	//不可编辑文件
        oGUI.props.vm.downloadProjectId("../../top/" + classid + "/" + tfid + "." + info.substr(-3) + "?t=" + Math.random());
        updateScreenMode();
        bLoaded = false;
    }
    else alert("暂无人上榜！就等你了！");
}

/************************************************************
加载互动信息
************************************************************/
function loadMSG(classid) {
    var f = document.getElementById("f");
    if (f.value == "") alert("请先选择文件。");
    else {
        var o = document.getElementById("msgs");

        var o2 = document.getElementById("infotext");
        //o.innerHTML="等待刷新中。。。";

        var fn = strSelectedFilename;//filename.split("/");

        $.post("getMsg.php?t=" + Math.random(), { "C": classid, "D": folder, "F": fn }, function (data) {
            var strs = eval("{" + data + "}");
            o.length = 0;
            o2.innerHTML = "";

            if (strs.length > 0) {
                var m = document.getElementById("moremsg");		//社区聊天记录显示
                m.innerHTML = "↓社区↓";
                if (strs[0].length > 0) {
                    m.innerHTML = "↓社区↓<font color=\"red\">*</font>";

                    for (i = 0; i < strs.length; i++) {
                        if (strs[i].length > 0) o.add(new Option(strs[i], strs[i]));
                    }
                }
            }
        });
    }
}

/************************************************************
发送互动信息
************************************************************/
function postMsg(classid) {
    var o1 = document.getElementById("f");
    var o2 = document.getElementById("msg");
    if (o1.value == "" || o2.value == "") {
        alert("请选择文件后输入要提交的信息。");

        var files = document.getElementById("files");
        var talks = document.getElementById("talk");
        if (fileshow == false) showfiles();
        files.style.top = talks.style.top;
        files.style.left = (parseInt(talks.style.left) - parseInt(files.style.width) - 1);
    }
    else {
        var fn = strSelectedFilename;//.split("/");
//        $.post("saveMsg.php?t=" + Math.random(), { "C": classid, "D": folder, "F": fn[fn.length - 1], "MSG": o2.value }, function (data) {
        $.post("saveMsg.php?t=" + Math.random(), { "C": classid, "D": folder, "F": fn, "MSG": o2.value }, function (data) {
            loadMSG(classid);
        });
        o2.value = "";
    }
}

/************************************************************
模式切换
/************************************************************/
function setEditMode() {
    var o = document.getElementById("mode").value;
    if (o == "编辑模式") {
        document.getElementById("mode").value = "播放模式";
        //var swfdlg=document.getElementById("swf");
        //swfdlg.style.width="40%";
        //swfdlg.style.left="300px";

        bPlayMode = true;
        setMode();
    }
    else {
        document.getElementById("mode").value = "编辑模式";
        //var swfdlg=document.getElementById("swf");
        //swfdlg.style.width="100%";
        //swfdlg.style.left="0px";
        bPlayMode = false;
        setMode();
    }
}

/************************************************************
优秀作品，全站推送
************************************************************/
function Release() {
    if (strSelectedFilename.indexOf(".SB") > 0) {
        if (classid != "" && folder != "" && filename != "") {
            getScreenshot();//创建快照成功后，在创建回调中执行发布。
        }
    }
    else {
        alert("请先选择要生成快照的文件。");
    }
}

/*******************************
创建舞台快照
*******************************/
function getScreenshot() {
    if (confirm("请注意：\r\n        如作品中存在不健康的语言、文字或图像，将给予本学期不及格的处理。\r\n        点击“取消”按钮，可再去核对一下。") == 1) {

        if (strSelectedFilename.indexOf(".SB") > 0) {
            if (strSelectedFilename.indexOf(strCurrentUser) > -1 || strCurrentUser == strTeacher)//学生只能生成自己作品的快照，教师能生成所有人的作品的快照
            {
                if (classid) {
                    setCookie(classid);

                    $.post("setPrjname.php?t=" + Math.random(), { "fname": encodeURI(folder+ '' +strSelectedFilename) });

                    oGUI.props.vm.renderer.requestSnapshot();
                }
                else {
                    var c = document.getElementById("c"); c.focus(); alert("请先选择班级。");
                }
            }
            else {
                alert("您只能对自己的作品执行本操作。");
            }
        }
        else {
            alert("请先选择要生成快照的文件。");
        }
    }
}

function refreshScreenshot(tfid, info) {
    if (tfid.length == 32) {
        if (strCurrentUser == strTeacher || info.indexOf(strCurrentUser) > 0)//学生只能生成自己作品的快照，教师能生成所有人的作品的快照
        {
            if (classid) {
                setCookie(classid);
                $.post("setPrjname.php?t=" + Math.random(), { "REFNAME": encodeURI(tfid) });

                ////scratch.getScreenshot();
                oGUI.props.vm.renderer.requestSnapshot();
            }
        }
        else {
            alert("您只能对自己的作品执行本操作。");
        }
    }
}

/************************************************************
设置页面cookie
************************************************************/
function setCookie(value) {
    $.post("setPrjname.php?t=" + Math.random(), { "cid": encodeURI(value) });
}

function setJSCookie(cname, cvalue, exhours) {
    var d = new Date();
    d.setTime(d.getTime() + (exhours*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires ;
}

const chunks = new Set();
let videoUrl = null;
let mediaRecord = null;

//开始录制
function startRecording(){
   const mediaStream = document.querySelector('canvas').captureStream(48); 	// 获取画布canvasElement并设置帧频率(FPS)
   mediaRecorder = new MediaRecorder(mediaStream, {				// 核心API，可以录制canvas, audio, video代码下方提供文档链接
      audioBitsPerSecond : 128000,
      videoBitsPerSecond : 8500000, 
      mimeType : 'video/webm;codecs=h264'
   })
   mediaRecorder.ondataavailable = (e) => { // 接收数据
     chunks.add(e.data)
   }
   mediaRecorder.start(40)  // 开始录屏,参数为抓取间隔40毫秒
}


//停止录制，并下载录制后的视频
function stopRecording(){      // 录制结束时调用该方法停止录制，并生成下载链接，下载
   mediaRecorder.stop();       // 结束录屏
   const videoBlob = new Blob(chunks, { 'type': 'video/mp4' })   // 创建视频文件
   videoUrl = window.URL.createObjectURL(videoBlob)    		 // 创建对象链接
   var a = document.createElement('a');
   a.href = videoUrl;
   a.download = 'Scratch3.0_Movie.mp4';
   a.style.display = 'none';
   document.body.appendChild(a);
   a.click();
}

//插入录制按钮
function showRecord()
{
   var o=document.getElementsByClassName("controls_controls-container_2xinB");
   if(o[0].children.length==2)//判断录制按钮是否已经添加
   {
      var img=document.createElement("img"); 
      //img.id="RECORD";
      img.src="./img/rec.png";
      img.alt="点击开始录制舞台视频";
      img.title="点击开始录制舞台视频";
      img.style.position="relative";
      img.style.padding="2px";
      img.style.height="32px";
      img.style.width="32px";
      img.className="green-flag_green-flag_1kiAo";
      img.onclick=function()
      {
         if(img.src.indexOf("rec.png")>0)//录制时播放gif动图
         {
            img.src="./img/rec.gif";
            img.alt="点击结束录制舞台视频，并下载文件";
            img.title="点击结束录制舞台视频，并下载文件";
            startRecording();
         }
         else				//结束录制后显示静态png
         {
            img.src="./img/rec.png";
            img.alt="点击开始录制舞台视频";
            img.title="点击开始录制舞台视频";
            stopRecording();
         }
      };
      o[0].appendChild(img);
   }
}

