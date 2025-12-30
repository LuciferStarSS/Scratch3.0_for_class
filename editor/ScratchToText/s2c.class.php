<?php
//set_time_limit(3);

/**********************************************************************

   一个重要更新：
       自制积木有在运行时是否刷新的设置，
       在代码中，以最后一个参数是否为true做标记。

       如果最后一个参数为true，表示运行时不刷新；
       否则默认为刷新。


    添加对注释的支持

**********************************************************************/

/**********************************************************************

TODO:
造型编号需要调整。


1.加载json数据
2.获取所有积木块ID
3.获取所有头部积木块（HATs，此类积木块为每组代码的起始位置）
4.从头部积木块开始解析，并从所有积木块数组中，将已解析的积木块索引删除；
5.剩余的积木块，即为零散积木块，按照同样的方式进行数据转换。

使用方法：
   include "s2c.class.php";

   $d=file_get_contents("./sprite.json");	//.SB3文件中的project.json里的部分数据
   $scratch= new Scratch3ToC($d);		//初始化
   $scratch->compileSB3();			//转换编译
   $scratch->dumpCodeInC();			//输出结果
   file_put_contents("sc.txt",serialize($scratch->codeInC));	//数组结果写入文件

**********************************************************************/


class Scratch3ToC
{
   private $Blocks;						//原始的Scratch3.0项目脚本的JSON数据，保存了所有积木块的信息
   private $Variables;						//存放所有变量
   private $Comments;						//存放所有注释
   private $codeInC=Array(Array(),Array(),Array(),Array());	//转换后的伪代码，数据按先后顺序，以字符的方式存放于数组中。四个位置分别为：0全局变量，1当前角色变量，2带HATS的代码，3游离的代码。
   private $arrBlockID=NULL;					//积木ID清单：Array( "BLOCKID1"=>0);
   private $nLeftPadding=0;					//代码对齐补空格
   private $currentType=0;					//当前类型，也即：0全局变量，1当前角色变量，2带HATS的代码，3游离的代码。
   private $arrProcedureName=Array();				//改名后的自制积木名称
   private $nLoopCounter=0;					//防止for里的变量名字重复。

   private $hats=Array(						//Hat类型的积木块。头部积木必须在这里注册，否则会不显示。
      "event_whenflagclicked"=>1,				//更新：
      "event_whenkeypressed"=>1,				//    将value改成了key，
      "event_whenthisspriteclicked"=>1,				//    通过isset来检测，
      "event_whenbackdropswitchesto"=>1,			//    以规避in_array的速度风险。
      "event_whengreaterthan"=>1,
      "event_whenbroadcastreceived"=>1,
      "control_start_as_clone"=>1,
      "event_whenstageclicked"=>1,
      "chattingroom_whenChatMessageComes"=>1,
      "videoSensing_whenMotionGreaterThan"=>1,
   );

   //初始化，将传入的字符串转成JSON数据格式
   function __construct($Blocks,$Variables,$Comments)
   {
      $this->Blocks  = json_decode( $Blocks );					//保存所有积木
      $this->Variables  = json_decode( $Variables );				//保存所有变量
      $jsonComments = json_decode( $Comments );

      foreach($jsonComments as $key=>$value)
      {
         $this->Comments[$value->{"blockId"}]=$value->{"text"};
      }
      //var_dump($this->Blocks);
   }

   //检测某opcode是否为hat类型
   function checkHat($opcode)
   {
      return isset($this->hats[$opcode]);					//更新：将in_array改成了isset
   }

   //获取积木的注释数据
   function getComments($BlockID)
   {
      echo "GETCOMMENTS:".$BlockID."\n";
      var_dump($this->Comments[$BlockID]);

      return isset($this->Comments[$BlockID])? "/* ".$this->Comments[$BlockID]." */":"";
   }
   //填充缩进的空格字符
   function padding()
   {
      return str_pad("",$this->nLeftPadding*3," ",STR_PAD_LEFT);               //缩进3字符
   }

   //将积木代码转成伪代码
   //转换的数据被依次保存在数组$codeInC中。
   function convertCode($oBlock,$bArg=false)		//bArg true:当前为自制积木的参数形式，需要加VAR或BOOL
   {
      if(isset($oBlock->{"block"}))	//传入的可能是Block而非ID		//block与shadow不一致，取shadow；如果一致，或shadow为NULL，取block
      {
         $BlockID=$oBlock->{"block"};
         //if($oBlock->{"shadow"}!=null && $oBlock->{"block"}!=$oBlock->{"shadow"})//如果存在非null的shadow，且shadow不等于block，则删除shadow数据。
         //{
         //   unset($this->Blocks->{$oBlock->{"shadow"}});
         //}
         if($BlockID==NULL) return -1;
      }
      else $BlockID=$oBlock;

      if(isset($BlockID->{"name"})) //传入的是一个json数据，而不是UID，这个是一个异常数据。
      {
         /***********************************************
            遇到这么一例奇怪的数据。
            按照正常操作，当“且”的两个参数都去掉后，inputs里应该为空，但这份数据里，OPERAND1和OPERAND2都有，只是block和shadow指向了null。

            {
                "opcode": "operator_and",
                "next": null,
                "parent": null,
                "inputs": {
                    "OPERAND1": {
                        "name": "OPERAND1",
                        "block": null,
                        "shadow": null
                    },
                    "OPERAND2": {
                        "name": "OPERAND2",
                        "block": null,
                        "shadow": null
                    }
                },
                "fields": {},
                "shadow": false,
                "topLevel": true,
                "x": 1827,
                "y": 549,
                "id": "@p5iW6^]LPnDyX%EZy9R"
            }
         ***********************************************/
         return -1;
      }

      $Block=isset($this->Blocks->{$BlockID})?$this->Blocks->{$BlockID}:NULL; 	//此处可能会出现不存在现象，需要研究是否跟新添变量有关。

      if($Block==NULL) return -1;							//ID所对应的数据不存在

print_r($Block);

      /**************************************************************
         遇到一例，无ID。
         从.SB3文件中读取project.json，其中数据不含ID。ID只在KEY中出现，且inputs和fields中的参数，没有key。
         stdClass Object
         (
             [opcode] => event_whenbroadcastreceived
             [next] => !_bqSF^@R.UJV09/IS8A
             [parent] => 
             [inputs] => stdClass Object
                 (
                 )

             [fields] => stdClass Object
                 (
                     [BROADCAST_OPTION] => Array
                         (
                             [0] => nextlevel
                             [1] => broadcastMsgId-nextlevel
                         )

                 )

             [shadow] => 
             [topLevel] => 1
             [x] => 26
             [y] => 330
         )

         得做一个专门的版本了。

      **************************************************************/

      if(isset($this->arrBlockID[$Block->{"id"}]))
         unset($this->arrBlockID[$Block->{"id"}]);				//对于存在的积木，需从清单中清除，并执行后续的转换操作；
      else return -1;								//对于不存在的积木，则直接返回。
      //var_dump($Block);//->{"opcode"});

      switch($Block->{"opcode"}) //根据opcode来确认应如何转换
      {

         /**************************ARGUMENT 参数**************************/
         case "text":								//大于小于等于中的普通文本参数
            if(isset($Block->{"parent"}) && $Block->{"parent"}!=NULL)//运算积木原本就带数字的，一旦被其它积木代替，就不起作用了。这类数字，它的parent为NULL。下同。
              $this->codeInC[$this->currentType][]= is_numeric($Block->{"fields"}->{"TEXT"}->{"value"})? $Block->{"fields"}->{"TEXT"}->{"value"}:('"'.trim($Block->{"fields"}->{"TEXT"}->{"value"},'"').'"');
            break;//'"'.trim($Block->{"fields"}->{"TEXT"}->{"value"},'"').'"'; //

         case "math_number":							//加减乘除中的普通数字参数
            if($Block->{"parent"}!=NULL)
               $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"NUM"}->{"value"};
            break;

         case "math_angle":							//旋转角度的普通数字参数
            if($Block->{"parent"}!=NULL)
               $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"NUM"}->{"value"};
            break;

