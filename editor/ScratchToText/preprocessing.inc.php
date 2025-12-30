<?php

   /***********************************************************************

      此函数，将在 c2s.class.php ，rpn_logic_expression.class.php 和 rpn_calc_expression.class.php 中被大量使用。

      UID（Unique ID唯一标识）生成器

      Scratch3.0中，每一块积木都有一个唯一标识数据（UID），默认20字节；项目自带默认变量名除外：“我的变量”的UID为“xxxxxxxxxxxxxxxxxxx-my variable”。

      为了便于识别该数据是UID而不是其他字符串，因此PHP版的UID生成器使用了特殊的命名方式：ID_xxxxxxxxxxxxxxxxxxxx_DI

      原生的Scratch3.0算法并不能保证当前项目中每次生成的UID都能与已有数据不同，而两个UID如果相同，会导致程序异常。
      要使每次生成的UID绝对唯一，需要添加词典 $arrUIDHistory 。
      此操作会降低程序运行速度，但，更稳定。
 
   ***********************************************************************/
   $arrUIDHistory=Array();		//设为全局变量

   function UID()
   {
      global $arrUIDHistory;		//查字典，防止出现UID不唯一的现象。

      //在所有可读的字符中，UID数据：
      //0. 去掉了单引号和双引号，让字符串的传递和解析更简单些，
      //1. 不能有“&<>”这三个符号，否则VM生成积木会出现不报错的异常：不显示积木块；
      //2. 不能有“!+-*/()%,=”，是因为PHP在对数据进行算逻表达式处理的时候，要根据这些符号进行拆分，如果添加，会出现误拆操作。
      //3. 不能有“{}”，因为在处理注释的时候，就已经需要用到UID了，此时，有{}的话，会影响代码的拆分。

      //$soup  = '#.:;?$@[]_`{}~'.'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      $soup  = '#.:?$@[]_`~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      $id = Array();
      for ($i = 0; $i < 20; $i++) {
         $id[$i] = $soup[mt_rand(0,72) ];		//73个字符中随机抽一个
      }
      $uid=implode('',$id);
      if(!isset($arrUIDHistory[$uid]))			//如果没有查到，表示当前具有唯一性
      {
         $arrUIDHistory[$uid]=1;
         return 'ID_'.$uid.'_DI';			//为便于识别而自定义的特殊格式
      }
      else{						//不唯一，重新生成
         UID();						//递归调用虽然可能会出现锁死现象，但概率太低了，毕竟当前算法，能出现一次重复的概率就很低。
      }
   }

   /***********************************************************************

      函数调用提取

      对算术和逻辑表达式中的函数调用进行预处理，
      使得处理后的表达式能够顺利地用RPN算法进行拆分。

      此函数，将在rpn_logic_expression.class.php 和 rpn_calc_expression.class.php 中使用。

      ---------------------------------------------------------------------
      算术表达式样例：
          (我的变量 + operator_random(operator_random(-1000,1),operator_random(10,operator_random(100,1000))))

      预处理后：

          1.逻辑表达式：
          (我的变量 + ID_XLzS4kKa}~mh@YMBl0G__DI )

          2.函数调用数据：
               Array
               (
                   [0] => Array
                       (
                           [0] => operator_random
                           [1] => ID_f:{32QL3_siNm$.qxiDS_DI
                           [2] => 100,1000
                       )
                   [1] => Array
                       (
                           [0] => operator_random
                           [1] => ID_X]mit@?uEuB:rYrS=U?s_DI
                           [2] => 10, ID_f:{32QL3_siNm$.qxiDS_DI
                       )
                   [2] => Array
                       (
                           [0] => operator_random
                           [1] => ID_uFzS{yK~V$]a}vh3LHop_DI
                           [2] => -1000,1
                       )
                   [3] => Array
                       (
                           [0] => operator_random
                           [1] => ID_XLzS4kKa}~mh@YMBl0G__DI
                           [2] => ID_uFzS{yK~V$]a}vh3LHop_DI , ID_X]mit@?uEuB:rYrS=U?s_DI
                       )
               )

      ---------------------------------------------------------------------
      逻辑表达式样例：：
          operator_random(1,20)>10 && sensing_mousedown() 

      预处理后：

          1.逻辑表达式：
               ID_;7heaPO#FtTfmSI3eVM#_DI >10 && ID_n`Zjxe_yT;]=cZmPdUNM_DI 

          2.函数调用数据：
               Array
               (
                   [0] => Array
                       (
                           [0] => sensing_mousedown
                           [1] => ID_n`Zjxe_yT;]=cZmPdUNM_DI
                           [2] => 
                       )
                   [1] => Array
                       (
                           [0] => operator_random
                           [1] => ID_;7heaPO#FtTfmSI3eVM#_DI
                           [2] => 1,20
                       )
               )

   ***********************************************************************/
   function preProcessingFunctionCall($strExpression)
   {
      $_called_func = Array(		//可被调用函数白名单
         //运动
         'motion_xposition','motion_yposition','motion_direction',
         //外观
         'looks_size','looks_backdropnumbername','looks_costumenumbername',
         //声音
         'sound_volume',
         //侦测
         'sensing_touchingobject','sensing_touchingcolor','sensing_coloristouchingcolor','sensing_distanceto','sensing_answer','sensing_keypressed','sensing_mousedown','sensing_mousex','sensing_mousey','sensing_loudness','sensing_timer','sensing_current','sensing_of','sensing_dayssince2000','sensing_username',
         //运算符
         'operator_random','operator_contains','operator_join','operator_length','operator_mathop','operator_letter_of',"round","random","join",
         //变量
         'data_itemoflist','data_itemnumoflist','data_lengthoflist','data_listcontainsitem',
         //音乐
         'music_getTempo',
         //视频侦测
         'videoSensing_videoOn',
         //数学函数
         'abs','ceiling','floor','sqrt','sinf','cos','tan','atan','asin','acos','ln','log','e ^','10 ^', //sin函数会跟sensing冲突，所以改成了sinf，在匹配后，会换成sin。
      );

      $_arrFuncCalling=Array();
      $nExpLength=strlen($strExpression);
      $patt=implode("|",$_called_func);

      preg_match_all("/".$patt."/",$strExpression,$m,PREG_OFFSET_CAPTURE);

      //print_r($m);

      /*******************************************************************

         preg_match_all加了PREG_OFFSET_CAPTURE，每个匹配成功的数据里，都会有匹配数据在字符串中的开始位置偏移量。
         例如：
            operator_random(1,20)>10 && sensing_mousedown()

         匹配结果：
            Array
            (
                [0] => Array
                    (
                        [0] => Array
                            (
                                [0] => operator_random
                                [1] => 0
                            )

                        [1] => Array
                            (
                                [0] => sensing_mousedown
                                [1] => 28
                            )
                    )
            )

      *******************************************************************/

      $mc=count($m[0]);
      $nStart=0;

      for($i=$mc-1;$i>=0;$i--)			//倒序处理
      {
         $nStart=$m[0][$i][1];			//匹配位置偏移量

         $strPrefix='';
         
         if($nStart>0)							//第n条匹配数据前存在字符
         {
            $strPrefix=trim(substr($strExpression,0,$nStart));		//截取字符串
         }

         //echo "关键词从 $nStart 开始。\n";

         $j=$nStart+strlen($m[0][$i][0]);				//计算n条匹配数据后的参数的位置

         //echo "从 $j 开始搜索。\n";

         $nParenthesisCounter=0;					//括号计数器
         $bParenthesisFound=false;					//发现括号标识
         $strFuncArg='';						//参数数据
         $chCH='';							//单字符遍历检查

         /******************************************************************

            虽然提交的代码可能会出现各种各样的多余的空格：
               operator_random (  operator_random (  1,20  ),10)>10 && sensing_mousedown() ){}
            但这些数据一开始就会被拆开后分段，
            在此过程中，而多余的空格都会被过滤掉，
            所以这里不用担心小括号会无法准确定位函数参数的问题。

         ******************************************************************/

         while($j<$nExpLength)						//从偏移量开始，往字符串末尾进行搜索，获取函数完整的参数数据，以()为标记。
         {
            $chCH=$strExpression[$j++];

            ////echo $chCH."\n";
            $strFuncArg.=$chCH;
            if($chCH=='(') {$bParenthesisFound=true;$nParenthesisCounter++;}	//出现(：括号计数器自增   发现括号为真
            else if($chCH==')') $nParenthesisCounter--;				//出现)：括号计数器自建
            if($nParenthesisCounter==0 && $bParenthesisFound) break;		//括号计数器为0且发现括号，则终止当前搜索
         }
         //echo "括号匹配为： $nParenthesisCounter 括号是否发现：".$bParenthesisFound." 字符串为： $strFuncArg \n";

         $thisUID=UID();						//给被替换掉的函数设置一个UID
         if($strFuncArg!="")
         {
            $strFuncArg=substr($strFuncArg,1,-1);				//去掉头尾的一对小括号
            $arrResult[]=$thisUID;						//追加UID，用于替换原来的函数数据
            if($m[0][$i][0]=="sinf")  $m[0][$i][0]="sin";			//将sinf换回sin

            $_arrFuncCalling[]=Array($m[0][$i][0],$thisUID,trim($strFuncArg));	//将函数名和参数另存，这里加一个trim，是因为调用的函数被UID替换了，而拼接的时候，添加了空格用以隔开各个参数。
         }
         else $thisUID='';

         $strSuffix=substr($strExpression,$j,$nExpLength-$j);

         $strExpression=$strPrefix." ".$thisUID." ".$strSuffix;		//拼接的时候，加了空格

         //echo "替换后字符串为：[".$strExpression."]\n";
         $nExpLength=strlen($strExpression);				//重新计算表达式字符串的长度。虽然长度改变了，但由于替换时从末尾倒序着进行的，所以函数所在的偏移量并没有发生改变。
      }
      return Array(trim($strExpression),$_arrFuncCalling);		//返回新的表达式字符串，和相关的函数调用数据
   }
