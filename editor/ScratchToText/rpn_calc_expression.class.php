<?php
/*
 * Reverse Polish Notation
 * 逆波兰表达式
 *
 * 将四则混合运算字符串转换成逆波兰序列，并计算出结果
 *
 *  
 * 输入：1+2+3+4+5
 * 输出：12+3+4+5
 *
 * 输入：1+2+(3+4)+5  
 * 输出：12+34++5+
 *  
 * 还要处理一个线程安全问题。
 * 多次调用处理不同数据，会有数据污染。
 *  
 */
define( 'DEBUG_C', FALSE);						//调试用

class RPN_CALCULATION_EXPRESSION {
   public  $strExpression	= '';							//待计算的字符串表达式
   public  $strRPN		= '';							//生成的逆波兰表达式
   public  $nValue		= 0;							//表达式计算的结果

   private $_arrExpression	= Array();						//拆分为数组的计算表达式
   private $_rpnexp		= Array();						//队列，用于存放逆波兰表达式
   private $_stack		= Array('#');						//堆栈，用于存放操作符

   private $_preAttach		= Array();							//存放预预处理的函数数据
   private $arrExpressions	= Array();


   private $_priority 	  	= Array('#' => 0,')'=>0, '(' =>1,  '+' =>2, '-' => 2,	//计算优先级设定
                                  '*' => 3, '/' => 3,
                                  '%' => 4,
                                 // 'operator_round' => 5, 'operator_length' => 5, 'sensing_distanceto'=>5,'sensing_answer'=>5,'operator_random'=>5, //函数可以直接在这里添加，且只需要添加一次。
                                 // 'abs'=>5,'ceiling'=>5,'floor'=>5,'sqrt'=>5,'sin'=>5,'cos'=>5,'tan'=>5,'atan'=>5,
                                 // 'asin'=>5,'acos'=>5,'ln'=>5,'log'=>5,'e ^'=>5,'10 ^'=>5,//最后两个算法不支持，待研究。
				  );

   //类初始化
   //PHP8强制使用此种构造函数
   public function __construct() 
   {
      /*
        由于该类会在多个地方使用，且有时候会十分频繁，所以就不在构造函数里进行相关变量的初始化了。
        每次实例的处理，通过调用init($strExpression);来实现，其中$strExpression为待处理的算术表达式。

        算术表达式，可能是一个常数，也可能是变量，或者函数调用，或者四则混合运算，
        所以需要检测是否可以拆分。
            检测通过init()来实现，			//返回数据还需要再统一调整一下。
            输出拆分结果用toScratchJSON()来实现。
      */
   }

   /****************************************************

      算术表达式字符串预处理

        1.把缺省的乘号添进去：
           例1：2(3+4)		->	2*(3+4)
           例2：3/2(3+4)	->	3/2/(3+4)

        2.负括号开头的表达式，在前面补0：
           例2：-(1+2）		->	0-(1+2)
           如果是-1+2，则在拆分后再处理

   ****************************************************/
   public function preProcessingCalculationExpression($strCalculationExpression)
   {
      if(is_array($strCalculationExpression)) return;		//传入数组这种情况，应该是旧算法残留，需要再确认一下。

      $strResult="";
      $lastOpt='';
      if($strCalculationExpression[0]=='-' && isset($strCalculationExpression[1]) && $strCalculationExpression[1]=='(')	//解决一开始出现负括号的现象：- ( 1 + 2 )
         $strCalculationExpression='0'.$strCalculationExpression;						//解决方法：0 - ( 1 + 2 )

      $strLen=strlen($strCalculationExpression);
      for($n=0;$n<$strLen;$n++)								//在()()间添加缺省的*
      {
         if($this->checkOptChar($strCalculationExpression[$n])) $lastOpt=$strCalculationExpression[$n];	//记录下操作符：+-*/

         else if($n>0 &&  is_numeric($strCalculationExpression[$n-1]) && $strCalculationExpression[$n]=='(' ) 
         {
            if($lastOpt=="/")
               $strResult.="/";								//3/2(3+4)	->	3/2/(3+4)
            else
               $strResult.="*";								//2(3+4)	->	2*(3+4)
            $strLen++;
         }

/*
         //数字与变量的组合就不处理了，太复杂，会涉及到多个变量在一起的情况，在数学上，一个变量一个字母还可以，在计算机原理，变量可以有多个，还可以有数字，不适合省掉操作符。
         //更新，变量在处理中可以保存到全局字典中，这样就能进行匹配处理了。
         //待更新。
         if($n>0 && !$this->checkOptChar($strCalculationExpression[$n]) &&  !is_numeric($strCalculationExpression[$n]) &&  is_numeric($strCalculationExpression[$n-1])) 
         {
            echo '['.($lastOpt).']';
            if($lastOpt=="/")
               $strResult.="/";
            else
               $strResult.="*";
         }
*/
         $strResult.=$strCalculationExpression[$n];
      }


      //函数的嵌套调用问题，可以用preProcessing来处理。
      list($strResult,$this->_preAttach)=preProcessingFunctionCall($strResult);

      //print_r($this->_preAttach);
      //echo "pre:".$strResult;

      return $strResult;
   }


