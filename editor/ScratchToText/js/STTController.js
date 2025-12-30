    // The Ace editor needs divs instead of textareas
    // So we hide the textarea and show a div instead
    var currentEditor=null;

    document.getElementById("text-code-ace").classList.remove("hidden");

    // Set up the editor
    var editor = ace.edit("text-code-ace");

    editor.setTheme("ace/theme/tomorrow");
    var language ="c_cpp";
    editor.getSession().setMode("ace/mode/" + language);

    function hideCE()
    {
       if(currentEditor)
       {
          currentEditor.setValue(editor.getValue());
          currentEditor.clearSelection();
       }
       document.getElementById("CodeEditor").style.visibility="hidden";
       document.getElementById("intel").innerHTML="";
       document.getElementById("intel_view").innerHTML="";
    }

    function showCE()
    {
       document.getElementById("CodeEditor").style.left="311px";
       document.getElementById("CodeEditor").style.top="92px";

       document.getElementById("CodeEditor").style.visibility="visible";
    }

    function setSize(id,n)
    {
       var editor=document.getElementById("text-code-ace");

       if(editor.style.fontSize=='') 
          editor.style.fontSize="14px";
       //else
          editor.style.fontSize=(parseInt(editor.style.fontSize)+n)+"px";

       if(parseInt(editor.style.fontSize)<12)
       {
          editor.style.fontSize="12px";
       }
    }


function convertToC()
{
   var target=oVMM.props.vm.runtime.getEditingTarget();

   //获取舞台背景数据
   $.post("./ScratchToText/convertToC.php?t=" + Math.random(), { "D":JSON.stringify(target.blocks._blocks),"C":JSON.stringify(target.comments)}, function (data) 
   {
     if(data.length>0){ 
        alert(data);
        //document.getElementById("subStage").innerHTML=data;
        //document.getElementById("subCostume").style.visibility="hidden";
     }
  });
}


//显示类C代码编辑器

var bTEXTCODINGVIEW=false;
var listTEXTCODING=null;
var tabTEXTCODING=null;

var handle = null;
var content =null;
var isResizing=true;

function insertCodeEditor()
{
   bCode=true;
   var nPlace=0;

   //var o1=document.getElementById("react-tabs-0");
   //var o=document.getElementById("react-tabs-1");
   var tab=document.getElementsByClassName("react-tabs_react-tabs__tab-panel_3p4DW gui_tab-panel_22sLx react-tabs_react-tabs__tab-panel--selected_18BFr gui_is-selected_sHAiu");

   var viewCODE=document.getElementById("CODEVIEW");
   if(viewCODE==null)//tab[0].children[nPlace].id!="CODEVIEW")//判断CodeViewer是否已经显示
   {
      bTEXTCODINGVIEW=false;
      var children=Array();
      for(i=0;i<tab[0].children.length;i++)
      {
         children.push(tab[0].children[i]);
      }
      var d=document.createElement("div");
      d.id="CODEVIEW"
      d.style="display: block;transform: translate(60px, 0px);opacity: 1;right:60px;/*right:47px;width: 276px;*/min-width: 279px;height:100%;background:hsla(215, 100%, 65%, 1);position: absolute;z-index: 100;";
      listTEXTCODING=d;


      handle=document.createElement("div");
      handle.id="resizeHandle";
      handle.className="left-resize-handle";
      handle.title="左右拖动可调整大小。";

      d.appendChild(handle);

      var frame=document.createElement("iframe");
      frame.className="left-resize-content";
      frame.id="CV";
      frame.name="CV";
      frame.src="./ScratchToText/codeViewer.html";
      frame.style="position: relative; padding:0px;min-width:276px; width: 279px;left:-7px;height:100%;border:none";
      frame.setAttribute("scrolling","no");

      d.appendChild(frame);

      content = frame;

      //var db=document.createElement("div");
      //db.id="buttons"
      //db.style="display: grid;transform: translate(60px, 0px);opacity: 1;left: -60px;width: 100%;height: 60px;position: absolute;z-index: 100;";
      //d.appendChild(db);


      for(i=0;i<children.length;i++)
      {
         if(i==nPlace)
            tab[0].appendChild(d);			//插入编辑器
            tab[0].appendChild(children[i]);
      }

      var inX = setInterval(function()		//每隔500ms检测CodeViewer页面是否已经展开。
      {
         if(bCVLoaded)
         {
            clearInterval(inX);
            getCode();
         }
      },500);
   }
}

