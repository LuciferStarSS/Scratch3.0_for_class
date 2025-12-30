<?php
//教师端删除小白板图片历史数据
//print_r($_POST);
$imgname=isset($_POST['IMGNAME'])?$_POST['IMGNAME']:"";

$GID=isset($_POST['GID'])?intval($_POST['GID']):0;
$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):0;
include "../../include/config.inc.php";

$ip=$_SERVER['REMOTE_ADDR'];					//访问者IP
if($ip=="::1") $ip="127.0.0.1";

if(isset($teacher_room[$ip]) && $GID!=0)			//仅限教师访问，防止非授权访问导致数据丢失。
{
   if($imgname!="")
   {
      if(file_exists("../../data/whiteboard/".$room."/".$GID."/".$imgname))
      {

         if(strpos($imgname,"LINES/")===false)		//线条不备份
         {
            if(!is_dir("../../data/whiteboard/".$room."/".$GID."/bak/")) mkdir("./board/".$room."/".$GID."/bak/");

            rename("../../data/whiteboard/".$room."/".$GID."/".$imgname,"./".$room."/".$GID."/bak/".time()."_".$imgname);
            exit("OK");
         }
         else
         {
            unlink("../../data/whiteboard/".$room."/".$GID."/".$imgname);
            exit("OK");
         }
      }
      else echo "NOTFOUND";
   }
}
else exit("ERROR");
?>