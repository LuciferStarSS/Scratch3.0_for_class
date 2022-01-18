<?php
//保存用户角色造型
//include "../include/config.inc.php";
//include "../include/db.inc.php";


$strImgData=isset($_POST['S'])?$_POST['S']:'';
$strImgName=isset($_POST['N'])?$_POST['N']:'';

if($strImgData!='' && $strImgName!='')
{
   $path="./static/asset/".$strImgName;

   if(file_exists($path))
   {
      copy($path,"./bak/".$path."_".time());//备份
   }

   $arr=explode("base64,",$strImgData);
   if(count($arr)==2)//[1]!==NULL)
   {
      file_put_contents( $path,base64_decode($arr[1]));
   }
   echo $strImgName;
}