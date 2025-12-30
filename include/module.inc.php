<?php
   //Class Management 上课管理
   if(file_exists("./CM/config.inc.php"))
   {
      include("./CM/config.inc.php");

      //文本代码编辑器
      if(file_exists("./ScratchToText/config.inc.php"))
      {
         include("./ScratchToText/config.inc.php");
      }

      //流程图
      if(file_exists("./Diagram/config.inc.php"))
      {
         include("./Diagram/config.inc.php");
      }

      //暂存盘
      if(file_exists("./Pickup/config.inc.php"))
      {
         include("./Pickup/config.inc.php");
      }
   }
?>