<?php
//学生端获取小白板当前数据
$room=isset($_COOKIE['R'])?$_COOKIE['R']:1;
$classid=isset($_COOKIE['CLASSID'])?$_COOKIE['CLASSID']:3;
include "../../include/config.inc.php";
$pos= @file_get_contents("../../data/config/".$room."/".$classid.".bdpos.dat");
if($pos!="")
   echo $pos;
else
   echo "[]";
?>