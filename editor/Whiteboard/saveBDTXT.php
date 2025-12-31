<?php
//教师端保存小白板文本历史数据
//print_r($_POST);
error_reporting(0);
$TXTID=isset($_POST['ID'])?$_POST['ID']:"";
$TXTDATA=isset($_POST['DATA'])?$_POST['DATA']:"";
$GID=isset($_POST['GID'])?intval($_POST['GID']):0;
$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):0;
if($TXTID!="" && $TXTDATA!="" && $GID!=0)
{
   $historyData=@file_get_contents("../../data/whiteboard/".$room."/".$GID."/txt/history.txt");
   if($historyData!="")
   {
      $historyTXT= unserialize($historyData);
   }
   else
      $historyData=Array();

   //file_put_contents("../../data/whiteboard/".$room."/".$GID."/txt/".$TXTID,$TXTDATA);
   if(!in_array($TXTDATA,$historyTXT))
   {
      $historyTXT[$TXTID]=$TXTDATA;

      if(!is_dir("../../data/whiteboard/".$room."/".$GID."/txt")) mkdir("../../data/whiteboard/".$room."/".$GID."/txt",0777,true);


      file_put_contents("../../data/whiteboard/".$room."/".$GID."/txt/history.txt",serialize($historyTXT));
   }

   exit('["OK"]');
}
else
   exit('["ERROR:NOFILE"]');