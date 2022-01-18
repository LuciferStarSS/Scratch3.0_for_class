<?php
error_reporting(0);
header("Pragma:no-cache");
header("Cache-Control:no-cache,must-revalidate");
include "../include/config.inc.php";

$classid=isset($_POST['C'])?intval($_POST['C']):"";
//echo $classid;
//print_r($classname);
$list=Array();

if( $classid!="" && isset($classname[$classid-1]))
{
   $class=$classname[$classid-1];

   $add="../".$student_works."/$class/";

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
}
echo  json_encode($list);
