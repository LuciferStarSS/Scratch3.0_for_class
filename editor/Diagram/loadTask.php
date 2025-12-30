<?php
$ROOM=isset($_COOKIE["R"])?$_COOKIE["R"]:1;
$CLASSID=isset($_COOKIE["CLASSID"])?$_COOKIE["CLASSID"]:0;
$GRADEID=isset($_COOKIE["GRADEID"])?$_COOKIE["GRADEID"]:0;

$proj=isset($_POST["P"])?$_POST["P"]:"";




   $task_files=Array();						//附件（视频/图片）
   $path="../../data/diagram/".$ROOM."/".$GRADEID."/".$proj."/";

   file_put_contents("../../data/diagram/".$ROOM."/".$GRADEID."/lesson.dat",$proj);

   if(is_dir($path))
   {
      if($handle_date = opendir($path))
      {
         while (false !== ($folder = readdir($handle_date)))
         {
            if(is_dir($path.$folder) && $folder!="." && $folder!="..")				//仅显示文件，不显示目录
            {
               $task_files[]=$folder;
               //echo "<option value=".$folder.">".$folder."</option>";
            }
         }
         closedir($handle_date); 
      }
   }

   echo json_encode($task_files);

?>