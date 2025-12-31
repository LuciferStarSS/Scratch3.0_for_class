<?php
//教师端保存小白板图片数据
//print_r($_POST);
$imgname=isset($_POST['IMGNAME'])?$_POST['IMGNAME']:"";
$imgdata=isset($_POST['IMGDATA'])?$_POST['IMGDATA']:"";
$GID=isset($_POST['GID'])?intval($_POST['GID']):0;
$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):0;
if($imgname!="" && $imgdata!="" && $GID!=0)
{
   $imgArr=explode("base64,",$imgdata);

   if(count($imgArr)==2 )
   {
      preg_match_all("/data:image\/([^^]*?);/",$imgArr[0],$imgType);
      //print_r($imgType);
      if(count($imgType)==2)
      {

         if(!is_dir("../../data/whiteboard/".$room."/".$GID))
         {
            mkdir("../../data/whiteboard/".$room."/".$GID,0777,true);
         }

         file_put_contents("../../data/whiteboard/".$room."/".$GID."/".$imgname.".".$imgType[1][0],base64_decode($imgArr[1]));
         //exit("OK");
         exit('["../data/whiteboard/'.$room.'/'.$GID.'/'.$imgname.'.'.$imgType[1][0].'"]');
      }
      else
      {
         exit('["ERROR:UNKNOWN"]');
      }
   }
}
exit('["ERROR:NOFILE"]');