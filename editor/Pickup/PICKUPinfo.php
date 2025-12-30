<?php
$fid=isset($_POST['F'])?$_POST['F']:"";
$type=isset($_POST['T'])?$_POST['T']:"";
$ntype=isset($_POST['NT'])?$_POST['NT']:0;
$memo=isset($_POST['M'])?$_POST['M']:"";
$room=isset($_COOKIE['R'])?$_COOKIE['R']:"";
$cid=isset($_COOKIE['CLASSID'])?$_COOKIE['CLASSID']:"";
$username=isset($_COOKIE['USERNAME'])?$_COOKIE['USERNAME']:"";
error_reporting(0);

if($type && $username)
{
   $path="../../data/pickup/".$room;
   if($type==1)
      $path.="_".$cid;

   if(file_exists($path))
   {
      $returnData=Array();

      if ($handle = opendir($path))
      {
         $arrTotal=Array();
         while (false !== ($file = readdir($handle)))
         {
            if ($file!="." && $file!=".." && !is_dir($path."/".$file) && strlen($file)==32)
            { 
               $d=@file_get_contents($path."/data/".$file);
               $dArr=explode("\n",$d);
               //var_dump($dArr);
               if(isset($arrTotal[$dArr[1]])) $arrTotal[$dArr[1]]+=$dArr[6];
               else $arrTotal[$dArr[1]]=$dArr[6];
            }
         }
         closedir($handle); 
         arsort($arrTotal);
         $returnData=$arrTotal; 
      }
      echo json_encode($returnData);
   }
}