         case "math_integer":							//前移1层
            if($Block->{"parent"}!=NULL)
               $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"NUM"}->{"value"};
            break;

         case "math_whole_number":						//整数。重复执行n次里的数据
            if($Block->{"parent"}!=NULL)
               $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"NUM"}->{"value"};
            break;

         case "math_positive_number":						//正数
            if($Block->{"parent"}!=NULL)
               $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"NUM"}->{"value"};
            break;

         case "argument_reporter_string_number":				//自制积木参数
            if($Block->{"parent"}!=NULL)
               $this->codeInC[$this->currentType][]= ($bArg==true?"VAR ":"").str_replace(' ','',$Block->{"fields"}->{"VALUE"}->{"value"});	//"VAR ".$Block->{"fields"}->{"VALUE"}->{"value"};	//自制积木的字符串和数字类型参数。替换空格
            break;

         case "argument_reporter_boolean":					//自制积木参数
            if($Block->{"parent"}!=NULL)
               $this->codeInC[$this->currentType][]= ($bArg==true?"BOOL ":"").str_replace(' ','',$Block->{"fields"}->{"VALUE"}->{"value"});	//"BOOL ".$Block->{"fields"}->{"VALUE"}->{"value"};	//自制积木的布尔值类型参数。文本标签不算参数。
            break;


         /**************************ARGUMENT 参数**************************/


         /**************************EVENT 事件**************************/

         /**************************HAT 头部事件*************************/

         //把每个事件，都封装成类似于函数重载的方式
         //Scratch中允许同一个角色有多个同名的Event，这个在现有的其它编程语言中是不被允许的，
         //所以，这里转换得到的代码，只能是伪代码，或者另起炉灶，新创一个语言？

         case "event_whenflagclicked":
            $this->codeInC[$this->currentType][]= "//当绿旗被点击\n";
            $this->codeInC[$this->currentType][]= $Block->{"opcode"}."(){".$this->getComments($Block->{"id"})."\n";
            $this->nLeftPadding++;
            break;

         case "event_whenkeypressed":
            $this->codeInC[$this->currentType][]= "//当某键被按下\n".$Block->{"opcode"}."(\"";
            $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"KEY_OPTION"}->{"value"};
            $this->codeInC[$this->currentType][]= "\"){".$this->getComments($Block->{"id"})."\n";
            $this->nLeftPadding++;
            break;

         case "event_whenthisspriteclicked":
            $this->codeInC[$this->currentType][]= "//当角色被点击\n".$Block->{"opcode"}."(){".$this->getComments($Block->{"id"})."\n";
            $this->nLeftPadding++;
            break;

         case "event_whenbroadcastreceived":
            $this->codeInC[$this->currentType][]= "//当接收到广播\n".$Block->{"opcode"}."(\"";
            if(isset($Block->{"fields"}->{"BROADCAST_OPTION"}))
               $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"BROADCAST_OPTION"}->{"value"};
            else
               $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"KEY_OPTION"}->{"value"};

            $this->codeInC[$this->currentType][]= "\"){".$this->getComments($Block->{"id"})."\n";
            $this->nLeftPadding++;
            break;

         case "event_whengreaterthan":
            $this->codeInC[$this->currentType][]= "//当参数大于时\n".$Block->{"opcode"}."( \"";
            $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"WHENGREATERTHANMENU"}->{"value"};
            $this->codeInC[$this->currentType][]="\" , ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"VALUE"});
            $this->codeInC[$this->currentType][]= "){".$this->getComments($Block->{"id"})."\n";
            $this->nLeftPadding++;
            break;

         case "event_whenbackdropswitchesto":
            $this->codeInC[$this->currentType][]= "//当背景换成\n".$Block->{"opcode"}."(\"";

            if(isset($Block->{"fields"}->{"BACKDROP"}))
               $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"BACKDROP"}->{"value"};
            else
               $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"KEY_OPTION"}->{"value"};
            $this->codeInC[$this->currentType][]= "\"){".$this->getComments($Block->{"id"})."\n";
            $this->nLeftPadding++;
            break;

         case "control_start_as_clone":					//这个是控制里的，但它也属于HAT类型
            $this->codeInC[$this->currentType][]= "//当作为克隆体启动时\n".$Block->{"opcode"}."(){".$this->getComments($Block->{"id"})."\n";
            $this->nLeftPadding++;
            break;

         case "chattingroom_whenChatMessageComes":			//这个是自制扩展，被定义为了HAT类型
            $this->codeInC[$this->currentType][]= "//当接收到广播\n".$Block->{"opcode"}."(){".$this->getComments($Block->{"id"})."\n";
            $this->nLeftPadding++;
            break;

         /**************************HAT 头部事件*************************/

         case "event_broadcast":	        				//发送广播
            //if($Block->{"inputs"}->{"BROADCAST_INPUT"}->{"block"}!=$Block->{"inputs"}->{"BROADCAST_INPUT"}->{"shadow"})	//参数中blockID与shadowID不一致，需要删除shadowID的那项
            //{
            //   $shadowID=$Block->{"inputs"}->{"BROADCAST_INPUT"}->{"shadow"};
            //   if(isset($this->arrBlockID[$shadowID]))
            //      unset($this->arrBlockID[$shadowID]);	
            //}

            $this->codeInC[$this->currentType][] = $this->padding().$Block->{"opcode"}."( ";		//广播消息都是字符串，所以直接加双引号。
            //$this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"BROADCAST_INPUT"});

            $strARGNAME="BROADCAST_INPUT";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{"BROADCAST_OPTION"}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }


            $this->codeInC[$this->currentType][] = " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "event_broadcastandwait":						//广播并等待
            $this->codeInC[$this->currentType][] = $this->padding().$Block->{"opcode"}."( ";
            //$this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"BROADCAST_INPUT"});

            $strARGNAME="BROADCAST_INPUT";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{"BROADCAST_OPTION"}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

            $this->codeInC[$this->currentType][] = " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "event_broadcast_menu":						//广播菜单
            //$this->codeInC[$this->currentType][] = trim($Block->{"fields"}->{"BROADCAST_OPTION"}->{"value"});		//广播消息都是字符串
            break;

         /**************************EVENT 事件**************************/

         /**************************MOTION 运动**************************/

         case "motion_movesteps":						//移动n步
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"STEPS"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "motion_direction":						//变量：方向
            $this->codeInC[$this->currentType][]  =" ".$Block->{"opcode"}."()".$this->getComments($Block->{"id"});
            break;

         case "motion_xposition":						//变量：X坐标
            $this->codeInC[$this->currentType][]  =" ".$Block->{"opcode"}."()".$this->getComments($Block->{"id"});
            break;

         case "motion_yposition":						//变量：Y坐标
            $this->codeInC[$this->currentType][]  =" ".$Block->{"opcode"}."()".$this->getComments($Block->{"id"});
            break;

         case "motion_turnright":						//右转n度
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"DEGREES"});
            $this->codeInC[$this->currentType][]= " );\n";
            break;

         case "motion_turnleft":						//左转n度
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"DEGREES"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "motion_gotoxy":							//移到xy
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"X"});
            $this->codeInC[$this->currentType][]= " , ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"Y"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "motion_goto":							//移到预设目标位置
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";

            $strARGNAME="TO";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{$strARGNAME}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "motion_goto_menu":						//移到预设目标位置的选项菜单
            break;

         case "motion_pointindirection":					//移到“随机位置/鼠标指针”
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"DIRECTION"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "motion_pointtowards":						//面向n度方向/面向角色
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";

            $strARGNAME="TOWARDS";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{$strARGNAME}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "motion_pointtowards_menu":					//面向角色方向选项
            break;

         case "motion_changexby":						//将x坐标增加
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"DX"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "motion_changeyby":						//将y坐标增加
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"DY"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "motion_setx":							//将x坐标设为
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"X"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "motion_sety":							//将y坐标设为
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"Y"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "motion_setrotationstyle":					//将旋转方式设为“左右翻转/不可旋转/任意旋转”
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( \"";
            $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"STYLE"}->{"value"};
            $this->codeInC[$this->currentType][]= "\" );".$this->getComments($Block->{"id"})."\n";
            break;

         case "motion_glidesecstoxy":						//n秒内滑行到xy
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"SECS"});
            $this->codeInC[$this->currentType][]= " , ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"X"});
            $this->codeInC[$this->currentType][]= " , ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"Y"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "motion_glideto":							//n秒内滑行到目标
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"SECS"});
            $this->codeInC[$this->currentType][]= " , ";
            //$this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"TO"});

            $strARGNAME="TO";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{$strARGNAME}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }


            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "motion_glideto_menu":						//n秒内滑行到目标菜单选项
            //$this->codeInC[$this->currentType][]= "\"".$Block->{"fields"}->{"TO"}->{"value"}."\"";		//此处的双引号为特例，其它都放在调用里，待研究。
            break;

         case "motion_ifonedgebounce":						//碰到边缘就反弹
            $this->codeInC[$this->currentType][] = $this->padding().$Block->{"opcode"}."();".$this->getComments($Block->{"id"})."\n";
            break;

         /**************************MOTION 运动**************************/


         /**************************LOOKS 外观**************************/

         case "looks_sayforsecs":						//说n秒
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"MESSAGE"});
            $this->codeInC[$this->currentType][]= " ,";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"SECS"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "looks_say":							//说
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"MESSAGE"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "looks_thinkforsecs":						//想n秒
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"MESSAGE"});
            $this->codeInC[$this->currentType][]= " ,";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"SECS"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "looks_think":							//想
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"MESSAGE"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "looks_switchcostumeto":						//换成造型
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";

            $strARGNAME="COSTUME";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{$strARGNAME}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "looks_costume":							//switchcostumeto的默认shadow值，直接在switchcostumeto里处理了，不需要单独处理。
         case "looks_backdrops":						//switchbackdropto的默认shadow值，直接在switchbackdropto里处理了，不需要单独处理。
            									//但需要保留，以阻止出现“此功能暂未实现”的提示信息。
            break;

         case "looks_costumenumbername":					//当前角色编号/名称的类型
            $this->codeInC[$this->currentType][]= $Block->{"opcode"}.'( "';
            $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"NUMBER_NAME"}->{"value"};
            $this->codeInC[$this->currentType][]= '" )'.$this->getComments($Block->{"id"});

            break;

         case "looks_backdropnumbername":					//当前角色编号/名称的类型
            $this->codeInC[$this->currentType][]= $Block->{"opcode"}.'( "';
            $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"NUMBER_NAME"}->{"value"};
            $this->codeInC[$this->currentType][]= '" )'.$this->getComments($Block->{"id"});
            break;

         case "looks_switchbackdropto":						//换成背景
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";

            $strARGNAME="BACKDROP";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{$strARGNAME}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

            //$backdropBlockID=$Block->{"inputs"}->{"BACKDROP"}->{"block"}==''?$Block->{"inputs"}->{"BACKDROP"}->{"shadow"}:$Block->{"inputs"}->{"BACKDROP"}->{"block"};
            //$Block2=$this->Blocks->{$backdropBlockID} ;
            //if(isset($Block2->{"fields"}->{"BACKDROP"}))
            //   $this->codeInC[$this->currentType][]= "\"".$Block2->{"fields"}->{"BACKDROP"}->{"value"}."\"";
            //else
            //   $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"BACKDROP"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "looks_changesizeby":						//将大小增加
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"CHANGE"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "looks_setsizeto":						//将大小设为
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"SIZE"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "looks_changeeffectby":						//将特效增加
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= "\"".$Block->{"fields"}->{"EFFECT"}->{"value"}."\"";
            $this->codeInC[$this->currentType][]= " , ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"CHANGE"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "looks_seteffectto":						//将特效设为
            
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= "\"".$Block->{"fields"}->{"EFFECT"}->{"value"}."\"";
            $this->codeInC[$this->currentType][]= " , ";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"VALUE"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "looks_size":							//大小
            $this->codeInC[$this->currentType][]= $Block->{"opcode"}."()".$this->getComments($Block->{"id"});
            break;

         case "looks_gotofrontback":						//置于顶端
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= "\"".$Block->{"fields"}->{"FRONT_BACK"}->{"value"}."\"";
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "looks_goforwardbackwardlayers":					//上移/下移n层
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= "\"".$Block->{"fields"}->{"FORWARD_BACKWARD"}->{"value"}."\"";
            $this->codeInC[$this->currentType][]= ",";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"NUM"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "looks_show":							//显示
         case "looks_hide":							//隐藏
         case "looks_cleargraphiceffects":					//清除图像特效
         case "looks_nextcostume":						//下一个造型
         case "looks_nextbackdrop":						//下一个背景
            $this->codeInC[$this->currentType][] = $this->padding().$Block->{"opcode"}."();".$this->getComments($Block->{"id"})."\n";
            break;

         /**************************LOOKS 外观**************************/


         /**************************SOUND 声音**************************/
         case "sound_playuntildone":						//播放声音等待播完
         case "sound_play":							//播放声音
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( ";

            $strARGNAME="SOUND_MENU";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{$strARGNAME}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

            //$this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"SOUND_MENU"});
            $this->codeInC[$this->currentType][]  = " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "sound_changeeffectby":						//将音效增加
         case "sound_seteffectto":						//将音效设为
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( \"";
            $this->codeInC[$this->currentType][]  = $Block->{"fields"}->{"EFFECT"}->{"value"};
            $this->codeInC[$this->currentType][]  = "\" ,";
            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"VALUE"});
            $this->codeInC[$this->currentType][]  = " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "sound_changevolumeby":						//将音量增加
         case "sound_setvolumeto":						//将音量设为%
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"VOLUME"});
            $this->codeInC[$this->currentType][]  = " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "sound_volume":							//播放声音等待播完
            $this->codeInC[$this->currentType][]  = $Block->{"opcode"}."()".$this->getComments($Block->{"id"});
            break;

         case "sound_sounds_menu":						//播放声音等待播完
            //$this->codeInC[$this->currentType][]  = $Block->{"fields"}->{"SOUND_MENU"}->{"value"};
            break;

         case "sound_stopallsounds":						//停止所有声音
         case "sound_cleareffects":						//清除音效
            $this->codeInC[$this->currentType][] = $this->padding().$Block->{"opcode"}."();".$this->getComments($Block->{"id"})."\n";
            break;

         /**************************SOUND 声音**************************/



         /**************************CONTROL 控制************************/

         case "control_wait":							//等待n秒
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."(";
            $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"DURATION"});
            $this->codeInC[$this->currentType][]= ");".$this->getComments($Block->{"id"})."\n";
            break;

         case "control_repeat":							//重复执行n次
            $this->nLoopCounter++;
            $this->codeInC[$this->currentType][]= $this->padding()."for(int i".$this->nLoopCounter." = 0; i".$this->nLoopCounter." < ";
            $this->convertCode( $Block->{"inputs"}->{"TIMES"});
            $this->codeInC[$this->currentType][]= "; i".$this->nLoopCounter."++ ){".$this->getComments($Block->{"id"})."\n";
            $this->nLeftPadding++;
            if(isset($Block->{"inputs"}->{"SUBSTACK"}) && $Block->{"inputs"}->{"SUBSTACK"}->{"block"}!=NULL)	//检测包含的子积木块
            {
               $this->convertFromRest($Block->{"inputs"}->{"SUBSTACK"});
            }
            else
            {
                $this->nLeftPadding--;
                $this->codeInC[$this->currentType][]=$this->padding()."}\n";
            }
            break;

         case "control_forever":						//重复执行
            $this->codeInC[$this->currentType][]= $this->padding()."do{".$this->getComments($Block->{"id"})."\n";

            $this->nLeftPadding++;
            if(isset($Block->{"inputs"}->{"SUBSTACK"}) && $Block->{"inputs"}->{"SUBSTACK"}->{"block"}!=NULL)	//检测包含的子积木块
            {
               $this->convertFromRest($Block->{"inputs"}->{"SUBSTACK"});
            }
            else
            {
                $this->nLeftPadding--;
                $this->codeInC[$this->currentType][]=$this->padding()."}";
            }

            $this->codeInC[$this->currentType][]= $this->padding()."while (1);\n";
            break;

         case "control_repeat_until":						//重复执行直到
            $this->codeInC[$this->currentType][]= $this->padding()."do{".$this->getComments($Block->{"id"})."\n";
            $this->nLeftPadding++;
            if(isset($Block->{"inputs"}->{"SUBSTACK"}) && $Block->{"inputs"}->{"SUBSTACK"}->{"block"}!=NULL)	//检测包含的子积木块
            {
               $this->convertFromRest($Block->{"inputs"}->{"SUBSTACK"});
            }
            else
            {
                $this->nLeftPadding--;
                $this->codeInC[$this->currentType][]=$this->padding()."}";
            }

            $this->codeInC[$this->currentType][]= $this->padding()."while( !";

            if(isset($Block->{"inputs"}->{"CONDITION"}) && $Block->{"inputs"}->{"CONDITION"}->{"block"}!=NULL)	//检测包含的子积木块
            {
               $this->convertCode( $Block->{"inputs"}->{"CONDITION"});
            }
            $this->codeInC[$this->currentType][]= ");\n";

            break;

         case "control_if":							//如果那么
            $this->codeInC[$this->currentType][]= $this->padding()."if( ";

            if(isset($Block->{"inputs"}->{"CONDITION"}->{"block"}))
            {
               $this->convertCode( $Block->{"inputs"}->{"CONDITION"});
            }
            $this->codeInC[$this->currentType][]= " ){".$this->getComments($Block->{"id"})."\n";
            $this->nLeftPadding++;
            if(isset($Block->{"inputs"}->{"SUBSTACK"}) && $Block->{"inputs"}->{"SUBSTACK"}->{"block"}!=NULL)	//检测包含的子积木块
            {
               $this->convertFromRest($Block->{"inputs"}->{"SUBSTACK"});
            }
            else
            {
                $this->nLeftPadding--;
                $this->codeInC[$this->currentType][]=$this->padding()."}".$this->getComments($Block->{"id"})."\n";
            }
            break;

         case "control_if_else":						//如果那么否则
            $this->codeInC[$this->currentType][]= $this->padding()."if( ";
            if(isset($Block->{"inputs"}->{"CONDITION"}->{"block"}))
            {
               //var_dump($Block->{"inputs"}->{"CONDITION"});
               $this->convertCode( $Block->{"inputs"}->{"CONDITION"});
            }
            $this->codeInC[$this->currentType][]= " ){".$this->getComments($Block->{"id"})."\n";
            $this->nLeftPadding++;
            if(isset($Block->{"inputs"}->{"SUBSTACK"}) && $Block->{"inputs"}->{"SUBSTACK"}->{"block"}!=NULL)	//检测包含的子积木块
            {
               $this->convertFromRest($Block->{"inputs"}->{"SUBSTACK"});
            }
            else
            {
                $this->nLeftPadding--;
                $this->codeInC[$this->currentType][]=$this->padding()."}".$this->getComments($Block->{"id"})."\n";
            }
            $this->codeInC[$this->currentType][]= $this->padding()."else{\n";
            $this->nLeftPadding++;
            if(isset($Block->{"inputs"}->{"SUBSTACK2"}) && $Block->{"inputs"}->{"SUBSTACK2"}->{"block"}!=NULL)	//检测包含的子积木块
            {
               $this->convertFromRest($Block->{"inputs"}->{"SUBSTACK2"});
            }
            else
            {
                $this->nLeftPadding--;
                $this->codeInC[$this->currentType][]=$this->padding()."}\n";
            }
            break;

         case "control_wait_until":						//等待直到
            $this->codeInC[$this->currentType][]= $this->padding()."do{}".$this->getComments($Block->{"id"})."\n";
            $this->codeInC[$this->currentType][]= $this->padding()."while (!";

            if(isset($Block->{"inputs"}->{"CONDITION"}) && $Block->{"inputs"}->{"CONDITION"}->{"block"}!=NULL)	//检测包含的子积木块
            {
               $this->convertCode( $Block->{"inputs"}->{"CONDITION"});
            }
            $this->codeInC[$this->currentType][]= ");".$this->getComments($Block->{"id"})."\n";
            break;

         case "control_stop":							//停止
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( \"";
            $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"STOP_OPTION"}->{"value"};
            $this->codeInC[$this->currentType][]= "\" );".$this->getComments($Block->{"id"})."\n";
            break;

         case "control_create_clone_of":					//克隆
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";

            $strARGNAME="CLONE_OPTION";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{$strARGNAME}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

            //$this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"CLONE_OPTION"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "control_create_clone_of_menu":					//克隆的菜单项
            //$this->codeInC[$this->currentType][]= $Block->{"fields"}->{"CLONE_OPTION"}->{"value"};
            break;

         case "control_delete_this_clone":					//删除此克隆体
            $this->codeInC[$this->currentType][] = $this->padding().$Block->{"opcode"}."();".$this->getComments($Block->{"id"})."\n";
            break;

         /**************************CONTROL 控制*************************/


         /**************************SENSING 侦测*************************/

         case "sensing_username":						//当前用户名
            $this->codeInC[$this->currentType][]  = "USERNAME";
            break;

         case "sensing_mousex":							//鼠标X坐标
            $this->codeInC[$this->currentType][]  = "MOUSE_X";
            break;

         case "sensing_mousey":							//鼠标Y坐标
            $this->codeInC[$this->currentType][]  = "MOUSE_Y";
            break;

         case "sensing_mousedown":						//探测鼠标是否被按下
            $this->codeInC[$this->currentType][]  = $Block->{"opcode"}."()";
            break;

         case "sensing_keypressed":						//探测某按键是否被按下
            $this->codeInC[$this->currentType][]  = $Block->{"opcode"}."( ";


            $strARGNAME="KEY_OPTION";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{$strARGNAME}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

