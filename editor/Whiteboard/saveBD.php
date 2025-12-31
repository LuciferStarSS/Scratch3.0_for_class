<?php
//教师端鼠标拖动小白板内元素时激发的数据保存操作。
//当$type==1时，完成小白板存档操作。
//$pergroup=isset($_POST['pg'])?$_POST['pg']:"";			//每组人数
$type=isset($_POST['t'])?$_POST['t']:"";			//标签坐标数据
$pos=isset($_POST['pos'])?$_POST['pos']:"";			//标签坐标数据
$room=isset($_COOKIE['R'])?$_COOKIE['R']:0;
$classid=isset($_COOKIE['CLASSID'])?$_COOKIE['CLASSID']:0;	//班级

$GID=isset($_POST['GID'])?intval($_POST['GID']):0;
$memo=isset($_POST['memo'])?$_POST['memo']:"无";

include "../../include/config.inc.php";

$ip=$_SERVER['REMOTE_ADDR'];					//访问者IP
if($ip=="::1") $ip="127.0.0.1";

if(isset($teacher_room[$ip]))					//仅限教师访问，防止非授权访问导致数据丢失。
{
   $room=$teacher_room[$ip][1];					//机房

   if(!file_exists("../../data/whiteboard/".$room."/".$GID."/"))
   {
      mkdir("../../data/whiteboard/".$room."/".$GID."/bd/",0777,true);
   }

   if(!file_exists("../../data/config/".$room."/"))
   {
      mkdir("../../data/config/".$room."/",0777,true);
   }

   file_put_contents("../../data/config/".$room."/".$classid.".bdpos.dat",$memo."\r\n".$pos);

   if($type)
      file_put_contents("../../data/whiteboard/".$room."/".$GID."/bd/".time(),$memo."\r\n".$pos);

   echo "['OK']";
}
?>