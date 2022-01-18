<?php
error_reporting(0);

include("../include/config.inc.php");
$PROJNAME=isset($_POST['prjname'])?validateFilename($_POST['prjname']):"";
$CLID=isset($_POST['cid'])?intval($_POST['cid']):"";

$FNAME=isset($_POST['fname'])?$_POST['fname']:"";
$REFIMG=isset($_POST['REFNAME'])?validateFilename($_POST['REFNAME']):"";

if($REFIMG!="")
{
   setCookie("REFNAME",$REFIMG,time()+3600*12,$site_path);
   exit();
}


if($FNAME!="")
{
   setCookie("IMGFNAME",$FNAME,time()+3600*12,$site_path);
   exit();
}


if($PROJNAME!="")
{
   setCookie("NEWPROJNAME",$PROJNAME,time()+3600*12,$site_path);
   exit();
}

if($CLID!="")
{
   setCookie("CLASSID",$CLID,time()+3600*12,$site_path);
   exit();
}