<?php
set_time_limit(0);
$f="./common.bundle.js";
$d=file_get_contents($f);
$lold=24043239;
echo strlen($d)."\r\n";

preg_match_all("/\/\*([^^]*?)\*\//",$d,$m,PREG_OFFSET_CAPTURE);
$mc=count($m[0]);

//print_r($m[0]);//0:matched  1:matched data

$begin=0;
$end=0;
$output="";
//$mc=400;
for($i=0;$i<$mc-1;$i++)
{
   $end=$m[0][$i][1];
   $shrink=$end-$begin;
   echo  $begin."_".$end.":".$shrink."\r\n";

   $output.=substr($d,$begin, $shrink);

   //echo $i."=====>".$m[0][$i][0]."\r\n";

   //if(strlen($m[0][$i][0])==443)//strlen($m[0][$i][0])>442)// && strlen($m[0][$i][0])<450 )
   //{
      if(strpos($m[0][$i][0],"# source")==2)
      {
         //echo "reserved.443\r\n";
         //echo $m[0][$i][0]."\r\n";
         //$output.=$m[0][$i][0];
      }
   //}
   //if(strlen($m[0][$i][0])==1162)//strlen($m[0][$i][0])>442)// && strlen($m[0][$i][0])<450 )
   //{
      
   //}

  if(strlen($m[0][$i][0])>=569)
   {
      echo $m[0][$i][0]."\r\n";
         $output.=$m[0][$i][0];
   }

   $begin=$end+strlen($m[0][$i][0]);//跳过被匹配的数据
}

   $end=strlen($d);

   $shrink=$end-$begin;
   echo  $begin."_".$end.":".$shrink."\r\n";

   $output.=substr($d,$begin,$end-$begin);

//echo $output;

file_put_contents("common.bundle.new.js",$output);
?>