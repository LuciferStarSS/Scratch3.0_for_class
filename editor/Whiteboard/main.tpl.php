<!--小白板-->
<!--小白板包含了小白板、图片编辑器、部分控制菜单等组件-->
<!--小白板-->
<div alignstyle="0"  ID="WHITEBOARD" style="position: absolute;border-radius: 3%;z-index:9999; background: #DC5713;width: 656px;height: 518px; margin-bottom: 10px;font-size: 13px; left: 50%; top: 50%; -webkit-transform: translate（-50%，-50%）;transform: translate(-50%,-50%);display:block">
  <div style="position:relative;width:100%;top:0px;left:29px;"  >
<?php
   //获取白板现有数据
   $pos=@file_get_contents("../data/config/".$room."/".$classid.".bdpos.dat");//获取已发布的数据

   $posArr=json_decode($pos);		//已被添加的数据：类型(IMG/DIV)，图片文件路径/DIV数据，left坐标，Top坐标
   //print_r($posArr);

   $idArr=Array();			//已被添加的数据中的ID：文件名
   $existedDIV="";			//已被添加的数据生成的DIV
   if($posArr!=NULL)  			//每组数据由四个数据组成：IMG/DIV, IMG URL/DIV TEXT, LEFT, TOP
   {

      for($i=0;$i<count($posArr);$i++)
      {
         $idtype=$posArr[$i][0];               //类型
         if($idtype=="IMG")
         {
            $ids=explode("/",$posArr[$i][1]);   //IMG中放图片URL，DIV中放文本

            $idsc=count($ids);
            $id=substr($ids[$idsc-1],0,strrpos($ids[$idsc-1],'.'));

            $bLine=($ids[$idsc-2]=="LINES")?true:false;

            $idArr[]=$ids[$idsc-1];
            if($admin)			//教师可以对DIV进行管理：拖动和删除
            {
               $existedDIV.="      <div id='".$id."' class='ATTACH' style='position: absolute;left:".$posArr[$i][2]."px;top:".$posArr[$i][3]."px'  onmouseover='showControl(this);' onmouseout='hideControl(this);'>\r\n";
               $existedDIV.="        <div style='visibility:hidden;background: ghostwhite; width: 62px; height: 22px; position: relative;'>\r\n";
               $existedDIV.="          <img title='回收' src='./img/recycle.png' style='position: relative;display: inline-block;top: 2px;' onclick='recycleImg(\"".($bLine?"./LINES/":"").$ids[$idsc-1]."\");'>\r\n";

               if(stripos($ids[$idsc-1],".gif")==false)
                  $existedDIV.="          <img title='编辑' src='./img/edit.png' style='position: relative;display: inline-block;left:1px; top: 2px;' onclick='editImg(\"".($bLine?"./LINES/":"").$ids[$idsc-1]."\");'>\r\n";

               $existedDIV.="          <img title='彻底删除' src='./img/delete.png' style='position: relative;display: inline-block;left:2px; top: 2px;' onclick='deleteImg(\"".($bLine?"./LINES/":"").$ids[$idsc-1]."\");'>\r\n";
               $existedDIV.="        </div>\r\n";
               $existedDIV.="        <img src='".$posArr[$i][1]."' title='".$id."' onmousedown='dragBD(this,event);'>\r\n";
               $existedDIV.="      </div>\r\n";
            }
            else				//学生只能查看。
            {
               $existedDIV.="         <div id='".$id."' class='ATTACH' style='position: absolute;left:".($posArr[$i][2]+12)."px;top:".($posArr[$i][3]+16)."px'>";		//教师端（有控制按钮）跟学生端不一样，所以有偏差。
               $existedDIV.="           <img src='".$posArr[$i][1]."' title='".$id."' alt='".$id."' onmousedown='drag(this,event,3);'>";
               $existedDIV.="         </div>";
            }
         }
         else if($idtype=="VIDEO")
         {
            $ids=explode("/",$posArr[$i][1]);   //IMG中放图片URL，DIV中放文本
            $idsc=count($ids);
            $id=substr($ids[$idsc-1],0,strrpos($ids[$idsc-1],'.'));
            $idArr[]=$ids[$idsc-1];
            if($admin)			//教师可以对DIV进行管理：拖动和删除
            {
               $existedDIV.="         <div id='".$id."' class='ATTACH' style='position: absolute;left:".$posArr[$i][2]."px;top:".$posArr[$i][3]."px'  onmouseover='showControl(this);' onmouseout='hideControl(this);'>\r\n";
               $existedDIV.="           <div style='visibility:hidden;background: ghostwhite; width: 90px; height: 22px; position: relative;'>\r\n";
               $existedDIV.="             <img title='回收' src='./img/recycle.png' style='position: relative;display: inline-block;top: 2px;' onclick='recycleImg(\"".$ids[$idsc-1]."\");'>\r\n";

               $existedDIV.="           <img title='增加高度' src='./img/vup.png' style='position: relative;display: inline-block; left:4px;top: 2px;' onclick='videoHeightUP(this);'>";
               $existedDIV.="           <img title='降低高度' src='./img/vsub.png' style='position: relative; display: inline-block;left:8px;top: 2px;' onclick='videoHeightDOWN(this);'>";

               $existedDIV.="             <img title='彻底删除' src='./img/delete.png' style='position: relative;display: inline-block;left:12px; top: 2px;' onclick='deleteImg(\"".$ids[$idsc-1]."\");'>\r\n";
               $existedDIV.="           </div>\r\n";
               $existedDIV.="           <video controls height='".$posArr[$i][4]."' src='".$posArr[$i][1]."' title='".$id."' onmousedown='dragBD(this,event);'>\r\n";
               $existedDIV.="         </div>\r\n";
            }
            else				//学生只能查看。
            {
               $existedDIV.="         <div id='".$id."' class='ATTACH' style='position: absolute;left:".($posArr[$i][2]+12)."px;top:".($posArr[$i][3]+16)."px'>";		//教师端（有控制按钮）跟学生端不一样，所以有偏差。
               $existedDIV.="           <video height='".$posArr[$i][4]."' src='".$posArr[$i][1]."' title='".$id."'  onmousedown='drag(this,event,3);'>";
               $existedDIV.="         </div>";
            }
         }
         else if($idtype=="DIV")
         {
            if($admin)			//教师可以对DIV进行管理：拖动和删除
            {
               $existedDIV.="         <div id='NEWTEXT_".($i+1)."' class='ATTACH' style='position: absolute;width:60px; left:".$posArr[$i][2]."px;top:".$posArr[$i][3]."px' onmouseover='showControl(this);' onmouseout='hideControl(this);'>";
               $existedDIV.="         <div style='visibility:hidden;background: ghostwhite;width:146px;'>";
               $existedDIV.="           <img title='回收' src='./img/recycle.png' style='position: relative;display: inline-block;top: 2px;' onclick='removeText(\"NEWTEXT_".($i+1)."\");'>";
               $existedDIV.="           <img title='加大字号' src='./img/fadd.png' style='position: relative;display: inline-block;left:0px;top: 2px;' onclick='sizeUP(this);'>";
               $existedDIV.="           <img title='缩小字号' src='./img/fsub.png' style='position: relative;display: inline-block;left:2px;top: 2px;' onclick='sizeDOWN(this);'>";
               $existedDIV.="           <img title='收窄' src='./img/wsub.png' style='position: relative;display: inline-block;left:2px;top: 2px;' onclick='widthDOWN(this);'>";
               $existedDIV.="           <img title='拉宽' src='./img/wadd.png' style='position: relative;display: inline-block;left:2px;top: 2px;' onclick='widthUP(this);'>";

               preg_match("/color: ([^^]*?);/",$posArr[$i][1],$m);
               $select_color='';
               if(count($m)==2 && $m[1]!="")
               $select_color=$m[1];

               $existedDIV.="           <select title='修改颜色' style='position: relative;display: inline-block;left: 2px;top:-2px;color:".$select_color."' onchange='changeColor(this);'>";
               $existedDIV.="	          <option style='color:black;' ".($select_color=="black"?"selected":"")." value=black>黑</option>";
               $existedDIV.="	          <option style='color:white;' ".($select_color=="white"?"selected":"")." value=white>白</option>";
               $existedDIV.="	          <option style='color:red;' ".($select_color=="red"?"selected":"")." value=red>红</option>";
               $existedDIV.="	          <option style='color:yellow;' ".($select_color=="yellow"?"selected":"")." value=yellow>黄</option>";
               $existedDIV.="	          <option style='color:blue;' ".($select_color=="blue"?"selected":"")." value=blue>蓝</option>";
               $existedDIV.="	          <option style='color:green;' ".($select_color=="green"?"selected":"")." value=green>绿</option>";
               $existedDIV.="           </select>";
               $existedDIV.="         </div>";

               $existedDIV.="       <div onmousedown='dragBD(this,event);' ondblclick='editText(this);'>".$posArr[$i][1]."</div></div>";
            }
            else				//学生只能查看。
            {
               $existedDIV.="       <div id='NEWTEXT_".($i+1)."' class='ATTACH' style='position: absolute;left:".($posArr[$i][2]+12)."px;top:".($posArr[$i][3]+17)."px'>";	//教师端（有控制按钮）跟学生端不一样，所以有偏差。
               $existedDIV.="         ".$posArr[$i][1]."</div>";
            }
         }
         else if($idtype=="COVER")
         {
            if($admin)
               $existedDIV.="       <div id='NEWTEXT_".($i+1)."' class='ATTACH' style='width: 650px;    height: 480px;    position: absolute;    left: -16px;    top: 25px;    background: beige;border-radius: 3%;'    ondblclick=\"this.style.visibility='hidden';\"></div>";	//遮罩页
            else
               $existedDIV.="       <div id='NEWTEXT_".($i+1)."' class='ATTACH' style='width: 650px;    height: 480px;    position: absolute;    left: -6px;    top: 19px;    background: beige;border-radius: 3%;' onmousedown='drag(this,event,1);'></div>";	//遮罩页
         }
      }
   }
