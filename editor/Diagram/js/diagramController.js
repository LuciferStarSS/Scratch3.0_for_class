   window.addEventListener('beforeunload', function(e) {
      // 现代浏览器
      if (e) {
         e.preventDefault();
         e.returnValue = '您确定要离开吗？未保存的更改可能会丢失。';
      }

      // 旧版浏览器
      return '您确定要离开吗？未保存的更改可能会丢失。';
   });

   window.addEventListener("DOMContentLoaded", function () {
    // topnav
    var topButton = document.getElementById("topnavButton");
    var topnavList = document.getElementById("topnavList");
    if (topButton && topnavList) {
      topButton.addEventListener("click", function (e) {
        topnavList.classList.toggle("hidden");
        e.stopPropagation();
      });
      document.addEventListener("click", function (e) {
        // if the clicked element isn't the list, close the list
        if (!topnavList.classList.contains("hidden") && !e.target.closest("#topnavList")) {
          topButton.click();
        }
      });

      // set active <a> element
      var url = window.location.href.toLowerCase();
      var aTags = topnavList.getElementsByTagName('a');
      for (var i = 0; i < aTags.length; i++) {
        var lowerhref = aTags[i].href.toLowerCase();
        if (url.startsWith(lowerhref)) {
          aTags[i].classList.add('active');
          break;
        }
      }
    }
  });

  function init() {
    myDiagram = new go.Diagram('myDiagramDiv', { // must name or refer to the DIV HTML element
        grid: new go.Panel('Grid')
          .add(
            new go.Shape('LineH', { stroke: 'lightgray', strokeWidth: 0.5 }),
            new go.Shape('LineH', { stroke: 'gray', strokeWidth: 0.5, interval: 10 }),
            new go.Shape('LineV', { stroke: 'lightgray', strokeWidth: 0.5 }),
            new go.Shape('LineV', { stroke: 'gray', strokeWidth: 0.5, interval: 10 })
          ),
        'draggingTool.dragsLink': true,
        'draggingTool.isGridSnapEnabled': true,
        'linkingTool.isUnconnectedLinkValid': true,
        'linkingTool.portGravity': 20,
        'relinkingTool.isUnconnectedLinkValid': true,
        'relinkingTool.portGravity': 20,
        'relinkingTool.fromHandleArchetype': new go.Shape('Diamond', {
          segmentIndex: 0,
          cursor: 'pointer',
          desiredSize: new go.Size(8, 8),
          fill: 'tomato',
          stroke: 'darkred'
        }),
        'relinkingTool.toHandleArchetype': new go.Shape('Diamond', {
          segmentIndex: -1,
          cursor: 'pointer',
          desiredSize: new go.Size(8, 8),
          fill: 'darkred',
          stroke: 'tomato'
        }),
        'linkReshapingTool.handleArchetype': new go.Shape('Diamond', {
          desiredSize: new go.Size(7, 7),
          fill: 'lightblue',
          stroke: 'deepskyblue'
        }),
        'rotatingTool.handleAngle': 270,
        'rotatingTool.handleDistance': 30,
        'rotatingTool.snapAngleMultiple': 15,
        'rotatingTool.snapAngleEpsilon': 15,
        'undoManager.isEnabled': true
      }
    );

    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener('Modified', (e) => {
      var button = document.getElementById('SaveButton');
      if (button) button.disabled = !myDiagram.isModified;
      var idx = document.title.indexOf('*');
      if (myDiagram.isModified) {
        if (idx < 0) document.title += '*';
      } else {
        if (idx >= 0) document.title = document.title.slice(0, idx);
      }
    });

    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
    // and where the port is positioned on the node, and the boolean "output" and "input" arguments
    // control whether the user can draw links from or to the port.
    function makePort(name, spot, output, input) {
      // the port is basically just a small transparent circle
      return new go.Shape('Circle', {
        fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
        stroke: null,
        desiredSize: new go.Size(7, 7),
        alignment: spot, // align the port on the main Shape
        alignmentFocus: spot, // just inside the Shape
        portId: name, // declare this object to be a "port"
        fromSpot: spot,
        toSpot: spot, // declare where links may connect at this port
        fromLinkable: output,
        toLinkable: input, // declare whether the user may draw links to/from here
        cursor: 'pointer' // show a different cursor to indicate potential link point
      });
    }

    var nodeSelectionAdornmentTemplate = new go.Adornment('Auto')
      .add(
        new go.Shape({ fill: null, stroke: 'deepskyblue', strokeWidth: 1.5, strokeDashArray: [4, 2] }),
        new go.Placeholder()
      );

    var nodeResizeAdornmentTemplate = new go.Adornment('Spot', { locationSpot: go.Spot.Right })
      .add(
        new go.Placeholder(),
        new go.Shape({ alignment: go.Spot.TopLeft, cursor: 'nw-resize', desiredSize: new go.Size(6, 6), fill: 'lightblue', stroke: 'deepskyblue' }),
        new go.Shape({ alignment: go.Spot.Top, cursor: 'n-resize', desiredSize: new go.Size(6, 6), fill: 'lightblue', stroke: 'deepskyblue' }),
        new go.Shape({ alignment: go.Spot.TopRight, cursor: 'ne-resize', desiredSize: new go.Size(6, 6), fill: 'lightblue', stroke: 'deepskyblue' }),
        new go.Shape({ alignment: go.Spot.Left, cursor: 'w-resize', desiredSize: new go.Size(6, 6), fill: 'lightblue', stroke: 'deepskyblue' }),
        new go.Shape({ alignment: go.Spot.Right, cursor: 'e-resize', desiredSize: new go.Size(6, 6), fill: 'lightblue', stroke: 'deepskyblue' }),
        new go.Shape({ alignment: go.Spot.BottomLeft, cursor: 'se-resize', desiredSize: new go.Size(6, 6), fill: 'lightblue', stroke: 'deepskyblue' }),
        new go.Shape({ alignment: go.Spot.Bottom, cursor: 's-resize', desiredSize: new go.Size(6, 6), fill: 'lightblue', stroke: 'deepskyblue' }),
        new go.Shape({ alignment: go.Spot.BottomRight, cursor: 'sw-resize', desiredSize: new go.Size(6, 6), fill: 'lightblue', stroke: 'deepskyblue' })
      );

    var nodeRotateAdornmentTemplate = new go.Adornment({
      locationSpot: go.Spot.Center,
      locationObjectName: 'ELLIPSE'
    })
      .add(
        new go.Shape('Ellipse', { name: 'ELLIPSE', cursor: 'pointer', desiredSize: new go.Size(7, 7), fill: 'lightblue', stroke: 'deepskyblue' }),
        new go.Shape({ geometryString: 'M3.5 7 L3.5 30', isGeometryPositioned: true, stroke: 'deepskyblue', strokeWidth: 1.5, strokeDashArray: [4, 2] })
      );

    myDiagram.nodeTemplate = new go.Node('Spot', {
      locationSpot: go.Spot.Center,
      selectable: true,
      selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
      resizable: true,
      resizeObjectName: 'PANEL',
      resizeAdornmentTemplate: nodeResizeAdornmentTemplate,
      rotatable: true,
      rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
      // handle mouse enter/leave events to show/hide the ports
      mouseEnter: (e, node) => showSmallPorts(node, true),
      mouseLeave: (e, node) => showSmallPorts(node, false)
    })
      .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
      .bindTwoWay('angle')
      .add(
        // the main object is a Panel that surrounds a TextBlock with a Shape
        new go.Panel('Auto', { name: 'PANEL' })
          .bindTwoWay('desiredSize', 'size', go.Size.parse, go.Size.stringify)
          .add(
            new go.Shape('Rectangle', { // default figure
              portId: '', // the default port: if no spot on link data, use closest side
              fromLinkable: true,
              toLinkable: true,
              cursor: 'pointer',
              fill: 'white', // default color
              strokeWidth: 2
            })
              .bind('figure')
              .bind('fill'),
            new go.TextBlock({
              font: 'bold 10pt Helvetica, Arial, sans-serif',
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.Wrap.Fit,
              editable: true
            }).bindTwoWay('text')
          ),
        // four small named ports, one on each side:
        makePort('T', go.Spot.Top, false, true),
        makePort('L', go.Spot.Left, true, true),
        makePort('R', go.Spot.Right, true, true),
        makePort('B', go.Spot.Bottom, true, false)
      );

    function showSmallPorts(node, show) {
      node.ports.each((port) => {
        if (port.portId !== '') {
          // don't change the default port, which is the big shape
          port.fill = show ? 'rgba(0,0,0,.3)' : null;
        }
      });
    }

    var linkSelectionAdornmentTemplate = new go.Adornment('Link')
      .add(
        new go.Shape({
          isPanelMain: true, // isPanelMain declares that this Shape shares the Link.geometry
          fill: null,
          stroke: 'deepskyblue',
          strokeWidth: 0 // use selection object's strokeWidth
        })
      );

    myDiagram.linkTemplate = new go.Link({ // the whole link panel
      selectable: true,
      selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true,
      routing: go.Routing.AvoidsNodes,
      curve: go.Curve.JumpOver,
      corner: 5,
      toShortLength: 4
    })
      .bindTwoWay('points')
      .add(
        new go.Shape({ // the link path shape
          isPanelMain: true,
          strokeWidth: 2
        }),
        new go.Shape({ // the arrowhead
          toArrow: 'Standard',
          stroke: null
        }),
        new go.Panel('Auto')
          .bindObject('visible', 'isSelected')
          .add(
            new go.Shape('RoundedRectangle', { // the link shape
              fill: '#F8F8F8',
              stroke: null
            }),
        new go.TextBlock({
           textAlign: 'center',
           font: '10pt helvetica, arial, sans-serif',
           stroke: '#919191',
           margin: 2,
           minSize: new go.Size(10, NaN),
           editable: true
        }).bindTwoWay('text'),

      )
    );

    load("teacher",0); // load an initial diagram from some JSON text

    // initialize the Palette that is on the left side of the page
    myPalette = new go.Palette('myPaletteDiv', {
      maxSelectionCount: 1,
      nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by myDiagram
      // simplify the link template, just in this Palette
      linkTemplate: new go.Link({
        // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
        // to line up the Link in the same manner we have to pretend the Link has the same location spot
        locationSpot: go.Spot.Center,
        selectionAdornmentTemplate: new go.Adornment('Link', {
          locationSpot: go.Spot.Center
        })
          .add(
            new go.Shape({
              isPanelMain: true,
              fill: null,
              stroke: 'deepskyblue',
              strokeWidth: 0
            }),
            new go.Shape({ // the arrowhead
              toArrow: 'Standard',
              stroke: null
            })
          ),
        routing: go.Routing.AvoidsNodes,
        curve: go.Curve.JumpOver,
        corner: 5,
        toShortLength: 4
      })
        .bind('points')
        .add(
          new go.Shape({ // the link path shape
            isPanelMain: true,
            strokeWidth: 2
          }),
          new go.Shape({ // the arrowhead
            toArrow: 'Standard',
            stroke: null
          })
        ),
      model: new go.GraphLinksModel(
        [
          // specify the contents of the Palette
          // specify the contents of the Palette  //预设调色盘中控件
          { text: '开始', 	figure: 'RoundedRectangle', size: '60 38', fill: '#00AD5F'},
          { text: '操作步骤', 	fill: 'lightskyblue' },
          //{ text: '数据库',	figure: 'Database', fill: 'lightgray' },
          { text: '判断',	figure: 'Diamond', fill: 'lightskyblue' },
          { text: '输入\r\n输出', figure: 'parallelogram', size: '60 48', fill: 'lightskyblue' },
          { text: '注释', 	figure: 'RoundedRectangle', size: '60 38',  fill: 'lightyellow' },
          { text: '结束',  	figure: 'RoundedRectangle', size: '60 38', fill: '#CE0620' }
        ],
        [
          // the Palette also has a disconnected Link, which the user can drag-and-drop
          { points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) }
        ]
      )
    });


    // 确保图表获得焦点
    myDiagram.div.tabIndex = 0;
    myDiagram.div.focus();
  }

  // Show the diagram's model in JSON format that the user may edit
  function save() {
    saveDiagramProperties(); // do this first, before writing to JSON
    //document.getElementById('mySavedModel').value = myDiagram.model.toJson();
    myDiagram.isModified = false;
  }

  var strLessonName='';
  var strTaskName='';
  function load(from="",bForced=0) {
     if(bForced==1)
     if( confirm("本次操作将覆盖之前数据，您确认要刷新吗？")!=1)
     {
        return;
     }
     $.post("./Diagram/loadDiagramming.php?F="+from,{},function(data){

        if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
        if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
        if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

        var jsonData=JSON.parse(data);
        if(jsonData)
        {
           if(jsonData[0]=="OK")
           {
              myDiagram.model = go.Model.fromJson(jsonData[1]);

              //document.getElementById('mySavedModel').value=data;
              loadDiagramProperties(); // do this after the Model.modelData has been brought into memory
            }
            else{
               //myDiagram.clear();
               if(typeof parent.newInfo ==="function")
                  parent.newInfo("数据异常，请稍后刷新试试。\n\n(错误信息："+jsonData[0]+" on "+jsonData[1]+")");
               else
                  alert("数据异常，请稍后刷新试试。\n\n(错误信息："+jsonData[0]+" on "+jsonData[1]+")");
            }
        }
        else {
           //myDiagram.clear();//防止因未交作业而使当前数据丢失。
           if(typeof parent.newInfo ==="function")
             parent.newInfo("数据异常，请重试。",false,false);
           else
              alert("数据异常，请重试。");
        }
     });
  }

  function upload(from="") {
    if(confirm("本次操作将覆盖之前数据，您确认要提交吗？")==1)
    {
       saveDiagramProperties(); // do this first, before writing to JSON
       var strData = myDiagram.model.toJson();
       var bounds = myDiagram.documentBounds;
       var width = bounds.width;

       var height = bounds.height;

         // 创建导出选项

       var options = {
         size: new go.Size(width, height),

         background: "white",
         type:"image/jpeg"
       };
 
       var imgData = myDiagram.makeImage(options).src;//myDiagram.makeSVG();//makeImageData();

       $.post("./Diagram/saveDiagramming.php?F="+from,{"S":strData,"I":imgData},function(data){
           if(typeof parent.newInfo ==="function")
              parent.newInfo("保存已完成。",false,false);
           else
              alert("保存已完成。");

           myDiagram.isModified = false;

         });
      }
   }

  function dlImg()
  {
    saveDiagramProperties(); // do this first, before writing to JSON
    //var strData = myDiagram.model.toJson();
    var bounds = myDiagram.documentBounds;
    var width = bounds.width;

    var height = bounds.height;

         // 创建导出选项

    var options = {
      size: new go.Size(width, height),
      background: "white",
      type:"image/jpeg"
    };
 
    var imgData = myDiagram.makeImage(options).src;//myDiagram.makeSVG();//makeImageData();
    const a = document.createElement("a");
    a.href= myDiagram.makeImage(options).src;
    a.download = '小图板.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

  }

  function loadTask(o)
  {
     if(o.selectedIndex==1)
     {
        var strLesson="课程名";
        if((strLesson=prompt("请输入新建课程的名字",strLesson))!=null)
        {
          $.post("./Diagram/newLesson.php",{"L":strLesson},function(data){
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
            if(data=="OK")
            {
               o.append(new Option(strLesson,strLesson));
               o.selectedIndex=o.length-1;
               document.getElementById("TASKS").length=2;

               myDiagram.clear();

            }
          });
       }
       else alert("请输入要创建的课程的名字。");

     }
     else if(o.selectedIndex>1)
     {
        $.post("./Diagram/loadTask.php",{"P":o.value},function(data){
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头


         myDiagram.clear();
         //alert(data);
         var s=document.getElementById("TASKS");
         s.length=2;
         var tasks=JSON.parse(data);
         for(var i=0;i<tasks.length;i++)
         {
            var newOption=new Option(tasks[i],tasks[i]);
            s.appendChild(newOption);
         }

       });
     }
  }

  function setTask(o)
  {
     if(o.selectedIndex==1)
     {
        var strLesson=document.getElementById("LESSONS").value;
        var strTask="任务名";
        if((strTask=prompt("请输入新建任务的名字",strTask))!=null)
        {
          $.post("./Diagram/newTask.php",{"L":strLesson,"T":strTask},function(data){
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
            if(data=="OK")
            {
               o.append(new Option(strTask,strTask));
               o.selectedIndex=o.length-1;
               myDiagram.clear();
            }
          });
       }
       else alert("请输入要创建的任务的名字。");
     }
     else if(o.selectedIndex>1)
     {
        var lesson=document.getElementById("LESSONS").value;
        var task=document.getElementById("TASKS").value;

        $.post("./Diagram/setTask.php",{"L":lesson,"T":task},function(data){
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头

           //var jsonData=JSON.parse(data);
           //alert(jsonData);
           if(data=="OK")
             load("teacher");
           else  myDiagram.clear();

        });
     }
  }

  function saveDiagramProperties() {
    myDiagram.model.modelData.position = go.Point.stringify(myDiagram.position);
  }

  function loadDiagramProperties(e) {
    // set Diagram.initialPosition, not Diagram.position, to handle initialization side-effects
    var pos = myDiagram.model.modelData.position;
    if (pos) myDiagram.initialPosition = go.Point.parse(pos);
  }




