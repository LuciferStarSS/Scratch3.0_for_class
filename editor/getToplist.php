<?php
error_reporting(0);
header("Pragma:no-cache");
header("Cache-Control:no-cache,must-revalidate");
include("../include/config.inc.php");
$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):"";
//$classid=isset($_COOKIE['CLASSID'])?intval($_COOKIE['CLASSID']):"";

$classid=isset($_GET['CID'])?intval($_GET['CID']):"";
//$classid=isset($_COOKIE['CLASSID'])?intval($_COOKIE['CLASSID']):"";
//$classid=isset($_POST['C'])?intval($_POST['C']):"";

$list=Array();

$add="../top/".$classid."/";
//echo $add;

if ($handle = opendir($add))
{
   while (false !== ($file = readdir($handle)))
   {
      if (is_file($add.$file)==TRUE && strstr($file,".SB"))
      { 
         $fid=substr($file,0,32);//echo $add.$fid.".INFO";
         $list[]=Array(file_get_contents($add.$fid.".INFO"),$fid);//$file;
      }      
   }
   closedir($handle); 
}
rsort($list);

echo  json_encode($list);
?>