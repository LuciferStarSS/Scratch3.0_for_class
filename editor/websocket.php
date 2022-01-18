<?php
error_reporting(E_ALL);
set_time_limit(0);// 设置超时时间为无限,防止超时
date_default_timezone_set('Asia/shanghai');

class WebSocket {
    const LOG_PATH = './tmp/';		//日志文件存放路径
    const LISTEN_SOCKET_NUM = 900;	//最大监听数量

    /**
     * @var array $sockets
     *    (
     *      (int)$socket => Array(
     *			           'resource' => nSocketId,
     *       			   'uname' => strUsername,
     *         			   'handshake' => boolStatus,
     *         			   'ip' => strIP,
     *         			   'port' => nPort
     *                           )
     *    )
     *    socket与file号对应
     */
    private $sockets = Array();		//所有的socket客户端
    private $master;
    private $clientSocket = NULL;
    private $Stage = NULL;		//用于保存投屏应用中舞台的socket。

    private $lastBCMsg = '';		//最后一条广播的问卷的内容
    private $lastID = '';		//最后一条广播的问卷的内容的MD5值
    private $TNAME = '';		//当前教室的教师
    private $statusReceived=Array();    //广播已接收人员列表
					//当某人断线后，漏掉的广播就丢失了。
					//开始广播前，清空$statusReceived
					//每发送成功一个人，将该用户的名字放入$statusReceived中
					//当用户连接时，检测$statusReceived中是否存在记录
					//如无，针对该用户，重发上一条广播信息。
/*
lastBCMsg保存上一条试题
lastID是上一条试题的MD5值
客户端通过cookie['lastID']保存答题状态
statusReceived[uname.lastID]=1表示已成功推送

logout会删除此条记录
login时如果客户端cookie['lastID']不为空，则直接插入记录
statusReceived[uname.lastID]=1表示已成功推送，不再推送该条数据


未答题状态，刷新页面，重新投送试题；
已答题状态，刷新页面，不显示试题。
*/


    /**
     * @var array $sockets
     *    (
     *      (String)$username =>  (int)$socket
     *    )
     *  用户名与socket对应
     */
    private $User2Socket = Array();//保存用户名与socket之间的对应关系。用于用户到用户的通信。

    public function __construct($host, $port, $tname) {
        $this->TNAME=$tname;							//当前教室的教师名称
        try {        								//创建主Socket服务
            $this->master = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);    	// 设置IP和端口重用,在重启服务器后能重新使用此端口;
            socket_set_option($this->master, SOL_SOCKET, SO_REUSEADDR, 1);   	// 将IP和端口绑定在服务器socket上;
            socket_bind($this->master, $host, $port);			     	// listen函数使用主动连接套接口变为被连接套接口，使得一个进程可以接受其它进程的请求，从而成为一个服务器进程。
									     	// 在TCP服务器编程中listen函数把进程变为一个服务器，并指定相应的套接字变为被动连接,其中的能存储的请求不明的socket数目。
            socket_listen($this->master, self::LISTEN_SOCKET_NUM);
        } catch (Exception $e) {						//异常处理
            $err_code = socket_last_error();
            $err_msg  = socket_strerror($err_code);

            $this->error(Array( 'error_init_server', $err_code,	$err_msg));
            exit();								//异常就退出，以便重启服务。
        }

        $this->sockets[0] = Array('resource' => $this->master);			//主线程索引为0
        $pid = getmypid();

        //$this->debug(Array("server: {$this->master} started,pid: {$pid}"));   //调试信息
        //主Socket服务开启完毕

