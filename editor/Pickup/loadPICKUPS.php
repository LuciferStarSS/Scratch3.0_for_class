<?php
error_reporting(0);
$room=isset($_COOKIE['R'])?$_COOKIE['R']:"";
$cid=isset($_COOKIE['CLASSID'])?$_COOKIE['CLASSID']:"";
$username=isset($_COOKIE['USERNAME'])?$_COOKIE['USERNAME']:"";

include("../../include/config.inc.php");
$gid=0;
if($cid!="")
   $gid=$grades[$cid-1];

$nTYPE=isset($_POST['T'])?$_POST['T']:-1;

$list=Array(Array(),Array(),Array());//个人，班级，机房
if( $username )// && $cid!="" && isset($classname[$cid-1]))
{
   if($nTYPE==-1 || $nTYPE==0)
   {
      $add="../../data/pickup/".$room."_".$gid."_".$cid."_".$username."/";
      if ($handle = opendir($add))
      {
         while (false !== ($file = readdir($handle)))
         {
            if ($file!="." && $file!=".." && !is_dir($add.$file) && strlen($file)==32)
            {
               $d=@file_get_contents($add."/data/".$file);
               if($d)
                  $list[0][]=Array(explode("\n",$d),0,date("Y-m-d H:i:s",filectime($add."/data/".$file)));
            }
         }
         closedir($handle); 
      }
   }

   if($nTYPE==-1 || $nTYPE==1)
   {
      $add="../../data/pickup/".$room."_".$gid."_".$cid;
      if ($handle = opendir($add))
      {
         while (false !== ($file = readdir($handle)))
         {
            if ($file!="." && $file!=".." && !is_dir($add.$file) && strlen($file)==32)
            { 
               $d=@file_get_contents($add."/data/".$file);
               if($d)
                  $list[1][]=Array(explode("\n",$d),file_exists($add."/data/".$file."_".$username)?1:0,date("Y-m-d H:i:s",filectime($add."/data/".$file)));
            }
         }
         closedir($handle); 
      }
   }

   if($nTYPE==-1 || $nTYPE==2)
   {
      $add="../../data/pickup/".$room."_".$gid;
      if ($handle = opendir($add))
      {
         while (false !== ($file = readdir($handle)))
         {
            if ($file!="." && $file!=".." && !is_dir($add.$file) && strlen($file)==32)
            {
               $d=@file_get_contents($add."/data/".$file);
               if($d)
                  $list[2][]=Array(explode("\n",$d),file_exists($add."/data/".$file."_".$username)?1:0,date("Y-m-d H:i:s",filectime($add."/data/".$file)));
            }
         }
         closedir($handle); 
      }
   }
   //rsort($list);
}
echo  json_encode($list);