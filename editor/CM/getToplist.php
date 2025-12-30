<?php
error_reporting(0);
header("Pragma:no-cache");
header("Cache-Control:no-cache,must-revalidate");
include("../../include/config.inc.php");
$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):"";
//$classid=isset($_COOKIE['CLASSID'])?intval($_COOKIE['CLASSID']):"";

$classid=isset($_GET['CID'])?intval($_GET['CID']):"";
//$classid=isset($_COOKIE['CLASSID'])?intval($_COOKIE['CLASSID']):"";
//$classid=isset($_POST['C'])?intval($_POST['C']):"";

//$UNVOTE=isset($_COOKIE['VOTE'])?$_COOKIE['VOTE']:"";

$USERNAME=isset($_COOKIE['USERNAME'])?$_COOKIE['USERNAME']:"";

$folder=isset($_GET['D'])?$_GET['D']:"";

//if($UNVOTE!=$USERNAME) exit("[\"\"]");				//本课没申请上榜，无权限查看。

$list=Array();

$add="../../top/".$classid."/";
//echo $add;


$ip=$_SERVER['REMOTE_ADDR'];					//访问者IP
if($ip=="::1") $ip="127.0.0.1";

$bFound= isset($teacher_room[$ip])?1:0;

if ($handle = opendir($add))
{
   while (false !== ($file = readdir($handle)))
   {
      if (is_file($add.$file)==TRUE && strstr($file,".SB"))
      { 
         $fid=substr($file,0,32);//echo $add.$fid.".INFO";

         $finfo=file_get_contents($add.$fid.".INFO");
         $fArr=explode("|",$finfo);
         //print_r($fArr);
         if($fArr[0]==$folder || isset($teacher_room[$ip])) 
         {
            $list[]=Array(file_get_contents($add.$fid.".INFO"),$fid);//$file;
            //echo $finfo;
            if(strpos($finfo,$USERNAME)!==false) $bFound=1;
         }
      }      
   }
   closedir($handle); 
}
//print_r($list);
if($bFound)
{
   rsort($list);
   echo  json_encode($list);
}
?>