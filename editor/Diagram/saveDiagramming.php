<?php
include("../../include/config.inc.php");

$DD=isset($_COOKIE["DD"])?$_COOKIE["DD"]:"2025-09-01";
$USERNAME=isset($_COOKIE["USERNAME"])?$_COOKIE["USERNAME"]:"未命名";
$ROOM=isset($_COOKIE["R"])?$_COOKIE["R"]:1;
$CLASSID=isset($_COOKIE["CLASSID"])?$_COOKIE["CLASSID"]:0;
$GRADEID=isset($_COOKIE["GRADEID"])?$_COOKIE["GRADEID"]:0;



if($GRADEID==0)
{
   if($CLASSID!=0)
   {
      $GRADEID=$grades[$CLASSID-1];
   }
}

//$PROJ=file_get_contents("../data/task/".$ROOM."_".$GRADEID."_task.inc.php");

$IP=ip2long($_SERVER['REMOTE_ADDR']);
$from=isset($_GET["F"])?$_GET["F"]:"teacher";//获取数据来源，默认为教师发布的内容。


$CNAME=$classname[$CLASSID-1];

$strData=isset($_POST['S'])?$_POST['S']:"";
$imgData=isset($_POST['I'])?$_POST['I']:"";

preg_match("/data:image\/([^^]*?);base64,(.*)/u",$imgData,$m);


   $path="../../data/Diagram/".$ROOM."/".$GRADEID."/";

   $lesson=@file_get_contents($path."lesson.dat");

   $proj_path=$path.$lesson."/";

   $task=@file_get_contents($proj_path."task.dat");

   $PROJ=$lesson."_".$task;


if($from=="teacher")
{
   $file_source=$proj_path.$task."/";
   file_put_contents($file_source."diagram.DAT",$strData);
   file_put_contents($file_source."diagram.JPG",base64_decode($m[2]));
}
else
{
   $file_source="../".$student_works.$CNAME."/".$DD."/";
   if(!file_exists($file_source))      mkdir($file_source,0777,true);
   file_put_contents($file_source.$IP."_".$USERNAME."_".$PROJ.".DAT",$strData);
   file_put_contents($file_source.$IP."_".$USERNAME."_".$PROJ.".JPG",base64_decode($m[2]));
}

echo $path;
echo $file_source;

?>