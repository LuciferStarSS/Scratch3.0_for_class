<?php
   set_time_limit(2);
   error_reporting(E_ALL);

   $d=isset($_POST["D"])?$_POST["D"]:"";	//积木
   $v=isset($_POST["V"])?$_POST["V"]:"";	//变量
   $c=isset($_POST["C"])?$_POST["C"]:"";	//注释

   include "s2c.class.php";
   $scratch= new Scratch3ToC($d,$v,$c);
   $scratch->compileSB3();
   $scratch->dumpCodeInC();

   //$j=json_decode( $d );					//调试用
   //file_put_contents("in_json2c.txt",print_r($j,true));	//调试用

?>