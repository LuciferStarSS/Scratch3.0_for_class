<?php
set_time_limit(0);
$f="./projects.bundle.new.js";
$d=file_get_contents($f);

echo strlen($d)."\r\n";

//preg_match_all("/\/\/([^^]*?)\n/",$d,$m,PREG_OFFSET_CAPTURE);

preg_match_all("/ \/\/ ([^^]*?)(\\\[n]|\n)/",$d,$m,PREG_OFFSET_CAPTURE);



//preg_match_all("/\/\/([^^]*?)(\n)/",$d,$m,PREG_OFFSET_CAPTURE);


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

   if(strlen($m[0][$i][0])==9)//  && strlen($m[0][$i][0])<64)
   {
      echo $i."=====>".$m[0][$i][0]."\r\n";
      $output.=$m[0][$i][0];
//      $output.='\n';

   }

   if(strlen($m[0][$i][0])==11)//  && strlen($m[0][$i][0])<64)
   {
 //     echo $i."=====>".$m[0][$i][0]."\r\n";
      $output.=$m[0][$i][0];
//      $output.='\n';

   }
   if(strlen($m[0][$i][0])==15)//  && strlen($m[0][$i][0])<64)
   {
 //     echo $i."=====>".$m[0][$i][0]."\r\n";
      $output.=$m[0][$i][0];
//      $output.='\n';

   }
   if(strlen($m[0][$i][0])==17)//  && strlen($m[0][$i][0])<64)
   {
      if(strpos($m[0][$i][0],"/ '\\\"")==2){}// $output.=$m[0][$i][0];
      else
      {
         //echo $i."=====>".$m[0][$i][0]."\r\n";
         $output.=$m[0][$i][0];
         //$output.='\n';
      }
  }

   if(strlen($m[0][$i][0])==18)//  && strlen($m[0][$i][0])<64)
   {
//      echo $i."=====>".$m[0][$i][0]."\r\n";
//      $output.=$m[0][$i][0];
      $output.='\n';
   }

   if( strlen($m[0][$i][0])==63)
   {
 //     echo $i."=====>".$m[0][$i][0]."\r\n";
      $output.=$m[0][$i][0];
//      $output.='\n';

   }


   if(strlen($m[0][$i][0])>18  && strlen($m[0][$i][0])<64)
   {
     // echo $i."=====>".$m[0][$i][0]."\r\n";
      $output.=$m[0][$i][0];

   }

    
//   if(strpos($m[0][$i][0],'/ module id')==2)
//   {
//      $output.=$m[0][$i][0];
//   }
//   else



   $begin=$end+strlen($m[0][$i][0]);//跳过被匹配的数据
}

   $end=strlen($d);

   $shrink=$end-$begin;
   //echo  $begin."_".$end.":".$shrink."\r\n";

   $output.=substr($d,$begin,$end-$begin);

//echo $output;

file_put_contents("projects.bundle.news.js",$output);
?>