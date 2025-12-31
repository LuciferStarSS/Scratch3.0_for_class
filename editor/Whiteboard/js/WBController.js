
//学生端更新小白板数据
function updateBOARD()
{
   //获取白板数据
   $.post("./WhiteBoard/getBDPos.php?t=" + Math.random(), {}, function (data) {
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

      if(data.length>0){ 

         var dataArr=data.split("\r\n");
         var strData=dataArr.slice(1,dataArr.length).join("");
         var posJSON=JSON.parse(strData);

         if(JSON.stringify(posJSON)=="{}") return;

         nSteps=posJSON.length;
         var bd=document.getElementById("attachments");
         for(var j=bd.children.length;j>0;j--)				//清理旧数据
         {
            bd.children[j-1].remove();
         }
         for(var i=0;i<posJSON.length;i++)				//生成新数据
         {

            //if(i>0)
            //   document.getElementById("back").style.visibility="visible";
            //else
            //   document.getElementById("back").style.visibility="hidden";

            //if(i<posJSON.length-1)
            //{
            //   document.getElementById("pause").style.visibility="visible";
            //}
            //else
            //{
            //   //clearInterval(inSteps);
            document.getElementById("pause").style.visibility="hidden";
            //document.getElementById("all").style.visibility="hidden";
            document.getElementById("back").style.visibility="hidden";
            //}


            if(posJSON[i][0]=="DIV")
            {
               var divx = document.createElement("div");		//创建新DIV
               divx.style="position:absolute";
               divx.style.left=(parseInt(posJSON[i][2])+12)+"px";		//教师端（有控制按钮）跟学生端不一样，所以有偏差。
               divx.style.top=(parseInt(posJSON[i][3])+16)+"px";
               divx.setAttribute("class","ATTACH");

               //var txt = document.createElement("div");		//创建新IMG：附件
               divx.innerHTML=posJSON[i][1];				//文本
               //divx.appendChild(txt);

               bd.appendChild(divx);
            }
            else  if(posJSON[i][0]=="IMG")
            {
               var divx = document.createElement("div");		//创建新DIV
               divx.style="position:absolute";
               divx.style.left=(parseInt(posJSON[i][2])+13)+"px";		//教师端（有控制按钮）跟学生端不一样，所以有偏差。
               divx.style.top=(parseInt(posJSON[i][3])-5)+"px";
               divx.setAttribute("class","ATTACH");
               var img = document.createElement("img");			//创建新IMG：附件
               img.onmousedown=function(){drag(this,event,3);};
               img.src=posJSON[i][1];
               var imgName=posJSON[i][1].split("/");
               img.title=imgName[imgName.length-1];
               divx.appendChild(img);
               bd.appendChild(divx);					//往白板中插入此新DIV
            }
            else  if(posJSON[i][0]=="VIDEO")
            {
               var divx = document.createElement("div");		//创建新DIV
               divx.style="position:absolute";
               divx.style.left=(parseInt(posJSON[i][2])+12)+"px";		//教师端（有控制按钮）跟学生端不一样，所以有偏差。
               divx.style.top=(parseInt(posJSON[i][3])+16)+"px";
               divx.setAttribute("class","ATTACH");

               var video = document.createElement("video");			//创建新IMG：附件
               video.setAttribute("controls",true);
               video.setAttribute("height",posJSON[i][4]);
               video.onmousedown=function(){drag(this,event,3);};
               video.src=posJSON[i][1];
               //video.onmousedown=function(){dragBD(this,event)};		//添加后并不及时更新，而是等拖动后再更新。
               //video.title=nid;
               divx.appendChild(video);
               bd.appendChild(divx);					//往白板中插入此新DIV
            }
            else if(posJSON[i][0]=="COVER")
            {
               //var bd=document.getElementById("attachments");
               var d=document.createElement("DIV");
               d.style="width: 650px;    height: 480px;    position: absolute;    left: -4px;    top: 19px;    background: beige;border-radius: 3%;";
               d.setAttribute("class","ATTACH");
               //if(admin)
               //   d.ondblclick=function(){this.style.visibility="hidden";};
               d.onmousedown=function(){drag(this,event,1);};
               bd.appendChild(d);
            }
         }   
      }
      //else
      //{
      //   document.getElementById("back").style.visibility="hidden";
      //   document.getElementById("all").style.visibility="hidden";
      //   document.getElementById("pause").style.visibility="hidden";
      //}

      if(document.getElementById("WHITEBOARD").style.display!="block")
         document.getElementById("moretask").innerHTML="小白板"+"<font color=red>★</font>";
      newInfo("小白板已更新，去看看吧？");
   });
}


/************************************************************
加载某个年级的小白板中已存素材
***********************************************************/
function loadBDAttach(grade_id) {
   if(admin)
   {
      $.post("./WhiteBoard/loadBDAttach.php?t=" + Math.random(), { "GID": grade_id }, function (data) {

         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

         var o=document.getElementById("attach");
         o.length=1;
         if(data=="") return;
         data = eval(data);
         if (data.length > 0) {
            //o.add(new Option("请选择图片/视频", ""));
            var proj=document.getElementById("newpp");
            if(proj){
               proj.value=data[0]==false?"未命名":data[0];
               proj.onclick=function(){createNew(proj.value);};
            }
            for (var i = 1; i < data.length; i++) {
               o.add(new Option(data[i], data[i]));
            }
         }
         else {
            o.add(new Option("暂无可用素材", ""));
         }
      });
   }
}

function hideBackground(o)
{
   if(o.checked==true)
   {
      document.getElementById("waiting").style.visibility="visible";
   }
   else
   {
      document.getElementById("waiting").style.visibility="hidden";
   }
}


function setDataCollectingStatus(o)
{
   if(o.value=='暂停') {
      dataCollecting=false;
      o.value='继续';
      var msg = {'content': '["DATACOLLECTINGEND"]', 'type': 'user'};//定向发送给老师
      sendMsg(msg);
   }
   else {
      dataCollecting=true;
      o.value='暂停';
      var msg = {'content': '["DATACOLLECTINGBEGIN"]', 'type': 'user'};//定向发送给老师
      sendMsg(msg);
   }
}

function setViewerScroll(o)
{
   if(o.parentElement.style.overflow=="hidden")
   {
      o.parentElement.style.overflow="auto";
      o.parentElement.style.borderRadius="0%";
   }
   else
   {
      o.parentElement.style.overflow="hidden";
      o.parentElement.style.borderRadius="3%";
   }
}

$(document).ready(function(){
   $("input").keydown(function (event){
      if(event.keyCode == 13){
        saveEditorText();
      }
   });
});




function changeOpacity(o,value)
{
   o.style.opacity=value;
}




//admin
   var nLast=-1;			//上一次显示的图片ID
   var bType=false;		//默认单图模式，true为多图模式
   var nSpeed=5000;		//默认5秒刷新一次

   //调整切换更新
   function changeSpeed(o)
   {
      nSpeed=o.value;
      window.frames["viewer"].contentWindow.changeSpeed();
   }

   //切换视图
   function setView()
   {
      window.frames["viewer"].contentWindow.setView(bType);
      document.getElementById("SETVIEW").src=bType?"./img/align_m.png":"./img/align_s.png";
      document.getElementById("SETVIEW").title=bType?"切换到多图模式":"切换到单图模式";
      bType=!bType;
   }

   //关闭窗口
   function closeIV()
   {
      document.getElementById("ImageViewer").style.visibility="hidden";	
      document.getElementById("viewer").src="about:blank";
   }

   //刷新数据
   function reloadIV()
   {
      window.frames["viewer"].contentWindow.getWorks();
   }

   function pause(o)
   {
      window.frames["viewer"].contentWindow.pause();
      o.title=o.title=="暂停"?"继续":"暂停";
      o.src=o.title=="暂停"?"./img/pause.png":"./img/play.png";
      
   }


   //小白板的画线功能
   function undoOneStep()
   {
      var bd=document.getElementById("attachments");
      if(bd.childElementCount>0)
      {
         bd.removeChild(bd.children[bd.childElementCount-1]);
         saveBD(0);
      }
      else newInfo("小白板已清空。");

   }

   document.addEventListener('DOMContentLoaded', function(){
      const canvas = document.getElementById('myLines');
      if(canvas==null) return;						//学生端没有。
      const ctx = canvas.getContext('2d',{ willReadFrequently:true });

      var nLeft=nTop=0;
      let isDrawing = false;

      function startDrawing (e) {
        isDrawing = true;
        nLeft=e.offsetX;		//奇怪的偏移量
        nTop=e.offsetY;
        draw(e);
      }
      function stopDrawing (e) {
        isDrawing = false;

        nLeft=e.offsetX<nLeft?e.offsetX:nLeft;
        nTop=e.offsetY<nTop?e.offsetY:nTop;

        ctx.beginPath() ;// Reset the path for the next draw

        var canvas_Original = document.createElement('CANVAS'),
        ctx_Original = canvas_Original.getContext('2d',{ willReadFrequently:true }),	//响应频繁读写开关
        img_Original = new Image;
        img_Original.crossOrigin = 'Anonymous';
        img_Original.onload = function()
        {

            canvas_Original.height = HEIGHT=img_Original.height;
            canvas_Original.width  = WIDTH=img_Original.width;
            ctx_Original.drawImage(img_Original,0,0);

            imgData=ctx_Original.getImageData(0,0,img_Original.width,img_Original.height);

            var arrData = new Uint32Array(imgData.data.buffer);		//通过Uint32Array的方式访问数据

            var m=n=0;
            var dx=dy=dw=dh=0;
            var bFound=false;
            for(m=0;m<HEIGHT;m++)						//在原图中匹配，修改遮罩图数据
            {
               for(n=0;n<WIDTH;n++)
               {
                  if(arrData[m*WIDTH+n]!=0x00000000)
                  {
                     bFound=true;
                     break;                   				//用Uint32处理，可以少三次赋值。
                  }
               }
               if(bFound) { break;}
            }
            bFound=false;
            dy=m;

            for(n=0;n<WIDTH;n++)
            {
               for(m=0;m<HEIGHT;m++)						//在原图中匹配，修改遮罩图数据
               {
                  if(arrData[m*WIDTH+n]!=0x00000000)
                  {
                     bFound=true;
                     break;                   				//用Uint32处理，可以少三次赋值。
                  }
               }
               if(bFound) { break;}
            }
            bFound=false;
            dx=n;

            for(m=HEIGHT-1;m>0;m--)						//在原图中匹配，修改遮罩图数据
            {
               for(n=0;n<WIDTH;n++)
               {
                  if(arrData[m*WIDTH+n]!=0x00000000)
                  {
                     bFound=true;
                     break;                   				//用Uint32处理，可以少三次赋值。
                  }
               }
               if(bFound) { break;}
            }
            bFound=false;
            dh=m;

            for(n=WIDTH-1;n>0;n--)
            {
               for(m=HEIGHT-1;m>0;m--)						//在原图中匹配，修改遮罩图数据
               {
                  if(arrData[m*WIDTH+n]!=0x00000000)
                  {
                     bFound=true;
                     break;                   				//用Uint32处理，可以少三次赋值。
                  }
               }
               if(bFound) { break;}
            }
            bFound=false;
            dw=n;

            var canvasCUT = document.createElement('CANVAS'),			//创建新的canvas对象
            ctxCUT = canvasCUT.getContext('2d',{ willReadFrequently:true }),	//响应频繁读写开关
            imgCUT = new Image;
            imgCUT.crossOrigin = 'Anonymous';
            canvasCUT.width    = dw-dx+1;
            canvasCUT.height   = dh-dy;					//设置尺寸大小
            imgData=ctx_Original.getImageData(dx,dy,dw-dx+1,dh-dy);		//获取非空矩形区域的图像数据
            ctxCUT.putImageData(imgData,0,0);					//将图像数据写入到新的ctx中。



            canvas_Original.height = HEIGHT=img_Original.height;
            canvas_Original.width  = WIDTH=img_Original.width;
            ctx_Original.drawImage(img_Original,0,0);

            $.post("./WhiteBoard/saveBDLINE.php?t=" + Math.random(), {'GID':gradeid,"IMGDATA":canvasCUT.toDataURL('image/png')}, function (data) 	//将canvas_Original的数据保存到服务器。
            {
               if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
               if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
               if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

               if(data.length>0){
                  var jData=JSON.parse(data);
                  canvas.height=canvas.width=0;

                  canvas.height=480;
                  canvas.width=650;
                  if(jData!=={})
                  {
                     var nPenWeight=(parseInt(document.getElementById("fontsize").value)-10)/4;

                     switch(nPenWeight)
                     {
                     case 6:

                        nLeft-=19;//减越多，越往左。
                        nTop+=21;
                     break;

                     case 5:
                        nLeft-=19;
                        nTop+=21;
                     break;

                     case 4:
                        nLeft-=18;
                        nTop+=22;
                     break;

                     case 3:
                        nLeft-=18;
                        nTop+=22;
                     break;

                     case 2:
                        nLeft-=17;
                        nTop+=23;
                     break;

                     case 1:
                        nLeft-=17;
                        nTop+=23;
                     break;
                     }

                     insertImg(jData[0],jData[1],nLeft,nTop,canvasCUT.width,canvasCUT.height);
                     saveBD(0);
                  }
               }		

            });
            canvas_Original = null;
         };
         img_Original.src = canvas.toDataURL("image/png");

 
      }



      function draw (e) {
 

         if (!isDrawing) return;

         nLeft=e.offsetX<nLeft?e.offsetX:nLeft;
         nTop=e.offsetY<nTop?e.offsetY:nTop;

         ctx.lineWidth = (parseInt(document.getElementById("fontsize").value)-10)/4;
         ctx.lineCap = 'round';
         ctx.strokeStyle = document.getElementById("color").value;//'#000';
         ctx.lineTo(e.offsetX - canvas.offsetLeft-26, e.offsetY - canvas.offsetTop+34);
         ctx.stroke();
         ctx.beginPath();
         ctx.moveTo(e.offsetX - canvas.offsetLeft-26, e.offsetY - canvas.offsetTop+34);
      }


      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      //canvas.addEventListener('mouseout', stopDrawing);
   });


//小白板应用
//此程序只投送到教师页面
/************************************
剪贴板的图片粘贴到页面后
   在RAW中保存一份最原始的数据。
      这个数据只在如下情况下才发生变化：
         1.粘贴操作 
         2.编辑小白板上已存在的图片
   在ORBKIMG保存一份。
       这个数据，在切图或修改颜色后更新，撤销/重做操作也需要同步更新。
       切图、填充，全部从ORBKIMG调取数据，操作完成后，写回ORBKIMG；
       如果操作是追加模式，则从PREVIEWIMG调取数据

UNDO，第一次操作，从RAW获取，后续操作，从PREVIEWIMG获取。
REDO操作，从PREVIEWIMG获取。

************************************/
var start_x=start_y=end_x=end_y=-1;		//切图所需要的坐标

var down_flag = false;				//用来判断鼠标是否还在按下

var ctx_SELECTOR=null;
var img_SELECTOR=null;				//鼠标选择图形后进行切图时要用到的ctx和img
var bAllowedDrag=true;				//允许拖曳

//监听SELECTOR上的鼠标事件
function selector_mousedown(e)			//鼠标按下时的事件
{
   if(!down_flag)					//鼠标左键刚按下，采集开始坐标
   {
      start_x=e.layerX;
      start_y=e.layerY;
   } 
   down_flag = true;
}

function selector_mouseup(e)			//鼠标抬起事件
{
   if(down_flag)					//鼠标左键已经按下，采集结束坐标
   {
      end_x=e.layerX;
      end_y=e.layerY;
      cutImg(start_x,start_y,end_x,end_y);

      var ImageEditor=document.getElementById("ImageEditor");
      ImageEditor.style.left="10px";
      ImageEditor.style.top="20px";
   }
   down_flag = false;
}

function selector_mousemove(e)			//鼠标移动事件
{
   if(down_flag)					//鼠标已经按下，正在移动中，需要实时绘制选择框
   {
      end_x=e.layerX;
      end_y=e.layerY;
      ctx_SELECTOR.clearRect(0,0,WIDTH,HEIGHT);
      drawRect(start_x,start_y,end_x,end_y);
   }
}

//在鼠标选择区域时，实时绘制虚线框
//需要用到全局变量ctx_SELECTOR
//此变量的值在cutImg中赋值
function drawRect(sx,sy,ex,ey)
{
    ctx_SELECTOR.drawImage(img_SELECTOR,0,0);		//重绘背景图
    ctx_SELECTOR.beginPath();
    ctx_SELECTOR.rect(sx,sy,ex-sx,ey-sy);
    //ctx.closePath();			//就一个单一的矩形，所以可以不调用closePath();
    ctx_SELECTOR.stroke();
}

//更新撤销重做按钮状态
function updateUndoRedo_UI()
{
   if(OptArr.length==0)				//无记录时隐藏
   {
      document.getElementById("IEUNDO").style.visibility="hidden";
      document.getElementById("IEUNDOV").style.visibility="hidden";
      document.getElementById("IEREDO").style.visibility="hidden";
      document.getElementById("IEREDOV").style.visibility="hidden";
      return;
   }

   if(nCurrent>=0)				//撤销按钮的显示控制
   {
      document.getElementById("IEUNDO").title=(nCurrent+1);
      document.getElementById("IEUNDOV").innerText=(nCurrent+1);
      document.getElementById("IEUNDO").style.visibility="visible";
      document.getElementById("IEUNDOV").style.visibility="visible";
   }
   else
   {
      document.getElementById("IEUNDO").style.visibility="hidden";
      document.getElementById("IEUNDOV").style.visibility="hidden";
   }

   if(nCurrent==OptArr.length-1)		//重做按钮的显示控制
   {
      document.getElementById("IEREDO").style.visibility="hidden";
      document.getElementById("IEREDOV").style.visibility="hidden";
   }
   else
   {
      document.getElementById("IEREDO").title=OptArr.length-nCurrent-1;
      document.getElementById("IEREDOV").innerText=OptArr.length-nCurrent-1;
      document.getElementById("IEREDO").style.visibility="visible";
      document.getElementById("IEREDOV").style.visibility="visible";
   }
}

//按鼠标所选区域，进行切边操作
//(x1,y1):(left,top)
//(x2,y2):(right,bottom)
function cutImg(x1,y1,x2,y2)
{
   WIDTH  =x2-x1;								//所选区域的宽度	
   HEIGHT =y2-y1;								//所选区域的高度
   if(WIDTH==0 || HEIGHT==0) return;

   var canvas_Original = document.createElement('CANVAS'),			//创建canvas元素
   ctx_Original = canvas_Original.getContext('2d',{ willReadFrequently:true }),	//获取canvas绘图上下文句柄。为了提高读写速度，置willReadFrequently为true
   img_Original = new Image;							//创建图像对象
   img_Original.crossOrigin = 'Anonymous';					//从内嵌资源中获取图像数据，可能存在不允许跨域读的问题，所以要置anonymous
   img_Original.onload = function()						//当修改img_Original.src时，即会激发onload操作。
   {
      bImgCreated=false;							//当前还没完成图像生成，所以置false
      OptArr.push(new Array("CT",x1,y1,x2,y2));					//将操作数据压入OptArr，以便实现撤销/重做操作
      nCurrent++;								//当前操作计数器
      updateUndoRedo_UI();							//更新撤销/重做界面

      canvas_Original.height  = img_Original.height;				//img_Original的height和width为img_Original.src所指向的图片的高宽。
      canvas_Original.width   = img_Original.width;				//因为img_Original已经被指定了图像资源，所以高宽也发生了改变。
      ctx_Original.drawImage(img_Original,0,0);					//将img_Original的图像，绘制到当前新建的ctx_Original画板上。

      var canvas_CUT = document.createElement('CANVAS'),			//新建一个canvas元素，用于保存剪切后的图像
      ctx_CUT = canvas_CUT.getContext('2d',{ willReadFrequently:true });

      canvas_CUT.width = WIDTH;							//新画板的宽高尺寸（WIDTH,HEIGHT），也即(x2-x1,y2-y1)
      canvas_CUT.height= HEIGHT;

      imgData=ctx_Original.getImageData(x1,y1,WIDTH,HEIGHT);			//从原图截取选定范围的图像数据，起点在（x1,y1）
      ctx_CUT.putImageData(imgData,0,0);					//将截取到的图像数据，写入新画板中。

      var new_orbkimg = document.createElement('img');				//动态创建img元素，用于更新orbkimg最终效果图像
      new_orbkimg.id="ORBKIMG";
      new_orbkimg.setAttribute('src', canvas_CUT.toDataURL('image/png'));		//更新orbkimg，不显示，鼠标图标显示为十字
      new_orbkimg.style="display:none; cursor: crosshair;position:relative;top:0px;left:0px;";

      var new_previewimg = document.createElement('img');			//用于更新PREVIEWIMG预览图像
      new_previewimg.id="PREVIEWIMG";
      new_previewimg.setAttribute('src',canvas_CUT.toDataURL('image/png'));	//切图后，预览图跟最终图，是一样的内容。
      new_previewimg.style="cursor: crosshair;position:relative;top:0px;left:0px;top:0px";

      document.getElementById('NEWOLD').checked	= false;			//重置“追加颜色”设置

      document.getElementById('PREVIEW').innerHTML= "";				//清空预览数据
      document.getElementById('PREVIEW').appendChild(new_orbkimg);		//在预览位置，插入隐藏的原始图
      document.getElementById('PREVIEW').appendChild(new_previewimg);		//在预览位置，插入预览图

      document.getElementById('SETTRANS').style.display = "none";		//显示“设置透明色”操作控制

      if(document.getElementById('SHIELDIMG')!=null)				//如生成过遮罩图，则也要调整它的尺寸，否则会有黑框出现。
      {
         document.getElementById('SHIELDIMG').style.width = WIDTH+"px";		//调整遮罩图的尺寸。
         document.getElementById('SHIELDIMG').style.height = HEIGHT+"px";
      }

      //调整图片编辑界面的尺寸
      document.getElementById('ImageEditor').style.width =  (WIDTH+20)+"px";	//调整ImageEditor的高宽
      document.getElementById('ImageEditor').style.height = (HEIGHT+136)+"px";
      document.getElementById('PREVIEW').style.height =     (HEIGHT)+"px";	//调整预览窗口的高

      //更新canvas图，之前已经设置过对鼠标的四种事件的监听，这些监听依然有效，但因为图形改变了，所以需要：
      //调整canvas的高宽，以及绘制的线的样式、粗细和颜色
      img_SELECTOR = new Image;							//切完图后，还应该是切图状态，所以需要调整切图内元素的图像。
      img_SELECTOR.crossOrigin = 'Anonymous';					//新图数据，通过img_SELECTOR.src来传递
      img_SELECTOR.onload = function()
      {
         //canvas的尺寸由width和height控制，非style里的width和height
         let canvas_SELECTOR = document.getElementById("SELECTOR");
         ctx_SELECTOR = canvas_SELECTOR.getContext("2d",{ willReadFrequently:true });

         canvas_SELECTOR.setAttribute("width", WIDTH+"px");			//切完的图的尺寸大小
         canvas_SELECTOR.setAttribute("height",HEIGHT+"px");
         canvas_SELECTOR.style="cursor:crosshair; position:relative; left:0px; top:-"+(HEIGHT)+"px;";

         ctx_SELECTOR.drawImage(img_SELECTOR,0,0);				//将图片加载到canvas中

         //全局变量img_SELECTOR对鼠标的响应，在粘贴图片时就已经添加了，所以这里不需要重复设置。
         //而由于ctx_SELECTOR是重新通过getContext获取的，所以它的线的颜色等设置，是需要重新设置的。
         ctx_SELECTOR.setLineDash([3]);						//设置虚线
         ctx_SELECTOR.lineWidth = 1;						//线条宽度
         ctx_SELECTOR.strokeStyle="red";					//线条颜色

         canvas_SELECTOR = null;

         bImgCreated=true;							//图像最终完成全部生成操作
      };
      img_SELECTOR.src =  canvas_CUT.toDataURL('image/png');			//将切好的图传给img_SELECTOR

      canvas_Cut = null;
      canvas_Original = null;
   };
   if(ctx_SELECTOR)			//这里要再去确认一下是否有重置操作。//////////////////////////////////////////////////////////////////////////////////
      img_Original.src = document.getElementById("PREVIEWIMG").src;		//从预览获取图像数据
   else
      img_Original.src = document.getEementById("ORBKIMG").src;			//从原图获取图像数据
}

