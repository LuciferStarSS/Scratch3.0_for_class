<?php
//教师端获取小白板历史存档数据列表

//$GID=isset($_POST['GID'])?intval($_POST['GID']):0;

//if($GID!=0)
//{
   $add="./stage/";
   $files=Array();
   if ($handle_date = @opendir($add))
   {
      echo "<div id=sub2 style='position:absolute;right:-17px;z-index:9;position: absolute;left: 302px;top: 30px;width:150px;'   onmouseout='hideRaceStage();'><select onchange='setStageDrop(this);'><option value=''>请选择舞台背景</option>";
      $i=0;
      while (false !== ($file = @readdir($handle_date)))
      {
        if($file!="." && $file!="..")
         { 
            if (!is_dir($add.$file))
            {
               echo "<option value='".$file."'>".$file."</option>";
            }
         }
      }
      echo "</select></div>";
      closedir($handle_date); 
   }
//}
?>