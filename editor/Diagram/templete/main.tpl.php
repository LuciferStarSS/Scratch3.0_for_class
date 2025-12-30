<!--流程图-->

<!--流程图主界面-->
<div id="DIAGRAM"  contenteditable="true" style="border: 1px solid;min-height:80px; min-width:444px;cursor: context-menu;position: absolute;left:8px;top: 8px;width: 800px;height: 522px;z-index: 9999990;visibility:hidden; ">
  <div id="DV">
    <div onmousedown="drag(this,event,0)" id=COLOR style="background-color:#0a0a0a">
      <div id=TITLE style="position:absolute;left:0px;top:5px;color:white;" align="center">&nbsp;&nbsp;流程图&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <div align="right" ><img style="position: relative;height:24px;width:24px;right: 5px; top: 4px;" src="./img/close.png" onclick="showDIAGRAM();"><hr></div>
    </div>
    <div id=CodeEditorX style="position:absolute;height:490px;width:800px;top:32px;left:0px;background:white;z-Index:99999999">
      <div class="flex flex-col prose">
        <div class="w-full max-w-screen-xl mx-auto">
          <!-- * * * * * * * * * * * * * -->
          <!-- Start of GoJS sample code -->
          <script src="./Diagram/js/go.js"></script>
          <div id="allSampleContent" class="p-4 w-full">
            <div style="height: 490px;">
<?php
if($admin)//教师端可以选择课程
{
?>
              <!--顶部菜单控制开始-->
              <div style="width: 200px;height:36px;position: relative;top: -24px;left: 99px;z-index: 10;font-size: 12px;">
                <select id="LESSONS" onchange="loadTask(this)" style="background: yellow;width: 93px;position: relative;left: 4px;border-radius: 3%;"><option value=>请选择课程</option><option value=>添加课程</option>
<?php
   $add="";
   $path="../data/Diagram/".$room."/".$gradeid."/";
   $lesson=@file_get_contents($path."lesson.dat");
   if(is_dir($path))
   {
      if($handle_date = opendir($path))
      {
         while (false !== ($folder = readdir($handle_date)))
         {
            if(is_dir($path.$folder) && $folder!="." && $folder!="..")				//仅显示文件，不显示目录
            {
               //$task_files[]=$file;
               echo "<option value=".$folder." ".($folder==$lesson?"selected":"").">".$folder."</option>";
            }
         }
         closedir($handle_date); 
      }
   }
?>
                </select>
                <select id=TASKS onchange="setTask(this)" style="background: yellow;width: 93px;position: relative;border-radius: 3%;"><option value=>请选择任务</option><option value=>添加任务</option>
<?php

   $path="../data/Diagram/".$room."/".$gradeid."/".$lesson."/";

   $task=@file_get_contents($path."task.dat");
   if(is_dir($path))
   {
      if($handle_date = opendir($path))
      {
         while (false !== ($folder = readdir($handle_date)))
         {
            if(is_dir($path.$folder) && $folder!="." && $folder!="..")				//仅显示文件，不显示目录
            {
               //$task_files[]=$file;
               echo "<option value=\"".$folder."\" ".($folder==$task?"selected":"").">".$folder."</option>";
            }
         }
         closedir($handle_date); 
      }
   }

?>
                </select>
<?php
}
else//学生端暂无功能，仅占位
{
?>
              <div style="display: grid;width: 100px;position: relative;top: 0px;left: 101px;z-index: 10;font-size: 12px;height:50px;">
<?php
}
?>
              </div>
              <!--顶部菜单控制结束-->

              <!--流程图程序主界面-->
              <div style="position: relative;top: -38px;height:492px;">
                <div style="width: 100%; display: flex; justify-content: space-between">
                  <div id="myPaletteDiv" style="width: 103px; top:0px; border:0px solid black; position: relative;  cursor: auto;">
                    <canvas  tabindex="0" width="100" height="400px" style="position: absolute; left: 0px; z-index: 2; user-select: none; touch-action: none; width: 103px; height:400px; cursor: auto;"></canvas>
                  </div>
                  <div id="myDiagramDiv" style="flex-grow: 1; height: 491px; border: 1px solid black; position: relative; -webkit-tap-highlight-color: rgba(255, 255, 255, 0); cursor: auto;">
                    <canvas tabindex="0" width="600px" height="400px" style="position: absolute; top: 0px; left: 0px; z-index: 2; user-select: none; touch-action: none; width: 546px; height: 480px; cursor: auto;"></canvas>
                  </div>
                </div>

                <!--操作按钮-->
                <div style="display: grid;width: 97px;height:91px;position: relative;top: -93px;left: 3px;z-index: 10;font-size: 12px;">
<?php
if($admin)	//教师端两个按钮
{
?>
                  <button style="margin-bottom: 2px;" onclick="load('teacher',1)" title="重新打开当前任务。">刷新当前任务</button>
                  <button onclick="upload('teacher')" style="background: red;margin-bottom: 2px"  title="点击此按钮可以完成作业上交操作。">提交任务数据</button>
<?php
}
else		//学生端三个按钮
{
?>
                  <button style="margin-bottom: 2px;" onclick="load('teacher',1)"  title="如果做错了，可以点击此按钮加载最初的数据。">刷新当前任务</button>
                  <button onclick="load('',1)" style="background: yellow;margin-bottom: 2px"  title="点击此按钮可以打开最后一次上交的数据。">查看已交数据</button>
                  <button onclick="upload()"   style="background: red;margin-bottom: 2px"  title="点击此按钮可以完成作业上交操作。">提交任务数据</button>
<?php
}
?>          
                </div>
                <!-- * * * * * * * * * * * * * -->
                <!--  End of GoJS sample code  -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!--流程图控制-->
<script src="./Diagram/js/DiagramController.js"></script>
<script>
   window.addEventListener('DOMContentLoaded', init);
</script>

<!--流程图-->