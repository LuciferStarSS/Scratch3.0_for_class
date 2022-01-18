<?php
error_reporting(0);

//echo file_get_contents($_FILES['file']);
//exit;

include("../include/config.inc.php");
$projname=isset($_COOKIE['NEWPROJNAME'])?validateFilename(urldecode($_COOKIE['NEWPROJNAME'])):"";	//要防止异常文件名出现，还要防止访问上级目录
$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):0;
$classid=isset($_COOKIE['CLASSID'])?intval($_COOKIE['CLASSID']):"";
$date=isset($_COOKIE['DD'])?validateFilename($_COOKIE['DD']):"";
$username=isset($_COOKIE['USERNAME'])?validateFilename($_COOKIE['USERNAME']):"";
$ip=getenv("REMOTE_ADDR");
if($ip=="::1") $ip="127.0.0.1";
//保存后，删除所有备份数据。
function deldir($dir) {
    $dh=opendir($dir);
    while ($file=readdir($dh)) {
        if($file!="." && $file!="..") {
            $fullpath=$dir."/".$file;
            if(!is_dir($fullpath)) {
                unlink($fullpath);
            } else {
                deldir($fullpath);
            }
        }
    }
    closedir($dh);
    if(rmdir($dir)) {
        return true;
    } else {
        return false;
    }
}

//print_r($_COOKIE);
if($classid!=""  && $date!="" && $username!="" && isset($classname[$classid-1]))
{
   if($projname==""){
      $filenamepath= "../include/".$classid."_task.inc.php";							//预设项目名
      $projname=validateFilename(@file_get_contents($filenamepath));
   }

   $path="../".$student_works."/".$classname[$classid-1]."/".$date;
   $showpath=$classname[$classid-1]."/".$date;				//防止暴露真实文件路径。

   if(file_exists($path)==false)
   {
      mkdir($path);
   }


   if (is_uploaded_file($_FILES["SBFILE"]['tmp_name'])) 
   { 
      if(move_uploaded_file($_FILES["SBFILE"]['tmp_name'], $path."/".$ip."_".$username."_$projname.SB3")) 
      {
         echo "保存已完成：".$showpath."/".$ip."_".$username."_$projname.SB3&nbsp;".date("H:i:s",time());
         if($delete_after_saving==1 && file_exists($path."/backup/".$ip."_".$username."_$projname"))//保存后删除备份
         {
            deldir($path."/backup/".$ip."_".$username."_$projname");	//path预设，ip确定，有强制加入的两个“_”，就不会误删文件。
         }
      }
   }
   else
   {
      echo "文件上传失败：" . $_FILES["SBFILE"]['name']."<br>";
   }
}
else if(isset($scratch_class[$username]))
{
   echo "ADMINERROR";
}
else
{
   echo "LOGINERROR";// "<script> alert(\"上课登记超时，请联系老师，或尝试重新登录。\");</script><font color=red>上课登记超时，请联系吴老师，或尝试重新<a href=../ target=_blank>上课登记</a>。</font>";//登录超时，可以另开一个上课登记的页面，重新上课登记后，可再次提交作业。
}
//else echo "上课登记超时，请尝试另外打开上课登记页面，再次登记一下。";
?>