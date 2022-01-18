<?php
$script=isset($_POST['S'])?$_POST['S']:"";
//$room=isset($_COOKIE['R'])?$_COOKIE['R']:"";
$classid=isset($_COOKIE['CLASSID'])?intval($_COOKIE['CLASSID']):0;

if(strlen($script)==32 && $classid)
{
   echo file_get_contents("../data/scripts/".$classid."/".$script);
}