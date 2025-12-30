<?php
error_reporting(0);
header("Pragma:no-cache");
header("Cache-Control:no-cache,must-revalidate");
include "../../include/config.inc.php";

$classid=isset($_POST['C'])?intval($_POST['C']):"";
//echo $classid;
//print_r($classname);
$list=Array();

if( $classid!="" && isset($classname[$classid-1]))
{
   $class=$classname[$classid-1];
   $gradeid=$grades[$classid-1];

   setCookie("GRADEID",$gradeid,time()+3600*8,$site_path."editor/");
   $add="../../".$student_works."/$class/";

   if ($handle = opendir($add))
   {
      while (false !== ($file = readdir($handle)))
      {
         if ($file!="." && $file!=".." && is_dir($add.$file))
         { 
            $list[]=$file;
         }
      }
      closedir($handle); 
   }
   rsort($list);

   $list[]=$gradeid;			//更换班级后，也要更新年级信息
}
echo  json_encode($list);