var bFirstUnDo=true;								//撤销操作中的第一条数据

//按鼠标所选区域，进行切边操作
//撤销和重做操作，需要设置数据源，所以需要单独设定一个处理操作。
//后续进行优化
//(x1,y1):(left,top)
//(x2,y2):(right,bottom)
function cutImg_REPLAY(x1,y1,x2,y2)
{
   WIDTH  =x2-x1;	
   HEIGHT =y2-y1;
   if(WIDTH==0 || HEIGHT==0) return;

   var canvas_Original = document.createElement('CANVAS'),			//获取原图
   ctx_Original = canvas_Original.getContext('2d',{ willReadFrequently:true }),	//响应频繁读写开关
   img_Original = new Image;
   img_Original.crossOrigin = 'Anonymous';
   img_Original.onload = function()
   {
      if(nCurrent==-1)								//撤销操作中处于撤销序列的第一条执行就是加载最初始的图像数据
      {
         canvas_Original.height  = WIDTH = img_Original.height;			//HEIGHT,WIDTH为原图高度
         canvas_Original.width   = HEIGHT = img_Original.width;

         var new_img = document.createElement('img');				//动态创建HTML图片元素，切图也不应该损害原图。
         new_img.id="ORBKIMG";
         new_img.setAttribute('src', canvas_Original.toDataURL('image/png'));
         new_img.style="display:none; cursor: crosshair;position:relative;top:0px;left:0px;";
         bImgCreated=false;

         var new_img2 = document.createElement('img');				//动态创建HTML图片元素
         new_img2.id="PREVIEWIMG";
         new_img2.setAttribute('src',canvas_Original.toDataURL('image/png'));
         new_img2.style="cursor: crosshair;position:relative;top:0px;left:0px;top:0px";

         document.getElementById('NEWOLD').checked	= false;			//重置“追加颜色”设置
         document.getElementById('PREVIEW').innerHTML= "";				//清空预览数据

         document.getElementById('PREVIEW').appendChild(new_img);			//在预览位置，插入隐藏的原始图
         document.getElementById('PREVIEW').appendChild(new_img2);			//在预览位置，插入预览图
         document.getElementById('SETTRANS').style.display = "none";			//显示“设置透明色”操作控制
         //动态调整界面大小
         document.getElementById('ImageEditor').style.width = (WIDTH+20)+"px";
         document.getElementById('ImageEditor').style.height = (HEIGHT+136)+"px";	//调整ImageEditor的高宽
         document.getElementById('PREVIEW').style.height = (HEIGHT)+"px";		//调整预览窗口的高

         return;
      }

      canvas_Original.height  = img_Original.height;			//HEIGHT,WIDTH为原图高度
      canvas_Original.width   = img_Original.width;
      ctx_Original.drawImage(img_Original,0,0);				//将原图绘制到当前新建的canvas画板上

      var canvas_CUT = document.createElement('CANVAS'),		//新建要创建的剪切后的canvas画板
      ctx_CUT = canvas_CUT.getContext('2d',{ willReadFrequently:true }),
      img_CUT = new Image;
      img_CUT.crossOrigin = 'Anonymous';
      canvas_CUT.width = WIDTH;// =x2-x1;				//新画板尺寸
      canvas_CUT.height= HEIGHT;// =y2-y1;				//(x2-x1,y2-y1)

      //if(WIDTH==0 || HEIGHT==0) return;
      imgData=ctx_Original.getImageData(x1,y1,WIDTH,HEIGHT);		//从原图截取选定范围的图像数据
      ctx_CUT.putImageData(imgData,0,0);				//将该范围的数据写入新画板中。

      var new_orbkimg = document.createElement('img');			//动态创建HTML图片元素，切图也不应该损害原图。
      new_orbkimg.id="ORBKIMG";
      new_orbkimg.setAttribute('src', canvas_CUT.toDataURL('image/png'));
      new_orbkimg.style="display:none; cursor: crosshair;position:relative;top:0px;left:0px;";
      bImgCreated=false;

      var new_previewimg = document.createElement('img');		//动态创建HTML图片元素
      new_previewimg.id="PREVIEWIMG";
      new_previewimg.setAttribute('src',canvas_CUT.toDataURL('image/png'));
      new_previewimg.style="cursor: crosshair;position:relative;top:0px;left:0px;top:0px";

      document.getElementById('NEWOLD').checked	= false;		//重置“追加颜色”设置
      document.getElementById('PREVIEW').innerHTML= "";			//清空预览数据
      document.getElementById('PREVIEW').appendChild(new_orbkimg);	//在预览位置，插入隐藏的原始图
      document.getElementById('PREVIEW').appendChild(new_previewimg);	//在预览位置，插入预览图

      document.getElementById('SETTRANS').style.display = "none";	//显示“设置透明色”操作控制

      if(document.getElementById('SHIELDIMG')!=null)			//如生成过遮罩图，则也要调整它的尺寸，否则会有黑框出现。
      {
         document.getElementById('SHIELDIMG').style.width = WIDTH+"px";	//设置遮罩图的高宽
         document.getElementById('SHIELDIMG').style.height = HEIGHT+"px";
      }
      //动态调整界面大小
      document.getElementById('ImageEditor').style.width = (WIDTH+20)+"px";
      document.getElementById('ImageEditor').style.height = (HEIGHT+136)+"px";	//调整ImageEditor的高宽
      document.getElementById('PREVIEW').style.height = (HEIGHT)+"px";		//调整预览窗口的高

      //更新canvas图，之前已经设置过对鼠标的四种事件的监听，这些监听依然有效，但因为图形改变了，所以需要：
      //调整canvas的高宽，以及绘制的线的样式、粗细和颜色

      img_SELECTOR = new Image;
      img_SELECTOR.crossOrigin = 'Anonymous';
      img_SELECTOR.onload = function()
      {
         //canvas的尺寸由width和height控制，非style里的width和height
         let canvas_SELECTOR = document.getElementById("SELECTOR");
         ctx_SELECTOR = canvas_SELECTOR.getContext("2d",{ willReadFrequently:true });

         canvas_SELECTOR.setAttribute("width",WIDTH+"px");	//切完的图的尺寸大小
         canvas_SELECTOR.setAttribute("height",HEIGHT+"px");
         canvas_SELECTOR.style="cursor:crosshair; position:relative; left:0px; top:-"+(HEIGHT)+"px;";

         //ctx_SELECTOR.drawImage(img_CUT,0,0);				//此处如果借用img_CUT，则切图后再切图，会访问旧数据。
         ctx_SELECTOR.drawImage(img_SELECTOR,0,0);			//将图片加载到canvas中
         ctx_SELECTOR.setLineDash([3]);					//设置虚线
         ctx_SELECTOR.lineWidth = 1;					//线条宽度
         ctx_SELECTOR.strokeStyle="red";				//线条颜色

         bImgCreated=true;

         bFirstUnDo=false;
         bREADY=true;

         //暂时保留，可能从替换模式再次切换回来的时候，需要重新设置。
         //canvas_SELECTOR.onmousemove=function(){ showPos(this,event);};	//响应鼠标在图片上移动的事件，获取鼠标在图片上所指的点的坐标
         //canvas_SELECTOR.onmouseout=function() { resetPos(this);     };	//响应鼠标移出图片的事件，重置获取的鼠标在图片上的点的坐标
         //canvas_SELECTOR.onmousedown=function(){ setColor(event);    };	//响应鼠标在图片上的单击事件，锁定鼠标在图片上的点的坐标，屏蔽鼠标后续在图片上的其它事件
         //canvas_SELECTOR.onmouseup=function()  { popupMenu(event);   };
       
         canvas_SELECTOR = null;
      };
      img_SELECTOR.src =  canvas_CUT.toDataURL('image/png');

      canvas_Cut = null;
      canvas_Original = null;
   };

   if(bFirstUnDo)
      img_Original.src = document.getElementById("RAW").src;		//从最初始的原图获取图像数据
   else if(ctx_SELECTOR)
      img_Original.src = document.getElementById("PREVIEWIMG").src;	//从预览获取图像数据
   else
      img_Original.src = document.getElementById("ORBKIMG").src;		//从原图获取图像数据
}

//设置替换颜色操作中滑块和字符输入控件的联动。

var rv=gv=bv=av=0;		//RGBA Value

//输入数值，更新滑块
function  setSubValue(o)
{
   //if(document.getElementById("T").checked==true)
   //   document.getElementById("T").checked=false;
   bColorTransparent=false;
   switch(o.id)
   {
      case "RV": rv=o.value; document.getElementById("RR").value=rv; document.getElementById("AV").value=document.getElementById("AR").value=av=255; break;
      case "GV": gv=o.value; document.getElementById("GR").value=gv; document.getElementById("AV").value=document.getElementById("AR").value=av=255; break;
      case "BV": bv=o.value; document.getElementById("BR").value=bv; document.getElementById("AV").value=document.getElementById("AR").value=av=255; break;
      case "AV": av=o.value; document.getElementById("AR").value=av; break;
   }
   document.getElementById("COLORVIEW").style.background="rgb("+rv+","+gv+","+bv+","+av+")";
}

//拖动滑块，更新数值
function  setSubColor(o)
{
   //if(document.getElementById("T").checked==true)
   //   document.getElementById("T").checked=false;
   bColorTransparent=false;
   switch(o.id)
   {
      case "RR": rv=o.value; document.getElementById("RV").value=rv; document.getElementById("AV").value=document.getElementById("AR").value=av=255; break;
      case "GR": gv=o.value; document.getElementById("GV").value=gv; document.getElementById("AV").value=document.getElementById("AR").value=av=255; break;
      case "BR": bv=o.value; document.getElementById("BV").value=bv; document.getElementById("AV").value=document.getElementById("AR").value=av=255; break;
      case "AR": av=o.value; document.getElementById("AV").value=av; break;
   }
   document.getElementById("COLORVIEW").style.background="rgb("+rv+","+gv+","+bv+","+av+")";
}


/**********************************************
流程：
1.将复制的图片（在资源管理器中对图片文件执行复制操作，在画图程序中对所选区域执行复制操作，在浏览器中对图片进行复制操作）粘贴到本页面后
2.程序开始保存原始图片ORBKIMG到PREVIEW里，并创建一个遮罩层SHIELDIMG，
3.遮罩层SHIELDIMG会响应鼠标的移动、移出和点击操作，并实时更新SHIELDIMG图像，
4.在点击SHIELDIMG后，程序开始生成PREVIEWIMG。
**********************************************/
//捡色控制相关
var bColorPicker	= false;	//切图还是捡色
var bColorTransparent	= false;	//捡色功能开启控制
var bColorSet		= false;	//在图片上单击，即完成捡色操作。
var bShieldUpdating	= false;	//用于在生成预览效果图时，屏蔽因鼠标移动而发起的新的生成事件
var bNewOrOld		= false;	//追加还是新建
var bImgCreated		= false;	//新图片已创建

//捡色操作结果
var X=Y			= -1;		//已选择的点的坐标
var R=G=B=A		= 0x00;		//所选点/鼠标当前所在点的sRGB颜色
var GATE		= 0;		//阈值 当为0是，完全匹配，当>0时，匹配（R±GATE,G±GATE,B±GATE）
var WIDTH=HEIGHT	= 0;		//图像的高宽
var PREVIEW		= false;	//是否实时预览模式
var strAlgorithm	= "CM";		//算法类型   CM：全图颜色匹配替换   FF：Flood填充

//撤销操作相关
var OptArr		= new Array();	//存放操作步骤。
var nCurrent 		= -1;
var bREADY		= true;		//true：绘制结束，可以开始新的绘制

//填充算法相关
var posArr		= new Array();	//与目标图像分辨率一致的二维数组，凡需要改为透明色的点，在相应位置，数值为1。
var posL1Arr		= new Array();	//一层
var posL2Arr		= new Array();	//二层


/***********************************************
*
**   关闭图片编辑器，终止当前的编辑行为。
*
***********************************************/
function closeIE()
{
   document.getElementById("ImageEditor").style.visibility="hidden";	//隐藏图片编辑器
   document.getElementById("SELECTOR").style.visibility="hidden";	//隐藏图片编辑器
   document.getElementById("COLOR_CHANGER").style.visibility="hidden";	//隐藏图片编辑器
   strExistedFilename='';						//重置
   OptArr.length=0;							//清除图片编辑记录
   updateUndoRedo_UI();							//更新撤销重做按钮
}

/***********************************
*
**  完成图片编辑后，上传图片
*
***********************************/
var strIMGNAME = '';
function uploadImg()
{
   var canvas_Original = document.createElement('CANVAS'),
   ctx_Original = canvas_Original.getContext('2d',{ willReadFrequently:true }),	//响应频繁读写开关
   img_Original = new Image;
   img_Original.crossOrigin = 'Anonymous';
   img_Original.onload = function()
   {
      canvas_Original.height = HEIGHT=img_Original.height;
      canvas_Original.width  = WIDTH=img_Original.width;
      ctx_Original.drawImage(img_Original,0,0);

      if(strExistedFilename)
      {
         var arr=strExistedFilename.split("?t=");	//去掉图片URL里的时间戳。加随机数，是为了让浏览器每次都从服务器获取最新的图片数据，避免浏览器去访问缓存里的旧数据。
         strExistedFilename=arr[0];			//不管split是否成功，实际需要的数据，都在arr[0]里，所以不需要判断split是否成功。
         var nid=strExistedFilename.substr(strExistedFilename,strExistedFilename.lastIndexOf('.'));
         strIMGNAME=nid;
      }
      if ((strIMGNAME = prompt("请输入待上传图片的文件名：\r\n注意：\r\n  0.不需要输入文件的扩展名；\r\n  1.此操作会覆盖服务器上同名图片文件；\r\n  2.文件名中不能包含如下英文符号：\r\n       \\ / : * ? \" < > |", strIMGNAME)) != null) 
      {
         if (strIMGNAME == "") 
         {
            alert("文件名不能为空。");
            return;
         }
         $.post("./WhiteBoard/saveBDIMG.php?t=" + Math.random(), {'GID':gradeid,'IMGNAME':strIMGNAME,"IMGDATA":canvas_Original.toDataURL('image/png')}, function (data) 	//将canvas_Original的数据保存到服务器。
         {
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

            if(data.length>0){								//图片保存成功
               //hidepopupMenu();								//隐藏popup菜单
               document.getElementById("ImageEditor").style.visibility="hidden";	//隐藏图片编辑器
               document.getElementById("SELECTOR").style.visibility="hidden";	//隐藏图片编辑器
               document.getElementById("COLOR_CHANGER").style.visibility="hidden";	//隐藏图片编辑器

               var jsonArr=JSON.parse(data);						//让白板上的图刷新一次

               if(JSON.stringify(jsonArr)=="{}") return;

               strIMGNAME=strIMGNAME.replace("LINES/","");

               if( jsonArr[0].indexOf(strIMGNAME)!=-1)
               {
                  if(document.getElementById(strIMGNAME)==null) insertImg(strIMGNAME,jsonArr[0]);
                  else
                    document.getElementById(strIMGNAME).children[1].src=jsonArr[0]+"?t="+Math.random();	//加随机数，让浏览器获取最新的图片。
               }

               /*for(var i=0;i<jsonArr.length;i++)					//虽然当前系统默认是png，但为了稳妥，再确定一次。
               {
                  if( jsonArr[i].indexOf(strIMGNAME)!=-1)
                  {
                     if(document.getElementById(strIMGNAME)==null) insertImg(strIMGNAME,jsonArr[i]);
                     else
                       document.getElementById(strIMGNAME).children[1].src=jsonArr[i]+"?t="+Math.random();	//加随机数，让浏览器获取最新的图片。
//                       document.getElementById(strIMGNAME).children[1].src="../data/whiteboard/"+room+"./"+gradeid+"/"+jsonArr[i]+"?t="+Math.random();	//加随机数，让浏览器获取最新的图片。
                     break;
                  }
               }*/
               OptArr.length=0;
               saveBD(0);
               updateUndoRedo_UI();
            }
         });//POST
      }
      canvas_Original = null;
   };
   img_Original.src = document.getElementById('PREVIEWIMG').src;
}

/***********************************
*
**  执行切图，并上传图片
*
***********************************/
function shrinkImg()
{
   var canvas_Original = document.createElement('CANVAS'),
   ctx_Original = canvas_Original.getContext('2d',{ willReadFrequently:true }),	//响应频繁读写开关
   img_Original = new Image;
   img_Original.crossOrigin = 'Anonymous';
   img_Original.onload = function()
   {
      canvas_Original.height = HEIGHT=img_Original.height;
      canvas_Original.width  = WIDTH=img_Original.width;
      ctx_Original.drawImage(img_Original,0,0);

      imgData=ctx_Original.getImageData(0,0,img_Original.width,img_Original.height);

      var arrData = new Uint32Array(imgData.data.buffer);		//通过Uint32Array的方式访问数据

      var m=n=0;
      var dx=dy=dw=dh=0;
      var bFound=false;
      for(m=0;m<HEIGHT;m++)						//在原图中匹配，修改遮罩图数据
      {
         for(n=0;n<WIDTH;n++)
         {
            if(arrData[m*WIDTH+n]!=0x00000000)
            {
               bFound=true;
               break;                   				//用Uint32处理，可以少三次赋值。
            }
         }
         if(bFound) { break;}
      }
      bFound=false;
      dy=m;

      for(n=0;n<WIDTH;n++)
      {
         for(m=0;m<HEIGHT;m++)						//在原图中匹配，修改遮罩图数据
         {
            if(arrData[m*WIDTH+n]!=0x00000000)
            {
               bFound=true;
               break;                   				//用Uint32处理，可以少三次赋值。
            }
         }
         if(bFound) { break;}
      }
      bFound=false;
      dx=n;

      for(m=HEIGHT-1;m>0;m--)						//在原图中匹配，修改遮罩图数据
      {
         for(n=0;n<WIDTH;n++)
         {
            if(arrData[m*WIDTH+n]!=0x00000000)
            {
               bFound=true;
               break;                   				//用Uint32处理，可以少三次赋值。
            }
         }
         if(bFound) { break;}
      }
      bFound=false;
      dh=m;

      for(n=WIDTH-1;n>0;n--)
      {
         for(m=HEIGHT-1;m>0;m--)						//在原图中匹配，修改遮罩图数据
         {
            if(arrData[m*WIDTH+n]!=0x00000000)
            {
               bFound=true;
               break;                   				//用Uint32处理，可以少三次赋值。
            }
         }
         if(bFound) { break;}
      }
      bFound=false;
      dw=n;

   
      var canvasCUT = document.createElement('CANVAS'),			//创建新的canvas对象
      ctxCUT = canvasCUT.getContext('2d',{ willReadFrequently:true }),	//响应频繁读写开关
      imgCUT = new Image;
      imgCUT.crossOrigin = 'Anonymous';
      canvasCUT.width    = dw-dx+1;
      canvasCUT.height   = dh-dy;					//设置尺寸大小
      imgData=ctx_Original.getImageData(dx,dy,dw-dx+1,dh-dy);		//获取非空矩形区域的图像数据
      ctxCUT.putImageData(imgData,0,0);					//将图像数据写入到新的ctx中。

      if(strExistedFilename)
      {
         var arr=strExistedFilename.split("?t=");
         strExistedFilename=arr[0];
         var nid=strExistedFilename.substr(strExistedFilename,strExistedFilename.lastIndexOf('.'));
         strIMGNAME=nid;
      }
      if ((strIMGNAME = prompt("请输入待上传图片的文件名：\r\n注意：\r\n  0.不需要输入文件的扩展名；\r\n  1.此操作会覆盖服务器上同名图片文件；\r\n  2.文件名中不能包含如下英文符号：\r\n       \\ / : * ? \" < > |", strIMGNAME)) != null) 
      {
         if (strIMGNAME == "") 
         {
            alert("文件名不能为空。");
            return;
         }
         $.post("./WhiteBoard/saveBDIMG.php?t=" + Math.random(), {'GID':gradeid,'IMGNAME':strIMGNAME,"IMGDATA":canvasCUT.toDataURL('image/png')}, function (data) 	//将canvasCUT中数据提交到服务器
         {
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

            if(data.length>0){//保存成功
               //hidepopupMenu();								//隐藏popup菜单
               document.getElementById("ImageEditor").style.visibility="hidden";	//隐藏图片编辑器
               document.getElementById("SELECTOR").style.visibility="hidden";	//隐藏图片编辑器
               document.getElementById("COLOR_CHANGER").style.visibility="hidden";	//隐藏图片编辑器

               var jsonArr=JSON.parse(data);						//获取提交的图片的实际文件名

               if(JSON.stringify(jsonArr)=="{}") return;


               strIMGNAME=strIMGNAME.replace("LINES/","");

               if( jsonArr[0].indexOf(strIMGNAME)!=-1)
               {
                  if(document.getElementById(strIMGNAME)==null) insertImg(strIMGNAME,jsonArr[0]);
                  else
                    document.getElementById(strIMGNAME).children[1].src=jsonArr[0]+"?t="+Math.random();	//加随机数，让浏览器获取最新的图片。
               }

/*
               for(var i=0;i<jsonArr.length;i++)					//当前系统，默认PNG，但为了稳妥，还是检查一下。
               {
                  if( jsonArr[i].indexOf(strIMGNAME)!=-1)
                  {
                     if(document.getElementById(strIMGNAME)==null) insertImg(strIMGNAME,jsonArr[i]);
                     else
                       document.getElementById(strIMGNAME).children[1].src=jsonArr[i]+"?t="+Math.random();	//加随机数，让浏览器获取最新的图片。
//                       document.getElementById(strIMGNAME).children[1].src="../data/whiteboard/"+room+"/"+gradeid+"/"+jsonArr[i]+"?t="+Math.random();	//加随机数，让浏览器获取最新的图片。
                     break;
                  }
               }
*/
               OptArr.length=0;
               updateUndoRedo_UI();
            }
         });//POST
      }

      canvasCut = null;
      canvas_Original = null;
   };
   img_Original.src = document.getElementById('PREVIEWIMG').src;		//从预览图获取图像数据
}

