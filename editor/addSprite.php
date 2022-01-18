<?php
ini_set("memory_limit","50M");
$f=isset($_GET['f'])?$_GET['f']:"./static/asset/00c8c464c19460df693f8d5ae69afdab.svg";
$fdata=file_get_contents($f);
$fmd5=md5($fdata);
$finfo=pathinfo($f);
//print_r($finfo);
$json="{\"name\":\"".$finfo['filename']."\",\"isStage\":false,\"x\":2,\"y\":-8,\"visible\":true,\"size\":100,\"rotationStyle\":\"all around\",\"direction\":90,\"draggable\":false,\"currentCostume\":0,\"blocks\":{},\"variables\":{},\"costumes\":[{\"name\":\"".$finfo['filename']."\",\"dataFormat\":\"".$finfo['extension']."\",\"asset\":{\"assetType\":{\"contentType\":\"image/".$finfo['extension']."\",\"name\":\"ImageBitmap\",\"runtimeFormat\":\"".$finfo['extension']."\",\"immutable\":true},\"assetId\":\"".$fmd5."\",\"dataFormat\":\"".$finfo['extension']."\",\"data\":{";

   $json.="\"0\":".ord($fdata[0]);

for($i=1;$i<strlen($fdata);$i++)
{
   $json.=",\"".$i."\":".ord($fdata[$i]);
}

$json.="},\"clean\":false,\"dependencies\":[]},\"md5\":\"".$fmd5.".".$finfo['extension']."\",\"assetId\":\"4deec912b3dc2f2d6ec7798f75661998\"}],\"sounds\":[]}";


echo $json;
?>