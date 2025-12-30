<?php
//print_r($_POST);
//教师端删除小白板文本历史数据
error_reporting(0);
$TXTID=isset($_POST['ID'])?$_POST['ID']:"";
$GID=isset($_POST['GID'])?intval($_POST['GID']):0;
$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):0;
if($TXTID!="" && $GID!=0)
{
   $historyData=@file_get_contents("../../data/whiteboard/".$room."/".$GID."/txt/history.txt");
   if($historyData!="")
   {
      $historyTXT= unserialize($historyData);
   }
   else
      $historyTXT=Array();

   if(!isset($historyTXT[$TXTID]))
   {
      exit('["ERROR:NORECORD"]');
   }

   unset($historyTXT[$TXTID]);
   file_put_contents("../../data/whiteboard/".$room."/".$GID."/txt/history.txt",serialize($historyTXT));

   exit('["OK"]');
}
else
   exit('["ERROR:NOFILE"]');