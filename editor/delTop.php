<?php
include("../include/config.inc.php");
$CLID=isset($_POST['cid'])?intval($_POST['cid']):"";
$FID=isset($_POST['fid'])?$_POST['fid']:"";
$FNAME=isset($_POST['fn'])?$_POST['fn']:"";
$username=isset($_COOKIE['USERNAME'])?validateFilename($_COOKIE['USERNAME']):"";

//print_r($_COOKIE);
//echo "../".$student_works. $classname[$CLID-1]."/".$FOLDER."/".$FILENAME;

if($CLID!="" && $FID!=""  && isset($classname[$CLID-1]) && (isset($scratch_class[$username]) || strpos($FNAME,$username)))
{
   //echo "../".$student_works."/".$CLID;
   //复制项目文件
   //if(!is_dir( "../top/".$CLID)) mkdir( "../top/".$CLID);
   unlink( "../top/".$CLID."/".$FID.".SB2");
   unlink( "../top/".$CLID."/".$FID.".INFO");
   unlink( "../top/".$CLID."/".$FID.".PNG");

   //file_put_contents("../top/".$CLID."/".md5($FOLDER.$FILENAME).".INFO",$FOLDER."|".$FILENAME);
   //echo iconv("GBK","UTF-8","DEL|删除已完成。");
   echo "DEL|删除已完成。";

}
else
{
   echo "您只能撤销自己的上榜内容。";
}
?>