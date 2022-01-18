<?php
error_reporting(0);
$username=isset($_COOKIE['USERNAME'])?$_COOKIE['USERNAME']:"";
//print_r($_COOKIE);
//if($username=="") header("Location: /class/");

include("../include/config.inc.php");

$classid=isset($_COOKIE['CLASSID'])?intval($_COOKIE['CLASSID']):"";
if($classid!="")
   $gradeid=$grades[$classid-1];
else
   $gradeid=isset($_COOKIE['GRADEID'])?intval($_COOKIE['GRADEID']):0;

$ip=getenv("REMOTE_ADDR");
//$ip="192.168.3.12";
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

   $username=sprintf("%02d_%s",($ips[3]-10),$username);//学生名前加前缀
}
//if($ip=="192.168.10.112") $admin=0;
//$admin=0;
//$username="01_test".rand(1,9);
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
     <title>速问速答</title>
     <!-- Favicon & CSS normalize -->
     <link rel="stylesheet" href="./css/lib/normalize.min.css" />
<script src="./js/jquery.js"></script>
<script src="./js/drag.js"></script>
<script>
var strCurrentUser="<?php echo (isset($_COOKIE['USERNAME'])?$_COOKIE['USERNAME']:"NONE");?>";
var classid='<?php echo isset($_GET['c'])?intval($_GET['c']):$classid;?>';
var lastID= "<?php echo isset($_COOKIE['QuizID'])?$_COOKIE['QuizID']:'';?>";

</script>
    </head>