   //检测当前字符是否是四则运算操作符
   //也即在$_priority定义的值超过1的操作符
   function checkOptChar($opt)
   {
      if(isset($this->_priority[$opt]) && $this->_priority[$opt]>1) return 1;
      else return 0;
   }

   //初始化数据
   //RPN初始化后，可以多次调用，所以表达式的初始化，没有放在类初始化里。
   public function init($strCalculationExpression)
   {
      if($strCalculationExpression=='') return NULL;	//为空，结束。这种情况已经在执行前排除，所以可以不判断。

      $this->_preAttach=Array();	
      $this->_rpnexp = Array();				//初始化。此类允许通过eval多次计算不同的表达式，所以初始化就放在这里了。
      $this->_stack = Array('#');			//操作符堆栈
      $this->strExpression = $this->preProcessingCalculationExpression($strCalculationExpression);//$strCalculationExpression;	//预处理，解决两种情况。
      $this->_arrExpression = preg_split("/(\+)|(\-)|(\*)|(\%)|(\/)|(\()|(\))/",$this->strExpression,-1,PREG_SPLIT_DELIM_CAPTURE|PREG_SPLIT_NO_EMPTY);//将字符串表达式转成数组


//echo "preProcessingCE\n";
//print_r($this->_arrExpression);
      if(count($this->_arrExpression)==1)			//预处理后只有一个函数调用，则直接返回函数调用数据。
      {
//echo "只有一个。";
         if(isset($this->_preAttach[0]) && count($this->_preAttach[0])==3)
            return $this->_arrExpression;//FALSE;//$strCalculationExpression;//$this->exp2RPN();				//没有可拆分的运算表达式，可能是单个变量，直接返回。
         else 
            return FALSE;//返回FALSE，表示输入的数据为普通文本。
      }
      //echo "拆分后处理前。";
      //拆分后处理
      if($this->_arrExpression[0]=='-')			//解决负数开始的表达式：-1+3    -1*3
      {
         if(is_numeric($this->_arrExpression[1]))	//之所以不把这个处理放在preProcessingCalculationExpression里，是因为-1是一个操作数，不能用补零来处理。
         {
            $this->_arrExpression[0]= $this->_arrExpression[0]. $this->_arrExpression[1];	//把第一和第二个数据拼合在一起
            for($i=1;$i<count($this->_arrExpression)-1;$i++)					//后面的数据往前挪
            {
               $this->_arrExpression[$i]=$this->_arrExpression[$i+1];
            }
            unset($this->_arrExpression[$i]);							//删除最后一个数据
         }
      }

      $i=0;						//解决括号中以负数开始的表达式：(-1+3)
      $n=count($this->_arrExpression)-1;		//这里也不能补零。
      $bShift=false;
      while($i<$n)
      {
          $i++;
          if($this->_arrExpression[$i]=='-' && $this->_arrExpression[$i-1]=='(' )
          {
              $this->_arrExpression[$i]=$this->_arrExpression[$i].$this->_arrExpression[$i+1];	//把当前数据与下一条数据拼合在一起
              for($j=$i+1;$j<count($this->_arrExpression)-1;$j++)				//后面的数据往前挪
              {
                 $this->_arrExpression[$j]=$this->_arrExpression[$j+1];
              }
              unset($this->_arrExpression[$j]);							//删除最后一条数据
              $i++;										//跳过一条数据
              $n--;										//数组长度加1
          }
      }

      $i=0;						//解决括号间省略乘法的表达式：(1+3)(1+2)
      $n=count($this->_arrExpression)-1;
      $bShift=false;
      while($i<$n)
      {
          $i++;
          if($this->_arrExpression[$i]=='(' && $this->_arrExpression[$i-1]==')' )	
          {
              for($j=$n;$j>=$i;$j--)								//倒着，将当前数据往后移
              {
                 $this->_arrExpression[$j+1]=$this->_arrExpression[$j];
              }
              $this->_arrExpression[$i]="*";							//插入一个乘号
              $i++;
              $n++;										//数组长度加1
          }
      }
      $this->exp2RPN();					//转换为逆波兰表达式
      return TRUE;			//默认返回TRUE，如果是字符串，表示无运算表达式
   }

