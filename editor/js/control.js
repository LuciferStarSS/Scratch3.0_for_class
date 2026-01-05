/***********************************************************
项目加载后，每次积木的变化，都会触发备份操作；
保存操作将会清除备份。或者，让学生选择是否要清除备份。
************************************************************/
var bSaving = false;			//当前是否在执行保存操作
var scratch = null;			//Scratch主窗口
var bLoaded = false;			//检测是否已经加载项目文件
var bPlayMode = true;			//Scratch模式：  true:播放模式	false:编辑模式
var bFirstTimeSaving = true;		//新建后第一次保存，需要刷新文件夹。
//var bReady=true;			//界面已经打开完毕。
					//菜单已经调整，不需要判断了。

var bCode=false;

var nBKFileIndex = 0;
var nBKFileTotal = 0;
var arrBKFiles = Array();

var bViewSourceAllowed = true;
var bFullScreenStatus = false;		//true:全屏播放模式 false:编辑模式
var bCodeViewableFile = true;		//true:允许查看源码的文件 false:只能播放的文件

var strSelectedFilename = '';
var strCurrentFilename='';
var strSelectedFilenameBackup='';
var bInvited=false;
var strInvited="";
var lastViewed = '';//最后一次查看的佳作


var nStar=0;
var nFileType=0;			//0:打开已交作品
					//1:打开榜单作品
var  path='';


//社区显示留言信息
//待整理
function showthisinfo(o) {
    var currentstep = document.getElementById("infotext");
    currentstep.innerHTML = "<textarea readonly style='margin: 0px; width: 240px; height: 125px;'>" + o.options[o.selectedIndex].value + "</textarea>";
}

function showthislabinfo(o) {
    var currentstep = document.getElementById("labinfotext");
    currentstep.innerHTML = "<textarea readonly style='margin: 0px; width: 240px; height: 125px;'>" + o.options[o.selectedIndex].value + "</textarea>";
}


//动态更新互帮互助和同组分享菜单
function updateMenu()
{
   document.getElementById("help").style.left=document.getElementById("helpmenu").offsetLeft+"px";//(document.getElementById("helpmenu").offsetLeft+document.getElementById("topmenu").offsetLeft)+"px";
   document.getElementById("share").style.left=document.getElementById("sharemenu").offsetLeft+"px";//(document.getElementById("sharemenu").offsetLeft+document.getElementById("topmenu").offsetLeft)+"px";//偏移
}


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
  hideHelp();
  hideShare();
  //if(bReady==true)					//菜单显示策略已调整，不需要再判断了。
  //{
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
        }
    }
    else if (nBar == 3)//社区
    {
        if (talkshow == true) {
            showtalks();
        }
        else {
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
            labshow = false;
            showlabs();
        }
    }
  //}
  //else alert("页面尚未加载完毕，请稍等。");
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
    var o = document.getElementById("WHITEBOARD");
    var m = document.getElementById("moretask");
    if (taskshow == false) {
        if(o!=undefined)
        {
           o.style.display = "block";
           o.style.top="357px";
           o.style.left="644px";
        }
        var d=document.getElementsByClassName("div-inline");
        for(var i=0;i<d.length;i++)
        {
           if(getCookie(d[i].id) =="true")
              d[i].style.visibility="visible";
        }
    }
    else {
        //m.innerHTML = "小白板↓";
        if(m.parentElement!=undefined)
           m.parentElement.style.backgroundColor="hsla(215, 100%, 65%, 1)";
        if(o!=undefined)
        {
           o.style.display = "none";
        }
    }
    m.innerHTML = "小白板";
    taskshow = !taskshow;
}

//显示或关闭文件窗口
function showfiles() {
    var f = document.getElementById("files");
    var m = document.getElementById("morefiles");
    if(m==undefined) insertMenu();
    m = document.getElementById("morefiles");
    if(m==undefined) return;
    if (fileshow == false) {
        //m.innerHTML = "文件↑";
        m.parentElement.style.backgroundColor="#E58308";
        f.style.display = "block";
        f.style.top = "49px";
        f.style.left = document.getElementById("filemenu").offsetLeft+"px";//(document.getElementById("filemenu").offsetLeft+document.getElementById("topmenu").offsetLeft)+"px";
        if (classid != '') {
            var s = document.getElementById('c');
            if (s != null) {
                for (var i = 0; i < c.length; i++) {
                    if (s[i].value == classid) s.selectedIndex = i;
                }
            }
            loadFolder(classid);
        }

        if (talkshow == true)//如果社区窗口已打开，则社区窗口停靠在文件窗口右侧
        {
            var t = document.getElementById("talk");
            t.style.top = f.style.top;
            t.style.left = (parseInt(f.style.left) + parseInt(f.style.width) )+"px";
            if (labshow == true)//如果佳作欣赏窗口已打开，则佳作欣赏窗口停靠在社区窗口右侧
            {
                var l = document.getElementById("lab");
                l.style.top = f.style.top;
                l.style.left = (parseInt(t.style.left) + parseInt(t.style.width) )+"px";
            }
        }
        else if (labshow == true)//如果此时佳作欣赏窗口已打开，则停靠在文件窗口右侧
        {
            var l = document.getElementById("lab");
            l.style.top = f.style.top;
            l.style.left = (parseInt(f.style.left) + parseInt(f.style.width) )+"px";
        }
    }
    else {
        //m.innerHTML = "文件↓";
        m.parentElement.style.backgroundColor="hsla(215, 100%, 65%, 1)";
        f.style.display = "none";

        if (talkshow == true)//如果社区窗口已打开，则社区窗口停靠在自己菜单下方
        {
            var t = document.getElementById("talk");
            t.style.top = "49px";
            t.style.left = document.getElementById("talkmenu").offsetLeft+"px";//(document.getElementById("talkmenu").offsetLeft+document.getElementById("topmenu").offsetLeft)+"px";

            if (labshow == true)//如果此时佳作欣赏窗口已打开，则停靠在社区窗口右侧
            {
                var l = document.getElementById("lab");
                l.style.top = t.style.top;
                l.style.left = (parseInt(t.style.left) + parseInt(t.style.width) + 1)+"px";
            }
        }
        else if (labshow == true)//如果此时佳作欣赏窗口已打开，则停靠在自己菜单下方。
        {
            var l = document.getElementById("lab");
            l.style.top = "49px";
            l.style.left = document.getElementById("labmenu").offsetLeft+"px";//(document.getElementById("labmenu").offsetLeft+document.getElementById("topmenu").offsetLeft)+"px";
        }
    }
    fileshow = !fileshow;
}

//显示或关闭社区窗口
function showtalks() {
    var t = document.getElementById("talk");
    var m = document.getElementById("moremsg");
    if (talkshow == false) {
        //m.innerHTML = "社区↑";
        t.style.display = "block";
        t.style.top = "49px";
        t.style.left = document.getElementById("talkmenu").offsetLeft+"px";//(document.getElementById("talkmenu").offsetLeft+document.getElementById("topmenu").offsetLeft)+"px";

        if (fileshow == true)//如果文件窗口已打开，则社区窗口停靠在文件窗口右侧
        {
            var f = document.getElementById("files");
            t.style.top = f.style.top;
            t.style.left = (parseInt(f.style.left) + parseInt(f.style.width) + 1) +"px";
            if (labshow == true)//如果此时佳作欣赏窗口已打开，则挤开佳作欣赏窗口
            {
                var l = document.getElementById("lab");
                l.style.top = t.style.top;
                l.style.left = (parseInt(t.style.left) + parseInt(t.style.width) + 1)+"px";
            }
        }
        else if (labshow == true)//如果此时佳作欣赏窗口已打开，则挤开佳作欣赏窗口
        {
            var l = document.getElementById("lab");
            l.style.top = t.style.top;
            l.style.left = (parseInt(t.style.left) + parseInt(t.style.width) )+"px";
        }
    }
    else {
        //m.innerHTML = "社区↓";
        m.parentElement.style.backgroundColor="hsla(215, 100%, 65%, 1)";
        t.style.display = "none";

        if (labshow == true)//如果此时佳作欣赏窗口已打开，则停靠在自己菜单下方。
        {
            var l = document.getElementById("lab");
            l.style.top = "49px";
            l.style.left = document.getElementById("labmenu").offsetLeft+"px";//(document.getElementById("labmenu").offsetLeft+document.getElementById("topmenu").offsetLeft)+"px";

           if (fileshow == true)//如果文件已打开，则将佳作欣赏窗口停靠在文件窗口右侧
           {
              var f = document.getElementById("files");
              var l = document.getElementById("lab");
              l.style.top = f.style.top;
              l.style.left = (parseInt(f.style.left) + parseInt(f.style.width) + 1)+"px";
           }
        }
    }
    talkshow = !talkshow;
}

