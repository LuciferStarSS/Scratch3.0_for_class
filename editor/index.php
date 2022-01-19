<?php
error_reporting(0);
include("../include/config.inc.php");

setCookie("scratchlanguage",'zh-cn',$site_path);
$x=isset($_GET['x'])?$_GET['x']:"";
$mip=isset($_GET['i'])?$_GET['i']:"";
$username=isset($_COOKIE['USERNAME'])?$_COOKIE['USERNAME']:"游客";

$xx=isset($_GET['xx'])?$_GET['xx']:"";		//强制打开，建立缓存。
if($xx=="" && $username=="游客") header("Location: ".$site_path);

$bgcontrol  =isset($_COOKIE['BG']) ? intval($_COOKIE['BG']):0;			//BackGround Shielder
$helpcontrol=isset($_COOKIE['HELP'])?intval($_COOKIE['HELP']):0;		//Help menu
$sharecontrol=isset($_COOKIE['SHARE'])?intval($_COOKIE['SHARE']):0;		//Share menu
$bdcontrol  =isset($_COOKIE['BD']) ? intval($_COOKIE['BD']):0;			//Background Designer
$charcontrol=isset($_COOKIE['CHAR'])?intval($_COOKIE['CHAR']):0;		//New Character
$groupcontrol  =isset($_COOKIE['GROUP']) ? intval($_COOKIE['GROUP']):0;

$week=isset($_COOKIE["W"])?$_COOKIE["W"]:date("oW");		//一年中第几周
$day=isset($_COOKIE["D"])?$_COOKIE["D"]:date("N");		//一周中第几天
$lesson=isset($_COOKIE["N"])?$_COOKIE["N"]:0;			//一天第几节课
$classid=isset($_COOKIE["CLASSID"])?intval($_COOKIE["CLASSID"]):"";	//一天第几节课

if($classid!="")
   $gradeid=$grades[$classid-1];
else
   $gradeid=isset($_COOKIE['GRADEID'])?intval($_COOKIE['GRADEID']):0;

//echo $gradeid;
$ip=getenv("REMOTE_ADDR");

if($mip) $ip=$mip;

if($ip=="::1") $ip="127.0.0.1";
//$ip="192.168.10.112";
//$ip="192.168.3.17";
$admin=0;
$room=0;			//教室编号直接从IP获取

if($classid==0 || $gradeid==0) $admin=1;
//else
//{
//   $username=sprintf("%02d_%s",$ips[3]-$student_room[$ips[2]][1],$username);
//}
/*
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
}
*/

if($x==1)
{
   $admin=0;
   $username="0".rand(1,9)."_test";
}
$filenamepath= "../include/".$room."_task.inc.php";
$projname=@file_get_contents($filenamepath);
setCookie("NEWPROJNAME",$projname,time()+3600,$site_path);
?><!DOCTYPE html>
<!--[if lt IE 9 ]> <html class="ie8"> <![endif]-->
<!--[if IE 9 ]> <html class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html> <!--<![endif]-->
   <head>
     <meta charset="UTF-8" />

     <meta http-equiv="x-ua-compatible" content="ie=edge">
     <meta name="viewport" content="width=device-width, initial-scale=1">

     <!-- Prevent mobile Safari from making phone numbers -->
     <meta name="format-detection" content="telephone=no">

     <!-- Favicon & CSS normalize -->
     <link rel="stylesheet" href="./css/lib/normalize.min.css" />

     <!-- Polyfills -->
     <script src="./js/polyfill.min.js"></script>
     <script>
        var admin=<?php echo $admin;?>;									//管理员标识
        var oGUI=null;											//Scratch3.0主控制句柄
        var oVIEW=null;											//Scratch3.0视图控制句柄
        var oVMLISTENER=null;
        var oGUIX=null;
        var oSB3FILE=null;
     </script>
<script src=./js/jquery.js></script>
<script src=./js/drag.js></script>
<script>
var strTeacher="<?php echo $teacher_name[$room];?>";							//当前教室的教室名字
var strCurrentUser="<?php echo (isset($_COOKIE['USERNAME'])?$_COOKIE['USERNAME']:"NONE");?>";		//学生名
var saved=0;
var classid='<?php echo isset($_GET['c'])?intval($_GET['c']):$classid;?>';				//当前班级ID
var folder="";												//作业保存的文件夹（日期）
var filename="<?php echo $projname;?>";									//作业文件名
//var gradeid=<?php echo $gradeid;?>;									//年级ID
var lastID= "<?php echo isset($_COOKIE['QuizID'])?$_COOKIE['QuizID']:'';?>";				//速问速答最后一题ID
var nCurrentGroup=<?php echo $groupcontrol;?>;								//当前分组
var bGroup=false;   											//分组状态（3或4人一组）
var bWaiting=<?php echo ($admin==1)?"false":($bgcontrol==1?"true":"false");?>;				//屏蔽状态控制
var arrSpritesSent=new Array();//分享过的角色，再有修改，需要修改服务器上保存的文件名。主要是保持分享后的脚本数据不会被修改。
</script>
    </head>

    <body style="background-color: hsla(215, 100%, 65%, 1);">

<!--加载遮罩-->
<div id=waiting style="position:absolute; visibility:hidden; left: 0px; top: 0px; width:100%; height: 100%; z-index:1000;background-color: hsla(215, 100%, 65%, 1);">
  <div height=100% width=100% style="margin:0 auto;position:relative;top:50%; text-align: center;color:red">静一静，听一听，想一想。</div>
</div> 
<!--加载遮罩-->

<!--任务分发开始-->
<!--菜单-->
<div class="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh" style="position:absolute; left:255; top: 0; width: 80px; height: 48px; line-height: 48px;z-index:999;background-color: #DC5712;text-align: center; "  onclick="showmenu(1);">
  <span name=moretask id=moretask style="position:absolute;left:20px;">↑任务↑</span>
</div>
<!--窗口-->
<div  id=task id=task style="position:absolute; left: 50%; top: 35%; width:460px; height: 294px;-webkit-transform: translate（-50%，-50%）;transform: translate(-50%,-50%); z-index:999;background-color: #CCCCCC; display:block">
  <div id=tasks >
    <div  onmousedown="drag(this,event,0)" style="background-color:#DC5712">
      <div  style="position:absolute; left:0px; top:5px; width: 440px;color:white;" align=center>任务</div>
      <div align=right><img style="position: relative;height:24px;width:24px;right: 5px; top: 5px;" src=./img/close.png onclick="showmenu(1);" alt="看明白本课的任务了么？" title="看明白本课的任务了么？"><hr></div>
    </div>
<?php
if($gradeid!="")		//获取本课任务
{
   $data=file_get_contents("../task/$room/$gradeid/task.txt");
   echo "<textarea   onmousedown=\"drag(this,event,0)\"  readonly style='top: 33px; position: absolute;margin: 0px; width: 460px; height: 260px; font-size:14px'>".$data."</textarea>";
   echo "<br>";
   $add="../task/$room/$gradeid/attach/";

   $files=Array();		//对文件进行排序
   $date_arr=Array();		//获取作业日期
   if(is_dir($add))
   {
      if ($handle_date = opendir($add))
      {
         while (false !== ($file = readdir($handle_date)))
         {
            if($file!="." && $file!="..")
            {
               if (is_dir($add))
               {
                  $dates[]=$file;
               }
            }
         }
         closedir($handle_date); 
      }
   }
   $dc=count($dates);
?>
    <div onmousedown="drag(this,event,0)" class=attachments id=atta style="position:absolute;top: 294px; width:460px; overflow-x: hidden; overflow-y: hidden;">
      <div class="heartPic" align=left>
<?php

   $attachments=NULL;
   for($i=0;$i<$dc;$i++)
   {
       $l=strlen($dates[$i]);
       $rest = strtolower( substr($dates[$i],$l-3 ,$l ));

       $attachments[$i]=str_replace(".","_",$dates[$i]);//JS中的cookie，“.”就是“.”，但到了PHP那边，会自动把“.”改成“_”。为避免麻烦，这里主动修改。
       $visibility="hidden";
       if(isset($_COOKIE[$attachments[$i]]) && $_COOKIE[$attachments[$i]]=="true") $visibility="visible";

       if($rest=="png" ||$rest=="bmp" || $rest=="jpg"  || $rest=="gif") {
          echo "<div class=div-inline  onmousedown=\"drag(this,event,1)\"  id=\"$attachments[$i]\" style=\"visibility:".$visibility."\"><font color=red size=2>".$dates[$i]."</font><br><img width=100 onclick=clickonme(this) class=min border=1 src='$add$dates[$i]'  alt=\"点击缩放图片\"  title=\"点击缩放图片\"></div>";
          //echo "<div class=div-inline  onmousedown=\"drag(this,event,1)\"  id=\"$attachments[$i]\" style=\"visibility:".$visibility."\"><font color=red size=2><a onclick='clickonme(\"$attachments[$i]\");'>".$dates[$i]."</a></font><br><img width=100  class=min border=1 src='$add$dates[$i]'  alt=\"点击缩放图片\"  title=\"点击缩放图片\"></div>";
       }
       else if($rest=="swf"){
          echo "<div class=div-inline><p><EMBED align=right src=".$add.$dates[$i]." width=490 height=440 type=application/x-shockwave-flash quality=high></EMBED><p><p></div>";
       }
       else if($rest=="mp4") {
          echo "<div class=div-inline><input type=button onclick='showvideo(\"".md5($add.$dates[$i])."\")' value=\"".$dates[$i]."\"><br><object class=minv id=\"".md5($add.$dates[$i])."\" width=490 height=420 data=\"".$add.$dates[$i]." \" autoplay=\"false\" autostart=false><param name=\"autostart\" value=\"false\"/></object></div>";
       }
       //else{
       //   echo "<a href='dl.php?n=$add$dates[$i]&f=".$dates[$i]."' target=_blank>".$dates[$i]."</a>".(($admin==1)?"<a href='delfile.php?n=$add/$dates[$i]' target=_blank>删除</a>":"")."</div>";
       //}
   }
   echo $dc==0?"暂无附件可用。":"";
?>
      </div>
    </div>
<?php
}
?>
  </div>
</div>
<!--附件样式-->
<style> 
  .attachments { width:190px; float:left;background:gray;overflow-y:scroll; overflow-x:scroll;}
  .div-inline{ display:inline-block;outline-style:auto;} 
  .max { width: auto; height:auto; }
  .minv { width: 100px; height:100px; }
  body {font-size:16px;background-color: hsla(215, 100%, 65%, 1);}
</style>

<script>
var bLarger=0;
function showvideo(id)			//附件中视频缩放显示
{
   $("#"+id).toggleClass("minv");
}

function clickonme(id){			//附件中图片缩放显示
   $(id).toggleClass("max");
   if($(id)[0].classList.length==1)
   {
      document.getElementById("task").style.top="243px";
      document.getElementById("task").style.left="543px";
   }

   document.getElementById("NEWMESSAGE").innerHTML="";
}
</script>
<!--任务分发结束-->

<!--拖曳打开操作，有些人经常误触，所以关闭了。-->
<!--div id="container" style="position:absolute"><div class=box>请拖拽您的Scratch项目文件到此处</div></div-->

<!--Scratch3.0应用主窗口-->
<div id="app"></div>

<!--文件列表提示-->
<!--菜单-->
<div class="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh" style="position:absolute; left:343px; top: 0px; width: 80px; height: 48px; line-height: 48px;z-index:999;background-color: #E58308;text-align: center; "  onclick="showmenu(2);">
  <span name=morefiles id=morefiles style="position:absolute;left:20px;">↓文件↓</span>
</div>

<!--窗口-->
<div  id=files id=files style="position:absolute; left:343px; top: 49px; width: 288px; height: 480px; z-index:999;background-color: #F0F0F0; display:none ">
  <div style="background-color:#E58308">
    <div style="position:absolute; left:5px; top: 5px; width: 40px;color: ghostwhite;" align=center>文件</div>
    <div  onmousedown="drag(this,event,0)" align=right><img style="position: relative;height:24px;width:24px;right: 5px; top: 5px;"  src=./img/close.png onclick="showmenu(2);"><hr></div>
  </div>
  <div  align=center><?php echo $username;?>，欢迎回来！</div><hr>   
  <div align=center><?php echo $projname!=""?"新建：<input id=newpp name=newpp type=button value=\"".$projname."\" onclick=\"createNew();\" title=\"点击新建“".$projname."”\">":"";?><input id=newp2 name=newp2 type=button value="..." onclick="createNew2();" title="自定义项目名"><br>当前：<input id=newp name=newp type=button value="<?php echo $projname==""?"新建游戏":$projname;?>" onclick="createNew();" title="点击新建“<?php echo $projname;?>”"><hr>
<?php
if(isset($scratch_class[$username]))//教师访问
{
?>班级：<select id=c name=c onChange="loadFolder(this.value);" style="size:2;">
<option value="">请选择班级</option>
<?php
   for($i=0;$i<count($scratch_class[$username]);$i++)
      echo "<option value=".($scratch_class[$username][$i]+1).">".$classname[$scratch_class[$username][$i]]."</option>";
?>
    </select>
<?php
}
else
{
   echo "班级：".$classname[$classid-1];
}
?><br>日期<img src=./img/refresh.png width=12 height=12 onclick="loadFolder(classid);" alt="刷新日期" title="刷新日期">：<select id=d name=d onChange="loadFilelist(classid,this.value);"  size=1></select><br>
文件<img src=./img/refresh.png width=12 height=12 onclick="loadFilelist(classid,folder);" alt="刷新文件列表" title="刷新文件列表">：<select id=f name=f   onmousedown="if(this.options.length>10){this.size=12;document.getElementById('files').style.height='650px';}"  onChange="loadOldProjectFile(this);" style="width: 206px;"   size=1></select><br><!--input type=button value="刷新文件列表" onClick="loadFilelist(classid,folder);"><br-->
<?php
if(isset($_COOKIE['USERNAME']) && isset($scratch_class[$_COOKIE['USERNAME']]))//=="吴老师" || $_COOKIE['USERNAME']=="矫老师"))
{
?>
<hr><input id=ViewMode name=ViewMode type=checkbox checked><label for=ViewMode>批改模式</label>&nbsp;<input type=button onClick="Release();" value="佳作推荐">
<?php
}
else
{
   echo "<input id=ViewMode name=ViewMode type=hidden>";
}
?>&nbsp;<input type=button onclick="getScreenshot();" value="我要上榜" title="先去打开要上榜的文件，再来点我。"><hr>

    <a id=cancelleft style="position: relative;    top: -5px;    left: -10px;"></a>
    <img style="visibility:hidden"  id=cancel name=cancel src="img/cancel.png" width=20 height=20 alt="撤销" title="撤销" onclick="cancelit();">&nbsp;<a id=recovery style="visibility:hidden"  onclick="recoveryFile()" target=_blank>恢复</a>&nbsp;
    <img style="visibility:hidden"  id=redo name=redo src="img/redo.png" width=20 height=20 alt="重做" title="重做" onclick="redoit();">
    <a id=redoleft style="position: relative;    top: -5px;    left: 10px;"></a>

    <br>
    <hr><input id=ul name=ul type=button value="上传文件到服务器" title="交作业不需要选择日期，直接点我就行。" onclick="saveOnline();" style="visibility:visible"><hr>
    <span id=autosavestatus></span><br>
    <font size=2>关于备份恢复：如果浏览器异常导致数据丢失，请刷新页面后，执行如下操作：1.点击新建按钮；2.刷新日期；3.选择今天日期；4.点击撤销按钮。</font>
  </div>
