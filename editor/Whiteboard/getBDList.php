<?php
//教师端获取小白板历史存档数据列表

$GID=isset($_POST['GID'])?intval($_POST['GID']):0;
$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):0;
if($GID!=0)
{
   $add="../../data/whiteboard/".$room."/".$GID."/bd/";
   $files=Array();
   if ($handle_date = @opendir($add))
   {
      echo "<div id=sub2 style='position:absolute;right:-17px;overflow: overlay;height:222px;'>";
      $i=0;
      while (false !== ($file = @readdir($handle_date)))
      {
        if($file!="." && $file!="..")
         { 
            if (!is_dir($add.$file))
            {
               $fi=fopen($add.$file,'r');
               if($fi)
               {
                  $memo=fgets($fi);
                  fclose($fi);
               }
               echo "\r\n<div style='width:180px;'><img  src=./img/delete.png style='position:relative;top:3px;background:white' title='彻底删除' onclick=\"deleteBOARD('".$file."')\"><img src=./img/play.png style='position:relative;top:3px;width:16px;height:16px;background:white' title='间隔1秒单步播放' onclick=\"playBDPos('".$file."')\"><input title='".$memo."' type='button' value='".date("Y-m-d H:i:s",$file)."' onclick=\"loadBDPos('".$file."');\" style='position:relative;top:0px;'></div>";
            }
         }
      }
      echo "</div>";
      closedir($handle_date); 
   }
}
?>