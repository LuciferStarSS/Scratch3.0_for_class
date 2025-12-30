<?php
//教师端保存小白板图片数据
//print_r($_POST);

$imgdata=isset($_POST['IMGDATA'])?$_POST['IMGDATA']:"";
$GID=isset($_POST['GID'])?intval($_POST['GID']):0;//isset($_POST['GID'])?intval($_POST['GID']):0;

$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):0;

//var_dump($GID);
if($imgdata!="" && $GID!=0)
{
   $imgArr=explode("base64,",$imgdata);

   if(count($imgArr)==2 )
   {
      preg_match_all("/data:image\/([^^]*?);/",$imgArr[0],$imgType);
      //print_r($imgType);
      if(count($imgType)==2)
      {

         if(!is_dir("../../data/whiteboard/".$room."/".$GID."/LINES/")) mkdir("../../data/whiteboard/".$room."/".$GID."/LINES/");

         file_put_contents("../../data/whiteboard/".$room."/".$GID."/LINES/".md5($imgArr[1]).".".$imgType[1][0],base64_decode($imgArr[1]));
         exit('["'.md5($imgArr[1]).'","../data/whiteboard/'.$room.'/'.$GID.'/LINES/'.md5($imgArr[1]).'.'.$imgType[1][0].'"]');
      }
      else
      {
         exit('["ERROR:UNKNOWN"]');
      }
   }
}
exit('["ERROR:NOFILE"]');