/*
            if(isset($Block->{"inputs"}->{"KEY_OPTION"}))
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"KEY_OPTION"});
            else
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{"BROADCAST_OPTION"});
*/

            $this->codeInC[$this->currentType][]= " )";
            break;

         case "sensing_keyoptions":						//按键
            //$this->codeInC[$this->currentType][]= $Block->{"fields"}->{"KEY_OPTION"}->{"value"};
            break;


         case "sensing_dayssince2000":						//自2000年开始至今的天数
            $this->codeInC[$this->currentType][]= $Block->{"opcode"}."()";
            break;

         case "sensing_loudness":						//响度
            $this->codeInC[$this->currentType][]= $Block->{"opcode"}."()";
            break;

         case "sensing_setdragmode":						//设置角色是否允许被拖拽
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( \"";
            $this->codeInC[$this->currentType][]  = $Block->{"fields"}->{"DRAG_MODE"}->{"value"};
            $this->codeInC[$this->currentType][]  = "\" );\n";
            break;

         case "sensing_distanceto":						//获取到目标的距离
            $this->codeInC[$this->currentType][]  = $Block->{"opcode"}."( ";
            //$this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"DISTANCETOMENU"});

            $strARGNAME="DISTANCETOMENU";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{$strARGNAME}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

            $this->codeInC[$this->currentType][]  = " )";
            break;

         case "sensing_distancetomenu":						//获取到目标的距离的菜单选项
            //$this->codeInC[$this->currentType][]= $Block->{"fields"}->{"DISTANCETOMENU"}->{"value"};
            break;

         case "sensing_answer":							//询问的答案
            $this->codeInC[$this->currentType][]  = $Block->{"opcode"}."()";
            break;

         case "sensing_askandwait":						//询问并等待
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"QUESTION"});
            $this->codeInC[$this->currentType][]  = " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "sensing_timer":							//定时器
            $this->codeInC[$this->currentType][]  = "sensing_timer() ";
            break;

         case "sensing_coloristouchingcolor":					//颜色碰到颜色
            $this->codeInC[$this->currentType][] = $Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"COLOR"});
            $this->codeInC[$this->currentType][] = " ,";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"COLOR2"});
            $this->codeInC[$this->currentType][] = " )";
            break;

         case "sensing_touchingcolor":						//碰到颜色
            $this->codeInC[$this->currentType][]  = $Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"COLOR"});
            $this->codeInC[$this->currentType][]  = " )";
            break;

         case "sensing_touchingobject":						//碰到对象
            $this->codeInC[$this->currentType][]  = $Block->{"opcode"}."( ";
            //$this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"TOUCHINGOBJECTMENU"});

            $strARGNAME="TOUCHINGOBJECTMENU";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{$strARGNAME}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

            $this->codeInC[$this->currentType][]  = " )";
            break;

         case "sensing_touchingobjectmenu":					//碰到对象的选项菜单
            //$this->codeInC[$this->currentType][]  = $Block->{"fields"}->{"TOUCHINGOBJECTMENU"}->{"value"};
            break;

         case "sensing_current":						//当前的年月日时分秒
            $this->codeInC[$this->currentType][]  = $Block->{"opcode"}."( \"";
            $this->codeInC[$this->currentType][]  = $Block->{"fields"}->{"CURRENTMENU"}->{"value"};
            $this->codeInC[$this->currentType][]  = "\" )";
            break;

         case "sensing_of":							//获取对象的某项参数
            $this->codeInC[$this->currentType][]  = $Block->{"opcode"}."( ";
            //$this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"OBJECT"});

            $strARGNAME="OBJECT";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{$strARGNAME}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

            $this->codeInC[$this->currentType][]  = ",\"";
            $this->codeInC[$this->currentType][]  = $Block->{"fields"}->{"PROPERTY"}->{"value"};
            $this->codeInC[$this->currentType][]  = "\" )";
            break;

         case "sensing_of_object_menu":						//对象菜单
            //$this->codeInC[$this->currentType][]  = $Block->{"fields"}->{"OBJECT"}->{"value"};
            break;

         case "sensing_resettimer":						//计时器归零
            $this->codeInC[$this->currentType][] = $this->padding().$Block->{"opcode"}."();".$this->getComments($Block->{"id"})."\n";
            break;

         case "colour_picker":							//选取颜色
            $this->codeInC[$this->currentType][]  = "\"".$Block->{"fields"}->{"COLOUR"}->{"value"}."\"";
            break;

         /**************************SENSING 侦测**************************/


         /**************************OPERATOR 运算*************************/

         case "operator_lt":							//小于
            $this->codeInC[$this->currentType][]=" ( ";
            $this->convertCode($Block->{"inputs"}->{"OPERAND1"});
            $this->codeInC[$this->currentType][]=" < ";
            $this->convertCode($Block->{"inputs"}->{"OPERAND2"});
            $this->codeInC[$this->currentType][]=" ) ";
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

            break;

         case "operator_gt":							//大于
            $this->codeInC[$this->currentType][]=" ( ";
            $this->convertCode($Block->{"inputs"}->{"OPERAND1"});
            $this->codeInC[$this->currentType][]=" > ";
            $this->convertCode($Block->{"inputs"}->{"OPERAND2"});
            $this->codeInC[$this->currentType][]=" ) ";
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

            break;

         case "operator_equals":						//等于
            $this->codeInC[$this->currentType][]=" ( ";
            $this->convertCode($Block->{"inputs"}->{"OPERAND1"});
            $this->codeInC[$this->currentType][]=" == ";
            $this->convertCode($Block->{"inputs"}->{"OPERAND2"});
            $this->codeInC[$this->currentType][]=" ) ";
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

            break;

         case "operator_add":							//加法
            $this->codeInC[$this->currentType][]=" ( ";
            $this->convertCode($Block->{"inputs"}->{"NUM1"});
            $this->codeInC[$this->currentType][]=" + ";
            $this->convertCode($Block->{"inputs"}->{"NUM2"});
            $this->codeInC[$this->currentType][]=" ) ";

            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

            break;

         case "operator_subtract":						//减法
            $this->codeInC[$this->currentType][]=" ( ";
            $this->convertCode($Block->{"inputs"}->{"NUM1"});
            $this->codeInC[$this->currentType][]=" - ";
            $this->convertCode($Block->{"inputs"}->{"NUM2"});
            $this->codeInC[$this->currentType][]=" ) ";
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

            break;

         case "operator_multiply":						//乘法
            $this->codeInC[$this->currentType][]=" ( ";
            $this->convertCode($Block->{"inputs"}->{"NUM1"});
            $this->codeInC[$this->currentType][]=" * ";
            $this->convertCode($Block->{"inputs"}->{"NUM2"});
            $this->codeInC[$this->currentType][]=" ) ";
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

            break;

         case "operator_divide":						//除法
            $this->codeInC[$this->currentType][]=" ( ";
            $this->convertCode($Block->{"inputs"}->{"NUM1"});
            $this->codeInC[$this->currentType][]=" / ";
            $this->convertCode($Block->{"inputs"}->{"NUM2"});
            $this->codeInC[$this->currentType][]=" ) ";
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

            break;

         case "operator_mod":							//求余
            $this->codeInC[$this->currentType][]=" ( ";
            $this->convertCode($Block->{"inputs"}->{"NUM1"});
            $this->codeInC[$this->currentType][]=" % ";
            $this->convertCode($Block->{"inputs"}->{"NUM2"});
            $this->codeInC[$this->currentType][]=" ) ";
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

            break;

         case "operator_and":							//且
            $this->codeInC[$this->currentType][]=" ( ";
            $this->convertCode($Block->{"inputs"}->{"OPERAND1"});
            $this->codeInC[$this->currentType][]=" && ";
            $this->convertCode($Block->{"inputs"}->{"OPERAND2"});
            $this->codeInC[$this->currentType][]=" ) ";
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

            break;

         case "operator_or":							//或
            $this->codeInC[$this->currentType][]=" ( ";
            $this->convertCode($Block->{"inputs"}->{"OPERAND1"});
            $this->codeInC[$this->currentType][]=" || ";
            $this->convertCode($Block->{"inputs"}->{"OPERAND2"});
            $this->codeInC[$this->currentType][]=" ) ";
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

            break;

         case "operator_not":
            //var_dump($Block->{"inputs"}->{"OPERAND"});							//非
            $this->codeInC[$this->currentType][]=" !";
            //if(isset($Block->{"inputs"}->{"OPERAND"}))
               $this->convertCode($Block->{"inputs"}->{"OPERAND"});
            //else
            //   $this->codeInC[$this->currentType][]= "";
            $this->codeInC[$this->currentType][]=" ";
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

            break;

         case "operator_mathop":						//数学函数
            if($Block->{"fields"}->{"OPERATOR"}->{"value"}=="sin")				//sin这个关键词，在文本代码转积木时，会跟sensing_混淆，所以改为sinf。
            {
               $this->codeInC[$this->currentType][]='sinf(';
               $this->convertCode($Block->{"inputs"}->{"NUM"});
               $this->codeInC[$this->currentType][]=" ) ";
            }
            else if($Block->{"fields"}->{"OPERATOR"}->{"value"}=="10 ^")				//10的n次方
            {
               $this->codeInC[$this->currentType][]=$Block->{"opcode"}.'( "10 ^" ,';
               $this->convertCode($Block->{"inputs"}->{"NUM"});
               $this->codeInC[$this->currentType][]=" ) ";
            }
            else if($Block->{"fields"}->{"OPERATOR"}->{"value"}=="e ^")				//e的n次方
            {
               $this->codeInC[$this->currentType][]=$Block->{"opcode"}.'( "e ^" ,';
               $this->convertCode($Block->{"inputs"}->{"NUM"});
               $this->codeInC[$this->currentType][]=" ) ";
            }
            else
            {
//            $this->codeInC[$this->currentType][]=$Block->{"opcode"}."(";
//            $this->codeInC[$this->currentType][]='"'.$Block->{"fields"}->{"OPERATOR"}->{"value"}.'"';//其它函数名
//            $this->codeInC[$this->currentType][]=",";
               $this->codeInC[$this->currentType][]=$Block->{"fields"}->{"OPERATOR"}->{"value"}."(";
               $this->convertCode($Block->{"inputs"}->{"NUM"});
               $this->codeInC[$this->currentType][]=" ) ";
            }
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

            break;

         case "operator_random":						//随机数