/*******************************
*
**  下载图片
*
********************************/
function downloadIMG()
{
   var elink=document.createElement("a");
   elink.href=document.getElementById("PREVIEWIMG").src;
   elink.download="saved";
   elink.style.display = "none";
   document.body.appendChild(elink);
   elink.click();
   document.body.removeChild(elink);
}

//1.响应粘贴图片事件
//页面加载完毕后，第一件事情，就是粘贴图片
/*****************************
HTML中，需要有如下元素：
    DIV 	 ID：	ImageEditor
    DIV 	 ID: 	SETTRANS
    DIV 	 ID: 	PREVIEW
    CHECKBOX 	 ID:	NEWOLD
粘贴图片后，在PREVIEW里动态生成了：
    IMG	 	 ID:	ORBKIMG
******************************/

//1.1.加载图片里，为了防止代码臃肿，转换操作放在这里。
//下面的部分操作，则没有进行类似的拆分，所有相关代码放在一个函数里了。

//将图片的数据URL转换成base64格式的图片
function convertImgToBase64(url, callback, outputFormat){
   var canvasOriginal = document.createElement('CANVAS'),				//创建CANVAS。这里的三个变量（canvasOriginal,ctxOriginal,img）为全局变量。
   ctxOriginal = canvasOriginal.getContext('2d',{willReadFrequently:true}),	//响应频繁读写开关
   img = new Image;								//创建Image对象
   img.crossOrigin = 'Anonymous';
   img.onload = function()
   {
      canvasOriginal.height = HEIGHT = img.height;				//更新全局变量WIDTH,HEIGHT
      canvasOriginal.width  = WIDTH  = img.width;
      ctxOriginal.drawImage(img,0,0);
      var dataURL = canvasOriginal.toDataURL(outputFormat || 'image/png');	//转换成PNG格式
      callback.call(this, dataURL);
      canvasOriginal = null;
   };
   img.src = url;								//传入数据，激发onload事件
}

//2.图片粘贴后，如果要设置透明，则需要选中CHECKBOX
//2.1.添加一个透明的遮罩图，用于响应鼠标选色操作。
//设想：在原图ORBKIMG上直接点击，就完成当前图片的确认提交？

//控制捡色功能的开启/关闭
/*****************************
HTML中，需要有如下元素：
    IMG	 	 ID:	ORBKIMG
    DIV		 ID:	SHIELD
    DIV		 ID:	COLORPICKER
开启捡色功能后，在SHIELD里动态生成了：
    IMG	 	 ID:	SHIELDIMG
******************************/
function setColorPicker()
{
   if(bColorPicker)	//鼠标选择切图模式
   {
      document.getElementById("RECT_SELECTOR").style.visibility	= "visible";		//显示切图功能层
      document.getElementById("COLOR_CHANGER").style.visibility	= "hidden";		//隐藏颜色替换层
      document.getElementById("IES").checked			= false;		//“修改颜色”选项置为未选中
      document.getElementById("INFO").innerText 		= "（当前为切图模式，请用鼠标选择需要保留的图像区域。）";	//更新“修改颜色”选项的说明文本
      document.getElementById("SETTRANS").style.display 	= "none";		//隐藏颜色替换的相关控件
      document.getElementById('ImageEditor').style.height 	= (HEIGHT+136)+"px";	//调整“图片编辑”窗口的高度

      //设置监听鼠标选择切图区域的canvas层
      img_SELECTOR = new Image;
      img_SELECTOR.crossOrigin = 'Anonymous';
      img_SELECTOR.onload = function()
      {
         WIDTH  = img_SELECTOR.width;
         HEIGHT = img_SELECTOR.height;

         var canvas_SELECTOR = document.getElementById("SELECTOR");			//访问现有的canvas元素
         ctx_SELECTOR = canvas_SELECTOR.getContext("2d",{ willReadFrequently:true });

         canvas_SELECTOR.setAttribute("width",WIDTH+"px");				//canvas的尺寸由width和height控制，非style里的width和height
         canvas_SELECTOR.setAttribute("height",HEIGHT+"px");				//根据当前图像的大小，调整canvas元素大小

         //编辑图片时，有可能canvas还没有添加图像和事件响应，所以每次切换模式，就强制添加一下。
         canvas_SELECTOR.onmousemove=function() { selector_mousemove(event);};		//响应鼠标移动的事件，获取鼠标在图片上所指的点的坐标
         canvas_SELECTOR.onmousedown=function() { selector_mousedown(event);};		//响应鼠标按键落下的事件
         canvas_SELECTOR.onmouseup=function()   { selector_mouseup(event);  };		//相应鼠标按键抬起的事件
         
         canvas_SELECTOR .style="cursor:crosshair; position:relative; left:0px; top:-"+(HEIGHT)+"px;";
 
         ctx_SELECTOR.drawImage(img_SELECTOR,0,0);		//将图片加载到canvas中

         ctx_SELECTOR.setLineDash([3]);		//设置虚线
         ctx_SELECTOR.lineWidth = 1;			//线条宽度
         ctx_SELECTOR.strokeStyle="red";		//线条颜色

         canvas_SELECTOR = null;
      };
      img_SELECTOR.src =  document.getElementById("PREVIEWIMG").src;//base64Img;
   }
   else			//颜色替换模式
   {
      document.getElementById("IES").checked= true;

      document.getElementById("RECT_SELECTOR").style.visibility= "hidden";
      document.getElementById("COLOR_CHANGER").style.visibility= "visible";

      document.getElementById("INFO").innerText = "（鼠标移动选点，单击可执行颜色替换操作。）";

      document.getElementById("SETTRANS").style.display = "block";
      //document.getElementById("COLORPICKER").style.display = "block";
      document.getElementById('ImageEditor').style.height = (HEIGHT+302)+"px";	//已开启透明设置

      var imgOriginal=document.getElementById("ORBKIMG");			//获取原始图

      var imgShield=document.createElement("IMG");			//生成透明遮罩，用于响应鼠标操作      
      var canvasShield = document.createElement('CANVAS'),
      ctxShield = canvasShield.getContext('2d',{ willReadFrequently:true }),
      imgShield = new Image;
      imgShield.crossOrigin = 'Anonymous';
      imgShield.onload = function()
      {
         canvasShield.width  = WIDTH = imgShield.width;
         canvasShield.height = HEIGHT= imgShield.height;		//这里其实没必要更新WIDTH和HEIGHT，或者直接用WIDTH和HEIGHT，而非imgShield的高宽。
         var dataURL = canvasShield.toDataURL( 'image/png');

         var shield_img = document.createElement('img');
         shield_img.id="SHIELDIMG";					//SHIELDIMG
         shield_img.setAttribute('src', dataURL);
         shield_img.style="cursor:crosshair; position:relative; left:0px; top:-"+(HEIGHT)+"px;";
         shield_img.style.top=-HEIGHT;

         shield_img.onmousemove=function(){ showPos(this,event);};	//响应鼠标在图片上移动的事件，获取鼠标在图片上所指的点的坐标
         shield_img.onmouseout=function() { resetPos(this);     };	//响应鼠标移出图片的事件，重置获取的鼠标在图片上的点的坐标
         shield_img.onmousedown=function(){ setColor(event);         };	//响应鼠标在图片上的单击事件，锁定鼠标在图片上的点的坐标，屏蔽鼠标后续在图片上的其它事件
         //shield_img.onmouseup=function()  { popupMenu(event);   };
         
         bImgCreated=false;						//刚开启，无生成图

         document.getElementById('SHIELD').innerHTML = "";
         document.getElementById('SHIELD').appendChild(shield_img);	//清空、更新预览数据，当前图无色透明。

         canvasShield = null;
      };
      imgShield.src = imgOriginal.src;					//导入原始图
   }
   bColorPicker=!bColorPicker;						//捡色状态翻转
}


/*****************************
*
**  设置替换颜色为透明色
*   则有些地方对bColorTransparent状态的检测，需要取消。
*   部分对遮罩的操作，需要添加到editImg里。
********************************/
var rvb=gvb=bvb=avb=0;
function setColorType()
{
   if(bColorTransparent)							//显示透明色操作的相关控件
   {
      document.getElementById("RR").value = document.getElementById("RV").value = rv = rvb;
      document.getElementById("GR").value = document.getElementById("GV").value = gv = gvb;
      document.getElementById("BR").value = document.getElementById("BV").value = bv = bvb;
      document.getElementById("AR").value = document.getElementById("AV").value = av = avb;
      document.getElementById("COLORVIEW").style.background="rgb("+rv+","+gv+","+bv+","+av+")";
   }
   else
   {
      //document.getElementById("INFO").style.display = "inline";
      rvb=rv;
      gvb=gv;
      bvb=bv;
      avb=av;

      document.getElementById("RR").value = document.getElementById("RV").value = rv = 0;
      document.getElementById("GR").value = document.getElementById("GV").value = gv = 0;
      document.getElementById("BR").value = document.getElementById("BV").value = bv = 0;
      document.getElementById("AR").value = document.getElementById("AV").value = av = 0;

      document.getElementById("COLORVIEW").style.background="rgb("+rv+","+gv+","+bv+","+av+")";
   }
   bColorTransparent=!bColorTransparent;						//捡色状态翻转
}


var pX=pY=-1;


//2.2.选择透明算法

//透明算法控制
function setAlgorithm(o)
{
   strAlgorithm=o.value;
}

//2.3.选择颜色控制的阈值

//GATE数值的页面显示
function setPreview(o)
{
   document.getElementById("GVALUE").innerHTML=o.value;
}

//2.4.是否要从上一次计算的结果继续计算，则由此处进行控制
//控制接下来的透明操作，是使用原始图，还是使用上一次生成的结果

//追加捡色
function addColor()
{
   bNewOrOld=!bNewOrOld;
}

//3.鼠标在图片（其实是遮罩图）上移动时的响应
//3.1.当鼠标在图片（其实是遮罩图）上移动时，实时动态生成遮罩图，高亮显示当前算法适用的区域。

//当鼠标在图片上移动时，显示当前鼠标在图片内的坐标
/*****************************
HTML中，需要有如下元素：
    IMG	 	 ID:	ORBKIMG
    DIV		 ID:	SHIELD
开启捡色功能后，在SHIELD里动态更新了：
    IMG	 	 ID:	SHIELDIMG
******************************/
function showPos(o,ev)
{
   if(!bColorSet && !bShieldUpdating)	//开启捡色功能，且所捡颜色未设定，另添加预览图片更新未结束时再次激发更新的控制bShieldUpdating。
   {
      bShieldUpdating=true;

      var nX=ev.layerX;//ev.clientX+window.pageXOffset-o.offsetLeft-parseInt(o.parentElement.parentElement.parentElement.parentElement.style.left);
      var nY=ev.layerY;//ev.clientY+window.pageYOffset-o.offsetTop -parseInt(o.parentElement.parentElement.parentElement.parentElement.style.top);	//计算鼠标相对于图片的坐标

      //获取图片内鼠标所在坐标的点的颜色值，更新界面，并显示遮罩层
      if(nX>=0 && nY>=0 && nX<WIDTH && nY<HEIGHT)					//鼠标在图片上移动时的坐标，从(0,0)开始，图像数据也从(0,0)开始
      {
         X=nX;
         Y=nY;

         var canvasOriginal = document.createElement('CANVAS'),				//导入源图，获取图像数据
         ctxOriginal = canvasOriginal.getContext('2d',{ willReadFrequently:true }),	//响应频繁读写开关
         imgOriginal = new Image;
         imgOriginal.crossOrigin = 'Anonymous';
         imgOriginal.onload = function()
         {
            canvasOriginal.height = HEIGHT= imgOriginal.height;
            canvasOriginal.width  = WIDTH = imgOriginal.width;
            ctxOriginal.drawImage(imgOriginal,0,0);

            var selectedDotArr=ctxOriginal.getImageData(X,Y,1,1);			//从源图获取当前点颜色
            if(selectedDotArr.colorSpace=="srgb" && selectedDotArr.data.length==4)	//sRGB
            {
               if(R==selectedDotArr.data[0] && 						//这里可改成Uint32访问
                  G==selectedDotArr.data[1] && 
                  B==selectedDotArr.data[2] && 
                  A==selectedDotArr.data[3] ) 						//颜色没变化，不改变当前遮罩图。
               {
                  bShieldUpdating=false;						//当前可响应遮罩更新
                  return;
               }

               document.getElementById("COLOR").style.background =			//将数字的RGB数值，转成“rgb（r,g,b）”
                                  "rgb("+selectedDotArr.data[0]+","			//转16进制（“#RRGGBBAA”）的话，不足的位还要补零，比较麻烦。
                                        +selectedDotArr.data[1]+","
                                        +selectedDotArr.data[2]+")";			//更新颜色指示器背景色

               document.getElementById("TITLE").style.color =
                                  "rgb("+(255-selectedDotArr.data[0])+","
                                        +(255-selectedDotArr.data[1])+","
                                        +(255-selectedDotArr.data[2])+")";		//更新标题栏背景色

               R = selectedDotArr.data[0];						//这里需要Uint8访问
               G = selectedDotArr.data[1];
               B = selectedDotArr.data[2];
               A = selectedDotArr.data[3];						//RGBA
               GATE=parseInt(document.getElementById("GATE").value);			//阈值[0,255]

               //由鼠标的点击获取原图的颜色操作完成，接下来更新实时预览图
               var imgOriginalData=ctxOriginal.getImageData(0,0,WIDTH,HEIGHT);		//获取原图的全部图像数据
               if(strAlgorithm=="CM")							//完全匹配
               {
                  var canvasShield = document.createElement('CANVAS'),			//创建遮罩图CANVAS
                  ctxShield = canvasShield.getContext('2d',{ willReadFrequently:true });//响应频繁读写开关

                  canvasShield.width  = WIDTH;
                  canvasShield.height = HEIGHT;

                  var imgShieldData=ctxShield.getImageData(0,0,WIDTH,HEIGHT);		//获取遮罩图的图像数据句柄

                  for(var i=0;i<imgOriginalData.data.length;i+=4)			//在原图中匹配，修改遮罩图数据
                  {
                     if(abs(imgOriginalData.data[i+0]-R) <= GATE &&			//R,G,B,A
                        abs(imgOriginalData.data[i+1]-G) <= GATE &&
                        abs(imgOriginalData.data[i+2]-B) <= GATE &&
                        abs(imgOriginalData.data[i+3]-A) <= GATE)			//用源图数据进行匹配
                     {
                        imgShieldData.data[i+0] = 255-R;				//如果是Uint32访问，就取反后或0xff000000;
                        imgShieldData.data[i+1] = 255-G;
                        imgShieldData.data[i+2] = 255-B;
                        imgShieldData.data[i+3] = 0xFF;					//高亮反色，输出到遮罩图上。
                     }
                     else
                     {
                        imgShieldData.data[i+3]=0x00;					//匹配失败的颜色，全部改成透明度
                     }
                  }
                  ctxShield.putImageData(imgShieldData,0,0);				//写回遮罩图

                  var dataURL = canvasShield.toDataURL( 'image/png');			//设成图像数据链接

                  var shield_img = document.createElement('img');			//动态生成遮罩图
                  shield_img.id="SHIELDIMG";
                  shield_img.setAttribute('src', dataURL);
                  shield_img.style="cursor:crosshair; position:relative; left:0px; top:-"+(HEIGHT)+"px;";
//                shield_img.style.top=-(HEIGHT)+"px";
                  shield_img.onmousemove=function(){ showPos(this,event); };		//添加鼠标操作响应
                  shield_img.onmouseout =function(){ resetPos(this);      };
                  shield_img.onmousedown=function(){ setColor(event);          };
                  //shield_img.onmouseup=function()  { popupMenu(event);   };
                  document.getElementById('SHIELD').innerHTML="";
                  document.getElementById('SHIELD').appendChild(shield_img);		//清空、更新预览数据

                  canvasShield = null;							//回收资源
                  bShieldUpdating=false;
                  //bImgCreated=false;							//未生成最终图像
               }
               else if(strAlgorithm=="FF")						//Flood填充
               {
                  PREVIEW=true;
                  Flood(imgOriginalData,X,Y,WIDTH,HEIGHT,GATE);
                  bShieldUpdating=false;
               }
            }
            canvasOriginal = null;
         };
         imgOriginal.src=document.getElementById('ORBKIMG').src;
      }
   }
}



//生成并显示预览图(已废弃)
/*
function showPreview()
{
   if(!bShieldUpdating)	//开启捡色功能，且所捡颜色未设定，另添加预览图片更新未结束时再次激发更新的控制bShieldUpdating。
   {
      bShieldUpdating=true;
      var o=document.getElementById("SHIELDIMG");

      var nX=pX-o.offsetLeft-parseInt(o.parentElement.parentElement.parentElement.parentElement.style.left);
      var nY=pY-o.offsetTop -parseInt(o.parentElement.parentElement.parentElement.parentElement.style.top);	//计算鼠标相对于图片的坐标

      //获取图片内鼠标所在坐标的点的颜色值，更新界面，并显示遮罩层
      if(nX>=0 && nY>=0 && nX<WIDTH && nY<HEIGHT)					//鼠标在图片上移动时的坐标，从(0,0)开始，图像数据也从(0,0)开始
      {
         X=nX;
         Y=nY;
         var canvasOriginal = document.createElement('CANVAS'),				//导入源图，获取图像数据
         ctxOriginal = canvasOriginal.getContext('2d',{ willReadFrequently:true }),	//响应频繁读写开关
         imgOriginal = new Image;
         imgOriginal.crossOrigin = 'Anonymous';
         imgOriginal.onload = function()
         {
            canvasOriginal.height = HEIGHT= imgOriginal.height;
            canvasOriginal.width  = WIDTH = imgOriginal.width;
            ctxOriginal.drawImage(imgOriginal,0,0);

            var selectedDotArr=ctxOriginal.getImageData(X,Y,1,1);			//从源图获取当前点颜色
            if(selectedDotArr.colorSpace=="srgb" && selectedDotArr.data.length==4)	//sRGB
            {
               //if(R==selectedDotArr.data[0] && 					//这里可改成Uint32访问
               //   G==selectedDotArr.data[1] && 
               //   B==selectedDotArr.data[2] && 
               //   A==selectedDotArr.data[3] ) 					//颜色没变化，不改变当前遮罩图。
               //{
               //   bShieldUpdating=false;						//当前可响应遮罩更新
               //   return;
               //}

               var c=document.getElementById("COLOR");
               c.style.background="rgb("+selectedDotArr.data[0]+","
                                        +selectedDotArr.data[1]+","
                                        +selectedDotArr.data[2]+")";			//更新界面中的颜色色块

               R = selectedDotArr.data[0];						//这里需要Uint8访问
               G = selectedDotArr.data[1];
               B = selectedDotArr.data[2];
               A = selectedDotArr.data[3];						//RGBA
               GATE=parseInt(document.getElementById("GATE").value);			//阈值[0,255]

               //由鼠标的点击获取原图的颜色操作完成，接下来更新实时预览图
               var imgOriginalData=ctxOriginal.getImageData(0,0,WIDTH,HEIGHT);		//获取原图的全部图像数据
               if(strAlgorithm=="CM")							//完全匹配
               {
                  var canvasShield = document.createElement('CANVAS'),			//创建遮罩图CANVAS
                  ctxShield = canvasShield.getContext('2d',{ willReadFrequently:true });//响应频繁读写开关

                  canvasShield.width  = WIDTH;
                  canvasShield.height = HEIGHT;

                  var imgShieldData=ctxShield.getImageData(0,0,WIDTH,HEIGHT);		//获取遮罩图的图像数据句柄

                  for(var i=0;i<imgOriginalData.data.length;i+=4)			//在原图中匹配，修改遮罩图数据
                  {
                     if(abs(imgOriginalData.data[i+0]-R) <= GATE &&			//R,G,B,A
                        abs(imgOriginalData.data[i+1]-G) <= GATE &&
                        abs(imgOriginalData.data[i+2]-B) <= GATE &&
                        abs(imgOriginalData.data[i+3]-A) <= GATE)			//用源图数据进行匹配
                     {
                        imgShieldData.data[i+0] = 255-R;				//如果是Uint32访问，就取反后或0xff000000;
                        imgShieldData.data[i+1] = 255-G;
                        imgShieldData.data[i+2] = 255-B;
                        imgShieldData.data[i+3] = 0xFF;					//高亮反色，输出到遮罩图上。
                     }
                     else
                     {
                        imgShieldData.data[i+3]=0x00;					//匹配失败的颜色，全部改成透明度
                     }
                  }
                  ctxShield.putImageData(imgShieldData,0,0);				//写回遮罩图

                  var dataURL = canvasShield.toDataURL( 'image/png');			//设成图像数据链接

                  var shield_img = document.createElement('img');			//动态生成遮罩图
                  shield_img.id="SHIELDIMG";
                  shield_img.setAttribute('src', dataURL);
                  shield_img.style="cursor:crosshair; position:relative; left:0px; top:-"+(HEIGHT)+"px;";
//                  shield_img.style.top=-(HEIGHT)+"px";
                  shield_img.onmousemove=function(){ showPos(this,event); };		//添加鼠标操作响应
                  shield_img.onmouseout =function(){ resetPos(this);      };
                  shield_img.onmousedown=function(){ setColor(event);          };
                  //shield_img.onmouseup=function()  { popupMenu(event);   };
                  document.getElementById('SHIELD').innerHTML="";
                  document.getElementById('SHIELD').appendChild(shield_img);		//清空、更新预览数据

                  canvasShield = null;							//回收资源
                  bShieldUpdating=false;
                  //bImgCreated=false;							//未生成最终图像
               }
               else if(strAlgorithm=="FF")						//Flood填充
               {
                  PREVIEW=true;
                  Flood(imgOriginalData,X,Y,WIDTH,HEIGHT,GATE);
                  bShieldUpdating=false;
               }
            }
            canvasOriginal = null;
         };
         imgOriginal.src=document.getElementById('ORBKIMG').src;
      }
   }
}
*/

