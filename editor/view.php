<?php
error_reporting(0);
header("Pragma:no-cache");
header("Cache-Control:no-cache,must-revalidate");
include("../include/config.inc.php");

$filename=isset($_GET["SB2"])?validateFilename(iconv("GBK","UTF-8",$_GET['SB2'])):"";

if($filename=="") $filename=isset($_GET["SB2"])?validateFilename($_GET['SB2']):"";//IE浏览器可能存在字符集错乱


$classid=isset($_GET['C'])?intval($_GET['C']):"";
$date=isset($_GET['D'])?validateFilename($_GET['D']):"";
if($date=="") $date=date("Y-m-d");
if($filename!="" && $date!="" && $classid!="" && isset($classname[$classid-1]))
{
   $class=$classname[$classid-1];

   $filepath="../".$student_works.$class."/".$date."/".$filename;//限定路径，防止越界。

   if(file_exists($filepath))
   {
echo "../../".$student_works.$class."/".$date."/".$filename."?t=".rand(0,255);
//echo $filepath;
exit;//      echo file_get_contents($filepath);
   }
   else
   {
      $filepath="../".$student_works.$class."/".$date."/".$_GET['SB2'];//限定路径，防止越界。

      if(file_exists($filepath))
      {
echo "../../".$student_works.$class."/".$date."/".$_GET['SB2']."?t=".rand(0,255);
//echo $filepath;
exit;//         echo file_get_contents($filepath);
      }

   }
}