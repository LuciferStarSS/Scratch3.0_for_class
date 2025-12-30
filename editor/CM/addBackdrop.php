<?php
ini_set("memory_limit","50M");
$f=isset($_GET['f'])?$_GET['f']:"../static/asset/00c8c464c19460df693f8d5ae69afdab.svg";
//BACKDROP2,"IMAGEFILENAME.SVG"  //素材库中文件
//本地文件/舞台json数据

//echo "../data/scripts/1/".$f;
$fdata=file_get_contents("../../data/scripts/1/".$f);
//获取文件内容 
//素材库中为图像
//舞台内容为json数据

$fmd5=md5($fdata);
$finfo=pathinfo("../../data/scripts/1/".$f);
//print_r($finfo);
$json="
{\"asset\":{
            \"assetId\":\"".$fmd5."\",
            \"assetType\":{
                           \"contentType\":\"image/".$finfo['extension']."\",
                           \"name\":\"ImageBitmap\",
                           \"runtimeFormat\":\"".$finfo['extension']."\",
                           \"immutable\":true
                           },
            \"clean\":\"false\",
            \"data\":{";

$json.="\"0\":".ord($fdata[0]);

for($i=1;$i<strlen($fdata);$i++)
{
   $json.=",\"".$i."\":".ord($fdata[$i]);
}

$json.="             },
            \"dataFormat\":\"".$finfo['extension']."\",
            \"dependencies\":[]
           },
 \"assetId\":\"".$fmd5."\",
 \"dataFormat\":\"".$finfo['extension']."\",
 \"md5\":\"".$fmd5.".".$finfo['extension']."\",
 \"name\":\"".$finfo['filename']."\",
 \"rotationCenterX\": 480,
 \"rotationCenterY\": 360,
 \"skinId\": null
}";


echo $json;
?>