//3.2.当鼠标移出遮罩图时，进行重置操作

//鼠标移出图片位置，则重置坐标：归零
function resetPos(o)
{
   if(!bColorSet)			//开启捡色功能，且所捡颜色未设定
   {
      X=-1;
      Y=-1;										//坐标恢复默认，不参与颜色选取操作。
      document.getElementById("SHIELDIMG").src = document.getElementById("PREVIEWIMG").src;	//离开区域，遮罩显示原图
      document.getElementById("COLOR").style.background = "black";			//颜色指示器透明
      document.getElementById("TITLE").style.color = "white";				//颜色指示器透明

      R=G=B=A=0x00;					//颜色也透明，这样，在鼠标再入同一区域时，会及时更新预览图。
   }
   bShieldUpdating=false;				//当前遮罩图不在更新，也即可以继续触发更新操作。
}


//3.3.鼠标捡色操作，由鼠标左键的单击操作来完成。

//鼠标单击图片，完成捡色确定
function setColor(e)
{
   if(e.button==0)
   {
      if(!bColorSet)			//开启捡色功能，且所捡颜色未设定
      {
         bColorSet=true;				//捡色操作已完成，其它捡色相关的功能（实时预览，捡色）都将被屏蔽。
         createImg();
      }
   }
}


//3.4.捡色完成后，鼠标再次移到遮罩图上，是不触发实时预览的，这个重新开启的功能，已经放入最终图生成的算法里了。
//所以，此段代码已经可以删除。

//重新开始捡色
function resetColor()
{
   bColorSet=false;					//当点击“重新捡色”按钮时，恢复捡色功能
}


//3.5.捡色完成后，直接就开始生成图片了。
//这个生成里，一共定义了两个算法：简单全图匹配替换和区域填充。

//生成最终图形
function createImg()
{
   if(strAlgorithm=="CM")				//替换
   {
      if( X!=-1 && Y!=-1)
      {
         if(OptArr.length>nCurrent+1)			//撤销若干步后又有新的插入，则舍弃被撤销的步骤。
         {
            for(var i=0;i<(OptArr.length-nCurrent);i++) 
            {
               OptArr.pop();
            }
         }
         OptArr.push(new Array("CM",X,Y,R,G,B,A,rv,gv,bv,av,GATE,bNewOrOld));
         nCurrent++;
         updateUndoRedo_UI();
      }
      else bColorSet=false;
      methodCompleteMatching();
   }
   else if(strAlgorithm=="FF")				//填充
   {
      if( X!=-1 && Y!=-1)
      {
         if(OptArr.length>nCurrent+1)
         {
            for(var i=0;i<(OptArr.length-nCurrent);i++) 
            {
               OptArr.pop();
            }
         }
         OptArr.push(new Array("FF",X,Y,R,G,B,A,rv,gv,bv,av,GATE,bNewOrOld));
         nCurrent++;
         updateUndoRedo_UI();
      }
      else bColorSet=false;
      methodFloodMatching();
   }
}


//4.图片生成后，可以撤销
//实际是从第一个开始重绘
function ieundo()
{
   nCurrent--;
   updateUndoRedo_UI();
   if(nCurrent>=0 && nCurrent<=OptArr.length)
   {
      var bNO=bNewOrOld;				//暂存状态
      var i=0;

      rvb=rv,gvb=gv,bvb=bv,avb=av;

      bFirstUnDo=true;					//撤销操作，就是从原始数据开始，按次序重新做一遍
      strAlgorithm= OptArr[i][0];
      var inX = setInterval(function()
      {
         if(bREADY && i<=nCurrent)
         {
            strAlgorithm= OptArr[i][0];
            X		= OptArr[i][1];			//点坐标
            Y		= OptArr[i][2];
            R		= OptArr[i][3];			//需要被替换的颜色
            G		= OptArr[i][4];
            B		= OptArr[i][5];
            A		= OptArr[i][6];
            rv		= OptArr[i][7];			//需要替换成的颜色
            gv		= OptArr[i][8];
            bv		= OptArr[i][9];
            av		= OptArr[i][10];

            GATE	= OptArr[i][11];		//阈值
            bNewOrOld	= (i==0)?false:OptArr[i][12];	//第一次，不要从新生成的图获取数据
            bColorSet=true;				//颜色已捡定

            reMakeImg(OptArr[i][0]);			//开始后，将bREADY置为false

            i++;
         }
         else if(i>nCurrent)
         {
            clearInterval(inX);
            bNewOrOld=bNO;				//还原状态
            rv=rvb,gv=gvb,bv=bvb,av=avb;

         }
      },100);
   }
   else							//没了，隐藏撤销按钮
   {
      bColorSet=false;
      bImgCreated=false;				//颜色未设定，且图片未生成，强制让最后一张图的数据，从原图获取。
      reMakeImg("");					//恢复到原图状态
   }
}


//5.撤销后，可以重做
function ieredo()
{
   rvb=rv,gvb=gv,bvb=bv,avb=av;				//备份颜色设置
   nCurrent++;
   updateUndoRedo_UI();
   if(nCurrent>=0 && nCurrent<OptArr.length)
   {
      var bNO=bNewOrOld;				//暂存状态
      var i=nCurrent;

      strAlgorithm	= OptArr[i][0];
      X			= OptArr[i][1];			//点坐标
      Y			= OptArr[i][2];
      R			= OptArr[i][3];			//需要被替换的颜色
      G			= OptArr[i][4];
      B			= OptArr[i][5];
      A			= OptArr[i][6];
      rv		= OptArr[i][7];			//需要替换成的颜色
      gv		= OptArr[i][8];
      bv		= OptArr[i][9];
      av		= OptArr[i][10];
      GATE	= OptArr[i][11];			//阈值
      bNewOrOld	= (i==0)?false:OptArr[i][12];		//第一次，不要从新生成的图获取数据
      bColorSet=true;					//颜色已捡定
      reMakeImg(OptArr[i][0]);				//开始后，将bREADY置为false
      var inX = setInterval(function()
      {
         if(bREADY)
         {
             clearInterval(inX);
             bNewOrOld=bNO;				//还原状态
             rv=rvb,gv=gvb,bv=bvb,av=avb;		//还原颜色设置
         }
      },100);
      document.getElementById("IEUNDO").style.visibility	= "visible";
      document.getElementById("IEUNDO").title	= (nCurrent+1);
      document.getElementById("IEREDO").title	= (OptArr.length-nCurrent-1);

      if(nCurrent==OptArr.length-1)			//没了，隐藏重做按钮
      {
         document.getElementById("IEREDO").style.visibility= "hidden";
         document.getElementById("IEREDO").title	 = "";
      }
   }
}


//5.1.撤销与重做，都需要重绘图

//按照OptArr的数据，重绘
function reMakeImg(type)
{
   bREADY=false;
   switch(type)
   {
      case "CM":				//替换
         methodCompleteMatching();
      break;

      case "FF":				//填充
         methodFloodMatching();
      break;

      case "CT":				//切图
         cutImg_REPLAY(X,Y,R,G);
      break;

      case "":					//加载原图
         loadOriginalImg();
      break;
   }
}

//从RAW获取图像数据
function loadOriginalImg()
{
      //获取原始粘贴数据的路径和高宽
      var rawImg = document.getElementById("RAW").src;
      WIDTH      = parseInt(document.getElementById("RAW").width);
      HEIGHT     = parseInt(document.getElementById("RAW").height);

      //存在遮罩图，则需要调整它的图像数据，并按当前实际大小，设定偏移量。
      if(document.getElementById("SHIELDIMG")!=null)
      {
         document.getElementById("SHIELDIMG").src          = rawImg;
         document.getElementById("SHIELDIMG").style.top    = "-"+HEIGHT+"px";
         document.getElementById("SHIELDIMG").style.width  = WIDTH+"px";
         document.getElementById("SHIELDIMG").style.height = HEIGHT+"px";
      }
      //调整图片编辑器窗口的尺寸
      document.getElementById('ImageEditor').style.width   = (WIDTH+20)+"px";
      document.getElementById('ImageEditor').style.height  = (HEIGHT+302)+"px";
      document.getElementById('PREVIEW').style.height      = (HEIGHT)+"px";		//调整预览窗口的高
      document.getElementById("PREVIEWIMG").src 	   = rawImg;			//更新预览图
      document.getElementById("ORBKIMG").src      	   = rawImg;			//更新当前原图备份

      //这个SELECTOR是canvas对象，所以不能通过简单的修改src的值的方式来修改显示的图像。
      img_SELECTOR = new Image;
      img_SELECTOR.crossOrigin = 'Anonymous';
      img_SELECTOR.onload = function()
      {
         WIDTH  = img_SELECTOR.width;
         HEIGHT = img_SELECTOR.height;

         let canvas_SELECTOR = document.getElementById("SELECTOR");

         //canvas的尺寸由属性width和height控制，不能用style来控制。
         canvas_SELECTOR.setAttribute("width",WIDTH+"px");
         canvas_SELECTOR.setAttribute("height",HEIGHT+"px");
         canvas_SELECTOR .style="cursor:crosshair; position:relative; left:0px; top:-"+(HEIGHT)+"px;";

         //canvas_SELECTOR指向了已经存在的SELECTOR，所以事件已经设置完成，不需要重复设置
         //canvas_SELECTOR.onmousemove=function() { selector_mousemove(event);};	//响应鼠标在图片上移动的事件，获取鼠标在图片上所指的点的坐标
         ////canvas_SELECTOR.onmouseout=function(){ selector_mouseout(event);     };	//响应鼠标移出图片的事件，重置获取的鼠标在图片上的点的坐标
         //canvas_SELECTOR.onmousedown=function() { selector_mousedown(event);    };	//响应鼠标在图片上的单击事件，锁定鼠标在图片上的点的坐标，屏蔽鼠标后续在图片上的其它事件
         //canvas_SELECTOR.onmouseup=function()   { selector_mouseup(event);   };	//相应鼠标左键抬起的事件，当前，鼠标右键抬起也生效了，需要处理。

         //ctx_SELECTOR需要重新设置线条的样式
         ctx_SELECTOR = canvas_SELECTOR.getContext("2d",{ willReadFrequently:true });
         ctx_SELECTOR.drawImage(img_SELECTOR,0,0);		//将图片加载到canvas中
         ctx_SELECTOR.setLineDash([3]);				//设置虚线
         ctx_SELECTOR.lineWidth = 1;				//线条宽度
         ctx_SELECTOR.strokeStyle="red";			//线条颜色

         canvas_SELECTOR = null;
      };
      img_SELECTOR.src =  rawImg;
}


//6.颜色匹配算法
//var timetest;
//生成透明图：匹配全部
function methodCompleteMatching()
{
   doCompleteMatching(function(base64Img)
   {
      document.getElementById('PREVIEWIMG').src = base64Img;
      document.getElementById('SHIELDIMG').src  = document.getElementById("PREVIEWIMG").src;	//更新遮罩图为生成图
      bREADY      = true;									//步骤就绪，可执行下一步骤。
      bImgCreated = true;									//已生成图像，可用于二次叠加
      bColorSet   = false;									//捡色已完成，可继续捡色
   });
}


//6.1.对图像进行颜色匹配
//修改图像数据，将指定的颜色(0xAABBGGRR)改为透明色（0x00000000）
//32位色中，AA为alpha通道，黑色为0x000000FF
function doCompleteMatching( callback, outputFormat)
{
   var canvas_Original = document.createElement('CANVAS'),
   ctx_Original = canvas_Original.getContext('2d',{ willReadFrequently:true }),			//频繁读写开关
   img_Original = new Image;
   img_Original.crossOrigin = 'Anonymous';
   img_Original.onload = function()
   {
      canvas_Original.height = img_Original.height;
      canvas_Original.width  = img_Original.width;
      ctx_Original.drawImage(img_Original,0,0);

      var img_OriginalData=ctx_Original.getImageData(0,0,img_Original.width,img_Original.height);	//获取图像所有数据

      if(bColorSet)	//开启捡色功能，且所捡颜色未设定
      {
         for(var i=0;i<img_OriginalData.data.length;i+=4)			//匹配，修改
         {
            if(abs(img_OriginalData.data[i+0]-R) <= GATE &&			//R,G,B,A
               abs(img_OriginalData.data[i+1]-G) <= GATE &&
               abs(img_OriginalData.data[i+2]-B) <= GATE &&
               abs(img_OriginalData.data[i+3]-A) <= GATE)
            {
               img_OriginalData.data[i+0] = rv;//0x00;
               img_OriginalData.data[i+1] = gv;//0x00;
               img_OriginalData.data[i+2] = bv;//0x00;
               img_OriginalData.data[i+3] = av;//0x00;
            }
         }
      }
      ctx_Original.putImageData(img_OriginalData,0,0);				//写回

      var dataURL = canvas_Original.toDataURL(outputFormat || 'image/png');	//生成图片数据的URL
      callback.call(this, dataURL);
      canvas_Original  = null;
   };
   if(!bNewOrOld || bImgCreated==false)						//当未生成结果图，或不叠加算法时，从原始图获取数据
      img_Original.src = document.getElementById('ORBKIMG').src;
   else
      img_Original.src = document.getElementById('PREVIEWIMG').src;
}

//7.区域填充算法
//生成透明图：flood淹没填充
function methodFloodMatching()
{
   //var output_img = document.createElement('img');
   //timetest=Date.now();
   doFloodFilling(function(base64Img)
   {
      document.getElementById('PREVIEWIMG').src = base64Img;
      document.getElementById('SHIELDIMG').src  = document.getElementById("PREVIEWIMG").src;
      bREADY      = true;							//步骤就绪，可执行下一步骤。
      bImgCreated = true;							//已生成图像，可用于二次叠加
      bColorSet   = false;							//捡色已完成，可继续捡色
   });
}

//7.1.对图像进行区域填充
//修改图像数据，将指定的颜色(0xRRGGBBAA)改为透明色（0x00000000）
//32位色中，AA为alpha通道，黑色为0x000000FF
function doFloodFilling(callback, outputFormat){
   var canvas_Original = document.createElement('CANVAS'),
   ctx_Original = canvas_Original.getContext('2d',{ willReadFrequently:true }),	//响应频繁读写开关
   img_Original = new Image;
   img_Original.crossOrigin = 'Anonymous';
   img_Original.onload = function()
   {
      canvas_Original.height = HEIGHT;
      canvas_Original.width  = WIDTH;
      ctx_Original.drawImage(img_Original,0,0);

      imgData=ctx_Original.getImageData(0,0,img_Original.width,img_Original.height);

      //var Uint32PairedColor =0x00000000;
      //if(!bColorTransparent) 
      var Uint32PairedColor = av<<24 | (bv<<16) | (gv<<8) | rv;	//实际所选颜色

      if(bColorSet)						//开启捡色功能，且所捡颜色未设定
      {
         PREVIEW=false;
         Flood(imgData,X,Y,WIDTH,HEIGHT,GATE);

         var arrData = new Uint32Array(imgData.data.buffer);	//通过Uint32Array的方式访问数据

         for(var m=0;m<HEIGHT;m++)				//在原图中匹配，修改遮罩图数据
         {
            for(var n=0;n<WIDTH;n++)
            {
               if(posArr[m][n]==1)				//与所选颜色相匹配的点，设置为补色
               {
                  arrData[m*WIDTH+n]=Uint32PairedColor ;	//用Uint32处理，可以少三次赋值。
               }
            }
         }
      }
      ctx_Original.putImageData(imgData,0,0);

      var dataURL = canvas_Original.toDataURL(outputFormat || 'image/png');
      callback.call(this, dataURL);
      canvas_Original = null;
   };
   if(!bNewOrOld || bImgCreated==false)				//当未生成结果图，或不叠加算法时，从原始图获取数据
      img_Original.src = document.getElementById('ORBKIMG').src;
   else
      img_Original.src = document.getElementById('PREVIEWIMG').src;
}


//7.1.1.填充算法，需要区分预览与最终生成
//PREVIEW为true时，需要使用drawIMG来生成实时的遮罩图，匹配的区域被设置为当前所选点颜色的反色，其余区域透明，
//而生成最终的图时，则是将匹配的区域设置为透明。
/**************************************
*
**   区域填充算法
**
**      2
**     212			 			//0所在位置为鼠标所在的初始位置
**    21012			 			//1所在的位置，为0点的上下左右各点，记为一层
**     212                    				//2所在的位置，为一层中各点的上下左右各点（去掉了已被记录的重复项），记为二层
**      2						//以此向外衍生探测
*
***************************************/
function Flood(imgData,x,y,width,height,gate)
{
   posArr=new Array(height);   				//初始化空数据的二维数组posArr[HEIGHT][WIDTH];
   for(var i=0;i<height;i++)
      posArr[i]=new Array(width);
   posArr[y][x]=1;					//鼠标所在点必定符合修改的条件

   posL1Arr.length	= 0;				//归零
   posL2Arr.length	= 0;
   posL1Arr.push(Array(x,y));				//第一轮计算，从鼠标所在点开始

   checkXY(imgData,x,y,width,height,gate);		//检测posL1Arr和posL2Arr中的点，
   if(PREVIEW)						//鼠标移动的预览模式
      drawIMG(imgData,width,height);			//根据posArr中的记录，修改并生成遮罩图。
}


//7.1.1.1.由给定的点（X,Y）,检测它上下左右四个点是否符合要求
//这段主代码，主要是生成要检测的点，并进行相应的检测，把符合要求的点写入posArr。

//获取需要设为透明的点的坐标
function checkXY(imgData,x,y,width,height,gate)				//获取点（x,y）周围的四个点
{
   var bNeedNextLevelCheck = true;					//如果找不到符合要求的点，就返回false，算法结束。
   while(bNeedNextLevelCheck)
   {
      bNeedNextLevelCheck  = true;
      posL2Arr.length      = 0;						//归零。存放找到的符合匹配要求的新点。
      posL1Arr.forEach(function(xy)					//获取posL1Arr中的各点的坐标的上下左右四个点。
      {
         if(checkDot(imgData,   xy[0]+1, xy[1],width,height,gate))	//检查右边点。
         { 								//该点符合匹配要求，保存到posArr中，并存入posL2Arr，以便下一轮检测
            posArr[xy[1]][xy[0]+1] = 1;					//置1表示该点是我们要找的颜色
            posL2Arr.push(Array(xy[0]+1, xy[1]));			//为下一轮检测做准备
            bNeedNextLevelCheck    = true;				//找到了新的点，需要进入下一轮
         }
         if(checkDot(imgData,   xy[0]-1, xy[1],width,height,gate))	//检查左边点。
         {
            posArr[xy[1]][xy[0]-1] = 1;
            posL2Arr.push(Array(xy[0]-1, xy[1]));
            bNeedNextLevelCheck    = true;
         }
         if(checkDot(imgData,   xy[0],   xy[1]+1,width,height,gate))	//检查下方点。
         {
            posArr[xy[1]+1][xy[0]] = 1;
            posL2Arr.push(Array(xy[0],   xy[1]+1));
            bNeedNextLevelCheck    =true;
         }
         if(checkDot(imgData,   xy[0],   xy[1]-1,width,height,gate))	//检查上方点。
         {
            posArr[xy[1]-1][xy[0]] = 1;
            posL2Arr.push(Array(xy[0],   xy[1]-1));
            bNeedNextLevelCheck    = true;
         }
      });

      if(bNeedNextLevelCheck)			//刚才一轮，发现了新的点，需要继续检测。posL1Arr与posL2Arr交替。
      {						//算法同上一轮，只是源数据在posL2Arr中，而找到的新点，需要存入posL1Arr。
         bNeedNextLevelCheck = false;
         posL1Arr.length     = 0;		//归零
         posL2Arr.forEach(function(xy)		//获取posL2Arr中的各点的坐标的上下左右四个点。
         {
            if(checkDot(imgData,   xy[0]+1, xy[1],width,height,gate))	//检查右边点。
            {
               posArr[xy[1]][xy[0]+1] = 1;
               posL1Arr.push(Array(xy[0]+1, xy[1]));
               bNeedNextLevelCheck    = true;	
            }
            if(checkDot(imgData,   xy[0]-1, xy[1],width,height,gate))	//检查左边点。
            {
               posArr[xy[1]][xy[0]-1] = 1;
               posL1Arr.push(Array(xy[0]-1, xy[1]));
               bNeedNextLevelCheck    = true;			
            }
            if(checkDot(imgData,   xy[0],   xy[1]+1,width,height,gate))	//检查下方点。
            {
               posArr[xy[1]+1][xy[0]] = 1;
               posL1Arr.push(Array(xy[0],   xy[1]+1));
               bNeedNextLevelCheck    = true;			
            }
            if(checkDot(imgData,   xy[0],   xy[1]-1,width,height,gate))	//检查上方点。
            {
               posArr[xy[1]-1][xy[0]] = 1;
               posL1Arr.push(Array(xy[0],   xy[1]-1));
               bNeedNextLevelCheck    = true;			
            }
         });
      }
   }
}