//隐藏类C代码编辑器
function hideCode()
{
   bCode=false;
   document.getElementById("CODEVIEW").style.display="none";
   //var oExtentionButton=document.getElementsByClassName("gui_extension-button-container_b4rCs box_box_2jjDp");
   //oExtentionButton[0].style.position="absolute";
   //oExtentionButton[0].style.left="0px";
}


//代码编辑器显示与隐藏控制
function showTEXTCODING()
{
   var tab=document.getElementsByClassName("react-tabs_react-tabs__tab-list_17Wee gui_tab-list_87TYM");
   //var o=document.getElementById("react-tabs-0");			//切换语言后，这个ID会变，所以还是得用ClassName来判断。
   if(tab[0].children[0].getAttribute("aria-selected")=='true')			//确认当前是“代码”视图
   {
      listTEXTCODING=document.getElementById("CODEVIEW");
      if(listTEXTCODING==null)					//代码编辑页面未创建
      {
         insertCodeEditor();


         // 初始化
         //document.addEventListener('DOMContentLoaded', () => {
         window.resizableCodeView = new ResizableCodeView();
            
         // 添加一个可视化边界线（可选）
         const borderLine = document.createElement('div');
         borderLine.className = 'border-line';
         borderLine.style.right = '0';
         borderLine.style.background = '#4c97ff';
         document.body.appendChild(borderLine);
         //});
      }
      if(listTEXTCODING)
      {
         listTEXTCODING.style.display=bTEXTCODINGVIEW?"hidden":"block";
         bTEXTCODINGVIEW=!bTEXTCODINGVIEW;
      }
      if(bTEXTCODINGVIEW)					//控制开关颜色调整
      {
         tabTEXTCODING.children[0].children[0].style.background="white";
      }
      else
      {
         hideCode();
         tabTEXTCODING.children[0].children[0].style.background="";
      }
   }
}



var arrLoadedExtension=[];

//检测是否需要加载特殊扩展
function isExtraExtensionNeeded(extID)
{
   var arrExtraExtension=["pen","music","videoSensing"];
   return arrExtraExtension.includes(extID);
}




function analyzeTextLines(text, options = {}) {
    const {
        fontSize = 16,
        fontFamily = 'sans-serif',
        lineHeight = 1.2,
        containerWidth = Infinity
    } = options;

    // 创建临时 canvas 用于测量
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置字体
    ctx.font = `${fontSize}px ${fontFamily}`;
    
    // 分割文本为行
    const lines = text.split('\n');
    let totalLines = 1;

    // 处理每行文本
    lines.forEach(line => {
        if (line === '') {
            totalLines++;
            return;
        }

        // 如果设置了容器宽度，需要处理自动换行
        if (containerWidth < Infinity) {
            const words = line.split(' ');
            let currentLine = '';
            
            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                const width = ctx.measureText(testLine).width;
                
                if (width > containerWidth){// && currentLine !== '') {
                    totalLines+=Math.ceil(width/containerWidth);
                } else {
                    totalLines++;
                }
            }
        } else {
            // 直接测量整行
            const width = ctx.measureText(line).width;
            totalLines++;
        }
    });

    // 返回结果
    return {
        totalLines,
    };
}



