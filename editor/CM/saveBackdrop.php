<?php
$script=isset($_POST['S'])?$_POST['S']:"";				//脚本数据
$ID=isset($_POST['ID'])?$_POST['ID']:"";				//该脚本上一次保存的文件名
$room=isset($_COOKIE['R'])?$_COOKIE['R']:"";				//机房
if($script && $room)
{
   if(strlen($ID)==32) $fid=$ID;
   else $fid=md5($script);
   file_put_contents("../../data/scripts/".$room."/".$fid,$script);
   echo $fid;								//返回当前保存的文件名
}