<?php
//此文件暂时废弃
error_reporting(0);
header("Pragma:no-cache");
header("Cache-Control:no-cache,must-revalidate");
include("../include/config.inc.php");

$p=isset($_GET['SB2'])?$_GET['SB2']:"";

$p=str_replace("-","+",$p);
$p=base64_decode($p);

$data=Array();
if($p!="")
{
   $data=explode("|",$p);
   echo $data[0].$data[1].$data[2];
}
print_r($data);

$filename="../../top/".$data[0]."/".$data[1]."/".$data[2];

echo $filename;
if( file_exists($filename) )
{
     //echo $filename;
      //echo file_get_contents($filename);
}