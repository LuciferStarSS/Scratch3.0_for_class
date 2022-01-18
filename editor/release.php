<?php
include("../include/config.inc.php");
$CLID=isset($_POST['cid'])?intval($_POST['cid']):"";
$FOLDER=isset($_POST['f'])?$_POST['f']:"";
$FILENAME=isset($_POST['fn'])?$_POST['fn']:"";


$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):"";

//print_r($_COOKIE);
//echo "../".$student_works. $classname[$CLID-1]."/".$FOLDER."/".$FILENAME;

if($CLID!="" && $FOLDER!="" && $FILENAME!="" && isset($classname[$CLID-1]))
{
   //echo "../".$student_works."/".$CLID; 
   //echo ".".$student_works."top/".$CLID;
   //复制项目文件
   if(!is_dir( "../top/".$CLID)) mkdir( "../top/".$CLID);
   copy( "../".$student_works. $classname[$CLID-1]."/".$FOLDER."/".$FILENAME, "../top/".$CLID."/".md5($FOLDER.$FILENAME).".SB3");
   file_put_contents("../top/".$CLID."/".md5($FOLDER.$FILENAME).".INFO",$FOLDER."|".$FILENAME);
   //echo iconv("GBK","UTF-8","推送已完成。");
   echo "推送已完成。";
/*
   $old_data=@file_get_contents("../include/toplist_".$room.".inc.php");
   if($old_data!="")
   {
      $new_file=base64_encode($classname[$CLID-1]."|".$FOLDER."|".$FILENAME);
      $lists=explode("\r\n",$old_data);
      $existed=0;
      foreach($lists as $value)
      {
         if(strpos($value,$new_file)===0){ $existed=1;break;}
      }
      
      if(!$existed)
      {
         file_put_contents("../include/toplist_".$room.".inc.php",$new_file."|".$classname[$CLID-1]."_".$FOLDER."_".$FILENAME."\r\n".$old_data);
         echo "OK!";
      }
      else
      {
         echo "ALREADY SET!";
      }
   }
   else
   {
      $new_file=base64_encode($classname[$CLID-1]."|".$FOLDER."|".$FILENAME);
      file_put_contents("../include/toplist_".$room.".inc.php",$new_file."|".$classname[$CLID-1]."_".$FOLDER."_".$FILENAME);
      echo "OK!";
   }
*/
}
else
{
   echo "LOGIN FIRST!";
}
?>