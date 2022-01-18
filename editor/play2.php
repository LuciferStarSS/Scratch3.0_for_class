<?php
error_reporting(0);
setCookie("scratchlanguage",'zh-cn',"/class");
$username="Stage";

include("../include/config.inc.php");

$ip=getenv("REMOTE_ADDR");
//$ip="192.168.10.112";
$room=0;			//教室编号直接从IP获取
if(isset($teacher_room[$ip]))	//教师访问
{
   $room=$teacher_room[$ip][1];
}
else				//学生访问
{
   $ips=explode('.',$ip);				//拆分IP，根据IP段确定计算机教室
   if(isset($student_room[$ips[2]]))
   {
      $room=$student_room[$ips[2]][0];
   }
}

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
        var oGUI=null;
        var oVIEW=null;
        var oVMLISTENER=null;
        var oGUIX=null;
        var oSB3FILE=null;
var admin=-1;
     </script>
<script src=./js/jquery.js></script>
<script src=./js/drag.js></script>

    </head>

    <body style="background-color: hsla(215, 100%, 65%, 1);">

<!--加载遮罩-->
<div id=waiting style="position:absolute; visibility:hidden; left: 0px; top: 0px; width:100%; height: 100%; z-index:999;background-color: hsla(215, 100%, 65%, 1);">
</div> 
<!--加载遮罩-->

<!--拖曳打开操作，有些人经常误触，所以关闭了。-->
<!--div id="container" style="position:absolute"><div class=box>请拖拽您的Scratch项目文件到此处</div></div-->

<!--Scratch3.0应用主窗口-->
<div id="app"></div>

<!--临时补丁-->
<!--挡住教程和最右侧登录菜单，其实已经可以实现从资源里直接去掉了。-->
<div class="menu-bar_menu-bar-item_oLDa-"  id=NEWMESSAGE style="position:absolute; left:243px; top: 0px; width:62px; height: 48px; z-index:990;background-color: hsla(215, 100%, 65%, 1);font-size: 10px;color: red;"> </div> 
<div class="menu-bar_menu-bar-item_oLDa-" style="position:absolute; right:0px; top: 0px; width:180px; line-height: 48px; height: 48px; z-index:990;background-color: hsla(215, 100%, 65%, 1);">  <span name=moretocome id=moretocome style="position:absolute;right:10px;"><?php echo $username;?>，加油！</span></div> 

<!--学生端-->
<!--学生端没有菜单，只有窗口-->
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
        <div id="msg_list" style="width: 444px;border: 0px solid gray;height: 250px;overflow: scroll;float: left;text-align: left;display:none;"></div>
      </div>
    </div>
  </div>
</div>
<span id=autosavestatus></span>
<span id=cancel></span>
<span id=redo></span>
<span><checkbox id=ViewMode></span>
<script type="text/javascript">

var bQuizshow=false;
var nQuziType=0;
var classid=0;
var folder=''
var bHelpAllowed=false;
var bInvited=false;

var arrPlayer=Array();//当前项目中已存在的选手
var arrPlayerDelayed=Array();//当前项目中正在添加的选手。注：添加完毕前，在当前项目中不可见。
var arrPlayerCostume=Array();


