<?php
   header("Pragma: no-cache");
   header("Cache-Control: no-cache");
   error_reporting(0);
   include("../include/config.inc.php");
   include("../include/module.inc.php");//模块：菜单、小白板、代码编辑器、流程图

   //var_dump(defined('SCRATCHTOTEXT'));
   //print_r($_COOKIE);
   //exit;
   setCookie("scratchlanguage","zh-cn",time()+3600,"./");
   //print_r($_COOKIE);
   $x=isset($_GET['x'])?$_GET['x']:"";
   $mip=isset($_GET['i'])?$_GET['i']:"";
   $username=isset($_COOKIE['USERNAME'])?$_COOKIE['USERNAME']:"无名氏";
   $uid  =isset($_COOKIE['SNAME']) ? intval($_COOKIE['SNAME']):0;

   $xx=isset($_GET['xx'])?$_GET['xx']:"";		//强制打开，建立缓存。
   if($xx=="" && $username=="无名氏") header("Location: ".$site_path);

   $bgcontrol  =isset($_COOKIE['BG']) ? intval($_COOKIE['BG']):0;			//BackGround Shielder
   $helpcontrol=isset($_COOKIE['HELP'])?intval($_COOKIE['HELP']):0;		//Help menu
   $sharecontrol=isset($_COOKIE['SHARE'])?intval($_COOKIE['SHARE']):0;		//Share menu
   $bdcontrol  =isset($_COOKIE['BD']) ? intval($_COOKIE['BD']):0;			//Background Designer
   $charcontrol=isset($_COOKIE['CHAR'])?intval($_COOKIE['CHAR']):0;		//New Character
   $groupcontrol  =isset($_COOKIE['GROUP']) ? intval($_COOKIE['GROUP']):0;		//分组控制
   $sevcontrol=isset($_COOKIE['SEVC']) ? intval($_COOKIE['SEVC']):0;		//自评量表


   $week=isset($_COOKIE["W"])?$_COOKIE["W"]:date("oW");		//一年中第几周
   $day=isset($_COOKIE["D"])?$_COOKIE["D"]:date("N");		//一周中第几天
   $lesson=isset($_COOKIE["N"])?$_COOKIE["N"]:0;			//一天第几节课
   $classid=isset($_COOKIE["CLASSID"])?intval($_COOKIE["CLASSID"]):"";	//一天第几节课

   $folder=isset($_COOKIE["DD"])?$_COOKIE["DD"]:'';		//一年中第几周
   $classid=isset($_COOKIE["CLASSID"])?intval($_COOKIE["CLASSID"]):"";	//一天第几节课

   if(isset($_GET['c'])) 
   {
      $classid=$_GET['c'];
      //var_dump($_GET);
   }

   //echo $classid;
   if($classid!="")
      $gradeid=$grades[$classid-1];
   else
      $gradeid=isset($_COOKIE['GRADEID'])?intval($_COOKIE['GRADEID']):5;

   //if(!$gradeid) exit("班级信息错误，请重新登陆。");
   $ip=getenv("REMOTE_ADDR");

   //print_r($_COOKIE);
   //echo $classid;
   //exit;
   if($mip) $ip=$mip;

   if($ip=="::1") $ip="127.0.0.1";
   //$ip="192.168.10.112";
   //$ip="192.168.3.17";
   $admin=0;
   $room=0;			//教室编号直接从IP获取
   if(isset($teacher_room[$ip]))	//教师访问
   {
      $room=$teacher_room[$ip][1];
      $username=$teacher_room[$ip][0];
      $admin=1;
   }
   else				//学生访问
   {
      $ips=explode('.',$ip);				//拆分IP，根据IP段确定计算机教室
      if(isset($student_room[$ips[2]]))
      {
         $room=$student_room[$ips[2]][0];
      }
      $username=sprintf("%02d_%s",$ips[3]-$student_room[$ips[2]][1],$username);
   }

   if($x==1)
   {
      $admin=0;
      $username="0".rand(1,9)."_test";
   }
   $filenamepath= "../data/task/".$room."_".$gradeid."_task.inc.php";
   $projname=@file_get_contents($filenamepath);
   $projname=$projname==""?"未命名":$projname;
   setCookie("NEWPROJNAME",$projname,time()+3600,$site_path);
