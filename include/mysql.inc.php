<?php

Class CMySQL{

   var $mysql;

   function __construct($dbserver,$dbuser,$dbpsd,$dbname)

   {

      //$this->mysql = new PDO("mysql:host=localhost;dbname=$dbname;port=3306", $dbuser, $dbpsd);
      $this->mysql = mysqli_connect ($dbserver, $dbuser, $dbpsd);


//echo mysqli_error();

      //$this->mysql->exec('set names utf8');
      $result = mysqli_select_db($this->mysql,$dbname);
 
     //mysqli_set_charset( $this->mysql,'UTF8'); //mysql_query("set names utf-8");


//var_dump($this->mysql);
   }

   function DoQuery($SQL)

   {

      if($this->mysql!=FALSE)
 
     {

//var_dump($this->mysql);
//exit;
         $result = mysqli_query($this->mysql,$SQL) or die("Sorry,register failed : " .  mysqli_error($this->mysql));

         $data=Array();

         while ($line = mysqli_fetch_array( $result,MYSQLI_ASSOC))

         {

            $data[]=$line;

         }

         //print_r($data);
         return $data;

      }

      else { return NULL ;}

   }


   function DoQueryNoReturn($SQL)

   {

      if($this->mysql!=FALSE)
 
     {

         //echo $SQL;
         $result = mysqli_query($this->mysql,$SQL) or die("Sorry,register failed : " .  mysqli_error($this->mysql));

         //var_dump($result);
      }

   }



   function GetErrorNo()

   {

      return $this->errorno;

   }

   function GetErrorString()

   {

      return mysqli_error();

   }

   function GetLastId()

   {

      if($this->mysql!=FALSE)

      {

         return mysqli_insert_id($this->mysql);

      }

   }

   function GetAffectedId()

   {

      if($this->mysql!=FALSE)

      {

         return mysqli_affected_rows($this->mysql);

      }

   }


   function Close()

   {

      mysqli_close($this->mysql);

   }

}

?>