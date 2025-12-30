<?php
$username=isset($_POST["N"])?$_POST["N"]:"";
$room=isset($_COOKIE['R'])?$_COOKIE['R']:0;
$classid=isset($_COOKIE['CLASSID'])?$_COOKIE['CLASSID']:0;


include "../../include/config.inc.php";
$member=file_get_contents("../../data/config/".$room."/".$classid.".member.dat");	//成员名单
$group=file_get_contents("../../data/config/".$room."/".$classid.".group.dat");	//分组信息

$members=json_decode($member);
preg_match_all("/([^^]*?)\,([^^]*?);/",$group,$groups);

$n=array_search($username,$groups[1]);

if($n!==false)//学生
{
   echo json_encode($members[$groups[2][$n]]);
}
else if($username==$teacher_name[$room])//教师
{
   echo json_encode($groups[1]);
}
?>