//            $this->codeInC[$this->currentType][]=$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]="random( ";
            $this->convertCode($Block->{"inputs"}->{"FROM"});
            $this->codeInC[$this->currentType][]=" , ";
            $this->convertCode($Block->{"inputs"}->{"TO"});
            $this->codeInC[$this->currentType][]=" ) ";
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

            break;

         case "operator_length":						//字符串长度
            $this->codeInC[$this->currentType][]=$Block->{"opcode"}."( ";
            $this->convertCode($Block->{"inputs"}->{"STRING"});
            $this->codeInC[$this->currentType][]=" ) ";
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

            break;

         case "operator_letter_of":						//列表下标取值
            $this->codeInC[$this->currentType][]=$Block->{"opcode"}."( ";
            $this->convertCode($Block->{"inputs"}->{"STRING"});
            $this->codeInC[$this->currentType][]  =" , ";
            $this->convertCode($Block->{"inputs"}->{"LETTER"});
            $this->codeInC[$this->currentType][]  =" ) ";
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

            break;

         case "operator_join":							//连接
//            $this->codeInC[$this->currentType][] = $Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][] = "join( ";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"STRING1"});
            $this->codeInC[$this->currentType][] = " ,";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"STRING2"});
            $this->codeInC[$this->currentType][] = " )";
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

         break;

         case "operator_round":							//四舍五入