function dealCommand(jsonCOMMAND)//接收到广播数据后，判断该执行什么操作。
{
   if(jsonCOMMAND.length>1)
   {
      var Sprite=null;
      switch(jsonCOMMAND[0])
      {
      case "INVITATION"://邀请时清空
         for(var i=oGUI.props.vm.runtime.targets.length-1;i>0 ;i--){			//初始化，清空所有角色
           if(oGUI.props.vm.runtime.targets[i].isStage!=true){
              oGUI.props.vm.deleteSprite(oGUI.props.vm.runtime.targets[i].id);
           }
         }
         arrPlayer.length=0;								//清空当前项目选手名单
         arrPlayerDelayed.length=0;							//清空当前项目正在添加的选手名单
         arrPlayerCostume.length=0;							//清空当前项目中选手的造型记录
         bCodeViewableFile = false;							//强制置播放模式
         updateScreenMode();

         break;

      case "NP"://投屏命令

         var nId=arrPlayer.indexOf(jsonCOMMAND[1]);//indexOf()如果找不到，返回-1。

         if(nId>-1)//在当前项目中已经存在该选手，则直接更新选手的坐标、方向和大小数据。
         {
             if(arrPlayerCostume[nId]=='')// || arrPlayerCostume[nId]!=jsonCOMMAND[3])
             {
                arrPlayerCostume[nId]=jsonCOMMAND[3];
                var obj={"name":jsonCOMMAND[1],"tags":["people","drawing"],"isStage":false,"variables":{},"costumes":[{"assetId":jsonCOMMAND[3].substr(0,33),"name":"Car","bitmapResolution":1,"md5ext":jsonCOMMAND[3],"dataFormat":"png","rotationCenterX":100,"rotationCenterY":50}],"sounds":[],"blocks":{}};
                oGUI.props.vm.addCostume(jsonCOMMAND[3],obj,oGUI.props.vm.runtime.targets[nId].id,2);
             }
             oGUI.props.vm.runtime.targets[nId].setXY(jsonCOMMAND[2][0],jsonCOMMAND[2][1]);	//设置角色坐标
             oGUI.props.vm.runtime.targets[nId].setDirection(jsonCOMMAND[2][2]);		//设置角色方向
             oGUI.props.vm.runtime.targets[nId].setSize(jsonCOMMAND[2][3]);			//设置角色大小
         }
         else//如果找不到，存在三种情况：0.当前的arrPlayer数据非最新；1.该选手为第一次出现，需要执行添加操作；2.该选手正在被添加中。
         {
            for(var i=0;i<oGUI.props.vm.runtime.targets.length ;i++){			//为确保arrPlayer中为最新数据，重新更新一下。
               arrPlayer[i]=oGUI.props.vm.runtime.targets[i].getName();			//由于添加角色操作，用时较长，且无回调消息可获取，所以只能在要用前，主动更新一下。
            }

            nId=arrPlayer.indexOf(jsonCOMMAND[1]);					//再次查询一下当前项目中是否有该选手

            if(nId>-1)//该选手已经成功添加，则直接更新选手的坐标、方向和大小数据。
            {
               oGUI.props.vm.runtime.targets[nId].setXY(jsonCOMMAND[2][0],jsonCOMMAND[2][1]);
               oGUI.props.vm.runtime.targets[nId].setDirection(jsonCOMMAND[2][2]);
               oGUI.props.vm.runtime.targets[nId].setSize(jsonCOMMAND[2][3]);
            }
            else//没找到，还剩两种情况
            {
               if(arrPlayerDelayed.indexOf(jsonCOMMAND[1])==-1)//该选手的确没有被执行过添加操作，则添加。
               {
                  arrPlayerDelayed.push(jsonCOMMAND[1]);				//正被插入的选手，数据可以持续保存。删除操作在收到STOPALL或INVITATION消息后执行。

                  //var objSprite = "{\"name\":\""+ jsonCOMMAND[1] +"\",\"tags\":[],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"7d25141fd5d55013c14982eebf810e29\",\"name\":\""+jsonCOMMAND[1]+"\",\"bitmapResolution\":1,\"md5ext\":\"7d25141fd5d55013c14982eebf810e29.png\",\"dataFormat\":\"png\",\"rotationCenterX\":100,\"rotationCenterY\":50}],\"sounds\":[],\"blocks\":{\"Zo(K~r:BL_4^[*3E8dBD\":{\"opcode\":\"event_whenflagclicked\",\"next\":\"/6H7Ofvp^.SD)?H0wPt)\",\"parent\":null,\"inputs\":{},\"fields\":{},\"shadow\":false,\"topLevel\":true,\"x\":22,\"y\":69},\"/6H7Ofvp^.SD)?H0wPt)\":{\"opcode\":\"looks_say\",\"next\":null,\"parent\":\"Zo(K~r:BL_4^[*3E8dBD\",\"inputs\":{\"MESSAGE\":[1,[10,\"" + jsonCOMMAND[1] + "\"]]}}}}";
                  //if(jsonCOMMAND[3]=='') jsonCOMMAND[3]="7d25141fd5d55013c14982eebf810e29.png";
//                  var objSprite = "{\"name\":\""+ jsonCOMMAND[1] +"\",\"tags\":[],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\""+ jsonCOMMAND[3].substr(0,32) +"\",\"name\":\""+jsonCOMMAND[1]+"\",\"bitmapResolution\":1,\"md5ext\":\""+ jsonCOMMAND[3] +"\",\"dataFormat\":\"png\",\"rotationCenterX\":100,\"rotationCenterY\":50}],\"sounds\":[],\"blocks\":{\"Zo(K~r:BL_4^[*3E8dBD\":{\"opcode\":\"event_whenflagclicked\",\"next\":\"/6H7Ofvp^.SD)?H0wPt)\",\"parent\":null,\"inputs\":{},\"fields\":{},\"shadow\":false,\"topLevel\":true,\"x\":22,\"y\":69},\"/6H7Ofvp^.SD)?H0wPt)\":{\"opcode\":\"looks_say\",\"next\":null,\"parent\":\"Zo(K~r:BL_4^[*3E8dBD\",\"inputs\":{\"MESSAGE\":[1,[10,\"" + jsonCOMMAND[1] + "\"]]}}}}";


                  var objSprite = "{\"name\":\""+ jsonCOMMAND[1] +"\",\"tags\":[],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\""+ jsonCOMMAND[3].substr(0,32) +"\",\"name\":\""+jsonCOMMAND[1]+"\",\"bitmapResolution\":1,\"md5ext\":\""+ jsonCOMMAND[3] +"\",\"dataFormat\":\"png\",\"rotationCenterX\":100,\"rotationCenterY\":50}],\"sounds\":[],\"variables\":{\"^DoYu47@*@:68:}|8I}s\":[\"t1\",406.87],\"SUgR:Xx!(`MMp,1yirzm\":[\"t2\",0]},\"blocks\":{\"Zo(K~r:BL_4^[*3E8dBD\":{\"opcode\":\"event_whenflagclicked\",\"next\":\"/6H7Ofvp^.SD)?H0wPt)\",\"parent\":null,\"inputs\":{},\"fields\":{},\"shadow\":false,\"topLevel\":true,\"x\":-858,\"y\":-457},\"/6H7Ofvp^.SD)?H0wPt)\":{\"opcode\":\"looks_say\",\"next\":\"FO#8.eB5g-oP#-cqhXv5\",\"parent\":\"Zo(K~r:BL_4^[*3E8dBD\",\"inputs\":{\"MESSAGE\":[1,[10,\""+jsonCOMMAND[1]+"\"]]},\"fields\":{},\"shadow\":false,\"topLevel\":false},\"@%MrjFV}049qC=Nj3^mh\":{\"opcode\":\"control_forever\",\"next\":null,\"parent\":\"p,fn0imj[$qVj0a*j0KN\",\"inputs\":{\"SUBSTACK\":[2,\":meNgu/Jg(Ev0L*HdS=V\"]},\"fields\":{},\"shadow\":false,\"topLevel\":false},\":meNgu/Jg(Ev0L*HdS=V\":{\"opcode\":\"control_if\",\"next\":\"}rBGcmP_d$COOey6}50Q\",\"parent\":\"@%MrjFV}049qC=Nj3^mh\",\"inputs\":{\"CONDITION\":[2,\":p=c3_W3QJVo|)oymdHv\"],\"SUBSTACK\":[2,\"jQ`n7-8Vw9o.vF/Rk6R)\"]},\"fields\":{},\"shadow\":false,\"topLevel\":false},\":p=c3_W3QJVo|)oymdHv\":{\"opcode\":\"sensing_touchingcolor\",\"next\":null,\"parent\":\":meNgu/Jg(Ev0L*HdS=V\",\"inputs\":{\"COLOR\":[1,[9,\"#3b10ff\"]]},\"fields\":{},\"shadow\":false,\"topLevel\":false},\"jQ`n7-8Vw9o.vF/Rk6R)\":{\"opcode\":\"data_setvariableto\",\"next\":null,\"parent\":\":meNgu/Jg(Ev0L*HdS=V\",\"inputs\":{\"VALUE\":[3,\"7(Fk8GuD.gOcT)d3[;*+\",[10,\"0\"]]},\"fields\":{\"VARIABLE\":[\"t1\",\"^DoYu47@*@:68:}|8I}s\"]},\"shadow\":false,\"topLevel\":false},\"7(Fk8GuD.gOcT)d3[;*+\":{\"opcode\":\"sensing_timer\",\"next\":null,\"parent\":\"jQ`n7-8Vw9o.vF/Rk6R)\",\"inputs\":{},\"fields\":{},\"shadow\":false,\"topLevel\":false},\"}rBGcmP_d$COOey6}50Q\":{\"opcode\":\"control_if\",\"next\":null,\"parent\":\":meNgu/Jg(Ev0L*HdS=V\",\"inputs\":{\"CONDITION\":[2,\"cvj?m6qVk/~kYQLMB7Cc\"],\"SUBSTACK\":[2,\"*iO!tF?;N%w3f_O#PGF!\"]},\"fields\":{},\"shadow\":false,\"topLevel\":false},\"cvj?m6qVk/~kYQLMB7Cc\":{\"opcode\":\"sensing_touchingcolor\",\"next\":null,\"parent\":\"}rBGcmP_d$COOey6}50Q\",\"inputs\":{\"COLOR\":[1,[9,\"#ff0000\"]]},\"fields\":{},\"shadow\":false,\"topLevel\":false},\"*iO!tF?;N%w3f_O#PGF!\":{\"opcode\":\"data_setvariableto\",\"next\":\"Y[nEjmKTn^wg?uMC2kB2\",\"parent\":\"}rBGcmP_d$COOey6}50Q\",\"inputs\":{\"VALUE\":[3,\"V!N(W4H@ui;m6%z+B*dh\",[10,\"0\"]]},\"fields\":{\"VARIABLE\":[\"t1\",\"^DoYu47@*@:68:}|8I}s\"]},\"shadow\":false,\"topLevel\":false},\"V!N(W4H@ui;m6%z+B*dh\":{\"opcode\":\"operator_subtract\",\"next\":null,\"parent\":\"*iO!tF?;N%w3f_O#PGF!\",\"inputs\":{\"NUM1\":[3,\"d@cIcf6JIWE}!bv;q9O?\",[4,\"\"]],\"NUM2\":[3,[12,\"t1\",\"^DoYu47@*@:68:}|8I}s\"],[4,\"\"]]},\"fields\":{},\"shadow\":false,\"topLevel\":false},\"d@cIcf6JIWE}!bv;q9O?\":{\"opcode\":\"sensing_timer\",\"next\":null,\"parent\":\"V!N(W4H@ui;m6%z+B*dh\",\"inputs\":{},\"fields\":{},\"shadow\":false,\"topLevel\":false},\"d*Y%Pwk^XtFX;Ng~5e`u\":{\"opcode\":\"looks_say\",\"next\":null,\"parent\":\"I.ce1Y,!t2eDxWG@C;gO\",\"inputs\":{\"MESSAGE\":[3,\"NgEfX^.S*4xq)Z`VR[e#\",[10,\"你好！\"]]},\"fields\":{},\"shadow\":false,\"topLevel\":false},\"Y[nEjmKTn^wg?uMC2kB2\":{\"opcode\":\"control_if\",\"next\":null,\"parent\":\"*iO!tF?;N%w3f_O#PGF!\",\"inputs\":{\"SUBSTACK\":[2,\"I.ce1Y,!t2eDxWG@C;gO\"],\"CONDITION\":[2,\"+Z|BUbKx]a:8)P4OagwV\"]},\"fields\":{},\"shadow\":false,\"topLevel\":false},\"+Z|BUbKx]a:8)P4OagwV\":{\"opcode\":\"operator_equals\",\"next\":null,\"parent\":\"Y[nEjmKTn^wg?uMC2kB2\",\"inputs\":{\"OPERAND1\":[3,[12,\"t2\",\"SUgR:Xx!(`MMp,1yirzm\"],[10,\"\"]],\"OPERAND2\":[1,[10,\"0\"]]},\"fields\":{},\"shadow\":false,\"topLevel\":false},\"I.ce1Y,!t2eDxWG@C;gO\":{\"opcode\":\"data_setvariableto\",\"next\":\"d*Y%Pwk^XtFX;Ng~5e`u\",\"parent\":\"Y[nEjmKTn^wg?uMC2kB2\",\"inputs\":{\"VALUE\":[3,[12,\"t1\",\"^DoYu47@*@:68:}|8I}s\"],[10,\"0\"]]},\"fields\":{\"VARIABLE\":[\"t2\",\"SUgR:Xx!(`MMp,1yirzm\"]},\"shadow\":false,\"topLevel\":false},\"FO#8.eB5g-oP#-cqhXv5\":{\"opcode\":\"data_setvariableto\",\"next\":\"p,fn0imj[$qVj0a*j0KN\",\"parent\":\"/6H7Ofvp^.SD)?H0wPt)\",\"inputs\":{\"VALUE\":[1,[10,\"0\"]]},\"fields\":{\"VARIABLE\":[\"t1\",\"^DoYu47@*@:68:}|8I}s\"]},\"shadow\":false,\"topLevel\":false},\"p,fn0imj[$qVj0a*j0KN\":{\"opcode\":\"data_setvariableto\",\"next\":\"@%MrjFV}049qC=Nj3^mh\",\"parent\":\"FO#8.eB5g-oP#-cqhXv5\",\"inputs\":{\"VALUE\":[1,[10,\"0\"]]},\"fields\":{\"VARIABLE\":[\"t2\",\"SUgR:Xx!(`MMp,1yirzm\"]},\"shadow\":false,\"topLevel\":false},\"NgEfX^.S*4xq)Z`VR[e#\":{\"opcode\":\"operator_join\",\"next\":null,\"parent\":\"d*Y%Pwk^XtFX;Ng~5e`u\",\"inputs\":{\"STRING1\":[1,[10,\""+jsonCOMMAND[1]+"：\"]],\"STRING2\":[3,[12,\"t2\",\"SUgR:Xx!(`MMp,1yirzm\"],[10,\""+jsonCOMMAND[1]+"\"]]},\"fields\":{},\"shadow\":false,\"topLevel\":false}}}";


                  oGUI.props.vm.addSprite(objSprite);					//当前插入一辆小车的角色
                  oGUI.props.vm.runtime.targets[nId].setXY(jsonCOMMAND[2][0],jsonCOMMAND[2][1]);//同步更新坐标
                  oGUI.props.vm.runtime.targets[nId].setDirection(jsonCOMMAND[2][2]);		//同步更新方向
                  oGUI.props.vm.runtime.targets[nId].setSize(jsonCOMMAND[2][3]);		//同步更新大小
               }
               //else //该选手处于正在插入的状态，只需要等待。
               //{}
            }
         }
         break;

      case "GREENFLAG":
         oGUI.props.vm.runtime.greenFlag();				//远程执行
         break;

      case "STOPALL":
         arrPlayer.length=0;								//清空
         arrPlayerDelayed.length=0;							//清空
         arrPlayerCostume.length=0;
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

</script>


<!-- Scratch3.0 HTML5 Control Scripts -->
<script src=./js/control.js></script>

<!-- Scratch3.0 HTML5 Scripts -->
<script src="./js/projects.intl.js"></script><!-- Translate title element -->
<script src="./js/common.bundle.js"></script><!-- Vendor & Initialize (Session & Localization) -->
<script src="./js/projects.bundle.js"></script><!-- Webpack -->

<!-- Teaching Platform Websocket Scripts -->
<script src="./js/playsocket.js"></script>
<script type="text/javascript">

   var uname = "<?php echo $username;?>";
   var strWebSocketPlayURL="ws://<?php echo $WSSERVER;?>:<?php echo (8090+$room);?>";
   //createWebSocketPlay(strWebSocketPlayURL);
   initPlay(strWebSocketPlayURL);
</script>


    </body>
</html>
