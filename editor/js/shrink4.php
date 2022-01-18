<?php
set_time_limit(0);
$f="./projects.bundle.news.js";
$d=file_get_contents($f);

echo strlen($d)."\r\n";

//preg_match_all("/\/\/([^^]*?)\n/",$d,$m,PREG_OFFSET_CAPTURE);

preg_match_all("/ \/\/([^^]*?)(\\\[n])/",$d,$m,PREG_OFFSET_CAPTURE);

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

   echo $i."=====>".$m[0][$i][0]."\r\n";

   if($m[0][$i][0]==' //eval("");') {}//抛弃$output.=$m[0][$i][0];
   else if($m[0][$i][0][3]==' ')
   {      
      if(strpos($m[0][$i][0],'// module id')==1)
      {
         //echo $i."=====>".$m[0][$i][0]."\r\n";
         //$output.=$m[0][$i][0];
      }
      else if(strpos($m[0][$i][0],'// tslint')==1)
      {
         //echo $i."=====>".$m[0][$i][0]."\r\n";
         //$output.=$m[0][$i][0];
      }
      else if(strpos($m[0][$i][0],'// If')==1)
      {
         //echo $i."=====>".$m[0][$i][0]."\r\n";
         //$output.=$m[0][$i][0];
      }
      else if(strpos($m[0][$i][0],"// if")==1)
      {
         //echo $i."=====>".$m[0][$i][0]."\r\n";
         if(strpos($m[0][$i][0],'// if (context)')==1)
         {
            //echo $i."=====>".$m[0][$i][0]."\r\n";
            $output.=$m[0][$i][0];
         }
         else
            $output.=$m[0][$i][0];
      }
      else if(strpos($m[0][$i][0],'// ex')==1)
      {
         //echo $i."=====>".$m[0][$i][0]."\r\n";
         //$output.=$m[0][$i][0];
      }
      else if(strpos($m[0][$i][0],'// start')==1)
      {
         //echo $i."=====>".$m[0][$i][0]."\r\n";
         //$output.=$m[0][$i][0];
      }
      else if(strpos($m[0][$i][0],'// look')==1)
      {
         //echo $i."=====>".$m[0][$i][0]."\r\n";
         //$output.=$m[0][$i][0];
      }
      else if(strpos($m[0][$i][0],'// parts')==1)
      {
         //echo $i."=====>".$m[0][$i][0]."\r\n";
         //$output.=$m[0][$i][0];
      }
      else $output.=$m[0][$i][0];

   }
   else
   {
        echo $i."=====>".$m[0][$i][0]."\r\n";
        $output.=$m[0][$i][0];
   }


   $begin=$end+strlen($m[0][$i][0]);//跳过被匹配的数据
}

   $end=strlen($d);

   $shrink=$end-$begin;
   //echo  $begin."_".$end.":".$shrink."\r\n";

   $output.=substr($d,$begin,$end-$begin);

//echo $output;

file_put_contents("projects.bundle.news.js",$output);
?>