?>
    <div class="circle" <?php echo ($admin)?"onmouseover=\"hideOPTMenu();\" onmouseup='hideHistoryTXT();'":"";?>  id="WB" alignstyle="0" style="border-radius: 3%;background: white;width: 650px;height:480px;left: -26px;top:35px;position:absolute;"></div>
<?php
   //遍历./board文件夹，获取小白板已上传图片附件
   $add="./WhiteBoard/".$room."/".$gradeid."/";
   $bd_files=Array();				//白板中已存在的图片资源
   if(is_dir($add))
   {
      if ($handle_date = opendir($add))
      {
         while (false !== ($file = readdir($handle_date)))
         {
            if (!is_dir($add.$file))
            {
               if(!in_array($file,$idArr))		//过滤掉已经使用的附件。
               {
                  $bd_files[]=$file;
               }
            }
         }
         closedir($handle_date); 
      }
   }
   $bfc=count($bd_files);			//白板中已存在图片计数器
?>
    <!--白板表头-->
    <div id="header"   style="left:-12px;top:6px;position:absolute; width:620px;" >
      <div id="drag"  ondragstart='dragBD(this,event);' onmousedown="drag(this,event,2)" style="left: -17px; top: -6px; position: absolute; width: 656px; height: 518px;" <?php echo ($admin)?"onmouseover=\"hideOPTMenu();\" onmouseup='hideHistoryTXT();'":"";?>></div>
