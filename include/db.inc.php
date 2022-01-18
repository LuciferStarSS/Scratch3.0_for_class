<?php
error_reporting(0);

$login=0;

include "mysql.inc.php";
$m=new CMySQL($dbserver,$dbuser,$dbpsd,$dbname);

function filter($data)
{
   return $data;//mysql_real_escape_string($data);
}

function checkArg($data,$type)
{
   switch($type)
   {
      case "i": return (int)$data;
      case "c": return filter($data);
      default: return "";
   }
}

?>
