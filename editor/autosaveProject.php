<?php
error_reporting(0);
include("../include/config.inc.php");

$projname=isset($_COOKIE['NEWPROJNAME'])?validateFilename(urldecode($_COOKIE['NEWPROJNAME'])):"";	//要防止异常文件名出现，还要防止访问上级目录
$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):0;
$classid=isset($_COOKIE['CLASSID'])?intval($_COOKIE['CLASSID']):"";
$date=isset($_COOKIE['DD'])?validateFilename($_COOKIE['DD']):"";
$username=isset($_COOKIE['USERNAME'])?validateFilename($_COOKIE['USERNAME']):"";
$ip=getenv("REMOTE_ADDR");
if($date=="") $date=date("Y-m-d");

if($ip=="::1") $ip="127.0.0.1";
//print_r($_COOKIE);

if($classid!=""  && $date!="" && $username!="" && isset($classname[$classid-1]))
{
   if($projname==""){
      $filenamepath= "../include/".$classid."_task.inc.php";							//预设项目名
      $projname=validateFilename(@file_get_contents($filenamepath));
   }

   $path="../".$student_works."/".$classname[$classid-1]."/".$date;
   if(file_exists($path)==false)
   {
      mkdir($path);
   }

   if (is_uploaded_file($_FILES["SBFILE"]['tmp_name'])) 
   { 
      if( file_exists($path."/backup")==false)
         mkdir($path."/backup");

      if( file_exists($path."/backup/".$ip."_".$username."_$projname")==false)
         mkdir($path."/backup/".$ip."_".$username."_$projname");

      $savedfile=date("Ymd_His",time()+3600*8);
      if(move_uploaded_file($_FILES["SBFILE"]['tmp_name'],$path."/backup/".$ip."_".$username."_$projname/$savedfile".".SB3")) 
      {
         echo "<font color=green>自动备份已完成：".$classname[$classid-1]."/".$date."/<br>".$ip."_".$username."_$projname/<br>".$savedfile.".SB3</font>";

      }
   }
   else
   {
      echo "文件上传失败：" . $_FILES["SBFILE"]['name']."<br>";
   }


}
else if(isset($scratch_class[$username]))
{
//var_dump($username);
//var_dump($scratch_class);
   echo "ADMINERROR";
}
else
{
   echo "LOGINERROR";// "<script> alert(\"上课登记超时，请联系老师，或尝试重新登录。\");</script><font color=red>上课登记超时，请联系吴老师，或尝试重新<a href=../ target=_blank>上课登记</a>。</font>";//登录超时，可以另开一个上课登记的页面，重新上课登记后，可再次提交作业。
}
//else echo "LOGINERROR";
//else echo "<font color=red><script> alert(\"上课登记超时，请联系吴老师，或尝试重新登录。\");</script>上课登记超时，请联系吴老师，或尝试重新<a href=../ target=_blank>上课登记</a>。</font>";//登录超时，可以另开一个上课登记的页面，重新上课登记后，可再次提交作业。
?>