//将类C代码转成图形化的积木
function getBlock()
{

   var globalV=oVMM.props.vm.runtime.targets[0].variables;         //获取适用于所有角色的变量，也就是定义在舞台里的所有变量

   const jsonNAMEID={};
   for(var i=0;i<Object.values(globalV).length;i++)
   {
      jsonNAMEID[Object.values(globalV)[i].name]=Object.values(globalV)[i].id;
   }

   //获取当前角色脚本的C代码
   $.post("./ScratchToText/convertToB.php?t=" + Math.random(),
   {
      "D0":JSON.stringify(jsonNAMEID),
      "D1":window['CV'].editor1.getValue() ,		//适用于所有角色的变量
      "D2":window['CV'].editor2.getValue() ,		//仅适用于当前角色的变量
      "D3":window['CV'].editor3.getValue() +"\n\n"+ window['CV'].editor4.getValue()	//控制代码
   },
   function (data) 
   {
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//引用的某一文件里如果也有BOM，则会叠加进来
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头

      var dataArr=data.split("\n");					//用于屏蔽脚本的错误信息输出。
      if(dataArr.length>1)
         data=dataArr[dataArr.length-1];

      var bCleaned=false;
      var target_id=0;
      if(data.length>0)
      {
         let jsonData={};
         try{
            jsonData=JSON.parse(data);
         }catch(err){}

         if(JSON.stringify(jsonData)=="{}") return;			//返回为空，执行结束

         var globalV=oVMM.props.vm.runtime.targets[0].variables;         //获取适用于所有角色的变量，也就是定义在舞台里的所有变量

         var gvNAME=Array();			//保存变量名，用于识别重复添加
         var gvID=Array();			//保存变量ID，用于生成积木块里对变量的调用

         var glNAME=Array();			//保存列表名，用于识别重复添加
         var glID=Array();			//保存列表ID，用于生成积木块里对变量的调用

         var gbNAME=Array();			//保存消息名，用于识别重复添加
         var gbID=Array();			//保存消息ID，用于生成积木块里对变量的调用

         for(var i=0;i<Object.values(globalV).length;i++)
         {
            if(Object.values(globalV)[i].type=="list")			//列表
            {
               glNAME[i]=Object.values(globalV)[i].name;
               glID[i]=Object.values(globalV)[i].id;
            }
            else if(Object.values(globalV)[i].type=="broadcast_msg")	//广播消息
            {
               gbNAME[i]=Object.values(globalV)[i].name;
               gbID[i]=Object.values(globalV)[i].id;
            }
            else							//变量
            {
               gvNAME[i]=Object.values(globalV)[i].name;
               gvID[i]=Object.values(globalV)[i].id;
            }
         }


//跟积木块一样，先全删，再重添
//但全局的不能这样操作，会影响其他角色的脚本
/*

变量、列表和消息需要分开处理，三者的命名互不干扰的。


1.获取舞台角色的所有变量
NAME=>ID

2.检测是否需要修改：
   a.代码中有新变量：增加
   b.现有变量没有在代码中出现：保留
   c.维护最终变量列表

3.如当前非舞台角色，则
   a.删除当前角色所有变量
   b.添加代码中当前角色的变量
   c.维护最终变量列表

注：
1.仅适用于当前角色的变量，不能跟舞台变量的名字冲突；
2.非舞台变量名在角色间可以重复，角色内不可重复。

*/

         if(jsonData[0][0]!=undefined)			//解析适用于所有角色的变量
         {
            var target=oVMM.props.vm.runtime.targets[0];
            for(var i=0;i<Object.values(jsonData[0]).length;i++)	//将代码中的变量加入当前项目
            {
               if(jsonData[0][i][1]=="LIST")		//列表变量
               {
                  if(glNAME.indexOf(jsonData[0][i][2])==-1)		//新增全局变量，放在舞台角色中。
                  {								//数组字段：{ID,TYPE,NAME,VALUE}
                     target.createVariable(jsonData[0][i][0],jsonData[0][i][2],"list",false);	//创建列表。
                     var listData=jsonData[0][i][3].match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'));//获取默认值数据
                     if(listData)	//有默认值
                     {
                        listData=jsonData[0][i][3].match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'))[0].split(",");
                        listData= listData.map(function(item) { return trimChar(item," ");});
                        listData= listData.map(function(item) { return trimChar(item,"'");});
                        listData= listData.map(function(item) { return trimChar(item,'"');});
                        target.variables[jsonData[0][i][0]].value=listData;
                     }
                     else		//无默认值
                     {
                        target.variables[jsonData[0][i][0]].value=new Array();
                     }
                     glNAME.push(jsonData[0][i][2]);									//出现新变量，保存到数组中。
                     glID.push(jsonData[0][i][0]);									//脚本中凡所涉及的变量，都要从这里获取ID。
                  }
                  else			//已经存在的变量，则修改默认数值
                  {
                     //oVMM.props.vm.runtime.targets[0].variables[glID[glNAME.indexOf(jsonData[0][i][2])]].value= jsonData[0][i][3].match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'))[0].split(",");
                     var listData=jsonData[0][i][3].match(new RegExp("(?<=\{)(.+?)(?=\})", 'g')); //设置默认值
                     if(listData)	//有默认值
                     {
                        listData=jsonData[0][i][3].match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'))[0].split(",");
                        listData= listData.map(function(item) { return trimChar(item," ");});
                        listData= listData.map(function(item) { return trimChar(item,"'");});
                        listData= listData.map(function(item) { return trimChar(item,'"');});
                        target.variables[glID[glNAME.indexOf(jsonData[0][i][2])]].value=listData;
                     }
                     else		//无默认值
                     {
                        target.variables[glID[glNAME.indexOf(jsonData[0][i][2])]].value=new Array();
                     }
                  }
               }
               else if(jsonData[0][i][1]=="MSG")	//广播消息变量						//注意：如果定义的广播消息没有在代码中被使用，则该定义无效，会被自动清理。
               {
                  if(gbNAME.indexOf(jsonData[0][i][2])==-1)			//新增全局变量，放在舞台角色中。
                  {								//数组字段：{ID,TYPE,NAME,VALUE}
                     target.createVariable(jsonData[0][i][0],jsonData[0][i][2],"broadcast_msg",false);	//创建列表。
                     //oVMM.props.vm.runtime.targets[0].variables[jsonData[0][i][0]].value=jsonData[0][i][3];//.match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'))[0].split(","); //设置默认值
                     gbNAME.push(jsonData[0][i][2]);									//出现新变量，保存到数组中。
                     gbID.push(jsonData[0][i][0]);									//脚本中凡所涉及的变量，都要从这里获取ID。
                  }
                  //else//MSG无独立的value，所以不需要修改数值
                  //{
                  //   oVMM.props.vm.runtime.targets[0].variables[gbID[gbNAME.indexOf(jsonData[0][i][2])]].value= jsonData[0][i][3];//.match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'))[0].split(",");
                  //}
               }
               else					//普通变量
               {
                  if(gvNAME.indexOf(jsonData[0][i][2])==-1)			//新增全局变量，放在舞台角色中。
                  {								//数组字段：{ID,TYPE,NAME,VALUE}
                     target.createVariable(jsonData[0][i][0],jsonData[0][i][2],"",false);	//创建变量
                     target.variables[jsonData[0][i][0]].value=jsonData[0][i][3];		//设置默认值
                     gvNAME.push(jsonData[0][i][2]);									//出现新变量，保存到数组中。
                     gvID.push(jsonData[0][i][0]);									//脚本中凡所涉及的变量，都要从这里获取ID。
                  }
                  else//修改数值
                  {
                     target.variables[gvID[gvNAME.indexOf(jsonData[0][i][2])]].value= jsonData[0][i][3];//.match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'))[0].split(",");
                  }
               }
            }
         }

         var target=oVMM.props.vm.runtime.getEditingTarget();
         if(target.isStage!=true)					//如果当前正在编辑的是舞台，那么仅适用于当前角色的变量也仍是适用于所有角色的，
         {								//适用于所有角色的变量可能被其它角色使用，所以不能删除重建（重建后变量ID会变，导致其它角色访问变量时出错。）
            target.variables={};					//删除当前角色（非舞台）的所有变量
         }
         if(jsonData[1][0]!=undefined)			//解析仅适用于当前角色的变量
         {
            for(var i=0;i<Object.values(jsonData[1]).length;i++)	//将仅适用于当前角色的变量加入当前项目
            {
               if(jsonData[1][i][1]=="LIST")					//区分普通变量与特殊列表
               {
                  if(glNAME.indexOf(jsonData[1][i][2])==-1)				//列表要在glNAME里寻找是否已存在
                  {
                     target.createVariable(jsonData[1][i][0],jsonData[1][i][2],"list",false);
                     var listData=jsonData[1][i][3].match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'));
                     if(listData)
                     {
                        listData=jsonData[1][i][3].match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'))[0].split(",");
                        listData = listData.map(function(item) { return trimChar(item," ");});
                        listData = listData.map(function(item) { return trimChar(item,"'");});
                        listData = listData.map(function(item) { return trimChar(item,'"');});
                        target.variables[jsonData[1][i][0]].value= listData;//jsonData[1][i][3].match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'))[0].split(",");
                     }
                     else 
                        target.variables[jsonData[1][i][0]].value= new Array();//"{}".split(');listData;//jsonData[1][i][3].match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'))[0].split(",");
                     glNAME.push(jsonData[1][i][2]);
                     glID.push(jsonData[1][i][0]);
                  }
                  else//修改数值
                  {
                     var listData=jsonData[1][i][3].match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'));
                     if(listData)
                     {
                        listData=jsonData[1][i][3].match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'))[0].split(",");
                        listData = listData.map(function(item) { return trimChar(item," ");});
                        listData = listData.map(function(item) { return trimChar(item,"'");});
                        listData = listData.map(function(item) { return trimChar(item,'"');});
                        target.variables[glID[glNAME.indexOf(jsonData[0][i][2])]].value= listData;//jsonData[1][i][3].match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'))[0].split(",");
                     }
                     else 
                        target.variables[glID[glNAME.indexOf(jsonData[0][i][2])]].value= new Array();//"{}".split(');listData;//jsonData[1][i][3].match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'))[0].split(",");
                     //target.variables[glID[glNAME.indexOf(jsonData[0][i][2])]].value= jsonData[1][i][3].match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'))[0].split(",");
                  }
               }
               //else if(jsonData[1][i][1]=="MSG")				//注意：消息必须是适用于所有角色的变量。如果定义为仅适用于当前角色，虽然能成功定义，但并不能正常使用。
               //{
               //   if(gbNAME.indexOf(jsonData[1][i][2])==-1)
               //   {
               //      target.createVariable(jsonData[1][i][0],jsonData[1][i][2],"broadcast_msg",false);
               //      //MSG无单独的value，value跟name保持一致。
               //      //oVMM.props.vm.runtime.targets[0].variables[jsonData[1][i][0]].value= jsonData[1][i][3];//.match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'))[0].split(",");
               //      gbNAME.push(jsonData[1][i][2]);
               //      gbID.push(jsonData[1][i][0]);
               //   }
               //   //else//MSG无独立的value，所以不需要修改数值
               //   //{
               //   //   oVMM.props.vm.runtime.targets[0].variables[gbID[gbNAME.indexOf(jsonData[0][i][2])]].value= jsonData[1][i][3];//.match(new RegExp("(?<=\{)(.+?)(?=\})", 'g'))[0].split(",");
               //   //}
               //}
               else								//此为普通变量
               {
                  if(gvNAME.indexOf(jsonData[1][i][2])==-1)				//列表要在gvNAME里寻找是否已存在
                  {
                     target.createVariable(jsonData[1][i][0],jsonData[1][i][2],"",false);
                     target.variables[jsonData[1][i][0]].value=jsonData[1][i][3];
                     gvNAME.push(jsonData[1][i][2]);
                     gvID.push(jsonData[1][i][0]);
                  }
                  else//修改数值
                  {
                     target.variables[gvID[gvNAME.indexOf(jsonData[0][i][2])]].value=jsonData[1][i][3];
                  }
               }
            }
         }

         if(jsonData[2][0]!=undefined)							//生成积木块
         {
            bCODECHANGED=true;
            //var target=oVMM.props.vm.runtime.getEditingTarget();

            var oldBlocks=target.blocks._blocks;
            //oldBlocks={};						//删除当前角色现有的全部积木块
            $.each(oldBlocks,function (id,item){
               if(id!="undefined" && id!='null')
                  target.blocks.deleteBlock(id);					//通过ID删除
            });
      
            bCleaned=true;

            var j=jsonData[2];
            for(var i=0;i<Object.keys(j).length;i++)
            {
               let   newItem={};
               try{
                  newItem=JSON.parse(j[i]);
               }catch(err){}

               if(JSON.stringify(newItem)!="{}" && newItem.id!="null")
               {

                  var extensionID=newItem.opcode.split("_")[0];
                  if(isExtraExtensionNeeded(extensionID))				//检测该扩展是否需要先加载
                  {
                     if(!arrLoadedExtension.includes(extensionID))			//检测本地是否已经加载过
                     {
                        arrLoadedExtension.push(extensionID);
                        if(!oVMM.props.vm.extensionManager.isExtensionLoaded(extensionID))	//确认虚拟机里是否加载
                           oVMM.props.vm.extensionManager.loadExtensionIdSync(extensionID);	//加载扩展
                     }
                  }
                  if(newItem.opcode=="data_variable")						//变量已创建，用已有的ID
                  {
                     var VID=gvID[gvNAME.indexOf(newItem.fields.VARIABLE.value)];
                     newItem.fields.VARIABLE.id=VID;
                  }
                  else if(newItem.opcode=="data_showvariable") 
                  {
                     var VID=gvID[gvNAME.indexOf(newItem.fields.VARIABLE.value)];
                     newItem.fields.VARIABLE.id=VID;
                  }
                  else if(newItem.opcode=="data_changevariableby") 
                  {
                     var VID=gvID[gvNAME.indexOf(newItem.fields.VARIABLE.value)];
                     newItem.fields.VARIABLE.id=VID;
                  }
                  else if(newItem.opcode=="event_whenbroadcastreceived") 			//广播消息已创建，用已有的ID
                  {
                     var VID=gbID[gbNAME.indexOf(newItem.fields.BROADCAST_OPTION.value)];
                     newItem.fields.BROADCAST_OPTION.id=VID;
                  }
                  else if(newItem.opcode=="event_broadcast_menu") 
                  {
                     var VID=gbID[gbNAME.indexOf(newItem.fields.BROADCAST_OPTION.value)];
                     newItem.fields.BROADCAST_OPTION.id=VID;
                  }

                  ////////////////////////////////////////////////////如果是变量的话，还要从gvID/glID里获取ID
                  target.blocks.createBlock(newItem);
               }
            }
         }

         if(jsonData[3][0]!=undefined)							//生成注释积木块
         {
            bCODECHANGED=true;
            //var target=oVMM.props.vm.runtime.getEditingTarget();

            target.comments={};		         			//快速清除数据，数组用[]，JSON Object用{}。
            /*
            var arrComments=target.comments;
            var nCommentsLength=Object.keys(arrComments).length;
            for(var i=0;i<nCommentsLength;i++)
            {
               delete arrComments[Object.keys(arrComments)[i]];
            }
            */
            bCleaned=true;

            var j=JSON.parse(jsonData[3]);
            var nHeightOffset=10;
            for(var i=0;i<Object.keys(j).length;i++)
            {
               var BlockUID   = j[i][1];				//服务端数据里把数字偏移量作为key传输过来，可以减少总数据量。
               if(BlockUID==null || target.blocks._blocks[BlockUID]!=undefined)
               {

                  var CommentUID = j[i][0];
                  var CommentText= j[i][2];

                  //获取block的x和y坐标
                  var x=500;
                  var y=nHeightOffset;
                  var width=300;

                  const result = analyzeTextLines(CommentText, {		//利用canvas计算文字占几行
                     fontSize: 14,
                     fontFamily: 'Arial',
                     containerWidth: width  // 如果有限制宽度
                  });

                  var height=60+result.totalLines*20;			//60：最小状态下高度，实际为54左右；  20：每行文本需要的高度
                  nHeightOffset+=height+20;				//20：每两条注释间的距离

                  target.createComment(CommentUID, BlockUID,CommentText,x,y,width,height,false);
               }
            }
         }

         //var target=oVMM.props.vm.runtime.getEditingTarget();
         target.deleteMonitors();					//删除变量指示器
         if(bCleaned)
         {
            oVMM.props.vm.refreshWorkspace();				//刷新工作区
            Blockly.getMainWorkspace().cleanUp();			//整理积木
            newInfo("本次转换操作，执行了"+jsonData[4]+"秒。",true,false);
         }

         bCODECHANGED=false;				//提交更新后，可以再次从服务器上获取最新脚本。

      }
   });
}

