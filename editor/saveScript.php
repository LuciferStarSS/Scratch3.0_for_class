<?php
$script=isset($_POST['S'])?$_POST['S']:"";				//�ű�����
$ID=isset($_POST['ID'])?$_POST['ID']:"";				//�ýű���һ�α�����ļ���
//$room=isset($_COOKIE['R'])?$_COOKIE['R']:0;				//����
$classid=isset($_COOKIE['CLASSID'])?intval($_COOKIE['CLASSID']):0;

if($script && $classid)
{
   if(strlen($ID)==32) $fid=$ID;
   else $fid=md5($script);
   file_put_contents("../data/scripts/".$classid."/".$fid,$script);
   echo $fid;								//���ص�ǰ������ļ���
}