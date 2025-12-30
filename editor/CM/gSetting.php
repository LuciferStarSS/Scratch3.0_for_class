<?php
//课程相关信息
include "../../include/config.inc.php";
$auto=isset($_COOKIE['AUTOREFRESHING'])?$_COOKIE['AUTOREFRESHING']:0;		//是否需要自动刷新
$ip=$_SERVER['REMOTE_ADDR'];				//访问者IP

if($ip=="::1") $ip="127.0.0.1";

$ipoffset=0;
$ips=explode('.',$ip);
$other=false;

if(!isset($student_room[$ips[2]]))//未配置的网段//$ips[2]!=3 && $ips[2]!=4)
{
   $other=true;
}

$ipstr=$ip;	

$ipOffset=isset($student_room[$ips[2]])?$student_room[$ips[2]]:0;

$week=isset($_COOKIE["W"])?$_COOKIE["W"]:date("oW");		//一年中第几周
$day=isset($_COOKIE["D"])?$_COOKIE["D"]:date("N");		//一周中第几天
$lesson=isset($_COOKIE["N"])?$_COOKIE["N"]:0;			//一天第几节课
$classid=isset($_COOKIE["CLASSID"])?$_COOKIE["CLASSID"]:0;			//一天第几节课


//echo $week."|". $day."]".date("oW");
//$lesson=5;

//提交表单行为
$pergroup=isset($_GET["pos"])?$_GET["pos"]:"";
$room=0;
$forced=1;	
$admin=0;					//强制显示所选课的登记情况

if(isset($teacher_room[$ip]))	//教师访问
{
   $room=$teacher_room[$ip][1];

   $username=$teacher_room[$ip][0];
   $admin=1;
}

$ip=ip2long($ip);					//IP改为数值，为入库做准备

include "../../include/db.inc.php";

if(isset($_POST['ID']))					//提交表单，修改学生分数的操作
{
   $pc=count($_POST['ID']);
   for($i=0;$i<$pc;$i++)				//一个班最多有48条数据。
   {
      if($_POST['scores'][$i]!="")			//全班得分为0，会出现班级不显示的问题。
      {
         $sql="update LOGS set SCORE=".$_POST['scores'][$i]." where ID=".$_POST['ID'][$i]." AND WEEK=".$_POST['WEEK'][$i]."";
         $m->DoQueryNoReturn($sql);
      }
   }
   header("Location: ".getenv("HTTP_REFERER"));
}

if($forced==0)						//临时换课后，也可以强制查看其他班级的信息
{
   if(file_exists("../../include/$room.inc.php"))		//检查是否存在临时换课
   {
      include "../../include/$room.inc.php";
      $week=$dinfo[0];
      $day=$dinfo[1];

      $lesson=$dinfo[2];
   }

   if($lesson==0)						//如未指定为第几节课，则开始查找比对。
   {
      $time_store=Array();
      for($i=0;$i<count($time_offset);$i++)		//计算起始点后，存入数组备用
      {
         $start=mktime($time_offset[$i][0],$time_offset[$i][1]-5,"00",date("m"),date("d"),date("Y"));
         $end=mktime($time_offset[$i][2],$time_offset[$i][3]+5,"00",date("m"),date("d"),date("Y"));
         $time_store[]=Array($start,$end);
      }

      $date= mktime(date("H"),date("i"),date("s"),date("m"),date("d"),date("Y"));//当前时间。Apache2的时区没有调整为本地的，所以差了8小时。

      for($i=0;$i<count($time_store);$i++)			//判断当前是第几节课
      {
         if($date>=$time_store[$i][0] && $date<=$time_store[$i][1]) $lesson=($i+1); 
      }							
   }
}
//参数处理完毕，开始显示页面

//echo $lesson;

