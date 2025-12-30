<?php
   error_reporting(0);
   include "../../include/config.inc.php";
   include "../../include/db.inc.php";

   $wuid  = 0;						//项目的作者
   $uid   = isset($_POST['UID'])?$_POST['UID']:0;	//打分用户ID
   $cid   = isset($_POST['CID'])?$_POST['CID']:0;	//班级ID
   $path  = isset($_POST['PATH'])?$_POST['PATH']:'';	//文件名：IP_姓名_项目名.SB3
   $date  = isset($_POST['DATE'])?$_POST['DATE']:'';	//日期文件夹
   $score = isset($_POST['SCORE'])?$_POST['SCORE']:'';	//$score为0，表示获取当前项目的评价值

   if( $cid && $path && $date)
   {
      $pinfo=explode("_",$path);
      if(count($pinfo)==3)//拆分文件名：{IP,姓名,项目名.SB3}
      {
         //获取作者ID
         $SQL="select ID from seat where CID=".$cid." AND IP=".ip2long($pinfo[0])." AND NAME=\"".$pinfo[1]."\"";
         $wuidArr=$m->DoQuery($SQL);

         if(isset($wuidArr[0]['ID']))			//用户ID获取成功。教师没有ID，所以不能打分。
         {
            $wuid=$wuidArr[0]['ID'];				//Workowner_User_ID

            $SQL="select PATH from wlist where WUID=".$wuid." AND DD=\"".$date."\" AND WID=\"".md5($path)."\" AND CID=".$cid;
            $existed=$m->DoQuery($SQL);
            if(!isset($existed[0]["PATH"]))			//没有榜单记录，就创建一条
            {
               $SQL="insert into wlist(WID,WUID,CID,PATH,DD) values(\"".MD5($path)."\",".$wuid.",".$cid.",\"".$path."\",\"".$date."\")";
               $m->DoQueryNoReturn($SQL);
            }

            //上榜信息已就绪，开始打分
            if($score==-1)			//撤销打分
            {
               $SQL="update rate set RATE=0 where WID=\"".MD5($path)."\" AND UID=".$uid;
               //echo $SQL;
               $m->DoQueryNoReturn($SQL);
            }
            else if($score>0)			//有效打分
            {

               $SQL="select avg(RATE) as RATE from rate where WID=\"".md5($path)."\" AND UID=".$uid;
               //echo $SQL;
               $existed=$m->DoQuery($SQL);
               //print_r($existed);
               if(isset($existed[0]["RATE"])==0)		//第一次打分
               {
                  if($score>0)				//打分有效，记录分数
                  {
                     $SQL="insert into rate(UID,WID,RATE) values(\"".$uid."\" ,\"".MD5($path)."\",".$score.")";
                     //echo $SQL;
                     $m->DoQueryNoReturn($SQL);
                     //exit("{\"RATE\":\"".$score."\"}");
                  }
                  //else  exit("{\"RATE\":\"0\"}");		//无打分记录
               }
               else					//已有打分记录
               {
                  if($score>0)				//打分有效，更新分数
                  {
                     $SQL="update rate set RATE=".$score." where WID=\"".MD5($path)."\" AND UID=".$uid;
                     //echo $SQL;
                     $m->DoQueryNoReturn($SQL);
                  }
               }
            }

            //$score为0表示查询当前评分结果；
            //多用户模式下，打分和撤销打分后，都需要返回当前的均分。
            $SQL="select avg(RATE) as RATE from rate where WID=\"".md5($path)."\"";	//当前现有打分记录的平均值
            //echo $SQL;
            $existed=$m->DoQuery($SQL);
            //print_r($existed);
            exit("{\"RATE\":\"".intval($existed[0]["RATE"])."\"}");

         }
         else exit("{\"RATE\":\"0\"}");//教师作品
      }
      else exit("{\"RATE\":\"0\"}"); //非规则文件名
   }
   else exit("{\"RATE\":\"0\"}");//参数格式错误

?>