<?php
   if($admin)//教师显示控制按钮
   {
?>
        <!--已存素材：图片、视频-->
<?php
      echo "        <select id=attach onchange='addImg();' title='添加预设的图片板书' style='height: 25px;width:90px;position: absolute;left:-6px;'><option value=''>请选择素材</option>";
      for($i=0;$i<$bfc;$i++)
      {
         echo "<option value=".$bd_files[$i].">".substr($bd_files[$i],0,strrpos($bd_files[$i],'.'))."</option>";
      }
      echo "        </select>\n";
?>
        <!--实时板书生成功能-->
        <div style="position: absolute;top: 0px;left: 86px;z-Index:99999;">
          <!--输入文本或粘贴图片、视频-->
          <input type="text" style="width:155px; height:19px; " id="addtxt" placeholder="此处可粘贴图片/文字/视频" autocomplete="off"   onfocus="showHistoryTXT();" oninput="showHistoryTXT();">
          <!--在输入时，调取历史文本记录备选-->
          <div id=historyTXT style="visibility:hidden;"></div>
          <select id="fontsize" style="position: absolute;top: 0px;left: 162px;height: 25px;" title="设置文字的字号/线条的粗细">
            <option style="font-size:14px;" value="14" title="线条粗细为1">14</option>
            <option style="font-size:18px;" value="18" title="线条粗细为2">18</option>
            <option style="font-size:22px;" selected value="22" title="线条粗细为3">22</option>
            <option style="font-size:26px;" value="26" title="线条粗细为4">26</option>
            <option style="font-size:30px;" value="30" title="线条粗细为5">30</option>
            <option style="font-size:34px;" value="34" title="线条粗细为6">34</option>
          </select>
          <select id="color" style="position: absolute;top: 0px;left: 198px;height: 25px;" title="设置文字的颜色" onchange="this.style.color=this.value;">
            <option style="color:black;" value="black">黑</option>
            <option style="color:white;" value="white">白</option>
            <option style="color:red;" value="red">红</option>
            <option style="color:yellow;" value="yellow">黄</option>
            <option style="color:blue;" value="blue">蓝</option>
            <option style="color:green;" value="green">绿</option>
          </select>
          <input style="position: absolute;top: 0px;left: 235px;height: 25px;" type="button" value="添加" title="在小白板中添加文字板书。" onclick="addText();">

          <!--选中后，可用鼠标在小白板上手绘线条-->
          <input style="position: absolute;top: 0px;left: 278px;height: 25px;" type="checkbox" title="选中时可添加鼠标手绘线条" onclick="addLines();"  id="DRAWLINES">

          <!--此撤销会将小白板上内容按后进先出的顺序删除-->
          <a onclick="undoOneStep();" style="position: absolute; top: 2px; left: 294px; height: 25px; width: 40px; font-size: 14px;color:white" title="删除小白板上最后一个数据">撤销</a>

          <!--调整小白板的背景颜色，此操作会同步到学生端-->
          <div style="position: absolute;left: 328px;top: 1px; height:25px;">
            <input type=button style='position: absolute;left: 0px;background:white;height:22px;border:white' onclick="setBGColor('white');" title='设置小白板的背景色'>
            <input type=button style='position: absolute;left: 13px;background:black;height:22px;border:black;' onclick="setBGColor('black');" title='设置小白板的背景色'> 
            <input type=button style='position: absolute;left: 26px;background:bisque;height:22px;border:bisque;' onclick="setBGColor('bisque');" title='设置小白板的背景色'>
            <input type=button style='position: absolute;left: 39px;background:burlywood;height:22px;border:burlywood;' onclick="setBGColor('burlywood');" title='设置小白板的背景色'>
            <input type=button style='position: absolute;left: 52px;background:chocolate;height:22px;border:chocolate;' onclick="setBGColor('chocolate');" title='设置小白板的背景色'>
            <input type=button style='position: absolute;left: 65px;background:darkgoldenrod;height:22px;border:darkgoldenrod;' onclick="setBGColor('darkgoldenrod');" title='设置小白板的背景色'>
            <input type=button style='position: absolute;left: 78px;background:darkseagreen;height:22px;border:darkseagreen;' onclick="setBGColor('darkseagreen');" title='设置小白板的背景色'>
            <!--input type=button style='position: absolute;left: 91px;background:darkgray;height:22px;border:darkgray;' onclick="setBGColor('darkgray');" title='设置小白板的背景色'-->
          </div>
          <!--在讲解时，为屏蔽干扰，可将教师端的Scratch编辑器暂时隐藏-->
          <input style="position: absolute;top: 0px;left: 420px;height: 25px;" type="checkbox" title="选中时隐藏编辑器页面" onclick="hideBackground(this);" id="hidebg">
          <!--扩展菜单，以便放入更多控制操作-->
          <div style="position: absolute;top: 0px;left: 434px;width:68px;height:25px;z-Index:99999" onmouseover="showOPTMenu();" >
            <input  type="button" value="更多操作" style="height: 25px;">
            <div id=menu style="visibility:hidden;">
              <input style="position: relative;width:70px;" type="button" value="擦黑板" title="清空小白板上所有内容。" onclick="cleanBD();">
              <input style="position: relative;width:70px;" type="button" value="自评表" title="显示本课自评量表。" onclick='sendSEV();'>
              <input style="position: relative;width:70px;" type="button" value="空白页" title="插入空白页，盖住现有内容。" onclick="coverBD();">
              <input style="position: relative;width:70px;" type="button" value="小白板" title="强制学生端打开小白板。" onclick='add("[\"MENU\",\"\"]");'>
              <input style="position: relative;width:70px;" type=button value="查看进度" title="强制学生端执行快照生成操作。" onclick='showWorks();add("[\"SAVESNAPSHOT\",\"\"]");'>
              <input style="position: relative;width:70px;" type=button value="收作业" title="强制学生端执行作业上传操作。" onclick='add("[\"SAVEFILE\",\"\"]");'>
              <input style="position: relative;width:70px;" type=button value="采集参数" title="获取赛车游戏中各参数。" onclick='viewArg(this);'>
              <input style="position: relative;width:70px;" type=button value="采集参数2" title="获取赛车游戏中各参数。" onclick='viewArg2(this);'>
              <input style="position: relative;width:70px;" type=button value="同台竞技" title="打开同台竞技大舞台。" onclick='openStage();'>
              <input style="position: relative;width:70px;" type=button value="禁用加速" title="禁止学生端使用加速模式">
              <!--input style="position: relative;width:70px;" type="button" value="学生作品" title="查看当前学生已上交作品" onclick="showWorks();"-->
              <!--input style="position: relative;width:70px;" type="button" value="在线学生" title="查看当前学生端登录情况" onclick="showList();"-->
              <!--input style="position: relative;width:70px;" type="button" value="下载作品" title="批量下载Scratch比赛作品" onclick="getWorks();"-->
              <!--input style="position: relative;width:70px;" type="button" value="刷新" title="强制刷新学生端，包括上课登记页面。" onclick="refreshRemote();"-->
              <!--input style="position: relative;width:70px;" type="button" value="置顶" title="强制学生端的页面回到顶部。" onclick="goTop();"-->
              <!--input style="position: relative;width:70px;" type="button" value="清除" title="清除学生端所有Cookie数据。" onclick="doCleaning();"-->

              <input style="position: relative;width:70px;" type="button" value="重置服务" title="为保证稳定，预防性地重启WebSocket服务器。" onclick="reboot1();">
              <input style="position: relative;width:70px;" type="button" value="存档" title="保存当前小白板数据。" onclick="saveBD(1);">
              <input style="position: relative;width:70px;" type="button" value="调档" title="调取小白板历史数据。" onmouseover="getBOARDList();">
              <div id=sub></div><!--小白板历史存档数据列表-->
              <!--input style="position: relative;width:70px;" type="button" value="任务单" title="强制学生端打开任务单。" onclick="showTask();"--> 
            </div>
          </div>
          <!--教师端教师默认可以拖动小白板上的元素，但这样的话，就无法选择小白板上的文字，所以需要添加此控制-->
          <div style="position: absolute;left: 504px;top: 2px; height:25px; font-size: 18px;color:white;">
            <input type=checkbox id=DRAG checked=true onclick="setDragFunc();" title="选中时白板内容可拖动">
          </div>
        </div>
        <!--网络工具的上报数据显示器：适用于赛车项目-->
        <div id="msg_argviewer"  onmousedown="drag(this,event,1)" style="width: 620px;border: 1px solid gray;height: 383px;float: left;text-align: left;left: 0px;position: absolute;top: 110px;display:none;z-index:9999;overflow: hidden;border-radius:3%; background: white;">
          <div style="position: relative; height: 20px; border-bottom: 1px solid green; background: lightgrey; font-size: 16px; font-weight: bold;" onclick="setViewerScroll(this);">
            <span style="left: 50px; position: absolute;">姓名</span>
            <span style="left: 120px; position: absolute; text-align: center; width: 80px;">用时</span>
            <span style="left: 210px; position: absolute; text-align: center; width: 80px;">步长</span>
            <span style="left: 300px; position: absolute; text-align: center; width: 80px;">左转</span>
            <span style="left: 390px; position: absolute; text-align: center; width: 80px;">右转</span>
          </div>
          <div style="position: relative; height: 20px; font-size: 16px; font-weight: bold;top:-21px;left:500px">
            <input type="button" value="清零" style="left: 0px; top: -1px; position: absolute; text-align: center; width: 61px; height: 22px; font-size: 14px;" onclick="argArr.length=0;document.getElementById('msg_argviewer_data').innerHTML='';">
            <input type="button" value="暂停" style="left: 60px; top: -1px; position: absolute; text-align: center; width: 61px; height: 22px; font-size: 14px;" onclick="setDataCollectingStatus(this);">
          </div>
          <div id=msg_argviewer_data style="top: -20px; position: relative;"></div>
        </div>
        <!--网络工具的上报数据显示器2：适用于普通竞速项目-->
        <div id="msg_argviewer2"  onmousedown="drag(this,event,1)" style="width: 620px;border: 1px solid gray;height: 383px;float: left;text-align: left;left: 0px;position: absolute;top: 110px;display:none;z-index:9999;overflow: hidden;border-radius:3%; background: white;">
          <div style="position: relative; height: 20px; border-bottom: 1px solid green; background: lightgrey; font-size: 16px; font-weight: bold;" onclick="setViewerScroll(this);">
            <span style="left: 25px; position: absolute;">玩家</span>
            <span style="left: 90px; position: absolute; text-align: center; width: 200px;">作品</span>
            <span style="left: 280px; position: absolute; text-align: center; width: 80px;">得分</span>
            <span style="left: 400px; position: absolute; text-align: center; width: 80px;">时间</span>
          </div>
          <div style="position: relative; height: 20px; font-size: 16px; font-weight: bold;top:-21px;left:500px">
            <input type="button" value="清零" style="left: 0px; top: -1px; position: absolute; text-align: center; width: 61px; height: 22px; font-size: 14px;" onclick="argArr2.length=0;document.getElementById('msg_argviewer2_data').innerHTML='';">
            <input type="button" value="暂停" style="left: 60px; top: -1px; position: absolute; text-align: center; width: 61px; height: 22px; font-size: 14px;" onclick="setDataCollectingStatus(this);">
          </div>
          <div id=msg_argviewer2_data style="top: -20px; position: relative;"></div>
        </div>
        <!--隐藏小白板按钮-->
        <img id="closeWB" style="position: absolute;visibility:hidden;height:24px;width:24px;right:-10px;top:0px;" src="./img/close.png" title="隐藏小白板" alt="隐藏小白板" onclick="showtasks();">
      </div>
<?php
   }
   else echo "         <!--学生端-->\n         <div  style='width: 615px;text-align: center;font-size:18px;color: white;'>小&nbsp;&nbsp;白&nbsp;&nbsp;板</div> <img  id='refreshWB' style='position: absolute;visibility:hidden;height:24px;width:24px;left:0px;top:1px;' src='./img/refresh.png' title='刷新小白板（新增回放功能）' alt='刷新小白板（新增回放功能）' onclick='playBDPos(null);'><img  id='closeWB' style='position: absolute;visibility:hidden;height:24px;width:24px;right:-10px;top:1px;' src='./img/close.png' title='隐藏小白板' alt='隐藏小白板' onclick='showtasks();'>";	//学生端显示小白板

   echo "      <!--小白板上的图片、文字和视频，都将添加到这里-->\n    <div id='attachments' style='left:-10px;top:10px;position:absolute;'>";					//存放白板上的图片和文字
   echo $existedDIV;														//已存在的图片或文本DIV
   echo "</div>";
   echo "        <!--小白板上的文本数据双击后可修改，修改完毕按回车键-->\n      <input type=txt name=texteditor id=texteditor style=\"visibility:hidden;position: absolute;left:0px;top:0px;width:0px;height:0px;z-index:9;\">";
