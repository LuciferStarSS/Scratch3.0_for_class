<?php
//Scratch中分组控制
//提交表单行为
$pergroup=isset($_GET["pg"])?$_GET["pg"]:"";			//每组人数，可为0,3,4。其它类型的暂未做适配。
$classid=isset($_COOKIE['CLASSID'])?$_COOKIE['CLASSID']:"";

include "../include/config.inc.php";

$ip=$_SERVER['REMOTE_ADDR'];				//访问者IP
if($ip=="::1") $ip="127.0.0.1";

if(isset($teacher_room[$ip]) && $classid)		//教师访问
{
   SetCookie("GROUP",$pergroup);
   $room=$teacher_room[$ip][1];
   file_put_contents("../data/config/".$classid."/group_".$classid.".conf",$pergroup);	//分组情况
}
?>