//7.1.1.2.检测点（X,Y）是否在有效区域内，是否已经探测过，是否与预定颜色相匹配

//检测是否出界，并检测坐标（x,y）所对应的点是否满足颜色匹配
function checkDot(imgData,x,y,width,height,gate)
{
   if(x>=0 && x<width && y>=0 && y<height)				//先检测是否越界 （x:[0,WIDTH) , y:[0,HEIGHT)）
   {
      if(posArr[y][x]==undefined)					//再检测是否已经探测过
      {
         if(abs(imgData.data[(y*width+x)*4+0]-R) <= gate &&		//如果点（x,y）的颜色符合要求，就返回true
            abs(imgData.data[(y*width+x)*4+1]-G) <= gate &&		//否则返回false
            abs(imgData.data[(y*width+x)*4+2]-B) <= gate &&
            abs(imgData.data[(y*width+x)*4+3]-A) <= gate )
         {
            return true;  
         }
         else return false;						//颜色不匹配
      }
      else return false;						//已经探测过
   }
   else return false;							//坐标出界，返回false
}

//6.1.1.3.日常迷信，不过好像位运算是要快点？
//计算绝对值
//据说比Math.abs快？
function abs(n)
{
   return (n^(n>>31))-(n>>31);
}


//7.1.1.4.填充算法中的绘图操作
/************************************
*
**   按照posArr中的数据，进行图形绘制
*
**************************************/
function drawIMG(imgData,width,height)
{
   var canvasShield = document.createElement('CANVAS'),			//创建遮罩图CANVAS
   ctxShield = canvasShield.getContext('2d',{willReadFrequently:true});	//响应频繁读写开关

   canvasShield.width  = width;						//图像宽度
   canvasShield.height = height;					//图像高度

   var imgShieldData=ctxShield.getImageData(0,0,width,height);		//获取遮罩图的全部图像数据

   var arrData = new Uint32Array(imgShieldData.data.buffer);		//通过Uint32Array的方式访问数据
   var Uint32PairedColor =0xff<<24 | ((255-B)<<16) | ((255-G)<<8) | (255-R);	//反色

   //var Uint32PairedColor =0x00000000;
   //if(!bColorTransparent) 
   //   Uint32PairedColor = av<<24 | (bv<<16) | (gv<<8) | rv;	//反色


   //var Uint32Color= (A<<24) | (B<<16) | (G<<8) | R;			//鼠标所选点的32位颜色值。

   for(var m=0;m<height;m++)						//在原图中匹配，修改遮罩图数据
   {
      for(var n=0;n<width;n++)
      {
         if(posArr[m][n]==1)						//与所选颜色相匹配的点，设置为补色
         {
            arrData[m*width+n] = Uint32PairedColor;
         }
      }
   }

   ctxShield.putImageData(imgShieldData,0,0);			//写回
   var dataURL = canvasShield.toDataURL( 'image/png');		//设成图像数据链接

   var shield_img = document.createElement('img');		//生成遮罩图
   shield_img.id="SHIELDIMG";
   shield_img.setAttribute('src', dataURL);
   shield_img.style="cursor:crosshair; position:relative; left:0px; top:-"+(HEIGHT)+"px;";
   shield_img.onmousemove=function(){ showPos(this,event); };	//添加鼠标操作响应
   shield_img.onmouseout =function(){ resetPos(this);      };
   shield_img.onmousedown=function(){ setColor(event);     };
   //shield_img.onmouseup=function()  { popupMenu(event);  };
   document.getElementById('SHIELD').innerHTML="";
   document.getElementById('SHIELD').appendChild(shield_img);	//清空、更新预览数据
  
   canvasShield = null;						//回收资源
}
//图片编辑器



//响应回车
document.addEventListener('keydown',function (event){
   if(event.keyCode == 13){
     addText();
   }
});



//白板图片资源上传
if(document.getElementById('addtxt')!=null)
document.getElementById('addtxt').onpaste = function () 
{
   function pasteImg(e) 
   {
      if (e.clipboardData.items) 
      {
         var ele = e.clipboardData.items
         for (var i = 0; i < ele.length; ++i) 
         {

            if (ele[i].kind == 'string' && ele[i].type.indexOf('text/plain') !== -1) 
            {
               var str= e.clipboardData.getData("text");
               var o=document.getElementById('addtxt');
               var ovalue_left=o.value.substr(0,o.selectionStart);
               //var ovalue_mid=o.value.substr(o.selectionStart,o.selectionEnd-o.selectionStart);
               var ovalue_right=o.value.substr(o.selectionEnd,o.value.length);
               o.value=ovalue_left+str+ovalue_right;

            }
            else if (ele[i].kind == 'file' && ele[i].type.indexOf('image/gif') !== -1) 
            {
               var blob = ele[i].getAsFile();
               var reader = new FileReader();
               reader.readAsDataURL(blob);
               reader.onload=function()
               {
                  var strIMGNAME='';
                  if ((strIMGNAME = prompt("请输入待上传图片的文件名：\r\n注意：\r\n  0.不需要输入文件的扩展名；\r\n  1.此操作会覆盖服务器上同名图片文件；\r\n  2.文件名中不能包含如下英文符号：\r\n       \\ / : * ? \" < > |", strIMGNAME)) != null) 
                  {
                     if (strIMGNAME == "") 
                     {
                        alert("文件名不能为空。");
                        return;
                     }


                    $.post("./WhiteBoard/saveBDIMG.php?t=" + Math.random(), {'GID':gradeid,'IMGNAME':strIMGNAME,"IMGDATA":reader.result}, function (data) 	//将canvasCUT中数据提交到服务器
                    {
                       if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
                       if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
                       if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

                       if(data.length>0){//保存成功
                          var jsonArr=JSON.parse(data);						//获取提交的图片的实际文件名

                          if(JSON.stringify(jsonArr)=="{}") return;


                          strIMGNAME=strIMGNAME.replace("LINES/","");

                          if( jsonArr[0].indexOf(strIMGNAME)!=-1)
                          {
                             if(document.getElementById(strIMGNAME)==null) insertImg(strIMGNAME,jsonArr[0]);
                             else
                                document.getElementById(strIMGNAME).children[1].src=jsonArr[0]+"?t="+Math.random();	//加随机数，让浏览器获取最新的图片。
                          }

/*
                          for(var i=0;i<jsonArr.length;i++)					//当前系统，默认PNG，但为了稳妥，还是检查一下。
                          {
                             if( jsonArr[i].indexOf(strIMGNAME)!=-1)
                             {
                                if(document.getElementById(strIMGNAME)==null) insertImg(strIMGNAME,jsonArr[i]);
                                else
                                   document.getElementById(strIMGNAME).children[1].src=jsonArr[i]+"?t="+Math.random();	//加随机数，让浏览器获取最新的图片。
//                                   document.getElementById(strIMGNAME).children[1].src="../data/whiteboard/"+room+"/"+gradeid+"/"+jsonArr[i]+"?t="+Math.random();	//加随机数，让浏览器获取最新的图片。
                                break;
                             }
                          }
*/
                       }
                    });//POST


                  }
               }
            }
            else if (ele[i].kind == 'file' && ele[i].type.indexOf('image/') !== -1) 
            {
               var blob = ele[i].getAsFile();
               window.URL = window.URL || window.webkitURL;
               var blobUrl = window.URL.createObjectURL(blob);
               convertBDImgToBase64(blobUrl, function(base64Img)
               {
                  document.getElementById("RAW").src=base64Img;			//粘贴的图片原始数据，用于撤销操作。

                  var new_img = document.createElement('img');			//动态创建HTML图片元素
                  new_img.id="ORBKIMG";
                  new_img.setAttribute('src', base64Img);
                  new_img.style="display:none; cursor: crosshair;position:relative;top:0px;left:0px;";
                  bImgCreated=false

                  var new_img2 = document.createElement('img');			//动态创建HTML图片元素
                  new_img2.id="PREVIEWIMG";
                  new_img2.setAttribute('src', base64Img);
                  new_img2.style="cursor: crosshair;position:relative;top:0px;left:0px;top:0px";//-"+(HEIGHT>50?HEIGHT:0)+"px;";

                  document.getElementById('NEWOLD').checked	= false;	//重置“追加颜色”设置
                  document.getElementById('PREVIEW').innerHTML	= "";		//清空预览数据
                  document.getElementById('PREVIEW').appendChild(new_img);	//在预览位置，插入隐藏的原始图
                  document.getElementById('PREVIEW').appendChild(new_img2);	//在预览位置，插入预览图
                  document.getElementById('SETTRANS').style.display = "none";	//显示“设置透明色”操作控制

                  //document.getElementById('SHIELDIMG').src = document.getElementById("PREVIEWIMG").src;	//显示“设置透明色”操作控制
		  //动态调整界面大小
                  document.getElementById('ImageEditor').style.width = (WIDTH+20)+"px";
                  document.getElementById('ImageEditor').style.height = (HEIGHT+136)+"px";	//调整ImageEditor的高宽
                  document.getElementById('PREVIEW').style.height = (HEIGHT)+"px";		//调整预览窗口的高

                  OptArr.length=0;
                  updateUndoRedo_UI();

                  document.getElementById("ImageEditor").style.visibility="visible";
                  document.getElementById("ImageEditor").style.top=window.scrollY+HEIGHT/3;	//显示图片编辑器

                  nCurrent=-1;
                  OptArr.length=0;

                  bColorPicker=true;							//执行后，自动关闭
                  setColorPicker();

                  //更新canvas图
                  img_SELECTOR = new Image;
                  img_SELECTOR.crossOrigin = 'Anonymous';
                  img_SELECTOR.onload = function(){
                     WIDTH  = img_SELECTOR.width;
                     HEIGHT = img_SELECTOR.height

                     //canvas的尺寸由width和height控制，非style里的width和height
                     var canvas_SELECTOR = document.getElementById("SELECTOR");

                     canvas_SELECTOR.setAttribute("width",WIDTH+"px");
                     canvas_SELECTOR.setAttribute("height",HEIGHT+"px");

                     ctx_SELECTOR = canvas_SELECTOR.getContext("2d",{ willReadFrequently:true });
                     canvas_SELECTOR .style="cursor:crosshair; position:relative; left:0px; top:-"+(HEIGHT)+"px;";
                     ctx_SELECTOR.drawImage(img_SELECTOR,0,0);		//将图片加载到canvas中
                     ctx_SELECTOR.setLineDash([3]);		//设置虚线
                     ctx_SELECTOR.lineWidth = 1;			//线条宽度
                     ctx_SELECTOR.strokeStyle="red";		//线条颜色

                     canvas_SELECTOR.onmousemove=function() { selector_mousemove(event);};	//响应鼠标在图片上移动的事件，获取鼠标在图片上所指的点的坐标
                     //canvas_SELECTOR.onmouseout=function(){ selector_mouseout(event);     };	//响应鼠标移出图片的事件，重置获取的鼠标在图片上的点的坐标
                     canvas_SELECTOR.onmousedown=function() { selector_mousedown(event);    };	//响应鼠标在图片上的单击事件，锁定鼠标在图片上的点的坐标，屏蔽鼠标后续在图片上的其它事件
                     canvas_SELECTOR.onmouseup=function()   { selector_mouseup(event);   };	//相应鼠标左键抬起的事件，当前，鼠标右键抬起也生效了，需要处理。
         
                     canvas_SELECTOR = null;

                     document.getElementById('RECT_SELECTOR').style.visibility= "visible";	//
                  };
                  img_SELECTOR.src =  base64Img;
               });
            }
            else if (ele[i].kind == 'file' && ele[i].type.indexOf('video/') !== -1) 
            {
               var blob = ele[i].getAsFile();
               var reader = new FileReader();
               reader.readAsDataURL(blob);
               reader.onload=function()
               {
                  var strVNAME='';
                  if ((strVNAME = prompt("请输入待上传图片的文件名：\r\n注意：\r\n  0.不需要输入文件的扩展名；\r\n  1.此操作会覆盖服务器上同名图片文件；\r\n  2.文件名中不能包含如下英文符号：\r\n       \\ / : * ? \" < > |", strVNAME)) != null) 
                  {
                     if (strVNAME == "") 
                     {
                        alert("文件名不能为空。");
                        return;
                     }
                     $.post("./WhiteBoard/saveBDVIDEO.php?t=" + Math.random(), {'GID':gradeid,'VIDEONAME':strVNAME,"VIDEODATA":reader.result}, function (data) 	//将canvas_Original的数据保存到服务器。
                     {
                        if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
                        if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
                        if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

                        if(data.length>0){								//图片保存成功
                           var jsonArr=JSON.parse(data);						//让白板上的图刷新一次

                           if(JSON.stringify(jsonArr)=="{}") return;
                           for(var i=0;i<jsonArr.length;i++)					//虽然当前系统默认是png，但为了稳妥，再确定一次。
                           {
                              if( jsonArr[i].indexOf(strVNAME)!=-1)
                              {
                                 if(document.getElementById(strVNAME)==null) insertVideo(strVNAME,jsonArr[i]);
                                 else
                                    document.getElementById(strVNAME).children[1].src=jsonArr[i]+"?t="+Math.random();	//加随机数，让浏览器获取最新的图片。
//                                    document.getElementById(strVNAME).children[1].src="../data/whiteboard/"+room+"/"+gradeid+"/"+jsonArr[i]+"?t="+Math.random();	//加随机数，让浏览器获取最新的图片。
                                 break;
                              }
                           }
                           OptArr.length=0;
                        }
                     });//POST
                  }
               }
            }
         }
      } 
      else 
      {
         alert('您的浏览器不支持粘贴图片功能,请换更高版本浏览器.');
      }
   };

   pasteImg(event);
   return false;
};

//将blobURL转成指定格式的图片数据
function convertBDImgToBase64(url, callback, outputFormat)
{
   var canvas = document.createElement('CANVAS'),
   ctx = canvas.getContext('2d',{willReadFrequently:true}),
   img = new Image;
   img.crossOrigin = 'Anonymous';
   img.onload = function()
   {
      canvas.height = HEIGHT = img.height;
      canvas.width = WIDTH = img.width;
      ctx.drawImage(img,0,0);
      var dataURL = canvas.toDataURL(outputFormat || 'image/png');
      callback.call(this, dataURL);
      canvas = null;
   };
   img.src = url;
}

//白板图片资源上传


//显示更多操作菜单
function showOPTMenu()
{
   document.getElementById('menu').style.visibility="visible";
}

//隐藏更多操作菜单
function hideOPTMenu()
{
   document.getElementById('menu').style.visibility="hidden";
   document.getElementById('sub').style.visibility="hidden";
}

//擦黑板
function cleanBD()
{
   if(confirm("你确认要擦掉白板上的内容？此操作不可撤销。"))
   {
      document.getElementById('attachments').innerHTML="";

      document.getElementById("back").style.visibility="hidden";
      //document.getElementById("all").style.visibility="hidden";
      document.getElementById("pause").style.visibility="hidden";
      saveBD(0);
   }
}

//添加遮盖层
function coverBD()
{
   var bd=document.getElementById("attachments");
   var d=document.createElement("DIV");
   d.style="width: 650px;    height: 480px;    position: absolute;    left: -16px;    top: 25px;    background: beige;border-radius: 3%;";
   d.setAttribute("class","ATTACH");
   //d.ondblclick=function(){this.style.left="-3px";this.style.top="18px";};
   //d.onmousedown=function(){dragBD(this,event)};		//添加后并不及时更新，而是等拖动后再更新。

   bd.appendChild(d);
   saveBD(0);
}


//显示相关链接：作业管理，在线测试，Scratch3.0教学平台和电子邮箱
function showLink(o,type)
{
   if(o.checked)
   {
      setLINK(type,"inline-block");
   }
   else
   {
      setLINK(type,"none");
   }
}

//显示附件
function showAttach(o)
{
   if(o.value)
   {
      if(o.value=="|HIDEALLNOW|")
         hideATTACH(o);
      else
         setATTACH(o.value,"inline-block");
   }
}

//隐藏全部附件
function hideATTACH(o)
{
   for(var i=2;i<o.options.length;i++)
   {
      setATTACH(o.options[i].value,"none");
   }
}

//显示图片/文字顶部工具栏
function showControl(o)
{
   o.children[0].style.visibility="visible";
}

//隐藏图片/文字顶部工具栏
function hideControl(o)
{
   o.children[0].style.visibility="hidden";
}

//查看当前学生端登录情况
function showList()
{
   document.getElementById("ControlPanel").style.visibility="visible";
}

//查看当前学生已上交作品
function showWorks()
{
   document.getElementById("viewer").src="./WhiteBoard/showArtWorks.php";
   document.getElementById("ImageViewer").style.visibility="visible";
}

//下载Scratch比赛作品
function getWorks()
{
   window.open("../dir/dl.php");
}


//显示任务列表
function showTask()
{
   //document.getElementById("ControlPanel").style.visibility="visible";
}

//开启速问速答
function showQuiz()
{
   init();
   document.getElementById("quick").style.visibility="visible";
   document.getElementById("ControlPanel").style.visibility="visible";
   enterQuiz();
}

//关闭速问速答
function hideQuiz()
{
   document.getElementById("quick").style.visibility="hidden";
   document.getElementById("ControlPanel").style.visibility="hidden";
   quitQuiz();
}

var targetDiv=null;

function saveEditorText()
{
   if(targetDiv!=null)
   {
      if(targetDiv.children.length==0)
         targetDiv.innerText=document.getElementById("texteditor").value;
      else
         targetDiv.children[0].innerText=document.getElementById("texteditor").value;

      document.getElementById("texteditor").style.visibility="hidden";
      targetDiv=null;
   }
}

function editText(txt)
{
   var editor=document.getElementById("texteditor");
   editor.style.visibility="visible";

   if(txt.children.length==0)
   {
      editor.style.left=(txt.parentElement.offsetLeft-10)+"px";
      editor.style.top=(txt.parentElement.offsetTop+4)+"px";
      editor.style.width=txt.style.width;
      editor.style.height=(txt.parentElement.offsetHeight)+"px";
      editor.style.fontSize=txt.style.fontSize;
   }
   else
   {
      editor.style.left=(txt.parentElement.offsetLeft-10)+"px";
      editor.style.top=(txt.parentElement.offsetTop+4)+"px";
      editor.style.width=txt.children[0].offsetWidth+"px";
      editor.style.height=(txt.parentElement.offsetHeight)+"px";
      editor.style.fontSize=txt.children[0].style.fontSize;
   }
   editor.value=txt.innerText;
   targetDiv=txt;
}

/**************************************************
*
** 添加鼠标手绘线条。
*
***************************************************/
function addLines()
{
   if(document.getElementById("DRAWLINES").checked==true)
   {
      document.getElementById("myLines").style.visibility="visible";
   }
   else
   {
      document.getElementById("myLines").style.visibility="hidden";
   }
}

/**************************************************
*
** 手动输入文本后，添加到白板上。
*
***************************************************/
function addText()
{
   var text=document.getElementById("addtxt");
   var color=document.getElementById("color");
   var fontsize=document.getElementById("fontsize");

   if(text!=null && text.value.length>0)
   {
      hideHistoryTXT();

      var bd=document.getElementById("attachments");
      var divx = document.createElement("div");			//创建新DIV
      divx.id=  "NEWTXT_"+Math.random(1,100);			//新ID
      divx.style="position:absolute;width:166px;left:150px;top:26px;";
      divx.setAttribute("class","ATTACH");

      divx.onmouseover=function(){showControl(this);};
      divx.onmouseout=function(){hideControl(this);};

      var divcontrol = document.createElement("div");		//创建新DIV
      divcontrol.style="visibility:hidden;background: ghostwhite;width:166px;";

      var remove = document.createElement("img");		//创建新IMG：删除按钮
      remove.src="./img/recycle.png";
      remove.title="回收";
      remove.style="position: relative;top: 2px;";
      remove.onclick=function(){ removeText(divx.id);};
      divcontrol.appendChild(remove);

      var sizeup=document.createElement("img");			//修改字号
      sizeup.src="./img/fadd.png";
      sizeup.title="加大字号";
      sizeup.style="position:relative;left:7px;top: 2px;";
      sizeup.onclick=function(){ sizeUP(this); };
      divcontrol.appendChild(sizeup);

      var sizedown=document.createElement("img");
      sizedown.src="./img/fsub.png";
      sizedown.title="缩小字号";
      sizedown.style="position:relative;left:11px;top: 2px;";
      sizedown.onclick=function(){ sizeDOWN(this); };
      divcontrol.appendChild(sizedown);

      var widthdown=document.createElement("img");		//修改宽度
      widthdown.src="./img/wsub.png";
      widthdown.title="缩窄";
      widthdown.style="position:relative;left:16px;top: 2px;";
      widthdown.onclick=function(){ widthDOWN(this); };
      divcontrol.appendChild(widthdown);

      var widthup=document.createElement("img");
      widthup.src="./img/wadd.png";
      widthup.title="拉宽";
      widthup.style="position:relative;left:21px;top: 2px;";
      widthup.onclick=function(){ widthUP(this); };
      divcontrol.appendChild(widthup);

      var txtcolor=document.createElement("select");		//修改颜色
      txtcolor.title="修改颜色";
      var opt=document.createElement("option");
      opt.style.color="black";
      opt.value="black";
      opt.text="黑";
      if(color.value=="black") opt.selected=true;
      txtcolor.add(opt);
      var opt=document.createElement("option");
      opt.style.color="white";
      opt.value="white";
      opt.text="白";
      if(color.value=="white") opt.selected=true;
      txtcolor.add(opt);
      var opt=document.createElement("option");
      opt.style.color="red";
      opt.value="red";
      opt.text="红";
      if(color.value=="red") opt.selected=true;
      txtcolor.add(opt);
      var opt=document.createElement("option");
      opt.style.color="yellow";
      opt.value="yellow";
      opt.text="黄";
      if(color.value=="yellow") opt.selected=true;
      txtcolor.add(opt);
      var opt=document.createElement("option");
      opt.style.color="blue";
      opt.value="blue";
      opt.text="蓝";
      if(color.value=="blue") opt.selected=true;
      txtcolor.add(opt);
      var opt=document.createElement("option");
      opt.style.color="green";
      opt.value="green";
      opt.text="绿";
      if(color.value=="green") opt.selected=true;
      txtcolor.add(opt);
      txtcolor.style="position:relative;left:26px;top:0px;color:"+color.value;
      txtcolor.onchange=function(){ changeColor(this); };
      divcontrol.appendChild(txtcolor);
      divx.appendChild(divcontrol);


                  var layerUp = document.createElement("img");			//创建新IMG：删除按钮
                  layerUp.style="position: relative; left: 27px;  top: 2px;";
                  layerUp.title="上移一层";
                  layerUp.src="./img/layerup.png";
                  layerUp.onclick=function(){  setLayer(this,true);};
                  divcontrol.appendChild(layerUp);

                  var layerDown = document.createElement("img");			//创建新IMG：删除按钮
                  layerDown.style="position: relative; left: 27px;  top: 2px;";
                  layerDown.title="下移一层";
                  layerDown.src="./img/layerdown.png";
                  layerDown.onclick=function(){ setLayer(this,false);};
                  divcontrol.appendChild(layerDown);

      var txt = document.createElement("div");			//创建新IMG：附件
      //txt.textAlign="center";
      txt.innerText=text.value;					//文本
      txt.style.color=color.value;				//颜色
      txt.style.fontSize=fontsize.value+"px";			//字号
      txt.style.width=(text.value.length*fontsize.value)+"px";		//宽度
      txt.onmousedown=function(){dragBD(this,event)};		//添加后并不及时更新，而是等拖动后再更新。

      txt.ondblclick=function(){editText(this);};
      divx.appendChild(txt);

      bd.appendChild(divx);					//往白板中插入此新DIV

      if(historyTXTID=='')
         saveTXT(divx.id,text.value);				//如果有旧ID，就不能保存。
      else
         historyTXTID='';					//旧ID标记重置。
   }
}

