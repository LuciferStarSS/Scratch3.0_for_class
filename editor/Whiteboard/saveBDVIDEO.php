<?php
//教师端保存小白板图片数据
//print_r($_POST);
$vname=isset($_POST['VIDEONAME'])?$_POST['VIDEONAME']:"";
$vdata=isset($_POST['VIDEODATA'])?$_POST['VIDEODATA']:"";

$GID=isset($_POST['GID'])?intval($_POST['GID']):0;
$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):0;

if($vname!="" && $vdata!="" && $GID!=0)
{
   $vArr=explode("base64,",$vdata);

   if(count($vArr)==2 )
   {
      preg_match_all("/data:video\/([^^]*?);/",$vArr[0],$vType);
      //print_r($vType);
      if(count($vType)==2)
      {
         file_put_contents("../../data/whiteboard/".$room."/".$GID."/".$vname.".".$vType[1][0],base64_decode($vArr[1]));
         exit('["../data/whiteboard/'.$room.'/'.$GID.'/'.$vname.".".$vType[1][0].'"]');

      }
      else
      {
         exit('["ERROR:UNKNOWN"]');
      }
   }
}
exit('["ERROR:NOFILE"]');