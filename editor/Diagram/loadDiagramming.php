<?php
/*****************************************************

   教师和学生，都可以通过此程序打开当前的任务数据。

   学生可以打开自己修改后的数据。

*****************************************************/
include("../../include/config.inc.php");
//echo $student_works;


$DD=isset($_COOKIE["DD"])?$_COOKIE["DD"]:"2025-09-01";
$USERNAME=isset($_COOKIE["USERNAME"])?$_COOKIE["USERNAME"]:"未命名";
$ROOM=isset($_COOKIE["R"])?$_COOKIE["R"]:1;
$CLASSID=isset($_COOKIE["CLASSID"])?$_COOKIE["CLASSID"]:NULL;
$GRADEID=isset($_COOKIE["GRADEID"])?$_COOKIE["GRADEID"]:NULL;

$from=isset($_GET["F"])?$_GET["F"]:"teacher";//获取数据来源，默认为教师发布的内容。


//echo $from;

if($CLASSID!=NULL)
   $CNAME=$classname[$CLASSID-1];
else 
{
   echo json_encode(Array("ERROR","NO CLASSID INFO","NO CLASSID INFO."));
   exit();
}

if($GRADEID==NULL)
{
   if($CLASSID!=NULL)
   {
      $GRADEID=$grades[$CLASSID-1];
   }
}



   $path="../../data/diagram/".$ROOM."/".$GRADEID."/";

   $lesson=@file_get_contents($path."lesson.dat");

   $proj_path=$path.$lesson."/";

   $task=@file_get_contents($proj_path."task.dat");

   $task_path=$proj_path.$task;

//echo "$path  \n $proj_path  $lesson  \n $task_path\n   $task\n";



//$PROJ=@file_get_contents("../../data/task/".$ROOM."_".$GRADEID."_task.inc.php");//"test";

  $PROJ=$lesson."_".$task;

//echo $GRADEID;



$IP=ip2long($_SERVER['REMOTE_ADDR']);
$file_source="../".$student_works.$CNAME."/".$DD."/".$IP."_".$USERNAME."_".$PROJ.".DAT";

if($from=="teacher")
{
   $file_source="../../data/diagram/".$ROOM."/".$GRADEID."/".$lesson."/".$task."/diagram.DAT";
}



$diagram_data= @file_get_contents($file_source);

$arrResult=Array("OK",$diagram_data,$file_source);
if($diagram_data=="") $arrResult=Array("ERROR",$file_source,$file_source);


echo json_encode($arrResult);
?>