//            $this->codeInC[$this->currentType][] = $Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][] = "round( ";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"NUM"});
            $this->codeInC[$this->currentType][] = " )";
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

         break;

         case "operator_contains":						//包含
            $this->codeInC[$this->currentType][] = $Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"STRING1"});
            $this->codeInC[$this->currentType][] = " , ";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"STRING2"});
            $this->codeInC[$this->currentType][] = " )";
            if($Block->{"parent"}==NULL)					//如果没有parent，就是独立的单独一个积木，那么后面加回车。
               $this->codeInC[$this->currentType][]=" \n ";

         break;

         /**************************OPERATOR 运算**************************/



         /**************************VARIABLE 变量**************************/

         /**************************变量**************************/
         case "data_variable":							//变量
            if($Block->{"parent"}!=NULL)
               $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"VARIABLE"}->{"value"};
            break;

         case "data_setvariableto":						//将变量设为
            $this->codeInC[$this->currentType][]= $this->padding().''.$Block->{"fields"}->{"VARIABLE"}->{"value"};
            $this->codeInC[$this->currentType][]="=";			//暂时不支持加空格。
            $this->convertCode($Block->{"inputs"}->{"VALUE"});
            $this->codeInC[$this->currentType][]= " ;".$this->getComments($Block->{"id"})."\n";
            break;

         case "data_changevariableby":						//将变量增加
            $this->codeInC[$this->currentType][]= $this->padding()."".$Block->{"fields"}->{"VARIABLE"}->{"value"};
            $this->codeInC[$this->currentType][]="+=";			//暂时不支持加空格。
            $this->convertCode($Block->{"inputs"}->{"VALUE"});
            $this->codeInC[$this->currentType][]= " ;".$this->getComments($Block->{"id"})."\n";
            break;

         case "data_showvariable":						//显示变量
         case "data_hidevariable":						//隐藏变量
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"VARIABLE"}->{"value"};
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         /**************************列表**************************/
         case "data_listcontents":						//列表变量名
            if($Block->{"parent"}!=NULL)
               $this->codeInC[$this->currentType][]= str_replace(" ","_","".$Block->{"fields"}->{"LIST"}->{"value"});	//自制积木的布尔值类型参数。文本标签不算参数。
            break;

         case "data_showlist":							//显示列表
         case "data_hidelist":							//隐藏列表
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]= $Block->{"fields"}->{"LIST"}->{"value"};
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "data_addtolist":							//列表中增加值
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ".$Block->{"fields"}->{"LIST"}->{"value"};
            $this->codeInC[$this->currentType][]=" ,";
            $this->convertCode($Block->{"inputs"}->{"ITEM"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "data_deleteoflist":						//删除列表内某个数据
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ".$Block->{"fields"}->{"LIST"}->{"value"};
            $this->codeInC[$this->currentType][]=" , ";
            $this->convertCode($Block->{"inputs"}->{"INDEX"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "data_deletealloflist":						//清空列表数据
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ".$Block->{"fields"}->{"LIST"}->{"value"};
            $this->codeInC[$this->currentType][]=" );".$this->getComments($Block->{"id"})."\n";
            break;

         case "data_insertatlist":						//往列表某项前中插入数据
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ".$Block->{"fields"}->{"LIST"}->{"value"};
            $this->codeInC[$this->currentType][]=" , ";
            $this->convertCode($Block->{"inputs"}->{"INDEX"});
            $this->codeInC[$this->currentType][]=" ,";
            $this->convertCode($Block->{"inputs"}->{"ITEM"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "data_replaceitemoflist":						//替换列表中某项数据
            $this->codeInC[$this->currentType][]= $this->padding().$Block->{"opcode"}."( ".$Block->{"fields"}->{"LIST"}->{"value"};
            $this->codeInC[$this->currentType][]=" , ";
            $this->convertCode($Block->{"inputs"}->{"INDEX"});
            $this->codeInC[$this->currentType][]=" ,";
            $this->convertCode($Block->{"inputs"}->{"ITEM"});
            $this->codeInC[$this->currentType][]= " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "data_itemoflist":						//取列表中某项的值
            $this->codeInC[$this->currentType][]= $Block->{"opcode"}."( ".$Block->{"fields"}->{"LIST"}->{"value"};
            $this->codeInC[$this->currentType][]=" , ";
            $this->convertCode($Block->{"inputs"}->{"INDEX"});
            $this->codeInC[$this->currentType][]=" )";
            break;

         case "data_itemnumoflist":						//列表中某数据第一次出现的编号
            $this->codeInC[$this->currentType][]= $Block->{"opcode"}."( ".$Block->{"fields"}->{"LIST"}->{"value"};
            $this->codeInC[$this->currentType][]=" , ";
            $this->convertCode($Block->{"inputs"}->{"ITEM"});
            $this->codeInC[$this->currentType][]=" )";
            break;

         case "data_lengthoflist":						//取列表项目数
            $this->codeInC[$this->currentType][]= $Block->{"opcode"}."( ".$Block->{"fields"}->{"LIST"}->{"value"};
            $this->codeInC[$this->currentType][]=" )";
            break;

         case "data_listcontainsitem":						//列表中是否包含某数
            $this->codeInC[$this->currentType][]= $Block->{"opcode"}."( ".$Block->{"fields"}->{"LIST"}->{"value"};
            $this->codeInC[$this->currentType][]=" , ";
            $this->convertCode($Block->{"inputs"}->{"ITEM"});
            $this->codeInC[$this->currentType][]=" )";
            break;

         /**************************VARIABLE 变量**************************/


         /**************************PROCEDURE 自制积木**************************/
         case "procedures_prototype":						//自制积木原形
         //   //print_r($Block);
         //   $this->codeInC[$this->currentType][]= $this->padding()."void ".$Block->{"mutation"}->{"proccode"}."( ";
         //   foreach( $Block->{'inputs'} as $key=>$arr)
         //   {
         //      if($arr->{'block'}!='')
         //      {
         //         $this->convertCode($arr);
         //         $this->codeInC[$this->currentType][]= " , ";
         //      }
         //   }
         //   if( $this->codeInC[$this->currentType][count( $this->codeInC[$this->currentType])-1]==" , " )
         //      $this->codeInC[$this->currentType][count( $this->codeInC[$this->currentType])-1]=' ';
         //   $this->codeInC[$this->currentType][]= "){\n";	//差别在这里：这个是函数定义。（现在看看，已经不明白当时要表达什么了。）
            break;

         case "procedures_call":						//对自制积木的调用

            $strFormat=$Block->{"mutation"}->{"proccode"};

            $strFormat=str_replace("%b","%s",$strFormat);
            $strFormat=str_replace("%n","%s",$strFormat);

            $strProcedName=isset($this->arrProcedureName[$strFormat])?
				$this->arrProcedureName[$strFormat]:
				$strFormat;

            $arrArg=json_decode($Block->{"mutation"}->{"argumentids"});				//参数是有顺序的，需要按argumentids里的顺序进行解析。

            $this->codeInC[$this->currentType][]= $this->padding()."".$strProcedName."( ";
            for($a=0;$a<count($arrArg);$a++)
            {
                $this->convertCode($Block->{'inputs'}->{$arrArg[$a]}->{'block'});
                $this->codeInC[$this->currentType][]= " , ";
            }

            if( $this->codeInC[$this->currentType][count( $this->codeInC[$this->currentType])-1]==" , " )
               $this->codeInC[$this->currentType][count( $this->codeInC[$this->currentType])-1]=' ';

            $this->codeInC[$this->currentType][]= ");".$this->getComments($Block->{"id"})."\n";
            break;

         case "procedures_definition":						//自制积木定义

            $pdID=$Block->{'id'};						//保存procedures_definition的BlockID，以便获取Comments

            $prototypeBlockID=$Block->{"inputs"}->{"custom_block"}->{'block'};
            $Block=$this->Blocks->{$prototypeBlockID}  ;			//procedures_definition的Block在这里被覆盖为原型定义的Block了。
            $arguments=json_decode($Block->{"mutation"}->{"argumentnames"});

            $prefix = '_';
            $suffix = '_'; 
            $arguments = array_map(function($item) use ($prefix, $suffix) {	//给参数设置前后缀，方便识别参数位置
               return $prefix . $item . $suffix;
            }, $arguments);

            $strWarp=$Block->{"mutation"}->{"warp"};				//true为运行时不刷新，false为运行时刷新
										//自制积木名字的处理
            $strFormat=$Block->{"mutation"}->{"proccode"};
            $strFormat=str_replace("%b","%s",$strFormat);
            $strFormat=str_replace("%n","%s",$strFormat);

            $strProcedName = vsprintf($strFormat,$arguments);			//先把参数名更新到字符串中
            $strProcedName = str_replace(" ","",$strProcedName);				//    再去掉空格

            $this->arrProcedureName[$strFormat]=$strProcedName;

            $this->codeInC[$this->currentType][]= "//如要设置“运行时不刷新屏幕”，请将“false”改为“true”。\n";
            $this->codeInC[$this->currentType][]= $this->padding()."void ".$strProcedName."( ";

            if(empty((array)$Block->{'inputs'}))					//可能是旧版本，也可能是无输入
            {
               if($Block->{'mutation'}->{'argumentnames'}!=NULL)			//Scratch2.0
               {
                  $strArgName= json_decode($Block->{'mutation'}->{'argumentnames'});
                  $strArgType= json_decode($Block->{'mutation'}->{'argumentdefaults'});
                  for($a=0;$a<count($strArgName);$a++)
                  {
                     if($a>0)
                        $this->codeInC[$this->currentType][]=' , ';

                     if($strArgType[$a]=="false") 
                        $this->codeInC[$this->currentType][]="BOOL ".$strArgName[$a];
                     else
                        $this->codeInC[$this->currentType][]="VAR ".$strArgName[$a];
                   }
                }
             }
             else
             {
                foreach( $Block->{'inputs'} as $key=>$arr)				//Scratch3.0
                {
                  if($arr->{'block'}!='')
                  {
                     $this->convertCode($arr,true);				//在定义函数时，变量前要加类型符号VAR或BOOL，在使用时则不需要。
                     $this->codeInC[$this->currentType][]= " , ";			//true用于表示当前是在函数定义中。
                  }

               }
               //if( $this->codeInC[$this->currentType][count( $this->codeInC[$this->currentType])-1]==" , " )
               //   $this->codeInC[$this->currentType][count( $this->codeInC[$this->currentType])-1]=' ';
            }

            $this->codeInC[$this->currentType][]= "$strWarp ){".$this->getComments($pdID)."\n";			//运行时刷不刷新，控制在这里。

            $this->nLeftPadding++;	//控制括号。这个结构类似于HATS

            break;

         /**************************PROCEDURE 自制积木**************************/


         /**************************PEN 画笔**************************/

         case "pen_setPenColorToColor":						//将笔的颜色设为
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"COLOR"});
            $this->codeInC[$this->currentType][]  = " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "pen_changePenColorParamBy":       				//将笔的参数增加
         case "pen_setPenColorParamTo":          				//将笔的参数设为
            $this->codeInC[$this->currentType][] = $this->padding().$Block->{"opcode"}."( ";

            $strARGNAME="COLOR_PARAM";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{"colorParam"}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

            //$this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"COLOR_PARAM"});
            $this->codeInC[$this->currentType][] = " ,";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"VALUE"});
            $this->codeInC[$this->currentType][] = " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "pen_changePenSizeBy":             				//将笔的粗细增加
         case "pen_setPenSizeTo":               				//将笔的粗细设为
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"SIZE"});
            $this->codeInC[$this->currentType][]  = " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "pen_menu_colorParam":             				//将笔的粗细设为
            //$this->codeInC[$this->currentType][]   = "\"".$Block->{"fields"}->{"colorParam"}->{"value"}."\"";
            break;

         case "pen_stamp":							//图章
         case "pen_penDown":							//落笔
         case "pen_penUp":							//抬笔
         case "pen_clear":							//全部擦除
            $this->codeInC[$this->currentType][] = $this->padding().$Block->{"opcode"}."();".$this->getComments($Block->{"id"})."\n";
            break;

         /**************************PEN 画笔**************************/


         /**************************MUSIC 音乐**************************/

         case "music_playDrumForBeats":						//击打乐器n拍
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( ";
            //$this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"DRUM"});

            $strARGNAME="DRUM";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{$strARGNAME}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

            $this->codeInC[$this->currentType][]  = " , ";
            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"BEATS"});
            $this->codeInC[$this->currentType][]  = " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "music_restForBeats":						//休止n拍
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"BEATS"});
            $this->codeInC[$this->currentType][]  = " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "music_playNoteForBeats":						//演奏音符n拍
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"NOTE"});
            $this->codeInC[$this->currentType][]  = " , ";
            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"BEATS"});
            $this->codeInC[$this->currentType][]  = " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "music_setInstrument":						//将乐器设为
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( ";
            //$this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"INSTRUMENT"});

            $strARGNAME="INSTRUMENT";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{$strARGNAME}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

            $this->codeInC[$this->currentType][]  = " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "music_setTempo":							//将演奏速度设定为
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"TEMPO"});
            $this->codeInC[$this->currentType][]  = " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "music_changeTempo":						//将演奏速度增加
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"TEMPO"});
            $this->codeInC[$this->currentType][]  = " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "music_getTempo":							//演奏速度
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."()";
            break;

         case "music_menu_DRUM":						//乐器列表
            //$this->codeInC[$this->currentType][]  = $Block->{"fields"}->{"DRUM"}->{"value"};
            break;

         case "note":								//音符
            $this->codeInC[$this->currentType][]  = $Block->{"fields"}->{"NOTE"}->{"value"};
            break;

         case "music_menu_INSTRUMENT":						//乐器
            //$this->codeInC[$this->currentType][]  = $Block->{"fields"}->{"INSTRUMENT"}->{"value"};
            break;

         /**************************MUSIC 音乐**************************/

         /**************************videoSensing 视频侦测**************************/

         case "videoSensing_whenMotionGreaterThan":				//当视频运动>10

            $this->codeInC[$this->currentType][]= "//当视频运动>10\n";
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"REFERENCE"});
            $this->codeInC[$this->currentType][]  = " ){\n";
            $this->nLeftPadding++;
            break;

         case "videoSensing_videoOn":						//相对于角色的视频运动
            $this->codeInC[$this->currentType][]  = $Block->{"opcode"}."( ";
            //$this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"SUBJECT"});

            $strARGNAME="SUBJECT";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{$strARGNAME}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

            $this->codeInC[$this->currentType][]  = " , ";
            //$this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"ATTRIBUTE"});

            $strARGNAME="ATTRIBUTE";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{$strARGNAME}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

            $this->codeInC[$this->currentType][]  = " )";
            break;

         case "videoSensing_videoToggle":					//开启摄像头
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( ";
            //$this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"VIDEO_STATE"});

            $strARGNAME="VIDEO_STATE";
            if( $Block->{"inputs"}->{$strARGNAME}->{"block"}==$Block->{"inputs"}->{$strARGNAME}->{"shadow"})
            {
               $this->codeInC[$this->currentType][]= '"'.$this->Blocks->{$Block->{"inputs"}->{$strARGNAME}->{"block"}}->{"fields"}->{$strARGNAME}->{"value"}.'"';  //shadow指向了block，就是block；否则就是shadow。
            }
            else
            {
               $this->codeInC[$this->currentType][]= $this->convertCode($Block->{"inputs"}->{$strARGNAME}->{"block"});  //shadow指向了block，就是block；否则就是shadow。
            }

            $this->codeInC[$this->currentType][]  = " );".$this->getComments($Block->{"id"})."\n";
            break;

         case "videoSensing_setVideoTransparency":				//将视频透明度设为
            $this->codeInC[$this->currentType][]  = $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][]  = $this->convertCode($Block->{"inputs"}->{"TRANSPARENCY"});
            $this->codeInC[$this->currentType][]  = " );".$this->getComments($Block->{"id"})."\n";
            break;



         case "videoSensing_menu_SUBJECT":
         case "videoSensing_menu_ATTRIBUTE":
         case "videoSensing_menu_VIDEO_STATE":
            break;
         /**************************videoSensing 视频侦测**************************/

         //自制扩展
         /**************************CHATTINGROOM 互动工具**************************/

         case "chattingroom_sendMsgTo":						//聊天室发送消息
            $this->codeInC[$this->currentType][] = $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"USER"});
            $this->codeInC[$this->currentType][] = " ,";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"MSG"});
            $this->codeInC[$this->currentType][] = " );".$this->getComments($Block->{"id"})."\n";
         break;

         case "chattingroom_sendReport":					//聊天室发送消息
            $this->codeInC[$this->currentType][] = $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"STEPS"});
            $this->codeInC[$this->currentType][] = " , ";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"LEFT"});
            $this->codeInC[$this->currentType][] = " , ";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"RIGHT"});
            $this->codeInC[$this->currentType][] = " , ";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"TIME"});
            $this->codeInC[$this->currentType][] = " );".$this->getComments($Block->{"id"})."\n";
         break;

         case "chattingroom_splitString":					//聊天室发送消息
            $this->codeInC[$this->currentType][] = $this->padding().$Block->{"opcode"}."( ";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"NEEDLE"});
            $this->codeInC[$this->currentType][] = " , ";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"STRTEXT"});
            $this->codeInC[$this->currentType][] = " , ";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"LIST"});
            $this->codeInC[$this->currentType][] = " );".$this->getComments($Block->{"id"})."\n";
         break;

         case "chattingroom_menu_userlist":					//聊天室用户列表
            $this->codeInC[$this->currentType][] = "\"".$Block->{"fields"}->{"userlist"}->{"value"}."\"";
            break;

         case "chattingroom_lastReceivedMsg":					//聊天室接收到的最近一条消息
            $this->codeInC[$this->currentType][] = $Block->{"opcode"}."()";
            break;

         case "chattingroom_lastReceivedMsgSender":				//最后一条未读消息的发送者
            $this->codeInC[$this->currentType][] = $Block->{"opcode"}."()";
            break;

         case "chattingroom_lastMsgFrom":					//来自某人的最后一条消息
            $this->codeInC[$this->currentType][] = $Block->{"opcode"}."(";
            $this->codeInC[$this->currentType][] = $this->convertCode($Block->{"inputs"}->{"USER"});
            $this->codeInC[$this->currentType][] = ")";
            break;

         case "chattingroom_unreadMsgLength":					//未读消息数
            //$this->codeInC[$this->currentType][] = "VAR_".$Block->{"opcode"};
            $this->codeInC[$this->currentType][] = "".$Block->{"opcode"};
            break;

         /**************************CHATTINGROOM 互动工具**************************/


         /**************************未定义**************************/

         default:
            $this->codeInC[$this->currentType][]=  $this->padding()."//此功能暂未实现：".$Block->{"opcode"}."\n";
            break;
      }
   }


   //处理需要带括号的积木块，比如Hat类，循环类，判断类
   function convertFromHat($oBlock)
   {
      if(isset($oBlock->{"block"}))
      {
         $BlockID=($oBlock->{"block"}==$oBlock->{"shadow"})?$oBlock->{"block"}:($oBlock->{"shadow"}!=NULL?$oBlock->{"shadow"}:$oBlock->{"block"});
      }
      else $BlockID=$oBlock;

      if($this->convertCode($BlockID)!=-1)					//排除不存在的ID
      {
         //$this->convertCode($BlockID);					//？？？？？？似乎重复执行了。转换指令，需要传入BlockID
         if($this->Blocks->{$BlockID}->{'next'}!=NULL)
         {
            $this->convertFromHat($this->Blocks->{$BlockID}->{'next'});		//获取下一块积木，需要传入BlockID
         }
         else
         {
            $this->nLeftPadding--;
            if($this->nLeftPadding>-1)
               $this->codeInC[$this->currentType][]= $this->padding()."}\n\n";		//该类积木处理完后，需要补一个括号和两个换行
         }
      }
      else
      {
         $this->nLeftPadding--;
         $this->codeInC[$this->currentType][]= $this->padding()."}\n\n";		//该类积木处理完后，需要补一个括号和两个换行
      }
   }

   //处理孤立的积木块
   function convertFromRest($oBlock)
   {
      if(isset($oBlock->{"block"}))
      {
         $BlockID=($oBlock->{"block"}==$oBlock->{"shadow"})?$oBlock->{"block"}:($oBlock->{"shadow"}!=NULL?$oBlock->{"shadow"}:$oBlock->{"block"});
      }
      else $BlockID=$oBlock;

      if($this->convertCode($BlockID)!=-1)					//排除不存在的ID
      {
         if($this->Blocks->{$BlockID}->{'next'}!=NULL)
         {
            $this->convertFromRest($this->Blocks->{$BlockID}->{'next'});		//获取下一块积木，需要传入BlockID
         }
         else
         {
            if($this->nLeftPadding>0)
            {
               $this->nLeftPadding--;						//因为没有头部积木，所以可能会一直减下去，所以要先判断是否需要减
               $this->codeInC[$this->currentType][]= $this->padding()."}\n";		//该类积木处理完后，需要补一个括号
            }
            else 
               $this->codeInC[$this->currentType][]= $this->padding()."\n";		//给不连续的积木加空行，用于分段。

         }
      }
   }

   //处理需要带括号的积木块，比如Hat类，循环类，判断类
   function convertFromSDF($oBlock)
   {
      if(isset($oBlock->{"block"}))
      {
         $BlockID=($oBlock->{"block"}==$oBlock->{"shadow"})?$oBlock->{"block"}:($oBlock->{"shadow"}!=NULL?$oBlock->{"shadow"}:$oBlock->{"block"});
      }
      else $BlockID=$oBlock;

      if($this->convertCode($BlockID)!=-1)					//排除不存在的ID
      {
         //$this->convertCode($BlockID);						//重复执行了？？？？？？？转换指令，需要传入BlockID
         if($this->Blocks->{$BlockID}->{'next'}!=NULL)
         {
            $this->convertFromSDF($this->Blocks->{$BlockID}->{'next'});		//获取下一块积木，需要传入BlockID
         }
         else
         {
            $this->nLeftPadding--;
            if($this->nLeftPadding>-1)
               $this->codeInC[$this->currentType][]= $this->padding()."}\n\n";		//该类积木处理完后，需要补一个括号和两个换行
         }
      }
      else
      {
         $this->nLeftPadding--;
         $this->codeInC[$this->currentType][]= $this->padding()."}\n\n";		//该类积木处理完后，需要补一个括号和两个换行
      }
   }

   //定义自制积木，完成proccode的映射
   function defineSDF($BlockID)
   {
						//ID为空
      $Block=isset($this->Blocks->{$BlockID})?$this->Blocks->{$BlockID}:NULL; 	//此处可能会出现不存在现象，需要研究是否跟新添变量有关。

      if($Block)
      {
         $prototypeBlockID=$Block->{"inputs"}->{"custom_block"}->{'block'};
         $Block=$this->Blocks->{$prototypeBlockID}  ;
         $arguments=json_decode($Block->{"mutation"}->{"argumentnames"});

         $prefix = '_';
         $suffix = '_'; 
         $arguments = array_map(function($item) use ($prefix, $suffix) {	//给参数设置前后缀，方便识别参数位置
            return $prefix . $item . $suffix;
         }, $arguments);

									//自制积木名字的处理
         $strFormat=$Block->{"mutation"}->{"proccode"};

         $strFormat=str_replace("%b","%s",$strFormat);			//%b改成%s
         $strFormat=str_replace("%n","%s",$strFormat);			//%n改成%s   vsprintf不支持%b和%n，且%n是Scratch2.0的，3.0已经取消了。

         $strProcedName = vsprintf($strFormat,$arguments);			//先把参数名更新到字符串中
         $strProcedName = str_replace(" ","",$strProcedName);				//    再去掉空格

         $this->arrProcedureName[$strFormat]=$strProcedName;


         //print_r($this->arrProcedureName);
      }

   }


   //获取所有SDF类型的Block的ID
   function getSDFBlocks()
   {
      $arrSDFBlocks=Array();
      foreach($this->Blocks as $BlockID=>$Block)
      {
         $this->arrBlockID[$BlockID]=0 ;					//0为未处理的Block      1为已处理
         
         if($Block->{'opcode'}=="procedures_definition")				//获取所有Hats
         {
            $arrSDFBlocks[]=$BlockID;
         }
      }
      return $arrSDFBlocks;
   }


   //获取所有Hat类型的Block的ID
   function getHatBlocks()
   {
      $arrHatBlocks=Array();
      foreach($this->Blocks as $BlockID=>$Block)
      {
         $this->arrBlockID[$BlockID]=0 ;					//0为未处理的Block      1为已处理
         
         if($this->checkHat($Block->{'opcode'})==true)				//获取所有Hats
         {
            $arrHatBlocks[]=$BlockID;
         }
      }
      return $arrHatBlocks;
   }

   //获取所有游离的Block的ID
   function getRestParentBlocks()
   {
      $arrParentBlocks=Array();
      if($this->arrBlockID!=NULL)
      {
         $arrRestBlockID=$this->arrBlockID;
         foreach($arrRestBlockID as $BlockID=>$value)
         {
            //isset($this->Blocks->{$BlockID}->{'parent'}) &&			//都有parent属性
            if(( !isset($this->Blocks->{$BlockID}->{'parent'}) || $this->Blocks->{$BlockID}->{'parent'}==NULL) && $this->Blocks->{$BlockID}->{'opcode'}!="procedures_definition") 	//查找游离积木中的第一个（parent为NULL），同时排除自制积木
               $arrParentBlocks[]=$BlockID;
         }
      }
      return $arrParentBlocks;
   }

   //编译SB3项目文件
   function compileSB3()
   {
      $this->currentType=0;
      $this->codeInC[$this->currentType][] = "//此处定义适用于所有角色的变量\n";
      if( isset($this->Variables->{"GV"}) && count((array)$this->Variables->{"GV"})>0)
      {
         foreach($this->Variables->{"GV"} as $VID=>$arr)
         {
            if($arr->{"type"}=="broadcast_msg")									//消息也会被定义成变量。
            {
               $this->codeInC[$this->currentType][]="MSG ".$arr->{"name"}." = ".(is_numeric($arr->{"value"})?$arr->{"value"}:("\"".trim($arr->{"value"},'"')."\"")).";\n";
            }
            else if($arr->{"type"}=="list")									//列表的定义
                $this->codeInC[$this->currentType][]="LIST ".$arr->{"name"}." =  {".(count($arr->{"value"})>0?" '".implode("','",$arr->{"value"})."' ":"")."};\n";
            else												//普通变量的定义
                $this->codeInC[$this->currentType][]="VAR ".$arr->{"name"}." = ".(is_numeric($arr->{"value"})?$arr->{"value"}:("\"".trim($arr->{"value"},'"')."\"")).";\n";
         }
      }

      $this->currentType=1;
      $this->codeInC[$this->currentType][] = "//此处定义仅适用于当前角色的变量\n//如当前角色为舞台，\n//请在上方窗口中定义。\n";
      if( isset($this->Variables->{"CV"}) && count((array)$this->Variables->{"CV"})>0)
      {

         foreach($this->Variables->{"CV"} as $VID=>$arr)
         {
            if($arr->{"type"}=="broadcast_msg")									//消息也会被定义成变量。
            {
               $this->codeInC[$this->currentType][]="MSG ".$arr->{"name"}." = ".(is_numeric($arr->{"value"})?$arr->{"value"}:("\"".trim($arr->{"value"},'"')."\"")).";\n";
            }
            else if($arr->{"type"}=="list")									//列表的定义
                $this->codeInC[$this->currentType][]="LIST ".$arr->{"name"}." =  {".(count($arr->{"value"})>0?" '".implode("','",$arr->{"value"})."' ":"")."};\n";
            else												//普通变量的定义
                $this->codeInC[$this->currentType][]="VAR ".$arr->{"name"}." = ".(is_numeric($arr->{"value"})?$arr->{"value"}:("\"".trim($arr->{"value"},'"')."\"")).";\n";
         }
      }

      $this->currentType=2;
      $this->codeInC[$this->currentType][]= "//在此处开始编写您的代码\n\n";

      $arrSDFBlockID=$this->getSDFBlocks();			//自制积木

      if(count($arrSDFBlockID)>0)				//先完成定义
      {
         for($i=0;$i<count($arrSDFBlockID);$i++)
         {
            $this->defineSDF($arrSDFBlockID[$i]);
         }
      }
      if(count($arrSDFBlockID)>0)				//再进行解析
      {
         $this->codeInC[$this->currentType][]= "";
         for($i=0;$i<count($arrSDFBlockID);$i++)
         {
            $this->convertFromSDF($arrSDFBlockID[$i]);
         }
      }

      $arrHatBlockID=$this->getHatBlocks();			//头部积木
      if(count($arrHatBlockID)>0)
      {         
         //$this->codeInC[$this->currentType][]= "//以下为已关联事件的积木\n\n";
         foreach($arrHatBlockID as $block)
         {
            $this->convertFromHat($block);
         }
      }

      $this->currentType=3;
      $arrRestBlockID=$this->getRestParentBlocks();		//剩余零散积木
      if(count($arrRestBlockID)>0)
      {
         $this->codeInC[$this->currentType][]= "//零散代码收容所\n\n";
         foreach($arrRestBlockID as $block)
         {
            $this->convertFromRest($block);
         }
      }
   }

   //输出转换结果
   function dumpCodeInC()
   {
      //var_dump($this->codeInC);
      if($this->codeInC!=NULL)
      {
         echo json_encode( Array(implode("",$this->codeInC[0]),implode("",$this->codeInC[1]),implode("",$this->codeInC[2]),preg_replace("/\n\n+/","\n\n",trim(implode("",$this->codeInC[3]),"\n"))."\n"));
      }
   }

   //输出转换结果
   function getCodeInC()
   {
      //var_dump($this->codeInC);
      if($this->codeInC!=NULL)
      {
         return $this->codeInC[2];// preg_replace("/\n\n+/","\n\n",trim(implode("",$this->codeInC[3]),"\n"));//return Array(implode("",$this->codeInC[0]),implode("",$this->codeInC[1]),implode("",$this->codeInC[2]),preg_replace("/\n\n+/","\n\n",trim(implode("",$this->codeInC[3]),"\n"))."\n");
      }
   }

}
?>