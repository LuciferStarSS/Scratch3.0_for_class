<?php
$pergroup=isset($_POST['pg'])?$_POST['pg']:"";			//ÿ������
$pos=isset($_POST['pos'])?$_POST['pos']:"";			//��ǩ��������
//$room=isset($_COOKIE['R'])?$_COOKIE['R']:0;
$classid=isset($_COOKIE['CLASSID'])?$_COOKIE['CLASSID']:0;	//�༶

include "../include/config.inc.php";

$ip=$_SERVER['REMOTE_ADDR'];					//������IP
if($ip=="::1") $ip="127.0.0.1";

if(isset($teacher_room[$ip]))					//���޽�ʦ���ʣ���ֹ����Ȩ���ʵ������ݶ�ʧ��
{
   $room=$teacher_room[$ip][1];					//����

   file_put_contents("../data/config/$classid/".$classid."_".$pergroup.".pos.dat",$pos);
}
?>