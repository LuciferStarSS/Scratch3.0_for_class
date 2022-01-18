<?php
$pergroup=isset($_POST['pg'])?$_POST['pg']:"";			//每组人数
$pos=isset($_POST['pos'])?$_POST['pos']:"";			//标签坐标数据
//$room=isset($_COOKIE['R'])?$_COOKIE['R']:0;
$classid=isset($_COOKIE['CLASSID'])?$_COOKIE['CLASSID']:0;	//班级

include "../include/config.inc.php";

$ip=$_SERVER['REMOTE_ADDR'];					//访问者IP
if($ip=="::1") $ip="127.0.0.1";

if(isset($teacher_room[$ip]))					//仅限教师访问，防止非授权访问导致数据丢失。
{
   $room=$teacher_room[$ip][1];					//机房

   file_put_contents("../data/config/$classid/".$classid."_".$pergroup.".pos.dat",$pos);
}
?>