?><!DOCTYPE html><!--[if lt IE 9 ]> <html class="ie8"> <![endif]-->
<!--[if IE 9 ]> <html class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><html style="overflow: verticle;" lang="zh-cn"> <!--<![endif]-->
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Prevent mobile Safari from making phone numbers -->
    <meta name="format-detection" content="telephone=no">

    <!-- Favicon & CSS normalize -->
    <link rel="stylesheet" href="./css/lib/normalize.min.css" />

    <style>
      .gui {
        position: absolute;
        top: 0;
        margin: 0;
        width: 100%;
        height: 100%;
        min-width: 1024px;
        min-height: 640px;
      }
    </style>
    <!-- Polyfills -->
    <script src="./js/polyfill.min.js"></script>

    <script src=./js/jquery.js></script>

    <script>
       var stepshow = false;
       var talkshow = false;
       var fileshow = false;
       var taskshow = true;
       var labshow  = false;
       var bFullScreenStatus = false;
       var strInvited='';


       var admin=<?php echo $admin;?>;									//管理员标识
       var uid=<?php echo $uid;?>;									//管理员标识

       //修改过的Scratch3.0内核里必须要用到这些变量
       var oVMM		= null;			//Virtual Machine Manager
       var oVIEW	= null;			//Preview								//Scratch3.0视图控制句柄
       var oVMLISTENER	= null;
       var oBLOCKS	= null;			//Blocks
       var oBC		= null;			//Blocks
       var oB		= null;			//Blocks
       var oBlocklyX	= null;
       var oGoog	= null;
       var bCleanClone  = false;		//停止按钮将不会清理克隆体，点击绿旗才可以。

       //自制扩展里需要
       var trand=Math.random();					//翻译时间戳
       var arrUserList=Array();					//当前师生列表
       var bChattingRoom_NEWMESSAGE=false;			//聊天室/网络工具控制
       var arrChattingRoom_MSGLIST=Array();			//接收到的消息列表

       var tdata=null;
       var oSB3FILE=null;
       var bCODECHANGED=false;


       //MENU里需要
       var helpcontrol=<?php echo $helpcontrol;?>;		//初始化时控制互帮互助菜单的显示
       var sharecontrol=<?php echo $sharecontrol?>;		//初始化时控制同组分享菜单的显示
       var sevcontrol=<?php echo $sevcontrol?>;		//初始化时控制同组分享菜单的显示
       var groupcontrol=<?php echo $groupcontrol?>;		//初始化时控制同组分享菜单的显示

       var dataCollecting=false;				//教师端是否接收
       var bREPORTING=true;					//学生端是否发送

       var arrSavedTargetsID=Array();				//用于分享的角色数据的ID，防止多次保存。
       var arrSpritesSent=new Array();				//分享过的角色，再有修改，需要修改服务器上保存的文件名。主要是保持分享后的脚本数据不会被修改。

       var bInfoStatus=Array(false,false,false,false);		//角色，背景，互帮互助，同组分享这四个是定时刷的，要防止多次弹newInfo
       var room=<?php echo $room;?>;
       var strTeacher="<?php echo $teacher_name[$room];?>";							//当前教室的教室名字
       var strCurrentUser="<?php echo (isset($_COOKIE['USERNAME'])?$_COOKIE['USERNAME']:"NONE");?>";		//学生名
       var saved=0;
       var classid='<?php echo isset($_GET['c'])?intval($_GET['c']):$classid;?>';				//当前班级ID
       var folder="<?php echo $folder;?>";												//作业保存的文件夹（日期）
       var filename="<?php echo $projname;?>";									//作业文件名
       var gradeid=<?php echo $gradeid;?>;									//年级ID
       var lastID= "<?php echo isset($_COOKIE['QuizID'])?$_COOKIE['QuizID']:'';?>";				//速问速答最后一题ID
       var nCurrentGroup=<?php echo $groupcontrol;?>;								//当前分组
       var bGroup=false;   											//分组状态（3或4人一组）
       var bWaiting=<?php echo ($admin==1)?"false":($bgcontrol==1?"true":"false");?>;				//屏蔽状态控制

       //Scratch3.0内核需要调用这些接口。
       //当处于最简模式时，由于没有引入control.js，回导致回调出错，所以需要在这里定义一下。
       function scratchStatus()      	{  }		//Scratch状态回调
       function checkScreenStatus()  	{  }		//全屏播放时消息响应
       function getCode()		{  }		//ScratchToText未加载时生效
       function loadPICKUP()		{  }		//暂存盘未加载时生效
       function scratch_pickupStage()	{  }		//暂存盘未加载时生效
       function scratch_call()       	{  }		//暂存盘未加载时生效
       //function loadBDAttach()		{  }		//小白板未加载时生效
       function updateBOARD()		{  }
       function injectCM()		{  }		//上课管理
       function injectCODEEDITOR()	{  }		//代码编辑器
       function injectDIAGRAM()		{  }		//小图板
       function injectPICKUP()		{  }		//暂存盘
       function convertToC()		{  }		//转文本

    </script>
  </head>
  <body style="background-color: hsla(215, 100%, 65%, 1);">
