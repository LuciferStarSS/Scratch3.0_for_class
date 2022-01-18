<?php
error_reporting(0);
header("Pragma:no-cache");
header("Cache-Control:no-cache,must-revalidate");
include("../include/config.inc.php");

$classid=isset($_POST['C'])?intval($_POST['C']):"";
$date=isset($_POST['D'])?validateFilename($_POST['D']):"";
$filename=isset($_POST['F'])?validateFilename($_POST['F']):"";

if($date!="" && $classid!="" && $filename!="" && isset($classname[$classid-1]))
{
   $class=$classname[$classid-1];

   $add="../".$student_works."/$class/$date/msg/$filename".".txt";
   //echo $add;
   $list=explode("\r\n",@file_get_contents($add));
   echo  json_encode($list);
}