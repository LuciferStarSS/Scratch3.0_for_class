<?php
error_reporting(0);
$username=isset($_COOKIE['USERNAME'])?$_COOKIE['USERNAME']:"";
if($username=="") header("Location: /class/");

include("../include/config.inc.php");

$classid=isset($_COOKIE['CLASSID'])?intval($_COOKIE['CLASSID']):"";
if($classid!="")
   $gradeid=$grades[$classid-1];
else
   $gradeid=isset($_COOKIE['GRADEID'])?intval($_COOKIE['GRADEID']):0;

$ip=getenv("REMOTE_ADDR");

$room=0;			//教室编号直接从IP获取
if(isset($teacher_room[$ip]))	//教师访问
{
   $room=$teacher_room[$ip][1];
   $username=$teacher_room[$ip][0];
}
else				//学生访问
{
   $ips=explode('.',$ip);				//拆分IP，根据IP段确定计算机教室
   if(isset($student_room[$ips[2]]))
   {
      $room=$student_room[$ips[2]][0];
   }
}

$filenamepath= "../include/".$room."_task.inc.php";
$projname=@file_get_contents($filenamepath);

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
     <link rel="shortcut icon" href="/favicon.ico" />
     <link rel="stylesheet" href="./css/lib/normalize.min.css" />

     <!-- Polyfills -->
     <script src="./js/polyfill.min.js"></script>
     <script>
        var oGUI=null;
        var oVIEW=null;
        var oVMLISTENER=null;
        var oGUIX=null;
        var oSB3FILE=null;
     </script>
<script src=./js/jquery.js></script>
<script src=./js/drag.js></script>
<script>
var strCurrentUser="<?php echo (isset($_COOKIE['USERNAME'])?$_COOKIE['USERNAME']:"NONE");?>";
var saved=0;
var classid='<?php echo $_GET['c'];?>';
var folder="";
var filename="<?php echo $projname;?>";
</script>


<style>
  #container {
    visibility:hidden;
    border: 1px solid #aaa;
    position: absolute;
    left: 0px;
    top: 0px;
    width:100%;
    height:100%;
    z-index: 9999;
  }
  .box
  {
    font-size:80px;
    color:red;
    line-height: 100px;
    text-align: center;
    position: absolute;
    top: 50%;
    margin-top: -50px;
    display: -moz-box;
    -moz-box-pack: center;
    -moz-box-align: center;
    width: 100%;
}
</style>

    </head>

    <body>



<!--加载遮罩-->
<div id=waiting style="position:absolute; left: 0px; top: 0px; width:100%; height: 100%; z-index:999;background-color: #a0a0a0; visibility:hidden; ">
<div height=100% width=100% style="margin:0 auto;position:relative;top:50%;"></div>
</div> 
<!--加载遮罩-->

<!--任务分发-->
<div style="position:absolute; right:0px; top: 0px; width: 20px; height: 80px; z-index:999;background-color: #DC5712; "  onclick="showmenu(1);">
  <a name=moretask id=moretask><font size=2>&lt;&lt;</font></a>任务
</div>

<div  id=task id=task style="position:absolute; left: 0px; top: 0px; width:490px; height: 260px; z-index:999;background-color: #CCCCCC; display:none ">
   <div id=tasks >
<div  onmousedown="drag(this,event,0)" style="background-color:#DC5712"><div  style="position:absolute; left:0px; top:5px; width: 470px;" align=center>任务</div><div align=right><img height=24 width=24 src=./img/close.png onclick="showmenu(1);"><hr></div></div>

<?php
if($gradeid!="")
{
   $data=file_get_contents("../task/$room/$gradeid/task.txt");
   echo "<textarea   onmousedown=\"drag(this,event,0)\"  readonly style='margin: 0px; width: 486px; height: 212px; font-size:12px'>".$data."</textarea>";
   echo "<br>";
   $add="../task/$room/$gradeid/attach/";

   $files=Array();//对文件进行排序
   $date_arr=Array();//获取作业日期
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

<style> 
.attachments { width:190px; float:left;background:gray;overflow-y:scroll; overflow-x:scroll;}
.div-inline{ display:inline-block;outline-style:auto;} 
.max { width: auto; height:auto; }
.minv { width: 100px; height:100px; }
body {font-size:16px;}

</style> 

      <div class=attachments id=atta style="position:absolute; left: 0px; top: 260px; width:490px; overflow-x: hidden; overflow-y: hidden;" ">

         <div class="heartPic" align=left><div id=hidden style="visibility:hidden"><!--input type=button onClick="auto1();" value="花朵"--><!--font color=red>隐藏技能开启：</font><input type=button onClick="auto2();" value="画正多边形"><input type=button onClick="auto1();" value="画正多角星"><br--></div><?php
   for($i=0;$i<$dc;$i++)
   {
       echo "";
       $l=strlen($dates[$i]);
       $rest = strtolower( substr($dates[$i],$l-3 ,$l ));
       if($rest=="png" ||$rest=="bmp" || $rest=="jpg"  || $rest=="gif") echo "<div class=div-inline  onmousedown=\"drag(this,event,1)\" ><font color=red size=2>".$dates[$i]."</font><br><img width=100 onclick=clickonme(this) class=min border=1 src='$add$dates[$i]'  alt=\"点击缩放图片\"  title=\"点击缩放图片\"></div>";
       else if($rest=="swf")    echo "<div class=div-inline><p><EMBED align=right src=".$add.$dates[$i]." width=490 height=440 type=application/x-shockwave-flash quality=high></EMBED><p><p></div>";
       else if($rest=="mp4") echo "<div class=div-inline><input type=button onclick='showvideo(\"".md5($add.$dates[$i])."\")' value=\"".$dates[$i]."\"><br><object class=minv id=\"".md5($add.$dates[$i])."\" width=490 height=420 data=\"".$add.$dates[$i]." \" autoplay=\"false\" autostart=false><param name=\"autostart\" value=\"false\"/></object></div>";

       else echo "<a href='dl.php?n=$add$dates[$i]&f=".$dates[$i]."' target=_blank>".$dates[$i]."</a>".(($admin==1)?"<a href='delfile.php?n=$add/$dates[$i]' target=_blank>删除</a>":"")."</div>";
       echo "";
   }
?>
         </div>
      </div>
<?php
}
?>
   </div>
