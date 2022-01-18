<?php
include "../include/config.inc.php";
include "../include/db.inc.php";

$week=isset($_COOKIE['W'])?$_COOKIE['W']:date("oW");
$day=isset($_COOKIE['D'])?$_COOKIE['D']:date("N");
$lesson=isset($_COOKIE['N'])?$_COOKIE['N']:0;
$room=isset($_COOKIE['R'])?$_COOKIE['R']:1;
$helperName=isset($_POST['S'])?$_POST['S']:'';

if($helperName!='')//提交表单，修改学生分数的操作
{
   $arrName=explode("_",$helperName);
   if(count($arrName)==2)
   {
      $sql="UPDATE `logs` set SCORE = SCORE -1 where WEEK=$week and SEAT ='$arrName[0]' and ROOM =$room and DAY =$day and LESSON=$lesson";
      //echo $sql;
      $m->DoQueryNoReturn($sql);
      if($m->GetAffectedId()>0)
      {
         echo "已对虚假帮助者执行 $helperName 扣除1积分的处罚。";
      }
   }
}