<?php
echo json_encode(Array(
time().time().rand(1,255)=>Array("CHIPID"=>time().time(),"IP"=>"192.168.1.2","STATUS"=>1),
time()=>Array("CHIPID"=>time(),"IP"=>"192.168.1.3","STATUS"=>0),
"444ss44"=>Array("CHIPID"=>"4444ff4","IP"=>"192.168.1.3","STATUS"=>0),
"332333"=>Array("CHIPID"=>"33ss333","IP"=>"192.168.1.4","STATUS"=>0)
)
);
exit;

set_time_limit(10);
$Device=isset($_GET['D'])?$_GET['D']:"";
$Status=isset($_GET['S'])?$_GET['S']:"";
$IP=isset($_GET['IP'])?$_GET['IP']:"";
//$Status=($Status=="开")?"1":"0";
//$server=getenv('REMOTE_ADDR', true) ?: getenv('REMOTE_ADDR');
if($Device=="" && $IP=="")
{

/********************
   1.UDP广播，发送搜索控制器的指令
   2.控制器收到广播后，会回应数据包
********************/
   //消息结束符号
   $msg_eof = "\n";
   $portR = 65530;

   $sockR = @socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
   if(!$sockR) exit('{"ERROR":"端口已被占用。"}');
   socket_set_option($sockR, SOL_SOCKET, SO_RCVTIMEO, array("sec"=>1, "usec"=>0)); //接收64字节，1秒应该足够了
   $ok = @socket_bind( $sockR, "192.168.1.99", $portR);
   if(!$ok) exit('{"ERROR":"开启监听服务失败。"}');
   $n=0;

   $ip = "255.255.255.255";
   $portT = 65531;

   $strCMD="ISANYBODYHOME";

   //发送UDP广播
   $sockT = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
   socket_set_option($sockT, SOL_SOCKET, SO_BROADCAST, 1);
   //socket_set_option($sockT, SOL_SOCKET, SO_RCVTIMEO, array("sec"=>1, "usec"=>0)); //2秒应该足够了，当前3块控制板够用
   socket_sendto($sockT, $strCMD, strlen($strCMD), 0, $ip, $portT);
   socket_close($sockT);


   while($n++<1) {
      if( @socket_recvfrom($sockR, $arrData, 64, 0, $ip, $port))
      {
         $arr=explode("\n",$arrData);
         if(count($arr)==3)
            $device[$arr[0]]=Array("CHIPID"=>$arr[0],"IP"=>$arr[1],"STATUS"=>$arr[2]) ;
      }
   }
   echo json_encode( $device );
   exit;
}
else
{

      $strCMD=$Device."C".$Status;
//echo $strCMD;
      $fp = @fsockopen("tcp://".$IP,65529, $errno, $errstr,2);	//连接失败的异常情况不处理，尝试连接只等2秒。
      if($fp)
      {
         fwrite($fp,$strCMD);     							//发送命令
         //$data=NULL;
         //if($bNeedReturn)								//修改IP操作没有返回值
         //{
         //   stream_set_timeout($fp, 2);							//读取超时为2秒
         //   $data= @fread($fp, 128);							//正常数据应该是64字节长度
         //}
         fclose($fp);

         //if($bNeedReturn)								//修改IP操作没有返回值
         //{
         //   if(strlen($data)==64)
         //   {
         //      return $this->parseResult($data);					//返回结果
         //   }
         //}
         //else echo '{"RESULT":{"STATUS":1}}';						//部分指令没有返回值，比如设置控制器的网络配置。
      }
      //else echo '{"ERROR":{"MSG":"访问控制器操作失败，请稍后重试。"}}';			//SOCKET打开失败，说明设备的网络异常。
}
?>