//设置文本的颜色
function changeColor(o)
{
   o.style.color=o.value;
   var div=o.parentElement.parentElement;

   if(div.children[1].childNodes[0].outerHTML!=undefined)
      div.children[1].childNodes[0].style.color=o.value;
   else
      div.children[1].style.color=o.value;
   saveTXT(div.id,div.children[1].innerText);
   saveBD(0);
}

//增大文本的字号
function sizeUP(o)
{
   var div=o.parentElement.parentElement;
   if(div.children[1].childNodes[0].outerHTML!=undefined)
      div.children[1].childNodes[0].style.fontSize=(parseInt(div.children[1].childNodes[0].style.fontSize)+2)+"px";
   else
      div.children[1].style.fontSize=(parseInt(div.children[1].style.fontSize)+2)+"px";
   saveTXT(div.id,div.children[1].innerText);
   saveBD(0);
}


//减小文本的字号
function sizeDOWN(o)
{
   var div=o.parentElement.parentElement;
   if(div.children[1].childNodes[0].outerHTML!=undefined)
      div.children[1].childNodes[0].style.fontSize=(parseInt(div.children[1].childNodes[0].style.fontSize)-2)+"px";
   else
      div.children[1].style.fontSize=(parseInt(div.children[1].style.fontSize)-2)+"px";;
   saveTXT(div.id,div.children[1].innerText);
   saveBD(0);
}

//增加文本区域的宽度
function widthUP(o)
{
   var div=o.parentElement.parentElement;
   if(div.children[1].childNodes[0].outerHTML!=undefined)
      div.children[1].childNodes[0].style.width=(parseInt(div.children[1].childNodes[0].style.width)+10)+"px";
   else
      div.children[1].style.width=(parseInt(div.children[1].style.width)+10)+"px";
   saveTXT(div.id,div.children[1].innerText);
   saveBD(0);
}

//减小文本区域的宽度
function widthDOWN(o)
{
   var div=o.parentElement.parentElement;
   if(div.children[1].childNodes[0].outerHTML!=undefined)
      div.children[1].childNodes[0].style.width=(parseInt(div.children[1].childNodes[0].style.width)-10)+"px";
   else
      div.children[1].style.width=(parseInt(div.children[1].style.width)-10)+"px";
   saveTXT(div.id,div.children[1].innerText);
   saveBD(0);
}

function videoHeightUP(o)
{
   var div=o.parentElement.parentElement;
   if(div.children[1].childNodes[0]!=undefined)
      div.children[1].childNodes[0].height=(parseInt(div.children[1].childNodes[0].height)+10);
   else
      div.children[1].height=(parseInt(div.children[1].height)+10);
   saveBD(0);
}
function videoHeightDOWN(o)
{
   var div=o.parentElement.parentElement;
   if(div.children[1].childNodes[0]!=undefined)
      div.children[1].childNodes[0].height=(parseInt(div.children[1].childNodes[0].height)-10);
   else
      div.children[1].height=(parseInt(div.children[1].height)-10);
   saveBD(0);
}

/**************************************************
*
** 删除白板上的文本
**
** id：要删除的DIV的ID
*
***************************************************/
function removeText(id)
{
   //if(confirm("你确定要彻底删除此文本么？\r\n注意：此操作不可撤销！")==1)
   //{
   var idx=document.getElementById(id);   	//删除已存在的DIV
   idx.parentElement.removeChild(idx);
   saveBD(0);				//删除后及时更新数据
   //}
}




//小白板文本的历史记录处理

//显示文本历史记录
function showHistoryTXT()
{
   historyTXTID='';
   var value=document.getElementById("addtxt").value;
   if(value)
   {
      $.post("./WhiteBoard/getBDTXT.php?t=" + Math.random(), {'GID':gradeid,'TXT':value}, function (data) 	//将canvas_Modified的数据保存到服务器。
      {
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

         if(data.length>0){
            document.getElementById("historyTXT").innerHTML=data; 
            document.getElementById("historyTXT").style.visibility="visible"; 
         }
         else{ 
           document.getElementById("historyTXT").innerHTML=""; 
           document.getElementById("historyTXT").style.visibility="hidden"; 
         }
      });
   }
   else hideHistoryTXT();
}

//隐藏文本历史记录
function hideHistoryTXT()
{
   document.getElementById("historyTXT").innerHTML='';
   document.getElementById("historyTXT").style.visibility="hidden";
}

//保存文本到历史记录中
function saveTXT(ID,DATA)
{
   $.post("./WhiteBoard/saveBDTXT.php?t=" + Math.random(), {'GID':gradeid, 'ID':ID , 'DATA':DATA}, function (data) 
   {
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

      if(data.length>0){ 
         if(data!="[\"OK\"]") alert(data);
      }
   });
}

var historyTXTID='';
//使用历史记录里的文本数据
function setTXT(id,value)
{
   document.getElementById("addtxt").value=value;
   historyTXTID=id;
   hideHistoryTXT();
}

//保存文本到历史记录中
function deleteTXT(ID)
{
   if(confirm("您确定要删除此条记录么？此操作不可撤销。"))
   {
      $.post("./WhiteBoard/deleteBDTXT.php?t=" + Math.random(), {'GID':gradeid,'ID':ID }, function (data) 
      {
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

         if(data.length>0){ 
            if(data=="[\"OK\"]") showHistoryTXT();
            else  alert(data);
         }
      });
   }
}


/**************************************************
*
** 从下拉列表中选择图片，并添加到白板上。
*
***************************************************/
function addImg()
{
   var o=document.getElementById("attach");
   if(o.value)
   {
      var arr=o.value.split("?t=");
      //if(arr.length==2)
      var ovalue=arr[0];   

      var arr2=ovalue.split("data/whiteboard/"+room+"/"+gradeid+"/");

      if(arr2.length>1)
         ovalue=arr2[1];
   
      var nid=ovalue.substr(o.value,o.value.lastIndexOf('.'));

      if(ovalue.indexOf(".mp4")>0)//添加视频
      {


      var bd=document.getElementById("attachments");
      var divx = document.createElement("div");			//创建新DIV
      divx.id=nid;
      divx.style="position:absolute;top:30px;";
      divx.setAttribute("class","ATTACH");

      divx.onmouseover=function(){showControl(this);};
      divx.onmouseout=function(){hideControl(this);};

      var divcontrol = document.createElement("div");		//创建新DIV
      divcontrol.style="visibility:hidden;background: ghostwhite; width: 110px; height: 22px; position: relative;";

      //var ovalue=ovalue;
      var remove = document.createElement("img");			//创建新IMG：删除按钮
      remove.style="position: relative;top: 2px;";
      remove.title="回收";
      remove.src="./img/recycle.png";
      remove.onclick=function(){ recycleImg(ovalue);};
      divcontrol.appendChild(remove);

      var heightup=document.createElement("img");
      heightup.src="./img/vup.png";
      heightup.title="增加高度";
      heightup.style="position:relative;left:6px;top: 2px;";
      heightup.onclick=function(){ videoHeightUP(this); };
      divcontrol.appendChild(heightup);

      var heightdown=document.createElement("img");		//修改宽度
      heightdown.src="./img/vsub.png";
      heightdown.title="降低高度";
      heightdown.style="position:relative;left:10px;top: 2px;";
      heightdown.onclick=function(){ videoHeightDOWN(this); };
      divcontrol.appendChild(heightdown);


                  var layerUp = document.createElement("img");			//创建新IMG：删除按钮
                  layerUp.style="position: relative; left: 11px;  top: 2px;";
                  layerUp.title="上移一层";
                  layerUp.src="./img/layerup.png";
                  layerUp.onclick=function(){  setLayer(this,true);};
                  divcontrol.appendChild(layerUp);

                  var layerDown = document.createElement("img");			//创建新IMG：删除按钮
                  layerDown.style="position: relative; left: 11px;  top: 2px;";
                  layerDown.title="下移一层";
                  layerDown.src="./img/layerdown.png";
                  layerDown.onclick=function(){ setLayer(this,false);};
                  divcontrol.appendChild(layerDown);

      var del = document.createElement("img");			//创建新IMG：删除按钮
      del.style="position: relative; left: 14px;  top: 2px;";
      del.title="彻底删除";
      del.src="./img/delete.png";
      del.onclick=function(){ deleteImg(ovalue);};
      divcontrol.appendChild(del);

      divx.appendChild(divcontrol);

      var video = document.createElement("video");			//创建新IMG：附件
      video.setAttribute("controls",true);
      video.setAttribute("height","100");
      video.src="../data/whiteboard/"+room+"/"+gradeid+"/"+ovalue+"?t="+Math.random();
      video.onmousedown=function(){dragBD(this,event)};		//添加后并不及时更新，而是等拖动后再更新。
      video.title=nid;
      divx.appendChild(video);

      bd.appendChild(divx);					//往白板中插入此新DIV



      }
      else//添加图片
      {
      //var arr=o.value.split("?t=");
      //if(arr.length==2)
      //o.value=arr[0];      
      //var nid=o.value.substr(o.value,o.value.lastIndexOf('.'));

      var bd=document.getElementById("attachments");
      var divx = document.createElement("div");			//创建新DIV
      divx.id=nid;
      divx.style="position:absolute;top:30px;";
      divx.setAttribute("class","ATTACH");

      divx.onmouseover=function(){showControl(this);};
      divx.onmouseout=function(){hideControl(this);};

      var divcontrol = document.createElement("div");		//创建新DIV
      divcontrol.style="visibility:hidden;background: ghostwhite; width: 114px; height: 22px; position: relative;";

      //var ovalue=o.value;
      var remove = document.createElement("img");			//创建新IMG：删除按钮
      remove.style="position: relative;top: 2px;";
      remove.title="回收";
      remove.src="./img/recycle.png";
      remove.onclick=function(){ recycleImg(ovalue);};
      divcontrol.appendChild(remove);

      //var ovalue=o.value;
      if(ovalue.indexOf(".gif")==-1)
      {
         var edit = document.createElement("img");			//创建新IMG：删除按钮
         edit.style="position: relative;left: 6px;top: 2px;";
         edit.title="编辑";
         edit.src="./img/edit.png";
         //edit.onclick=function(){ editImg(ovalue);};
         edit.onclick=function(){editImg(ovalue);};
         divcontrol.appendChild(edit);
      }


      var heightup=document.createElement("img");
      heightup.src="./img/vup.png";
      heightup.title="增加高度";
      heightup.style="position:relative;left:6px;top: 2px;";
      heightup.onclick=function(){ videoHeightUP(this); };
      divcontrol.appendChild(heightup);

      var heightdown=document.createElement("img");		//修改宽度
      heightdown.src="./img/vsub.png";
      heightdown.title="降低高度";
      heightdown.style="position:relative;left:10px;top: 2px;";
      heightdown.onclick=function(){ videoHeightDOWN(this); };
      divcontrol.appendChild(heightdown);


                  var layerUp = document.createElement("img");			//创建新IMG：删除按钮
                  layerUp.style="position: relative; left: 11px;  top: 2px;";
                  layerUp.title="上移一层";
                  layerUp.src="./img/layerup.png";
                  layerUp.onclick=function(){  setLayer(this,true);};
                  divcontrol.appendChild(layerUp);

                  var layerDown = document.createElement("img");			//创建新IMG：删除按钮
                  layerDown.style="position: relative; left: 11px;  top: 2px;";
                  layerDown.title="下移一层";
                  layerDown.src="./img/layerdown.png";
                  layerDown.onclick=function(){ setLayer(this,false);};
                  divcontrol.appendChild(layerDown);

      var del = document.createElement("img");			//创建新IMG：删除按钮
      del.style="position: relative; left: 11px;  top: 2px;";
      del.title="彻底删除";
      del.src="./img/delete.png";
      del.onclick=function(){ deleteImg(ovalue);};
      divcontrol.appendChild(del);

      divx.appendChild(divcontrol);

      var img = document.createElement("img");			//创建新IMG：附件
      img.src="../data/whiteboard/"+room+"/"+gradeid+"/"+ovalue+"?t="+Math.random();
      img.onmousedown=function(){dragBD(this,event)};		//添加后并不及时更新，而是等拖动后再更新。
      img.title=nid;
      divx.appendChild(img);

      bd.appendChild(divx);					//往白板中插入此新DIV
      }
      o.remove(o.selectedIndex);				//从下拉列表中删除当前选中项，确保白板中每份数据的唯一性。
   }
}

/**************************************************
*
** 通过复制粘贴操作插入图片
**
** imgname：复制粘贴操作插入的图片的名字
** imgfullname：带扩展名
*
***************************************************/
function insertImg(imgname,imgfullname,nLeft=0,nTop=0,nWidth=0,nHeight=0)
{
   if(imgname && imgfullname)
   {
      var bd=document.getElementById("attachments");
      var divx = document.createElement("div");			//创建新DIV
      divx.id=imgname;

      divx.style="position:absolute;left:"+nLeft+"px;top:"+nTop+"px;width: 113px; height: 22px;";

      //divx.style="position:absolute;top:26px;";
      divx.setAttribute("class","ATTACH");

      divx.onmouseover=function(){showControl(this);};
      divx.onmouseout=function(){hideControl(this);};

      var divcontrol = document.createElement("div");		//创建新DIV
      divcontrol.style="visibility:hidden;background: ghostwhite;  position: relative;top:-19px;";

      var remove = document.createElement("img");			//创建新IMG：删除按钮
      remove.style="position: relative;top: 2px;";
      remove.title="回收";
      remove.src="./img/recycle.png";
      remove.onclick=function(){ recycleImg(imgfullname);};
      divcontrol.appendChild(remove);

      if(imgfullname.indexOf(".gif")==-1)
      {
         var edit = document.createElement("img");			//创建新IMG：删除按钮
         edit.style="position: relative;left: 6px;top: 2px;";
         edit.title="编辑";
         edit.src="./img/edit.png";
         //remove.onclick=function(){ editImg(imgfullname);};
         edit.onclick=function(){ editImg(imgfullname);};
         divcontrol.appendChild(edit);
      }


      var heightup=document.createElement("img");
      heightup.src="./img/vup.png";
      heightup.title="增加高度";
      heightup.style="position:relative;left:6px;top: 2px;";
      heightup.onclick=function(){ videoHeightUP(this); };
      divcontrol.appendChild(heightup);

      var heightdown=document.createElement("img");		//修改宽度
      heightdown.src="./img/vsub.png";
      heightdown.title="降低高度";
      heightdown.style="position:relative;left:10px;top: 2px;";
      heightdown.onclick=function(){ videoHeightDOWN(this); };
      divcontrol.appendChild(heightdown);

                  var layerUp = document.createElement("img");			//创建新IMG：删除按钮
                  layerUp.style="position: relative; left: 11px;  top: 2px;";
                  layerUp.title="上移一层";
                  layerUp.src="./img/layerup.png";
                  layerUp.onclick=function(){  setLayer(this,true);};
                  divcontrol.appendChild(layerUp);

                  var layerDown = document.createElement("img");			//创建新IMG：删除按钮
                  layerDown.style="position: relative; left: 11px;  top: 2px;";
                  layerDown.title="下移一层";
                  layerDown.src="./img/layerdown.png";
                  layerDown.onclick=function(){ setLayer(this,false);};
                  divcontrol.appendChild(layerDown);

      var del = document.createElement("img");			//创建新IMG：删除按钮
      del.style="position: relative; left: 11px;  top: 2px;";
      del.title="彻底删除";
      del.src="./img/delete.png";
      del.onclick=function(){ deleteImg(imgfullname);};
      divcontrol.appendChild(del);

      divx.appendChild(divcontrol);

      var img = document.createElement("img");			//创建新IMG：附件

//      img.src="../data/whiteboard/"+room+"/"+gradeid+"/"+imgfullname+"?t="+Math.random();
      img.src=imgfullname+"?t="+Math.random();

      if(nWidth!=0 && nHeight!=0)
         img.style="width: "+nWidth+"px; height: "+nHeight+"px";

      img.style="position:absolute;top:0px;";
      img.onmousedown=function(){dragBD(this,event)};		//添加后并不及时更新，而是等拖动后再更新。
      img.title=imgname;
      divx.appendChild(img);

      bd.appendChild(divx);					//往白板中插入此新DIV
   }
}

function insertVideo(vname,vfullname)
{
   if(vname && vfullname)
   {
      var bd=document.getElementById("attachments");
      var divx = document.createElement("div");			//创建新DIV
      divx.id=vname;
      divx.style="position:absolute;top:26px;";
      divx.setAttribute("class","ATTACH");

      divx.onmouseover=function(){showControl(this);};
      divx.onmouseout=function(){hideControl(this);};

      var divcontrol = document.createElement("div");		//创建新DIV
      divcontrol.style="visibility:hidden;background: ghostwhite; width: 110px; height: 22px; position: relative;";

      var remove = document.createElement("img");			//创建新IMG：删除按钮
      remove.style="position: relative;top: 2px;";
      remove.title="回收";
      remove.src="./img/recycle.png";
      remove.onclick=function(){ recycleImg(vfullname);};
      divcontrol.appendChild(remove);

      var heightup=document.createElement("img");
      heightup.src="./img/vup.png";
      heightup.title="增加高度";
      heightup.style="position:relative;left:4px;top: 2px;";
      heightup.onclick=function(){ videoHeightUP(this); };
      divcontrol.appendChild(heightup);

      var heightdown=document.createElement("img");		//修改宽度
      heightdown.src="./img/vsub.png";
      heightdown.title="降低高度";
      heightdown.style="position:relative;left:5px;top: 2px;";
      heightdown.onclick=function(){ videoHeightDOWN(this); };
      divcontrol.appendChild(heightdown);


                  var layerUp = document.createElement("img");			//创建新IMG：删除按钮
                  layerUp.style="position: relative; left: 11px;  top: 2px;";
                  layerUp.title="上移一层";
                  layerUp.src="./img/layerup.png";
                  layerUp.onclick=function(){  setLayer(this,true);};
                  divcontrol.appendChild(layerUp);

                  var layerDown = document.createElement("img");			//创建新IMG：删除按钮
                  layerDown.style="position: relative; left: 11px;  top: 2px;";
                  layerDown.title="下移一层";
                  layerDown.src="./img/layerdown.png";
                  layerDown.onclick=function(){ setLayer(this,false);};
                  divcontrol.appendChild(layerDown);

      var del = document.createElement("img");			//创建新IMG：删除按钮
      del.style="position: relative; left: 12px;  top: 2px;";
      del.title="彻底删除";
      del.src="./img/delete.png";
      del.onclick=function(){ deleteImg(vfullname);};
      divcontrol.appendChild(del);

      divx.appendChild(divcontrol);

      var video = document.createElement("video");			//创建新IMG：附件
      video.setAttribute("controls",true);
      video.setAttribute("height","100");
//      video.src="../data/whiteboard/"+room+"/"+gradeid+"/"+vfullname+"?t="+Math.random();
      video.src=vfullname+"?t="+Math.random();
      video.onmousedown=function(){dragBD(this,event)};		//添加后并不及时更新，而是等拖动后再更新。
      video.title=vname;
      divx.appendChild(video);

      bd.appendChild(divx);			
   }
}
/***************************************************
*
** 在白板上删除图片，删除的图片重新回到下拉列表中。
**
** o：附件下拉列表句柄
** value：要删除的IDV的ID值，与要添加的附件下拉列表的值相同
*
***************************************************/
function recycleImg(value)
{
   if(value)
   {

      var fns=value.split("/");
      var ids=fns[fns.length-1].split(".");
      ids.pop();//去掉扩展名
      var id=ids.join(".");

      var o=document.getElementById("attach");
      var arr=value.split("?t=");
      //if(arr.length==2)
      value=arr[0];
      //var nid=value.substr(value,value.lastIndexOf('.'));

      var idx=document.getElementById(id);   //删除已存在的DIV
      if(idx!=null)
         idx.parentElement.removeChild(idx);

      var bFound=0;			   //确保不重复添加附件
      for(i=0;i<o.length;i++)
      {
        if(o[i].value==id) {bFound=1;break;}
      } 
      if(bFound==0)
         o.append(new Option(id,value));
      sortOption(o);
      saveBD(0);			//删除后及时更新数据
   }
}