</div> 
<!--文件列表提示结束-->

<!--社区讨论提示-->
<!--菜单-->
<div  class="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh" style="position:absolute; left:431px; top: 0px; width: 80px; height: 48px;line-height: 48px; z-index:999;background-color: #F4D000;text-align: center; "  onclick="showmenu(3);">
  <span name=moremsg id=moremsg style="position:absolute;left:20px;">↓社区↓</span>
</div> 
<!--窗口-->
<div id=talk id=talk style="position:absolute; left:431px; top: 49px; width: 240px; height: 335px; z-index:999;background-color: #CCCCCC; display:none ">
  <div style="background-color:#F4D000">
    <div style="position:absolute; left:5px; top: 5px; width: 40px;color: ghostwhite;" align=center>社区</div>
    <div onmousedown="drag(this,event,0)" align=right><img style="position: relative;height:24px;width:24px;right: 5px; top: 5px;" src=./img/close.png onclick="showmenu(3);"><hr></div>
  </div>
我对此作品有想法：<hr>
  <textarea name=msg id=msg style="margin: 0px; width: 240px; height: 64px;"></textarea><br><font size=2 color=red>请文明交流，有效沟通。</font><br>
  <input type=button value="提交" onclick="postMsg(classid,folder);">
  <input type=button value="看看别人说了啥？" onClick="loadMSG(classid);">
<hr>
  <select id=msgs name=msgs size=10  style="width:240px; font-size:12px" onchange="showthisinfo(this);" ></select>
  <div id=infotext name=infotext style=" text-align: left;"></div>
</div> 
<!--社区讨论提示结束-->


<!--佳作欣赏开始-->
<!--菜单-->
<div class="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh" style="position:absolute; left:519px; top: 0px; width: 120px; height: 48px;line-height: 48px; z-index:999;background-color: #8A977B; text-align: center;"  onclick="showmenu(4);">
  <span name=moretocome id=moretocome style="position:absolute;left:23px;">↓佳作欣赏↓</span>
</div>
<!--窗口-->
<div id=lab id=lab style="position:absolute;  left:519px; top:49px; width: 371px; height: 330px; z-index:999;background-color: #CCCCCC; display:none ">
  <div style="background-color: #8A977B;"><div style="position:absolute; left:5px; top: 5px; width: 80px;color: ghostwhite;" align=center>佳作欣赏</div>
    <div onmousedown="drag(this,event,0)" align=right><img style="position: relative;height:24px;width:24px;right: 5px; top: 5px;" src=./img/close.png onclick="showmenu(4);"><hr></div>
  </div>
  <input type=button onclick="getTopList();" value="刷新榜单">
  <div style=" text-align: left;height: 250px;overflow:scroll;overflow-x:auto;overflow-y:auto;">
    <div id=toplist name=toplist style="text-align: left;display: flex;flex-flow: row wrap;justify-content: center;align-items: center;"></div>
  </div>
  <hr><div id=snap name=snap style="top: -8px;position: relative;text-align: center;height: 300px; display: none;background: #FFC107;"></div>
</div> 
<!--佳作欣赏中的样式-->
<style>
  .clicked{background:red;}
  .viewed{background:purple;}
</style>
<!--佳作欣赏结束-->


<!--临时补丁-->
<!--挡住教程和最右侧登录菜单，其实已经可以实现从资源里直接去掉了。-->
<div class="menu-bar_menu-bar-item_oLDa-"  id=NEWMESSAGE style="position:absolute; left:243px; top: 0px; width:62px; height: 48px; z-index:990;background-color: hsla(215, 100%, 65%, 1);font-size: 10px;color: red;"> </div> 
<div class="menu-bar_menu-bar-item_oLDa-" style="position:absolute; right:0px; top: 0px; width:180px; line-height: 48px; height: 48px; z-index:990;background-color: hsla(215, 100%, 65%, 1);">  <span name=moretocome id=moretocome style="position:absolute;right:10px;"><?php echo $username;?>，加油！</span></div> 

<!--学生互助开始-->
<!--菜单-->
<div id=helpmenu class="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh" style="position:absolute; left:<?php echo $admin==1?"775px":"647px"; ?>; top: 0px; width: 120px; height: 48px;line-height: 48px; z-index:999;background-color: crimson; text-align: center;visibility:<?php echo $helpcontrol==1?"visible":"hidden";?>"  onclick="showHelpMenu();">
  <span name=moretohelp id=moretohelp style="position:absolute;left:23px;">↓互帮互助↓</span>
</div>
<!--窗口-->
<div id=help id=help class="menu-bar_menu-bar-menu_239MD" style="position:absolute; visibility:hidden;  left:<?php echo $admin==1?"775px":"647px"; ?>; top: 0px; width: 120px; height: 0px;line-height: 48px; z-index:999;background-color: #8A977B;">
  <ul class="menu_menu_3k7QT menu_right_3PQ4S" id=helplist>
    <li class="menu_menu-item_3EwYA menu_hoverable_3u9dt menu_menu-section_2U-v6"  title="取消勾选，可以撤销之前的求助请求。">
      <div id=firstmenu title="取消勾选，可以撤销之前的求助请求。">
        <input id="check" type="checkbox" style="width: 18px; height: 20px; position: absolute;top: 8px;left: 5px;" onclick="cancelHelp(this);" title="取消勾选，可以撤销之前的求助请求。"><!--撤销帮助请求-->
        <span  id="txt" onclick="helpme();" style="display:block; font-size: 16px; left: 16px; top:1px;position: relative;" title="取消勾选，可以撤销之前的求助请求。">谁来帮帮我！</span>    
      </div>
    </li>
  </ul>
</div>
<!--学生互助结束-->


<!--学生同组分享开始-->
<!--菜单-->
<div id=sharemenu class="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh" style="position:absolute; left:<?php echo ($admin==1?($helpcontrol==1?"903px":"775px"):($helpcontrol==1?"775px":"647px")); ?>; top: 0px; width: 120px; height: 48px;line-height: 48px; z-index:999;background-color: mediumvioletred; text-align: center;visibility:<?php echo $sharecontrol==1?"visible":"hidden";?>"  onclick="showShareMenu();">
  <span name=moretoshare id=moretoshare style="position:absolute;left:23px;">↓同组分享↓</span>
</div>
<!--窗口-->
<div id=share id=share class="menu-bar_menu-bar-menu_239MD" style="position:absolute; visibility:hidden;  left:<?php echo $admin==1?"903px":"775px"; ?>; top: 0px; width: 120px; height: 0px;line-height: 48px; z-index:999;background-color: #8A977B;">
  <ul class="menu_menu_3k7QT menu_right_3PQ4S" id=sharelist>
    <li class="menu_menu-item_3EwYA menu_hoverable_3u9dt menu_menu-section_2U-v6">
      <div style="width: 400px;">
        <span id="txt" style="display:block; font-size: 16px; left: 4px; position: relative;">把&nbsp;<select name=spritestoshare id=spritestoshare style="width:120px;color: black;" onchange="shareSprite();"><option value="">请选择角色</option></select>&nbsp;分享给&nbsp;<select name=memberstoshare id=memberstoshare style="width:120px;color: black;" onchange="shareSprite();"><option value="">请选择组员</option></select></span>    
      </div>
    </li>
  </ul>
</div>
<!--学生同组分享结束-->

<script>


function test()
{
var options = {};
if (typeof MediaRecorder.isTypeSupported == 'function') {
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        options.mimeType = 'video/webm;codecs=vp8';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        options.mimeType = 'video/webm;codecs=vp9';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
        options.mimeType = 'video/webm;codecs=h264';
    }
}

var recorder = {
    chunks: [],
    start: function (options) {
        var canvas = $("canvas")[0]
        if (!canvas) {
            console.info("canvas is needed!")
            return false;
        }
        this.chunks = [];
        this.stream = canvas.captureStream(60);
        this.mediaRecorder = new MediaRecorder(this.stream);
        this.mediaRecorder.onstop = this.stopHandler;
        this.mediaRecorder.ondataavailable = this.dataHandler;

        if (options.music) {
            this.attachAudio(music);
            this.audio.play();
        }
        this.mediaRecorder.start();
        return true;
    },
    stop: function () {
        this.mediaRecorder.stop();
        if (this.audio) {
            this.audio.currentTime = 0;
            this.audio.pause();
        }
    },
    attachAudio: function (music) {
        var audioCtx = new AudioContext();
        // create a stream from our AudioContext
        var dest = audioCtx.createMediaStreamDestination();
        var audioStream = dest.stream;

        this.audio = document.createElement('audio');
        this.audio.crossOrigin = "anonymous";
        this.audio.loop = "loop";
        this.audio.src = music.url;

        // connect our audio element's output to the stream
        var sourceNode = audioCtx.createMediaElementSource(this.audio);
        sourceNode.connect(dest)
        sourceNode.connect(audioCtx.destination);

        this.stream.addTrack(audioStream.getAudioTracks()[0]);
    },
    dataHandler: function (e) {
        recorder.chunks.push(e.data);
    },
    stopHandler: function () {
        if (recorder.chunks.length) {
            var blob = new Blob(recorder.chunks, {type: "video/webm"})
            var downloadUrl = window.URL.createObjectURL(blob);

            var link = document.createElement('a');
            link.style.display = 'none';
            link.href = downloadUrl;
            link.download = 'media.webm';
            link.disabled = false;
            link.click();
        } else {
            console.info("no data saved");
        }
    }
};
}
/*
//弃用
function R()
{
   const canvas = document.querySelector('canvas');
   const ctx = canvas.getContext('2d');
   const {width, height} = canvas;

   const stream = canvas.captureStream();
   const recorder = new MediaRecorder(stream, { mimeType: 'video/mp4' });

   const data = [];

   recorder.ondataavailable = function (event)
   {
  
    if (event.data && event.data.size) {

      data.push(event.data);
  }

   };

   recorder.onstop = () => {

     const url = URL.createObjectURL(new Blob(data, { type: 'video/webm' }));

     document.querySelector("#videoContainer").style.display = "block";

     document.querySelector("video").src = url;

   };

   recorder.start();


   setTimeout(() => {
 recorder.stop();
}, 6000);
}*/



//恢复异常文件
function recoveryFile()
{
   var date=document.getElementById("d").value;
   var file=document.getElementById("f").value;
   window.open ("recoveryFile.php?f="+arrBKFiles[nBKFileIndex]+"&d="+date+"&p="+file);
}

var strHelper='';
var bHelped=false;
var bQuizStopped=false;
/***********
*
** 删除之前的求助
** 当checkbox的checked属性为true时，发送帮助请求。该操作两次间至少要等十秒。
*
**********/
function cancelHelp(o)
{
   if(o.checked==true)
   {
      var d= new Date();
      var nTime= d.getTime();

      if((nTime-nLastHelpRequest)<10*1000){ o.checked=false;alert("请求过于频繁，请10秒后再试。");}
      else
      {
         nLastHelpRequest=nTime;
         var content="[\"HELP\",\""+uname+"\"]";			//发出求助
         var msg = {'content': content, 'type': 'user'};
         sendMsg(msg);
      }
   }
   else
   {
      var content="[\"HELP\",\""+uname+"\",\""+uname+"\"]";	//将自己的名字作为帮助者和求助者发出，可以清除之前的请求记录。
      var msg = {'content': content, 'type': 'user'};
      sendMsg(msg);
   }
}
/***********
*
** 向同学请求帮助。没有人应答的话，可以一直点。页面刷新后，请求数据会消失，重点才会被看见。
** 为防止频繁请求堵塞通道，限定发出请求操作两次间至少要间隔10秒；取消操作可即时执行。
*
**********/
var nLastHelpRequest=0;

function helpme()
{
   var d= new Date();
   var nTime= d.getTime();

   if((nTime-nLastHelpRequest)<10*1000) alert("请求过于频繁，请10秒后再试。");
   else
   {
      nLastHelpRequest=nTime;
      bHelped=false;
      document.getElementById("check").checked=true;		//勾选，表示之前发出过帮助请求
      var content="[\"HELP\",\""+uname+"\"]";
      var msg = {'content': content, 'type': 'user'};
      sendMsg(msg);
   }
}

/***********
*
** 收到了求助者的求助信息。同一人的求助会多次出现，所以需要检测。
*
**********/
function helpneeded(strUser)
{
   var h=document.getElementById("helplist");
   var bFound=false;

   for(var n=1;n<h.children.length;n++)//检测是否已存在求助菜单
   {
      if(h.children[n].innerHTML==strUser){
         bFound=true;
         break;
      }
   }
   if(bFound==false)
   {
      var li=document.createElement("li");
      li.innerHTML=strUser;
      li.style.fontSize="14px";
      li.className="menu_menu-item_3EwYA menu_hoverable_3u9dt menu_menu-section_2U-v6";
      li.onclick=function(){gohelping(this);};
      h.appendChild(li);
      //showHelp();			//有新人求助时，弹出菜单。可能稍微有点扰民。换成下面的红*后，就好了。红*会在菜单点击后被覆盖掉。
      document.getElementById("moretohelp").innerHTML=document.getElementById("moretohelp").innerHTML[0]+"互帮互助<font color=yellow>*</font>"+document.getElementById("moretohelp").innerHTML[0];
   }
}

function shareComing(strUser,strSpriteName,strSpriteID)
{
   var h=document.getElementById("sharelist");
   var bFound=false;

   for(var n=1;n<h.children.length;n++)//检测是否已存在求助菜单
   {
      if(h.children[n].innerHTML==strUser){
         bFound=true;
         break;
      }
   }
   if(bFound==false)
   {
      var li=document.createElement("li");
      var myDate = new Date();
      li.innerHTML="点击接收<u>"+strUser+"</u>分享的<input style='width:170px;color:black' value='"+strSpriteName+"'> ("+myDate.getHours()+":"+myDate.getMinutes()+")";
      li.style.fontSize="14px";
      li.className="menu_menu-item_3EwYA menu_hoverable_3u9dt menu_menu-section_2U-v6";
      li.onclick=function(){ addSharedSprite(this,strSpriteID);};
      h.appendChild(li);
      //showHelp();			//有新人求助时，弹出菜单。可能稍微有点扰民。换成下面的红*后，就好了。红*会在菜单点击后被覆盖掉。
      document.getElementById("moretoshare").innerHTML=document.getElementById("moretoshare").innerHTML[0]+"同组分享<font color=yellow>*</font>"+document.getElementById("moretoshare").innerHTML[0];
   }
}

