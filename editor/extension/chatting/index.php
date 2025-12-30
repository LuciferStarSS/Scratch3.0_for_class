<?php
include "../../../include/config.inc.php";
include "../../../include/db.inc.php";

$room=isset($_COOKIE['R'])?intval($_COOKIE['R']):0;
$classid=isset($_COOKIE['CLASSID'])?intval($_COOKIE['CLASSID']):"";
$date=isset($_COOKIE['DD'])?validateFilename($_COOKIE['DD']):"";
$username=isset($_COOKIE['USERNAME'])?validateFilename($_COOKIE['USERNAME']):"";
$ip=getenv("REMOTE_ADDR");

$steps=isset($_GET['S'])?intval($_GET['S']):'';
$left =isset($_GET['L'])?intval($_GET['L']):'';
$right=isset($_GET['R'])?intval($_GET['R']):'';
$speed =isset($_GET['T'])?$_GET['T']:'';

$sql="insert into racing(CID,USERNAME,STEPS,LEFTA,RIGHTA,SPEED,ROOM,DT,TIMESTAMP) values($classid,\"".$username."\",$steps,$left,$right,$speed,$room,\"".$date."\",\"".time()."\")";
echo $sql;
$m->DoQueryNoReturn($sql);
print_r($_GET);
print_r($_COOKIE);
?>