   //0.初始化逆波兰表达式数组
   //1.将四则混合运算字符串拆分为数组（若按原算法，拆分后的操作数只能是个位数。）
   //2.将数组按逆波兰排列
   //3.计算结果
   public function eval()
   {
      return $this->evalRPN( );			//计算逆波兰表达式，并返回计算结果
   }

   //对已拆分数组进行逆波兰处理
   private function exp2RPN() 
   {
      $nCheckParenthesis=0;					//用于检测左右括号是否对应
      $len = count($this->_arrExpression);				//字符串表达式已经转成了数组
      for($i = 0; $i < $len; $i++)				//遍历数组
      {
         if(DEBUG_C)
         {
            echo "\nLOOP: ".$i. "\t ORDER:". count($this->_rpnexp)."\n";
            echo "\n\n++++++++++++STACK+++++++++++:\t";print_r($this->_stack);
            echo "\n\nRPN:\t";print_r($this->_rpnexp);
         }

         $str = trim($this->_arrExpression[$i]);				//清理空格
         if ($str == '(')						//括号优先级最高，先检测是否有左括号出现
         {
            $nCheckParenthesis++;						//遇到左括号，加1；遇到右括号，减1
            $this->_stack[] = $str;						//将左括号压入运算符号堆栈
            continue;								//立刻进入下一次循环
         } 
         else if ( !isset($this->_priority[$str]) ) // !in_array($str, $this->_operator)) 			//非已定义的运算符号，即为操作数/变量
         {
            $this->_rpnexp[] = $str;						//放入输出结果数组中
            continue;								//立刻进入下一次循环
         }
         else if ($str == ')')						//右括号出现，表示有一个完整的括号结束了
         {
            $nCheckParenthesis--;						//遇到左括号，加1；遇到右括号，减1
            for($j = count($this->_stack); $j >= 0; $j--)			//倒序检测运算符堆栈，把这一对括号中的操作都输出
            {
               $tmp = array_pop($this->_stack);						//取出堆栈顶的数据
               if ($tmp == "(") break;							//直到处理完当前的整个括号内数据
               else $this->_rpnexp[] = $tmp;						//需要将该数据放入输出结果数组中
            }
            continue;								//立刻进入下一次循环
         }
         else if (isset($this->_priority[end($this->_stack)]) && $this->_priority[$str] <= $this->_priority[end($this->_stack)]) //非括号内，非操作数，即为“+、-、*、/”四个操作，需要判断优先级
         {								  	//当前操作优先级比堆栈中最后一个的操作低，则需要处理减法问题
            echo DEBUG_C?"优先级变化:当前操作：$str\t上一个操作：".end($this->_stack)."\n":'';

            $this->_rpnexp[] = array_pop($this->_stack);			//这个操作，无论“+、-、*、/”，都要追加到结果数组中

            if(count($this->_stack)>1 && ($str=='-'|| $str=='+'))		//($str=='-'|| $str=='+') 即  $this->_priority[$str]==2
            {									//当$_stack中已经寄存有未处理的操作符，而当前又出现权限较低的+和-时
               $val1=array_pop($this->_stack);					//获取$_stack堆栈顶部数据
               if($val1=='-')							//当堆栈中积存的是“-”，则需要先算这个减法
               {
                  $this->_rpnexp[]=$val1;
               }
               else
                 array_push($this->_stack,$val1);				//否则把该操作符放回去
            }

            $this->_stack[] = $str;						//将当前运算符压入堆栈
            continue;								//立刻进入下一次循环
         } 
         else								//当前操作优先级高
         {
            $this->_stack[] = $str;						//直接将操作符压入堆栈
            continue;								//直接进入下一次循环
         }
      }

      for($i = count($this->_stack); $i >= 0; $i--)			//检测堆栈中是否有遗漏的操作
      {
         if (end($this->_stack) == '#') break;					//检测到达底部，结束
         $this->_rpnexp[] = array_pop($this->_stack);				//直接追加到结果数组
      }

      //echo "RPNEXP\r\n";
      //print_r($this->_rpnexp);

      if( $nCheckParenthesis!=0 ) $this->_rpnexp=  FALSE;
      return $this->_rpnexp;						//如果输入数据有误（比如括号不匹配，连续多个运算符叠加的情况暂时没有处理），就返回FALSE；否则返回包含逆波兰表达式数据的数组
   }

