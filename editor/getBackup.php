<?php
error_reporting(0);
header("Pragma:no-cache");
header("Cache-Control:no-cache,must-revalidate");
include("../include/config.inc.php");

$projname=isset($_COOKIE['NEWPROJNAME'])?validateFilename(urldecode($_COOKIE['NEWPROJNAME'])):"";	//要防止异常文件名出现，还要防止访问上级目录
$classid=isset($_POST['C'])?intval($_POST['C']):"";
$date=isset($_POST['D'])?validateFilename($_POST['D']):"";
//$date=isset($_COOKIE['DD'])?validateFilename($_COOKIE['DD']):"";
$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):0;

$username=isset($_COOKIE['USERNAME'])?validateFilename($_COOKIE['USERNAME']):"";
$ip=getenv("REMOTE_ADDR");

if($ip=="::1") $ip="127.0.0.1";

if($date=="")
{
   $date=isset($_COOKIE['DD'])?validateFilename($_COOKIE['DD']):"";
}

if($projname==""){
   $filenamepath= "../include/".$room."_task.inc.php";							//预设项目名
   $projname=validateFilename(@file_get_contents($filenamepath));
}

$list=Array();
$backup_file_count=0;

if($date!="" && $classid!=""  && isset($classname[$classid-1]))
{
   $class=$classname[$classid-1];
   $fpath="backup/".$ip."_".$username."_".$projname;
   $add="../".$student_works."/$class/$date/$fpath/";			//备份路径为：.\作业上传目录\班级名称\日期\backup\来访IP_用户名_项目名\
   //echo $add;
   if ($handle = @opendir($add))
   {
      while (false !== ($file = @readdir($handle)))
      {
         if (is_file($add.$file)==TRUE)
         { 
            $list[]=$file;
            $backup_file_count++;
         }
      }
      closedir($handle); 
   }
   rsort($list);
}
//print_r($list);

if($max_backup_file>0 && $backup_file_count>$max_backup_file)
{
   for($i=$backup_file_count-1;$i>=$max_backup_file;$i--)
   {
      unlink($add.$list[$i]);
      unset($list[$i]);
   }
}
sort($list);
echo  json_encode($list);
