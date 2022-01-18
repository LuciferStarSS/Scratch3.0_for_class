<?php
$username=isset($_POST["N"])?$_POST["N"]:"";
//$room=isset($_COOKIE['R'])?$_COOKIE['R']:0;
$classid=isset($_COOKIE['CLASSID'])?$_COOKIE['CLASSID']:0;


include "../include/config.inc.php";
$member=file_get_contents("../data/config/".$classid."/".$classid.".member.dat");
$group=file_get_contents("../data/config/".$classid."/".$classid.".group.dat");

$members=json_decode($member);
preg_match_all("/([^^]*?)\,([^^]*?);/",$group,$groups);

//print_r($group);
$n=array_search($username,$groups[1]);


//print_r($teacher_class);
if($n!==false)//学生
{
   echo json_encode($members[$groups[2][$n]]);
}
else if(isset($scratch_class[$username]))//教师
{
   echo json_encode($groups[1]);
}
?>