//显示或关闭佳作欣赏窗口
function showlabs() {
    var l = document.getElementById("lab");
    var m = document.getElementById("moretocome");
    if (labshow == false) {
        //m.innerHTML = "佳作欣赏↑";
        l.style.display = "block";
        l.style.top = "49px";
        l.style.left = document.getElementById("labmenu").offsetLeft+"px";//(document.getElementById("labmenu").offsetLeft+document.getElementById("topmenu").offsetLeft)+"px";

        if (talkshow == true) {
            var t = document.getElementById("talk");
            l.style.top = t.style.top;
            l.style.left = (parseInt(t.style.left) + parseInt(t.style.width) + 1)+"px";
        }
        else if (fileshow == true) {
            var f = document.getElementById("files");
            l.style.top = f.style.top;
            l.style.left = (parseInt(f.style.left) + parseInt(f.style.width) + 1)+"px";
        }
        labshow = !labshow;

        getTopList();
    }
    else {
        //m.innerHTML = "佳作欣赏↓";
        m.parentElement.style.backgroundColor="hsla(215, 100%, 65%, 1)";
        l.style.display = "none";
        labshow = !labshow;
    }
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
var bREDOUNDO=false;			//在撤销/重做时，也需要屏蔽自动备份动作。
var bCREATEBLOCK=false;			//当从代码区选取一个积木，刚执行拖动时，VM自动向当前项目中插入该积木，从而激发自动备份动作；
					//但实际上，是否要插入该积木，还没有最终确定：只有在积木最终落到工作区时，此积木才真正有效。
					//也就是说，“取用”和“放下”，这两个操作，可能会激发两次数据备份操作。
					//设置了此变量后，可以取消“取用”时的备份动作。
var bTAB=false;

function scratchStatus(str) 
{
   switch(str)
   {
      case "TABS_0":		//点击“代码”标签，暂未切换
         bTAB=true;
         setTimeout("setNewControl();",100);		//切换标签后，0.1秒内，调整角色和舞台按钮状态
         setTimeout("bTab=false;",500);			//切换标签后，0.5秒内，禁止自动备份。
         //setCodeTabInfo(0);
         break;

      case "TABS_1":		//点击“造型”标签，暂未切换
         setTimeout("setNewControl();",100);
         //setCodeTabInfo(1);
         break;

      case "TABS_2":		//点击“声音”标签，暂未切换
         setTimeout("setNewControl();",100);
         //setCodeTabInfo(2);
         //bTAB=true;
         break;

      //case "TABS":		//切换了代码/造型/声音
      //    setTabInfo();
      //break;

      case "TARGETS_CHANGED":	//切换了角色或舞台
         //bTAB=false;
          //if(!bCODECHANGED)
          getCode();		//编辑期间不更新代码。

      break;

      case "SETLOCALE":		//切换了语言
          //bTAB=false;
          initSelfDefinedUI();//insertMenu();
      break;

      //case "RESIZE":		//在窗口大小发生变化时，实时调整已经显示的关于菜单。
          //bRESIZE=true;
          //showAboutMenu();//insertMenu();
      //break;

      case "small":		//小舞台
          var o=document.getElementById("infolists");
          if(o!=undefined)
             o.style.maxWidth="240px";
          nInfoDivWidth="240px";
      break;

      case "large":		//大舞台
          var o=document.getElementById("infolists");
          if(o!=undefined)
             o.style.maxWidth="480px";
          nInfoDivWidth="480px";
      break;

      case "LOADED":		//项目文件加载完毕
         //bTAB=false;
         bSaving=false;
         bLoaded = true;
         if(bWaiting==true)							//界面屏蔽控制
            document.getElementById('waiting').style.visibility = "visible";
         else
            document.getElementById('waiting').style.visibility = "hidden";

         setTimeout("bReady=true;setNewControl();",200);					//1秒后隐藏角色和背景添加按钮，默认隐藏
         oVMM.props.vm.runtime.ioDevices.userData._username=strCurrentUser;//当前用户名初始化。
         //initSelfDefinedUI();

         //setStar(0);//初始化打分数据
      break;

      //case "RELOAD":		//重新加载
      //    bTAB=false;
      //    bLoaded = false;
      //break;

      case "BACKUPNEEDED":
         //bSaving=false;
         if(bCode) getCode();
         //if(bLoaded && !bREDOUNDO && !bCREATEBLOCK && !bTAB) asAutoSaveOnLine();
         //if(bLoaded && !bREDOUNDO) {};
         asAutoSaveOnLine();
         //bTAB=false;
         
         setTimeout("bREDOUNDO=false;",500);					//切换标签后，0.5秒内，禁止自动备份。
         //bREDOUNDO=false;
         bCREATEBLOCK=false;
         //bRESIZE=false;
      break;

      //case "TABSWITCH":
      //   setTimeout("bReady=true;setNewControl();",200);
      //   //setNewControl();
      //break;

      //case "CHEXT":		//选择了新的扩展后
      //   bTAB=false;
      //   //hideTopMenu();
      //break;

      //case "CHDEXT":		//在扩展选择页面点击“返回”后
      //   bTAB=false;
      //   //showTopMenu();
      //break;

      default:
         //bTAB=false;

         //setNewControl();
         //setTimeout("bReady=true;setNewControl();",100);
         //if(str.indexOf("TABS")!=-1)
         //{
         //   setTabInfo(str.split("_")[1]);
         //}
      break;

   }

    //if (str == "LOADED") 
    //{
       //if(admin==1)
       //  getSprites("sprites");
       //getSprites("spritestoshare");
    //}			//项目文件加载完毕
    //else if (str == "RELOAD") bLoaded = false;		//开始打开其它项目文件
    //else if(bLoaded==true)				//项目文件加载完毕后，其它消息将触发自动保存操作。
    //   asAutoSaveOnLine();

    //if(str=="STOPALL") bInvited=false;

    //if (bLoaded == true && str == "BACKUPNEEDED") asAutoSaveOnLine();

    //以下是Scratch2.0实验室功能
    //if (bWaitforINSERTED == false && str == "SAVENEEDED")	//有些积木，在插入后，是不会激发INSERTED消息的，需要单独处理。
    //{
    //    if (bDemoBegin == 1) {
    //        insert();
    //        bWaitforINSERTED = true;				//插入后，需要恢复信号控制量，防止重复进入。
    //    }
    //}
    //else if (str == "INSERTED" && nBlock < nBlockLen) 	//正常的INSERTED消息处理
    //{
    //    if (bDemoBegin == 1)
    //        insert();
    //}
    //else if(str == "NEWOPT")//检查是否允许新建操作             NEWCHAR==1  BD==1   sprite:visible   stage:visible   box:visible
    //{                       //                                NEWCHAR==1  BD==0   sprite:visible   stage:hidden    box:checkTabName
    //                        //				      NEWCHAR==0  BD==1   sprite:hidden    stage:visible   box:checkTabName
    //                        //                                NEWCHAR==0  BD==0   sprite:hidden    stage:hidden    box:hidden
    //    setNewControl();
    //}
}

function sError(str)
{
   //alert(str);
   document.getElementById('waiting').style.visibility = "hidden";
   if(confirm("此文件似乎已经损坏了，是否尝试修复？")==1)
   {
       var badfilename=document.getElementById("f").value;
       $.post("./CM/recoveryWorks.php?t=" + Math.random(), { "f": badfilename}, function (data) {	//通过COOKIE方式传递新建项目的名字。
          if(data=="[OK]")
          {
             if(confirm("修复已完成，是否尝试重新打开？")==1)
             {
                loadOldProjectFile(document.getElementById("f"));
             }
          }
    });
   }
}

//控制“添加”新角色和背景操作
function setNewControl()
{
   var bBD=getCookie("BD");//背景控制
   var bNC=getCookie("CHAR");//造型控制

   var BACKDROP=document.getElementsByClassName("action-menu_menu-container_3a6da stage-selector_add-button_1sKuU");	//背景添加控制按钮
   var NEWCOSTUME=document.getElementsByClassName("action-menu_menu-container_3a6da sprite-selector_add-button_1XCwG");	//角色添加控制按钮
   var EDITOR_NEW=document.getElementsByClassName("selector_new-buttons_2qHDd box_box_2jjDp");				//造型/声音列表添加控制按钮

   var imgnameArr=(EDITOR_NEW.length==0)?'':EDITOR_NEW[0].children[0].children[0].children[0].src.split("/");		//获取按钮图片，用于识别添加按钮类型
   var imgname=imgnameArr[imgnameArr.length-1];

   /*
   声音：9cfdd378e4cc977fe663ca932e530ec6.svg
   //由于学生机没有音响，所以声音不处理。
   */
   if(bBD==1)//允许添加背景
   {
      if(BACKDROP[0]!=undefined)
         BACKDROP[0].style.visibility="visible";//舞台
      if("44e4859e354c81d66c73f741df2e5ec7.svg"==imgname)
         EDITOR_NEW[0].style.visibility="visible";//编辑区的控制入口
   }
   else
   {
      if(BACKDROP[0]!=undefined)
         BACKDROP[0].style.visibility="hidden";//舞台
      if("44e4859e354c81d66c73f741df2e5ec7.svg"==imgname)
         EDITOR_NEW[0].style.visibility="hidden";//编辑区的控制入口
   }

   if(bNC==1)//允许添加角色
   {
      if(NEWCOSTUME[0]!=undefined)
         NEWCOSTUME[0].style.visibility="visible";//角色
      if("c9528ee4be1a12380a6c9caf73bd99e9.svg"==imgname)
         EDITOR_NEW[0].style.visibility="visible";//编辑区的控制入口
   }
   else
   {
      if(NEWCOSTUME[0]!=undefined)
         NEWCOSTUME[0].style.visibility="hidden";//角色
      if("c9528ee4be1a12380a6c9caf73bd99e9.svg"==imgname)
         EDITOR_NEW[0].style.visibility="hidden";//编辑区的控制入口
   }

   initSelfDefinedUI();
}

/************************************************************
自动备份到服务器
************************************************************/
function asAutoSaveOnLine() {
   //if(bPlayMode==false)			//如果非播放模式，意味着学生有权修改，那么这个文件就是学生自己的，可以备份。
   if(!bSaving)
   {
      bSaving=true;
      oVMM.props.vm.saveProjectOnline(true);
   }
   //bREDOUNDO=false;
   //bTAB=false;
   //bRESIZE=false;
}

//分享角色给他人
//type:1 o.value->spritename
//type:2 o.value->membername
function shareSprite(){

   var o1=document.getElementById("spritestoshare");
   var strSprite=o1.options[o1.selectedIndex].value;
   var strSpriteImg=o1.options[o1.selectedIndex].getAttribute("img");

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
   var strMsgSend="[\"SPRITEX\",\""+uname+"\",\""+ o1.options[o1.selectedIndex].text+"\",\""+strSprite+"\",\""+strSpriteImg+"\"]";
   var msg = { 'content': strMsgSend , 'type': 'user', 'to':strMember };
   sendMsg(msg);
}

function findKey(obj, value, compare =(a,b) => a===b){
   return Object.keys(obj).find( k => compare(obj[k],value))
}


var arrExistedBackdropID=new Array();
function getBackdrops(){

   var arrBackdrop=document.getElementById("backdrops");
   arrBackdrop.length=0;
   arrBackdrop.add(new Option("请选择要分享的背景",""));
   //var   strSpriteName=oVMM.props.vm.runtime.targets[0].sprite.name.replace(/ /g,"");//过滤掉空格;


   var costumes=oVMM.props.vm.runtime.targets[0].getCostumes();   //不能直接对costumes[j].asset.data进行Uint8Array转字符串操作，
   for(var j=0;j<costumes.length;j++)				//因为这里是对象引用，而非复制。
   {

      //if(arrExistedBackdropID.indexOf(costumes[0].assetId)==-1)
      //{
         arrExistedBackdropID.push(costumes[0].assetId);

         var sp={						            //角色/舞台数据模板，由于角色不需要这么严格的格式，所以只在舞台上应用。
            "name":'',//(ID=="sprites")?strSpriteName:uname,//使用原本的角色名，这样，教师端同样的数据，不用生成两份类似的数据。 
            "tags":[],						       //教师发送的角色用本来的名字，学生发送的用学生名。
            "isStage":true,					       //舞台也是一个角色，只不过比较特殊。
            "variables":{},//oVMM.props.vm.runtime.targets[i].variables,//变量在使用中，会由脚本强制生成，所以可以不传递。
            "costumes":[],
            "sounds":[],
            "blocks":[] //oVMM.props.vm.runtime.targets[i].blocks._blocks	//project_json中没有变量的数据，所以要从源头获取。
         };

         var asset= new oVMM.props.vm.runtime.storage.Asset(		//构建Asset图像资源对象
			 costumes[j].asset.assetType,
			 costumes[j].asset.assetId,
			 costumes[j].asset.dataFormat,
			 costumes[j].asset.data,//.toString(),             //直接把Uint8Array转成字符串
			 []);
         var vmBackdrop={ 'asset': asset,				//构建Costume对象
			     'assetId':costumes[j].asset.assetId,
			     'dataFormat':costumes[j].asset.dataFormat,
			     'md5':costumes[j].asset.assetId+"."+costumes[j].asset.dataFormat,
                             'name': costumes[j].name,
			     'rotationCenterX': costumes[j].rotationCenterX,
			     'rotationCenterY': costumes[j].rotationCenterY, 
			     'bitmapResolution': costumes[j].bitmapResolution, 
			     'skinId': null
			   };
         sp.costumes.push(vmBackdrop);
         sp.name=costumes[j].name;
         $.ajax({								//同步请求，将数据暂存到服务器
            type:"POST",
            url:"./CM/saveBackdrop.php?t=" + Math.random(),
            data: { "S":JSON.stringify(sp), "ID": costumes[j].asset.assetId },
            success: function (data) 
	    {
               //arrSpritesSent[strSpriteName]=0;
               if(data.length==32) arrBackdrop.add(new Option(costumes[j].name, data));
            },
            async:false
         });
     // }

   }
}



//获取当前项目中的所有的角色
//并将角色的造型和脚本保存到文件
//每次修改都要执行备份，服务器压力比较大，需要调整。
var arrExistedSpritesID=Array();
function getSprites(ID){
   //var arrExistedSpritesID=new Array();
   var arrSprites=document.getElementById(ID);
   var arrBackdrop=document.getElementById("backdrops");

   if(ID=="spritestoshare")//顶部分享菜单中角色列表
   {
      if(arrSprites.length>1)
      {
         for(var i=1;i<arrSprites.length;i++)		//i=0是固定的分享菜单，从第二条开始，是接收数据
         {
            arrExistedSpritesID[arrSprites[i].value]=arrSprites[i].text.replace(/ /,"");//过滤掉空格
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
         for(var i=1;i<arrExistedSprites.length;i++)	//i=0是固定的分享菜单，从第二条开始，是接收数据
         {
            arrExistedSpritesID[arrExistedSprites[i].value]=arrExistedSprites[i].text.replace(/ /,"");//过滤掉空格;
         }
         arrSprites.length=0;
         arrSprites.add(new Option("请选择要分享的角色",""));
      }
      else if(arrSprites.length>1)	//如果获取失败，从上课管理页面获取
      {
         for(var i=1;i<arrSprites.length;i++)		//i=0是固定的分享菜单，从第二条开始，是接收数据
         {
            arrExistedSpritesID[arrSprites[i].value]=arrSprites[i].text.replace(/ /,"");//过滤掉空格;
         }
         arrSprites.length=0;
         arrSprites.add(new Option("请选择要分享的角色",""));
      }
      else if(arrSprites.length==0){	//都没数据
         arrSprites.add(new Option("请选择要分享的角色",""));
      }
   }

   let project_json={};
   try{
      project_json=JSON.parse(oVMM.props.vm.toJSON());
   }catch(err){
   }
   
   if(JSON.stringify(project_json)=="{}") return;

   for( var i=0;i<oVMM.props.vm.runtime.targets.length;i++)	//i=0为背景
   {
      var   strSpriteName=oVMM.props.vm.runtime.targets[i].sprite.name.replace(/ /g,"");//过滤掉空格;

      var sp=null;

      if(i==0)//0为背景
      {
         sp={						            //角色/舞台数据模板，由于角色不需要这么严格的格式，所以只在舞台上应用。
            "name":strSpriteName,//(ID=="sprites")?strSpriteName:uname,//使用原本的角色名，这样，教师端同样的数据，不用生成两份类似的数据。 
            "tags":[],						       //教师发送的角色用本来的名字，学生发送的用学生名。
            "isStage":true,					       //舞台也是一个角色，只不过比较特殊。
            "variables":{},//oVMM.props.vm.runtime.targets[i].variables,//变量在使用中，会由脚本强制生成，所以可以不传递。
            "costumes":[],
            "sounds":[],
            "blocks":oVMM.props.vm.runtime.targets[i].blocks._blocks	//project_json中没有变量的数据，所以要从源头获取。
         };
 
         var costumes=oVMM.props.vm.runtime.targets[i].getCostumes();   //不能直接对costumes[j].asset.data进行Uint8Array转字符串操作，
         for(var j=0;j<costumes.length;j++)				//因为这里是对象引用，而非复制。
         {
            var asset= new oVMM.props.vm.runtime.storage.Asset(		//构建Asset图像资源对象
			 costumes[j].asset.assetType,
			 costumes[j].asset.assetId,
			 costumes[j].asset.dataFormat,
			 costumes[j].asset.data,//.toString(),             //直接把Uint8Array转成字符串
			 []);
            var vmBackdrop={ 'asset': asset,				//构建Costume对象
			     'assetId':costumes[j].asset.assetId,
			     'dataFormat':costumes[j].asset.dataFormat,
			     'md5':costumes[j].asset.assetId+"."+costumes[j].asset.dataFormat,
                             'name': costumes[j].name,
			     'rotationCenterX': costumes[j].rotationCenterX,
			     'rotationCenterY': costumes[j].rotationCenterY, 
			     'bitmapResolution': costumes[j].bitmapResolution, 
			     'skinId': null
			   };
            sp.costumes.push(vmBackdrop);
         }
      }
      else//角色
      {
         sp=project_json.targets[i];					//targets中获得的数据，其中一个参数为：jsondata.costumes[i].md5ext
         sp.costumes=oVMM.props.vm.runtime.targets[i].getCostumes();  	//getCostumes()中获得的数据，该参数名为：jsondata.costumes[i].md5
      }

      var strSpriteID=findKey(arrExistedSpritesID,strSpriteName);
      //if(strSpriteID)
      //   break;
      $.ajax({								//同步请求，将数据暂存到服务器
         type:"POST",
         url:"./CM/saveScript.php?t=" + Math.random(),
         data: { "S":JSON.stringify(sp), "ID": ( arrSpritesSent[strSpriteName]==1?"":strSpriteID) },
         success: function (data) 
	 {

            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);
if(data=="") return;
            arrSpritesSent[strSpriteName]=0;

            var posJSON=JSON.parse(data);

            if(JSON.stringify(posJSON)=="{}") return;
            if(posJSON.length==2)
            {
               var newOption=new Option(strSpriteName, posJSON[1]);
               newOption.setAttribute("img",posJSON[0]);
               arrSprites.add(newOption);
            }

            //if(data.length==32) arrSprites.add(new Option(strSpriteName, data));
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
      url:"./CM/getMember.php?t=" + Math.random(),
      data: { "N":uname },			  //当前用户名
      success: function (data) 
      {
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
if(data=="") return;
         var o=document.getElementById("memberstoshare");		//菜单初始化
         if(o.length) o.length=0;
         o.add(new Option("请选择组员",""));

         if(uname!=strTeacher)					//直接给学生添加老师的名字
            o.add(new Option(strTeacher,strTeacher));

         if(data)//有返回数据
         {
            let members={};
            try{
               members=JSON.parse(data);
            }catch(err){ }

            //var members=JSON.parse(data);//当前用户所在组

            if(JSON.stringify(members)=="{}") return;

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
var bAutoSaveNoConfirm=true;
function saveOnline(bAuto) {
    bAutoSaveNoConfirm=bAuto;
    oVMM.props.vm.saveProjectOnline(false);
    //scratch.saveOnLine();
    //document.getElementById("hidden").style.visibility="visible";

}

/************************************************************
新建项目
************************************************************/
function createNew(strNewFilename) {
    //由于每步操作都会触发自动备份，所以新建项目不会丢失数据。
    //var strNewFilename = filename;
    if (strNewFilename == "") {
        newInfo("文件名不能为空。",false,true);
        return;
    }
    else if (strNewFilename.indexOf("ALL_") > -1 || strNewFilename.indexOf("\\") > -1 || strNewFilename.indexOf("/") > -1 || strNewFilename.indexOf(":") > -1 || strNewFilename.indexOf("*") > -1 || strNewFilename.indexOf("?") > -1 || strNewFilename.indexOf("\"") > -1 || strNewFilename.indexOf("<") > -1 || strNewFilename.indexOf(">") > -1 || strNewFilename.indexOf("|") > -1) {
        newInfo("文件名不合法。",false,true);
        return;
    }
    var o = document.getElementById("newp");
    o.value = strNewFilename;

    $.post("./CM/setPrjname.php?t=" + Math.random(), { "prjname": strNewFilename }, function (data) {	//通过COOKIE方式传递新建项目的名字。
        //data= eval(data);
        //alert(data);
    });

    bFirstTimeSaving = true;

    strSelectedFilename='';
    nStar=0;
    showStar(0);

    //filename = strNewFilename;
    bLoaded = false;
    //自定义空项目（没有角色，没有声音，只有一个空白背景。）
    oVMM.props.vm.loadProject({"targets":[{"isStage":true,"name":"Stage","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"assetId":"cd21514d0531fdffb22204e0ec5ed84a","name":"背景1","md5ext":"cd21514d0531fdffb22204e0ec5ed84a.svg","dataFormat":"svg","rotationCenterX":240,"rotationCenterY":180}],"sounds":[],"volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"on","textToSpeechLanguage":null}],"monitors":[],"extensions":[],"meta":{"semver":"3.0.0","vm":"0.2.0-prerelease.20210120142104","agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36"}});
    //系统默认空项目（有一个角色猫，一个声音和一个空白背景。）
    //oVMM.loadProject({"targets":[{"isStage":true,"name":"Stage","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"assetId":"cd21514d0531fdffb22204e0ec5ed84a","name":"背景1","md5ext":"cd21514d0531fdffb22204e0ec5ed84a.svg","dataFormat":"svg","rotationCenterX":240,"rotationCenterY":180}],"sounds":[],"volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"on","textToSpeechLanguage":null}],"monitors":[],"extensions":[],"meta":{"semver":"3.0.0","vm":"0.2.0-prerelease.20210120142104","agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36"}});

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
            newInfo("文件名不能为空。",false,true);
            return;
        }
        else if (strNewFilename.indexOf("ALL_") > -1 || strNewFilename.indexOf("_EDITABLE_") > -1 || strNewFilename.indexOf("\\") > -1 || strNewFilename.indexOf("/") > -1 || strNewFilename.indexOf(":") > -1 || strNewFilename.indexOf("*") > -1 || strNewFilename.indexOf("?") > -1 || strNewFilename.indexOf("\"") > -1 || strNewFilename.indexOf("<") > -1 || strNewFilename.indexOf(">") > -1 || strNewFilename.indexOf("|") > -1) {
            newInfo("文件名不合法。",false,true);
            return;
        }
        var o = document.getElementById("newp");
        o.value = strNewFilename;

        $.post("./CM/setPrjname.php?t=" + Math.random(), { "prjname": strNewFilename }, function (data) {	//通过COOKIE方式传递新建项目的名字。
            //data= eval(data);
            //alert(data);
            //loadMSG(classid);
            loadBKFilelist(classid, folder);
            //输入项目名后，要更新一次历史数据。
        });

        bFirstTimeSaving = true;

        filename = strNewFilename;
        bLoaded = false;
        oVMM.loadProject("0");
        //scratch.createNewProject();
        bPlayMode = false;
        setMode();
        //document.getElementById('ul').style.visibility="visible";
        document.getElementById("cancel").style.visibility = "hidden";
        document.getElementById("redo").style.visibility = "hidden";
        document.getElementById("cancelleft").innerHTML = '';
        document.getElementById("redoleft").innerHTML = '';

    }
    else newInfo("您没有输入游戏名称，将无法新建游戏。",false,true);
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
    if(strSelectedFilename && strSelectedFilenameBackup.indexOf(strSelectedFilename)==false)
       strSelectedFilenameBackup=folder+"/"+strSelectedFilename;//==''?filename:strSelectedFilename;
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
        strSelectedFilenameBackup='';
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
    if (filename) {
       document.getElementById('waiting').style.visibility = "visible";
       bLoaded = false;
       //bPlayMode=false;
       $.get("./CM/view.php?SB2=" + filename + "&C=" + classid + "&D=" + folder + "&t=" + Math.random(), function (data)//获取文件URL
       {
          oVMM.props.vm.downloadProjectId(data);//通过URL打开文件
          updateScreenMode();

          var strOldProjectName = filename.substr(findNPos(filename, '_', 1) + 1);
          strOldProjectName = strOldProjectName.substr(0, strOldProjectName.lastIndexOf('.'));
          nFileType=0;

          if (strOldProjectName != '') {
             document.getElementById("newp").value = strOldProjectName;
             filename = strOldProjectName;
             $.post("./CM/setPrjname.php?t=" + Math.random(), { "prjname": strOldProjectName });//, function(data){	//通过COOKIE方式传递新建项目的名字。
          }

          var IMGFILE = folder + '' + filename;						//用于生成快照
          $.post("./CM/setPrjname.php?t=" + Math.random(), { "fname": encodeURI(IMGFILE) },function(data)
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
        $.get("./CM/viewb.php?SB2=" + bkfilename + "&C=" + classid + "&D=" + folder + "&t=" + Math.random(), function (data) {
            bCodeViewableFile = true;	//可编辑文件
            bLoaded = false;
            oVMM.props.vm.downloadProjectId(data);						//通过URL打开文件
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

   //showCodeConvertor();//旧的代码编辑器打开方式不再使用。暂存盘在initSelfDefinedUI里。
   if (bCodeViewableFile == false && bFullScreenStatus == false) {
      bCodeViewableFile = true;
      //if(strSelectedFilenameBackup)
      strSelectedFilename=strSelectedFilenameBackup;
      nFileType=0;						//退出播放模式
      setStar(0);

      if (admin == 0) {
         if (nBKFileTotal > 0) {
            cancelit();					//返回原来正在编辑的项目
         }
         else
         {
            if(strSelectedFilenameBackup) 
            {

               document.getElementById('waiting').style.visibility = "visible";
               bLoaded = false;
               //bPlayMode=false;
               $.get("./CM/view.php?SB2=" + strSelectedFilenameBackup.split("/")[1] + "&C=" + classid + "&D=" + strSelectedFilenameBackup.split("/")[0] + "&t=" + Math.random(), function (data)//获取文件URL
               {
                  oVMM.props.vm.downloadProjectId(data);//通过URL打开文件
                  updateScreenMode();

                  strSelectedFilename=strSelectedFilenameBackup.split("/")[1];
                  document.getElementById("d").value=folder=strSelectedFilenameBackup.split("/")[0];

                  loadFilelist(classid,folder);

                  var strOldProjectName = filename.substr(findNPos(filename, '_', 1) + 1);
                  strOldProjectName = strOldProjectName.substr(0, strOldProjectName.lastIndexOf('.'));
                  nFileType=0;

                  if (strOldProjectName != '') {
                     document.getElementById("newp").value = strOldProjectName;
                     filename = strOldProjectName;
                     $.post("./CM/setPrjname.php?t=" + Math.random(), { "prjname": strOldProjectName });//, function(data){	//通过COOKIE方式传递新建项目的名字。
                  }

                  var IMGFILE = folder + '' + filename;						//用于生成快照
                  $.post("./CM/setPrjname.php?t=" + Math.random(), { "fname": encodeURI(IMGFILE) },function(data)
                  {
                     loadMSG(classid);
                     loadBKFilelist(classid, folder);
                  });	//选择文件后，更新ProjectName（一人可创建多个项目。）
               });
               //oVMM.loadProject(strSelectedFilenameBackup);

            }
            else                          oVMM.loadProject("0");			//打开默认项目，用于覆盖掉禁止查看源码的项目
         }
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
       newInfo("登录超时，本次自动保存失败，请点击“重新登陆”链接。");
       showmenu(2);
       s.innerHTML = "<font size=2 color=red>登录超时，请<a href=../ target=_blank>重新登录</a>。</font>";
    }
    else if (str == "ADMINERROR") {
       newInfo("在执行保存前，请先选择班级。",false,true);
       showmenu(2);
       document.getElementById("c").focus();
       s.innerHTML = "<font size=2 color=red>在执行保存前，请先选择班级。</font>";
    }
    else {
        //alert(str);
        if (str.indexOf("保存已完成") == 0)	//保存操作，需要刷新文件夹
        {
            if(bAutoSaveNoConfirm==false)
               newInfo("保存已完成。下次如有修改，请再次执行“上传文件到服务器”操作。");
            var msg = { 'content': "<font color=green>已保存作业</font>", 'type': 'user' };
            sendMsg(msg);				//websocket功能调用。
            //if (bFirstTimeSaving == true)
            //    loadFolder(classid);
            bFirstTimeSaving = false;
            newInfo(str);

        }
        s.innerHTML = "<font size=2 color=green>" + str + "</font>";
        //loadBKFilelist(classid, folder);
        loadFolder(classid);//;//loadFilelist(classid,folder);
        hideShare();
        bSaving=false;			//防止保存操作阻塞
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
        newInfo("登录超时，本次自动保存失败，请刷新页面重新登录。",false,true);
        s.innerHTML = "<br><font size=2 color=red>登录超时，请<a href=../ target=_blank>重新登录</a>。</font>";
    }
    else if (str == "ADMINERROR") {
        newInfo("在执行保存前，请先选择班级。");
        s.innerHTML = "<br><font size=2 color=red>在执行保存前，请先选择班级。</font>";
    }
    else if (str.indexOf("SNAP|") === 0) {
        //alert("快照已生成："+str.substring(5));
        $.post("./CM/release.php?t=" + Math.random(), { "cid": classid, "f": folder, "fn": strSelectedFilename }, function (data) {//提送榜单
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

        //var m = document.getElementById("moremsg");		//社区聊天记录显示
        //m.innerHTML = "社区";

        $.post("./CM/getFolders.php?t=" + Math.random(), { "C": classid }, function (data) {

            data = eval(data);
            if (data.length==1)
            {
                gradeid=data[0];			//更换班级后，也要更新一下年级信息，这样，为了能正常使用小白板的调档操作，就不用刷新页面了。
                loadBDAttach(gradeid);
                loadPICKUP();
            }
            else if (data.length > 1) {
                o.add(new Option("请选择一个日期", ""));
                for (var i = 0; i < data.length-1; i++) {
                    o.add(new Option(data[i], data[i]));
                }
                o.selectedIndex = 1;
                folder = o.value;
                gradeid=data[data.length-1];			//更换班级后，也要更新一下年级信息，这样，为了能正常使用小白板的调档操作，就不用刷新页面了。

                loadFilelist(classid, folder);
                loadBDAttach(gradeid);
                loadPICKUP();
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
    $.post("./CM/getBackup.php?t=" + Math.random(), { "C": classid, "D": folder }, function (data) {
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
        bREDOUNDO=true;
        loadBackupProjectFile(arrBKFiles[nBKFileIndex]);
        bLoaded = false;

        document.getElementById("cancelleft").innerHTML = nBKFileIndex;
        if ((arrBKFiles.length - nBKFileIndex) - 1 > 0)
        {
            document.getElementById("redo").style.visibility = "visible";
            document.getElementById("redoleft").innerHTML = (arrBKFiles.length - nBKFileIndex) - 1;
        }
        else
        {
            document.getElementById("redo").style.visibility = "hidden";
            document.getElementById("redoleft").innerHTML = '';
        }
        //if (nBKFileIndex == arrBKFiles.length - 1) {
        //    document.getElementById("redo").style.visibility = "visible";
        //    document.getElementById("recovery").style.visibility = "visible";//恢复
        //}
        //else 
        if (nBKFileIndex == 0) {
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
    else newInfo("没有了。");
}

function redoit() {
    if (nBKFileIndex < nBKFileTotal - 1) {
        document.getElementById('waiting').style.visibility = "visible";

        nBKFileIndex++;
        ////scratch.autoLoadProject(arrBKFiles[nBKFileIndex],"1","0");
        bREDOUNDO=true;
        loadBackupProjectFile(arrBKFiles[nBKFileIndex]);
        bLoaded = false;

        document.getElementById("cancelleft").innerHTML = nBKFileIndex;
        document.getElementById("cancel").style.visibility = "visible";

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
        var c = document.getElementById("c"); c.focus(); newInfo("请先选择班级。");
    }
    else if (date == "") {
        var d = document.getElementById("d"); d.focus(); newInfo("请先选择日期。");
    }
    else {
        if(path!=date)
        {
           if(strSelectedFilename)//  && strSelectedFilenameBackup.indexOf(path)==false)
           {
              if(strSelectedFilenameBackup=="")
                 strSelectedFilenameBackup=path+"/"+strSelectedFilename;
              //else if(folder==date)
              //   strSelectedFilenameBackup=path+"/"+strSelectedFilename;
              //else
              //   strSelectedFilenameBackup=date+"/"+strSelectedFilename;
           }
           strSelectedFilename='';
           path=date;
        }
        var o = document.getElementById("f");
        o.options.length = 0;
        folder = date;

        //var m = document.getElementById("moremsg");		//社区聊天记录显示
        //m.innerHTML = "社区↓";

        $.post("./CM/getFiles.php?t=" + Math.random(), { "C": classid, "D": folder }, function (data) {
            data = eval(data);
            if (data.length > 0) {
                o.add(new Option("请选择一个文件", ""));
                for (var i = 0; i < data.length; i++) {
                    if (data[i] != "") {
                        var filename = data[i].split("/");
                        o.add(new Option(filename[filename.length - 1], data[i]));
                        if(strSelectedFilename && strSelectedFilename==data[i]) o.selectedIndex=(i+1);
                    }
                }
            }
        });

        loadBKFilelist(classid, date);//加载可能存在的备份文件
        //getTopList() ;//刷新佳作欣赏
    }
}

/*
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
*/

/*
获取佳作列表
*/
function getTopList() {
    if (classid == "") {
        //      showmenu(2);
        var files = document.getElementById("files");
        var tops = document.getElementById("lab");
        if (fileshow == false) showfiles();
        //files.style.top = tops.style.top;
        //files.style.left = (parseInt(tops.style.left) - parseInt(files.style.width) - 1);

        try{
           var c = document.getElementById("c"); c.focus(); newInfo("请先选择班级。");
        }catch(err){
        }
    }
    else {
        document.getElementById("toplist").innerHTML = "";

        $.get("./CM/getToplist.php?D="+folder+"&CID=" + classid + "&t=" + Math.random(), function (data) {
            var tops = eval(data);
            if (tops!=undefined && tops.length > 0) {
                if (tops[0].length > 0) {
                    var strDate = "";
                    for (i = 0; i < tops.length; i++) {
                        var strDate_t = tops[i][0].substring(0, 10);
                        if (strDate != strDate_t) {
                            strDate = strDate_t;//alert(strDate);
                            var x2 = document.createElement("DIV");
                            x2.style="background:yellow; position: relative;top: 0px;";
                            x2.innerHTML = "<div style=\"color: red;width: 80px;height:57px;font-size: 4px;top: 16px;text-align: center;position: relative;\">" + strDate + "<br>→</div>";
                            document.getElementById("toplist").appendChild(x2);
                        }
                        var x2 = document.createElement("DIV");
                        x2.setAttribute("class","refreshed");
                        x2.innerHTML = "<div style=\"width:80px;height:57px;margin: 4 4 4 4;font-size: 4px;\"><div title=\"作者点我可撤销此次上榜内容。\" alt=\"作者点我可撤销此次上榜内容。\" style=\"position: relative;height:56px;width: 8px; top:0px;background-color: #4CAF50;border-bottom: 1px solid red;\" type=\"button\" onclick=\"deltop('" + tops[i][1] + "','" + tops[i][0] + "');\">X</div><img title=\"单击欣赏："+tops[i][0].split("|")[1]+"\" alt=\"单击欣赏："+tops[i][0].split("|")[1]+"\"  style=\"position: relative;top: -57px;left: 8px;\" width=90% src=\"../top/" + classid + "/" + tops[i][1] + ".PNG?t=" + Math.random() + "\" alt=\"" + tops[i][0] + "\" title=\"" + tops[i][0] + "\" onclick=\"showTop(this,'" + tops[i][1] + "','" + tops[i][0] + "')\"><!--span  onclick=\"showTop(this,'" + tops[i][1] + "','" + tops[i][0] + "')\" style=\"position: relative;z-index: 9;color: white;background:black;left: 25px;top: -75px;\">"+tops[i][0].split("|")[1].split("_")[1]+"</span--></div>";
                        document.getElementById("toplist").appendChild(x2);
                    }
                }
                //else {
                //   alert("已申请上榜者才可以查看榜单。");
               //}
            }
            //else {
            //    alert("已申请上榜者才可以查看榜单。");
            //    o.add(x);
            //}
        });
    }
}

function deltop(tfid, fn) {
    if (confirm("警告：\r\n        该操作不可撤销。\r\n        您确定要撤销当前的上榜信息么？") == 1) {
        if (tfid) {
            $.post("./CM/delTop.php?t=" + Math.random(), { "cid": classid, "fid": tfid, "fn": fn }, function (data) {
                if (data.indexOf("DEL|") === 0) {
                    newInfo("上榜信息已撤销。");
                }else alert(data);
                getTopList();
            });
        }
    }
}


function showTop(thisobj, tfid, info) {
    if (tfid) {
        nStar=0;
        if(strSelectedFilename!="" && strSelectedFilenameBackup=="")
           strSelectedFilenameBackup=folder+"/"+strSelectedFilename;

        strSelectedFilename=info.split("|")[1];

        var arrT=strSelectedFilename.split("_");
        if(arrT.length==3)
           strCurrentFilename=arrT[1]+"的"+arrT[2].replace(".SB3","");
        else
           strCurrentFilename='';

        bPlayMode = true;
        setMode();
        bViewSourceAllowed = false;			//播放模式

        if (lastViewed)//给查看过的项目加上颜色标记。
            lastViewed.setAttribute("class", "viewed");
        thisobj.parentNode.setAttribute("class", "clicked");
        lastViewed = thisobj.parentNode;

        var snap = document.getElementById("snap");
        snap.innerHTML = "<img alt='单击更新预览图' title='单击更新预览图' id=snapimg name=snapimg  width=368 src=\"../top/" + classid + "/" + tfid + ".PNG?t=" + Math.random() + "\" onclick=\"refreshScreenshot('" + tfid + "','" + info + "')\">" + info.substr(0, info.length - 4);
        snap.style.display = "block";

        bCodeViewableFile = false;	//不可编辑文件
        oVMM.props.vm.downloadProjectId("../top/" + classid + "/" + tfid + "." + info.substr(-3) + "?t=" + Math.random());
        updateScreenMode();
        bLoaded = false;
        nFileType=1;

        //strSelectedFilenameBackup=strSelectedFilename;
        //strSelectedFilename=info.split("|")[1];
        setStar(0);
    }
    else newInfo("暂无人上榜！就等你了！");
}

/************************************************************
加载互动信息
************************************************************/
function loadMSG(classid) {
    var f = document.getElementById("f");
    if (f.value == "") newInfo("请先选择文件。");
    else {
        var o = document.getElementById("msgs");

        var o2 = document.getElementById("infotext");
        //o.innerHTML="等待刷新中。。。";

        var fn = strSelectedFilename;//filename.split("/");

        $.post("./CM/getMsg.php?t=" + Math.random(), { "C": classid, "D": folder, "F": fn }, function (data) {
            var strs = eval("{" + data + "}");
            o.length = 0;
            o2.innerHTML = "";

            if (strs.length > 0) {
                //var m = document.getElementById("moremsg");		//社区聊天记录显示
                //m.innerHTML = "社区↓";
                if (strs[0].length > 0) {
                    //m.innerHTML = "社区↓<font color=\"red\">*</font>";

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
      newInfo("请选择文件后输入要提交的信息。");

      var files = document.getElementById("files");
      var talks = document.getElementById("talk");
      if (fileshow == false) showfiles();
      files.style.top = talks.style.top;
      files.style.left = (parseInt(talks.style.left) - parseInt(files.style.width) - 1);
   }
   else {
      var fn = strSelectedFilename;//.split("/");
      $.post("./CM/saveMsg.php?t=" + Math.random(), { "C": classid, "D": folder, "F": fn, "MSG": o2.value }, function (data) {
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
      newInfo("请先选择要生成快照的文件。");
   }
}

/*******************************
创建舞台快照
*******************************/
function getScreenshot() {
   if (confirm("请注意：\r\n        如作品中存在不健康的语言、文字或图像，将给予本学期不及格的处理。\r\n        如要核对，请点击“取消”按钮。\r\n        调整数据后，请再次执行“上传文件到服务器”操作。") == 1) {
      if (strSelectedFilename.indexOf(".SB") > 0) {
         if (strSelectedFilename.indexOf(strCurrentUser) > -1 || strCurrentUser == strTeacher)//学生只能生成自己作品的快照，教师能生成所有人的作品的快照
         {
            if (classid) {
               setCookie(classid);
               $.post("./CM/setPrjname.php?t=" + Math.random(), { "fname": encodeURI(folder+ '' +strSelectedFilename) });
               oVMM.props.vm.renderer.requestSnapshot();
            }
            else {
               var c = document.getElementById("c"); c.focus(); alert("请先选择班级。");
            }
         }
         else {
            newInfo("您只能对自己的作品执行本操作。");
         }
      }
      else {
         newInfo("请先选择要生成快照的文件。");
      }
   }
}

//更新快照
function refreshScreenshot(tfid, info) {
   if (tfid.length == 32) {
      if (strCurrentUser == strTeacher || info.indexOf(strCurrentUser) > 0)//学生只能生成自己作品的快照，教师能生成所有人的作品的快照
      {
         if (classid) {
            setCookie(classid);
            $.post("./CM/setPrjname.php?t=" + Math.random(), { "REFNAME": encodeURI(tfid) });
            ////scratch.getScreenshot();
            oVMM.props.vm.renderer.requestSnapshot();
         }
      }
      else {
         newInfo("您只能对自己的作品执行本操作。");
      }
   }
}

/************************************************************
设置页面cookie
************************************************************/
function setCookie(value) {
    $.post("./CM/setPrjname.php?t=" + Math.random(), { "cid": encodeURI(value) });
}

function setJSCookie(cname, cvalue, exhours) {
    var d = new Date();
    d.setTime(d.getTime() + (exhours*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires ;
}


///////////////////////////////////////CANVAS录制功能
var bRecording=false;
var chunks = null;
var videoUrl = null;
var mediaRecorder = null;
var canvas = null;
var stream = null;

//开始录制
function startRecording(){
   canvas = document.querySelector('canvas');
   canvas.addEventListener('webglcontextlost', function(e) {
      //console.log(e); 
   }, false);

   stream = canvas.captureStream(); // frames per second
   let options = {mimeType: 'video/webm'};
   chunks = [];
   try {
       mediaRecorder = new MediaRecorder(stream, options);
   }catch(e0) {
      try {
         options = { mimeType: 'video/webm,codecs=vp9'};
         mediaRecorder = new MediaRecorder(stream, options);
      } catch(e1) {
         try {
             options = 'video/vp8'; // Chrome 47
             mediaRecorder = new MediaRecorder(stream, options);
         } catch(e2) {
             newInfo('当前浏览器不支持MediaRecorder。\n\n' + '请使用 Firefox 29 或 Chrome 47 及其更高版本。',false);
             return;
         }
      }
   }
   //mediaRecorder.onstop = handleStop;
   mediaRecorder.ondataavailable = handleDataAvailable;
   //mediaRecorder.start(100); // collect 100ms of data
   //console.log('MediaRecorder started', mediaRecorder);
   mediaRecorder.start(60)  // 开始录屏,参数为抓取间隔40毫秒
   oVMM.props.vm.runtime.greenFlag();	//自动开始播放
   bRecording=true;
}

function handleDataAvailable (event) {
   chunks.push(event.data);
}

//停止录制，并下载录制后的视频
function stopRecording(){      // 录制结束时调用该方法停止录制，并生成下载链接，下载
   oVMM.props.vm.runtime.stopAll();			//自动停止播放
   mediaRecorder.stop();       				// 结束录屏
   const videoBlob = new Blob(chunks, { 'type': 'video/webm' })   // 创建视频文件
   videoUrl = window.URL.createObjectURL(videoBlob)    		 // 创建对象链接
   var a = document.createElement('a');
   a.href = videoUrl;
   a.download = strSelectedFilename==""?(uname+'制作的Scratch3.0动画.MP4'):(strSelectedFilename+"导出的Scratch3.0动画.MP4");//打开已有文件的导出和新建的导出，文件名不一样，以示区别。
   a.style.display = 'none';
   document.body.appendChild(a);
   a.click();
   bRecording=false;
}

//插入录制按钮
//添加评分UI

//舞台录制系统UI注入
function injectRecorder()
{
   var o=document.getElementsByClassName("controls_controls-container_2xinB");
   //if(o[0]!=undefined)
   if(o.length>0 && o[0]!=undefined && o[0].children.length==2)//判断录制按钮是否已经添加
   {
      //if (navigator.userAgent.indexOf("Chrome")>0 && navigator.userAgent.indexOf("Edg")==-1)//Edge抽风了，之前支持，后来不支持了。
      //{

         var imgStop=document.createElement("img"); 
         //img.id="RECORD";
         imgStop.src="./static/assets/36fcc7dbca20720abcab01e49d4955f9.svg";
         imgStop.alt="点击停止所有脚本，并清理克隆体";
         imgStop.title="点击停止所有脚本，并清理克隆体";
         imgStop.style.position="relative";
         imgStop.style.padding="6px";
         imgStop.style.height="32px";
         imgStop.style.width="32px";
         imgStop.style.borderRadius="calc(0.5rem / 2)";
         imgStop.style.cursor="pointer";
         imgStop.className="record-video_record-video_1kiAo";
         imgStop.onmouseover=function()//hover背影
         {
            imgStop.style.backgroundColor ="hsla(215, 100%, 65%, 0.15)";
         };
         imgStop.onmouseout=function()
         {
            imgStop.style.backgroundColor='';
         };

         imgStop.onclick=function()
         {
            bCleanClone=true;
            oVMM.props.vm.runtime.stopAll();
         };
         o[0].appendChild(imgStop);




         var imgRecord=document.createElement("img"); 
         //img.id="RECORD";
         imgRecord.src=bRecording==true?"./img/rec.gif":"./img/rec.png";
         imgRecord.alt="点击开始录制舞台视频";
         imgRecord.title="点击开始录制舞台视频";
         imgRecord.style.position="relative";
         imgRecord.style.padding="2px";
         imgRecord.style.height="32px";
         imgRecord.style.width="32px";
         imgRecord.style.borderRadius="calc(0.5rem / 2)";
         imgRecord.style.cursor="pointer";
         imgRecord.className="record-video_record-video_1kiAo";
         imgRecord.onmouseover=function()//hover背影
         {
            imgRecord.style.backgroundColor ="hsla(215, 100%, 65%, 0.15)";
         };
         imgRecord.onmouseout=function()
         {
            imgRecord.style.backgroundColor='';
         };

         imgRecord.onclick=function()
         {
            if(imgRecord.src.indexOf("rec.png")>0)//录制时播放gif动图
            {
               if(confirm("你刚才点的不是“停止”按钮，而是“录制”按钮。\n当你点了后，浏览器就会开始把舞台上所有的活动（除了变量和询问对话框），录制成视频。\n当你再次点击这个按钮的时候，录制就会结束。\n长时间进行舞台录制的话，浏览器可能会因为负载过大而出现不稳定的现象。\n所以，请不要长时间地录制。\n\n你确定要开始录制么？")==1)
               {
                  imgRecord.src="./img/rec.gif";
                  imgRecord.alt="点击结束录制舞台视频，并下载文件";
                  imgRecord.title="点击结束录制舞台视频，并下载文件";
                  startRecording();
               }
            }
            else				//结束录制后显示静态png
            {
               imgRecord.src="./img/rec.png";
               imgRecord.alt="点击开始录制舞台视频";
               imgRecord.title="点击开始录制舞台视频";
               stopRecording();
            }
         };
         o[0].appendChild(imgRecord);
      //}
      //injectRatingSystem();
      var d=document.createElement("DIV");
      d.id="STARS";
      d.style="font-size: 24px; position: relative; left: 1px;top:-9px;display:none";

      var dindicator=document.createElement("DIV");	//底部边框
      var dframe=document.createElement("DIV");
      dframe.style="position:absolute;width: 101px;height: 28px;left: -1px;top: 3px; border: solid 1px; border-color: gold;z-index: 9;background: gold;";
      dindicator.appendChild(dframe);

      var dprogress=document.createElement("DIV");	//评分指示
      dprogress.id="star_indicator";
      dprogress.style="position:absolute;background: red;width: 0px;height: 28px;left: -1px;top: 3px;z-index: 9;";
      dindicator.appendChild(dprogress);

      var dcancel=document.createElement("DIV");	//撤销操作
      dcancel.title="点此撤销我的评分";
      dcancel.style="position: absolute; width: 101px; height: 15px; left: -1px;top: 32px;cursor: pointer;z-index:10;";
      dcancel.onclick=function(){setStar(-1);};
      dindicator.appendChild(dcancel);

      d.appendChild(dindicator);

      var dstar=document.createElement("DIV");		//星星
      dstar.style="position: absolute; z-index: 9;height: 26px;top: 4px;left:0px;font-size:1.5rem;";
      for(var i=0;i<5;i++)
      {
         var span=document.createElement("SPAN");
         span.id="star"+(i+1);
         span.style="position: relative; top: -4px; cursor:pointer;";
         if(admin)
         {
            span.title="给"+(i+1)+"分";
            span.setAttribute("n",(i+1));
            span.onmouseover=function(){ chooseStar(this) };	//移入，根据选择显示评分效果
            span.onmouseout=function(){ showStar();};		//移除，更新评分
            span.onclick=function(){ setStar(this);};		//单击，添加/修改评分
         }
         else
         {
            span.title="单击可获取最新评分";
            span.setAttribute("n",(i+1));
            span.onclick=function(){ setStar(0);};		//刷新评分
         }
         span.innerText="☆";
         span.style.color="yellow";
         dstar.appendChild(span);
      }
      d.appendChild(dstar);

      var dinfo=document.createElement("DIV");		//在这里动态添加跑马灯
      dinfo.style="position: absolute;width:100px;top:31px;height:14px;font-size:12px;z-index:9";
      dinfo.id="RATEINFO";

      d.appendChild(dinfo);

      o[0].appendChild(d);
   }
}

function showRecord()
{

}



///////////////////////////////////////CANVAS录制功能

///////////////////////////////////////作品评价功能
//评价功能UI注入
function injectRatingSystem()
{
   //评分显示页面
   var o=document.getElementsByClassName("controls_controls-container_2xinB");
   if(o.length>0 && o[0]!=undefined && o[0].children.length==2)//判断录制按钮是否已经添加
   {
      var d=document.createElement("DIV");
      d.id="STARS";
      d.style="font-size: 24px; position: relative; left: 1px;top:-9px";

      var dindicator=document.createElement("DIV");	//底部边框
      var dframe=document.createElement("DIV");
      dframe.style="position:absolute;width: 101px;height: 28px;left: -1px;top: 3px; border: solid 1px; border-color: gold;z-index: 9;background: gold;";
      dindicator.appendChild(dframe);

      var dprogress=document.createElement("DIV");	//评分指示
      dprogress.id="star_indicator";
      dprogress.style="position:absolute;background: red;width: 0px;height: 28px;left: -1px;top: 3px;z-index: 9;";
      dindicator.appendChild(dprogress);

      var dcancel=document.createElement("DIV");	//撤销操作
      dcancel.title="点此撤销我的评分";
      dcancel.style="position: absolute; width: 101px; height: 15px; left: -1px;top: 32px;cursor: pointer;z-index:10;";
      dcancel.onclick=function(){setStar(-1);};
      dindicator.appendChild(dcancel);

      d.appendChild(dindicator);

      var dstar=document.createElement("DIV");		//星星
      dstar.style="position: absolute; z-index: 9;height: 26px;top: 4px;left:0px;font-size:1.5rem;";
      for(var i=0;i<5;i++)
      {
         var span=document.createElement("SPAN");
         span.id="star"+(i+1);
         span.style="position: relative; top: -4px; cursor:pointer;";
         if(admin)
         {
            span.title="给"+(i+1)+"分";
            span.setAttribute("n",(i+1));
            span.onmouseover=function(){ chooseStar(this) };	//移入，根据选择显示评分效果
            span.onmouseout=function(){ showStar();};		//移除，更新评分
            span.onclick=function(){ setStar(this);};		//单击，添加/修改评分
         }
         else
         {
            span.title="单击可获取最新评分";
            span.setAttribute("n",(i+1));
            span.onclick=function(){ setStar(0);};		//刷新评分
         }
         span.innerText="☆";
         span.style.color="yellow";
         dstar.appendChild(span);
      }
      d.appendChild(dstar);

      var dinfo=document.createElement("DIV");		//在这里动态添加跑马灯
      dinfo.style="position: absolute;width:100px;top:31px;height:14px;font-size:12px;z-index:9";
      dinfo.id="RATEINFO";

      d.appendChild(dinfo);

      o[0].appendChild(d);
   }
}

//选择评分
function chooseStar(o)
{
   var n=o.getAttribute("n");
   //恢复无着色状态
   for(var i=1;i<=5;i++)
   {
      var s=document.getElementById("star"+i);
      s.style.color="yellow";
      s.style.background="";
   }

   //给星星着色
   for(var i=1;i<=n;i++)
   {
      var s=document.getElementById("star"+i);
      s.style.color="red";
      s.style.background="yellow";
   }
}

//鼠标移开后更新星级
function showStar()
{
   for(var i=1;i<=5;i++)			//恢复无着色状态
   {
      var s=document.getElementById("star"+i);
      s.style.color="yellow";
      s.style.background="";
   }

   nStar=nStar>5?5:nStar;			//给背景着色，控制范围
   nStar=nStar<0?0:nStar;
   document.getElementById("star_indicator").style.width=nStar==0?"0px":((nStar*20+1)+"px");
}

//设置评分
function setStar(o)
{
   if(strSelectedFilename=='')//当前处于新建状态，没有打开已存作品。
   {
      document.getElementById("STARS").style.display="none";
      if(typeof o =="object") newInfo("请先打开要打分的作品。");
      return;
   }
   if(typeof o == "object") nStar=o.getAttribute("n");
   else nStar=o;

   for(var i=0;i<5;i++)						//更新学生端打分界面功能
   {
      var span=document.getElementById("star"+(i+1));
      if(admin==1 || nFileType==1)
      {
         span.title="给"+(i+1)+"分";
         span.onmouseover=function(){ chooseStar(this) };	//移入，根据选择显示评分效果
         span.onmouseout=function() { showStar();      };	//移除，更新评分
         span.onclick=function()    { setStar(this);   };	//单击，添加/修改评分
      }
      else
      {
         span.title="单击可获取最新评分";
         span.onmouseover=function(){};		//移入，根据选择显示评分效果
         span.onmouseout=function(){};		//移除，更新评分
         span.onclick=function(){ setStar(0);};	//刷新评分
      }
   }

   document.getElementById("STARS").style.display="block";
   $.post("./CM/setScore.php?t=" + Math.random(),
   {
      "UID": uid ,
      "CID": classid,
      "PATH": strSelectedFilename,
      "SCORE":nStar,			//评分
      "DATE":folder,
      "TYPE":nFileType
   },function (data) 
   {
      if(data=="") return;
      var jsonData=null;
      try{
         jsonData=JSON.parse(data);
      }catch(e){}

      if(jsonData==null || JSON.stringify(jsonData)=="{}") nStar=-1;//return;
      else
         nStar=jsonData["RATE"]!=''?jsonData["RATE"]:0;
      showStar();
      document.getElementById("RATEINFO").innerHTML="";
      if(nFileType==0)
      {
         var dmarquee=document.createElement("MARQUEE");
         dmarquee.id="RINFO";
         dmarquee.width="100px";
         dmarquee.height="16px";
         dmarquee.direction="left";
         dmarquee.setAttribute("scrollAmount","1");
         dmarquee.innerHTML=strTeacher+jsonData["INFO"];
         document.getElementById("RATEINFO").appendChild(dmarquee);
      }
      else
      {
         var dmarquee=document.createElement("MARQUEE");
         dmarquee.id="RINFO";
         dmarquee.width="100px";
         dmarquee.height="16px";
         dmarquee.direction="up";
         dmarquee.setAttribute("scrollAmount","1");
         dmarquee.innerHTML=jsonData["INFO"];
         document.getElementById("RATEINFO").appendChild(dmarquee);
      }
      if(nStar==0) document.getElementById("RINFO").stop();//未打分，或0分，就停止滚动。
   });
}




//设置代码标签中类C语言显示开关信息
//切换标签时更新图片信息。
function setCodeTabInfo(nIndex)
{
   var o=document.getElementsByClassName("react-tabs_react-tabs__tab-list_17Wee gui_tab-list_87TYM");
   if(o[0]!=undefined)
   {
      if(nIndex==0)	//接下来要显示的是代码标签
      {
         if(o[0].children[0].children[0].src.indexOf("code.gif")>0)//已显示代码窗口
         {
            o[0].children[0].children[0].title="隐藏C代码视图";
         }
         else
         {
            o[0].children[0].children[0].title="打开C代码视图";
         }

         o[0].children[0].children[0].onclick=function()		//给图片添加切换代码窗口的操作
         {
            if(o[0].children[0].getAttribute("aria-selected")=="true")	//已选中状态
            {
   　　        if(o[0].children[0].children[0].src.indexOf(".svg")>0)	//当前非代码显示状态
               {
                  o[0].children[0].children[0].src="./img/code.gif";
                  o[0].children[0].children[0].title="隐藏C代码视图";
                  showCode();
               }
               else							//代码显示状态
               {
                  o[0].children[0].children[0].src="./img/code.svg";
                  o[0].children[0].children[0].title="打开C代码视图";
                  hideCode();
               }
            }
         };
      }
      else		//当前是造型/声音标签
      {
         if(o[0].children[0].children[0].src.indexOf("code.gif")>0)	//已显示代码窗口
         {
            o[0].children[0].children[0].title="切换到代码视图";
         }
         else
         {
            o[0].children[0].children[0].title="";
         }
      }
   }
}


//显示类C代码编辑器

var handle = null;
var content =null;
var isResizing=true;

function insertCodeEditor()
{
   bCode=true;
   var nPlace=0;

   //var o1=document.getElementById("react-tabs-0");
   var o=document.getElementById("react-tabs-1");

   if(o.children[nPlace].id!="CODEVIEW")//判断CodeViewer是否已经显示
   {
      var children=Array();
      for(i=0;i<o.children.length;i++)
      {
         children.push(o.children[i]);
      }
      var d=document.createElement("div");
      d.id="CODEVIEW"
      d.style="display: block;transform: translate(60px, 0px);opacity: 1;right:60px;/*right:47px;width: 276px;*/min-width: 276px;height:100%;background:hsla(215, 100%, 65%, 1);position: absolute;z-index: 100;";
      listTEXTCODING=d;

      handle=document.createElement("div");
      handle.className="left-resize-handle";
      handle.title="左右拖动可调整大小。操作的时候需要慢一点。";
      handle.addEventListener('mousedown', function(e) {
         isResizing = true;
         document.body.style.cursor = 'col-resize';
         document.body.style.userSelect = 'none';
                
         // 记录初始宽度
         const startWidth = parseInt(document.defaultView.getComputedStyle(content).width, 10);
         const startX = e.clientX;
                
         function onMouseMove(e) {
            if (!isResizing) return;
                    
               // 计算宽度变化
            const width = startWidth - (e.clientX - startX);
                    
            // 设置最小宽度限制
            if (width > 150) {
               content.style.width = width + 'px';
            }
         }

         function onMouseEnter() {
            handle.style.width="20px";
            handle.style.left="-20px";
         }
 
         function onMouseUp() {
            handle.style.width="6px";
            handle.style.left="0px";
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
         }
        
         handle.addEventListener('mouseenter', onMouseEnter);
         document.addEventListener('mousemove', onMouseMove);
         document.addEventListener('mouseup', onMouseUp);
      });
            
      // 防止拖动时选中文本
      handle.addEventListener('dragstart', function(e) {
         e.preventDefault();
      });


      d.appendChild(handle);

      var frame=document.createElement("iframe");
      frame.className="left-resize-content";
      frame.id="CV";
      frame.name="CV";
      frame.src="./ScratchToText/codeViewer.html";
      frame.style="position: relative; padding:0px;min-width:270px; width: 270px;height:100%;border:none";
      frame.setAttribute("scrolling","no");

      frame.addEventListener("mouseover",function(e){
                
         function onMouseOver() {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.removeEventListener('mouseover', onMouseOver);
         }

         document.addEventListener('mouseover', onMouseOver);
      });

      d.appendChild(frame);

      content = frame;

      //var db=document.createElement("div");
      //db.id="buttons"
      //db.style="display: grid;transform: translate(60px, 0px);opacity: 1;left: -60px;width: 100%;height: 60px;position: absolute;z-index: 100;";
      //d.appendChild(db);


      for(i=0;i<children.length;i++)
      {
         if(i==nPlace)
            o.appendChild(d);			//插入编辑器
            o.appendChild(children[i]);
      }

      var inX = setInterval(function()		//每隔500ms检测CodeViewer页面是否已经展开。
      {
         if(bCVLoaded)
         {
            clearInterval(inX);
            getCode();
         }
      },500);
   }

/*
   //var o=document.getElementsByClassName("react-tabs_react-tabs__tab-panel_3p4DW gui_tab-panel_22sLx react-tabs_react-tabs__tab-panel--selected_18BFr gui_is-selected_sHAiu");


   var o=document.getElementsByClassName("injectionDiv");


   if(o[0]!=undefined)
//   if(o[0].children.length==3)//判断CodeViewer是否已经显示
   if(o[0].children[5].id!="CODEVIEW")//判断CodeViewer是否已经显示
   {
      var children=Array();
      for(i=0;i<o[0].children.length;i++)
      {
         children.push(o[0].children[i]);
      }
      //o[0].innerHTML="";

      var d=document.createElement("div");
      d.id="CODEVIEW"
      d.style="display: block;transform: translate(60px, 0px);opacity: 1;right:47px;width: 310px;height:100%;background:hsla(215, 100%, 65%, 1);position: absolute;z-index: 100;";

      var frame=document.createElement("iframe");
      frame.id="CV";
      frame.name="CV";
      frame.src="./ScratchToText/codeViewer.html";
      frame.style="position: relative; padding: 2px; width: 310px;height:100%;";      
      d.appendChild(frame);

      var db=document.createElement("div");
      db.id="buttons"
      db.style="display: grid;transform: translate(60px, 0px);opacity: 1;left: -60px;width: 310px;height: 60px;position: absolute;z-index: 100;";

      //db.appendChild(b1);
      d.appendChild(db);


      for(i=0;i<children.length;i++)
      {
         //children.push(o[0].children[i]);
if(i==5)
      o[0].appendChild(d);			//插入编辑器

         o[0].appendChild(children[i]);
      }
      //o[0].appendChild(children[0]);
      //o[0].appendChild(children[1]);
      //o[0].appendChild(children[2]);
      //o[0].appendChild(children[3]);
      //o[0].appendChild(children[4]);
      //o[0].appendChild(children[5]);
      //o[0].appendChild(children[6]);
      //o[0].appendChild(children[7]);
   }
   else
   {
      document.getElementById("CODEVIEW").style.display="block";

   }

   //var oExtentionButton=document.getElementsByClassName("gui_extension-button-container_b4rCs box_box_2jjDp");
   //oExtentionButton[0].style.position="absolute";
   //oExtentionButton[0].style.left="310px";

   var inX = setInterval(function()		//每隔500ms检测CodeViewer页面是否已经展开。
   {
      if(bCVLoaded)
      {
         clearInterval(inX);
         getCode();
      }
   },500);

*/
}


function showCode1()
{
   bCode=true;
   var o=document.getElementsByClassName("injectionDiv");
   if(o[0]!=undefined)
   if(o[0].children.length==8)//判断CodeViewer是否已经显示
   {
      var children=Array();
      for(i=0;i<o[0].children.length;i++)
      {
         children.push(o[0].children[i]);
      }
      o[0].innerHTML="";

      var d=document.createElement("div");
      d.id="CODEVIEW"
      d.style="display: block;transform: translate(60px, 0px);opacity: 1;left: -60px;width: 310px;height: "+children[4].getAttribute("height")+"px;background:hsla(215, 100%, 65%, 1);position: absolute;z-index: 100;";

      listTEXTCODING=d;//document.getElementById("CODEVIEW");

      var frame=document.createElement("iframe");
      frame.id="CV";
      frame.name="CV";
      frame.src="./ScratchToText/codeViewer.html";
      frame.style="position: relative; padding: 2px; width: 310px;height:"+((parseInt(children[4].getAttribute("height"))-60) + "px");      
      d.appendChild(frame);

      var db=document.createElement("div");
      db.id="buttons"
      db.style="display: grid;transform: translate(60px, 0px);opacity: 1;left: -60px;width: 260px;height: 60px;position: absolute;z-index: 100;";

      var b1=document.createElement("input");
      b1.type="button";
      b1.value="更新";
      b1.style="height: 60px;top: -4px;position: relative;";
      b1.onclick=function(){getBlock();};

      db.appendChild(b1);
      d.appendChild(db);

      o[0].appendChild(children[0]);
      o[0].appendChild(children[1]);
      o[0].appendChild(children[2]);
      o[0].appendChild(children[3]);
      o[0].appendChild(children[4]);
      o[0].appendChild(d);			//插入编辑器
      o[0].appendChild(children[5]);
      o[0].appendChild(children[6]);
      o[0].appendChild(children[7]);
   }
   //else
   //{
   //   document.getElementById("CODEVIEW").style.visibility="visible";
   //}

   var inX = setInterval(function()		//每隔500ms检测CodeViewer页面是否已经展开。
   {
      if(bCVLoaded)
      {
         clearInterval(inX);
         getCode();
      }
   },500);
}

//隐藏类C代码编辑器
function hideCode()
{
   bCode=false;
   document.getElementById("CODEVIEW").style.display="none";
   //var oExtentionButton=document.getElementsByClassName("gui_extension-button-container_b4rCs box_box_2jjDp");
   //oExtentionButton[0].style.position="absolute";
   //oExtentionButton[0].style.left="0px";
}




/////////////////////////////////////////////////////////////类C编辑器：积木与类C代码互转
var bCVLoaded=false;

//类C代码编辑器UI注入
function injectCodeEditor()
{
   var o=document.getElementsByClassName("react-tabs_react-tabs__tab-list_17Wee gui_tab-list_87TYM");	//类C编辑器入口
   if(o[0]!=undefined)
   {
      o[0].children[0].children[0].title="打开C代码视图";
      o[0].children[0].children[0].onclick=function()
      {
         if(o[0].children[0].getAttribute("aria-selected")=="true")
         {
   　　     if(o[0].children[0].children[0].src.indexOf(".svg")>0)
            {
               o[0].children[0].children[0].src="./img/code.gif";
               o[0].children[0].children[0].title="隐藏C代码视图";
               showCode();
            }
            else
            {
               o[0].children[0].children[0].src="./img/code.svg";
               o[0].children[0].children[0].title="打开C代码视图";
               hideCode();
            }
         }
      };
   }
}


//
function trimChar(str, charToRemove) {
  if (str.startsWith(charToRemove)) {
    str = str.substring(charToRemove.length);
  }
  if (str.endsWith(charToRemove)) {
    str = str.substring(0, str.length - charToRemove.length);
  }
  return str;
}





//初始化顶部菜单界面
//动态添加菜单数据
//此段代码，必须在project.bundle.js前定义

//顶部菜单注入
function injectCM()
{
   if(strCurrentUser=="舞台")  return;		//“同台竞技”页面也需要这个文件，但不需要添加下面的这些菜单项，所以屏蔽。

   var TopMenu=document.getElementsByClassName("menu-bar_main-menu_3wjWH");			//顶部左侧管理菜单
   var Menu=Array();
   if(TopMenu[0]!=undefined)
   {
      var nHeight=TopMenu[0].clientHeight;
      for(var i=0;i<TopMenu[0].children.length;i++)		//先获取当前所有菜单
      {
         Menu.push(TopMenu[0].children[i]);
      }

      TopMenu[0].innerHTML="";
      TopMenu[0].appendChild(Menu[0]);				//ScratchLOGO，语言选择器，文件菜单，编辑菜单
      TopMenu[0].appendChild(Menu[1]);				//分割线

      var d=document.createElement("div");			//小白板菜单
      d.id="taskmenu";
      d.className="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh";
      d.style="position:relative; display: inline-block; top: 0px; width: 48px; height: "+nHeight+"px; line-height: "+nHeight+"px;z-index:999;background-color:"+ ((taskshow)?"#DC5712":"hsla(215, 100%, 65%, 1)")+";text-align: center; ";
      var s=document.createElement("span");
      s.id="moretask";
      s.setAttribute("name","moretask");
      s.style="position:absolute;left:10px;";
      s.innerText="小白板";
      d.appendChild(s);
      d.onclick=function(){showmenu(1);};
      d.onmouseover=function(){this.style.backgroundColor="#DC5712";};
      d.onmouseout=function(){ if(!taskshow) this.style.backgroundColor="hsla(215, 100%, 65%, 1)";};
      TopMenu[0].appendChild(d);

      var d=document.createElement("div");			//作品管理菜单
      d.id="filemenu";
      d.className="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh";
      d.style="position:relative; display: inline-block; top: 0px; width: 65px; height: "+nHeight+"px; line-height: "+nHeight+"px;z-index:999;background-color:"+ ((fileshow)?"#E58308":"hsla(215, 100%, 65%, 1)")+";text-align: center;";
      var s=document.createElement("span");
      s.id="morefiles";
      s.setAttribute("name","morefiles");
      s.style="position:absolute;left:10px;";
      s.innerText="作品管理";
      d.appendChild(s);
      d.onclick=function(){showmenu(2);};
      d.onmouseover=function(){this.style.backgroundColor="#E58308";};
      d.onmouseout=function(){ if(!fileshow) this.style.backgroundColor="hsla(215, 100%, 65%, 1)";};
      TopMenu[0].appendChild(d);

      var d=document.createElement("div");			//社区菜单
      d.id="talkmenu";
      d.className="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh";
      d.style="position:relative; display: inline-block; top: 0px; width: 38px; height: "+nHeight+"px; line-height: "+nHeight+"px;z-index:999;background-color: hsla(215, 100%, 65%, 1);text-align: center;";
      var s=document.createElement("span");
      s.id="moremsg";
      s.setAttribute("name","moremsg");
      s.style="position:absolute;left:10px;";
      s.innerText="社区";
      d.appendChild(s);
      d.onclick=function(){showmenu(3);};
      d.onmouseover=function(){this.style.backgroundColor="#F4D000";};
      d.onmouseout=function(){ if(!talkshow) this.style.backgroundColor="hsla(215, 100%, 65%, 1)";};
      TopMenu[0].appendChild(d);

      var d=document.createElement("div");			//佳作欣赏菜单
      d.id="labmenu";
      d.className="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh";
      d.style="position:relative; display: inline-block; top: 0px; width: 60px; height: "+nHeight+"px;line-height: "+nHeight+"px; z-index:999;background-color: hsla(215, 100%, 65%, 1); text-align: center;";
      var s=document.createElement("span");
      s.id="moretocome";
      s.setAttribute("name","moretocome");
      s.style="position:absolute;left:10px;";
      s.innerText="佳作欣赏";
      d.appendChild(s);
      d.onclick=function(){showmenu(4);};
      d.onmouseover=function(){this.style.backgroundColor="orangered";};
      d.onmouseout=function(){ if(!labshow) this.style.backgroundColor="hsla(215, 100%, 65%, 1)";};
      TopMenu[0].appendChild(d);

      if(admin)//管理员才有管理工具				//上课管理菜单
      {
         var d=document.createElement("div");
         d.id="ctrlmenu";
         d.className="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh";
         d.style="position:relative; display: inline-block; top: 0px; width: 60px; height: "+nHeight+"px;line-height: "+nHeight+"px; z-index:999;background-color: hsla(215, 100%, 65%, 1); text-align: center;";
         var s=document.createElement("span");
         s.id="morectrl";
         s.setAttribute("name","morectrl");
         s.style="position:absolute;left:10px;";
         s.innerText="上课管理";
         d.appendChild(s);
         d.onclick=function(){showControlPanel();};
         d.onmouseover=function(){this.style.backgroundColor="black";};
         d.onmouseout=function(){ if(!bControl) this.style.backgroundColor="hsla(215, 100%, 65%, 1)";};
         TopMenu[0].appendChild(d);
      }

      var d=document.createElement("div");			//互帮互助菜单
      d.id="helpmenu";
      d.className="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh";
      d.style="position:relative; display: inline-block; top: 0px; width: 65px; height: "+nHeight+"px; line-height: "+nHeight+"px;z-index:999;background-color: hsla(215, 100%, 65%, 1);text-align: center;display:"+(helpcontrol==1?"block-inline":"none");
      var s=document.createElement("span");
      s.id="moretohelp";
      s.setAttribute("name","moretohelp");
      s.style="position:absolute;left:10px;";
      s.innerText="互帮互助";
      d.appendChild(s);
      d.onclick=function(){showHelpMenu();};
      d.onmouseover=function(){this.style.backgroundColor="firebrick";};
      d.onmouseout=function(){if(!bHelp) this.style.backgroundColor="hsla(215, 100%, 65%, 1)";};
      TopMenu[0].appendChild(d);

      var d=document.createElement("div");			//同组分享菜单
      d.id="sharemenu";
      d.className="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh";
      d.style="position:relative; display: inline-block; top: 0px; width: 65px; height: "+nHeight+"px; line-height: "+nHeight+"px;z-index:999;background-color: hsla(215, 100%, 65%, 1);text-align:  center;display:"+(sharecontrol==1?"block-inline":"none");
      var s=document.createElement("span");
      s.id="moretoshare";
      s.setAttribute("name","moretoshare");
      s.style="position:absolute;left:10px;";
      s.innerText="同组分享";
      d.appendChild(s);
      d.onclick=function(){showShareMenu();};
      d.onmouseover=function(){this.style.backgroundColor="mediumvioletred";};
      d.onmouseout=function(){ if(!bShare) this.style.backgroundColor="hsla(215, 100%, 65%, 1)";};
      TopMenu[0].appendChild(d);

/*

      var d=document.createElement("div");			//小组管理
      d.id="groupcontrolmenu";
      d.className="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh";
      d.style="position:relative; display: inline-block; top: 0px; width: 65px; height: "+nHeight+"px; line-height: "+nHeight+"px;z-index:999;background-color: hsla(215, 100%, 65%, 1);text-align:  center;display:"+(groupcontrol==1?"block-inline":"none");
      var s=document.createElement("span");
      s.id="moretoshare";
      s.setAttribute("name","moretoshare");
      s.style="position:absolute;left:10px;";
      s.innerText="小组管理";
      d.appendChild(s);
      d.onclick=function(){showShareMenu();};
      d.onmouseover=function(){this.style.backgroundColor="mediumvioletred";};
      d.onmouseout=function(){ if(!bShare) this.style.backgroundColor="hsla(215, 100%, 65%, 1)";};
      TopMenu[0].appendChild(d);

*/

      var d=document.createElement("div");			//学习自评
      d.id="SEVMENU";
      d.className="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh";
      d.style="position:relative; top: 0px; width: 65px; height: "+nHeight+"px; line-height: "+nHeight+"px;z-index:999;background-color: hsla(215, 100%, 65%, 1);text-align:  center;display:"+(sevcontrol==1?"block-inline":"none");
      var s=document.createElement("span");
      s.id="sevInfo";
      s.style="position:absolute;left:10px;";
      s.innerText="学习自评";
      d.appendChild(s);
      d.onclick=function(){showSelfEvaluationMenu();};
      d.onmouseover=function(){this.style.backgroundColor="mediumvioletred";};
      d.onmouseout=function(){ if(!bSEV) this.style.backgroundColor="hsla(215, 100%, 65%, 1)";};
      TopMenu[0].appendChild(d);

   }

   var UserInfo=document.getElementsByClassName("menu-bar_account-info-group_MeJZP");		//顶部右侧关于菜单
   if(UserInfo[0]!=undefined)
   {
      var nHeight=UserInfo[0].clientHeight;
      UserInfo[0].innerHTML="";					//清空旧数据

      var dname=document.createElement("div");
      dname.style="position:relative; display: inline-block; top: 0px; width: 40px; height: "+nHeight+"px; line-height: "+nHeight+"px;z-index:999;background-color: hsla(215, 100%, 65%, 1);text-align: center;";
      var sname=document.createElement("span");
      //sname.title="如果你感觉跟不上进度，可以在这里悄悄地给老师发个消息。";
      //sname.onclick=function(){ 
      //   bSelfShow=true;
      //   var msg = {'content': '["MSG","老师，我有点跟不上了！","'+strCurrentUser+'"]' , 'type': 'user','to':strTeacher};

      //   sendMsg(msg);
      //};
      sname.style="position:absolute;left:0px;";
      sname.innerText=strCurrentUser;
      dname.appendChild(sname);
      UserInfo[0].appendChild(dname);

      var d=document.createElement("div");			//关于菜单
      d.id="aboutmenu";
      d.className="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh";
      d.style="position:relative; display: inline-block; top: 0px; width: 130px; height: "+nHeight+"px; line-height: "+nHeight+"px;z-index:999;background-color: hsla(215, 100%, 65%, 1);text-align: center;";
      var s=document.createElement("span");
      s.id="aboutmenu";
      s.setAttribute("name","aboutmenu");
      s.style="position:absolute;left:10px;";
      s.innerText="关于Scratch3.0教学平台";
      d.appendChild(s);

      var dmenu=document.createElement("div");			//菜单选项窗口
      dmenu.id="about";
      dmenu.style="position: absolute;visibility: hidden;top: "+nHeight+"px;left: 0px;";

      var ul=document.createElement("ul");
      ul.className="menu_menu_3k7QT menu_right_3PQ4S";

      var li1=document.createElement("li");			//最后更新时间
      li1.className="menu_menu-item_3EwYA";
      li1.style="display:block; font-size: 14px; position: relative;cursor: pointer;text-align: left;";
      li1.innerHTML="内核最后更新时间：<br>"+strLastUpdated;
      ul.appendChild(li1);

      var li2=document.createElement("li");			//相关链接
      li2.className="menu_menu-item_3EwYA";
      li2.style="display:block; font-size: 14px; position: relative;text-align: left;";
      li2.innerText="相关开源项目";
      li2.onclick=function(){window.open('https://www.github.com/LuciferStarSS','_blank','height=500, width=800, top=100, left=100');};
      ul.appendChild(li2);

      var li3=document.createElement("li");			//版权声明
      li3.className="menu_menu-item_3EwYA";
      li3.style="display:block; font-size: 14px; position: relative;cursor: pointer;text-align: left;";
      li3.innerHTML="版权声明";
      li3.onclick=function(){newInfo("本项目中所使用的Scratch3.0编辑器，源于MIT的开源项目“scratch-www”，因此本项目也遵循原项目的开源协议。\r\n教学平台作者QQ：79733470",false);};
      ul.appendChild(li3);

      dmenu.appendChild(ul);
      d.appendChild(dmenu);
      
      d.onmouseover=function(){ showAbout();};//showAboutMenu();};
      //d.onmouseover=function(){this.style.backgroundColor="black";};
      d.onmouseout=function(){ hideAbout();}// if(!bAbout) this.style.backgroundColor="hsla(215, 100%, 65%, 1)";};
      UserInfo[0].appendChild(d);
   }


   //var o=document.getElementById("react-tabs-1");
   //var o=document.getElementsByClassname("stage_stage_1fD7k box_box_2jjDp");

   var o=document.getElementsByClassName("stage_stage_1fD7k box_box_2jjDp");

   var code_div=o[0];//document.getElementById("react-tabs-1");
   if(code_div.children.length==3)
   {
      var div=document.createElement("div");
      div.id="infolists";
      div.style="position: absolute; top: 0px;left:0px;width:480px;";
      div.innerHTML="<ul id='infolist' class='info_list_ul'></ul>";
      code_div.appendChild(div);
   }
}

function insertMenu()
{
   //injectRecorder();				//在舞台上方插入视频录制按钮，后来又追加了评分界面。
   //injectTopMenu();
}

////////////////////////////主界面
//所有在原有界面上的修改，入口都集中到这里
function initSelfDefinedUI()
{
   injectCM();			//上课管理
   injectCODEEDITOR();		//类C编辑器
   injectDIAGRAM();		//小图板
   injectPICKUP();		//暂存盘
   injectRecorder();		//舞台录制按钮
   //injectRatingSystem();	//评价系统
}
