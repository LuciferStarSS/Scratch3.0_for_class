<?php
include "../../include/config.inc.php";
include "../../include/db.inc.php";

//print_r($_COOKIE);

$week=isset($_COOKIE['W'])?$_COOKIE['W']:date("oW");
$day=isset($_COOKIE['D'])?$_COOKIE['D']:date("N");
$lesson=isset($_COOKIE['N'])?$_COOKIE['N']:0;
$room=isset($_COOKIE['R'])?$_COOKIE['R']:1;
$strNames=isset($_POST['S'])?$_POST['S']:'';
$TYPE=isset($_POST['T'])?$_POST['T']:'';
//print_r($_POST);
$arrNames=explode(",",$strNames);
$nc=count($arrNames);
//print_r($strNames);
//echo $nc;
if($nc>0)					//提交表单，修改学生分数的操作
{
   $x = 0;
   $score=1;						//速问速答，一次1分。
   if($TYPE=="CARRACING")				//赛车比赛，一次加10分。
      $score=10;
   for($i=0;$i<$nc;$i++)				//一个班最多有48条数据。
   {
      if($arrNames[$i]!="")
      {
         $sql="UPDATE `logs` set SCORE = SCORE +".$score." where WEEK=$week and SEAT ='$arrNames[$i]' and ROOM =$room and DAY =$day and LESSON=$lesson";
         //echo $sql."\r\n";
         $m->DoQueryNoReturn($sql);
         if($m->GetAffectedId()>0) $x++;
      }
   }
   if($x>0)  
     echo "已更新 $x 个同学（".$strNames."）的成绩。";
}
else echo "竟无人答对此题！";
