<?php

$GID=isset($_POST['GID'])?intval($_POST['GID']):0;
$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):1;
if($GID!=0)
{
   $add="../../data/whiteboard/".$room."/".$GID."/bd/";
   $files=Array();
   if ($handle_date = @opendir($add))
   {
      echo "<div id=sub2 style='position:absolute;right:0px;'>";
      $i=0;
      while (false !== ($file = @readdir($handle_date)))
      {
         if($file!="." && $file!="..")
         {
            if (!is_dir($add.$file))
            {
               echo "<input type='button' value='".date("Y-m-d H:i:s",$file)."' onclick=\"loadPos2('".$file."');\">";
            }
         }
      }
      echo "</div>";
      closedir($handle_date); 
   }
}
?>