?>  
      <!--小白板历史数据重播控制按钮-->
      <div id=back  style="position: absolute; left: <?php echo $admin?262:274;?>px; top: <?php echo $admin?491:485;?>px;visibility:hidden;opacity:0.5" onmouseover="changeOpacity(this,1);" onmouseout="changeOpacity(this,0.3);" ><img src=./img/back.png title="上一条" onclick="PlayBack();"></div>
      <!--div id=all   style="position: absolute; left: <?php echo $admin?287:299;?>px; top: <?php echo $admin?491:485;?>px;visibility:hidden"><img src=./img/all.png title="最后一条" onclick="PlayAll();"></div-->
      <div id=pause style="position: absolute; left: <?php echo $admin?312:324;?>px; top: <?php echo $admin?491:485;?>px;visibility:hidden;opacity:0.5" onmouseover="changeOpacity(this,1);" onmouseout="changeOpacity(this,0.3);"><img src=./img/play.png title="下一条" onclick="continuePlay();"></div>
<?php
   if($admin)		//教师端底部背景色控制
   {
?>
    <!--用于鼠标手绘线条-->
      <canvas id="myLines" width="650px" height="480px" style="visibility:hidden;position: absolute; width: 650px; height: 480px; left: -26px; top: 35px; border-radius: 3%; z-index: 9999999;">></canvas>
      <div id=tail style="position: absolute;top: 516px;left: -12px;">
<?php
      if($afc>0)			//附件显示以及相关链接的控制
      {
         echo "        <label style='position: absolute;left: 125px;width: 100px'><select  onchange=\"showAttach(this);\" style=\"width:90px;\"><option>请选择附件</option>";
         echo "<option value=\"|HIDEALLNOW|\">隐藏全部附件</option>";
         for($a=0;$a<$afc;$a++)
         {
            echo "<option value=".$att_files[$a].">".$att_files[$a]."</option>";
         }
         echo "        </select></label>";
      }
?>
      </div>
<?php
   }
