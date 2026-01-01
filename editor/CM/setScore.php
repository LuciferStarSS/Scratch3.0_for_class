<?php
exit();
   error_reporting(0);
   include "../include/config.inc.php";
   include "../include/db.inc.php";

   $uid   = isset($_POST['UID'])?$_POST['UID']:0;	//打分用户ID
   $cid   = isset($_POST['CID'])?$_POST['CID']:0;	//班级ID
   $path  = isset($_POST['PATH'])?$_POST['PATH']:'';	//文件名：IP_姓名_项目名.SB3
   $date  = isset($_POST['DATE'])?$_POST['DATE']:'';	//日期文件夹
   $score = isset($_POST['SCORE'])?$_POST['SCORE']:'';	//0：获取当前项目的评分；-1：删除之前所评分数；1-5：打分
   $type  = isset($_POST['TYPE'])?$_POST['TYPE']:'';	//0：教师打分；1：学生互评
   $wuid  = 0;						//作品作者的ID，需要根据$cid班级ID和$path文件名中的IP和姓名这三个数据，在seat表中查询获得

/*******************

两种打分：
一、教师对课堂作业进行打分
    数据来源：学生正式提交到服务器的作品
    由于只有教师一人进行评分，所以这个成绩可以以文件形式保存，也可以数据库保存（数据库保存，更方便期末进行成绩汇总）。
    数据表：SCORE
    旧数据表：RATE


二、学生间互评
   数据来源：上榜的作品
   学生教师都可以进行评分，成绩供参考，为便于显示分数，需要数据库进行存储。
   数据表：TOPLIST

   教师打的分，因为教师（UID为0）不在SEAT表中，所以不会被统计到均分中。

学生互评成绩
SELECT * FROM rate r,seat s where r.uid=s.id and s.cid=$cid

学生互评作品信息
SELECT * FROM wlist w,seat s where w.wuid=s.id and s.cid=26 and w.type=1

教师打分作品信息
SELECT * FROM wlist w,seat s where w.wuid=s.id and s.cid=26 and w.type=0

三、WLIST表
   课堂作业与上榜作品，如果文件名一样，就需要在表中区分；如果不一样，就方便很多了。


*******************/
   if( $cid && $path && $date )
   {
      $WID=md5($type.$date.$path);	//$type用于区分普通作品还是上榜作品，
					//$date区分不同日期的同名作品
					//$path中的IP、学生名和作品名确定唯一学生的单次作品
      switch($score)
      {
         case 1:	//打1分
         case 2:	//打2分
         case 3:	//打3分
         case 4:	//打4分
         case 5:	//打5分
            $pinfo=explode("_",$path);
            if(count($pinfo)==3)//拆分文件名：{IP,姓名,项目名.SB3}
            {
               //获取作者ID
               $SQL="select ID from seat where CID=".$cid." AND IP=".ip2long($pinfo[0])." AND NAME=\"".$pinfo[1]."\"";	//班级、IP与姓名可以锁定唯一用户
               $wuidArr=$m->DoQuery($SQL);

               if(isset($wuidArr[0]['ID']))			//用户ID获取成功。教师没有ID，所以不能被打分。
               {
                  $wuid=$wuidArr[0]['ID'];				//Workowner_User_ID
						//表WLIST用于保存被打分作品名称，主要是为了便于查询哪些作品被评分了，表中字段PATH，为文件名。
                  $SQL="select PATH from wlist where WUID=".$wuid." AND DD=\"".$date."\" AND WID=\"".$WID."\" AND CID=".$cid;
                  $existed=$m->DoQuery($SQL);
                  if(!isset($existed[0]["PATH"]))			//没有榜单记录，就创建一条
                  {
                     $SQL="insert into wlist(WID,WUID,CID,PATH,DD,TYPE) values(\"".$WID."\",".$wuid.",".$cid.",\"".$path."\",\"".$date."\",".$type.")";
                     $m->DoQueryNoReturn($SQL);
                  }
									//表RATE用于保存打分数据
                  $SQL="select avg(RATE) as RATE from rate where WID=\"".$WID."\" AND UID=".$uid;
                  $existed=$m->DoQuery($SQL);
                  if(isset($existed[0]["RATE"])==0)		//第一次打分
                  {
                     $SQL="insert into rate(UID,WID,RATE) values(\"".$uid."\" ,\"".$WID."\",".$score.")";
                     $m->DoQueryNoReturn($SQL);
                  }
                  else					//已有打分记录
                  {
                     $SQL="update rate set RATE=".$score.",TIME=\"".date("Y-m-d H:i:s",time())."\" where WID=\"".$WID."\" AND UID=".$uid;
                     $m->DoQueryNoReturn($SQL);
                  }
               }
            }//不理会文件名格式异常的情况

         case -1:	//删除当前用户的对当前作品的打分记录
            if($score==-1)
            {
               //$SQL="update rate set RATE=0 where WID=\"".$WID."\" AND UID=".$uid;
               $SQL="delete from rate where WID=\"".$WID."\" AND UID=".$uid;
               $m->DoQueryNoReturn($SQL);
            }

         case 0:      //查询打分结果
            if($type==0)//默认教师评分，UID为0
            {
               $SQL="select RATE from rate where WID=\"".$WID."\" and UID=0";	//当前现有打分记录的平均值
               $rateArr=$m->DoQuery($SQL);
               if($rateArr)
               {
                  exit("{\"RATE\":\"".$rateArr[0]["RATE"]."\",\"INFO\":\"给你打了".$rateArr[0]["RATE"]."分。\"}");
               }
            }
            else if($type==1)//上榜作品学生互评
            {
               //$SQL="select NAME from seat,wlist where wlist.WUID=seat.ID and wlist.WID=\"".$WID."\"";
               //$ownerArr=$m->DoQuery($SQL);
               //$owner='';
               //if($ownerArr)
               //{
               //   $owner=$ownerArr[0]["NAME"];
             
                  //$SQL="select NAME,RATE from seat,rate where rate.UID=seat.ID and  rate.WID=\"".$WID."\"";
                  $SQL="select NAME,RATE,PATH from seat,rate,wlist where rate.UID=seat.ID and rate.WID=wlist.WID and rate.WID=\"".$WID."\"";
                  $rateArr=$m->DoQuery($SQL);
                  if($rateArr)
                  {
                     $c=count($rateArr);
                     $sum=0;
                     $owner=explode("_",$rateArr[0]["PATH"])[1];
                     $nameArr=Array();
                     for($i=0;$i<$c;$i++)
                     {
                        $sum+=$rateArr[$i]["RATE"];
                        if(isset($rateArr[$i]["NAME"]))
                           $nameArr[]=$rateArr[$i]["NAME"]."给".$owner."打了".$rateArr[$i]['RATE']."分；";
                     }
                     exit("{\"RATE\":\"".round($sum/$c,1)."\",\"INFO\":\"".implode("<br>",$nameArr)."<br>平均得分：".round($sum/$c,1)."分。\"}");
                  }
               //}
            }
            exit("{\"RATE\":\"-1\",\"INFO\":\"暂无评分.\"}");
      }
   }
   else exit("{\"RATE\":\"-1\",\"INFO\":\"暂无评分。\"}");//参数格式错误
?>