function  addSharedSprite(o,strSpriteID)
{
   if(confirm("你是否愿意接收此条共享数据？")==1)
   {
      if(strSpriteID.length==32)
      {
         $.post("loadScript.php?t=" + Math.random(), { "S":strSpriteID }, (function(o){ return function(data){ 
           var strInfo=o.innerText; 
           //var temp=strInfo.split(" "); 
           //if(temp.length==5)
           //{
              var jsondata=JSON.parse(data); 
              jsondata["name"]=o.children[0].innerText+"的"+o.children[1].value;
              for(var i=0;i<jsondata.costumes.length;i++)
              {
                 if(jsondata.costumes[i].asset.data.type!=undefined)
                    jsondata.costumes[i].asset.data=jsondata.costumes[i].asset.data.data;
              }
              oGUI.props.vm.addSprite(jsondata); 
          // }
        }})(o) );
      }
   }
   o.parentElement.removeChild(o);  
}
/***********
*
** 对帮助者点赞，后台更新得分。
*
**********/
function goodhelping(o)
{
   if(confirm("你的问题解决了么？")==1)
   {
      document.getElementById("check").style.display="block";
      document.getElementById("txt").innerHTML="谁来帮帮我！";
      document.getElementById("txt").style.left="16px";

      document.getElementById("txt").onclick=function(){helpme();};

      //给帮助者加分。
      $.post("helperScore.php?t=" + Math.random(), { "S": strHelper}, function (data) {
         if(data.length>0){ 
            alert("太好了！"+data);
            var content='[\"SCORE\",\"'+uname+'\",\"'+strHelper+'\",\"1\"]';
            var msg = {'content': content, 'type': 'user'};
            sendMsg(msg);
         }
      });
   }
   else
   {
      document.getElementById("check").style.display="block";
      document.getElementById("txt").innerHTML="谁来帮帮我！";
      document.getElementById("txt").style.left="16px";

      document.getElementById("txt").onclick=function(){helpme();};
      if(confirm("对方没有来，是虚假帮助？")==1)
      {
         //给虚假帮助者扣分。
         $.post("fhelperScore.php?t=" + Math.random(), { "S": strHelper}, function (data) {
            if(data.length>0){ 
               alert("好了，"+data);
               var content='[\"SCORE\",\"'+uname+'\",\"'+strHelper+'\",\"-1\"]';
               var msg = {'content': content, 'type': 'user'};
               sendMsg(msg);
            }
         });
      }
      else
      {
         alert("真是很遗憾啊。要不你重新发起求助吧？");
      }
   }

   if(bHelpAllowed==false)//互帮互助已关闭
   {
      setJSCookie("BG",0,1);
      document.getElementById("waiting").style.visibility="hidden";
      document.getElementById("waiting").style.zIndex="990";
   }
}

/***********
*
** 帮助者去帮忙前，要通知被帮助者我来了，同时通知其他人，删掉求助者的求助信息。
*
**********/
function gohelping(o)
{
   if(confirm("你完成了自己的任务么？\r\n注意：不要频繁地去点击求助者，万一有多人同意你去帮助，而你又忙不过来，则很可能会被求助者判定为虚假帮助，最后反而被扣分。")==1)
   {
      var h=document.getElementById("helplist");		//如果对方不同意，就不要再申请了，所以还是应该删除
      h.removeChild(o);
      var content="[\"ACK\",\""+uname+"\",\""+o.innerHTML+"\"]";//["HELP","帮助者","求助者"];
      var msg = {'content': content, 'type': 'user'};
      sendMsg(msg);
   }
}

var bHelp=false;
function showHelpMenu()		//显示/隐藏互帮互助菜单
{
   if(bHelp==false) showHelp();
   else hideHelp();
   hideShare();
   bHelp!=bHelp;
}

function hideHelp()		//隐藏互帮互助菜单
{
   var m=document.getElementById("moretohelp");
   m.innerHTML="↓互帮互助↓";

   document.getElementById("help").style.visibility="hidden";

   updateMenu();

   bHelp=false;
}

function showHelp()		//显示互帮互助菜单
{
   var m=document.getElementById("moretohelp");
   m.innerHTML="↑互帮互助↑";

   document.getElementById("help").style.visibility="visible";

   updateMenu();

   bHelp=true;
}


var bShare=false;
function showShareMenu()		//显示/隐藏互帮互助菜单
{
   if(bShare==false) showShare();
   else hideShare();
   hideHelp();
   bShare!=bShare;
}

function hideShare()		//隐藏同组分享菜单
{
   var more=document.getElementById("moretoshare");
   more.innerHTML="↓同组分享↓";
   var members=document.getElementById("memberstoshare");
   if(members.length>0) members.length=0;

   document.getElementById("share").style.visibility="hidden";

   updateMenu();

   bShare=false;
}

function showShare()		//显示同组分享菜单
{
   var m=document.getElementById("moretoshare");
   m.innerHTML="↑同组分享↑";

   document.getElementById("share").style.visibility="visible";

   updateMenu();
   updateGroupMember(nCurrentGroup);
   bShare=true;
   getSprites("spritestoshare");
}

function updateMenu()
{
   //if(document.getElementById("sharemenu").style.visibility=="visible")//当Share功能可用时，要调整
   //{
       document.getElementById("helpmenu").style.left=(admin==1?"775px":"647px");//偏移
       document.getElementById("help").style.left=(admin==1?"775px":"647px");//偏移
   //}
   if(document.getElementById("helpmenu").style.visibility=="visible")//同组分享已开启
   {
      document.getElementById("sharemenu").style.left=(admin==1?"903px":"775px");//偏移
      document.getElementById("share").style.left=(admin==1?"903px":"775px");//偏移
   }
   else
   {
      document.getElementById("sharemenu").style.left=(admin==1?"775px":"647px");
      document.getElementById("share").style.left=(admin==1?"775px":"647px");//偏移
   }
}


</script>

