<?php
set_time_limit(0);
$f="./projects.bundle.new.js";
$d=file_get_contents($f);
$lold=24043239;
echo strlen($d)."\r\n";

//preg_match_all("/\/\/([^^]*?)(\\n)/",$d,$m,PREG_OFFSET_CAPTURE);

preg_match_all("/ \/\/ ([^^]*?)\\\\n/",$d,$m,PREG_OFFSET_CAPTURE);

$mc=count($m[0]);

print_r($m[0]);//0:matched  1:matched data


//exit;
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

   $begin=$end+strlen($m[0][$i][0]);//跳过被匹配的数据
}

   $end=strlen($d);

   $shrink=$end-$begin;
   echo  $begin."_".$end.":".$shrink."\r\n";

   $output.=substr($d,$begin,$end-$begin);

//echo $output;

//echo $output;
$l=0;
while(strpos($output,'\n\n')>0)
{
   echo $l++."\r\n";
   $output=str_replace('\n\n','\n',$output);
}

$l=0;
while(strpos($output,'"\n')>0)
{
   echo $l++."\r\n";
   $output=str_replace('"\n','"',$output);
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

file_put_contents("projects.bundle.news.js",$output);
?>