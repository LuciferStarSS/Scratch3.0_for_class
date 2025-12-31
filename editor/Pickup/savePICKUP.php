<?php
$script=isset($_POST['S'])?$_POST['S']:"";				//脚本数据
$blocks=isset($_POST['B'])?$_POST['B']:"";				//脚本数据
$variables=isset($_POST['V'])?$_POST['V']:"";				//脚本数据
$ID=isset($_POST['ID'])?$_POST['ID']:"";				//该脚本上一次保存的文件名
$room=isset($_COOKIE['R'])?$_COOKIE['R']:"";				//机房
$cid=isset($_COOKIE['CLASSID'])?$_COOKIE['CLASSID']:"";

include("../../include/config.inc.php");
$gid=0;
if($cid!="")
   $gid=$grades[$cid-1];

$uid=isset($_COOKIE['SNAME'])?$_COOKIE['SNAME']:0;

$username=isset($_COOKIE['USERNAME'])?$_COOKIE['USERNAME']:"";

if($script && $username)
{
   if(strlen($ID)==32) $fid=$ID;
   else $fid=md5($script);
   if(file_exists("../../data/pickup/".$room."_".$gid."_".$cid."_".$username."/".$fid))
      echo 'EXISTED:'.$fid;
   else
   { 
      //if(!file_exists("../../data/pickup")) mkdir("../data/pickup");
      //if(!file_exists("../../data/pickup/".$room."_".$gid."_".$cid."_".$username))           mkdir("../../data/pickup/".$room."_".$gid."_".$cid."_".$username);
      if(!file_exists("../../data/pickup/".$room."_".$gid."_".$cid."_".$username."/data/"))   mkdir("../../data/pickup/".$room."_".$gid."_".$cid."_".$username."/data/",0777,true);

      file_put_contents("../../data/pickup/".$room."_".$gid."_".$cid."_".$username."/".$fid,$script);
      file_put_contents("../../data/pickup/".$room."_".$gid."_".$cid."_".$username."/data/".$fid.".blocks",$blocks);
      file_put_contents("../../data/pickup/".$room."_".$gid."_".$cid."_".$username."/data/".$fid.".variables",$variables);


      $j=JSON_Decode($script,true);		//解析数据

      $img=null;
      if(isset($j["costume"]["asset"]["data"]["data"]))
         $img = $j["costume"]["asset"]["data"]["data"];	//获取位图预览图		//vm.toJSON需要用：$j["costumes"][0]["asset"]["data"]
      else
         $img = $j["costume"]["asset"]["data"];	//获取矢量图预览图		//vm.toJSON需要用：$j["costumes"][0]["asset"]["data"]
      $imgChr='';
      for($i=0;$i<count($img);$i++)
      {
         $imgChr.=chr($img[$i]);
      }

      if(!file_exists("../../data/pickup/img/"))          mkdir("../../data/pickup/img/",0777,true);

      if(!file_exists("../../data/pickup/img/".md5($imgChr).".".$j["costume"]["asset"]["assetType"]["runtimeFormat"])) 
         file_put_contents("../../data/pickup/img/".md5($imgChr).".".$j["costume"]["asset"]["assetType"]["runtimeFormat"],$imgChr);	//另存预览图
      file_put_contents("../../data/pickup/".$room."_".$gid."_".$cid."_".$username."/data/".$fid,$uid."\n".$username."\n".$fid."\n".md5($imgChr)."\n".$j["costume"]["asset"]["assetType"]["runtimeFormat"]."\n".$j["name"]."\n"."0");//保存文件信息


      echo $fid;								//返回当前保存的文件名
   }
}