//将图形化的积木转成类C代码
function getCode()
{
   if(bCODECHANGED) 		return;		//如代码已经被修改，在确认保存前，就不再从服务器获取新数据进行刷新了。
   if(window['CV']==undefined) 	return;		//窗口不存在，意味着异常，直接退出。

   var viewer1=window['CV'].editor1;//.getValue();//getElementById("CODE_VAR_GLOBAL");	//适用于所有角色的变量，也即定义在舞台这个角色上的变量
   var viewer2=window['CV'].editor2;//.getValue();//.getElementById("CODE_VAR_LOCAL");	//仅适用于当前角色的变量
   var viewer3=window['CV'].editor3;//.getValue();//.getElementById("CODE_HATS");	//有事件开头的积木
   var viewer4=window['CV'].editor4;//.getValue();//.getElementById("CODE_FREE");	//零散的积木
   if(viewer1!=undefined)
   {
      if(oVMM.props.vm.runtime.targets.length>0)//在伪代码视图显示的时候，执行撤销和重做操作加载项目文件的时候，也会触发getCode，这就会产生异常。
      {
         viewer1.setValue("");//innerTEXT="";
         viewer2.setValue("");//innerTEXT="";
         viewer3.setValue("");//innerTEXT="";
         viewer4.setValue("");//innerTEXT="";

         var target=oVMM.props.vm.runtime.getEditingTarget();
         var variables={
            'GV': oVMM.props.vm.runtime.targets[0].variables,  //适用于所有角色的变量。同：oVMM.props.vm.runtime.getTargetForStage().variables;
            'CV': target['isStage']==true?{}:target.variables  //舞台不存在仅适用于当前角色的变量
         };
         //获取当前角色脚本的类C代码
         $.post("./ScratchToText/convertToC.php?t=" + Math.random(), { "D":JSON.stringify(target.blocks._blocks),"V":JSON.stringify(variables),"C":JSON.stringify(target.comments)}, function (data) 
         {
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头

            var dataArr=data.split("\n");
            if(dataArr.length>1)
               data=dataArr[dataArr.length-1];
            

            if(data.length>0){ 
               let jdata={};
               try{
                  jdata=JSON.parse(data);
               }catch(err){}
 
               if(JSON.stringify(jdata)=="{}") return;
               viewer1.setValue(jdata[0]);//innerHTML=jdata[0];
               viewer1.clearSelection();
               viewer2.setValue(jdata[1]);//.innerHTML=jdata[1];
               viewer2.clearSelection();
               viewer3.setValue(jdata[2]);//.innerHTML=jdata[2];
               viewer3.clearSelection();
               viewer4.setValue(jdata[3]);//.innerHTML=jdata[3];
               viewer4.clearSelection();
               //window['CV'].hljs.highlightAll();
            }
         });
      }
   }
}

