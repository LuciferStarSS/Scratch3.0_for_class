<?php
//教师端获取小白板文本历史数据
error_reporting(0);
$txt=isset($_POST['TXT'])?trim($_POST['TXT']):"";
$GID=isset($_POST['GID'])?intval($_POST['GID']):0;
$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):1;
if($txt && $GID!=0)
{
   $historyData=@file_get_contents("../../data/whiteboard/".$room."/".$GID."/txt/history.txt");
   if($historyData!="")
   {
      $historyTXT= unserialize($historyData);
      $hc=@count($historyTXT);
      $color=Array("aliceblue","antiquewhite");

      $i=0;
      foreach ($historyTXT as $key=>$value)
      {
         if( strpos($value,$txt) !==FALSE)
         {
            $bFound=true;
            echo "<div style='margin-bottom: -18px;'><div  onclick=\"setTXT('".$key."','".$value."');\" style=\"background:".$color[$i++].";cursor:grab;width: 172px;margin-bottom: 1px;border: 1px solid;\">".str_replace($txt,"<font color=red>".$txt."</font>",$value)."</div><img src=./img/delete.png style='position: relative;top: -17px;left:158px;' title='彻底删除' onclick='deleteTXT(\"".$key."\")'></div>";
            if($i>=count($color)) $i=0;
         }
      }
   }
}
?>