<?php
$member=isset($_POST['member'])?$_POST['member']:"";		//���ڳ�Ա��Ϣ
$group=isset($_POST['group'])?$_POST['group']:"";		//��Ա��������Ϣ
$classid=isset($_COOKIE['CLASSID'])?$_COOKIE['CLASSID']:0;	//�༶

include "../include/config.inc.php";

$ip=$_SERVER['REMOTE_ADDR'];					//������IP
if($ip=="::1") $ip="127.0.0.1";

if(isset($teacher_room[$ip]) && $classid>0)			//���޽�ʦ���ʣ���ֹ����Ȩ���ʵ������ݶ�ʧ��
{
   //$room=$teacher_room[$ip][1];					//����

   file_put_contents("../data/config/".$classid."/".$classid.".member.dat",$member);
   file_put_contents("../data/config/".$classid."/".$classid.".group.dat",$group);
}
?>