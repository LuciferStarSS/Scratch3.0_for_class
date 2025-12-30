<!-- 积木与文本代码互换页面 CSS -->
<style>
############大编辑窗口宽度调整功能
.container {
    display: flex;
    gap: 30px;
    margin-bottom: 40px;
}
.resizable-box {
    background-color: #e8f4fc;
    border: 2px dashed #3498db;
    padding: 20px;
    margin: 20px 0;
    min-height: 150px;
    position: relative;
    overflow: auto;
}
/* 标准右下角resize */
.standard-resize {
    resize: both;
}
/* 左侧resize实现 */
.left-resize-container {
    position: relative;
    margin: 20px 0;
}
.left-resize-handle {
    position: absolute;
    left: -7px;
    top: 0px;
    bottom: 0px;
    width: 6px;
    background-color: #dbbf34;
    cursor: col-resize;
    #border-radius: 5px 0 0 5px;
}
.left-resize-content {
    margin-left: 6px;
    background-color: #e8f4fc;
    border: 2px dashed #3498db;
    border-left: none;
    padding: 20px;
    min-height: 150px;
    overflow: auto;
}
</style>

<!--大窗口代码编辑器-->
<link rel="stylesheet" type="text/css" href="./ScratchToText/static/devc.css">
<div id="CodeEditor" contenteditable="true" style="border: 1px solid;min-height:80px; min-width:444px;cursor: context-menu;position: absolute;left:8px;top: 8px;width: 900px;height: 694px;z-index: 9999990;visibility:hidden; resize: horizontal;overflow: auto;">
  <div id="CE">
    <div onmousedown="drag(this,event,0)" id=COLOR style="background-color:#0a0a0a">
      <div id=TITLE style="position:absolute;left:0px;top:7px;color:white;" align="center">&nbsp;&nbsp;代码编辑器&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <div align="right" >           
        <img src="./img/fsub.png" title="缩小字体" style="position: absolute;top:8px;left:120px; z-index: 5;text-align: center;cursor: pointer;background: rgb(255,255,255);border: 1px solid;width: 20px;height: 18px;font-weight: bold;" contenteditable="false" onclick="setSize(1,-2);" />
        <img src="./img/fadd.png" title="加大字体"  style="position: absolute;top: 8px;left:150px; z-index: 5;text-align: center;cursor: pointer;background: rgb(255,255,255);border: 1px solid;width: 20px;height: 18px;font-weight: bold;" contenteditable="false" onclick="setSize(1,2);" />
        <img style="position: relative;height:24px;width:24px;right: 5px; top: 5px;" src="./img/close.png" onclick="hideCE();" title="退出大窗口编辑模式"><hr>
      </div>
    </div>
    <div  ondblclick="hideCE();"  id=CodeEditorEX style="position:absolute;height:662px;width:100%;top:32px;left:0px;background:hsla(215, 100%, 65%, 1);z-Index:99999999;overflow: hidden;">
      <div id="text-code-ace" class="hidden"></div>
    </div>
  </div>
  <div>
    <div id=intel style="position:absolute; background:yellow;visibility:hidden;"></div>
    <div id="intel_view" style="position:absolute; background:gray;visibility:visible;z-index=100000000000"></div>
  </div>
</div>

<!-- 相关脚本 -->
<script src="./ScratchToText/static/ace/ace.js"></script>
<script src="./ScratchToText/js/STTController.js"></script>

<script>
  //injectCODEEDITOR();
</script>

<!--大窗口代码编辑器-->