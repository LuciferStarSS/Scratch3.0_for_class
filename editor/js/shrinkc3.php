<?php
set_time_limit(0);
$f="./common.bundle.new.js";
$d=file_get_contents($f);

echo strlen($d)."\r\n";

//preg_match_all("/\/\/([^^]*?)\n/",$d,$m,PREG_OFFSET_CAPTURE);

preg_match_all("/ \/\/([^^]*?)(\\\[n]|\n)/",$d,$m,PREG_OFFSET_CAPTURE);

$mc=count($m[0]);


//print_r($m[0]);//0:matched  1:matched data
//exit();
$begin=0;
$end=0;
$output="";
//$mc=400;
for($i=0;$i<$mc-1;$i++)
{
   $end=$m[0][$i][1];
   $shrink=$end-$begin;
   //echo  $begin."_".$end.":".$shrink."\r\n";

   $output.=substr($d,$begin, $shrink);

   //echo $i."=====>".$m[0][$i][0]."\r\n";



   if(strpos($m[0][$i][0],'/# source')==2)
   {
      $output.=$m[0][$i][0];
   }
   else if(strpos($m[0][$i][0],'/ ./~/')==2)
   {
      $output.=$m[0][$i][0];
   }
   else if(strpos($m[0][$i][0],'/ ./src')==2)
   {
      $output.=$m[0][$i][0];
   }
   else if(strpos($m[0][$i][0],'/console.info')==2)
   {
      $output.=$m[0][$i][0];
   }
   else if(strpos($m[0][$i][0],'/ warning')==2)
   {
      $output.=$m[0][$i][0];
   }
   else if(strpos($m[0][$i][0],'/Trac')==2)
   {
      $output.=$m[0][$i][0];
   }
   else if(strpos($m[0][$i][0],'/ Trac')==2)
   {
      $output.=$m[0][$i][0];
   }
   else if(strpos($m[0][$i][0],'/Assert')==2)
   {
      $output.=$m[0][$i][0];
   }
   else if(strpos($m[0][$i][0],'/ An example')==2)
   {
      $output.=$m[0][$i][0];
   }
   else if(strpos($m[0][$i][0],'/if (state')==2)
   {
      $output.=$m[0][$i][0];
   }
   else if(strpos($m[0][$i][0],'/zmemcpy')==2)
   {
      $output.=$m[0][$i][0];
   }
   else if(strpos($m[0][$i][0],'/        \"inflate')==2)
   {
      $output.=$m[0][$i][0];
   }
   else if(strlen($m[0][$i][0])==46)//删除后，要加上回车符号用于断句。
   {
      //  echo $i."==".strlen($m[0][$i][0])."===>".$m[0][$i][0]."\r\n";
      $output.='\n';//$m[0][$i][0];
   }
   else if(strlen($m[0][$i][0])==59)//删除后，要加上回车符号用于断句。
   {
      //echo $i."==".strlen($m[0][$i][0])."===>".$m[0][$i][0]."\r\n";
      $output.='\n';//$m[0][$i][0];
   }

   $begin=$end+strlen($m[0][$i][0]);//跳过被匹配的数据
}

   $end=strlen($d);

   $shrink=$end-$begin;
   //echo  $begin."_".$end.":".$shrink."\r\n";

   $output.=substr($d,$begin,$end-$begin);

//echo $output;
$l=0;
while(strpos($output,'\n\n')>0)
{
   echo $l++."\r\n";
   $output=str_replace('\n\n','\n',$output);
}

$l=0;
while(strpos($output,'\r\n\r\n')>0)
{
   echo $l++."\r\n";
   $output=str_replace('\r\n\r\n','\r\n',$output);
}

$l=0;
while(strpos($output,"\r\n\r\n")>0)
{
   echo $l++."\r\n";
   $output=str_replace("\r\n\r\n","\r\n",$output);
}

$l=0;
while(strpos($output,"\n\n")>0)
{
   echo $l++."\r\n";
   $output=str_replace("\n\n","\n",$output);
}

file_put_contents("common.bundle.news.js",$output);
?>