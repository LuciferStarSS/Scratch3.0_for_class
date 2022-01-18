<?php
//用于生成seat数据库中班级信息
//names.php用于生成学生信息。
exit;
set_time_limit(0);
include("./config.inc.php");
include("./db.inc.php");

foreach($classname as $key=>$value)
{
   $sql="insert into class(CID,GID,CNAME)values (".($key+1).",".$grades[$key].",\"".$value."\")";
   echo $sql;
   $m->DoQueryNoReturn($sql);
}
?>