var bDIAGRAMVIEW=false;
var listDIAGRAM=null;
var tabDIAGRAM=null;



//暂存盘显示与隐藏控制
function showDIAGRAM()
{
   if(listDIAGRAM)
   {
      listDIAGRAM.style.left="311px";
      listDIAGRAM.style.top="92px";

      listDIAGRAM.style.visibility=bDIAGRAMVIEW?"hidden":"visible";
      bDIAGRAMVIEW=!bDIAGRAMVIEW;
   }
   if(bDIAGRAMVIEW)
   {
      tabDIAGRAM.children[0].children[0].style.background="white";
   }
   else
      tabDIAGRAM.children[0].children[0].style.background="";
}

//流程图入口按钮注入
function injectDIAGRAM()
{
   var d=document.getElementsByClassName("gui_tabs_AgmuP");
   if(d==undefined) return;
   var newTABDIV=document.getElementById("NEWTAB1");	//顶部控制标签
   if(newTABDIV==undefined)
   {
      var newTabDiv=document.createElement("DIV");
      newTabDiv.style="    position: absolute;   right: 0px;  display: flex; ";
      newTabDiv.id="NEWTAB1";
      d[0].appendChild(newTabDiv);
      newTABDIV=newTabDiv;
   }

   var viewCheck=document.getElementById("DIAGRAMBUTTON");
   if(viewCheck==undefined)
   {
      tabDIAGRAM=document.createElement("div");						//标签
      tabDIAGRAM.style="position: relative;";//right:83px;";
      tabDIAGRAM.title="流程图";
      tabDIAGRAM.id="DIAGRAMBUTTON";
      var ul=document.createElement("ul");

      ul.className="react-tabs_react-tabs__tab-list_17Wee gui_tab-list_87TYM";

      ul.style.width="84px";
      var li=document.createElement("li");

      li.className="react-tabs_react-tabs__tab_3Nn-X gui_tab_27Unf";
      li.setAttribute("role","tab");
      var span=document.createElement("span");
      span.innerHTML="流程图";
      li.appendChild(span);
      ul.appendChild(li);
      tabDIAGRAM.appendChild(ul);
      tabDIAGRAM.onclick=function(){
         if(listDIAGRAM==null)
            listDIAGRAM=document.getElementById("DIAGRAM");
         showDIAGRAM();
      }
      newTABDIV.appendChild(tabDIAGRAM);
   }
}