<?php
//教师端和学生端的切换控制开始
if($admin==1)//教师端
{
?>
<!--教师端-->
<!--菜单-->
<div class="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh" style="position:absolute; left:647px; top: 0px; width: 120px; height: 48px;line-height: 48px; z-index:999;background-color: #0a0a0a; text-align: center;"  onclick="showControlPanel();">
  <span name=morectrl id=morectrl style="position:absolute;left:23px;">↓上课管理↓</span>
</div> 
<!--窗口-->
<div id="ControlPanel" style="position: absolute; left: 50%; top: 50%; width: 740px; height: 530px; transform: translate(-50%, -50%);webkit-transform: translate（-50%，-50%）;transform: translate(-50%,-50%); z-index: 999; background-color: rgb(204, 204, 204); visibility:hidden;">
  <div id="CP">
    <div onmousedown="drag(this,event,0)" style="background-color:#0a0a0a"  onmousedown="drag(this,event,0)" >
      <div style="position:absolute; left:0px; top:5px; width: 700px;color:white;" align="center">上课管理</div>
      <div align="right"><img style="position: relative;height:24px;width:24px;right: 5px; top: 5px;" src="./img/close.png" onclick="showControlPanel();"><hr></div>
    </div>
    <div style="width: 733px;height: 272px;margin: 0px 7px auto;text-align: center;">
      <div style="width: 723px;border: 1px solid gray;height: 264px;">
        <div style="width: 110px;height: 251px;float: left;text-align: left;" onmousedown="drag(this,event,1)">
          <p style="font-size: 12px; position: absolute; top: 36px; left: 10px;">
	    <span>当前在线:</span>
	    <span id="user_num">0</span><br>
            <span>接收:</span>
	    <span id=to onclick="this.innerText='全体';" style="color:green">全体</span></p>
          <div id="user_list" style="width: 110px;border: 1px solid gray;height: 218px;overflow: scroll;float: left;text-align: left;left: 7px;position: absolute;top: 88px;"></div>
        </div>
        <div id="msg_list" onmousedown="drag(this,event,1)" style="width: 360px;border: 1px solid gray;height: 264px;overflow: scroll;float: left;text-align: left;left: 118px;position: absolute;top: 42px;display:block"></div>
        <div id="msg_scorehistory" onmousedown="drag(this,event,1)" style="width: 251px;border: 1px solid gray;height: 264px;overflow: scroll;float: left;text-align: left;left: 479px;position: absolute;top: 42px;display:block"></div>
        <div id="msg_score" style="width: 612px;border: 1px solid gray;height: 264px;overflow: scroll;float: left;text-align: left;left: 118px;position: absolute;top: 42px;display:none"></div>
      </div>
    </div>
    <div style="width: 725px; height: 144px; margin: 0px 7px auto;"  >
      <select id="S" onchange="setQuiz(this);" style="position: relative; top: -70px; width:110px; height:23px;">
        <option value="0">请选择题目</option>
      </select>
      <textarea id="msg_box" rows="4" cols="50" onkeydown="confirmSending(event)" style="height: 88px;width: 555px;position:relative; top:0px;"></textarea>
      <span id=status style="position: absolute;top: 350px;right:7px;width: 45px;font-size: 14px;"></span>

      <input type="button" value="发送" onclick="send()" style="position: absolute;align-items: center;top: 375px;right:7px;">
      <hr style="position: relative;top: -3px;">
      <!--input type=button value=car onclick="add('car')">
      <input type=button value=backdrop onclick="add('backdrop')">
      <input type=button value=tasks onclick="add('menu')">
      <input type=button value=巡课 onclick="add('checkpoint')"-->

      <input type=button value=提问模板  onclick='document.getElementById("status").innerHTML="待发送";document.getElementById("msg_box").value="[\"QUIZ\",[\"4\",\"新问题：<br>A:<BR>B:<BR>C:<BR>D:<BR>\"]]";'>
      <input type=checkbox id=bgctrl onclick='setBG(this);' style="position: absolute;left: 8px; top: 344px;" <?php echo ($bgcontrol==1)?"checked":"";?>><label for=bgctrl style="position: absolute;left: 23px; top: 340px;">屏蔽编辑器</label>
      <input type=checkbox id=helpctrl onclick='setHELP(this);' style="position: absolute;left: 8px; top: 366px;" <?php echo ($helpcontrol==1)?"checked":"";?>><label for=helpctrl style="position: absolute;left: 23px; top: 362px;">互助</label>
      <input type=checkbox id=sharectrl onclick='setSHARE(this);' style="position: absolute;left: 66px; top: 366px;" <?php echo ($sharecontrol==1)?"checked":"";?>><label for=sharectrl style="position: absolute;left: 82px; top: 362px;">分享</label>

      <input type=checkbox id=charctrl onclick='setCHAR(this);' style="position: absolute;left: 8px; top: 388px;" <?php echo ($charcontrol==1)?"checked":"";?>><label for=charctrl style="position: absolute;left: 23px; top: 383px;">角色</label>
      <input type=checkbox id=bdctrl onclick='setBD(this);' style="position: absolute;left: 66px; top: 388px;" <?php echo ($bdcontrol==1)?"checked":"";?>><label for=bdctrl style="position: absolute;left: 82px; top: 383px;">背景</label>

      <!--input type=button value=答题背景开 onclick='document.getElementById("msg_box").value="[\"FORCE\",\"1\"]";'>
      <input type=button value=答题背景关 onclick='document.getElementById("msg_box").value="[\"FORCE\",\"0\"]";'-->
      <!--input type=button value=提问4 onclick='add("[\"QUIZ\",[\"4\",\"选择题测试<br>A:<BR>B:<BR>C:<BR>D:<BR>\"]]");'-->
      <!--input type=button value=提问3    onclick='add("[\"QUIZ\",[\"3\",\"选择题测试<br>A:<BR>B:<BR>C:<BR>\"]]");'-->
      <!--input type=button value=提问2    onclick='add("[\"QUIZ\",[\"2\",\"选择题测试<br>A:<BR>B:<BR>\"]]");'-->
      <input type=button value=任务确认 onclick='add("[\"QUIZ\",[\"1\",\"本环节任务完成了么？<br>完成后请点“确认”按钮。\"]]");'>
      <input type=button value=关闭问卷 onclick='add("[\"QUIZ\",[\"0\",\"\"]]");'>
      <input type=button value=阅卷界面 onclick='viewQuiz();'>
      <input type=button value=日志界面 onclick='viewLog();'>
      <input type=button value=显示任务 onclick='add("[\"MENU\",\"\"]");'>
      <input type=button value=恢复最新版本 onclick='add("[\"LATEST\",\"\"]");'>

      <input type=button value=收作业 onclick='add("[\"SAVEFILE\",\"\"]");'>
<br>
      <input type=button value=清台 onclick='cleanStage();'>
      <input type=button value=谢幕 onclick='shutdownStage();'>
      <input type=button value=邀请 onclick='add("[\"INVITATION\",\"\"]");'>
      <input type=button value=随机5人 onclick='invite5();'>
      <input type=button value=开始 onclick='add("[\"GREENFLAG\",\"\"]");'>
      <input type=button value=结束 onclick='add("[\"STOPALL\",\"\"]");'>
      <input type="button" value="重启1" onclick="reboot1()">
      <input type="button" value="重启2" onclick="reboot2()">
<?php
   if($groupcontrol==0)
   {
?>
<input id=G3 type=button value='三人小组' onclick="showgroup(3)">
<input id=G4 type=button  value='四人小组' onclick="showgroup(4)">
<input id=GC type=button  value='解散' onclick="showgroup(0)" style="display:none">
<input id=G type=button  value='小组管理' onclick="showgsetting();" style="display:none">
<?php
   }
   else
   {
?>
<input id=G3 type=button value='三人小组' onclick="showgroup(3);" style="display:none">
<input id=G4 type=button  value='四人小组' onclick="showgroup(4);" style="display:none">
<input id=GC type=button  value='解散<?php echo (($groupcontrol==3)?"三":"四");?>人小组' onclick="showgroup(0);" style="display:inline">
<input id=G type=button  value='小组管理' onclick="showgsetting();" style="display:inline">
<?php
   }
?>
      <iframe id=groupx height=0px width=0px style="visibility:hidden"></iframe>
<br>
      <!--input type=button value=Abby onclick='add("[\"SPRITE\",\"Abby\"]");'>
      <input type=button value=Amon onclick='add("[\"SPRITE\",\"Amon\"]");'>
      <input type=button value=Arctic onclick='add("[\"BACKDROP\",\"Arctic\"]");'-->
<?php
$attcounter=count($attachments);
if($attcounter>0)
{
   echo "      <select onChange='showAttachment(this);'><option value=''>请选择要显示的附件</option>";
   for($i=0;$i<$attcounter;$i++){
      echo "<option value='".$attachments[$i]."'>".$attachments[$i]."</option>";
   }
   echo "</select>";
}
?>
      <!--select onChange='insertSprite2(this);' style="width:170px;"><option value=''>请选择要推送的图片</option><option value='./IMG_3282.jpg'>IMG_3282.jpg</option><option value='./IMG_3294.jpg'>IMG_3294.jpg</option></select-->
      <select id=sprites name=sprites onChange='sendSprite(this);' style="width:170px;"><option value=''>请选择要分享的角色</option></select>
      <select onChange='insertSprite(this);' style="width:170px;"><option value=''>请选择要推送的角色</option><option value='Car1'>赛车1</option><option value='Car2'>赛车2</option></select>
      <select onChange='insertBackdrop(this);' style="width:170px;"><option value=''>请选择要推送的背景</option>
	<!--option value='Race0'>赛道0</option-->
	<option value='Race1'>赛道1</option>
        <option value='Race3'>赛道2</option>
        <option value='Race4'>赛道3</option>
	<option value='Race5'>赛道4</option>
        <!--option value='Race5'>赛道5</option-->

      </select>
      <select onChange='remoteOpenProject(this);' style="width:170px;">
	<option value=''>请选择要推送的游戏</option>

	<option value='_EDITABLE_遍历计算.SB3'>三个整数的立方和</option>

	<option value='_EDITABLE_计算.SB2'>计算</option>
	<option value='bean_eater.SB3'>吃豆人</option>
	<option value='_EDITABLE_start.sb3'>初始化</option>
	<option value='_NOSHOW_slow.sb3'>慢镜头</option>
	<option value='test.sb3'>测试</option>
	<option value='FF1.sb2'>空战1</option>
	<option value='FF2.sb2'>空战2</option>
	<option value='FF3.sb2'>空战3</option>
	<option value='0'>清空</option>
      </select>
    </div>
  </div>
</div>

<div id="quiz" style="position: absolute; left: 50%; top: 50%; width: 742px; height: 465px; transform: translate(-50%, -50%);webkit-transform: translate（-50%，-50%）;transform: translate(-50%,-50%); z-index: 1001; background-color: rgb(204, 204, 204); visibility: hidden;" >
  <div id="quizinfo" >
    <div style="width: 740px;height: 472px;"  onmousedown="drag(this,event,0)" >
      <div style="width: 740px;border: 1px solid gray;height: 462px;">
        <div style="background-color:#DC5712" >
          <div style="position:absolute; left:10px; top:5px; width: 730px;color:white;" align="left">速问速答</div>
          <div style="height:33px"></div>
        </div>
        <div style="width: 720px;border: 1px solid gray;height: 376px;left: 9px; position: absolute; top: 42px;">
          <div id="msg_text" style="width: 720px;border: 0px solid gray;height: 376px;overflow: scroll;float: left;text-align: left;"></div>
          <div id="msg_keys" style="width: 720px;border: 0px solid gray;height: 20px;float: left;text-align: center;margin: 8px auto auto auto;"> </div>
          <div style="display: none;width: 159px;height: 427px;float: left;text-align: left;">
            <p><span>当前在线:</span><span id="user_num">0</span></p>
            <div id="user_list" style="overflow: auto;"></div>
          </div>
        </div>
        <div id="msg_list" style="width: 730px;border: 0px solid gray;height: 250px;overflow: scroll;float: left;text-align: left;display:none"></div>
      </div>
    </div>
  </div>
</div>


<script>
//var nGroup=<?php echo $group;?>;
//
function showgsetting()
{
   var g=document.getElementById("groupsetup");
   var o=document.getElementById("groupwindow");
   if(g.style.visibility=="visible")
   {
      g.style.visibility="hidden";
      o.contentWindow.stopInterTimer();
   }
   else
   {
      showControlPanel();
      g.style.visibility="visible";
      if(o.src==undefined || o.src=='')
      {
         o.src="gSetting.php?pos="+nCurrentGroup+"&t="+Math.random();
      }
      else
      {
         o.contentWindow.startInterTimer();
      }
   }
}



function showgroupsetting(n)
{
   var nCurrentGroup=0;
   var g=document.getElementById("groupsetup");
   var gk=document.getElementById("groupbk");
   var o=document.getElementById("groupwindow");
   if(n==3)
   {
      g.style.width="880px";
      g.style.height="590px";
      g.style.visibility="visible";
      gk.style.width="880px";
      gk.style.height="590px";
      if(nCurrentGroup==0)
      {
         nCurrentGroup=3;
         o.src="gSetting.php?pos="+nCurrentGroup+"&t="+Math.random();//+"&W=<?php echo $week;?>&D=<?php echo $day;?>&L=<?php echo $lesson;?>";
      }
      else if(o.src!="" && nCurrentGroup!=n) alert("已存在其它分组，要启用新分组，请先解散原有分组。");
   }
   else if(n==4)
   {
      g.style.width="895px";
      g.style.height="550px";
      g.style.visibility="visible";      
      gk.style.width="895px";
      gk.style.height="550px";
      if(nCurrentGroup==0)
      {
         nCurrentGroup=4;
         o.src="gSetting.php?pos="+nCurrentGroup+"&t="+Math.random();//+"&W=<?php echo $week;?>&D=<?php echo $day;?>&L=<?php echo $lesson;?>";
      }
      else if(o.src!="" && nCurrentGroup!=n) alert("已存在其它分组，要启用新分组，请先解散原有分组。");
   }
   else
   {
      g.style.visibility="hidden";
      o.src="gSetting.php?pos=0&t="+Math.random();
      nCurrentGroup=0;
      //o.src="about:blank";
   }
}

</script>
<!--分组管理-->
<div id="groupsetup"  style="position: absolute; left: 303px; top: 105px; width: 880px; height: 584px; z-index: 999; background-color: rgb(204, 204, 204); visibility:hidden">
  <div style="background-color:black;height:33px">
    <div style="position:absolute; left:5px; top: 5px; width: 80px;color: white;" align="center">分组管理</div>
    <div onmousedown="drag(this,event,0)" align="right" style="height:34px;"><input type="button" onclick="window.frames['groupwindow'].contentWindow.autoPos();" value="A" alt="自动分配" title="自动分配" style="position: absolute;right: 65px;top: 4px;"><br><input type="button" onclick="window.frames['groupwindow'].contentWindow.history.go(0);" value="R" alt="刷新" title="刷新" style="position: absolute;right: 34px;top: 4px;"><input type="button" onclick="document.getElementById('groupsetup').style.visibility='hidden'; document.getElementById('groupwindow').contentWindow.stopInterTimer();showControlPanel();" alt="关闭" title="关闭" value="X" style="position: absolute;right: 4px;top: 4px;text-align:center;"><!--img style="position: relative;height:24px;width:24px;right: 5px; top: -14px;" src="./img/close.png" onclick="document.getElementById('groupsetup').style.visibility='hidden'; document.getElementById('groupwindow').contentWindow.stopInterTimer();showControlPanel();"><hr--></div>
  </div>
  <div id="groupbk" align=center style="position: absolute;width: 880px;height: 550px;background-color: orange;overflow: auto;margin: auto;z-index:99;top:33px;">
   <iframe id=groupwindow height=100% width=100% frameborder=no scrolling=no></iframe>
  </div>
</div>


<!--分组管理结束-->
<!--竞技投屏-->
<div id="play" style="visibility: hidden;position: absolute; left: 303px; top: 105px; width: 1030px; height: 644px; z-index: 999; background-color: rgb(204, 204, 204); display: block;">
  <div style="background-color: #8A977B;"><div style="position:absolute; left:5px; top: 5px; width: 80px;color: ghostwhite;" align="center">同台竞技</div>
    <div onmousedown="drag(this,event,0)" align="right"><img style="position: relative;height:24px;width:24px;right: 5px; top: 5px;" src="./img/close.png" onclick="shutdownStage();"><hr></div>
  </div>
  <div style="position: absolute;top: 33px;">
    <iframe id=playground height=600 width=1020 frameborder=no scrolling=no style="margin: 5 5 5 5; position: relative;"></iframe>
  </div>
</div>
<!--竞技投屏结束-->

<script type="text/javascript">

function showgroup(n)
{
   var o=document.getElementById("groupx");
   var content="[\"GROUP\","+n+"]";			//分组信息
   bSelfShow=true;
   if(n==3)
   {
      if(nCurrentGroup==0)
      {
         nCurrentGroup=3;
         o.src="setGroup.php?pg="+nCurrentGroup+"&t="+Math.random();//+"&W=<?php echo $week;?>&D=<?php echo $day;?>&L=<?php echo $lesson;?>";
      }
      else if(o.src!="" && nCurrentGroup!=n) alert("已存在其它分组，要启用新分组，请先解散原有分组。");
      document.getElementById("G3").style.display="none";
      document.getElementById("G4").style.display="none";
      document.getElementById("GC").value="解散三人分组";
      document.getElementById("GC").style.display="inline";
      document.getElementById("G").style.display="inline";

      showControlPanel();
   }
   else if(n==4)
   {
      if(nCurrentGroup==0)
      {
         nCurrentGroup=4;
         o.src="setGroup.php?pg="+nCurrentGroup+"&t="+Math.random();//+"&W=<?php echo $week;?>&D=<?php echo $day;?>&L=<?php echo $lesson;?>";
      }
      else if(o.src!="" && nCurrentGroup!=n) alert("已存在其它分组，要启用新分组，请先解散原有分组。");
      document.getElementById("G3").style.display="none";
      document.getElementById("G4").style.display="none";
      document.getElementById("GC").value="解散四人分组";
      document.getElementById("GC").style.display="inline";
      document.getElementById("G").style.display="inline";
      showControlPanel();
   }
   else
   {
      content="[\"GROUP\",0]";			//分组信息

      o.src="setGroup.php?pg=0&t="+Math.random();
      nCurrentGroup=0;
      document.getElementById("G3").style.display="inline";
      document.getElementById("G4").style.display="inline";
      document.getElementById("GC").style.display="none";
      document.getElementById("G").style.display="none";

   }
 
   showgroupsetting(n);

   var msg = {'content': content, 'type': 'user'};
   sendMsg(msg);
   hideShare();
}


function sendMsgPlay(msg)
{
   var pg=document.getElementById("playground");
   if(pg.contentWindow)
   {
      var strInvitation="[\"INVITATION\",\"\"]";
      var msg =  { 'content': strInvitation , 'type': 'user'  ,'to':'Stage'};
      pg.contentWindow.sendMsgPlay(msg);
   }
}

//同台竞技投屏，清理舞台
function cleanStage()
{
   var p=document.getElementById("play");
   p.style.visibility="visible";
   var pg=document.getElementById("playground");
   if(pg.src=="")
      pg.src="play.php";
   //if(pg.contentWindow.oVIEW)
   //   pg.contentWindow.oVIEW.props.setFullScreen(true);//全屏播放模式

   var s=document.getElementById("user_list");
   var arrSend=Array();

   var strInvitation="[\"INVITATION\",\"\"]";
   var msg =  { 'content': strInvitation , 'type': 'user'  ,'to':'Stage'};
   sendMsgPlay(msg);//pg.contentWindow.sendMsgPlay(msg);
}

//同台竞技投屏，关闭舞台
function shutdownStage()
{
   var p=document.getElementById("play");
   p.style.visibility="hidden";
}

//同台竞技投屏，随机邀请5人
function invite5()
{
   var s=document.getElementById("user_list");
   var arrSend=Array();

   var strInvitation="[\"INVITATION\",\"\"]";
   var msg =  { 'content': strInvitation , 'type': 'user'  ,'to':'Stage'};
   sendMsgPlay(msg);

   for(var n=0;n<5;n++)//算法还有问题，待改善。
   {
      var i=parseInt((Math.random()*100) % s.childElementCount);
      if(arrSend.indexOf(i)==-1)
      {
         arrSend.push(i);
         var to = s.children[i].innerText;

         var strInvitation="[\"INVITATION\",\"\"]";
         var msg =  { 'content': strInvitation , 'type': 'user'  ,'to':to};
         sendMsg(msg);
      }
   }
}

function dealCommandT(jsonCOMMAND)//接收到广播数据后，判断该执行什么操作。
{
   if(jsonCOMMAND.length>1)
   {
      var Sprite=null;
      switch(jsonCOMMAND[0])
      {

      case "GROUP"://收到分组控制指令
         if(jsonCOMMAND[1]==0) 
         {
            bGroup=false;
         }//刷新文件列表
         else
         {
            bGroup=true;
            if(document.getElementById("sharemenu").style.visibility=="visible")      
               showShare();
         }
         loadFolder(classid);//更新文件列表中数据（显示或隐藏组员已交作业）。现在已经实现了角色级别的共享，这个文件级别的似乎不需要了。
         break;

      case "HELP":						//1.求助指令：["HELP","求助者"] 	2.帮助指令：["HELP","帮助者","求助者"]
/*
HELP,求助者	
求助者：鼠标点击主动发出
其他人：被动接收，菜单添加

HELP，求助者，求助者
求助者：鼠标点击主动发出
帮助者：忽略
其他人：删除求助者的菜单

ACK1，帮助者，求助者
帮助者：鼠标点击主动发出
求助者：弹窗确认是否接受帮助
       接受帮助，则发送ACK指令
其他人：忽略

ACK2，帮助者，求助者
帮助者：弹窗，提醒去帮忙
求助者：对方正在赶来
其他人：删除求助者的菜单
*/
         if(jsonCOMMAND[1]!=uname)				//jsonCOMMAND[1]不是自己，则表示是别人的求助，或者是帮助者的应答。
         {
            if(jsonCOMMAND[2]==undefined)			//如第三个参数未定义，则此条是求助信息。
            {
               helpneeded(jsonCOMMAND[1]);
            }
            else						//否则就是帮助者的应答
            {
               if(jsonCOMMAND[1]==jsonCOMMAND[2])		//否则，表示跟自己无关，但需要从列表中删除求助者信息，因为有人去帮忙了。
               {
                  var h=document.getElementById("helplist");
                  for(var n=1;n<h.children.length;n++)
                  {
                     if(h.children[n].innerHTML==jsonCOMMAND[2]) {h.removeChild(h.children[n]);break;}
                  }
               }
            }
         }
         break;

      case "ACK2":						//申请帮助：["ACK1","帮助者","求助者"]
         if(jsonCOMMAND[1]==uname)				//jsonCOMMAND[1]不是自己，则表示是别人的求助，或者是帮助者的应答。
         {
             alert(jsonCOMMAND[2]+ " 已同意，赶紧过去看看吧。");
         }
         else
         {
             var h=document.getElementById("helplist");
             for(var n=1;n<h.children.length;n++)
             {
                if(h.children[n].innerHTML==jsonCOMMAND[2]) {h.removeChild(h.children[n]);break;}
             }
         }
         break;

      case "ACK3":						//申请帮助：["ACK1","帮助者","求助者"]
         if(jsonCOMMAND[1]==uname)				//jsonCOMMAND[1]不是自己，则表示是别人的求助，或者是帮助者的应答。
         {
             alert("很遗憾，"+jsonCOMMAND[2]+ " 拒绝了你的请求。");
         }

         break;

      case "ACK":						//受邀应答：["ACK","帮助者","求助者"]
         if(jsonCOMMAND[2]==uname)				//帮助者收到受邀应答，可以去帮忙了。
         {
            if(bHelped==false)				//当前处于无人帮助状态
            {
               if(confirm("你是否愿意让 "+jsonCOMMAND[1]+ " 来帮你？")==true)
               {
                  bHelped=true;				//先来先到，阻止其他人的帮助
                  strHelper=jsonCOMMAND[1];
                  content="[\"ACK2\",\""+jsonCOMMAND[1]+"\",\""+jsonCOMMAND[2]+"\"]";//帮助者如收到此指令，就可以出发了。
                  var msg = {'content': content, 'type': 'user'};
                  sendMsg(msg);
                  document.getElementById("check").style.display="none";
                  document.getElementById("check").checked=false;
                  document.getElementById("txt").innerHTML=jsonCOMMAND[1]+" 同学帮到你了么？";
                  document.getElementById("txt").style.left="0px";
                  document.getElementById("txt").onclick=function(){goodhelping(this);};
               }
               else
               {
                  strHelper=jsonCOMMAND[1];
                  content="[\"ACK3\",\""+jsonCOMMAND[1]+"\",\""+jsonCOMMAND[2]+"\"]";//拒绝对方的帮助请求。
                  var msg = {'content': content, 'type': 'user'};
                  sendMsg(msg);
               }

            }
         }
         break;


      case "NEWCHAR":						//是否允许添加角色：["NEWCHAR","1|0"]
         var d=new Date();
         if(jsonCOMMAND[1]=="1")
         {
            setJSCookie("CHAR",1,1);
            //document.cookie="CHAR=1; expires="+(d+3600);
            setNewControl();//./js/control.js
         }
         else
         {
            setJSCookie("CHAR",0,1);
            //document.cookie="CHAR=0; expires="+(d+3600);
            setNewControl();
         }
         break;

      case "NEWBD":						//是否允许添加舞台背景：["NEWBD","1|0"]

         if(jsonCOMMAND[1]=="1")
         {
            setJSCookie("BD",1,1);
            //document.cookie="BD=1";
            setNewControl();
         }
         else
         {
            setJSCookie("BD",0,1);
            //document.cookie="BD=0";
            setNewControl();
         }
         break;

      case "PROJECT":
         if(jsonCOMMAND[1]!="0")
         {
            oGUI.props.vm.downloadProjectId(jsonCOMMAND[1]);						//通过URL打开文件
            bCodeViewableFile = true;
            updateScreenMode();
            saveOnline();//执行一次保存

         }
         else
         {
            createNew();
            bCodeViewableFile = true;
            updateScreenMode();
         }
         break;

      case "BACKDROP":						//添加资源库中背景图片的指令：["BACKDROP","Arctic"]
         switch(jsonCOMMAND[1])
         {
         case "Arctic":
            var vmBackdrop = {name: "Arctic", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oGUI.props.vm.addBackdrop("67e0db3305b3c8bac3a363b1c428892e.png",vmBackdrop);//只有图片文件在./editor/static/asset/下才可正常访问。
            break;

         case "Race0":
            var vmBackdrop = {name: "RaceDrop0", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oGUI.props.vm.addBackdrop("9cede097207106da21dffe23c9df5697.png",vmBackdrop);
            break;

         case "Race1":
            var vmBackdrop = {name: "RaceDrop1", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oGUI.props.vm.addBackdrop("a1d8253c6ca4fd8444396e19cbe71f16.png",vmBackdrop);
            break;
         
         case "Race2":
            var vmBackdrop = {name: "RaceDrop2", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oGUI.props.vm.addBackdrop("fc4bbac80c039a906ddb98f35738aef3.png",vmBackdrop);
            break;

         case "Race3":
            var vmBackdrop = {name: "RaceDrop3", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oGUI.props.vm.addBackdrop("0fc9051769c12f34562e0d04d611fb58.png",vmBackdrop);
            break;

         case "Race4":
            var vmBackdrop = {name: "RaceDrop4", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oGUI.props.vm.addBackdrop("0c340990dcb577abcaea44c3f7154922.png",vmBackdrop);
            break;
         
         case "Race5":
            var vmBackdrop = {name: "RaceDrop5", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oGUI.props.vm.addBackdrop("8f83c1427874dbbed970182f3bc7b364.png",vmBackdrop);
            break;

         }
         break;

      case "BACKDROP2":						//添加URL中图片为背景的指令：["BACKDROP","./fileurl"]
         $.get("addBackdrop.php?f="+jsonCOMMAND[1]+"&t=" + Math.random(), function (data)//获取文件URL
         {
            //var vmBackdrop = {name: "Arctic", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oGUI.props.vm.addBackdrop(jsonCOMMAND[1],$.parseJSON(data));
         });
         break;

      case "SPRITE":						//添加资源库中角色的指令：["SPRITE","Amon"]
         switch(jsonCOMMAND[1])
         {
         case "Abby":
             Sprite="{\"name\":\"Abby\",\"tags\":[\"people\",\"person\",\"drawing\"],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"809d9b47347a6af2860e7a3a35bce057\",\"name\":\"abby-a\",\"bitmapResolution\":1,\"md5ext\":\"809d9b47347a6af2860e7a3a35bce057.svg\",\"dataFormat\":\"svg\",\"rotationCenterX\":31,\"rotationCenterY\":100},{\"assetId\":\"920f14335615fff9b8c55fccb8971984\",\"name\":\"abby-b\",\"bitmapResolution\":1,\"md5ext\":\"920f14335615fff9b8c55fccb8971984.svg\",\"dataFormat\":\"svg\",\"rotationCenterX\":31,\"rotationCenterY\":100},{\"assetId\":\"34a175600dc009a521eb46fdbbbeeb67\",\"name\":\"abby-c\",\"bitmapResolution\":1,\"md5ext\":\"34a175600dc009a521eb46fdbbbeeb67.svg\",\"dataFormat\":\"svg\",\"rotationCenterX\":32,\"rotationCenterY\":100},{\"assetId\":\"45de34b47a2ce22f6f5d28bb35a44ff5\",\"name\":\"abby-d\",\"bitmapResolution\":1,\"md5ext\":\"45de34b47a2ce22f6f5d28bb35a44ff5.svg\",\"dataFormat\":\"svg\",\"rotationCenterX\":32,\"rotationCenterY\":101}],\"sounds\":[{\"assetId\":\"83a9787d4cb6f3b7632b4ddfebf74367\",\"name\":\"pop\",\"dataFormat\":\"wav\",\"format\":\"\",\"rate\":44100,\"sampleCount\":1032,\"md5ext\":\"83a9787d4cb6f3b7632b4ddfebf74367.wav\"}],\"blocks\":{}}";
             break;

         case "Amon":
             Sprite="{\"name\":\"Amon\",\"tags\":[\"people\",\"dance\"],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"60f720956ab1840431dcf0616ce98f14\",\"name\":\"amon\",\"bitmapResolution\":2,\"md5ext\":\"60f720956ab1840431dcf0616ce98f14.png\",\"dataFormat\":\"png\",\"rotationCenterX\":174,\"rotationCenterY\":162}],\"sounds\":[{\"assetId\":\"83a9787d4cb6f3b7632b4ddfebf74367\",\"name\":\"pop\",\"dataFormat\":\"wav\",\"format\":\"\",\"rate\":44100,\"sampleCount\":1032,\"md5ext\":\"83a9787d4cb6f3b7632b4ddfebf74367.wav\"}],\"blocks\":{}}";
             break;

         case "Car1":
             Sprite = "{\"name\":\"Car\",\"tags\":[\"people\",\"drawing\"],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"48668e557594bc148a7d353fbd13878a\",\"name\":\"Car\",\"bitmapResolution\":1,\"md5ext\":\"48668e557594bc148a7d353fbd13878a.png\",\"dataFormat\":\"png\",\"rotationCenterX\":100,\"rotationCenterY\":50}],\"sounds\":[],\"blocks\":{}}";
             break;

         case "Car2":
             Sprite = "{\"name\":\"Car\",\"tags\":[\"people\",\"drawing\"],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"7d25141fd5d55013c14982eebf810e29\",\"name\":\"Car\",\"bitmapResolution\":1,\"md5ext\":\"7d25141fd5d55013c14982eebf810e29.png\",\"dataFormat\":\"png\",\"rotationCenterX\":100,\"rotationCenterY\":50}],\"sounds\":[],\"blocks\":{}}";
             break;
         }
         if(Sprite!=null)
            oGUI.props.vm.addSprite(Sprite);
            break;

      case "SPRITE2":						//添加URL中图片为角色的指令：["SPRITE2","/PICTURE_URL"]
         $.get("addSprite.php?f="+jsonCOMMAND[1]+"&t=" + Math.random(), function (data)//获取文件URL
         {
            oGUI.props.vm.addSprite(data);	
         });
         break;
      }
   }
}

function Quiz2(jsonDATA)//单选、多选窗口的控制
{
   if(jsonDATA.length>1)
   {
      if(jsonDATA[1][0]==0)						//单个选项，主要用于发出提示或提醒
      {
         document.getElementById("quiz").style.visibility="hidden";	//隐藏窗口 
      }
      else
      {
         var msg_buttons=document.getElementById("msg_keys");
         msg_buttons.innerHTML='';

         if(jsonDATA[1][0]==1)						//单个选项，主要用于发出提示或提醒
         {
              var button1 = document.createElement("input");
              button1.type="button";
              button1.value="确定";
              button1.style.width="50px";
              button1.style.height="30px";
              button1.style.margin="auto 20";
              button1.onclick=function(){ checkAnswer('确定');}
              msg_buttons.appendChild(button1);
         }
         else								//正常显示A选项
         {
              var button1 = document.createElement("input");
              button1.type="button";
              button1.value="A";
              button1.style.width="40px";
              button1.style.height="30px";
              button1.style.margin="auto 20";
              button1.onclick=function(){ checkAnswer('A');}
              msg_buttons.appendChild(button1);
         }

         if(jsonDATA[1][0]>1)						//有多个选项时，显示B选项
         {
              var button2 = document.createElement("input");
              button2.type="button";
              button2.value="B";
              button2.style.width="40px";
              button2.style.height="30px";
              button2.style.margin="auto 20";
              button2.onclick=function(){ checkAnswer('B');}
              msg_buttons.appendChild(button2);
         }

         if(jsonDATA[1][0]>2)						//如果有第三个，则显示C选项
         {
              var button3 = document.createElement("input");
              button3.type="button";
              button3.value="C";
              button3.style.width="40px";
              button3.style.height="30px";
              button3.style.margin="auto 20";
              button3.onclick=function(){ checkAnswer('C');}
              msg_buttons.appendChild(button3);
         }

         if(jsonDATA[1][0]>3)						//最多显示4个选项，其它的忽略。
         {
              var button4 = document.createElement("input");
              button4.type="button";
              button4.value="D";
              button4.style.width="40px";
              button4.style.height="30px";
              button4.style.margin="auto 20";
              button4.onclick=function(){ checkAnswer('D');}
              msg_buttons.appendChild(button4);
         }
         document.getElementById("msg_text").innerHTML=jsonDATA[1][1];	//提示信息
      }
   }
}
//同组分享开关
var shareIntval=null;
function setSHARE(o)
{
   setJSCookie("SHARE",(o.checked==true?1:0),1);
   var msg = {'content': "[\"SHAREALLOWED\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
   sendMsg(msg);
   if(shareIntval==null)
   {
      shareIntval=setInterval(function(){
         var msg = {'content': "[\"SHAREALLOWED\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
         sendMsg(msg);
      }, 30000+Math.random()*20);
   }

   document.getElementById("sharemenu").style.visibility=(o.checked==true?"visible":"hidden");
   if(o.checked==false) hideShare();
   else
   {
      updateMenu();
   }
}
//互帮互助开关
var helpIntval=null;
function setHELP(o)
{
   setJSCookie("HELP",(o.checked==true?1:0),1);
   var msg = {'content': "[\"HELPALLOWED\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
   sendMsg(msg);
   if(helpIntval==null)
   {
      helpIntval=setInterval(function(){
         var msg = {'content': "[\"HELPALLOWED\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
         sendMsg(msg);
      }, 30000+Math.random()*20);
   }

   document.getElementById("helpmenu").style.visibility=(o.checked==true?"visible":"hidden");
   if(o.checked==false)
   {
      hideHelp();
   }
   else
   {
      updateMenu();
   }
}

//屏蔽操作区域开关
var bgIntval=null;
function setBG(o)
{
   setJSCookie("BG",(o.checked==true?1:0),1);
   var msg = {'content': "[\"FORCE\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
   sendMsg(msg);
   if(bgIntval==null)
   {
      bgIntval=setInterval(function(){
         var msg = {'content': "[\"FORCE\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
         sendMsg(msg);
      }, 30000+Math.random()*20);
   }
}

//屏蔽角色插入开关
var charIntval=null;
function setCHAR(o)
{
   bSelfShow=true;
   setJSCookie("CHAR",(o.checked==true?1:0),1);
   var msg = {'content': "[\"NEWCHAR\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
   sendMsg(msg);
   if(charIntval==null)
   {
      charIntval=setInterval(function(){
         var msg = {'content': "[\"NEWCHAR\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
         sendMsg(msg);
      }, 30000+Math.random()*20);
   }
}
//屏蔽背景插入开关

var bdIntval=null;
function setBD(o)
{
   bSelfShow=true;
   setJSCookie("BD",(o.checked==true?1:0),1);
   var msg = {'content': "[\"NEWBD\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
   sendMsg(msg);
   if(bdIntval==null)
   {
      bdIntval=setInterval(function(){
         var msg = {'content': "[\"NEWBD\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
         sendMsg(msg);
      }, 30000+Math.random()*20);
   }
}

//速问速答试题数据
var Quiz=Array(
/*顶部问题，下方四个图片选项一行横向的排列*/
   "[\"QUIZ\",[\"4\",\"表达1<hr><div style='position: fixed;top: 77px;left: 25px;width: 660px;'>有一个三位数，个位上为A，十位上为B，百位上为C，则这个数的十进制表达为：<hr>"+
	   		       "<div style='position: relative;'>A.&nbsp;<img src='/online2/s/30/4.png'></div>"+
			       "<div style='position: relative;'>B:&nbsp;<img src='/online2/s/30/3.png'></div>"+
			       "<div style='position: relative;'>C:&nbsp;<img src='/online2/s/30/2.png'></div>"+
			       "<div style='position: relative;'>D:&nbsp;<img src='/online2/s/30/1.png'></div>\"]]",

   "[\"QUIZ\",[\"4\",\"表达2<hr><div style='position: fixed;top: 77px;left: 25px;width: 660px;'>有一个三位数，个位上为A，十位上为B，百位上为C，每一位上的数各不相同。下面哪个表达是正确的：<hr>"+
	   		       "<div style='position: relative;'>A.&nbsp;<img src='/online2/s/31/1.png'></div>"+
			       "<div style='position: relative;'>B:&nbsp;<img src='/online2/s/31/3.png'></div>"+
			       "<div style='position: relative;'>C:&nbsp;<img src='/online2/s/31/2.png'></div>"+
			       "<div style='position: relative;'>D:&nbsp;<img src='/online2/s/31/4.png'></div>\"]]",

/*左一个图片问题，右侧选项的排列*/
   "[\"QUIZ\",[\"4\",\"循环1<hr><div style='position: relative;'><img width=250px src='/online2/s/32/1.png'></div><div style='position: fixed;top: 77px;left: 300px;width: 335px;'>当此段程序被执行后，变量“编”的值为：<hr><p>A:9<p>B:10<p>C:11<p>D:不确定</div>\"]]",
   "[\"QUIZ\",[\"2\",\"循环2<hr><div style='position: relative;'><img width=411px src='/online2/s/33/1.png'></div><div style='position: fixed;top: 77px;left: 430px;width: 280px;'>这两段代码：<hr><br>A:所用积木块一样多，所以效果一样。<p>B:由于自增位置不同，所以效果不同。</div>\"]]",
   "[\"QUIZ\",[\"2\",\"循环3<hr><div style='position: relative;'><img width=411px src='/online2/s/33/1.png'>"+
			"</div><div style='position: fixed;top: 77px;left: 430px;width: 280px;'>对于代码片段一，分析正确的是：<hr><br>A:变量“编”一进入第一个循环，就先自增1了，它在后续的循环中永不可能为“0”。<p>"+
																   "B:反正在循环中要自增的，晚增不如早增，所以放在这里很合适。</div>\"]]",
   "[\"QUIZ\",[\"2\",\"循环4<hr><div style='position: relative;'><img width=411px src='/online2/s/33/1.png'>"+
			"</div><div style='position: fixed;top: 77px;left: 430px;width: 280px;'>对于代码片段二，分析正确的是：<hr><br>A:变量“编”在第二个循环结束后，才自增1，使得在第二个循环里，“编”这个变量完整地走完了“0-10”这些数。<p>"+
																   "B:变量“编”在第二个循环结束后，才自增1，使得在第二个循环里，“编”这个变量完整地走完了“0-9”这些数。。</div>\"]]",

   "[\"QUIZ\",[\"1\",\"=========计算=================\"]]",


   "[\"QUIZ\",[\"4\",\"循环1<hr><div style='position: relative;'><img width=211px src='/online2/s/1/1.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当此段程序被执行后，变量“循环计数器”的值为：<hr><br>A:8<p>B:9<p>C:10<p>D:不确定</div>\"]]",
   "[\"QUIZ\",[\"4\",\"循环2<hr><div style='position: relative;'><img width=211px src='/online2/s/2/1.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当此段程序被执行后，变量“循环计数器”的值为：<hr><br>A:0<p>B:9<p>C:10<p>D:不确定</div>\"]]",
   "[\"QUIZ\",[\"4\",\"循环3<hr><div style='position: relative;'><img width=211px src='/online2/s/2/1.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当此段程序被执行后，变量“循环计算器”的值为：<hr><br>A:8<p>B:9<p>C:10<p>D:不确定</div>\"]]",
   "[\"QUIZ\",[\"4\",\"循环4<hr><div style='position: relative;'><img width=211px src='/online2/s/3/1.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当此段程序被执行后，变量“循环计算器”和“循环计数器”的值分别为：<hr><br>A:10,0<p>B:0,10<p>C:10,10<p>D:不确定</div>\"]]",
   "[\"QUIZ\",[\"4\",\"循环5<hr><div style='position: relative;'><img width=211px src='/online2/s/4/1.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当此段程序被执行后，变量“循环计算器”和“循环计数器”的值分别为：<hr><br>A:10,5<p>B:5,10<p>C:10,10<p>D:5,5</div>\"]]",


/*顶部问题，下方四个图片选项两行横向的排列*/
   "[\"QUIZ\",[\"4\",\"循环6<hr><div style='position: fixed;top: 77px;left: 25px;width: 660px;'>下面哪段代码可以准确地画出一个矩形？<hr>"+
	   		       "<div style='position: relative;'>A.<br><img src='/online2/s/5/1.png'></div>"+
			       "<div style='position: absolute;left: 170px;top: 43px;'>B:<br><img src='/online2/s/5/2.png'></div>"+
			       "<div style='position: absolute;left: 340px;top: 43px;'>C:<br><img src='/online2/s/5/3.png'></div>"+
			       "<div style='position: absolute;left: 510px;top: 43px;'>D:<br><img src='/online2/s/5/4.png'></div>\"]]",

   "[\"QUIZ\",[\"1\",\"===========循环==================\"]]",

   "[\"QUIZ\",[\"4\",\"判断1<hr><div style='position: fixed;top: 77px;left: 25px;width: 660px;'>下面哪段代码永远都赢不了？<hr>"+
	   		       "<div style='position: relative;'>A.<br><img src='/online2/s/12/1.png'></div>"+
			       "<div style='position: absolute;left: 320px;top: 40px;'>B:<br><img src='/online2/s/12/3.png'></div>"+
			       "<div style='position: absolute;left: 0px;top: 180px;'>C:<br><img src='/online2/s/12/2.png'></div>"+
			       "<div style='position: absolute;left: 320px;top: 180px;'>D:<br><img src='/online2/s/12/4.png'></div>\"]]",

   "[\"QUIZ\",[\"4\",\"判断2<hr><div style='position: fixed;top: 77px;left: 25px;width: 660px;'>下面哪段代码永远都能赢？<hr>"+
	   		       "<div style='position: relative;'>A.<br><img src='/online2/s/13/1.png'></div>"+
			       "<div style='position: absolute;left: 320px;top: 43px;'>B:<br><img src='/online2/s/13/2.png'></div>"+
			       "<div style='position: absolute;left: 0px;top: 170px;'>C:<br><img src='/online2/s/13/3.png'></div>"+
			       "<div style='position: absolute;left: 320px;top: 170px;'>D:<br><img src='/online2/s/13/4.png'></div>\"]]",


   "[\"QUIZ\",[\"1\",\"============逻辑判断===============\"]]",

   "[\"QUIZ\",[\"4\",\"拆分数字1<hr><div style='position: relative;'><img height=413px width=354px src='quiz/1.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当N1为1034，执行“按位逆拆分数1（N1）”后，“拆分后的数1”中的结果为：<hr><br>A:{1,0,3,4}<p>B:{4,3,0,1}<p>C:{1,3}<p>D:{3,1}</div>\"]]",
   "[\"QUIZ\",[\"4\",\"拆分数字2<hr><div style='position: relative;'><img height=413px width=354px  src='quiz/1.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当N1为1030，执行“按位逆拆分数1（N1）”后，<hr>A:最先被拆出来的是个位，放在列表最顶部。<br>B:最先被拆出来的是个位，放在列表最底部。<br>C:最先被拆出来的是千位，放在列表最顶部。<br>D:最先被拆出来的是千位，放在列表最底部。</div>\"]]",
   "[\"QUIZ\",[\"4\",\"拆分数字3<hr><div style='position: relative;'><img height=429px width=345px src='quiz/2.png'></div><div style='position: fixed;top: 77px;left:377px;width: 335px;'>当“拆分后的数2”中的值为“{1,2,4,3,5}”时，它会克隆几次？<hr>A:2次<p>B:3次<p>C:4次<p>D:5次</div>\"]]",
   "[\"QUIZ\",[\"4\",\"拆分数字4<hr><div style='position: relative;'><img height=429px width=345px  src='quiz/2.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当“拆分后的数2”中的值为“{1,4,3,5}”时，它第一个克隆的角色，显示的是哪个数字？<hr>A:1<p>B:4<p>C:3<p>D:5</div>\"]]",
   "[\"QUIZ\",[\"4\",\"拆分数字5<hr><div style='position: relative;'><img height=429px width=345px  src='quiz/2.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当“拆分后的数2”中的值为“{1,4,3,5}”时，它第二个克隆的角色，显示的是哪一位？<hr>A:个位<p>B:十位<p>C:百位<p>D:千位</div>\"]]",
   "[\"QUIZ\",[\"4\",\"拆分数字6<hr><div style='position: relative;'><img height=429px width=345px  src='quiz/2.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>“位置2”是用来控制坐标的。该角色克隆的第三个角色，相对于本体，实际执行了如下移动操作：<hr>A:向左移动60<p>B:向右移动60<p>C:向左移动120<p>D:向左移动180</div>\"]]",
   "[\"QUIZ\",[\"1\",\"=============数字拆分==============\"]]",

   "[\"QUIZ\",[\"1\",\"任务一<hr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编写程序，让赛车从起点出发，在赛道上，自动行驶，一路向右，遇到终点线才停止。\"]]",
   "[\"QUIZ\",[\"1\",\"任务二<hr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;修改程序，让赛车从起点出发，在直角赛道上，自动行驶，遇到终点线才停止。\"]]",
   "[\"QUIZ\",[\"1\",\"任务三<hr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;尝试修改程序，让赛车从起点出发，在弧形赛道上，自动行驶，遇到终点线才停止。能成功么？\"]]",
   "[\"QUIZ\",[\"1\",\"任务四<hr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;改装车辆，给赛车安装左右两个传感器（需要设置为不同的颜色），并修改程序：将<img src=./res/car/touch1.png>改为<img src=./res/car/touch2.png>。注意转弯的方向：左边碰到要右转，右边碰到要左转。\"]]",
   "[\"QUIZ\",[\"1\",\"额外任务<hr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;改装车辆，或修改程序，让赛车以最短的时间，以及最安全的方式，冲向终点。\"]]",

   "[\"QUIZ\",[\"2\",\"两个“碰到”模块的前者<hr><img src=./res/car/touch1.png>与<img src=./res/car/touch2.png><br>A:前者可以判断当前角色的前部是否碰到了其它角色或背景上的指定颜色。<BR>B:前者可以判断当前角色的任何部位是否碰到了其它角色或背景上的指定颜色。\"]]",
   "[\"QUIZ\",[\"2\",\"两个“碰到”模块的后者<hr><img src=./res/car/touch1.png>与<img src=./res/car/touch2.png><br>A:后者可以判断当前角色的指定颜色的部位是否碰到了其它角色或背景上的指定颜色。<BR>B:后者可以判断当前角色的任何部位是否碰到了指定的颜色。\"]]",
   "[\"QUIZ\",[\"2\",\"两个“碰到”模块<hr><img src=./res/car/touch1.png>与<img src=./res/car/touch2.png><br>A:前者如使用得当，能判断角色的前后左右具体部位的碰撞事件。<BR>B:后者如使用得当，能判断角色的前后左右具体部位的碰撞事件。\"]]",
   "[\"QUIZ\",[\"3\",\"遇障碍后转弯<hr>前方遇到障碍，需要转弯时，我们应该：<BR>A:立刻180°大掉头。<BR>B:90°直角向右，永远正确。<BR>C:根据实际情况适度微调。\"]]",
   "[\"QUIZ\",[\"2\",\"前进步数问题<hr>每次重复执行循环中，前进步数有讲究：<BR>A:一开始就应该调成一个很大的值，一冲到底。<BR>B:一开始宜慢速启动，安全第一。\"]]",
   "[\"QUIZ\",[\"4\",\"车辆冲出跑道<hr>我的车冲出跑道了，<BR>A:单次循环内前进步数过大。<BR>B:遇到障碍时转弯角度过大。<BR>C:车头灯太小，碰撞识别不稳定。<BR>D:以上都对。\"]]",

   "[\"QUIZ\",[\"3\",\"今天的课<hr>今天的课，我感觉：<BR>A:完全没听懂。<BR>B:有点意思。<BR>C:很有趣。\"]]",
   "[\"QUIZ\",[\"1\",\"课后思考<hr>今天这节课所学的知识，在日常生活中，有没有可以适用的场景呢？\"]]",


/*
   "[\"QUIZ\",[\"2\",\"太大了？？？？？<hr>角色的造型太大了，应该如何调整？<br>A:角色的造型太大，操作肯定在角色区附近，让我找找。<BR>B:我眼神不好，不找了。\"]]",
   "[\"QUIZ\",[\"2\",\"100？50？<hr>角色区的大小里的数值100表示什么意思？<BR>A:100%，原始大小。<BR>A:图片的长和宽都为100。\"]]",
   "[\"QUIZ\",[\"\",\"自动驾驶<hr>在执行时，不需要人进行额外的干预，程序会根据当前状况，按照预设的规则进行判断和处理。\"]]",
   "[\"QUIZ\",[\"2\",\"无路可走？<hr>如何判断前方直行方向无路可走了？<br>A:精确计算好从起点到车道尽头的距离，当实际行驶的路程达到这个距离的值时，转弯。<BR>B:用侦测里的“碰到颜色(A)？”来判断是否碰到了绿色。<BR>\"]]",
   "[\"QUIZ\",[\"2\",\"计时器<hr>计时器从打开Scratch程序，就已经开始工作了。我们可以用它来：<br>A:得到电脑当前的时间。<BR>B:得到当前程序已经运行的秒数。<BR>\"]]",
   "[\"QUIZ\",[\"2\",\"何时加？<hr>我们可以用计时器来记录车子从起点到终点一共花了多少时间。应该在哪里加“计时器归零”呢？<br>A:当绿旗被点击时立刻执行。<BR>B:碰到起点线时立刻执行<BR>C:为什么要归零？\"]]",
   "[\"QUIZ\",[\"3\",\"赛道小调查<hr>在这个新赛道里，你的车子跑丢了没？<br>A:没有，一切正常。<BR>B:跑出赛道了，但最后又跑回来了。<BR>C:跑出赛道，彻底失控了。\"]]",
   "[\"QUIZ\",[\"2\",\"复杂赛道<hr>这里有一个更复杂的赛道，你想挑战一下自己么？<br>A:算了，算了。<BR>B:来吧，来吧！\"]]",
   "[\"QUIZ\",[\"2\",\"满意么？<hr>车子一路上虽然磕磕绊绊，但最后还是到达了终点。对此，你满意么？<br>A:满意，好歹是到了终点了。<BR>B:不满意，我想改进一下。\"]]",
   "[\"QUIZ\",[\"2\",\"哪里不对？<hr>车子在某些地方会原处打转，你觉得在那个地方，它应该往哪个方向转会比较好？<br>A:右转。<BR>B:左转。\"]]",
   "[\"QUIZ\",[\"3\",\"关于左转<hr>该在何时控制车辆左转？<br>A:左边空时左转。<BR>B:右边没路时左转。<BR>C:以上都对。\"]]",
   "[\"QUIZ\",[\"2\",\"判断左右<hr>如何用侦测里的“颜色(A)碰到(B)？”来区分左右？<br>A:没区别。<BR>B:车头车灯处设置不同的颜色。\"]]",
   "[\"QUIZ\",[\"1\",\"急速前进<hr>尝试调整各类参数，使小车能以最快速度冲向终点。\"]]",
*/
);

var binited=false
function init()
{
   if(binited==true) return;
   binited=true;
   var s=document.getElementById("S");

   //s.removeAll();
   //var e=document.createElement("OPTION");
   //e.value="";
   //e.innerText="请选择试题";
   //s.appendChild(e);

   for(var i=0;i<Quiz.length;i++)
   {
      var j=$.parseJSON(Quiz[i]);
      var str=j[1][1].split("<hr>");
      var o=document.createElement("OPTION");
      o.value=(i+1);
      o.innerText=str[0];
      s.appendChild(o);
   }
}

function setQuiz(o)//预设的问题
{
   if(o.value>0)
   {
      document.getElementById("status").innerHTML='待发送';
      document.getElementById("msg_box").value=Quiz[o.value-1];
   }
}

function viewQuiz()//显示答题结果界面
{
   document.getElementById("msg_list").style.display="none";
   document.getElementById("msg_scorehistory").style.display="none";
   document.getElementById("msg_scorehistory").style.border="";
   document.getElementById("msg_score").style.display="block";
}

function viewLog()//显示系统日志界面
{
   document.getElementById("msg_list").style.display="block";
   document.getElementById("msg_scorehistory").style.display="block";
   document.getElementById("msg_scorehistory").style.border="1px solid gray;";
   document.getElementById("msg_score").style.display="none";
}

function showAttachment(o)//推送显示隐藏的附件
{
   if(o.value!="")
   {
      add("[\"ATTACHMENT\",\""+o.value+"\"]");
      document.getElementById(o.value).style.visibility="visible";//本地同步显示
      setJSCookie(o.value,"true",1);
      //document.cookie=o.value+"=true";
      //hideAllMenu();
   }
}

var bSelfShow=false;
function insertSprite(o)//推送插入素材库中的角色
{
   if(o.value!=""){ 
      bSelfShow=true;
      add("[\"SPRITE\",\""+o.value+"\"]");
   }
}

//给他人发送角色
function sendSprite(o)
{
   if(o.value!="")
   {
      bSelfShow=false;
      add("[\"SPRITEX\",\""+uname+"\",\""+
o.options[o.selectedIndex].text+"\",\""+o.value+"\"]");
   }
}

function insertSprite2(o)//推送插入URL的图片
{
   if(o.value!=""){ 
      bSelfShow=true;
      add("[\"SPRITE2\",\""+o.value+"\"]");
   }
}

function insertBackdrop(o)//推送插入素材库中的背景
{
   if(o.value!=""){ 
      bSelfShow=true;
      add("[\"BACKDROP\",\""+o.value+"\"]");
   }
}

function remoteOpenProject(o)//推送项目
{
   if(o.value!="")
   {
      bSelfShow=true;
      add("[\"PROJECT\",\""+o.value+"\"]");
   }
}

var bControl=false;
function showControlPanel()//显示/隐藏控制面板
{
   if(bControl==false) showControl();
   else hideControl();
   bControl!=bControl;
}

function hideControl()//隐藏控制面板
{
   var m=document.getElementById("morectrl");
   m.innerHTML="↓上课管理↓";

   document.getElementById("ControlPanel").style.visibility="hidden";
   bControl=false;
}

function showControl()//显示控制面面板
{
   var m=document.getElementById("morectrl");
   m.innerHTML="↑上课管理↑";

   document.getElementById("ControlPanel").style.visibility="visible";
   bControl=true;
   init();

   //if(admin==1)
   getSprites("sprites");		//上课管理里的角色列表
   //getSprites("spritestoshare");

}
</script>
<?php
}
else//学生端
{
?>
<!--学生端-->
<!--学生端速问速答没有管理菜单，只有窗口-->

<div id="quiz" style="position: absolute; left: 50%; top: 50%; width: 742px; height: 465px; transform: translate(-50%, -50%);webkit-transform: translate（-50%，-50%）;transform: translate(-50%,-50%); z-index: 1001; background-color: rgb(204, 204, 204); visibility: hidden;" >
  <div id="quizinfo" >
    <div style="width: 740px;height: 472px;"  onmousedown="drag(this,event,0)" >
      <div style="width: 740px;border: 1px solid gray;height: 462px;">
        <div style="background-color:#DC5712" >
          <div style="position:absolute; left:10px; top:5px; width: 730px;color:white;" align="left">速问速答</div>
          <div style="height:33px"></div>
        </div>
        <div style="width: 720px;border: 1px solid gray;height: 376px;left: 9px; position: absolute; top: 42px;">
          <div id="msg_text" style="width: 720px;border: 0px solid gray;height: 376px;overflow: scroll;float: left;text-align: left;"></div>
          <div id="msg_keys" style="width: 720px;border: 0px solid gray;height: 20px;float: left;text-align: center;margin: 8px auto auto auto;"> </div>
          <div style="display: none;width: 159px;height: 427px;float: left;text-align: left;">
            <p><span>当前在线:</span><span id="user_num">0</span></p>
            <div id="user_list" style="overflow: auto;"></div>
          </div>
        </div>
        <div id="msg_list" style="width: 730px;border: 0px solid gray;height: 250px;overflow: scroll;float: left;text-align: left;display:none"></div>
      </div>
    </div>
  </div>
</div>



<!--同台竞技邀请-->
<div id="invitation" style="position: absolute;left: 50%;top: 50%;width: 300px;height: 70px;transform: translate(-50%, -50%);z-index: 999;background-color: rgb(204, 204, 204);visibility: hidden;">
  <div style="background-color: #8A977B;">
    <div style="position:absolute;left: -2px;top: 5px;width: 120px;color:floralwhite" align="center">同台竞技邀请</div>
    <div onmousedown="drag(this,event,0)" align="right"><img style="position: relative;height:24px;width:24px;right: 5px; top: 5px;" src="./img/close.png" title="我弃权" alt="我弃权" onclick="hideInvitation();"><hr></div>
  </div>
  <div align="center" style="position: absolute;width:300px;height: 80px;background-color: orange;overflow: auto;margin: auto;z-index:99;top:33px;">
    <span style="position: absolute;left: 44px;top: 12px; color:brown;">本次比赛，我将派出：<br><select style="position:absolute;left:0px;top:30px;width:120px;" id="spritetofight" onchange="choosetofight();"></select></span>
  </div>
</div>
<!--同台竞技邀请结束-->



<script type="text/javascript">

var bQuizshow=false;
var nQuziType=0;
var bHelpAllowed=false;
var bPlayer=false;

function showInvitation()
{
   getSprites("spritestoshare");
   var o=document.getElementById("invitation");
   o.style.visibility="visible";

   var sprites=document.getElementById("spritestoshare");
   var spritetofight=document.getElementById("spritetofight");
   if(spritetofight.length>0) spritetofight.length=0;
   for(var i=0;i<sprites.length;i++)
   {
      spritetofight.add(new Option(sprites[i].text,sprites[i].value));
   }
}

function hideInvitation()
{
   var o=document.getElementById("invitation");
   o.style.visibility="hidden";
}

function choosetofight()
{
   var spritetofight=document.getElementById("spritetofight");
   if(spritetofight.options[spritetofight.selectedIndex].value!="")
   {
      if(confirm("你确定要指派“"+spritetofight.options[spritetofight.selectedIndex].text+"”参加比赛么？\r\n\r\n一旦选定，将无法更改。\r\n\r\n提交后，请耐心等待老师的下一步指令。")==1)
      {
         strInvited=spritetofight.options[spritetofight.selectedIndex].text;						//指定Scratch要上报坐标等参数的角色名。实际作用于scratch-gui.js
         hideInvitation();
/*
         //保存第一个角色造型
         var arrCostumes=oGUI.props.vm.runtime.targets[1].getCostumes();
         //此处需要调整，将图片等资源，跟数据共享一样处理：以文件的形式保存下来，且不用POST这种异步方式。//下一个处理位置，请去play.php页面查看：NP
         for(i=0;i<arrCostumes.length;i++)//保存所有的造型到服务器
         {
            $.post("saveSprite.php?t=" + Math.random(), { "S":arrCostumes[i].asset.encodeDataURI(),"N":arrCostumes[i].md5}, function (data) {});
         }
         //alert("您已受邀参加公开赛，请点击确定按钮后，停止一切操作，耐心等待比赛的开始。");
	 //向播放器注册当前用户
         var content="[\"NP\",\""+uname+
	  	          "\",["+oGUI.props.vm.runtime.targets[1].x+","+oGUI.props.vm.runtime.targets[1].y+","+oGUI.props.vm.runtime.targets[1].direction+","+oGUI.props.vm.runtime.targets[1].size+"],\""+
			  oGUI.props.vm.runtime.targets[1].getCurrentCostume().md5+"\"]";		//收到邀请后，注册信息。
*/

         var content="[\"NP\",\""+uname+"\",0,\""+spritetofight.options[spritetofight.selectedIndex].value+"\"]";
         var msg = {'content':content, 'type': 'user', 'to':'Stage'};		//定向发送给Stage
         sendMsgPlay(msg);
      }
   }
}

function dealCommand(jsonCOMMAND)//接收到广播数据后，判断该执行什么操作。
{
   if(jsonCOMMAND.length>1)
   {
      var Sprite=null;
      switch(jsonCOMMAND[0])
      {
      case "GROUP"://收到分组控制指令
         if(jsonCOMMAND[1]==0)//关闭分组
         {
            bGroup=false;
            hideShare();

         }//刷新文件列表
         else
         {
            bGroup=true;
            if(document.getElementById("sharemenu").style.visibility=="visible")      
               showShare();
         }
         loadFolder(classid);
         nCurrentGroup=jsonCOMMAND[1];
         setJSCookie(GROUP,nCurrentGroup,1);
         //document.cookie="GROUP="+nCurrentGroup;
         updateGroupMember(nCurrentGroup);
         break;

      case "INVITATION"://邀请加入投屏。Chrome浏览器不用确认alert，Edge必须确认后才表示邀请成功。
         //bInvited=true;							//已被邀请，可以在control.js:updateNP()里向Stage发送数据了。
         oGUI.props.vm.runtime.stopAll();

         showInvitation();


         break;
      case "GREENFLAG"://远程激发绿旗点击事件
         oGUI.props.vm.runtime.greenFlag();
         break;

      case "STOPALL"://关闭投屏
         oGUI.props.vm.runtime.stopAll();
         //bInvited=false;
         strInvited="";
         break;

      case "LATEST"://关闭投屏
         cancelit();
         break;

      case "PROJECT":
         if(jsonCOMMAND[1]!="0")
         {
            if(jsonCOMMAND[1].indexOf("_NOSHOW_")==0) return ;		//_NOWSHOW_：学生端无动作

            oGUI.props.vm.downloadProjectId(jsonCOMMAND[1]);		//通过URL打开文件
            if(jsonCOMMAND[1].indexOf("_EDITABLE_")===0)		//_EDITABLE_:学生端可编辑。否则只能播放。
               bCodeViewableFile = true;
            else
               bCodeViewableFile = false;
            updateScreenMode();						//文档打开后，更新界面控制。
         }
         else								//新建文档
         {
            createNew();
            bCodeViewableFile = true;
            updateScreenMode();
         }
         break;
      case "BACKDROP":						//添加资源库中背景图片的指令：["BACKDROP","Arctic"]
         switch(jsonCOMMAND[1])
         {
         case "Arctic":
            var vmBackdrop = {name: "Arctic", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oGUI.props.vm.addBackdrop("67e0db3305b3c8bac3a363b1c428892e.png",vmBackdrop);//只有图片文件在./editor/static/asset/下才可正常访问。
            break;

         case "Race0":
            var vmBackdrop = {name: "RaceDrop0", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oGUI.props.vm.addBackdrop("9cede097207106da21dffe23c9df5697.png",vmBackdrop);
            break;

         case "Race1":
            var vmBackdrop = {name: "RaceDrop1", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oGUI.props.vm.addBackdrop("a1d8253c6ca4fd8444396e19cbe71f16.png",vmBackdrop);
            break;
         
         case "Race2":
            var vmBackdrop = {name: "RaceDrop2", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oGUI.props.vm.addBackdrop("fc4bbac80c039a906ddb98f35738aef3.png",vmBackdrop);
            break;

         case "Race3":
            var vmBackdrop = {name: "RaceDrop3", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oGUI.props.vm.addBackdrop("0fc9051769c12f34562e0d04d611fb58.png",vmBackdrop);
            break;

         case "Race4":
            var vmBackdrop = {name: "RaceDrop4", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oGUI.props.vm.addBackdrop("0c340990dcb577abcaea44c3f7154922.png",vmBackdrop);
            break;
         
         case "Race5":
            var vmBackdrop = {name: "RaceDrop5", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oGUI.props.vm.addBackdrop("8f83c1427874dbbed970182f3bc7b364.png",vmBackdrop);
            break;
         }
         break;

      case "BACKDROP2":						//添加URL中图片为背景的指令：["BACKDROP","./fileurl"]
         $.get("addBackdrop.php?f="+jsonCOMMAND[1]+"&t=" + Math.random(), function (data)//获取文件URL
         {
            //var vmBackdrop = {name: "Arctic", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oGUI.props.vm.addBackdrop(jsonCOMMAND[1],$.parseJSON(data));
         });
         break;

      case "SPRITEX":						//他人共享过来的角色：["SPRITEX","Script File MD5"]
         if(jsonCOMMAND[3].length==32)
         {
            shareComing(jsonCOMMAND[1],jsonCOMMAND[2],jsonCOMMAND[3]);
         }
         break;
      case "SPRITE":						//添加资源库中角色的指令：["SPRITE","Amon"]
         switch(jsonCOMMAND[1])
         {
         case "Abby":
             Sprite="{\"name\":\"Abby\",\"tags\":[\"people\",\"person\",\"drawing\"],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"809d9b47347a6af2860e7a3a35bce057\",\"name\":\"abby-a\",\"bitmapResolution\":1,\"md5ext\":\"809d9b47347a6af2860e7a3a35bce057.svg\",\"dataFormat\":\"svg\",\"rotationCenterX\":31,\"rotationCenterY\":100},{\"assetId\":\"920f14335615fff9b8c55fccb8971984\",\"name\":\"abby-b\",\"bitmapResolution\":1,\"md5ext\":\"920f14335615fff9b8c55fccb8971984.svg\",\"dataFormat\":\"svg\",\"rotationCenterX\":31,\"rotationCenterY\":100},{\"assetId\":\"34a175600dc009a521eb46fdbbbeeb67\",\"name\":\"abby-c\",\"bitmapResolution\":1,\"md5ext\":\"34a175600dc009a521eb46fdbbbeeb67.svg\",\"dataFormat\":\"svg\",\"rotationCenterX\":32,\"rotationCenterY\":100},{\"assetId\":\"45de34b47a2ce22f6f5d28bb35a44ff5\",\"name\":\"abby-d\",\"bitmapResolution\":1,\"md5ext\":\"45de34b47a2ce22f6f5d28bb35a44ff5.svg\",\"dataFormat\":\"svg\",\"rotationCenterX\":32,\"rotationCenterY\":101}],\"sounds\":[{\"assetId\":\"83a9787d4cb6f3b7632b4ddfebf74367\",\"name\":\"pop\",\"dataFormat\":\"wav\",\"format\":\"\",\"rate\":44100,\"sampleCount\":1032,\"md5ext\":\"83a9787d4cb6f3b7632b4ddfebf74367.wav\"}],\"blocks\":{}}";
             break;

         case "Amon":
             Sprite="{\"name\":\"Amon\",\"tags\":[\"people\",\"dance\"],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"60f720956ab1840431dcf0616ce98f14\",\"name\":\"amon\",\"bitmapResolution\":2,\"md5ext\":\"60f720956ab1840431dcf0616ce98f14.png\",\"dataFormat\":\"png\",\"rotationCenterX\":174,\"rotationCenterY\":162}],\"sounds\":[{\"assetId\":\"83a9787d4cb6f3b7632b4ddfebf74367\",\"name\":\"pop\",\"dataFormat\":\"wav\",\"format\":\"\",\"rate\":44100,\"sampleCount\":1032,\"md5ext\":\"83a9787d4cb6f3b7632b4ddfebf74367.wav\"}],\"blocks\":{}}";
             break;

         case "Car1":
             Sprite = "{\"name\":\"Car\",\"tags\":[\"people\",\"drawing\"],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"48668e557594bc148a7d353fbd13878a\",\"name\":\"Car\",\"bitmapResolution\":1,\"md5ext\":\"48668e557594bc148a7d353fbd13878a.png\",\"dataFormat\":\"png\",\"rotationCenterX\":100,\"rotationCenterY\":50}],\"sounds\":[],\"blocks\":{}}";
             break;

         case "Car2":
             Sprite = "{\"name\":\"Car\",\"tags\":[\"people\",\"drawing\"],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"7d25141fd5d55013c14982eebf810e29\",\"name\":\"Car\",\"bitmapResolution\":1,\"md5ext\":\"7d25141fd5d55013c14982eebf810e29.png\",\"dataFormat\":\"png\",\"rotationCenterX\":100,\"rotationCenterY\":50}],\"sounds\":[],\"blocks\":{}}";
             break;
         }
         if(Sprite!=null)
            oGUI.props.vm.addSprite(Sprite);
            break;

      case "SPRITE2":						//添加URL中图片为角色的指令：["SPRITE2","/PICTURE_URL"]
         $.get("addSprite.php?f="+jsonCOMMAND[1]+"&t=" + Math.random(), function (data)//获取文件URL
         {
            oGUI.props.vm.addSprite(data);	
         });
         break;

      case "ATTACHMENT":					//显示被隐藏的附件的指令：["ATTACHMENT","ATTACHMENT_ID"]
         //hideAllMenu();
         if(document.getElementById(jsonCOMMAND[1]).style.visibility!="visible")
         {
            setJSCookie(jsonCOMMAND[1],"true",1);
            //document.cookie=jsonCOMMAND[1]+"=true";
            //alert("有新附件来了。");
            //document.getElementById("NEWMESSAGE").innerHTML="任务里来<br>新附件了。";
            document.getElementById("moretask").innerHTML=document.getElementById("moretask").innerHTML[0]+ "任务<font color=red>*</font>"+ document.getElementById("moretask").innerHTML[0];
         }
         document.getElementById(jsonCOMMAND[1]).style.visibility="visible";
         break;

      case "MENU":						//隐藏所有菜单，只开启任务窗口的指令：["MENU",0]
         hideAllMenu();
         break;

      case "QUIZ":						//速问速答指令：["QUIZ","[\"TYPE\"],[\"DATA\"],[\"CHOOSE\"],[\"KEY\"]"]
         Quiz(jsonCOMMAND[1]);
         break;

      case "FORCE":						//强制开启背景：["FORCE","1|0"]
         if(jsonCOMMAND[1]=="1")
         {
            bHelpAllowed=true;
            setJSCookie("BG",1,1);
            //document.cookie="BG=1";
            document.getElementById("waiting").style.visibility="visible";
            document.getElementById("waiting").style.zIndex="1000";
            hideAll();
         }
         else
         {
            bHelpAllowed=false;
            if(bHelped==true)//正在被帮助
            {
               alert("互助功能已经关闭，请尽快完成当前帮助操作。");
            }
            else
            {
               setJSCookie("BG",0,1);
               //document.cookie="BG=0";
               document.getElementById("waiting").style.visibility="hidden";
               document.getElementById("waiting").style.zIndex="990";
            }
         }
         break;

      case "NEWCHAR":						//是否允许添加角色：["NEWCHAR","1|0"]
         if(jsonCOMMAND[1]=="1")
         {
            setJSCookie("CHAR",1,1);
            //document.cookie="CHAR=1";
            setNewControl();//./js/control.js
         }
         else
         {
            setJSCookie("CHAR",0,1);
            //document.cookie="CHAR=0";
            setNewControl();
         }
         break;

      case "NEWBD":						//是否允许添加舞台背景：["NEWBD","1|0"]

         if(jsonCOMMAND[1]=="1")
         {
            setJSCookie("BD",1,1);
            //document.cookie="BD=1";
            setNewControl();
         }
         else
         {
            setJSCookie("BD",0,1);
            //document.cookie="BD=0";
            setNewControl();
         }
         break;

      case "HELPALLOWED":					//允许互帮互助：["FORCE","1|0"]
         if(jsonCOMMAND[1]=="1")
         {
            setJSCookie("HELP",1,1);
            //document.cookie="HELP=1";
            document.getElementById("helpmenu").style.visibility="visible";
         }
         else
         {
            setJSCookie("HELP",0,1);
            //document.cookie="HELP=0";
            document.getElementById("helpmenu").style.visibility="hidden";
            hideHelp();
         }
         updateMenu();
         break;

      case "SHAREALLOWED":					//允许互帮互助：["FORCE","1|0"]
         if(jsonCOMMAND[1]=="1")
         {
            setJSCookie("SHARE",1,1);
            //document.cookie="SHARE=1";
            document.getElementById("sharemenu").style.visibility="visible";
         }
         else
         {
            setJSCookie("SHARE",0,1);
            //document.cookie="SHARE=0";
            document.getElementById("sharemenu").style.visibility="hidden";
            hideShare();
         }
         updateMenu();
         break;

      case "ACK2":						//申请帮助：["ACK1","帮助者","求助者"]
         if(jsonCOMMAND[1]==uname)				//jsonCOMMAND[1]不是自己，则表示是别人的求助，或者是帮助者的应答。
         {
             alert(jsonCOMMAND[2]+ " 已同意，赶紧过去看看吧。");
         }
         else
         {
             var h=document.getElementById("helplist");
             for(var n=1;n<h.children.length;n++)
             {
                if(h.children[n].innerHTML==jsonCOMMAND[2]) {h.removeChild(h.children[n]);break;}
             }
         }
         break;

      case "ACK3":						//申请帮助：["ACK1","帮助者","求助者"]
         if(jsonCOMMAND[1]==uname)				//jsonCOMMAND[1]不是自己，则表示是别人的求助，或者是帮助者的应答。
         {
             alert("很遗憾，"+jsonCOMMAND[2]+ " 拒绝了你的请求。");
         }
         else
         {
             var h=document.getElementById("helplist");
             for(var n=1;n<h.children.length;n++)
             {
                if(h.children[n].innerHTML==jsonCOMMAND[2]) {h.removeChild(h.children[n]);break;}
             }
         }
         break;

      case "ACK":						//受邀应答：["ACK","帮助者","求助者"]
         if(jsonCOMMAND[2]==uname)				//帮助者收到受邀应答，可以去帮忙了。
         {
            if(bHelped==false)				//当前处于无人帮助状态
            {
               if(confirm("你是否愿意让 "+jsonCOMMAND[1]+ " 来帮你？")==true)
               {
                  bHelped=true;				//先来先到，阻止其他人的帮助
                  strHelper=jsonCOMMAND[1];
                  content="[\"ACK2\",\""+jsonCOMMAND[1]+"\",\""+jsonCOMMAND[2]+"\"]";//帮助者如收到此指令，就可以出发了。
                  var msg = {'content': content, 'type': 'user'};
                  sendMsg(msg);
                  document.getElementById("check").style.display="none";
                  document.getElementById("check").checked=false;
                  document.getElementById("txt").innerHTML=jsonCOMMAND[1]+" 同学帮到你了么？";
                  document.getElementById("txt").style.left="0px";
                  document.getElementById("txt").onclick=function(){goodhelping(this);};
               }
               else
               {
                  strHelper=jsonCOMMAND[1];
                  content="[\"ACK3\",\""+jsonCOMMAND[1]+"\",\""+jsonCOMMAND[2]+"\"]";//帮助者如收到此指令，就可以出发了。
                  var msg = {'content': content, 'type': 'user'};
                  sendMsg(msg);
               }

            }
         }
         break;

      case "SAVEFILE":
         saveOnline();
         //alert("吴老师刚来执行了远程收作业操作。\r\n\r\n如果你的任务还没完成，可以继续修改。修改后，请手动点击“文件”菜单中的“上传文件到服务器”按钮。");
         break;
      case "HELP":						//1.求助指令：["HELP","求助者"] 	2.帮助指令：["HELP","帮助者","求助者"]
/*
HELP,求助者	
求助者：鼠标点击主动发出
其他人：被动接收，菜单添加

HELP，求助者，求助者
求助者：鼠标点击主动发出
帮助者：忽略
其他人：删除求助者的菜单

ACK1，帮助者，求助者
帮助者：鼠标点击主动发出
求助者：弹窗确认是否接受帮助
       接受帮助，则发送ACK指令
其他人：忽略

ACK2，帮助者，求助者
帮助者：弹窗，提醒去帮忙
求助者：对方正在赶来
其他人：删除求助者的菜单
*/
         if(jsonCOMMAND[1]!=uname)				//jsonCOMMAND[1]不是自己，则表示是别人的求助，或者是帮助者的应答。
         {
            if(jsonCOMMAND[2]==undefined)			//如第三个参数未定义，则此条是求助信息。
            {
               helpneeded(jsonCOMMAND[1]);
            }
            else						//否则就是帮助者的应答
            {
               if(jsonCOMMAND[1]==jsonCOMMAND[2])		//否则，表示跟自己无关，但需要从列表中删除求助者信息，因为有人去帮忙了。
               {
                  var h=document.getElementById("helplist");
                  for(var n=1;n<h.children.length;n++)
                  {
                     if(h.children[n].innerHTML==jsonCOMMAND[2]) {h.removeChild(h.children[n]);break;}
                  }
               }
            }
         }
         break;
      }
   }
}

function loadBG(n)
{
   switch(n)
   {
   case "1":
      var vmBackdrop = {name: "RaceDrop1", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
      oGUI.props.vm.addBackdrop("a1d8253c6ca4fd8444396e19cbe71f16.png",vmBackdrop);
      break;
        
   case "2":
      var vmBackdrop = {name: "RaceDrop2", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
      oGUI.props.vm.addBackdrop("fc4bbac80c039a906ddb98f35738aef3.png",vmBackdrop);
      break;

   case "3":
      var vmBackdrop = {name: "RaceDrop4", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
      oGUI.props.vm.addBackdrop("0c340990dcb577abcaea44c3f7154922.png",vmBackdrop);
      break;
         
   case "4":
      var vmBackdrop = {name: "RaceDrop5", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
      oGUI.props.vm.addBackdrop("8f83c1427874dbbed970182f3bc7b364.png",vmBackdrop);
      break;

   case "g":
      oGUI.props.vm.downloadProjectId("bean_eater.SB3");
      bCodeViewableFile = false;
      updateScreenMode();
      break;

   case "x":
      oGUI.props.vm.downloadProjectId("_EDITABLE_start.sb3");
      break;
   }
}

function Quiz(jsonDATA)//单选、多选窗口的控制
{
   if(jsonDATA.length>1)
   {
      if(jsonDATA[0]==='0')						//单个选项，主要用于发出提示或提醒
      {
         document.getElementById("quiz").style.visibility="hidden";	//隐藏窗口 
      }
      else  if(jsonDATA[0]==='')						//单个选项，主要用于发出提示或提醒
      {
         var msg_buttons=document.getElementById("msg_keys");
         msg_buttons.innerHTML='';
         document.getElementById("msg_text").innerHTML=jsonDATA[1];	//提示信息
         document.getElementById("quiz").style.visibility="visible";	//隐藏窗口 
      }
      else
      {
         var msg_buttons=document.getElementById("msg_keys");
         msg_buttons.innerHTML='';

         if(jsonDATA[0]==1)						//单个选项，主要用于发出提示或提醒
         {
              var button1 = document.createElement("input");
              button1.type="button";
              button1.value="确定";
              button1.style.width="50px";
              button1.style.height="30px";
              button1.style.margin="auto 20";
              button1.onclick=function(){ Answer('确定');}
              msg_buttons.appendChild(button1);
         }
         else								//正常显示A选项
         {
              var button1 = document.createElement("input");
              button1.type="button";
              button1.value="A";
              button1.style.width="40px";
              button1.style.height="30px";
              button1.style.margin="auto 20";
              button1.onclick=function(){ Answer('A');}
              msg_buttons.appendChild(button1);
         }

         if(jsonDATA[0]>1)						//有多个选项时，显示B选项
         {
              var button2 = document.createElement("input");
              button2.type="button";
              button2.value="B";
              button2.style.width="40px";
              button2.style.height="30px";
              button2.style.margin="auto 20";
              button2.onclick=function(){ Answer('B');}
              msg_buttons.appendChild(button2);
         }

         if(jsonDATA[0]>2)						//如果有第三个，则显示C选项
         {
              var button3 = document.createElement("input");
              button3.type="button";
              button3.value="C";
              button3.style.width="40px";
              button3.style.height="30px";
              button3.style.margin="auto 20";
              button3.onclick=function(){ Answer('C');}
              msg_buttons.appendChild(button3);
         }

         if(jsonDATA[0]>3)						//最多显示4个选项，其它的忽略。
         {
              var button4 = document.createElement("input");
              button4.type="button";
              button4.value="D";
              button4.style.width="40px";
              button4.style.height="30px";
              button4.style.margin="auto 20";
              button4.onclick=function(){ Answer('D');}
              msg_buttons.appendChild(button4);
         }
         document.getElementById("msg_text").innerHTML=jsonDATA[1];	//提示信息
         document.getElementById("quiz").style.visibility="visible";	//显示窗口
      }
   }
}

function showQuiz()//问卷的显示与关闭
{
   if(bQuizshow==false) showQuiz();
   else hideQuiz();
   bQuizshow!=bQuizshow;
}

function hideWindow()//已废弃
{
   document.getElementById("sysinfo").style.visibility="hidden";
}

function showWindow()//已废弃
{
   document.getElementById("sysinfo").style.visibility="visible";
}

function Question(str)//已废弃
{
   document.getElementById("msg_text").innerHTML=str;
   document.getElementById("quiz").style.visibility="visible";
}

function Answer(str)//学生答题
{
   content=str;
   var msg = {'content': "QUIZKEY_"+content, 'type': 'user', 'lastID':lastID};//lastID用于标记答题情况，防止已答题者刷新页面，重新获得答题权限。

   sendMsg(msg);
   document.getElementById("quiz").style.visibility="hidden";
   setJSCookie("QuizID",lastID,1);
   //document.cookie="QuizID="+lastID;
}
</script>
<?php
}//教师端和学生端的切换结束
?>

<!-- Scratch3.0 HTML5 Control Scripts -->
<script src=./js/control.js></script>

<!-- Scratch3.0 HTML5 Scripts -->
<script src="./js/projects.intl.js"></script><!-- Translate title element -->
<script src="./js/common.bundle.js"></script><!-- Vendor & Initialize (Session & Localization) -->
<script src="./js/projects.bundle.js"></script><!-- Webpack -->

<!-- Teaching Platform Websocket Scripts -->
<script src="./js/websocket.js"></script>
<script src="./js/playsocket.js"></script>
<script type="text/javascript">

   var uname = "<?php echo $username;?>";
   var strWebSocketServerURL="ws://<?php echo $WSSERVER;?>:8081";
   createWebSocket(strWebSocketServerURL);

   var strWebSocketPlayURL="ws://<?php echo $WSSERVER;?>:8091";
   initPlay(strWebSocketPlayURL);
</script>


    </body>
</html>
