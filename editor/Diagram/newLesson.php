<?php
include "../../include/config.inc.php";

$CLASSID=isset($_COOKIE["CLASSID"])?$_COOKIE["CLASSID"]:0;
$GRADEID=isset($_COOKIE["GRADEID"])?$_COOKIE["GRADEID"]:0;

$ip=$_SERVER['REMOTE_ADDR'];

$lesson_name=isset($_POST["L"])?$_POST["L"]:exit();

$ips=explode('.',$ip);
$room=0;
$admin=0;
if(isset($teacher_room[$ip]))	//教师访问，强制用IP控制。
{
   $sname=$teacher_room[$ip][0];
   setCookie("USERNAME",$sname,time()+3600*12,$site_path);	//Scratch要用
   $ROOM=$teacher_room[$ip][1];

   $admin=1;

   

   $path="../../data/diagram/".$ROOM."/".$GRADEID."/";

   if(!file_exists($path.$lesson_name))
   {
      if(mkdir($path.$lesson_name,0777,true))
      {
         echo "OK";
      }
      file_put_contents($path."/lesson.dat",$lesson_name);
      
   }
   else echo "此课信息已存在";

}
else				//学生访问
{
   exit();
}
