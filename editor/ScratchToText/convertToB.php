<?php
set_time_limit(2);

$nStartTime=microtime(true);

//$d=isset($_GET['d'])?1:0;			//调试用
$arrCODEDATA=Array(							//POST表单传过来的数据
   isset($_POST['D0'])?$_POST['D0']:NULL,	//现有全局变量名和ID
   isset($_POST['D1'])?$_POST['D1']:NULL,	//代码中全局变量
   isset($_POST['D2'])?$_POST['D2']:NULL,	//代码中当前角色变量
   isset($_POST['D3'])?trim($_POST['D3']):NULL	//有事件触发的代码和无事件触发的代码合二为一了。
   //isset($_POST['D4'])?$_POST['D4']:NULL,	//
);

//if($arrCODEDATA!=Array(NULL,NULL,NULL,NULL))	//正常应该开启，但开启后，就不方便调试了。
//{
   include "c2s.class.php";

//$d=false;



/*

需要将上述代码，转换成如下形式：
motion_movesteps( 10 );COMMENTS(XXXXXXXXXXXXXX);
motion_movesteps( 10 );
COMMENTS(YYYYYYYYYYYYYY);
if(1>2){COMMENTS(ZZZZZZZZZZZZ);
   motion_movesteps( 10 );COMMENTS(abcdefg);
   motion_movesteps( 10 );

   if(1>2){COMMENTS(ZZZZZZZZZZZZ2);
      motion_movesteps( 10 );COMMENTS(abcdefg2);
      motion_movesteps( 10 );

   }
}

*/




   $blocks=new CToScratch3(serialize($arrCODEDATA));
   $arrBlocks=$blocks->deal();

   //if($d)				//调试用
   //   print_r($arrBlocks);

   $arrBlocks[4]=microtime(true)-$nStartTime;

   echo json_encode($arrBlocks,JSON_FORCE_OBJECT);	//JSON数据输出
//}
?>
