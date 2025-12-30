<?php
   set_time_limit(5);

/********************
   1.UDP广播，发送搜索控制器的指令
   2.控制器收到广播后，会回应数据包
********************/
   $ip = "255.255.255.255";
   $port = 60000;

   //短报文指令数据模板
   $arrData=Array(0x17, 0x94, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
                  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00);

   //拼接UDP广播数据
   $strCMD="";
   for($i=0;$i<64;$i++)							//将64字符长的指令由数组转为字符串
   {
      $strCMD.=chr($arrData[$i]);				
   }

   //发送UDP广播
   $sock = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
   socket_set_option($sock, SOL_SOCKET, SO_BROADCAST, 1);
   socket_set_option($sock, SOL_SOCKET, SO_RCVTIMEO, array("sec"=>4, "usec"=>0)); //2秒应该足够了，当前3块控制板够用
   socket_sendto($sock, $strCMD, strlen($strCMD), 0, $ip, $port);

   //接收返回数据
   $arrControllers=Array();
   while(true) {
      $buf=Array();
      $ret = @socket_recvfrom($sock, $arrData,1024, 0, $ip, $port);
      if($ret==0 || $ret!=64) break;					//读不到了，就退出

      $arrController=Array();
      
      $arrController['CSN']    		= ord($arrData[4]) +  (ord($arrData[5]) <<8)+(ord($arrData[6])<<16) +(ord($arrData[7]) <<24);
      $arrController['CIP']     	= ord($arrData[8]).".".ord($arrData[9]).".".ord($arrData[10]).".".ord($arrData[11]);
      $arrControllers["CONTROLLERS"][]	= $arrController;
   }
   socket_close($sock);
   echo json_encode( $arrControllers);					//输出结果
