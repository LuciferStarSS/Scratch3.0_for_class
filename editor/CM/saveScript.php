<?php
$script=isset($_POST['S'])?$_POST['S']:"";				//脚本数据
$ID=isset($_POST['ID'])?$_POST['ID']:"";				//该脚本上一次保存的文件名
$room=isset($_COOKIE['R'])?$_COOKIE['R']:"";				//机房
if($script && $room)
{
   if(strlen($ID)==32) $fid=$ID;
   else $fid=md5($script);
   


   $j=JSON_Decode($script,true);		//解析数据
//print_r($j);
   $img=null;
   if(isset($j["costumes"][0]["asset"]["data"]["data"]))
      $img = $j["costumes"][0]["asset"]["data"]["data"];	//获取位图预览图		//vm.toJSON需要用：$j["costumes"][0]["asset"]["data"]
   else
      $img = $j["costumes"][0]["asset"]["data"];	//获取矢量图预览图		//vm.toJSON需要用：$j["costumes"][0]["asset"]["data"]
   $imgChr='';
   for($i=0;$i<count($img);$i++)
   {
      $imgChr.=chr($img[$i]);
   }


   if(!file_exists("../../data/scripts/".$room."/img/")) mkdir("../../data/scripts/".$room."/img/",0744,true);

   if(!file_exists("../../data/scripts/".$room."/img/".md5($imgChr).".".$j["costumes"][0]["asset"]["assetType"]["runtimeFormat"])) 
      file_put_contents("../../data/scripts/".$room."/img/".md5($imgChr).".".$j["costumes"][0]["asset"]["assetType"]["runtimeFormat"],$imgChr);	//另存预览图

   file_put_contents("../../data/scripts/".$room."/".$fid,$script);
   //echo $fid;
   echo json_encode(Array($room."/img/".md5($imgChr).".".$j["costumes"][0]["asset"]["assetType"]["runtimeFormat"],$fid));								//返回当前保存的文件名
}