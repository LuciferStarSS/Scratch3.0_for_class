<?php
$classid=isset($_COOKIE['CLASSID'])	?$_COOKIE['CLASSID']	:"";
$date	=isset($_COOKIE['DD'])	?$_COOKIE['DD']	:"";

//print_r($_COOKIE);

include "../../include/config.inc.php";

if(!$classid) exit("");


$file_path= "../../data/progress/".$classid."/" ;

//echo $file_path;

//echo $file_path;
$artworks_files=Array();						//附件（视频/图片）

if(is_dir($file_path))
{
   if($handle_date = opendir($file_path))
   {
      while (false !== ($file = readdir($handle_date)))
      {
         if(!is_dir($file_path.$file) && (strpos($file,"PNG")||strpos($file,"png")||strpos($file,"jpg")))				//仅显示文件，不显示目录
         {
            $artworks_files[]=$file_path."/".$file;
         }
      }
      closedir($handle_date); 
   }
}
echo json_encode($artworks_files);