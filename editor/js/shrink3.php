<?php
set_time_limit(0);
ini_set("memory_limit","2000M");

$f="./projects.bundle.new2.js";
$d=file_get_contents($f);

echo strlen($d)."\r\n";

//preg_match_all("/\/\/([^^]*?)\n/",$d,$m,PREG_OFFSET_CAPTURE);

preg_match_all("/ \/\/ ([^^]*?)(\\\[n])/",$d,$m,PREG_OFFSET_CAPTURE);

$mc=count($m[0]);


//print_r($m[0]);//0:matched  1:matched data
//exit();
$begin=0;
$end=0;
$output="";
//$mc=400;


$r=Array();


for($i=0;$i<$mc-1;$i++)
{
   $end=$m[0][$i][1];
   $shrink=$end-$begin;
   //echo  $begin."_".$end.":".$shrink."\r\n";

   $output.=substr($d,$begin, $shrink);

   //echo $i."=====>".$m[0][$i][0]."\r\n";

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
      else if(strpos($m[0][$i][0],'// assume')==1)//41?
      {
         //echo $i."==".strlen($m[0][$i][0])."===>".$m[0][$i][0]."\r\n";
         $output.=$m[0][$i][0];
      }
      else if(strpos($m[0][$i][0],'// hopefully this is impossible to test :-)\n')==1)
      {
         $output.=$m[0][$i][0];//keep it
      }

      else if(strpos($m[0][$i][0],"// '/'")==1)//9
      {
         $output.=$m[0][$i][0];//keep it
      }         
      else if(strpos($m[0][$i][0],"// '{")==1)
      {
         $output.=$m[0][$i][0];//keep it
      }
            else if(strpos($m[0][$i][0],"// 'x'")==1)
      {
         $output.=$m[0][$i][0];//keep it
      }
            else if(strpos($m[0][$i][0],"// 'u'")==1)
      {
         $output.=$m[0][$i][0];//keep it
      }
            else if(strpos($m[0][$i][0],"// '")==1)
      {
         $output.=$m[0][$i][0];//keep it
      }

      else  if(strpos($m[0][$i][0],'// Node strips out invalid characters ')==1)//47
      {
         $output.=$m[0][$i][0];//keep it
      }
      else if(strpos($m[0][$i][0],'// rewind, since should have been submessages\n')==1)//48
      {
         $output.=$m[0][$i][0];
      }
      else if(strpos($m[0][$i][0],'//        \"inflate')==1)
      {
         $output.=$m[0][$i][0];//keep it
      }
      else if(strpos($m[0][$i][0],'// Use -1 or nu')==1)//50
      {
         $output.=$m[0][$i][0];;//keep it
      }
      else if(strpos($m[0][$i][0],'// Tracev((stde')==1)
      {
         $output.=$m[0][$i][0];//keep it
      }
      else if(strpos($m[0][$i][0],'// this throws ')==1)//55
      {
         $output.=$m[0][$i][0];
      }
      else if(strpos($m[0][$i][0],'// This is to s')==1)//63
      {
         $output.=$m[0][$i][0];
      }
      else if(strpos($m[0][$i][0],'// at this poin')==1)
      {
         $output.=$m[0][$i][0];
      }

      else if(strlen($m[0][$i][0])>17 && strlen($m[0][$i][0])<46 ) //443 // 1150-1170
      { 
      if(strpos($m[0][$i][0],'// Se')==1)
      {
         $output.=$m[0][$i][0];//saveit
      }
      else if(strpos($m[0][$i][0],'// Di')==1)
      {
         $output.=$m[0][$i][0];//saveit
      }
      else if(strpos($m[0][$i][0],'// co')==1)
      {
         $output.=$m[0][$i][0];//saveit
      }
      else if(strpos($m[0][$i][0],'// re')==1)
      {
         $output.=$m[0][$i][0];//saveit
      }
      else if(strpos($m[0][$i][0],'// Co')==1)
      {
         $output.=$m[0][$i][0];//saveit
      }
      else if(strpos($m[0][$i][0],'// mu')==1)
      {
         $output.=$m[0][$i][0];//saveit
      }
      else if(strpos($m[0][$i][0],'// Tr')==1)
      {
         $output.=$m[0][$i][0];//saveit
      }
      else if(strpos($m[0][$i][0],'// Le')==1)
      {
         $output.=$m[0][$i][0];//saveit
      }
      else if(strpos($m[0][$i][0],'// mo')==1)
      {
         $output.=$m[0][$i][0];//saveit
      }
      else if(strpos($m[0][$i][0],'// ~~')==1)
      {
         $output.=$m[0][$i][0];//saveit
      }
   }

     
/*
     //$output.=$m[0][$i][0];
    
      echo '      else if(strpos($m[0][$i][0],\''.(strpos($m[0][$i][0],"'")>0 ? substr($m[0][$i][0],1,strpos($m[0][$i][0],"'")-1):substr($m[0][$i][0],1,15)).'\')==1)
      {
         $output.=$m[0][$i][0];
      }
';
*/

   }
   else
   {//无数据
        //echo $i."=====>".$m[0][$i][0]."\r\n";
        //$output.=$m[0][$i][0];
   }

   $begin=$end+strlen($m[0][$i][0]);//跳过被匹配的数据
}

/*
//print_r($r);
//$c=count($r);
foreach($r as $key=>$value)
{
      echo '      else if(strpos($m[0][$i][0],\''.$key.'\')==1)
      {
         $output.=$m[0][$i][0];
      }
';
*/



}


   $end=strlen($d);

   $shrink=$end-$begin;
   //echo  $begin."_".$end.":".$shrink."\r\n";

   $output.=substr($d,$begin,$end-$begin);

//echo $output;

file_put_contents("projects.bundle.news.js",$output);
?>