/***************************************************
*
** 编辑白板上的图片
**
** value：要编辑的图片的文件名
*
***************************************************/
var strExistedFilename="";				//当前正在编辑的图片
function editImg(value)
{
   document.getElementById("IES").checked			= true;		//“修改颜色”选项置为未选中

   strExistedFilename=value;							//记录文件名，在保存时需要

   var canvas_Original = document.createElement('CANVAS'),			//加载图片
   ctx_Original = canvas_Original.getContext('2d',{ willReadFrequently:true }),
   img_Original = new Image;
   img_Original.crossOrigin = 'Anonymous';
   img_Original.onload = function()
   {
      canvas_Original.height = HEIGHT = img_Original.height;			//获取高宽，在更新界面时需要。
      canvas_Original.width  = WIDTH = img_Original.width;
      ctx_Original.drawImage(img_Original,0,0);
      canvas_Original = null;

      var new_orbkimg = document.createElement('img');				//原图
      new_orbkimg.id="ORBKIMG";
      new_orbkimg.setAttribute('src', "../data/whiteboard/"+room+"/"+gradeid+"/"+value+"?t="+Math.random());
      new_orbkimg.style="display:none; cursor: crosshair;position:relative;top:0px;left:0px;";
      bImgCreated=false;

      var new_previewimg = document.createElement('img');				//预览图
      new_previewimg.id="PREVIEWIMG";
      new_previewimg.setAttribute('src', "../data/whiteboard/"+room+"/"+gradeid+"/"+value+"?t="+Math.random());
      new_previewimg.style="cursor: crosshair;position:relative;top:0px;left:0px;top:0px";

      var shield_img = document.createElement('img');
      shield_img.id="SHIELDIMG";					//SHIELDIMG
      shield_img.setAttribute('src', "../data/whiteboard/"+room+"/"+gradeid+"/"+value+"?t="+Math.random());
      shield_img.style="cursor:crosshair; position:relative; left:0px; top:-"+(HEIGHT)+"px;";
      shield_img.style.top=-HEIGHT;
      shield_img.onmousemove=function(){ showPos(this,event);};	//响应鼠标在图片上移动的事件，获取鼠标在图片上所指的点的坐标
      shield_img.onmouseout=function() { resetPos(this);     };	//响应鼠标移出图片的事件，重置获取的鼠标在图片上的点的坐标
      shield_img.onmousedown=function(){ setColor(event);         };	//响应鼠标在图片上的单击事件，锁定鼠标在图片上的点的坐标，屏蔽鼠标后续在图片上的其它事件

      document.getElementById('SHIELD').innerHTML = "";
      document.getElementById('SHIELD').appendChild(shield_img);	//清空、更新预览数据，当前图无色透明。

      document.getElementById('PREVIEW').innerHTML	= "";			//清空预览数据
      document.getElementById('PREVIEW').appendChild(new_orbkimg);			//在预览位置，插入隐藏的原始图
      document.getElementById('PREVIEW').appendChild(new_previewimg);			//在预览位置，插入预览图
      document.getElementById('SETTRANS').style.display = "block";		//显示“设置透明色”操作控制

      document.getElementById('ImageEditor').style.width = (WIDTH+20)+"px";	//动态调整界面大小
      document.getElementById('ImageEditor').style.height = (HEIGHT+302)+"px";	//调整ImageEditor的高宽
      document.getElementById('PREVIEW').style.height = (HEIGHT)+"px";		//调整预览窗口的高

      document.getElementById('NEWOLD').checked	= false;			//重置“追加颜色”设置
      bImgCreated=false;						//刚开启，无生成图

      OptArr.length=0;
      updateUndoRedo_UI();

      document.getElementById("RR").value = document.getElementById("RV").value = rv = rvb = 0;
      document.getElementById("GR").value = document.getElementById("GV").value = gv = gvb = 0;
      document.getElementById("BR").value = document.getElementById("BV").value = bv = bvb = 0;
      document.getElementById("AR").value = document.getElementById("AV").value = av = avb = 0;

      bColorPicker=true;							//执行后，自动关闭
      setColorPicker();
      document.getElementById("IES").checked = false;
      document.getElementById("COLORVIEW").style.background = "rgb(0,0,0,0)";

      document.getElementById('ImageEditor').style.visibility= "visible";	//显示图片编辑器
      document.getElementById("ImageEditor").style.top=window.scrollY+HEIGHT/3;

      bImgCreated=true;
      nCurrent=-1;
      OptArr.length=0;
   };
//   img_Original.src = value+"?t="+Math.random();			//通过URL从服务器导入图片资源
   if(value.indexOf("/whiteboard/")==-1)
      img_Original.src = "../data/whiteboard/"+room+"/"+gradeid+"/"+value+"?t="+Math.random();			//通过URL从服务器导入图片资源
   else
   {
      var imgArr=value.split("whiteboard/"+room+"/"+gradeid+"/");
      img_Original.src = value+"?t="+Math.random();			//通过URL从服务器导入图片资源
      value=imgArr[1];
      strExistedFilename=value;
   }
}


/***************************************************
*
** 在白板上删除图片，并删除服务器上的文件
**
** value：要删除的IDV的ID值，与要添加的附件下拉列表的值相同
*
***************************************************/
function deleteImg(value)
{
   if(confirm("你确定要彻底删除此图片么？\r\n注意：此操作不可撤销！")==1)
   {
      var arr=value.split("?t=");
      //if(arr.length==2)
      value=arr[0];
      var nid=value.substr(value,value.lastIndexOf('.'));

      nid=nid.replace("./LINES/","");
      nid=nid.replace("LINES/","");

      var idx=document.getElementById(nid);   //删除已存在的DIV
      idx.parentElement.removeChild(idx);
      saveBD(0);			//删除后及时更新数据

      $.post("./WhiteBoard/delBDIMG.php?t=" + Math.random(), {'GID':gradeid,'IMGNAME':value}, function (data) 
      {
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

         if(data.length>0){ 
            alert(data);
         }
      });
   }
}

/**************************
*
**  下拉列表排序
*
****************************/
//排序规则
function sortRule(a,b)
{
   var x = a._text;
   var y = b._text;
   return x.localeCompare(y);
}
//排序对象
function op()
{
   var _value;
   var _text;
   var _selected;
}
//排序
function sortOption(obj)
{
   var tmp = new Array();
   for(var i=1;i<obj.options.length;i++)
   {
      var ops = new op();
      ops._value = obj.options[i].value;
      ops._text = obj.options[i].text;
      ops._selected = obj.options[i].selected;
      tmp.push(ops);
   }
   tmp.sort(sortRule);
   for(var j=0;j<tmp.length;j++)
   {
      obj.options[j+1].value=tmp[j]._value;
      obj.options[j+1].text=tmp[j]._text;
      obj.options[j+1].selected=tmp[j]._selected;
   }
}


/**************
*
**  小白板上图文的拖动处理
*
**************/
function setDragFunc()
{
   bAllowedDrag=!bAllowedDrag;
}

function dragBD(elementToDrag, event) 
{
   if(!bAllowedDrag) return;
    var startX = event.clientX, startY = event.clientY;

    var origX = elementToDrag.parentElement.offsetLeft, origY = elementToDrag.parentElement.offsetTop;
    var deltaX = startX - origX, deltaY = startY - origY;
    if (document.addEventListener) 
    {
        document.addEventListener("mousemove", moveHandler, true);
        document.addEventListener("mouseup", upHandler, true);
    }
    else 
    {
        elementToDrag.parentElement.setCapture();
        elementToDrag.parentElement.attachEvent("onmousemove", moveHandler);
        elementToDrag.parentElement.attachEvent("onmouseup", upHandler);
        elementToDrag.parentElement.attachEvent("onlosecapture", upHandler);
    }
    if (event.stopPropagation) event.stopPropagation();
    else event.cancelBubble = true;
    if (event.preventDefault) event.preventDefault();
    else event.returnValue = false;

    function moveHandler(e) 
    {
        if (!e) e = window.event;
        elementToDrag.parentElement.style.left = (e.clientX - deltaX) + "px";
        elementToDrag.parentElement.style.top = (e.clientY - deltaY) + "px";
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
    }
    function upHandler(e) 
    {
        if (!e) e = window.event;
        if (document.removeEventListener) {
            document.removeEventListener("mouseup", upHandler, true);
            document.removeEventListener("mousemove", moveHandler, true);
        }
        else {
            elementToDrag.parentElement.detachEvent("onlosecapture", upHandler);
            elementToDrag.parentElement.detachEvent("onmouseup", upHandler);
            elementToDrag.parentElement.detachEvent("onmousemove", moveHandler);
            elementToDrag.parentElement.releaseCapture();
        }
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;

        saveBD(0);
    }
}

//将白板上的图形和文字信息提交到服务器
//nType  0:只更新小白板上数据      1:增加存档功能
function saveBD(nType)
{
   var bdNAME = '无';
   if(nType==1)
   {
      bdNAME = prompt("请输入要创建的小白板数据的备注信息：", '');
      //{
      //}
   }
      var posStr= new Array();

      var att=document.getElementsByClassName("ATTACH");

      for(var i=0;i<att.length;i++)
      {
         if(att[i].children[1]==undefined || att[i].children[1].tagName==undefined)//空白页
         {
            posStr.push(Array("COVER"));
         }
         else if(att[i].children[1].tagName.toUpperCase()=="IMG")
         {
            var arrURL=att[i].children[1].src.split(window.location.host);
            if(arrURL.length==2)
            {
               var arrFILE=arrURL[1].split("?t=");
               posStr.push(Array(att[i].children[1].tagName,decodeURI(arrFILE[0]),att[i].offsetLeft,att[i].offsetTop));
            }
            else
            {
               var arrFILE=arrURL;
               posStr.push(Array(att[i].children[1].tagName,decodeURI(arrFILE[0]),att[i].offsetLeft,att[i].offsetTop));
            }
         }
         else if(att[i].children[1].tagName.toUpperCase()=="VIDEO")
         {
            var arrURL=att[i].children[1].src.split(window.location.host);
            if(arrURL.length==2)
            {
               var arrFILE=arrURL[1].split("?t=");
               posStr.push(Array(att[i].children[1].tagName,decodeURI(arrFILE[0]),att[i].offsetLeft,att[i].offsetTop,att[i].children[1].height));
            }
            else
            {
               var arrFILE=arrURL;
               posStr.push(Array(att[i].children[1].tagName,decodeURI(arrFILE[0]),att[i].offsetLeft,att[i].offsetTop,att[i].children[1].height));
            }
         }
         else if(att[i].children[1].tagName.toUpperCase()=="DIV")
         {
            if(att[i].children[1].childNodes[0].outerHTML!=undefined)	//去掉含有onmousedown事件的DIV，防止嵌套。这个DIV会出现在页面刷新生成的数据中，动态添加的数据里是没有的。
               posStr.push(Array(att[i].children[1].tagName,att[i].children[1].children[0].outerHTML,att[i].offsetLeft,att[i].offsetTop));
            else
               posStr.push(Array(att[i].children[1].tagName,att[i].children[1].outerHTML,att[i].offsetLeft,att[i].offsetTop));
         }
      }

      var strPos=JSON.stringify(posStr);
      strPos=strPos.replaceAll("],","],\r\n");
      if(strPos.length>0) posStr=strPos;

      $.post("./WhiteBoard/saveBD.php?t=" + Math.random(), {'GID':gradeid, 't':nType, 'memo':bdNAME,  "pos": posStr.length>0?strPos:"" },function(data){
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

         var result=eval(data);
         if(result.length==1 && result[0]=="OK")   setTimeout(BDUpdated(),500);//推送更新消息，实现代码在tasksocket.js中。
      });//没有任何数据，就将服务器上数据清空。

}

//获取小白板历史存档列表
function getBOARDList()
{
   //获取白板数据
   $.post("./WhiteBoard/getBDList.php?t=" + Math.random(), {'GID':gradeid}, function (data) 
   {
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

      if(data.length>0){ 
         document.getElementById("sub").innerHTML=data;
         document.getElementById("sub").style.visibility="visible";
      }
   });
}

//删除小白板单个历史存档记录
function deleteBOARD(id)
{
   if(confirm("你确定要彻底删除此板书存档记录么？\r\n注意：此操作不可撤销！")==1)
   {
      $.post("./WhiteBoard/deleteBD.php?t=" + Math.random(), {'GID':gradeid,'ID':id}, function (data) 
      {
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
         if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

         if(data=="[\"OK\"]"){ 
            document.getElementById('attachments').innerHTML="";

            saveBD(0);
         }
      });
   }
}

//调取小白板历史存档数据并直接显示
function loadBDPos(id)
{
   bPLAYALL=false;
   //获取白板数据
   $.post("./WhiteBoard/loadBDPos.php?t=" + Math.random(), {'ID':id,'GID':gradeid}, function (data) 
   {
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

      document.getElementById("back").style.visibility="hidden";
      document.getElementById("pause").style.visibility="hidden";

      if(data.length>0)
      { 
         var dataArr=data.split("\r\n");
         var strData=dataArr.slice(1,dataArr.length).join("");
         if(strData=="") strData=data;//return ;
         var posJSON=JSON.parse(strData);

         //var posJSON=JSON.parse(dataArr.length>1?dataArr[1]:dataArr[0]);

         if(JSON.stringify(posJSON)=="{}") return;

         var bd=document.getElementById("attachments");
         for(var j=bd.children.length;j>0;j--)				//清理旧数据
         {
            bd.children[j-1].remove();
         }
         for(var i=0;i<posJSON.length;i++)				//生成新数据
         {

            if(posJSON[i][0]=="COVER")
            {
               var bd=document.getElementById("attachments");
               var d=document.createElement("DIV");

               //d.style="width: 650px;    height: 480px;    position: absolute;    left: -16px;    top: 25px;    background: beige;border-radius: 3%;";


               d.style="width: 650px;    height: 480px;    position: absolute;    left: -16px;    top: 25px;    background: beige;border-radius: 3%;";
               d.setAttribute("class","ATTACH");
if(admin)      d.onmousedown=function(){dragBD(this,event)};		//添加后并不及时更新，而是等拖动后再更新。

               //if(admin)
               //   d.ondblclick=function(){this.style.visibility="hidden";};
               bd.appendChild(d);
            }
            else if(posJSON[i][0]=="DIV")
            {
               let nid="NEWTXT_"+Math.random(1,100);
               var bd=document.getElementById("attachments");
               var divx = document.createElement("div");			//创建新DIV
               divx.id=  nid;			//新ID
               divx.style="position:absolute;width:146px;left:"+parseInt(posJSON[i][2])+"px;top:"+parseInt(posJSON[i][3])+"px;";
               divx.setAttribute("class","ATTACH");
if(admin)
{


               divx.onmouseover=function(){showControl(this);};
               divx.onmouseout=function(){hideControl(this);};

               var divcontrol = document.createElement("div");		//创建新DIV
               divcontrol.style="visibility:hidden;background: ghostwhite;width:166px;";

               var remove = document.createElement("img");		//创建新IMG：删除按钮
               remove.src="./img/recycle.png";
               remove.title="回收";
               remove.style="position: relative;top: 2px;";
               remove.onclick=function(){ removeText(nid);};
               divcontrol.appendChild(remove);

               var sizeup=document.createElement("img");			//修改字号
               sizeup.src="./img/fadd.png";
               sizeup.title="加大字号";
               sizeup.style="position:relative;left:7px;top: 2px;";
               sizeup.onclick=function(){ sizeUP(this); };
               divcontrol.appendChild(sizeup);

               var sizedown=document.createElement("img");
               sizedown.src="./img/fsub.png";
               sizedown.title="缩小字号";
               sizedown.style="position:relative;left:11px;top: 2px;";
               sizedown.onclick=function(){ sizeDOWN(this); };
               divcontrol.appendChild(sizedown);

               var widthdown=document.createElement("img");		//修改宽度
               widthdown.src="./img/wsub.png";
               widthdown.title="缩窄";
               widthdown.style="position:relative;left:16px;top: 2px;";
               widthdown.onclick=function(){ widthDOWN(this); };
               divcontrol.appendChild(widthdown);

               var widthup=document.createElement("img");
               widthup.src="./img/wadd.png";
               widthup.title="拉宽";
               widthup.style="position:relative;left:21px;top: 2px;";
               widthup.onclick=function(){ widthUP(this); };
               divcontrol.appendChild(widthup);

               var mcolor=posJSON[i][1].match("color: ([^^]*?);");
               let color='black';
               if(mcolor.length==2)
                  color=mcolor[1];
               var txtcolor=document.createElement("select");		//修改颜色
               txtcolor.title="修改颜色";
               var opt=document.createElement("option");
               opt.style.color="black";
               opt.value="black";
               opt.text="黑";
               if(color=="black") opt.selected=true;
               txtcolor.add(opt);
               var opt=document.createElement("option");
               opt.style.color="white";
               opt.value="white";
               opt.text="白";
               if(color=="white") opt.selected=true;
               txtcolor.add(opt);
               var opt=document.createElement("option");
               opt.style.color="red";
               opt.value="red";
               opt.text="红";
               if(color=="red") opt.selected=true;
               txtcolor.add(opt);
               var opt=document.createElement("option");
               opt.style.color="yellow";
               opt.value="yellow";
               opt.text="黄";
               if(color=="yellow") opt.selected=true;
               txtcolor.add(opt);
               var opt=document.createElement("option");
               opt.style.color="blue";
               opt.value="blue";
               opt.text="蓝";
               if(color=="blue") opt.selected=true;
               txtcolor.add(opt);
               var opt=document.createElement("option");
               opt.style.color="green";
               opt.value="green";
               opt.text="绿";
               if(color=="green") opt.selected=true;
               txtcolor.add(opt);
               txtcolor.style="position:relative;left:26px;top:0px;color:"+color;
               txtcolor.onchange=function(){ changeColor(this); };
               divcontrol.appendChild(txtcolor);
               divx.appendChild(divcontrol);

                  var layerUp = document.createElement("img");			//创建新IMG：删除按钮
                  layerUp.style="position: relative; left: 27px;  top: 2px;";
                  layerUp.title="上移一层";
                  layerUp.src="./img/layerup.png";
                  layerUp.onclick=function(){  setLayer(this,true);};
                  divcontrol.appendChild(layerUp);

                  var layerDown = document.createElement("img");			//创建新IMG：删除按钮
                  layerDown.style="position: relative; left: 27px;  top: 2px;";
                  layerDown.title="下移一层";
                  layerDown.src="./img/layerdown.png";
                  layerDown.onclick=function(){ setLayer(this,false);};
                  divcontrol.appendChild(layerDown);
}
               var txt = document.createElement("div");			//创建新IMG：附件
               txt.innerHTML=posJSON[i][1];					//文本
if(admin)                 txt.onmousedown=function(){dragBD(this,event)};		//添加后并不及时更新，而是等拖动后再更新。

               txt.ondblclick=function(){editText(this);};
               divx.appendChild(txt);

               bd.appendChild(divx);					//往白板中插入此新DIV
            }
            else  if(posJSON[i][0]=="IMG")
            {
               var arr=posJSON[i][1].split("/whiteboard/"+room+"/"+gradeid+"/");
               if(arr.length==2)
               {
                  let   ovalue=arr[1];      
                  var nid=ovalue.substr(ovalue,ovalue.lastIndexOf('.'));


                  nid=nid.replace("LINES/","");

                  var bd=document.getElementById("attachments");
                  var divx = document.createElement("div");			//创建新DIV
                  divx.id=nid;
                  divx.style="position:absolute;left:"+parseInt(posJSON[i][2])+"px;top:"+parseInt(posJSON[i][3])+"px;";
                  divx.setAttribute("class","ATTACH");

if(admin)
{
                  divx.onmouseover=function(){showControl(this);};
                  divx.onmouseout=function(){hideControl(this);};

                  var divcontrol = document.createElement("div");		//创建新DIV
//                  divcontrol.style="visibility:hidden;background: ghostwhite; width: 114px; height: 22px; position: relative;";


                  divcontrol.style="visibility:hidden;display: inline-block;background: ghostwhite; width: 114px; height: 22px; position:absolute;top:-22px;";

                  var remove = document.createElement("img");			//创建新IMG：删除按钮
                  remove.style="position: relative;top: 2px;";
                  remove.title="回收";
                  remove.src="./img/recycle.png";
                  remove.onclick=function(){ recycleImg(ovalue);};
                  divcontrol.appendChild(remove);

                  if(ovalue.indexOf(".gif")==-1)
                  {
                     var edit = document.createElement("img");			//创建新IMG：删除按钮
                     edit.style="position: relative;left: 6px;top: 2px;";
                     edit.title="编辑";
                     edit.src="./img/edit.png";
                     //edit.onclick=function(){ editImg(ovalue);};
                     edit.onclick=function(){ if(ovalue.indexOf(".gif")==-1) editImg(ovalue);else alert('暂不支持编辑此类资源。');};
                     divcontrol.appendChild(edit);
                  }

      var heightup=document.createElement("img");
      heightup.src="./img/vup.png";
      heightup.title="增加高度";
      heightup.style="position:relative;left:6px;top: 2px;";
      heightup.onclick=function(){ videoHeightUP(this); };
      divcontrol.appendChild(heightup);

      var heightdown=document.createElement("img");		//修改宽度
      heightdown.src="./img/vsub.png";
      heightdown.title="降低高度";
      heightdown.style="position:relative;left:10px;top: 2px;";
      heightdown.onclick=function(){ videoHeightDOWN(this); };
      divcontrol.appendChild(heightdown);

                  var layerUp = document.createElement("img");			//创建新IMG：删除按钮
                  layerUp.style="position: relative; left: 11px;  top: 2px;";
                  layerUp.title="上移一层";
                  layerUp.src="./img/layerup.png";
                  layerUp.onclick=function(){  setLayer(this,true);};
                  divcontrol.appendChild(layerUp);

                  var layerDown = document.createElement("img");			//创建新IMG：删除按钮
                  layerDown.style="position: relative; left: 11px;  top: 2px;";
                  layerDown.title="下移一层";
                  layerDown.src="./img/layerdown.png";
                  layerDown.onclick=function(){ setLayer(this,false);};
                  divcontrol.appendChild(layerDown);

                  var del = document.createElement("img");			//创建新IMG：删除按钮
                  del.style="position: relative; left: 11px;  top: 2px;";
                  del.title="彻底删除";
                  del.src="./img/delete.png";
                  del.onclick=function(){ deleteImg(ovalue);};
                  divcontrol.appendChild(del);

                  divx.appendChild(divcontrol);
}
                  var img = document.createElement("img");			//创建新IMG：附件
                  img.src=posJSON[i][1];
if(admin)                  img.onmousedown=function(){dragBD(this,event)};		//添加后并不及时更新，而是等拖动后再更新。
                  img.title=nid;
                  divx.appendChild(img);

                  bd.appendChild(divx);					//往白板中插入此新DIV
                  //o.remove(o.selectedIndex);				//从下拉列表中删除当前选中项，确保白板中每份数据的唯一性。
               }
            }

            else  if(posJSON[i][0]=="VIDEO")
            {
               var arr=posJSON[i][1].split("/whiteboard/"+room+"/"+gradeid+"/");
               if(arr.length==2)
               {
                  let   ovalue=arr[1];      
                  var nid=ovalue.substr(ovalue,ovalue.lastIndexOf('.'));

                  var bd=document.getElementById("attachments");
                  var divx = document.createElement("div");			//创建新DIV
                  divx.id=nid;
                  divx.style="position:absolute;left:"+parseInt(posJSON[i][2])+"px;top:"+parseInt(posJSON[i][3])+"px;";
                  divx.setAttribute("class","ATTACH");
if(admin){
                  divx.onmouseover=function(){showControl(this);};
                  divx.onmouseout=function(){hideControl(this);};

                  var divcontrol = document.createElement("div");		//创建新DIV
                  divcontrol.style="visibility:hidden;background: ghostwhite; width: 110px; height: 22px; position: relative;";

                  var remove = document.createElement("img");			//创建新IMG：删除按钮
                  remove.style="position: relative;top: 2px;";
                  remove.title="回收";
                  remove.src="./img/recycle.png";
                  remove.onclick=function(){ recycleImg(ovalue);};
                  divcontrol.appendChild(remove);

                  var heightup=document.createElement("img");
                  heightup.src="./img/vup.png";
                  heightup.title="增加高度";
                  heightup.style="position:relative;left:4px;top: 2px;";
                  heightup.onclick=function(){ videoHeightUP(this); };
                  divcontrol.appendChild(heightup);

                  var heightdown=document.createElement("img");		//修改宽度
                  heightdown.src="./img/vsub.png";
                  heightdown.title="降低高度";
                  heightdown.style="position:relative;left:8px;top: 2px;";
                  heightdown.onclick=function(){ videoHeightDOWN(this); };
                  divcontrol.appendChild(heightdown);


                  var layerUp = document.createElement("img");			//创建新IMG：删除按钮
                  layerUp.style="position: relative; left: 11px;  top: 2px;";
                  layerUp.title="上移一层";
                  layerUp.src="./img/layerup.png";
                  layerUp.onclick=function(){  setLayer(this,true);};
                  divcontrol.appendChild(layerUp);

                  var layerDown = document.createElement("img");			//创建新IMG：删除按钮
                  layerDown.style="position: relative; left: 11px;  top: 2px;";
                  layerDown.title="下移一层";
                  layerDown.src="./img/layerdown.png";
                  layerDown.onclick=function(){ setLayer(this,false);};
                  divcontrol.appendChild(layerDown);
                  var del = document.createElement("img");			//创建新IMG：删除按钮
                  del.style="position: relative; left: 12px;  top: 2px;";
                  del.title="彻底删除";
                  del.src="./img/delete.png";
                  del.onclick=function(){ deleteImg(ovalue);};
                  divcontrol.appendChild(del);

                  divx.appendChild(divcontrol);
}
                  var video = document.createElement("video");			//创建新IMG：附件
                  video.setAttribute("controls",true);
                  video.setAttribute("height",posJSON[i][4]);
                  video.src=posJSON[i][1];
if(admin)                    video.onmousedown=function(){dragBD(this,event)};		//添加后并不及时更新，而是等拖动后再更新。
                  video.title=nid;
                  divx.appendChild(video);

                  bd.appendChild(divx);					//往白板中插入此新DIV
                  //o.remove(o.selectedIndex);				//从下拉列表中删除当前选中项，确保白板中每份数据的唯一性。
               }
            }
            saveBD(0);
         }   
      }
   });
}

