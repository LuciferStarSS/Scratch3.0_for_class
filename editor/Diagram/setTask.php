<?php
$ROOM=isset($_COOKIE["R"])?$_COOKIE["R"]:1;
$CLASSID=isset($_COOKIE["CLASSID"])?$_COOKIE["CLASSID"]:0;
$GRADEID=isset($_COOKIE["GRADEID"])?$_COOKIE["GRADEID"]:0;

$lesson=isset($_POST["L"])?$_POST["L"]:"";
$task=isset($_POST["T"])?$_POST["T"]:"";



if($lesson && $task)
{
   $path="../../data/diagram/".$ROOM."/".$GRADEID."/".$lesson."/";

   file_put_contents($path."/task.dat",$task);
   echo "OK";
}
?>