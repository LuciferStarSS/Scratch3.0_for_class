<?php
error_reporting(0);
header("Pragma:no-cache");
header("Cache-Control:no-cache,must-revalidate");
include("../include/config.inc.php");

$classid=isset($_POST['C'])?intval($_POST['C']):"";
$date=isset($_POST['D'])?validateFilename($_POST['D']):"";
$username=isset($_COOKIE['USERNAME'])?iconv("UTF-8","GBK",$_COOKIE['USERNAME']):"";
$username=isset($_COOKIE['USERNAME'])?$_COOKIE['USERNAME']:"";
//echo $username;
$list=Array();

$admin=0;
if($username=="吴老师" ||$username=="矫老师" ||$username=="陈老师") $admin=1;
//echo $username;
//echo $admin;


$ip=getenv("REMOTE_ADDR");
$room=isset($_COOKIE['R'])?$_COOKIE['R']:0;
$ips=explode('.',$ip);

$group=file_get_contents("../include/G_".$room.".inc.php");//分组后，服务器上的列表显示
$group_member=Array();
if($group>0)
{
   $seat_offset=$ips[3]-$student_room[$ips[2]][1];
   $group_id=ceil($seat_offset/$group)-1;
   for($i=0;$i<$group;$i++)
   {
      $group_member[]=$ips[0].".".$ips[1].".".$ips[2].".".($group_id*$group+$i+1+$student_room[$ips[2]][1]);
   }
}
$gmc=count($group_member);//由于学生文件名中都有固定的IP数据，所以根据IP算出当前学生所在组的所有IP，并在文件遍历时判断是否属于该组。

//echo $gmc;
if($date!="" && $classid!="" && isset($classname[$classid-1]))
{
   $class=$classname[$classid-1];

   $add="../".$student_works."$class/$date/";
   //echo $add;
   if ($handle = opendir($add))
   {
      while (false !== ($file = readdir($handle)))
      {
         $file_ip=explode("_",$file);

         if (is_file($add.$file)==TRUE && strstr($file,".SB")  && ($admin==1 || strstr($file,$username) || strstr($file,"ALL_") || strstr($file,"_EDITABLE_") ))
         { 
            $list[]=$file;
         }
         else if($gmc>0 && in_array($file_ip[0],$group_member))			//其他同学的作品，在分组后，组内可见。
         {
            $list[]=$file;
         }
      }
      closedir($handle); 
   }
}
echo  json_encode($list);
//echo $username;
//echo $_COOKIE['USERNAME'];