        while (true) {        							//开始监听服务
            try {
                $this->doServer();						//服务端监听
            }catch (Exception $e) {
                $this->error(Array( 'error_do_server', $e->getCode(), $e->getMessage() ));
                exit();								//异常就退出。服务可由客户端主动开启。
            }
        }
    }

    private function doServer() {						//服务端监听
        $write = $except = NULL;
        $sockets = array_column($this->sockets, 'resource');			//获取sockets中所有的resouce字段数据
        //socket池中所有socket句柄
        $read_num = socket_select($sockets, $write, $except, NULL);		//select作为监视函数,参数分别是(监视可读,可写,异常,超时时间),返回可操作数目,出错时返回false;
	//发生变化的socket句柄。							//seconds=NULL，表示无限期地等待。seconds=0，则立刻返回。
        if (false === $read_num) {						//如果没有Socket发生状态变化，则输出出错信息。
            $this->error(Array( 'error_select',  $err_code = socket_last_error(), socket_strerror($err_code)));
            return;								//当前职守结束，进入下一轮。
        }

        foreach ($sockets as $socket) {						//如有Socket的状态发生了变化，则处理
            if ($socket == $this->master) {					//  主进程的状态发生了变化，则表示当前有新的接入请求出现
                $client = socket_accept($this->master);				//     创建,绑定,监听后accept函数将会接受socket要来的连接,一旦有一个连接成功,将会返回一个新的socket资源用以交互,
										//     如果是一个多个连接的队列,只会处理第一个,如果没有连接的话,进程将会被阻塞,直到连接上.如果用
										//     set_socket_blocking或socket_set_noblock()设置了阻塞,会返回false;返回资源后,将会持续等待连接。
                if (false === $client) {					//     接收失败，输出错误信息
                    $this->error(Array( 'err_accept', $err_code = socket_last_error(), socket_strerror($err_code)));
                    continue;
                } else {							//     接收成功，创建与客户端的连接
                    self::connect($client);
                    continue;
                }
            } else {								//如果发生状态变化的是其他已连接的socket,则开始接收数据

                $bytes = @socket_recv($socket, $buffer, 40960, 0);		//40K数据量应该够了。while的方式不能用。
                if ($bytes < 9) {						//数据量太少，遗弃，并终止连接。
                    $recv_msg = $this->disconnect($socket);
                } else {
                    if (!$this->sockets[(int)$socket]['handshake']) {		//如该连接未曾握过手，则对接收到的数据执行握手操作
                        self::handShake($socket, $buffer);
                        continue;
                    } else {
                        $recv_msg = self::parse($buffer);			//否则把数据作为通信数据进行解析
                    }
                }

                //var_dump( $recv_msg)."\r\n\r\n";

                $msg = self::dealMsg($socket, $recv_msg);			//处理接收到的数据（登录、退出或正常通信）

                //var_dump( $msg)."\r\n\r\n";
                if(strpos($msg[0],"NP")>0)					{ socket_write($this->Stage, $msg[0], strlen($msg[0]));}			//投屏数据，只发送给用户名“Stage”。
                //else if(strpos($msg[0],"QUIZKEY_")>0)				{ if(isset($this->User2Socket[$this->TNAME])) socket_write($this->User2Socket[$this->TNAME], $msg[0], strlen($msg[0]));}	//学生提交了答案，则该条信息只发给老师。
                else if($msg[1]!="" && isset($this->User2Socket[$msg[1]])) 	{ socket_write($this->User2Socket[$msg[1]], $msg[0], strlen($msg[0]));}		//特定数据，发送给指定用户
                else $this->broadcast($msg[0],$msg[2]);						 								//否则广播
            }
        }
    }


    /**
     * 广播消息
     *
     * @param $data
     */
    private function broadcast($data,$TYPE) {
       //主动推送广播
       //当接入客户端数量达到一定值后，效率会很低。
       //echo "prebroadcasting\r\n";
       if( $TYPE==1 && strpos($data,"QUIZ")>0 )					//速问速答才保存
       {
          //echo "SAVELASTMSG\r\n";
	  $this->lastBCMsg = $data;							//保存最后一条广播信息
          $this->statusReceived= NULL;
       }

       //echo "broadcasting\r\n";
       foreach ($this->sockets as $key=>$socket) {				//遍历所有Socket连接
          if ($key>0){//$socket['resource'] != $this->master) {		//排除master主Socket

             //echo $socket['uname']."\r\n\r\n".time();
             $err=socket_write($socket['resource'], $data, strlen($data));
             if($err==0)
             {
                unset($this->statusReceived[$socket['uname'].$this->lastID]);	//客户端异常/不存在，则删除用户名映射
                unset($this->sockets[$key]);					//删除Socket池
             }
             else if($TYPE==1)
             {
                $this->statusReceived[$socket['uname'].$this->lastID]=1;
             }
          }
       }
    }


    /**
     * 拼装信息
     *
     * @param $socket
     * @param $recv_msg					//{'type':'','content':'','to':''}
     *          [
     *          'type'=>user/login/logout
     *          'content'=>content
                'to' => RECEIVER
     *          ]
     *
     * @return string
     */
    private function dealMsg($socket, $recv_msg) {	//处理接收到的数据，并按需广播
        $msg_type = $recv_msg['type'];				//接收到的数据的类型。login:登录；logout:登出；user:用户通信。
        $msg_content = $recv_msg['content'];			//数据内容。当type为login或logout时，content为客户端用户名。
        $msg_to = isset($recv_msg['to'])?$recv_msg['to']:'';	//指定接收者。为空，表示群发。
        $msg_id = isset($recv_msg['lastID'])?$recv_msg['lastID']:'';
        $response = Array();
        $BCType=0;
        switch ($msg_type) {
            case 'login':						//客户端用户名通过'content'发送用户名到服务器
                $this->sockets[(int)$socket]['uname'] = $msg_content;   //登录成功，更新当前socket句柄所对应的用户名

//print_r($recv_msg);
//print_r($this->statusReceived);
//echo "msg:".$this->statusReceived[$msg_content.$msg_id]."\r\n";

/*
客户端过来的msg_id为空：投送
客户端过来的msg_id与当前lastID不一致：投送
statusReceived[uname.msg_id]不存在：投送

*/
//echo "MID:".$msg_id."\r\n";
//echo "LID:".$this->lastID."\r\n";
//echo "STS:".$this->statusReceived[$msg_content.$msg_id]."\r\n";
//echo "LST:".$this->lastBCMsg."\n\n\n";

                if($this->lastBCMsg!="" && ($msg_id=='' || $msg_id!=$this->lastID || !isset($this->statusReceived[$msg_content.$msg_id])) )
                {
                   //echo "REPLAY\n\n\n";
                   $err=socket_write($socket, $this->lastBCMsg, strlen($this->lastBCMsg));
                   if($err>0) $this->statusReceived[$socket['uname'].$msg_id] = 1;
                   //else  $this->statusReceived[$socket['uname'].$msg_id]=0;
                }

                //print_r($this->statusReceived);

                if($msg_content=="Stage") $this->Stage=$socket;		//如果当前用户是舞台，则单独保存socket句柄。用于赛车游戏里的同台竞技。

                $this->User2Socket[$msg_content]=$socket;		//用户名与Socket句柄对应。

                $user_list = array_column($this->sockets, 'uname');	//获取当前用户列表
                $response['type'] = 'login';				
                $response['content'] = $msg_content;
                $response['user_list'] = $user_list;			//准备广播用户列表的数据
                break;
            case 'logout':						
                $user_list = array_column($this->sockets, 'uname');	//获取当前用户列表

                if(count($user_list)==0) exit();			//当所有用户都退出时，服务关闭。

                if($msg_content=="Stage") $this->Stage=NULL;		//如果是舞台退出，则Stage变量归零

                if(isset($this->statusReceived[$msg_content.$msg_id]))	//关闭页面，则清理答题情况，回收资源
                {
                   unset( $this->statusReceived[$msg_content.$msg_id]);
                }

		//该用户在sockets和User2Socket中的数据，已经在disconnect()中被删除了，所以不需要再次操作。

                $response['type'] = 'logout';
                $response['content'] = $msg_content;
                $response['user_list'] = $user_list;
                //$response['lastID'] = md5($msg_content);

                break;
            case 'user':						//正常用户通信。

                $BCType=1;
                //print_r($recv_msg);
                //echo "[[".$msg_id."]]\n";
                $uname = $this->sockets[(int)$socket]['uname'];
                $response['type'] = 'user';				//数据类型：用户通信
                $response['from'] = $uname;				//发送者
                $response['content'] = $msg_content;			//发送内容
                $response['to'] = $msg_to;				//指定接收者。
                $response['lastID'] = md5($msg_content);
                if($uname==$this->TNAME)				//判断是否是教师发送的指令。
                {
                   if( strpos($msg_content,"QUIZ")>0)			//如果是广播消息，则保留最后一条，已备晚登录或页面刷新的人重新接收上一道题目。
                   {
                      $this->lastID    =  $response['lastID'];
                   }
                   else if(strpos($msg_content,"REBOOT")>0)		//当通道出现阻塞时，远程控制服务退出。在下一次请求时，会自动启动此服务。
                   {
                      exit(0);
                   }
                }
                break;
        }

        return Array($this->build(json_encode($response)),$msg_to,$BCType);	//将返回数据打包。
    }


    /**
     * 将socket添加到已连接列表
     *
     * @param $socket
     */
    public function connect($socket) {
        socket_getpeername($socket, $ip, $port);//获取socket连接的IP和端口数据
        $socket_info = Array(
            'resource'  => $socket,	//保存socket文件句柄
            'ip' 	=> $ip,		//记录客户端IP
            'port' 	=> $port,	//记录客户端端口
            'uname' 	=> '',		//初次连接，没有用户名信息，这个信息需要在dealMsg（）里获取。
            'handshake' => false	//置握手状态为否
        );

        $this->sockets[(int)$socket] = $socket_info;				//将Socket的配置信息与Socket文件句柄关联起来，保存到$this->sockets中。
        //$this->debug(array_merge(Array('socket_connect'), $socket_info));	//输出调试信息
    }

    /**
     * 客户端网页关闭，或者发送的数据少于9字节，则主动关闭该连接
     *
     * @param $socket
     *
     * @return array
     */
    private function disconnect($socket) {
        $recv_msg = Array(
            'type' => 'logout',
            'content' => isset($this->sockets[(int)$socket]['uname'])?$this->sockets[(int)$socket]['uname']:"",
        );
        unset($this->User2Socket[$recv_msg['content']]);			//删除从用户名到socket句柄的映射关系。
        unset($this->sockets[(int)$socket]);					//从sockets池中删除该socket句柄。
        socket_close($socket);							//关闭该socket连接
        return $recv_msg;							//返回用户退出消息：type=>'logout',content=>USERNAME。该数据需要广播到其它用户页面，用于更新用户列表。
    }

    /**
     * 用公共握手算法握手
     *
     * @param $socket
     * @param $buffer
     *
     * @return bool
     */
    public function handShake($socket, $buffer) {
        // 获取到客户端的升级密匙
        $line_with_key = substr($buffer, strpos($buffer, 'Sec-WebSocket-Key:') + 18);
        $key = trim(substr($line_with_key, 0, strpos($line_with_key, "\r\n")));

        // 生成升级密匙,并拼接websocket升级头
        $upgrade_key = base64_encode(sha1($key . "258EAFA5-E914-47DA-95CA-C5AB0DC85B11", true));// 升级key的算法
        $upgrade_message = "HTTP/1.1 101 Switching Protocols\r\n";
        $upgrade_message .= "Upgrade: websocket\r\n";
        $upgrade_message .= "Sec-WebSocket-Version: 13\r\n";
        $upgrade_message .= "Connection: Upgrade\r\n";
        $upgrade_message .= "Sec-WebSocket-Accept:" . $upgrade_key . "\r\n\r\n";

        socket_write($socket, $upgrade_message, strlen($upgrade_message));	//向socket发送握手升级信息
        $this->sockets[(int)$socket]['handshake'] = true;			//更新握手状态

        socket_getpeername($socket, $ip, $port);
        //$this->debug(Array('hand_shake', $socket, $ip,$port ));

        // 向客户端发送握手成功消息,以触发客户端发送用户名动作;
        $msg = Array(						//{'type':'handshake','content':'done'}
            'type' => 'handshake',
            'content' => 'done',
        );
        $msg = $this->build(json_encode($msg));			//组装握手结束的数据
        //echo "MSG:\r\n"."\r\n";
        //echo $msg."\r\n";
        //echo strlen($msg)."\r\n";

        socket_write($socket, $msg, strlen($msg));		//发送握手结束的数据
        return true;
    }

    /**
     * 解析数据
     *
     * @param $buffer
     *
     * @return bool|string
     */
    private function parse($buffer) {
        $decoded = '';
        $len = ord($buffer[1]) & 127;
        if ($len === 126) {
            $masks = substr($buffer, 4, 4);
            $data = substr($buffer, 8);
        } else if ($len === 127) {
            $masks = substr($buffer, 10, 4);
            $data = substr($buffer, 14);
        } else {
            $masks = substr($buffer, 2, 4);
            $data = substr($buffer, 6);
        }
        for ($index = 0; $index < strlen($data); $index++) {
            $decoded .= $data[$index] ^ $masks[$index % 4];
        }

        return json_decode($decoded, true);
    }



    /**
     * 将普通信息组装成websocket数据帧
     *
     * @param $msg
     *
     * @return string
     */

    private function build($msg) {
        $frame = Array();	//数组中数据都是二进制转成十六进制文本的，所以一字节占两字符。末尾的pack将把字符转成二进制。
        $frame[0] = '81';	//FIN+RSV+OPCODE(1000 0001)  %x1表示文本帧
        $len = strlen($msg);

	/*
	WebSocket数据格式：

         7 6 5 4 3 2 1 0 7 6 5 4 3 2 1 0 7 6 5 4 3 2 1 0 7 6 5 4 3 2 1 0 
	+-+-+-+-+-------+-+-------------+------------------------------+
	|F|R|R|R| opcode|M| payload len |   Extended payload length    |
	|I|S|S|S|  (4)  |A|    (7)      |        (16/64)               |
	|N|V|V|V|       |S|             |   (if payload len==126/127)  |
	| |1|2|3|       |K|             |                              |
	+-+-+-+-+-------+-+-------------+------------------------------+
	|    Extended payload length continued, if payload len ==127   |
	+-------------------------------+------------------------------+
	|                               | Masking-key,if MASK set to 1 |
	+-------------------------------+------------------------------+
	|    Masking-key (continued)    |        Payload Data          |
	+-------------------------------+------------------------------+
	:                   Payload Data continued ...                 :
	+--------------------------------------------------------------+
	|                   Payload Data continued ...                 |
	+--------------------------------------------------------------+	
	*/
        if ($len < 126) {		//2^7-1					//数据长度[0,126)字节
            $frame[1] = $len < 16 ? '0' . dechex($len) : dechex($len);		//长度数据占1字节
        } else if ($len < 65535) {	//2^16-1				//数据长度[126,65535)字节
            $s = dechex($len);
            $frame[1] = '7e' . str_repeat('0', 4 - strlen($s)) . $s;		//长度数据占2字节，标识位为0x7E
        } else {			//2^64-1				//数据长度[65535,)字节
            $s = dechex($len);
            $frame[1] = '7f' . str_repeat('0', 16 - strlen($s)) . $s;		//长度数据占8字节，标识位为0x7F
        }

        $data = '';
        $l = strlen($msg);
        for ($i = 0; $i < $l; $i++) {
            $data .= dechex(ord($msg{$i}));
        }
        $frame[2] = $data;							//Payload Data

        $data = implode('', $frame);

        return pack("H*", $data);						//打包成16进制字符
    }


    /**
     * 记录debug信息
     *
     * @param array $info
     */
    private function debug(array $info) {
        $time = date('Y-m-d H:i:s');
        array_unshift($info, $time);

        $info = array_map('json_encode', $info);
        file_put_contents(self::LOG_PATH . 'websocket_debug.log', implode(' | ', $info) . "\r\n", FILE_APPEND);	//追加日志
    }

    /**
     * 记录错误信息
     *
     * @param array $info
     */
    private function error(array $info) {
        $time = date('Y-m-d H:i:s');
        array_unshift($info, $time);

        $info = array_map('json_encode', $info);
        file_put_contents(self::LOG_PATH . 'websocket_error.log', implode(' | ', $info) . "\r\n", FILE_APPEND);	//追加日志
    }
}

include("../include/config.inc.php");

$room = isset($_COOKIE['R'])?$_COOKIE['R']:0;	//教室
$role = isset($_GET['r'])?$_GET['r']:"";		//竞技服务
$port = 8080+$room;

if($role=="play") $port+=10;
echo $port;
echo $WSSERVER;


$TNAME=$teacher_name[$room];
echo $TNAME;
$ws = new WebSocket($WSSERVER, $port, $TNAME);