/////////////////////////////////////////////////////////////类C编辑器：积木与类C代码互转




/////////////////////////////////////////////////////////////类C编辑器：积木与类C代码互转
var bCVLoaded=false;
var blockViewer=document.getElementsByClassName("injectionDiv");

//代码编辑器入口按钮注入
function injectCODEEDITOR()
{
   var d=document.getElementsByClassName("gui_tabs_AgmuP");
   if(d==undefined) return;
   var newTABDIV=document.getElementById("NEWTAB1");
   if(newTABDIV==undefined)
   {
      var d=document.getElementsByClassName("gui_tabs_AgmuP");
      var newTabDiv=document.createElement("DIV");
      newTabDiv.style="    position: absolute;   right: 0px;      display: flex; ";
      newTabDiv.id="NEWTAB1";
      d[0].appendChild(newTabDiv);
      newTABDIV=newTabDiv;
   }

   var viewCheck=document.getElementById("CODEEDITORBUTTON");
   if(viewCheck==undefined)
   {
      tabTEXTCODING=document.createElement("div");						//标签
      tabTEXTCODING.style="position: relative;";//right:192px;";
      tabTEXTCODING.title="文本代码编辑器";
      tabTEXTCODING.id="CODEEDITORBUTTON";
      var ul=document.createElement("ul");

      ul.className="react-tabs_react-tabs__tab-list_17Wee gui_tab-list_87TYM";

      ul.style.width="112px";
      var li=document.createElement("li");

      li.className="react-tabs_react-tabs__tab_3Nn-X gui_tab_27Unf";
      li.setAttribute("role","tab");
      var span=document.createElement("span");

      span.innerHTML="代码编辑器";

      li.appendChild(span);
      ul.appendChild(li);
      tabTEXTCODING.appendChild(ul);
      tabTEXTCODING.onclick=function(){

         showTEXTCODING();
      }
      newTABDIV.appendChild(tabTEXTCODING);
   }
}





        class ResizableCodeView {
            constructor() {

                this.codeViewContainer = document.getElementById('CODEVIEW');
                this.codeViewer = document.getElementById('CV');
                this.resizeHandle = document.getElementById('resizeHandle');
                
                this.isResizing = false;
                this.startX = 0;
                this.startWidth = 0;
                this.minWidth = 279;
                //this.maxWidth = blockViewer[0].clientWidth-blockViewer[0].children[0].clientWidth-blockViewer[0].children[4].clientWidth-7;//800;
                this.currentWidth = this.minWidth;
                
                this.init();
            }
            
            init() {
                // 设置初始状态
                this.codeViewContainer.style.width = this.currentWidth + 'px';
                
                // 绑定指针事件
                this.resizeHandle.addEventListener('pointerdown', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.startResize(e);
                    
                    // 设置指针捕获
                    this.resizeHandle.setPointerCapture(e.pointerId);
                });
                
                // 使用事件委托来处理指针移动
                document.addEventListener('pointermove', (e) => {
                    if (this.isResizing) {
                        e.preventDefault();
                        this.doResize(e);
                    }
                });
                
                document.addEventListener('pointerup', (e) => {
                    if (this.isResizing) {
                        e.preventDefault();
                        this.stopResize();
                        if (this.resizeHandle.hasPointerCapture(e.pointerId)) {
                            this.resizeHandle.releasePointerCapture(e.pointerId);
                        }
                    }
                });
                
                // 双击手柄重置
                this.resizeHandle.addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    this.resetWidth();
                });
                
                // 窗口大小变化时调整
                window.addEventListener('resize', () => {
                    this.handleWindowResize();
                });
                
                // 初始化边界检查
                this.handleWindowResize();
            }
            
            startResize(e) {
                this.isResizing = true;
                this.startX = e.clientX;
                this.startWidth = this.codeViewContainer.offsetWidth;
                this.currentWidth = this.startWidth;
                
                // 添加拖动状态
                this.resizeHandle.classList.add('dragging');
                document.body.style.userSelect = 'none';
                document.body.style.cursor = 'col-resize';
            }
            
            doResize(e) {
                if (!this.isResizing) return;
                
                const currentX = e.clientX;
                const deltaX = currentX - this.startX;
                
                // 计算新宽度
                // 向右拖动 (deltaX > 0)：减小代码视图宽度
                // 向左拖动 (deltaX < 0)：增加代码视图宽度
                let newWidth = this.startWidth - deltaX;
                
                // 限制宽度范围
                newWidth = Math.max(this.minWidth, Math.min(newWidth, blockViewer[0].clientWidth-blockViewer[0].children[0].clientWidth-blockViewer[0].children[4].clientWidth-7));
                
                // 应用新宽度
                this.applyWidth(newWidth);                
            }
            
            stopResize() {
                if (!this.isResizing) return;
                
                this.isResizing = false;
                this.currentWidth = this.codeViewContainer.offsetWidth;
                
                // 移除拖动状态
                this.resizeHandle.classList.remove('dragging');
                document.body.style.userSelect = '';
                document.body.style.cursor = '';                
            }
            
            applyWidth(width) {
                // 更新代码视图容器的宽度
                this.codeViewContainer.style.width = width + 'px';
                this.codeViewer.style.width = width + 'px';
                
                // 更新宽度显示
                this.currentWidth = width;
                
                // 更新主内容区域（通过flex布局自动调整）
                // 这里不需要手动设置，flex布局会自动处理
            }
            
                        
            resetWidth() {
                const defaultWidth = 279;
                this.applyWidth(defaultWidth);
            }
            
            handleWindowResize() {
                // 确保最大宽度不超过视口的一定比例
                const maxAllowedWidth = window.innerWidth * 0.7;
                var maxWidth = Math.max(this.minWidth, Math.min(blockViewer[0].clientWidth-blockViewer[0].children[0].clientWidth-blockViewer[0].children[4].clientWidth-7, maxAllowedWidth));
                
                // 如果当前宽度超过新的最大宽度，调整它
                if (this.currentWidth > maxWidth) {
                    this.applyWidth(maxWidth);
                }
            }
        }
        

