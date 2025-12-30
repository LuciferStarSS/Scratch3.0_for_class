<?php
$GID=isset($_POST['GID'])?intval($_POST['GID']):0;
$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):1;
if($GID!=0)
{
   $att=Array();

   $add="../../data/whiteboard/".$room."/".$GID."/";

   $filenamepath= "../../data/task/".$room."_".$GID."_task.inc.php";
   $att[]=@file_get_contents($filenamepath);


   if ($handle_date = @opendir($add))
   {
      //echo "<div id=sub2 style='position:absolute;right:0px;'>";
      //$i=0;
      while (false !== ($file = @readdir($handle_date)))
      {
         if($file!="." && $file!="..")
         {
            if (!is_dir($add.$file))
            {
               $att[]=$file;
            }
         }
      }
      echo json_encode($att);//echo "</div>";
      closedir($handle_date); 
   }
}
?>