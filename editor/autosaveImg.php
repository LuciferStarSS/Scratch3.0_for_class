<?php
error_reporting(0);
include("../include/config.inc.php");

$classid=isset($_COOKIE['CLASSID'])?intval($_COOKIE['CLASSID']):"";
$projname=isset($_COOKIE['NEWPROJNAME'])?validateFilename(urldecode($_COOKIE['NEWPROJNAME'])):"";	//要防止异常文件名出现，还要防止访问上级目录
$sb2=isset($_COOKIE['SB2'])?$_COOKIE['SB2']:"";
$username=isset($_COOKIE['USERNAME'])?validateFilename($_COOKIE['USERNAME']):"";

$imgname=isset($_COOKIE['IMGFNAME'])?validateFilename(urldecode($_COOKIE['IMGFNAME'])):"";	//要防止异常文件名出现，还要防止访问上级目录

$refreshimg=isset($_COOKIE['REFNAME'])?validateFilename($_COOKIE['REFNAME']):"";

if( isset($classname[$classid-1]))
{
  if(strlen($refreshimg)==32)
  {
      $postdata=file_get_contents("php://input");
      if(strstr($postdata,"SSD:")!==NULL)
      {
         $postdata=trim($postdata,"SSD:");

      //班级 日期  文件名

      $savedfile="../top/".$classid."/".$refreshimg.".PNG";

      file_put_contents( $savedfile,base64_decode($postdata));
      setCookie("REFNAME","",time()+3600*9);
      echo "REFSNAP|".$savedfile;
   }
  }
  else
  {
   if($imgname!="")
   {
      $imgfile=md5($imgname);
      setCookie("IMGFNAME","",time()-3600*10);
   }
   else
      $imgfile=md5($projname.$sb2);

   $postdata=file_get_contents("php://input");
   if(strstr($postdata,"SSD:")!==NULL)
   {
      $postdata=trim($postdata,"SSD:");

      //班级 日期  文件名

      $savedfile="../top/".$classid."/".$imgfile.".PNG";
      //echo $savefile;
      //file_put_contents("../top/".$CLID."/".md5($FOLDER.$FILENAME).".INFO",$FOLDER."|".$FILENAME);

      file_put_contents( $savedfile,base64_decode($postdata));
      echo "SNAP|".$savedfile;
   }
  }
}
?>