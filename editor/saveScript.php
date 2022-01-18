<?php
$script=isset($_POST['S'])?$_POST['S']:"";				//脚本数据
$ID=isset($_POST['ID'])?$_POST['ID']:"";				//该脚本上一次保存的文件名
//$room=isset($_COOKIE['R'])?$_COOKIE['R']:0;				//机房
$classid=isset($_COOKIE['CLASSID'])?intval($_COOKIE['CLASSID']):0;

if($script && $classid)
{
   if(strlen($ID)==32) $fid=$ID;
   else $fid=md5($script);
   file_put_contents("../data/scripts/".$classid."/".$fid,$script);
   echo $fid;								//返回当前保存的文件名
}