</div> 
<!--任务分发-->
<script>
var bLarger=0;
function showvideo(id)
{
   $("#"+id).toggleClass("minv");
}
function clickonme(id){
   $(id).toggleClass("max");

   //bLarger=!bLarger;
   //var o=document.getElementById("atta");
   //if(bLarger==1)
   //   o.style.height+="600px";
   //else
   //   o.style.height="190px";
}

</script>



       <div id="container" style="position:absolute"><div class=box>请拖拽您的Scratch项目文件到此处</div></div>
       <div id="app"></div>



<!--文件列表提示-->
<!--控制条-->
<div style="position:absolute; right:0px; top: 80px; width: 20px; height: 80px; z-index:999;background-color: #E58308; "  onclick="showmenu(2);">
  <a name=morefiles id=morefiles><font size=2>&lt;&lt;</font></a>文件
</div>
<!--内容-->
<div id=files id=files style="position:absolute; right:20px; top: 0px; width: 210px; height: 500px; z-index:999;background-color: #F0F0F0; display:none ">
<div style="background-color:#E58308"><div style="position:absolute; right:24px; top: 5px; width: 180px;" align=center>文件</div><div align=right><img height=24 width=24 src=./img/close.png onclick="showmenu(2);"><hr></div></div>
<div  align=center><?php echo $username;?>，欢迎回来！</div><hr>   <div align=center>新建：<input id=newp name=newp type=button value="<?php echo $projname==""?"新建游戏":$projname;?>" onclick="createNew('<?php echo $projname;?>');"><hr>
<?php
if(isset($scratch_class[$username]))//教师访问
{
?>班级<br><select id=c name=c onChange="loadFolder(this.value);" style="size:2;">
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
?><br>日期<img src=./img/refresh.png width=12 height=12 onclick="loadFolder(classid);" alt="刷新日期" title="刷新日期"><br><select id=d name=d onChange="loadFilelist(classid,this.value);"  size=1></select><br><!--input type=button value="刷新日期" onClick="loadFolder(classid);"><br-->
文件<img src=./img/refresh.png width=12 height=12 onclick="loadFilelist(classid,folder);" alt="刷新文件列表" title="刷新文件列表"><br><select id=f name=f   onmousedown="if(this.options.length>10){this.size=12;document.getElementById('files').style.height='650px';}"  onChange="loadOldProjectFile(this);" style="width: 206px;"   size=1></select><br><!--input type=button value="刷新文件列表" onClick="loadFilelist(classid,folder);"><br-->
<?php
if(isset($_COOKIE['USERNAME']) && isset($scratch_class[$_COOKIE['USERNAME']]))//=="吴老师" || $_COOKIE['USERNAME']=="矫老师"))
{
?><hr><!--input type=button onClick="auto1();" value="1"><input type=button onClick="auto2();" value="2"--><input type=button id=mode name=mode onClick="setEditMode();" value="播放模式"></a>&nbsp;<input type=button onClick="Release();" value="佳作推荐">
<?php
}
?>&nbsp;<input type=button onclick="getScreenshot();" value="我要上榜"><hr><img style="visibility:hidden"  id=cancel name=cancel src="img/cancel.png" width=20 height=20 alt="撤销" title="撤销" onclick="cancelit();">&nbsp;<img  style="visibility:hidden"   id=redo name=redo width=20 height=20 src="img/redo.png" alt="重做" title="重做" onclick="redoit();"><br>
<hr><input id=ul name=ul type=button value="上传文件到服务器" onclick="saveOnline();" style="visibility:hidden"><br>
<a id=autosavestatus></a>
<br><font size=2>关于备份恢复：如果浏览器异常导致数据丢失，请刷新页面后，执行如下操作：1.新建；2.选择日期。</font>
</div>
</div> 
<!--文件列表提示-->

<!--讨论提示-->
<div style="position:absolute; right:0px; top: 160px; width: 20px; height: 80px; z-index:999;background-color: #F4D000; "  onclick="showmenu(3);">
  <a name=moremsg id=moremsg><font size=2>&lt;&lt;</font></a><a id=titleinfo>社区</a>
</div> 
<div id=talk id=talk style="position:absolute; right:20px; top: 0px; width: 210px; height: 500px; z-index:999;background-color: #CCCCCC; display:none ">
<div style="background-color:#F4D000"><div  style="position:absolute; right:24px; top: 5px; width: 180px;" align=center>社区</div><div align=right><img height=24 width=24 src=./img/close.png onclick="showmenu(3);"><hr></div></div>
我的想法：<hr>
   <textarea name=msg id=msg style="margin: 0px; width: 206px; height: 64px;"></textarea><br><font size=2 color=red>请文明交流，有效沟通。</font><br>
   <input type=button value="提交" onclick="sendMsg(classid,folder,filename);">
   <input type=button value="看看别人说了啥？" onClick="loadMSG(classid,filename);">
<hr>
   <select id=msgs name=msgs size=20  style="width:210px; font-size:12px" onchange="showthisinfo(this);" ></select>
   <div id=infotext name=infotext style=" text-align: left;"></div>
</div> 
<!--讨论提示-->


<!--实验室提示-->
<div style="position:absolute; right:0px; top: 240px; width: 20px; height: 120px; z-index:999;background-color: #8A977B; "  onclick="showmenu(4);">
  <a name=moretocome id=moretocome><font size=2>&lt;&lt;</font></a>佳作欣赏
</div> 
<div id=lab id=lab style="position:absolute;  right:20px; top:0px; width: 210px; height: 463px; z-index:999;background-color: #CCCCCC; display:none ">
<div style="background-color: #8A977B;"><div  style="position:absolute; right:24px; top: 5px; width: 180px;" align=center>佳作欣赏</div><div align=right><img height=24 width=24 src=./img/close.png onclick="showmenu(4);"><hr></div></div>
<input type=button onclick="getTopList();" value="看看谁上榜了">
<hr>
<div style=" text-align: left;height: 370px;overflow:scroll;overflow-x:auto;overflow-y:auto;"><!--select id=toplist name=toplist size=16  style="width:210px;font-size:12px" onchange="showTop(this);" ></select-->
<div id=toplist name=toplist style="text-align: left;display: flex;flex-flow: row wrap;justify-content: center;align-items: center;"></div>
</div>
<hr><div id=snap name=snap style="top: -8px;position: relative;text-align: center;height: 204px; display: none;background: #FFC107;"></div>

<!--font color=red>什么？！都第五节课了，你的脚本还没搭好？好吧，我也只能帮你到这里了。</font>
<hr>
<input type=button onclick="startScript1();" value="角色1">
<input type=button onclick="startScript2();" value="鲨鱼">
<input type=button onclick="startDemo();" value="点击获取积木">
<hr>
  <div style=" text-align: left;">步骤</div>
  <div style=" text-align: left;"><select id=steps name=steps size=16  style="width:210px;font-size:12px" onchange="showthislabinfo(this);" ></select></div>
  <div id=labinfotext name=labinfotext style=" text-align: left;"></div-->

</div> 
<!--实验室提示-->



<!--空边条-->
<!--div style="position:absolute; left: 1412px; top: 320px; width: 20px; height: 480px; z-index:999;background-color: #B6C29A; "-->

<!--/div--> 
<!--空边条-->

<style>
.clicked{background:red;}
.viewed{background:purple;}

</style>

<script src=js/control.js></script>

<script>
    /*拖拽的目标对象------ document 监听drop 并防止浏览器打开客户端的图片*/
    document.ondragover = function (e) {
        e.preventDefault();  //只有在ondragover中阻止默认行为才能触发 ondrop 而不是 ondragleave
        document.getElementById("container").style.visibility="visible";
    };
    document.ondrop = function (e) {
        e.preventDefault();  //阻止 document.ondrop的默认行为  *** 在新窗口中打开拖进的图片
    };
    /*拖拽的源对象----- 客户端的一张图片 */
    /*拖拽目标对象-----div#container  若图片释放在此元素上方，则需要在其中显示*/
    container.ondragover = function (e) {
        e.preventDefault();
    };

    container.ondragleave = function (e) {
        e.preventDefault();
        document.getElementById("container").style.visibility="hidden";
    };

    container.ondrop = function (e) {
        var list = e.dataTransfer.files;
        for (var i = 0; i < list.length; i++) {
            var f = list[i];
            reader(f);
        }
    };

    function reader(f) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(f);//readAsDataURL(f);
        reader.onload = function () {
           oGUI.props.vm.loadProject(reader.result);
           document.getElementById("container").style.visibility="hidden";
        }
    } 
</script>

        <!-- Vendor & Initialize (Session & Localization)-->
        <script src="./js/common.bundle.js"></script>

        <!-- Scripts -->
        <script src="./js/projects.intl.js"></script>
        <script src="./js/projects.bundle.js"></script>

        <!-- Translate title element -->

    </body>
</html>