?>
    </div>
  </div>
</div>

<script>



</script>  
<script src=./js/page_bd.js></script>
<script>


//手动刷新小白板
function refreshWB()
{
   //updateBOARD();
   //bPLAYALL=true;
   playBDPos(null);
}



refreshWB();
//隐藏小白板
function hideWB()
{
   document.getElementById("WHITEBOARD").style.visibility="hidden";
   document.getElementById("closeWB").style.visibility="hidden";
<?php
if(!$admin){
?>
   document.getElementById("refreshWB").style.visibility="hidden";
<?php
}
?>
   hideOPTMenu();
}
</script>

<?php
   if($admin)
   {
?>
<!--绘画作品展示-->
<script>


</script>
<!--教师端学生进度查询，可查看学生舞台的预览图（非实时，查看最近一次的数据，数据生成操作在控制菜单中）-->
<div id="ImageViewer"  contenteditable="true" style="border: 1px solid;min-height:80px; min-width:444px;cursor: context-menu;position: absolute;left:8px;top: 8px;width: 800px;height: 700px;z-index: 9999990;background-color: rgb(204, 204, 204);visibility:hidden; ">
  <div id="CP">
    <div onmousedown="drag(this,event,0)" id=COLOR style="background-color:#0a0a0a">
      <div id=TITLE style="position:absolute;left:0px;top:5px;color:white;" align="center">&nbsp;&nbsp;学生作品欣赏&nbsp;&nbsp;&nbsp;&nbsp;<span id=TOTAL></span>
      </div>
      <div align="right" >
        <img style="position: relative;height:24px;width:24px;right: 10px; top: 5px;" src="./img/pause.png" onclick="pause(this);" id=SETPLAY title="暂停">
        <img style="position: relative;height:24px;width:24px;right: 5px; top: 5px;" src="./img/align_m.png" onclick="setView();" id=SETVIEW title="切换到多图模式">
        <img style="position: relative;height:24px;width:24px;right: 0px; top: 5px;" src="./img/refresh.png" onclick="reloadIV();" title="重新加载">&nbsp;&nbsp;
        <img style="position: relative;height:24px;width:24px;right: 5px; top: 5px;" src="./img/close.png" onclick="closeIV();"><hr>
      </div>
    </div>
    <div align="right" style="position: absolute; right: 145px;top: 6px;width: 36px;">
      <select title="自动更新间隔" onchange="changeSpeed(this);" id=rt style="font-size: 21px; position: relative; right:30px;top: -2px;">
        <option value=1000>1秒</option><option value=2000>2秒</option><option value=3000>3秒</option><option value=4000>4秒</option><option value=5000 selected>5秒</option>
        <option value=6000>6秒</option><option value=7000>7秒</option><option value=8000>8秒</option><option value=9000>9秒</option><option value=10000>10秒</option>
      </select>
    </div>
    <div id=pictureviewer style="position:absolute;height:700px;width:800px;top:37px;left:0px;background:hsla(215, 100%, 65%, 1);z-Index:99999999">
       <iframe src="about:blank" id=viewer style="width: 800px;height: 700px;" noborder></iframe>
    </div>
  </div>
</div>


<!--图片编辑器-->
<div id="ImageEditor"  contenteditable="true" style="border: 1px solid;min-height:80px;min-width:444px;cursor: context-menu;position: absolute;left:180px;top: 180px;width: 300px;height: 444px;z-index: 99990;background-color: rgb(204, 204, 204);visibility:hidden; ">
  <div id="CP">
    <div onmousedown="drag(this,event,0)" id=COLOR style="background-color:#0a0a0a">
      <div id=TITLE style="position:absolute;left:0px;top:5px;color:white;" align="center">&nbsp;&nbsp;图片编辑
        <div style="left: 85px;/* width: 110px; */position: relative;height: 27px;width: 70px;/* right: 5px; */top: -24px;">
          <img id="IEUNDO" title="撤销" onclick="ieundo();" src="./img/undo.png" style="position: absolute; left: 0px; visibility: hidden; top: 7px;"><SPAN id=IEUNDOV  style="position: absolute;left: 0px;font-size: 12px; top: -3px; text-align: center;"></SPAN>
          <img id="IEREDO" title="重做" onclick="ieredo();" src="./img/redo.png" style="position: absolute; right: 0px; visibility: hidden; top: 7px;"><SPAN id=IEREDOV style="position: absolute;right: 0px;font-size: 12px;top: -3px;text-align: center;"></SPAN>
        </div>
      </div>
      <div align="right" ><img style="position: relative;height:24px;width:24px;right: 7px; top: 7px;" src="./img/close.png" onclick="closeIE();"><hr></div>
    </div>
    <div style="margin: 0px 7px auto;text-align: center;">
      <div align="center" id=COLOR_CHANGER style="visibility:visible">
        <!--原图放在这里，原图不显示-->
        <div align="center" id=BACKUP style="display:none"><img id=RAW style="display:none"></div><!--预览图放在这里-->
        <div align="center" id=PREVIEW style="cursor: initial;"></div><!--预览图放在这里-->
        <div align="center" id=SHIELD style="height:0px;"></div><!--遮罩图放在这里-->
      </div>
      <div align="center" id=RECT_SELECTOR style="height:0px;visibility:hidden"><!--切图选择器放在这里-->
        <canvas align="center" id=SELECTOR style="width:0px;height:0px"></canvas>
      </div>

      <div align="center">
        <hr>
        <label><input type=checkbox name=IES id=IES onclick="setColorPicker();" title="鼠标在图片上点选颜色，即可完成相应的透明操作。">修改颜色<span ID=INFO style="font-size:12px;">(当前为切图模式)</span></label>
        <div id="SETTRANS" style="display: block;/* left: 20px; */position: relative;width: 100%;height: 158px;text-align: left;">
          <hr>
          <div style="width: 114px;position:absolute;text-align: left;top:0px;">
                <span style="position: absolute;left: 8px;top: 8px;">操作：</span>
            <label style="position: relative;top: 33px;width: 110px;left: 6px;"><input type="radio" name="MTYPE" value="CM" checked  onclick="setAlgorithm(this);" style="width:18px;">简单替换</label><br>
            <label style="position: relative;top: 35px;width: 110px;left: 6px;"><input type="radio" name="MTYPE" value="FF" onclick="setAlgorithm(this);" style="width:18px;">区域填充</label>
            <hr style="position: relative;    top: 32px;    width: 81px;    left: -3px;">
            <label style="position: relative;top: 27px;width: 110px;left: 6px;"><input type="checkbox" id="NEWOLD" onclick="addColor();" style="width:18px;">追加模式</label><br>
          </div>

          <hr style="position: absolute; top: 115px; width: 400px; left: 12px;">
          <label style="position: relative;top: 124px;left:14px;">
             <span style="position:absolute;font-size:14px;right:4px;top:-7px;text-align:center;" id="GVALUE">0</span>
             颜色匹配阈值：<input type="range" id="GATE" style="width: 290px;top:5px;position: relative;" max="255" min="0" value="0" step="1" onchange="setPreview(this);" title="阈值控制">
          </label>

          <div style="height:40px;width:305px;position:absolute;left: 124px;top: 8px;text-align:left;">
            <span style="position: absolute;text-align: left;left: -4px;">设置替换颜色：</span>
            <input type="button" id="COLORVIEW" style="position: relative;left: 6px;top: 29px;width: 64px;height: 54px;background: rgb(0, 0, 0, 0);">
            <label style="position: absolute;left:2px;top: 86px;width: 200px;"><input type="checkbox" checked="" name="T" id="T" onclick="setColorType();" title="鼠标在图片上点选颜色，即可完成相应的透明操作。">透明色</label>
            <div id="RGBA" style="position: absolute;left: 76px;text-align: left;top: 24px;">
               R:<input type="text" value="0" id="RV" style="width: 26px;text-align: center;left: 20px;position: absolute;" onchange="setSubValue(this);"><input type="range" style="width: 160px;left: 58px;position: absolute;" id="RR" max="255" min="0" value="0" step="1" onchange="setSubColor(this);"><br>
               G:<input type="text" value="0" id="GV" style="width: 26px;text-align: center;left: 20px;position: absolute;" onchange="setSubValue(this);"><input type="range" style="width: 160px;left: 58px;position: absolute;" id="GR" max="255" min="0" value="0" step="1" onchange="setSubColor(this);"><br>
               B:<input type="text" value="0" id="BV" style="width: 26px;text-align: center;left: 20px;position: absolute;" onchange="setSubValue(this);"><input type="range" style="width: 160px;left: 58px;position: absolute;" id="BR" max="255" min="0" value="0" step="1" onchange="setSubColor(this);"><br>
               A:<input type="text" value="0" id="AV" style="width: 26px;text-align: center;left: 20px;position: absolute;" onchange="setSubValue(this);"><input type="range" style="width: 160px;left: 58Px;position: absolute;" id="AR" max="255" min="0" value="0" step="1" onchange="setSubColor(this);"><br>
            </div>
          </div>
        </div>

        <div style="position: relative;top:0px;"><hr><input type="button" id="SAVE" onclick="uploadImg();" title="上传图片" value="上传">&nbsp;<input type="button" value="切除周边透明区域后上传" title="去掉四周透明" onclick="shrinkImg();"></div>
      </div>
    </div>
  </div>
</div>
<!--图片编辑-->

<?php
   }
?>
<!--小白板-->

<script>
<?php
if(!$admin){
?>
   document.getElementById("refreshWB").style.visibility="visible";				//小白板窗口刷新按钮。当该窗口出现关闭按钮，就表示系统已经展开完毕。
<?php
}
?>
</script>

<script src="./Whiteboard/js/WBController.js"></script>
