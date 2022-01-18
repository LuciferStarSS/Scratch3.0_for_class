<?php
//异常文件修复程序
function checkScratchFile($f)
{
   $nzip=new ZipArchive;
   $res = $nzip->open($f,ZipArchive::CREATE);
   if($res === TRUE)
   {
      $zip = zip_open($f);
      $json="";
      while ($zip_entry = zip_read($zip))
      {
         $fn=zip_entry_name($zip_entry);

         if ($fn=="project.json" )//解析project.json
         {
            if(zip_entry_open($zip, $zip_entry))
            {
               $contents="";
               while($package=zip_entry_read($zip_entry))
               {
                  $contents.=$package;
               }
               $json=json_decode($contents);
               $StageFound=0;
               foreach($json->{"targets"} as $key=>$value)
               {
                  if($value->{"isStage"}==1)
                  {
                     $StageFound++;
                  }
                  if($StageFound>1) 
                  {
                     unset($json->{"targets"}[$key]);
                  }
               }
               $nzip->addFromString($fn,json_encode($json));
            }
        }
        else
        {
            if(zip_entry_open($zip, $zip_entry))
            {
               $contents="";
               while($package=zip_entry_read($zip_entry))
               {
                  $contents.=$package;
               }
               
               $nzip->addFromString($fn,$contents);
            }
        }
     }
     zip_close($zip);
     $nzip->close();
   }
}

include("../include/config.inc.php");

$classid=isset($_COOKIE['CLASSID'])?intval($_COOKIE['CLASSID']):"";

$DD=isset($_GET['d'])?$_GET['d']:$_COOKIE['DD'];
$username=isset($_COOKIE['USERNAME'])?validateFilename($_COOKIE['USERNAME']):"";
$ip=getenv("REMOTE_ADDR");
$fn=isset($_GET['f'])?$_GET['f']:"";


$projname=isset($_GET['p'])?trim($_GET['p'],".SB3"):"";

if($projname=="")
   $projname=$ip."_".$username."_".validateFilename(urldecode($_COOKIE['NEWPROJNAME']));

//$projname=isset($_COOKIE['NEWPROJNAME'])?validateFilename(urldecode($_COOKIE['NEWPROJNAME'])):"";	//要防止异常文件名出现，还要防止访问上级目录



if( isset($classname[$classid-1]))
{
   $f="../".$student_works.$classname[$classid-1]."/".$DD."/backup/".$projname."/".$fn;
   //echo $f;

   checkScratchFile($f);
}
?>
尝试修复操作已完成。本功能还在测试中。
