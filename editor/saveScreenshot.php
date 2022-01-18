<?php
error_reporting(0);
include("../include/config.inc.php");

//print_r($_COOKIE);

$classid=isset($_COOKIE['CLASSID'])?intval($_COOKIE['CLASSID']):"";
$projname=isset($_COOKIE['NEWPROJNAME'])?validateFilename(urldecode($_COOKIE['NEWPROJNAME'])):"";	//要防止异常文件名出现，还要防止访问上级目录
$sb2=isset($_COOKIE['SB2'])?$_COOKIE['SB2']:"";
$username=isset($_COOKIE['USERNAME'])?validateFilename($_COOKIE['USERNAME']):"";

$imgname=isset($_COOKIE['IMGFNAME'])?validateFilename(urldecode($_COOKIE['IMGFNAME'])):"";	//要防止异常文件名出现，还要防止访问上级目录

$refreshimg=isset($_COOKIE['REFNAME'])?validateFilename($_COOKIE['REFNAME']):"";

if(isset($classname[$classid-1]))
{
  if(strlen($refreshimg)==32)
  {
      $postdata=file_get_contents("php://input");
      if(strstr($postdata,"data:image/png;base64,")!==NULL)
      {
         $postdata=substr($postdata,22);

         //班级 日期  文件名
         //var_dump($postdata);
         $savedfile="../top/".$classid."/".$refreshimg.".PNG";

         file_put_contents( $savedfile,base64_decode($postdata));
         setCookie("REFNAME","",time()+3600*9,$site_path);
         echo "REFSNAP|".$savedfile;
   }
  }
  else
  {
   if($imgname!="")
   {
      $imgfile=md5($imgname);
      setCookie("IMGFNAME","",time()-3600*10,$site_path);
   }
   else
      $imgfile=md5(date("Y-m-d").$projname.$sb2);

   $postdata=file_get_contents("php://input");
   if(strstr($postdata,"data:image/png;base64,")!==NULL)
   {
      $postdata=substr($postdata,22);

      //班级 日期  文件名
      //   var_dump($postdata);

      $savedfile="../top/".$classid."/".$imgfile.".PNG";

      file_put_contents( $savedfile,base64_decode($postdata));
      echo "SNAP|".$savedfile;
   }
  }
}
?>