<?php

$media=json_decode(file_get_contents("./static/json_index/sprites.json"));

//print_r($media[0]);
echo count($media)."\r\n";

$c=count($media);
for($i=0;$i<$c;$i++)
{
   $cos=$media[$i]->{"json"}->{'costumes'};
   foreach($cos as $values)
   {
      echo $values->{'md5ext'};
      echo "\r\n";
   }

   $cos=$media[$i]->{"json"}->{'sounds'};
   foreach($cos as $values)
   {
      echo $values->{'md5ext'};
      echo "\r\n";
   }
//exit;
   //copy("./static/asset/".$media[$i]->{"md5"},"./static/asset2/".$media[$i]->{"md5"});
}


exit;
$media=json_decode(file_get_contents("./static/json_index/sprites.json"));

print_r($media);
echo count($media)."\r\n";

$c=count($media);
for($i=0;$i<$c;$i++)
{
   echo $media[$i]->{'md5'}.",".((file_exists("./static/asset/".$media[$i]->{"md5"}))? "found\r\n":"not found\r\n");
   //copy("./static/asset/".$media[$i]->{"md5"},"./static/asset2/".$media[$i]->{"md5"});
}

   $arr=json_decode(file_get_contents("./static/json_index/costumes.json"));

//print_r($arr);
echo count($arr)."\r\n";
$c=count($arr);


for($i=0;$i<$c;$i++)
{
   echo $arr[$i]->{'md5'}.",".((file_exists("./static/asset/".$arr[$i]->{"md5"}))? "found\r\n":"not found\r\n");
   //copy("./static/asset/".$arr[$i]->{"md5"},"./static/asset2/".$arr[$i]->{"md5"});
}



$bg=json_decode(file_get_contents("./static/json_index/sounds.json"));

echo count($bg)."\r\n";

$c=count($bg);
for($i=0;$i<$c;$i++)
{
   echo $bg[$i]->{'md5'}.",".((file_exists("./static/asset/".$bg[$i]->{"md5"}))? "found\r\n":"not found\r\n");
   //copy("./static/asset/".$bg[$i]->{"md5"},"./static/asset2/".$bg[$i]->{"md5"});
}



$bg=json_decode(file_get_contents("./static/json_index/backdrops.json"));

echo count($bg)."\r\n";

$c=count($bg);
for($i=0;$i<$c;$i++)
{
   echo $bg[$i]->{'md5'}.",".((file_exists("./static/asset/".$bg[$i]->{"md5"}))? "found\r\n":"not found\r\n");
   //copy("./static/asset/".$bg[$i]->{"md5"},"./static/asset2/".$bg[$i]->{"md5"});
}