   //获取表达式的计算结果
   public function evalRPN() 
   {
      if($this->_rpnexp===FALSE)
         return "括号匹配有问题。";

      $bFormula	= FALSE;
      $data	= Array();						//用于保存运算所需要的数/变量

      for($i=0;$i<count($this->_rpnexp);$i++)
      {
         if(  $this->_rpnexp[$i]!=NULL)//数据莫名其妙地多了一个NULL，暂时屏蔽。
         {
            if( !isset($this->_priority[$this->_rpnexp[$i]]) )//  !in_array($this->_rpnexp[$i],$type)		//非计算符号，则认定为数字/变量
            {
               if(!is_numeric($this->_rpnexp[$i])) $bFormula=TRUE;
               array_unshift($data,$this->_rpnexp[$i]);	//将数据(数字/变量)插入到数组$data的开头
            }
            else							//处理“+,-,*,/”
            {
               $val1=array_shift($data);				//获取数组$data的第一个数据，并删除
               $val2=array_shift($data);				//获取数组$data的第一个数据，并删除
               switch($this->_rpnexp[$i])
               {
                  case '+':
                     array_unshift($data,$val2+$val1);		//将计算结果保存到数组$data的开头
                     break;
                  case '-':
                     array_unshift($data,$val2-$val1);
                     break;
                  case '*':
                     array_unshift($data,$val2*$val1);
                     break;
                  case '/':
                     array_unshift($data,$val2/$val1);
                     break;
                  case '%':
                     array_unshift($data,$val2%$val1);
                     break;

                  //case 'operator_round':
                  //case 'operator_length':
                  //case 'operator_random':
                  //case 'sensing_distanceto':

                     array_push($data,$val2);
                     array_unshift($data,$this->_rpnexp[$i]."(".$val1.")");
                     break;
                  //default:					//由于前面if里的in_array()已经过滤了非“+,-,*,/”的情况，
                  //   break;					//所以这里的default可以安心地去掉。
               }
            }
         }
      }
      return $this->nValue=$bFormula?FALSE:current($data);	//当输入里有无法计算的字母时，返回FALSE，否则返回计算后得到的数值。
   }