<?php
   if(defined('CM'))					//上课管理
   {
      include "./CM/templete/main.tpl.php";
?>
    <!-- Scratch3.0 HTML5 Control Scripts -->
    <script src=./js/control.js></script>
    <script src=./js/drag.js></script>
<?php
   }
?>
    <!--Scratch3.0 应用主窗口-->
    <div id="app"></div>
    <!--Scratch3.0 HTML5 核心数据-->
    <script src="./js/projects.intl.js"></script><!-- Translate title element -->
    <script src="./js/common.bundle.js"></script><!-- Vendor & Initialize (Session & Localization) -->
    <script src="./js/projects.bundle.js"></script><!-- Webpack -->
    <!--Scratch3.0 HTML5 核心数据-->
<?php
   if(defined('CM'))//上课管理需要依赖websocket，小白板并入上课管理组件中
   {
?>
    <script>
        document.getElementById("closeWB").style.visibility  ="visible";				//小白板窗口关闭按钮。当该窗口出现关闭按钮，就表示系统已经展开完毕。
        //document.getElementById("closetask").style.visibility="visible";				//任务窗口关闭按钮。任务窗口已经被小白板代替。

        if(admin)//教师需要先确认上课班级
        {
           if (fileshow == false && classid==0){ showfiles(); }
           document.getElementById("c").focus();
           newInfo("您正在授课的班级为：<?php echo ($classid!="" && isset($classname[$classid-1]))?($classname[$classid-1]."(".$week."周-星期".$day."-第".$lesson."节)"):"暂未选班级(".$week."周-星期".$day."-第".$lesson."节)";?>");
        }

        var obj = document.getElementById('drag');
           obj.addEventListener('touchmove', function(event) {
           if (event.targetTouches.length == 1) {
　　　     　 event.preventDefault();// 阻止浏览器默认事件，重要
              var touch = event.targetTouches[0];
              obj.parentElement.parentElement.parentElement.style.left = touch.pageX + 'px';
              obj.parentElement.parentElement.parentElement.style.top  = touch.pageY + 'px';
           }
        },{ passive: false});

    </script>
    <!-- 教学平台 Websocket -->
    <script src="./js/websocket.js"></script><!--上课管理常规控制-->
    <script src="./js/playsocket.js"></script><!--同台竞技投屏-->
    <script type="text/javascript">
        var uname = "<?php echo $username;?>";
        var strWebSocketServerURL="ws://<?php echo $WSSERVER;?>:<?php echo (8080+$room);?>";		//上课管理常规控制
        createWebSocket(strWebSocketServerURL);
        var wsPlay=null;
        var strWebSocketPlayURL="ws://<?php echo $WSSERVER;?>:<?php echo (8090+$room);?>";		//同台竞技投屏，不需要在此处开启。
        //initPlay(strWebSocketPlayURL,uname);
    </script>
<?php
      if(defined('SCRATCHTOTEXT')) include("./ScratchToText/templete/main.tpl.php");   		//代码编辑器
      if(defined('DIAGRAM')) 	include("./Diagram/templete/main.tpl.php");   			//流程图
      if(defined('PICKUP')) 	include("./Pickup/templete/main.tpl.php");   			//暂存盘
   }
?>

  </body>
</html>