if( $admin==1)//上课登记情况汇总页面。教师端。
{
   //setCookie("D",$day,time()+3600*12,$site_path);			//星期
   //setCookie("W",$week,time()+3600*12,$site_path);		//周次
   //setCookie("N",$lesson,time()+3600*12,$site_path);		//课时
   //setCookie("R",$room,time()+3600*12,$site_path);		//教室
   //setCookie("S",$seat_str,time()+3600*12,$site_path);		//带前导0的座位号
?><!DOCTYPE html>
<html>
<head><meta http-equiv="content-type" content="text/html;charset=UTF-8">
<title>班级分组</title>
<link id="skin_style" href="../css/ui2.css" type="text/css" rel="stylesheet" charset="utf-8" /> 
<style>
  .white_content
 {
     display: none;   position: absolute;   
     
     width: 840px;
     height: 280px;  padding: 16px;  border: 16px solid orange;
     background-color: white;  z-index:2002;  overflow: auto;
     margin:auto;
     right:0;
     bottom:0;
     left:0;
     top:0;
  }  

.circle {
	border-radius: 50%;
	width: 200px;
	height: 200px; 
	/* 宽度和高度需要相等 */
}

.circles {
	border-radius: 15%;
	width: 200px;
	height: 200px; 
	/* 宽度和高度需要相等 */
}


.roundbtn {
	border-radius: 50%;
	#width: 200px;
	#height: 200px; 
	/* 宽度和高度需要相等 */
}


table
{
   font-size:30;
}

input
{
   font-size:15;
}
</style>
<script src=../js/jquery.js></script>
<script src=./js/page.js></script>
<script>
var t=0;
var cname="";
var date="";
var pergroup="<?php echo $pergroup;?>";
var week=<?php echo $week;?>;
var day=<?php echo $day;?>;
var lesson=<?php echo $lesson;?>;
var room=<?php echo $room;?>;
var forced=<?php echo $forced;?>;
var seatOffset=<?php echo isset($ipOffset[1])?$ipOffset[1]:0;?>;
function setFrame()
{
   if(parent.groupwindow.scrolling=="no")
   {
      parent.groupwindow.scrolling="yes";
   }
   else
   {
      parent.groupwindow.scrolling="no";
   }
}
function autoPos()
{
<?php
if($pergroup==3){?>
   var strDefault="35px,39px,35px,73.5px,35px,108px,35px,184px,35px,218.5px,35px,253px,35px,329px,35px,363.5px,35px,398px,35px,474px,35px,508.5px,35px,543px,255px,39px,255px,73.5px,255px,108px,255px,184px,255px,218.5px,255px,253px,255px,329px,255px,363.5px,255px,398px,255px,474px,255px,508.5px,255px,543px,475px,39px,475px,73.5px,475px,108px,475px,184px,475px,218.5px,475px,253px,475px,329px,475px,363.5px,475px,398px,475px,474px,475px,508.5px,475px,543px,695px,39px,695px,73.5px,695px,108px,695px,184px,695px,218.5px,695px,253px,695px,329px,695px,363.5px,695px,398px,695px,474px,695px,508.5px,695px,543px";
<?php
}
else if($pergroup==4){?>
   var strDefault="35px,39px,35px,75px,35px,111px,35px,147px,35px,219px,35px,255px,35px,291px,35px,327px,35px,399px,35px,435px,35px,471px,35px,507px,260px,39px,260px,75px,260px,111px,260px,147px,260px,219px,260px,255px,260px,291px,260px,327px,260px,399px,260px,435px,260px,471px,260px,507px,485px,39px,485px,75px,485px,111px,485px,147px,485px,219px,485px,255px,485px,291px,485px,327px,485px,399px,485px,435px,485px,471px,485px,507px,710px,39px,710px,75px,710px,111px,710px,147px,710px,219px,710px,255px,710px,291px,710px,327px,710px,399px,710px,435px,710px,471px,710px,507px";
<?php
}
else if($pergroup==1){?>
   var strDefault="100px,55px,280px,55px,460px,55px,640px,55px,100px,95px,280px,95px,460px,95px,640px,95px,100px,135px,280px,135px,460px,135px,640px,135px,100px,175px,280px,175px,460px,175px,640px,175px,100px,215px,280px,215px,460px,215px,640px,215px,100px,255px,280px,255px,460px,255px,640px,255px,100px,295px,280px,295px,460px,295px,640px,295px,100px,335px,280px,335px,460px,335px,640px,335px,100px,375px,280px,375px,460px,375px,640px,375px,100px,415px,280px,415px,460px,415px,640px,415px,100px,455px,280px,455px,460px,455px,640px,455px,100px,495px,280px,495px,460px,495px,640px,495px";
<?php
}
else if($pergroup==48){?>
   var strDefault="100px,55px,280px,55px,460px,55px,640px,55px,100px,95px,280px,95px,460px,95px,640px,95px,100px,135px,280px,135px,460px,135px,640px,135px,100px,175px,280px,175px,460px,175px,640px,175px,100px,215px,280px,215px,460px,215px,640px,215px,100px,255px,280px,255px,460px,255px,640px,255px,100px,295px,280px,295px,460px,295px,640px,295px,100px,335px,280px,335px,460px,335px,640px,335px,100px,375px,280px,375px,460px,375px,640px,375px,100px,415px,280px,415px,460px,415px,640px,415px,100px,455px,280px,455px,460px,455px,640px,455px,100px,495px,280px,495px,460px,495px,640px,495px";
<?php
}
?>

   var arrDefault=strDefault.split(",");
   var arrDivs=$(".circles");
   for(var i=0;i<arrDivs.length;i++){
     arrDivs[i].style.left=arrDefault[i*2];
     arrDivs[i].style.top=arrDefault[i*2+1];
   }
   
   saveGroupInfo();
}

</script>
</head><body>
<?php

   //if($ipstr=="192.168.4.10" || $ipstr=="192.168.10.113") $room=2;
   //else if($ipstr=="127.0.0.1" || $ipstr=="192.168.3.9" || $ipstr=="192.168.10.112" || $ipstr=="192.168.10.212") $room=1;

   echo "<div onclick='setFrame();' align=center><iframe name='onescore' id='onescore' frameborder=no height=0 scrolling=no></iframe><form name=form_group id=form_group method=POST action=gSetting.php?act=newscore&W=$week&D=$day&L=$lesson&pos=$pergroup><table width=1300 border=0 cellpadding=0 cellspacing=0 ><tr><th colspan=12 align=center class=new></th></tr></table>";

   if($pergroup>0)//有分组
   {
      $pos=@file_get_contents("../../data/config/".$room."/".$classid."_".$pergroup.".pos.dat");//获取配置好的坐标
      if($pos=="")
         $pos=@file_get_contents("../../data/config/".$room."/_$pergroup.pos.dat");//默认坐标
   }
   else
   {
      file_put_contents("../../data/config/".$room."/".$classid.".group.dat","");//清空成员=>组信息
      file_put_contents("../../data/config/".$room."/".$classid.".member.dat","");//清空组=>成员信息
      exit();
   }
   $posArr=explode(",",$pos);

   //group background
   $group_offset_w=0;
   

   if($pergroup==1)//众人一组
   {
      $group_offset_w=220;
      $group_offset_h=145;
      $group_height=110;

      if($group_offset_w)
      {
         echo "<div class=circle alignstyle='0' style='border-radius: 9%;background: peru;width:875px;height:505px;left:10px;top:35px;position:absolute;' id='divx1' ><input  class=roundbtn style='position: relative;z-index:999999; left: 110px;top: -25px;' type=button value='本组加1分' onclick='addgroup(0);'><input  class=roundbtn style='position: relative;z-index:999999; top:-25px;right:0px;width: 30px;' type=button onclick='autoalign(0)' value='1'><input  class=roundbtn style='position: relative;z-index:999999; right:111px;top: -25px;' type=button value='本组减1分' onclick='minusgroup(0);'></div>";
      }

      $row=0;
      $col=0;

      for($i=0;$i<48;$i++)
      {
         if($i%4==0) {$col++;$row=0;}
         $row++;
         echo "<div class=circles style='background: lemonchiffon;width:150px;height:30px;left:".(180*$row-80).";top:".((40*$col)+15).";position:absolute;' id='div".($i+1)."' >";
         echo "<div  onmousedown='drag(this,event)' onmouseup='' style='position: relative;height: 30px;' id=seat_".sprintf("%02d",($i+1))."  align=center><div style='position:relative;left:-60px;top:4px;width:30px;'  id=seatno_".sprintf("%02d",($i+1)).">".sprintf("%02d",($i+1))."</div><div style='position: relative;top: -18px;left:-8px;width:90px;' id=name_".sprintf("%02d",($i+1)).">&nbsp;</div><div style='position: relative; top: -45px; right:-58px;width:50px; height:30px;' id=score_".sprintf("%02d",($i+1)).">&nbsp;</div></div>";
         echo "</div>";
      }
   }
   else if($pergroup==48)//众人一组
   {
      $group_offset_w=220;
      $group_offset_h=145;
      $group_height=110;

      $row=0;
      $col=0;

      for($i=0;$i<48;$i++)
      {
         if($i%4==0) {$col++;$row=0;}
         $row++;
         echo "<div class=circles style='background: lemonchiffon;width:150px;height:30px;left:".(180*$row-80).";top:".((40*$col)+15).";position:absolute;' id='div".($i+1)."' >";
         echo "<div  style='position: relative;height: 30px;' id=seat_".sprintf("%02d",($i+1))."  align=center><div style='position:relative;left:-60px;top:4px;width:30px;'  id=seatno_".sprintf("%02d",($i+1)).">".sprintf("%02d",($i+1))."</div><div style='position: relative;top: -18px;left:-8px;width:90px;' id=name_".sprintf("%02d",($i+1)).">&nbsp;</div><div style='position: relative; top: -45px; right:-58px;width:50px; height:30px;' id=score_".sprintf("%02d",($i+1)).">&nbsp;</div></div>";
         echo "</div>";
      }
   }
   else
   {
      if($pergroup==4)//4人小组
      {
         $group_offset_w=225;		//水平间隔
         $group_offset_h=180;		//垂直间隔
         $group_height=145;		//circle高
      }
      else if($pergroup==3)//3人小组
      {
         $group_offset_w=220;
         $group_offset_h=145;
         $group_height=110;
      }

      if($group_offset_w)
      {
         for($i=0;$i<4;$i++)//行
         {
            for($j=0;$j<12/$pergroup;$j++)//列
            {
               echo "<div class=circle alignstyle='0' style='border-radius: 9%;background: peru;width:200px;height:".$group_height."px;left:".(10+$i*$group_offset_w)."px;top:".(35+$j*$group_offset_h)."px;position:absolute;' id='divx".($i*(12/$pergroup)+$j+1)."' ><input  class=roundbtn style='position: relative;z-index:999999; left: 110px;top: -25px;' type=button value='本组加1分' onclick='addgroup(".($i*(12/$pergroup)+$j+1).");'><input  class=roundbtn style='position: relative;z-index:999999; top:-25px;right:0px;width: 30px;' type=button onclick='autoalign(".($i*(12/$pergroup)+$j+1).")' value='".($i*(12/$pergroup)+$j+1)."'><input  class=roundbtn style='position: relative;z-index:999999; right:111px;top: -25px;' type=button value='本组减1分' onclick='minusgroup(".($i*(12/$pergroup)+$j+1).");'></div>";
            }
         }
      }

      for($i=0;$i<48;$i++)
      {
         echo "<div class=circles style='background: lemonchiffon;width:150px;height:30px;left:".$posArr[$i*2].";top:".$posArr[$i*2+1].";position:absolute;' id='div".($i+1)."' >";
         echo "<div  onmousedown='drag(this,event)' onmouseup='' style='position: relative;height: 30px;' id=seat_".sprintf("%02d",($i+1))."  align=center><div style='position:relative;left:-60px;top:4px;width:30px;'  id=seatno_".sprintf("%02d",($i+1)).">".sprintf("%02d",($i+1))."</div><div style='position: relative;top: -18px;left:-8px;width:90px;' id=name_".sprintf("%02d",($i+1)).">&nbsp;</div><div style='position: relative; top: -45px; right:-58px;width:50px; height:30px;' id=score_".sprintf("%02d",($i+1)).">&nbsp;</div></div>";
         echo "</div>";
      }
   } 
}
?>

<script>

   function startInterTimer()
   {
      timer=setInterval("refreshPage();",5000);
   }

   function stopInterTimer()
   {
      clearTimeout(timer);
   }

   refreshPage();				//页面打开后，获取一次数据。
   var timer=setInterval("refreshPage();",5000);	//每隔5秒自动刷新。
</script>
</body>
</html>