   public function toScratchJSON()
   {
      $jsonArr=Array();
      $data=Array();
      if($this->_rpnexp===FALSE) return '';
      for($i=0;$i<count($this->_rpnexp);$i++)
      {

         //print_r($data);
         if(  $this->_rpnexp[$i]!=NULL)//数据莫名其妙地多了一个NULL，暂时屏蔽。
         {
            if( !isset($this->_priority[$this->_rpnexp[$i]]) )// !in_array($this->_rpnexp[$i],$type)		//非计算符号，则认定为数字/变量
            {
               if(!is_numeric($this->_rpnexp[$i])) $bFormula=TRUE;
               array_unshift($data,$this->_rpnexp[$i]);	//将数据(数字/变量)插入到数组$data的开头
               //array_unshift($data,$this->_rpnexp[$i]);	//将数据(数字/变量)插入到数组$data的开头
            }
            else							//处理“+,-,*,/”
            {
               if(isset($this->_priority[$this->_rpnexp[$i]]) && $this->_priority[$this->_rpnexp[$i]]==5 )  // $this->_rpnexp[$i]=="operator_round" || $this->_rpnexp[$i]=="operator_length"  || $this->_rpnexp[$i]=="sensing_distanceto")
               {
                  $val1=array_shift($data);				//获取数组$data的第一个数据，并删除

                  $uid=UID();
                  $jsonArr[]=Array($this->_rpnexp[$i], $uid,$val1);  //opcode,uid,arg1,//为保持一致，加一个空数据
                  array_unshift($data,$uid);
               }
               else
               {
                  $val1=array_shift($data);				//获取数组$data的第一个数据，并删除
                  $val2=array_shift($data);				//获取数组$data的第一个数据，并删除

echo "---------------------------------------\n";
var_dump($val1);
var_dump($val2);
echo "---------------------------------------\n";
                  $uid=UID();
                  $jsonArr[]=Array($this->_rpnexp[$i], $uid,$val2, $val1);  //opcode,uid,arg1,arg2

                  switch($this->_rpnexp[$i])
                  {
                  case '+':
print_r($jsonArr);
                     if($val2==NULL) return false;	//双参数操作如果只有一个参数，则该表达式不正确，只能识别为文本。
                     array_unshift($data,$uid);		//将计算结果保存到数组$data的开头
                     break;
                  case '-':
                     if($val2==NULL) return false;
                     array_unshift($data,$uid);
                     break;
                  case '*':
                     if($val2==NULL) return false;
                     array_unshift($data,$uid);
                     break;
                  case '/':
                     if($val2==NULL) return false;
                     array_unshift($data,$uid);
                     break;
                  case '%':
                     if($val2==NULL) return false;
                     array_unshift($data,$uid);
                     break;

                  //default:					//由于前面if里的in_array()已经过滤了非“+,-,*,/”的情况，
                  //   break;					//所以这里的default可以安心地去掉。
                  }
               }
            }
         }
      }
      if(DEBUG_C)
      {
         print_r($data);
         print_r($jsonArr);
      }

      $arrResult[0]=$jsonArr;

      $nOffset=empty($arrResult[0])?0:1;

      $arrResult[$nOffset]=$this->_preAttach;
/*
      $npreAttachLength=count($this->_preAttach);				//不需要倒序。
      for($i=$npreAttachLength-1;$i>=0;$i--)
      {
            $arrResult[$nOffset][]=$this->_preAttach[$i];
      }
*/
      /**************************************************************************************
          例：
              10 *2-3/4+5+ operator_random( 1+2*3/2-4,10 )

          解析结果：
              Array
              (
                  [0] => Array						//标准的算术积木块
                      (
                          [0] => Array
                              (
                                  [0] => *
                                  [1] => ID_NELoo{Nmi5EvT?k7MEn;_DI
                                  [2] => 10
                                  [3] => 2
                              )
                          [1] => Array
                              (
                                  [0] => /
                                  [1] => ID_dFv;QZIpgQ`VPFQfZ3fD_DI
                                  [2] => 3
                                  [3] => 4
                              )
                          [2] => Array
                              (
                                  [0] => -
                                  [1] => ID_3G}FIlrn2y:nJ2wICYQE_DI
                                  [2] => ID_NELoo{Nmi5EvT?k7MEn;_DI
                                  [3] => ID_dFv;QZIpgQ`VPFQfZ3fD_DI
                              )
                          [3] => Array
                              (
                                  [0] => +
                                  [1] => ID__1a0Y?VeP7WEVtPB5U@o_DI
                                  [2] => ID_3G}FIlrn2y:nJ2wICYQE_DI
                                  [3] => 5
                              )
                          [4] => Array
                              (
                                  [0] => +
                                  [1] => ID_fCyDr5Qssx2Pm5][ldHt_DI	//此为所有积木的最底层积木块UID
                                  [2] => ID__1a0Y?VeP7WEVtPB5U@o_DI
                                  [3] => ID_ZKqymJm;_Fja~_cb}pC;_DI
                              )
                      )
                  [1] => Array						//函数调用
                      (
                          [0] => Array
                              (
                                  [0] => operator_random		//函数名
                                  [1] => ID_ZKqymJm;_Fja~_cb}pC;_DI	//UID
                                  [2] => 1+2*3/2-4,10			//参数未拆分
                              )
                      )
              )
      ******************************************************************************************/

      return $arrResult;
   }


   //获取RPN数据，以数组的形式呈现
   public function getArrRPN()
   {
      return $this->_rpnexp;
   }

   //获取RPN数据，以字符串的形式呈现
   public function getStrRPN()
   {
      return ($this->_rpnexp===FALSE?NULL:implode(" ",$this->_rpnexp));
   }

   //获取表达式的计算结果
   public function getValueRPN()
   {
      return $this->nValue;
   }
};
//RPN类定义结束
?>