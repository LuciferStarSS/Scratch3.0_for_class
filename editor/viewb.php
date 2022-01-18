<?php
error_reporting(0);
header("Pragma:no-cache");
header("Cache-Control:no-cache,must-revalidate");
include("../include/config.inc.php");

$projname=isset($_COOKIE['NEWPROJNAME'])?validateFilename(urldecode($_COOKIE['NEWPROJNAME'])):"";	//要防止异常文件名出现，还要防止访问上级目录
$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):0;
$username=isset($_COOKIE['USERNAME'])?validateFilename($_COOKIE['USERNAME']):"";
$ip=getenv("REMOTE_ADDR");

if($ip=="::1") $ip="127.0.0.1";

$bkfilename=isset($_GET["SB2"])?validateFilename(iconv("GBK","UTF-8",$_GET['SB2'])):"";
if($bkfilename=="") $bkfilename=isset($_GET["SB2"])?validateFilename($_GET['SB2']):"";//IE浏览器可能存在字符集错乱

$classid=isset($_GET['C'])?intval($_GET['C']):"";
$date=isset($_GET['D'])?validateFilename($_GET['D']):"";
if($date=="") $date=date("Y-m-d");

//echo $classname[$classid-1];
//echo $bkfilename;
if( $bkfilename!="" && $date!="" && $classid!="" && isset($classname[$classid-1]))
{
   $class=$classname[$classid-1];

   if($projname==""){
      $filenamepath= "../include/".$room."_task.inc.php";							//预设项目名
      $projname=validateFilename(@file_get_contents($filenamepath));
   }

   $filepath="../".$student_works."/".$class."/".$date."/backup/$ip"."_".$username."_".$projname."/".$bkfilename;//限定路径，防止越界。
   //echo $filepath;
   if(file_exists($filepath))
   {
      echo "../../../".$filepath."?t=".rand(0,255);
//      echo file_get_contents($filepath);
   }
}