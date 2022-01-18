<?php
error_reporting(E_ALL);//print_r($_REQUEST);
include("../include/config.inc.php");

$classid=isset($_POST['C'])?intval($_POST['C']):"";
$date=isset($_POST['D'])?validateFilename($_POST['D']):"";
$filename=isset($_POST['F'])?validateFilename($_POST['F']):"";
$msg=isset($_POST['MSG'])?htmlentities($_POST['MSG']):"";
$username=isset($_COOKIE['USERNAME'])?validateFilename($_COOKIE['USERNAME']):"";
$ip=getenv("REMOTE_ADDR");

if($date!="" && $classid!="" && $filename!="" && $msg!="" && $username!=""  && isset($classname[$classid-1]))
{
   $class=$classname[$classid-1];

   if(!file_exists("../".$student_works."/$class/$date/msg"))
      mkdir("../".$student_works."/$class/$date/msg");

   $add="../".$student_works."/$class/$date/msg/$filename".".txt";

   $LOCK=$add."_LOCK";
   while(file_exists($LOCK))
   {
      usleep(1);
   }
   file_put_contents($LOCK,"1");

   file_put_contents($add,file_get_contents($add).$username."(".date("Y-m-d H:i:s",time()+8*3600).")：".$msg."\r\n");
   unlink($LOCK);
}