<?php
$member=isset($_POST['member'])?$_POST['member']:"";		//组内成员信息
$group=isset($_POST['group'])?$_POST['group']:"";		//成员所在组信息
$classid=isset($_COOKIE['CLASSID'])?$_COOKIE['CLASSID']:0;	//班级

include "../include/config.inc.php";

$ip=$_SERVER['REMOTE_ADDR'];					//访问者IP
if($ip=="::1") $ip="127.0.0.1";

if(isset($teacher_room[$ip]) && $classid>0)			//仅限教师访问，防止非授权访问导致数据丢失。
{
   //$room=$teacher_room[$ip][1];					//教室

   file_put_contents("../data/config/".$classid."/".$classid.".member.dat",$member);
   file_put_contents("../data/config/".$classid."/".$classid.".group.dat",$group);
}
?>