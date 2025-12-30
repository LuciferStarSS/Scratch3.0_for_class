<?php
$fid=isset($_POST['F'])?$_POST['F']:"";
$type=isset($_POST['T'])?$_POST['T']:"";
$ntype=isset($_POST['NT'])?$_POST['NT']:0;
$memo=isset($_POST['M'])?$_POST['M']:"";
$room=isset($_COOKIE['R'])?$_COOKIE['R']:"";
$cid=isset($_COOKIE['CLASSID'])?$_COOKIE['CLASSID']:"";
$username=isset($_COOKIE['USERNAME'])?$_COOKIE['USERNAME']:"";
error_reporting(0);

include("../../include/config.inc.php");
$gid=0;
if($cid!="")
   $gid=$grades[$cid-1];

if($type && strlen($fid)==32 && $username)
{
   $path="../../data/pickup/".$room."_".$gid;
   if($ntype==1)
      $path.="_".$cid;
   else if($ntype==0)
      $path.="_".$cid."_".$username;

   if(file_exists($path."/".$fid))
   {
      $d=@file_get_contents($path."/".$fid);
      $jsonData=json_decode($d,true);

      $returnData=Array();

      switch($type)
      {
         case "WHOLE":						//整个角色
         
            $jsonDataX=json_decode($d);

            $b=@file_get_contents($path."/data/".$fid.".blocks");
            $blocksData=json_decode($b);
            $jsonDataX->{"blocks"}=$blocksData;
            $v=@file_get_contents($path."/data/".$fid.".variables");
            $variablesData=json_decode($v);
            $jsonDataX->{"variables"}=$variablesData;
            $returnData=Array($type,json_encode($jsonDataX));
            break;

         case "CODE":						//代码
            $returnData=Array($type,$jsonData["blocks"]);
            break;

         case "COSTUME":					//造型
            $returnData=Array($type,$jsonData["costumes"]);
            break;

         case "SOUND":						//声音
            $returnData=Array($type,$jsonData["sounds"]);
            break;

         case "MEMO":						//备注
            $returnData=Array($type);
            $d=file_get_contents($path."/data/".$fid);
            $dArr=explode("\n",$d);
            $dArr[5]=$memo;
            $dResult=implode("\n",$dArr);
            file_put_contents($path."/data/".$fid,$dResult);
            break;

         case "LIKE":						//备注
            $returnData=Array($type);


            $d=@file_get_contents($path."/data/".$fid);
            $dArr=explode("\n",$d);

            if(file_exists($path."/data/".$fid."_".$username))//点过赞了，要取消
            {
               $d=file_get_contents($path."/data/".$fid);
               $dArr=explode("\n",$d);
               $dArr[6]=$dArr[6]>0?$dArr[6]-1:0;
               $dResult=implode("\n",$dArr);
               file_put_contents($path."/data/".$fid,$dResult);
               unlink($path."/data/".$fid."_".$username);
            }
            else
            {
               $d=file_get_contents($path."/data/".$fid);
               $dArr=explode("\n",$d);
               $dArr[6]=$dArr[6]>0?$dArr[6]+1:1;
               $dResult=implode("\n",$dArr);
               file_put_contents($path."/data/".$fid,$dResult);
               file_put_contents($path."/data/".$fid."_".$username,"1");
            }

            break;

         case "DELETE":						//删除
            $returnData=Array($type);
            @unlink($path."/".$fid);
            //sleep(2);
            @unlink($path."/data/".$fid);
            @unlink($path."/data/".$fid.".blocks");
            @unlink($path."/data/".$fid.".variables");

            $add=$path."/data/";
            if ($handle = opendir($add))
            {
               while (false !== ($file = readdir($handle)))
               {
                  if(strpos($file, $fid.'_' )!==false)
                  { 
                     @unlink($path."/data/".$file);
                  }
               }
               closedir($handle); 
            }

            //sleep(2);
            break;

         case "SHARETOC":					//分享到班级
            $returnData=Array($type);

            $path1="../../data/pickup/".$room."_".$gid."_".$cid."_".$username;
            $path2="../../data/pickup/".$room."_".$gid."_".$cid;

            if(!file_exists($path2))   mkdir($path2);
            if(!file_exists($path2."/data"))   mkdir($path2."/data");

            copy( $path1."/data/".$fid.".blocks",    $path2."/data/".$fid.".blocks");
            copy( $path1."/data/".$fid.".variables", $path2."/data/".$fid.".variables");
            copy( $path1."/data/".$fid,              $path2."/data/".$fid);
            copy( $path1."/".$fid,                   $path2."/".$fid);

            break;

         case "SHARETOG":					//分享到年级
            $returnData=Array($type);

            $path1="../../data/pickup/".$room."_".$gid."_".$cid."_".$username;
            $path2="../../data/pickup/".$room."_".$gid;

            if(!file_exists($path2))   mkdir($path2);
            if(!file_exists($path2."/data"))   mkdir($path2."/data");

            copy( $path1."/data/".$fid.".blocks",    $path2."/data/".$fid.".blocks");
            copy( $path1."/data/".$fid.".variables", $path2."/data/".$fid.".variables");
            copy( $path1."/data/".$fid,              $path2."/data/".$fid);
            copy( $path1."/".$fid,                   $path2."/".$fid);

            break;
      }
      echo json_encode($returnData);
   }
}