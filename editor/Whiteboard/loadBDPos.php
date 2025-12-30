<?php
//教师端获取小白板单个历史存档数据
$ID=isset($_POST['ID'])?$_POST['ID']:"";
$GID=isset($_POST['GID'])?intval($_POST['GID']):0;
$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):0;
if($GID!=0 && $ID)
{
   $pos= @file_get_contents("../../data/whiteboard/".$room."/".$GID."/bd/".$ID);
   //echo "../../data/whiteboard/".$room."/".$GID."/bd/".$ID;
   if($pos!="")
      echo $pos;
   else
      echo "[]";
}
else echo "[]";
?>