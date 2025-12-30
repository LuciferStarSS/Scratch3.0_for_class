<?php
$script=isset($_POST['S'])?$_POST['S']:"";
$room=isset($_COOKIE['R'])?$_COOKIE['R']:"";

//if(strlen($script)==32 && $room)
//{
   echo file_get_contents("../../data/scripts/".$room."/".$script);
//}