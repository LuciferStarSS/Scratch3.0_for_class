<?php
//��������seat���ݿ��а༶��Ϣ
//names.php��������ѧ����Ϣ��
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