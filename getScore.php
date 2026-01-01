<?php
exit();
//原系统学生分数保存在数据库中，而本项目不涉及数据库，所以该功能暂不可用。
include "../../include/config.inc.php";
error_reporting(0);
header("Pragma:no-cache");
header("Cache-Control:no-cache,must-revalidate");
$ip=$_SERVER['REMOTE_ADDR'];

if(isset($_COOKIE['db']))
{
   $dbname=$_COOKIE['db'];
}

//$ip="192.168.10.112";	//调试用

//$ip="192.168.3.12";	//调试用
$week=isset($_POST["W"])?$_POST["W"]:date("oW");
$day=isset($_POST["D"])?$_POST["D"]:date("N");
$lesson=isset($_POST["L"])?$_POST["L"]:0;
$forced=isset($_POST["F"])?$_POST["F"]:0;

if(!isset($_POST['W']))				//GET方式，调试用
{
   $week=isset($_GET["W"])?$_GET["W"]:date("YW");
   $day=isset($_GET["D"])?$_GET["D"]:date("N");
   $lesson=isset($_GET["L"])?$_GET["L"]:0;
   $forced=isset($_GET["F"])?$_GET["F"]:0;
}

//教师身份识别
$room=0;
$admin=0;
if(isset($teacher_room[$ip]))			//教师访问
{
   setCookie("USERNAME",$teacher_room[$ip][0],time()+3600,$site_path);
   $room=$teacher_room[$ip][1];
   $admin=1;
}
//else exit("ERROR:NO AUTH");			//非教师访问，直接终止程序。

//检查是否存在临时换课
if($forced==0)					//换课后，也可以查看其他班级的分数。
{						//非强制状态下，可以自动查看当前的课
   $lesson=0;
   
   if(file_exists("../../data/lesson/$room.inc.php"))	//换过的课
   {
      include "../../data/lesson/$room.inc.php";
      $week=$dinfo[0];
      $day=$dinfo[1];
      $lesson=$dinfo[2];
   }
						//没换过的课
   if($lesson==0)				//在未指定当前属于哪一节课时，计算出当前课的课时
   {
      $time_store=Array();
      for($i=0;$i<count($time_offset);$i++)
      {
         $start=mktime($time_offset[$i][0],$time_offset[$i][1]-5,"00",date("m"),date("d"),date("Y"));
         $end=mktime($time_offset[$i][2],$time_offset[$i][3]+5,"00",date("m"),date("d"),date("Y"));
         $time_store[]=Array($start,$end);
      }
      $date= mktime(date("H"),date("i"),date("s"),date("m"),date("d"),date("Y"));		//当前时间

      for($i=0;$i<count($time_store);$i++)
      {
         if($date>=$time_store[$i][0] && $date<=$time_store[$i][1]){ $lesson=($i+1); break;}
      }												//判断当前是第几节课
   }
//echo $week;
//echo $day;
//echo $lesson;
}

///////////////////////////////////////////////////////////////////移动设备暂不处理。
$mobile=0;
if($room==0){
   if(strpos($_SERVER['HTTP_USER_AGENT'],"OE106")===false && strpos($_SERVER['HTTP_USER_AGENT'],"Kindle/3.0")===false){
          $room=0; 
   }
   else {$room=1;$admin=1;$mobile=1;}
}
///////////////////////////////////////////////////////////////////

include "../../include/db.inc.php";
//访问数据库，查询相关数据


$sql="select a.ID,a.NAME,a.SEAT,a.CID,a.IP,b.WEEK,b.SCORE from seat a,logs b where a.ID=b.ID  and b.DAY=$day  and b.WEEK=$week and b.LESSON=$lesson and a.ROOM=$room order by a.SEAT";
$data=$m->DoQuery($sql);
//echo $sql;
//print_r($data);
$dc=count($data);
$datax=Array();
if($dc>0)
{
   $sql="select NAME  from seat  where CID=".($data[0]['CID']);
   //echo $sql;
   $students=$m->DoQuery($sql);
   //print_r($students);
   $datax[]['T']=count($students);//$studentsCount[0]["T"];		//平均分，取整。
   for($i=0;$i<count($students);$i++)
   {
      $sArr[]=$students[$i]["NAME"];
   }

   //print_r($sArr);//全部名单


   $cndir=$classname[$data[0]['CID']-1];
   $datedir= weekday(substr($week,0,4),substr($week,4,2),$day-1);//当前课的日期（临时换课，则为该课实际上课日期），用于获取学生上传的作业情况。

   $datax[]['DATE']=$datedir;					//日期
   $datax[]['CLASSNAME']=$cndir;				//班级名称
   setCookie("CLASSID",$data[0]['CID'],time()+3600,$site_path);	//班级ID

   $grade_id=$grades[$data[0]['CID']-1];
   setCookie("GRADEID",$grade_id,time()+3600,$site_path);	//班级ID

   $fileinfo=getfilelist($cndir);
   //echo $fileinfo;
   //echo $cndir;
   $sum=0;
   $scount=0;
   $strAbsentStudents='';

   $existedArr=Array();

   for($i=0;$i<$dc;$i++)
   {
      $existedArr[]=$data[$i]['NAME'];	//出席名单

      $data[$i]['COLOR']=showfiles($fileinfo,$data[$i]['IP'],$data[$i]['NAME']);
      $sum+=$data[$i]['SCORE'];
      if($data[$i]['SCORE']!=0) $scount++;
      $datax[]=$data[$i];
   }

   //print_r($existedArr);

   for($i=0;$i<count($sArr);$i++)
   {

      if(!in_array($sArr[$i],$existedArr) )//过滤未出席名单
      {
//echo $sArr[$i];
         $strAbsentStudents.=$sArr[$i].",";
      }
   }


   $datax[]['AVERAGE']=floor($sum/$scount++)>0?floor($sum/$scount++):0;		//平均分，取整。
   $datax[]['ABSENT']=trim($strAbsentStudents,",");		//平均分，取整。

   //print_r($datax);
   echo json_encode($datax);
}
else
{
   $sql="select a.ID,a.NAME,a.SEAT,a.CID,a.IP,b.WEEK,b.SCORE from seat a,logs b where a.ID=b.ID  and b.DAY=$day  and b.LESSON=$lesson and a.ROOM=$room limit 1";
   $data=$m->DoQuery($sql);

   $cndir=$classname[$data[0]['CID']-1];
   $datedir= weekday(substr($week,0,4),substr($week,4,2),$day-1);//当前课的日期（临时换课，则为该课实际上课日期），用于获取学生上传的作业情况。

   $datax[]['DATE']=$datedir;					//日期
   $datax[]['CLASSNAME']=$cndir;				//班级名称
   setCookie("CLASSID",$data[0]['CID'],time()+3600,$site_path);	//班级ID

   $grade_id=$grades[$data[0]['CID']-1];
   setCookie("GRADEID",$grade_id,time()+3600,$site_path);	//班级ID


   echo json_encode($datax);
//echo $sql;
//print_r($data);
}
?>