//手动控制
var bCONTINUE=true;
function continuePlay()
{
   //if(admin)
   //{
      bCONTINUE=true;
      bPLAYALL=false;
   //}
return;
}

var bPLAYALL=false;
function PlayAll()
{
   bPLAYALL=true;
   bCONTINUE=false;
}

//播放已存档小白板数据。
//延时1秒进行播放
var inSteps=null;
var nSteps=0;
var inSteps=null;
var currentID=null;


   var nOffsetLeft=0;//id==null?13:0;	//学生端与教师端存在偏差
   var nOffsetTop=0;//-5;//id==null?16:0;
function playBDPos(id)
{
   currentID=id;
   nSteps=0;
//if(admin==1)
//{
//   var nOffsetLeft=0;//id==null?12:0;	//学生端与教师端存在偏差
//   var nOffsetTop=0;//id==null?16:0;//
//}
//else
//{
//   var nOffsetLeft=id==null?13:0;	//学生端与教师端存在偏差
//   var nOffsetTop=-5;//id==null?16:0;
//}

   //var nOffsetLeft=0;//id==null?12:0;	//学生端与教师端存在偏差
   //var nOffsetTop=0;//id==null?16:0;
   bPLAYALL=false;
   //获取白板数据

   $.post(id!=null?"./WhiteBoard/loadBDPos.php?t=" + Math.random():"./WhiteBoard/getBDPos.php?t=" + Math.random(), {'ID':id,'GID':gradeid}, function (data) 
   {
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

      if(data.length>0)
      { 
         if(inSteps!=null) clearInterval(inSteps);
         bCONTINUE=true;

         var dataArr=data.split("\r\n");
         var strData=dataArr.slice(1,dataArr.length).join("");
         if(strData=="") return;
         var posJSON=JSON.parse(strData);

         //var posJSON=JSON.parse(dataArr.length>1?dataArr[1]:dataArr[0]);
         //var posJSON=JSON.parse(dataArr.length>1?dataArr[1]:dataArr[0]);

         //var posJSON=JSON.parse(data);

         if(JSON.stringify(posJSON)=="{}") return;

         var bd=document.getElementById("attachments");
         for(var j=bd.children.length;j>0;j--)				//清理旧数据
         {
            bd.children[j-1].remove();
         }

         var i=0;
					//开始后，将bREADY置为false
         inSteps = setInterval(function()
         {
            if(bCONTINUE==true || bPLAYALL==true)		//手动控制下一张
            {
               bCONTINUE=false;
               if(i!=nSteps) i=nSteps;			//回放后，需要从回放后的下一张接下去播放。

               if(i<posJSON.length)
               {
                  //document.getElementById("all").style.visibility="visible";
                  if(i>0)
                     document.getElementById("back").style.visibility="visible";
                  else
                     document.getElementById("back").style.visibility="hidden";

                  if(i<posJSON.length-1)
                  {
                     document.getElementById("pause").style.visibility="visible";
                  }
                  else
                  {
                     //clearInterval(inSteps);
                     document.getElementById("pause").style.visibility="hidden";
                  }

                  if(posJSON[i][0]=="COVER")
                  {
                     var bd=document.getElementById("attachments");
                     var d=document.createElement("DIV");
                     d.style="width: 650px;    height: 480px;    position: absolute;    left: -16px;    top: 25px;    background: beige;border-radius: 3%;";

//                     d.style="width: 650px;    height: 480px;    position: absolute; left:"+parseInt(-25+nOffsetLeft)+"px;top:"+parseInt(15-(nOffsetTop?(nOffsetTop-10):0))+"px;   background: beige;border-radius: 3%;";
                     d.setAttribute("class","ATTACH");
if(admin)      d.onmousedown=function(){dragBD(this,event)};		//添加后并不及时更新，而是等拖动后再更新。

                     //if(admin)
                     //   d.ondblclick=function(){this.style.visibility="hidden";};
                     bd.appendChild(d);
                  }
                  else if(posJSON[i][0]=="DIV")
                  {
                     let nid="NEWTXT_"+Math.random(1,100);
                     var bd=document.getElementById("attachments");
                     var divx = document.createElement("div");			//创建新DIV
                     divx.id=  nid;			//新ID
                     divx.style="position:absolute;display: inline-block;width:146px;left:"+parseInt(posJSON[i][2]+nOffsetLeft)+"px;top:"+parseInt(posJSON[i][3]+nOffsetTop)+"px;";
                     divx.setAttribute("class","ATTACH");
if(admin){
                     divx.onmouseover=function(){showControl(this);};
                     divx.onmouseout=function(){hideControl(this);};

                     var divcontrol = document.createElement("div");		//创建新DIV
                     divcontrol.style="visibility:hidden;background: ghostwhite;width:166px;";

                     var remove = document.createElement("img");		//创建新IMG：删除按钮
                     remove.src="./img/recycle.png";
                     remove.title="回收";
                     remove.style="position: relative;top: 2px;display: inline-block;";
                     remove.onclick=function(){ removeText(nid);};
                     divcontrol.appendChild(remove);

                     var sizeup=document.createElement("img");			//修改字号
                     sizeup.src="./img/fadd.png";
                     sizeup.title="加大字号";
                     sizeup.style="position:relative;left:7px;top: 2px;display: inline-block;";
                     sizeup.onclick=function(){ sizeUP(this); };
                     divcontrol.appendChild(sizeup);

                     var sizedown=document.createElement("img");
                     sizedown.src="./img/fsub.png";
                     sizedown.title="缩小字号";
                     sizedown.style="position:relative;left:11px;top: 2px;display: inline-block;";
                     sizedown.onclick=function(){ sizeDOWN(this); };
                     divcontrol.appendChild(sizedown);

                     var widthdown=document.createElement("img");		//修改宽度
                     widthdown.src="./img/wsub.png";
                     widthdown.title="缩窄";
                     widthdown.style="position:relative;left:16px;top: 2px;display: inline-block;";
                     widthdown.onclick=function(){ widthDOWN(this); };
                     divcontrol.appendChild(widthdown);

                     var widthup=document.createElement("img");
                     widthup.src="./img/wadd.png";
                     widthup.title="拉宽";
                     widthup.style="position:relative;left:21px;top: 2px;display: inline-block;";
                     widthup.onclick=function(){ widthUP(this); };
                     divcontrol.appendChild(widthup);

                     var mcolor=posJSON[i][1].match("color: ([^^]*?);");
                     let color='black';
                     if(mcolor.length==2) color=mcolor[1];
                     var txtcolor=document.createElement("select");		//修改颜色
                     txtcolor.title="修改颜色";
                     var opt=document.createElement("option");
                     opt.style.color="black";
                     opt.value="black";
                     opt.text="黑";
                     if(color=="black") opt.selected=true;
                     txtcolor.add(opt);
                     var opt=document.createElement("option");
                     opt.style.color="white";
                     opt.value="white";
                     opt.text="白";
                     if(color=="white") opt.selected=true;
                     txtcolor.add(opt);
                     var opt=document.createElement("option");
                     opt.style.color="red";
                     opt.value="red";
                     opt.text="红";
                     if(color=="red") opt.selected=true;
                     txtcolor.add(opt);
                     var opt=document.createElement("option");
                     opt.style.color="yellow";
                     opt.value="yellow";
                     opt.text="黄";
                     if(color=="yellow") opt.selected=true;
                     txtcolor.add(opt);
                     var opt=document.createElement("option");
                     opt.style.color="blue";
                     opt.value="blue";
                     opt.text="蓝";
                     if(color=="blue") opt.selected=true;
                     txtcolor.add(opt);
                     var opt=document.createElement("option");
                     opt.style.color="green";
                     opt.value="green";
                     opt.text="绿";
                     if(color=="green") opt.selected=true;
                     txtcolor.add(opt);
                     txtcolor.style="position:relative;left:26px;top:0px;color:"+color;
                     txtcolor.onchange=function(){ changeColor(this); };
                     divcontrol.appendChild(txtcolor);
                     divx.appendChild(divcontrol);


                  var layerUp = document.createElement("img");			//创建新IMG：删除按钮
                  layerUp.style="position: relative; left: 27px;  top: 2px;";
                  layerUp.title="上移一层";
                  layerUp.src="./img/layerup.png";
                  layerUp.onclick=function(){  setLayer(this,true);};
                  divcontrol.appendChild(layerUp);

                  var layerDown = document.createElement("img");			//创建新IMG：删除按钮
                  layerDown.style="position: relative; left: 27px;  top: 2px;";
                  layerDown.title="下移一层";
                  layerDown.src="./img/layerdown.png";
                  layerDown.onclick=function(){ setLayer(this,false);};
                  divcontrol.appendChild(layerDown);
}
                     var txt = document.createElement("div");			//创建新IMG：附件
                     txt.innerHTML=posJSON[i][1];					//文本
                     //txt.style.color=color.value;				//颜色
                     //txt.style.fontSize=fontsize.value+"px";			//字号
                     //txt.style.width=(posJSON[i][1].length*fontsize.value)+"px";		//宽度
if(admin)                       txt.onmousedown=function(){dragBD(this,event)};		//添加后并不及时更新，而是等拖动后再更新。
                     txt.ondblclick=function(){editText(this);};
                     divx.appendChild(txt);

                     bd.appendChild(divx);					//往白板中插入此新DIV
                  }
                  else  if(posJSON[i][0]=="IMG")
                  {
                     var arr=posJSON[i][1].split("/whiteboard/"+room+"/"+gradeid+"/");
                     //let ovalue=''; 
                     if(arr.length==2)
                     {
                        let   ovalue=arr[1];      
                        var nid=ovalue.substr(ovalue,ovalue.lastIndexOf('.'));


      nid=nid.replace("LINES/","");

                        var bd=document.getElementById("attachments");
                        var divx = document.createElement("div");			//创建新DIV
                        divx.id=nid;
                        divx.style="position:absolute;left:"+parseInt(posJSON[i][2]+nOffsetLeft)+"px;top:"+parseInt(posJSON[i][3]+nOffsetTop)+"px;";
                        divx.setAttribute("class","ATTACH");
if(admin){
                        divx.onmouseover=function(){showControl(this);};
                        divx.onmouseout=function(){hideControl(this);};

                        var divcontrol = document.createElement("div");		//创建新DIV
                        divcontrol.style="visibility:hidden;display: inline-block;background: ghostwhite; width: 114px; height: 22px; position:absolute;top:-22px;";

                        //var ovalue=o.value;
                        var remove = document.createElement("img");			//创建新IMG：删除按钮
                        remove.style="position: relative;top: 2px;display: inline-block;";
                        remove.title="回收";
                        remove.src="./img/recycle.png";
                        remove.onclick=function(){ recycleImg(ovalue);};
                        divcontrol.appendChild(remove);

                        if(ovalue.indexOf(".gif")==-1)
                        {
                           var edit = document.createElement("img");			//创建新IMG：删除按钮
                           edit.style="position: relative;left: 6px;top: 2px;display: inline-block;";
                           edit.title="编辑";
                           edit.src="./img/edit.png";
                           edit.onclick=function(){ if(ovalue.indexOf(".gif")==-1) editImg(ovalue);else alert('暂不支持编辑此类资源。');};
                           divcontrol.appendChild(edit);
                        }

      var heightup=document.createElement("img");
      heightup.src="./img/vup.png";
      heightup.title="增加高度";
      heightup.style="position:relative;left:6px;top: 2px;";
      heightup.onclick=function(){ videoHeightUP(this); };
      divcontrol.appendChild(heightup);

      var heightdown=document.createElement("img");		//修改宽度
      heightdown.src="./img/vsub.png";
      heightdown.title="降低高度";
      heightdown.style="position:relative;left:10px;top: 2px;";
      heightdown.onclick=function(){ videoHeightDOWN(this); };
      divcontrol.appendChild(heightdown);


                  var layerUp = document.createElement("img");			//创建新IMG：删除按钮
                  layerUp.style="position: relative; left: 11px;  top: 2px;";
                  layerUp.title="上移一层";
                  layerUp.src="./img/layerup.png";
                  layerUp.onclick=function(){  setLayer(this,true);};
                  divcontrol.appendChild(layerUp);

                  var layerDown = document.createElement("img");			//创建新IMG：删除按钮
                  layerDown.style="position: relative; left: 11px;  top: 2px;";
                  layerDown.title="下移一层";
                  layerDown.src="./img/layerdown.png";
                  layerDown.onclick=function(){ setLayer(this,false);};
                  divcontrol.appendChild(layerDown);


                        var del = document.createElement("img");			//创建新IMG：删除按钮
                        del.style="position: relative; left: 11px;  top: 2px;display: inline-block;";
                        del.title="彻底删除";
                        del.src="./img/delete.png";
                        del.onclick=function(){ deleteImg(ovalue);};
                        divcontrol.appendChild(del);

                        divx.appendChild(divcontrol);
}
                        var img = document.createElement("img");			//创建新IMG：附件
                        img.src=posJSON[i][1];
if(admin)                          img.onmousedown=function(){dragBD(this,event)};		//添加后并不及时更新，而是等拖动后再更新。
                        img.title=nid;
                        divx.appendChild(img);

                        bd.appendChild(divx);					//往白板中插入此新DIV
                        //o.remove(o.selectedIndex);				//从下拉列表中删除当前选中项，确保白板中每份数据的唯一性。
                     }
                  }
                  else  if(posJSON[i][0]=="VIDEO")
                  {
                     var arr=posJSON[i][1].split("/whiteboard/"+room+"/"+gradeid+"/");
                     if(arr.length==2)
                     {
                        let   ovalue=arr[1];      
                        var nid=ovalue.substr(ovalue,ovalue.lastIndexOf('.'));

                        var bd=document.getElementById("attachments");
                        var divx = document.createElement("div");			//创建新DIV
                        divx.id=nid;
                        divx.style="position:absolute;display: inline-block;left:"+parseInt(posJSON[i][2]+nOffsetLeft)+"px;top:"+parseInt(posJSON[i][3]+nOffsetTop)+"px;";
                        divx.setAttribute("class","ATTACH");
if(admin){
                        divx.onmouseover=function(){showControl(this);};
                        divx.onmouseout=function(){hideControl(this);};

                        var divcontrol = document.createElement("div");		//创建新DIV
                        divcontrol.style="visibility:hidden;background: ghostwhite; width: 110px; height: 22px; position: relative;";

                        //var ovalue=o.value;
                        var remove = document.createElement("img");			//创建新IMG：删除按钮
                        remove.style="position: relative;top: 2px;display: inline-block;";
                        remove.title="回收";
                        remove.src="./img/recycle.png";
                        remove.onclick=function(){ recycleImg(ovalue);};
                        divcontrol.appendChild(remove);

                        var heightup=document.createElement("img");
                        heightup.src="./img/vup.png";
                        heightup.title="增加高度";
                        heightup.style="position:relative;left:4px;top: 2px;display: inline-block;";
                        heightup.onclick=function(){ videoHeightUP(this); };
                        divcontrol.appendChild(heightup);

                        var heightdown=document.createElement("img");		//修改宽度
                        heightdown.src="./img/vsub.png";
                        heightdown.title="降低高度";
                        heightdown.style="position:relative;left:8px;top: 2px;display: inline-block;";
                        heightdown.onclick=function(){ videoHeightDOWN(this); };
                        divcontrol.appendChild(heightdown);


                  var layerUp = document.createElement("img");			//创建新IMG：删除按钮
                  layerUp.style="position: relative; left: 11px;  top: 2px;";
                  layerUp.title="上移一层";
                  layerUp.src="./img/layerup.png";
                  layerUp.onclick=function(){  setLayer(this,true);};
                  divcontrol.appendChild(layerUp);

                  var layerDown = document.createElement("img");			//创建新IMG：删除按钮
                  layerDown.style="position: relative; left: 11px;  top: 2px;";
                  layerDown.title="下移一层";
                  layerDown.src="./img/layerdown.png";
                  layerDown.onclick=function(){ setLayer(this,false);};
                  divcontrol.appendChild(layerDown);
                        var del = document.createElement("img");			//创建新IMG：删除按钮
                        del.style="position: relative; left: 12px;  top: 2px;display: inline-block;";
                        del.title="彻底删除";
                        del.src="./img/delete.png";
                        del.onclick=function(){ deleteImg(ovalue);};
                        divcontrol.appendChild(del);

                        divx.appendChild(divcontrol);
}
                        var video = document.createElement("video");			//创建新IMG：附件
                        video.setAttribute("controls",true);
                        video.setAttribute("height",posJSON[i][4]);
                        video.src=posJSON[i][1];
if(admin)                          video.onmousedown=function(){dragBD(this,event)};		//添加后并不及时更新，而是等拖动后再更新。
                        video.title=nid;
                        divx.appendChild(video);

                        bd.appendChild(divx);					//往白板中插入此新DIV
                     }
                  }
                  if(admin && typeof wsPlay!='undefined') saveBD(0);
                  i++;
                  nSteps=i;
               }
            }
         },1);
      }
   });
}


//撤销一项已存档小白板数据。
function PlayBack()
{
   var bd=document.getElementById("attachments");
   if(bd.children.length>0)
      bd.children[bd.children.length-1].remove();

   nSteps--;

   document.getElementById("pause").style.visibility="visible";
   if(nSteps<1)
   {
      document.getElementById("back").style.visibility="hidden";
   }
   if(admin && typeof wsPlay!='undefined') saveBD(0);
   return;
}


function setLayer(o,bUp)
{
   //var obj=document.getElementById(id);
   var obj=o.parentElement.parentElement;
   if(obj.style.zIndex=="")  obj.style.zIndex=0;

   obj.style.zIndex= bUp?parseInt(obj.style.zIndex)+1:parseInt(obj.style.zIndex)-1;

   if(parseInt(obj.style.zIndex)<0) 
      obj.style.zIndex=0;
}