<?php
if($admin==1)//教师端
{
?>
    <body style="background-color: hsla(215, 100%, 65%, 1);" onload="init();">
<!--速问速答-->
<!--菜单-->
<div class="menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB menu-bar_active_2Lfqh" style="position:absolute; left:0px; top: 0px; width: 120px; height: 48px;line-height: 48px; z-index:999;background-color: #0a0a0a; text-align: center;"  onclick="showControlPanel();">
  <span name=morectrl id=morectrl style="position:absolute;left:20px;color: white;">↑速问速答↑</span>
</div> 
<!--窗口-->
<div id="ControlPanel" style="position: absolute; left: 50%; top: 50%; width: 740px; height: 444px; transform: translate(-50%, -50%);webkit-transform: translate（-50%，-50%）;transform: translate(-50%,-50%); z-index: 999; background-color: rgb(204, 204, 204); visibility:visible;">
  <div id="CP">
    <div onmousedown="drag(this,event,0)" style="background-color:#0a0a0a"  onmousedown="drag(this,event,0)" >
      <div style="position:absolute; left:0px; top:5px; width: 720px;color:white;" align="center">速问速答</div>
      <div align="right"><img style="position: relative;height:24px;width:24px;right: 5px; top: 5px;" src="./img/close.png" onclick="showControlPanel();"><hr></div>
    </div>

    <div style="width: 733px;height: 272px;margin: 0px 7px auto;text-align: center;">
      <div style="width: 723px;border: 1px solid gray;height: 262px;">
        <div style="width: 110px;height: 251px;float: left;text-align: left;" onmousedown="drag(this,event,1)">
         <p style="font-size: 12px; position: absolute; top: 36px; left: 10px;">
	    <span>当前在线:</span>
	    <span id="user_num">0</span><br>
            <span>接收:</span>
	    <span id=to onclick="this.innerText='全体';" style="color:green">全体</span></p>
          <div id="user_list" style="width: 110px;border: 1px solid gray;height: 218px;overflow: scroll;float: left;text-align: left;left: 7px;position: absolute;top: 88px;"></div>
        </div>
        <div id="msg_list" onmousedown="drag(this,event,1)" style="width: 612px;border: 1px solid gray;height: 264px;overflow: scroll;float: left;text-align: left;left: 118px;position: absolute;top: 42px;display:block"></div>
        <div id="msg_score" style="width: 612px;border: 1px solid gray;height: 264px;overflow: scroll;float: left;text-align: left;left: 118px;position: absolute;top: 42px;display:none"></div>
        <div id="msg_scorehistory" style="width: 612px;border: 1px solid gray;height: 264px;overflow: scroll;float: left;text-align: left;left: 118px;position: absolute;top: 42px;display:none"></div>

      </div>
    </div>

    <div style="width: 733px; height: 130px; margin: 0px 7px auto;"  >
      <select onchange="setQuiz(this);" style="position: relative; top: 0px;" id="S">
        <option value="0">请选择题目</option>
        <!--option value="1">关于2</option>
        <option value="2">关于@</option>
        <option value="3">关于^</option>
        <option value="4">关于6</option>
        <option value="5">关于&</option>
        <option value="6">关于7</option>
        <option value="7">关于$</option>
        <option value="8">关于4</option>
        <option value="9">关于!</option>
        <option value="10">关于1</option-->
      </select>
      <textarea id="msg_box" rows="4" cols="50" onkeydown="confirmSending(event)" style="height: 55px;width: 594px;position:relative; top:0px;"></textarea>
      <span id=status style="position: absolute;top: 320px;right:7px;width: 45px;font-size: 14px;"></span>
      <input type="button" value="发送" onclick="send()" style="position: absolute;align-items: center;top: 343px;right:7px;"><hr>

      <input type=button value="提问..." onclick='document.getElementById("msg_box").value="[\"QUIZ\",[\"4\",\"新问题：<br>A:<BR>B:<BR>C:<BR>D:<BR>\"]]";'>
      <input type=button value=提问4 onclick='add("[\"QUIZ\",[\"4\",\"选择题测试<br>A:<BR>B:<BR>C:<BR>D:<BR>\"]]");'>
      <input type=button value=提问3 onclick='add("[\"QUIZ\",[\"3\",\"选择题测试<br>A:<BR>B:<BR>C:<BR>\"]]");'>
      <input type=button value=提问2 onclick='add("[\"QUIZ\",[\"2\",\"选择题测试<br>A:<BR>B:<BR>\"]]");'>
      <input type=button value=确认 onclick='add("[\"QUIZ\",[\"1\",\"本环节任务完成了么？<br>完成后请点确认。\"]]");'>
      <input type=button value=关闭问卷 onclick='add("[\"QUIZ\",[\"0\",\"\"]]");'>
      <input type=button value=查看问卷 onclick='viewQuiz();'>
      <input type=button value=查看日志 onclick='viewLog();'>
    </div>
  </div>
</div>

<div id="quiz" style="position: absolute; left: 50%; top: 50%; width: 452px; height: 268px; transform: translate(-50%, -50%);webkit-transform: translate（-50%，-50%）;transform: translate(-50%,-50%); z-index: 1001; background-color: rgb(204, 204, 204); visibility: hidden;" >
  <div id="quizinfo" >
    <div style="width: 450px;height: 272px;"  onmousedown="drag(this,event,0)" >
      <div style="width: 450px;border: 1px solid gray;height: 268px;">
        <div style="background-color:#DC5712" >
          <div style="position:absolute; left:10px; top:5px; width: 440px;color:white;" align="left">速问速答</div>
          <div style="height:33px"></div>
        </div>
        <div style="width: 432px;border: 1px solid gray; height: 268px;height: 180px;left: 9px; position: absolute; top: 42px;">
          <div id="msg_text" style="width: 432px;border: 0px solid gray;height: 180px;overflow: scroll;float: left;text-align: left;"></div>
          <div id="msg_keys" style="width: 432px;border: 0px solid gray;height: 20px;float: left;text-align: center;margin: 8px auto auto auto;"> </div>
          <div style="display: none;width: 159px;height: 247px;float: left;text-align: left;">
            <p><span>当前在线:</span><span id="user_num">0</span></p>
            <div id="user_list" style="overflow: auto;"></div>
          </div>
        </div>
        <div id="msg_list" style="width: 444px;border: 0px solid gray;height: 250px;overflow: scroll;float: left;text-align: left;display:none"></div>
      </div>
    </div>
  </div>
</div>
<script>

var bSelfShow=false;
   var Quiz=Array(

      "[\"QUIZ\",[\"2\",\"要输入“q”：<br>A:左手小指。<BR>B:右手小指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“r”：<br>A:左手食指。<BR>B:右手食指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“s”：<br>A:左手无名指。<BR>B:右手无名指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“t”：<br>A:左手食指。<BR>B:右手食指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“u”：<br>A:左手食指。<BR>B:右手食指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“v”：<br>A:左手食指。<BR>B:右手食指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“w”：<br>A:左手无名指。<BR>B:右手无名指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“x”：<br>A:左手无名指。<BR>B:右手无名指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“y”：<br>A:左手食指。<BR>B:右手食指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“z”：<br>A:左手小指。<BR>B:右手小指。\"]]",

      "[\"QUIZ\",[\"0\",\"-------3-------\"]]",

      "[\"QUIZ\",[\"2\",\"要输入“a”：<br>A:左手小指。<BR>B:右手小指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“b”：<br>A:左手食指。<BR>B:右手食指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“c”：<br>A:左手中指。<BR>B:右手中指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“d”：<br>A:左手中指。<BR>B:右手中指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“e”：<br>A:左手中指。<BR>B:右手中指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“f”：<br>A:左手食指。<BR>B:右手食指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“g”：<br>A:左手食指。<BR>B:右手食指。\"]]",
      "[\"QUIZ\",[\"0\",\"-------1-------\"]]",


      "[\"QUIZ\",[\"2\",\"要输入“h”：<br>A:左手食指。<BR>B:右手食指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“i”：<br>A:左手中指。<BR>B:右手中指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“j”：<br>A:左手食指。<BR>B:右手食指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“k”：<br>A:左手中指。<BR>B:右手中指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“l”：<br>A:左手无名指。<BR>B:右手无名指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“m”：<br>A:左手食指。<BR>B:右手食指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“n”：<br>A:左手食指。<BR>B:右手食指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“o”：<br>A:左手无名指。<BR>B:右手无名指。\"]]",
      "[\"QUIZ\",[\"2\",\"要输入“p”：<br>A:左手小指。<BR>B:右手小指。\"]]",

      "[\"QUIZ\",[\"0\",\"-------2-------\"]]",


      "[\"QUIZ\",[\"3\",\"操作1<br>一个标准的窗口，在窗体右上角会有3个按钮，从左到右分别是：<br>A:最大化，最小化和关闭。<br>B:最小化，最大化和向下还原。<br>C:最小化，向下还原和关闭。\"]]",
      "[\"QUIZ\",[\"4\",\"操作2<br>在窗口的四条边沿上，我们不能实现如下操作：<br>A:只调整窗口的宽。<br>B:只调整窗口的高。<br>C:同时调整窗口的高和宽。<br>D:关闭窗口。\"]]",
      "[\"QUIZ\",[\"2\",\"操作3<br>哪个操作不能调整浏览器窗口的位置：<br>A:拖动标签页。<br>B:拖动标题栏。\"]]",
      "[\"QUIZ\",[\"3\",\"鼠标器1<br>在窗口标题栏位置按住鼠标左键后往某一个方向移动，可以<br>A:拖动该窗口。<br>B:关闭该窗口。<br>C:最小化此窗口。\"]]",
      "[\"QUIZ\",[\"2\",\"鼠标器2<br>在窗口标题栏位置按住鼠标左键后，窗口最大化了，原因是：<br>A:本来就这样。<br>B:鼠标左键坏了，单击变双击。\"]]",
      "[\"QUIZ\",[\"2\",\"鼠标器3<br>把鼠标移到窗口边缘，会出现双向箭头，说明此时我们可以：<br>A:按住鼠标右键，调整窗口大小。<br>B:按住鼠标左键，调整窗口大小。\"]]",
      "[\"QUIZ\",[\"4\",\"鼠标器4<br>关于鼠标器的操作，哪个不正确？<br>A:鼠标单击可以选定文件夹、文件等对象。<br>B:在文件或文件夹上双击鼠标，可以打开文件或文件夹。<br>C:鼠标右键可以打开快捷菜单。<br>D:我们上课用的鼠标器只有2个按键。\"]]",
      "[\"QUIZ\",[\"0\",\"-------认识操作系统-------\"]]",

      "[\"QUIZ\",[\"2\",\"存储器1<br>内存条属于：<br>A:内存储器。<br>B:外存储器。\"]]",
      "[\"QUIZ\",[\"2\",\"存储器2<br>硬盘属于：<br>A:内存储器。<br>B:外存储器。\"]]",
      "[\"QUIZ\",[\"2\",\"存储器3<br>U盘属于：<br>A:内存储器。<br>B:外存储器。\"]]",
      "[\"QUIZ\",[\"2\",\"存储器4<br>光盘属于：<br>A:内存储器。<br>B:外存储器。\"]]",
      "[\"QUIZ\",[\"2\",\"主机1<br>哪个是中央处理器的英文缩写？<br>A:CPU。<br>B:CUP。\"]]",
      "[\"QUIZ\",[\"2\",\"主机2<br>中央处理器相当于人的：<br>A:大脑。<br>B:手脚。\"]]",
      "[\"QUIZ\",[\"2\",\"输入输出1<br>扫描仪属于：<br>A:输入设备。<br>B:输出设备。\"]]",
      "[\"QUIZ\",[\"2\",\"输入输出2<br>绘图仪属于：<br>A:输入设备。<br>B:输出设备。\"]]",
      "[\"QUIZ\",[\"2\",\"输入输出3<br>数码板属于：<br>A:输入设备。<br>B:输出设备。\"]]",
      "[\"QUIZ\",[\"0\",\"-------认识计算机-------\"]]",

      "[\"QUIZ\",[\"2\",\"用工具看1<br>解放军侦察兵要侦查地形，可以用：<br>A:显微镜<BR>B:望远镜。\"]]",
      "[\"QUIZ\",[\"2\",\"用工具看2<br>航天员要在天宫空间站观察地球上的台风走向，可以用：<br>A:眼睛<BR>B:天文望远镜。\"]]",
      "[\"QUIZ\",[\"2\",\"用工具看3<br>古代用点燃烽火的方式来表示：<br>A:有敌人入侵。<BR>B:天冷烤火。\"]]",
      "[\"QUIZ\",[\"2\",\"信息获取1<br>通过耳朵，我们可以更精确地获得如下哪个信息？<br>A:老师来了！<BR>B:天气有点冷了。\"]]",
      "[\"QUIZ\",[\"2\",\"信息获取2<br>我的手指痒死了，可能是：<br>A:天气恶劣，冻伤了。<BR>B:最近挨揍少了，皮痒痒了。\"]]",
      "[\"QUIZ\",[\"2\",\"信息传递1<br>在上课时间，我突然想到一个有趣的笑话，要告诉我的同桌，可以：<br>A:直接跟他说悄悄话。<BR>B:下课后开心地告诉他。\"]]",
      "[\"QUIZ\",[\"2\",\"信息传递2<br>中午，我发现我带的笔袋忘记在食堂了，回去找，没找到，我可以：<br>A:走遍每一个教室去询问。<BR>B:报告老师，说明情况。\"]]",
      "[\"QUIZ\",[\"3\",\"信息传递3<br>你有同学到国外去旅游了，你有重要的事情要找他。下面哪种联系方式最快最便宜？<br>A:打电话。<BR>B:写信。<BR>C:发电子邮件。\"]]",
      "[\"QUIZ\",[\"3\",\"信息传递4<br>你有同学到国外去旅游了，你有重要的事情要找他。下面哪种联系方式需要花最多的钱？<br>A:打电话。<BR>B:写信。<BR>C:发电子邮件。\"]]",
      "[\"QUIZ\",[\"3\",\"信息传递5<br>你有同学到国外去旅游了，你有重要的事情要找他。下面哪种联系方式最慢？<br>A:打电话。<BR>B:写信。<BR>C:发电子邮件。\"]]",
      "[\"QUIZ\",[\"0\",\"-------信息与信息技术-------\"]]",



      "[\"QUIZ\",[\"2\",\"怎么输入“!”？<br>A:先右手小拇指按住Shift键，再左手小拇指敲一次“1”，最后右手小拇指释放Shift键。<BR>B:直接打1。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“1”？<br>A:先右手小拇指按住Shift键，再左手小拇指敲一次“1”，最后右手小拇指释放Shift键。<BR>B:直接打1。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“@”？<br>A:直接打2。<BR>B:先右手小拇指按住Shift键，再左手无名指敲一次“2”，最后右手小拇指释放Shift键。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“2”？<br>A:直接打2。<BR>B:先右手小拇指按住Shift键，再左手无名指敲一次“2”，最后右手小拇指释放Shift键。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“#”？<br>A:直接打3。<BR>B:先右手小拇指按住Shift键，再左手中指敲一次“3”，最后右手小拇指释放Shift键。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“3”？<br>A:直接打3。<BR>B:先右手小拇指按住Shift键，再左手中指敲一次“3”，最后右手小拇指释放Shift键。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“$”？<br>A:先右手小拇指按住Shift键，再左手食指敲一次“4”，最后右手小拇指释放Shift键。<BR>B:直接打4。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“4”？<br>A:先右手小拇指按住Shift键，再左手食指敲一次“4”，最后右手小拇指释放Shift键。<BR>B:直接打4。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“%”？<br>A:直接打5。<BR>B:先右手小拇指按住Shift键，再左手食指敲一次“5”，最后右手小拇指释放Shift键。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“5”？<br>A:直接打5。<BR>B:先右手小拇指按住Shift键，再左手食指敲一次“5”，最后右手小拇指释放Shift键。\"]]",

      "[\"QUIZ\",[\"2\",\"怎么输入“^”？<br>A:直接打6。<BR>B:先左手小拇指按住Shift键，再右手食指敲一次“6”，最后左手小拇指释放Shift键。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“6”？<br>A:直接打6。<BR>B:先左手小拇指按住Shift键，再右手食指敲一次“6”，最后左手小拇指释放Shift键。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“&”？<br>A:先左手小拇指按住Shift键，再右手食指敲一次“7”，最后左手小拇指释放Shift键。<BR>B:直接打7。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“7”？<br>A:先左手小拇指按住Shift键，再右手食指敲一次“7”，最后左手小拇指释放Shift键。<BR>B:直接打7。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“*”？<br>A:先左手小拇指按住Shift键，再右手中指敲一次“8”，最后左手小拇指释放Shift键。<BR>B:直接打8。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“8”？<br>A:先左手小拇指按住Shift键，再右手中指敲一次“8”，最后左手小拇指释放Shift键。<BR>B:直接打8。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“（”？<br>A:先左手小拇指按住Shift键，再右手无名指敲一次“9”，最后左手小拇指释放Shift键。<BR>B:直接打9。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“9”？<br>A:先左手小拇指按住Shift键，再右手无名指敲一次“9”，最后左手小拇指释放Shift键。<BR>B:直接打9。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“）”？<br>A:先左手小拇指按住Shift键，再右手小拇指敲一次“0”，最后左手小拇指释放Shift键。<BR>B:直接打0。\"]]",
      "[\"QUIZ\",[\"2\",\"怎么输入“0”？<br>A:先左手小拇指按住Shift键，再右手小拇指敲一次“0”，最后左手小拇指释放Shift键。<BR>B:直接打0。\"]]",

      "[\"QUIZ\",[\"3\",\"怎么输入“~”？<br>A:先左手按住Shift键，再右手敲一次“`”，最后左手释放Shift键。<BR>B:先右手按住Shift键，再左手敲一次“`”，最后右手释放Shift键。<BR>C:直接打“`”。\"]]",
      "[\"QUIZ\",[\"3\",\"怎么输入“+”？<br>A:先左手按住Shift键，再右手敲一次“=”，最后左手释放Shift键。<BR>B:先右手按住Shift键，再左手敲一次“=”，最后右手释放Shift键。<BR>C:直接打“=”。\"]]",
      "[\"QUIZ\",[\"3\",\"怎么输入“=”？<br>A:先左手按住Shift键，再右手敲一次“=”，最后左手释放Shift键。<BR>B:先右手按住Shift键，再左手敲一次“=”，最后右手释放Shift键。<BR>C:直接打“=”。\"]]",
      "[\"QUIZ\",[\"3\",\"怎么输入“-”？<br>A:先左手按住Shift键，再右手敲一次“-”，最后左手释放Shift键。<BR>B:先右手按住Shift键，再左手敲一次“-”，最后右手释放Shift键。<BR>C:直接打“-”。\"]]",
      "[\"QUIZ\",[\"3\",\"怎么输入“?”？<br>A:先左手按住Shift键，再右手敲一次“/”，最后左手释放Shift键。<BR>B:先右手按住Shift键，再左手敲一次“/”，最后右手释放Shift键。<BR>C:直接打“/”。\"]]",
      "[\"QUIZ\",[\"3\",\"怎么输入“<”？<br>A:先左手按住Shift键，再右手敲一次“,”，最后左手释放Shift键。<BR>B:先右手按住Shift键，再左手敲一次“,”，最后右手释放Shift键。<BR>C:直接打“,”。\"]]",
      "[\"QUIZ\",[\"3\",\"怎么输入“>”？<br>A:先左手按住Shift键，再右手敲一次“.”，最后左手释放Shift键。<BR>B:先右手按住Shift键，再左手敲一次“.”，最后右手释放Shift键。<BR>C:直接打“.”。\"]]",
      "[\"QUIZ\",[\"3\",\"怎么输入“\\\\”？<br>A:先左手按住Shift键，再右手敲一次“\\\\”，最后左手释放Shift键。<BR>B:先右手按住Shift键，再左手敲一次“\\\\”，最后右手释放Shift键。<BR>C:直接打“\\\\”。\"]]",
      "[\"QUIZ\",[\"3\",\"怎么输入“:”？<br>A:先左手按住Shift键，再右手敲一次“;”，最后左手释放Shift键。<BR>B:先右手按住Shift键，再左手敲一次“;”，最后右手释放Shift键。<BR>C:直接打“;”。\"]]",
      "[\"QUIZ\",[\"3\",\"怎么输入“;”？<br>A:先左手按住Shift键，再右手敲一次“;”，最后左手释放Shift键。<BR>B:先右手按住Shift键，再左手敲一次“;”，最后右手释放Shift键。<BR>C:直接打“;”。\"]]",
      "[\"QUIZ\",[\"3\",\"怎么输入“'”？<br>A:先左手按住Shift键，再右手敲一次“'”，最后左手释放Shift键。<BR>B:先右手按住Shift键，再左手敲一次“'”，最后右手释放Shift键。<BR>C:直接打“'”。\"]]",
      "[\"QUIZ\",[\"3\",\"怎么输入“\\\"”？<br>A:先左手按住Shift键，再右手敲一次“'”，最后左手释放Shift键。<BR>B:先右手按住Shift键，再左手敲一次“'”，最后右手释放Shift键。<BR>C:直接打“'”。\"]]",
      "[\"QUIZ\",[\"3\",\"怎么输入“{”？<br>A:先左手按住Shift键，再右手敲一次“[”，最后左手释放Shift键。<BR>B:先右手按住Shift键，再左手敲一次“[”，最后右手释放Shift键。<BR>C:直接打“[”。\"]]",
      "[\"QUIZ\",[\"3\",\"怎么输入“}”？<br>A:先左手按住Shift键，再右手敲一次“]”，最后左手释放Shift键。<BR>B:先右手按住Shift键，再左手敲一次“]”，最后右手释放Shift键。<BR>C:直接打“]”。\"]]",

      "[\"QUIZ\",[\"0\",\"-------键盘打字-------\"]]",

   );

function init()
{
   var s=document.getElementById("S");
   for(var i=0;i<Quiz.length;i++)
   {
      var j=$.parseJSON(Quiz[i]);
      var str=j[1][1].split("<br>");
      var o=document.createElement("OPTION");
      o.value=(i+1);//str[0];
      o.innerText=str[0];
      s.appendChild(o);
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
              button1.value="确认";
              button1.style.width="50px";
              button1.style.height="30px";
              button1.style.margin="auto 20";
              button1.onclick=function(){ checkAnswer('确认');}
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
function setQuiz(o)//预设的问题
{

   if(o.value>0)
   {
      document.getElementById("msg_box").value=Quiz[o.value-1];
      document.getElementById("status").innerHTML="待发送";
   }
}

function viewQuiz()//显示答题结果界面
{
   document.getElementById("msg_list").style.display="none";
   document.getElementById("msg_score").style.display="block";
}

function viewLog()//显示系统日志界面
{
   document.getElementById("msg_list").style.display="block";
   document.getElementById("msg_score").style.display="none";
}

function showAttachment(o)//推送显示隐藏的附件
{
   if(o.value!="")
   {
      add("[\"ATTACHMENT\",\""+o.value+"\"]");
      document.getElementById(o.value).style.visibility="visible";//本地同步显示
      document.cookie=o.value+"=true";
      //hideAllMenu();
   }
}

function insertSprite(o)//推送插入素材库中的角色
{
   if(o.value!="") add("[\"SPRITE\",\""+o.value+"\"]");
}

function insertSprite2(o)//推送插入URL的图片
{
   if(o.value!="") add("[\"SPRITE2\",\""+o.value+"\"]");
}

function insertBackdrop(o)//推送插入素材库中的背景
{
   if(o.value!="") add("[\"BACKDROP\",\""+o.value+"\"]");
}

var bControl=true;
function showControlPanel()//显示/隐藏控制面板
{
   if(bControl==false) showControl();
   else hideControl();
   bControl!=bControl;
}

function hideControl()//隐藏控制面板
{
   var m=document.getElementById("morectrl");
   m.innerHTML="↓速问速答↓";

   document.getElementById("ControlPanel").style.visibility="hidden";
   //document.getElementById("quizKey").style.visibility="hidden";//答案选项也要强制隐藏。

   bControl=false;
}

function showControl()//显示控制面面板
{
   var m=document.getElementById("morectrl");
   m.innerHTML="↑速问速答↑";

   document.getElementById("ControlPanel").style.visibility="visible";
   bControl=true;
}
</script>
<?php
}
else//学生端
{
?>
    <body style="background-color: hsla(215, 100%, 65%, 1);">

<!--加载遮罩-->
<div height=100% width=100% style="margin:0 auto;position:relative;top:50%;text-align: center;    font-size: 30px;    color: red;"><?php echo $username;?>，请做好准备，题目随时会来！</div>

<div id="quiz" style="position: absolute; left: 50%; top: 50%; width: 452px; height: 268px; transform: translate(-50%, -50%);webkit-transform: translate（-50%，-50%）;transform: translate(-50%,-50%); z-index: 999; background-color: rgb(204, 204, 204); visibility: hidden;" >
  <div id="quizinfo" >
    <div style="width: 450px;height: 272px;"  onmousedown="drag(this,event,0)" >
      <div style="width: 450px;border: 1px solid gray;height: 268px;">
        <div style="background-color:#DC5712" >
          <div style="position:absolute; left:10px; top:5px; width: 440px;color:white;" align="left">速问速答</div>
          <div style="height:33px"></div>
        </div>
        <div style="width: 432px;border: 1px solid gray; height: 268px;height: 180px;left: 9px; position: absolute; top: 42px;">
          <div id="msg_text" style="width: 432px;border: 0px solid gray;height: 180px;overflow: scroll;float: left;text-align: left;"></div>
          <div id="msg_keys" style="width: 432px;border: 0px solid gray;height: 20px;float: left;text-align: center;margin: 8px auto auto auto;"> </div>
          <div style="display: none;width: 159px;height: 247px;float: left;text-align: left;">
            <p><span>当前在线:</span><span id="user_num">0</span></p>
            <div id="user_list" style="overflow: auto;"></div>
          </div>
        </div>
        <div id="msg_list" style="width: 444px;border: 0px solid gray;height: 250px;overflow: scroll;float: left;text-align: left;display:none"></div>
      </div>
    </div>
  </div>
</div>

<script type="text/javascript">

var bQuizshow=false;
var nQuziType=0;

function dealCommand(jsonCOMMAND)//接收到广播数据后，判断该执行什么操作。
{
   if(jsonCOMMAND.length>1)
   {
      var Sprite=null;
      switch(jsonCOMMAND[0])
      {
      case "BACKDROP":						//添加资源库中背景图片的指令：["BACKDROP","Arctic"]
         var vmBackdrop = {name: "Arctic", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};

         oGUI.props.vm.addBackdrop("67e0db3305b3c8bac3a363b1c428892e.png",vmBackdrop);//只有图片文件在./editor/static/asset/下才可正常访问。
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
         hideAllMenu();
         if(document.getElementById(jsonCOMMAND[1]).style.visibility!="visible") alert("有新附件来了。");
         document.getElementById(jsonCOMMAND[1]).style.visibility="visible";
         break;

      case "MENU":						//隐藏所有菜单，只开启任务窗口的指令：["MENU",0]
         hideAllMenu();
         break;

      case "QUIZ":						//速问速答指令：["QUIZ","[\"TYPE\"],[\"DATA\"],[\"CHOOSE\"],[\"KEY\"]"]
         Quiz(jsonCOMMAND[1]);
         break;
      }
   }
}

function Quiz(jsonDATA)//单选、多选窗口的控制
{
   if(jsonDATA.length>1)
   {
      if(jsonDATA[0]==0)//单个选项，主要用于发出提示或提醒
      {
         document.getElementById("quiz").style.visibility="hidden";//显示窗口
      }
      else
      {
         var msg_buttons=document.getElementById("msg_keys");
         msg_buttons.innerHTML='';

         if(jsonDATA[0]==1)//单个选项，主要用于发出提示或提醒
         {
              var button1 = document.createElement("input");
              button1.type="button";
              button1.value="确认";
              button1.style.width="50px";
              button1.style.height="30px";
              button1.style.margin="auto 20";
              button1.onclick=function(){ Answer('确认');}
              msg_buttons.appendChild(button1);
         }
         else//正常显示A选项
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

         if(jsonDATA[0]>1)//有多个选项时，显示B选项
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

         if(jsonDATA[0]>2)//如果有第三个，则显示C选项
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

         if(jsonDATA[0]>3)//最多显示4个选项，其它的忽略。
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
         document.getElementById("msg_text").innerHTML=jsonDATA[1];//提示信息
         document.getElementById("quiz").style.visibility="visible";//显示窗口
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
   document.cookie="QuizID="+lastID;
}
</script>
<?php
}
?>

<script src="./js/websocket.js"></script>
<script type="text/javascript">

   var uname = "<?php echo $username;?>";//prompt('请输入用户名', 'user' + uuid(8, 16));
   var strWebSocketServerURL="ws://<?php echo $WSSERVER;?>:<?php echo (8080+$room);?>";
   //var wsSocket=new WebSocket(strWebSocketServerURL);
   createWebSocket(strWebSocketServerURL);

</script>


  </body>
</html>
