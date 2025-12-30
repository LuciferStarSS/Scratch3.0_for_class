<?php
$gradeid=isset($_COOKIE['GRADEID'])	?$_COOKIE['GRADEID']	:"";

include "../../include/config.inc.php";

if(!$gradeid) exit("COOKIE已过期，请更新上课班级数据。");

?>
    <style>
        #picture {
            position:absolute;
            left:  300px;
            width: 800px;
            height: 600px;
        }
        .card{
            width: 100%;
            height:100%;
            margin: 0 auto;
            overflow: hidden;
        }
        .card_a{
            #background-color: red;
            #left:0px;
        }
        .card_b{
            #background-color: blue;
            display: none;
        }
        .card_title{
        }
    </style>

<div id=picture>
</div>
<script src=../js/jquery.js></script>
<script>
var gid          = <?php echo $gradeid;?>;		//年级ID
var playing      = false;				//翻卡特效进行状态
var aVisible     = false;				//A面是否可见
let nLast        = parent.nLast;			//最后显示的学生作品
var bNeedUpdate  = false;				//当前获取到的数据已经全部展示完毕，需要检测更新数据
var nSpeed       = 5000;				//默认刷新速度
var inSignal     = null;				//定时器ID

var posArray     = new Array(			        //2*3图片视图坐标。 0：title top   1：img top  2：img left
                         Array( 0,   24, 25),	//11
                         Array( 0, -300,475),	//12
                         Array( 0, -624,923),	//13
                         Array(360, -589, 25),	//21
                         Array(360, -913,475),	//22
                         Array(360,-1236,923),	//23
                       );

var arrFiles     = new Array();				//存放当前学生的所有作品
var nTotal       = 0;					//图片总数
var arrCardA     = null;				//保存所有A面元素
var arrCardB     = null;				//保存所有B面元素
var arrCardTitle = null;				//保存所有标题信息
var p            = document.getElementById("picture");	//在这里显示卡
var bPause	 = false;

function pause()
{
   bPause=!bPause;
}

//改变自动更新的时间间隔
function changeSpeed()
{
   if(inSignal)  clearInterval(inSignal);
   nSpeed=parent.nSpeed;

   inSignal=setInterval(function(){					//开启定时更新
      if(!bPause)
         aVisible?turnToB():turnToA();
   },nSpeed);
}

//if(gid!=3)
//{
//   if(confirm("当前年级非三年级，当前可能没有图片可展示。您要继续么？"))
//   {
//      getWorks();
//   }
//}
//else
//{
   getWorks();
//}


//获取当前班级学生作业
function getWorks()
{
   nLast=parent.nLast;
   $.post("./getWorks.php?t=" + Math.random(), {}, function (data) 	
   {
      if(data.length>0){
         var jsonArr=JSON.parse(data);						//让白板上的图刷新一次
         if(jsonArr && jsonArr.length!=nTotal)
         {
            bNeedUpdate=false;
            nTotal = jsonArr.length;
            arrFiles.length=0;
            parent.document.getElementById("TOTAL").innerText=nTotal;
            for(var i=0;i<nTotal;i++)					//虽然当前系统默认是png，但为了稳妥，再确定一次。
            {
               arrFiles.push(jsonArr[i]);
            }
            init();
         }
      }
      else bNeedUpdate=true;
   });
}

//设置图片的展示视图
function setView(bType=true)
{
   if(inSignal) clearInterval(inSignal);   
   p.innerHTML="";						//清除旧图

   //单图模式
   //每个DIV，需要一个TITLE和两个IMG
   //初始化时，不需要给这三个元素设置内容。
   if(bType)
   {
      p.style="left:  300px;width: 800px;height: 696px;";	//800*600

      let title=document.createElement("DIV");			//创建共用的标题
      title.setAttribute("class","card card_title"); 
      title.style="position:absolute;width:800px;top:30px;height:48px; font-size:30px;background:wheat;";
      title.setAttribute("align","center");
      p.appendChild(title);

      let d1=document.createElement("DIV");
      d1.setAttribute("class","card card_a");                  
      d1.style="display:block";
      let img1=document.createElement("IMG");
      img1.style="position:relative;width:100%;height:600px;top:78px;";
      d1.appendChild(img1);
      p.appendChild(d1);

      let d2=document.createElement("DIV");
      d2.setAttribute("class","card card_b");                  
      d2.style="display:none";
      let img2=document.createElement("IMG");
      img2.style="position:relative;width:100%;height:600px;top:78px;";
      d2.appendChild(img2);
      p.appendChild(d2);
   }
   else							//2*3多图模式
   {
      p.style="left:10px;width: 430px;height: 324px;";		//430*324

      for(var x=0;x<6;x++)
      {
         let title=document.createElement("DIV");		//创建共用的标题
         title.setAttribute("class","card card_title"); 
         title.style="position:absolute;width:100%;top:"+posArray[x][0]+"px;height:24px; font-size:15px;background:wheat;left:"+posArray[x][2]+"px;";
         title.setAttribute("align","center");
         p.appendChild(title);

         let d1=document.createElement("DIV");
         d1.setAttribute("class","card card_a");                  
         d1.style="display:block; position: relative;top:"+posArray[x][1]+"px;left:"+posArray[x][2]+"px;";	//position必须relative
         let img1=document.createElement("IMG");
         img1.style="position:relative;width:100%;height:100%;";
         d1.appendChild(img1);
         p.appendChild(d1);

         let d2=document.createElement("DIV");
         d2.setAttribute("class","card card_b");                  
         d2.style="display:none;position: relative; top:"+posArray[x][1]+"px;left:"+posArray[x][2]+"px;";
         let img2=document.createElement("IMG");
         img2.style="position:relative;width:100%;height:100%;";
         d2.appendChild(img2);
         p.appendChild(d2);
      }
   }

   arrCardA = document.getElementsByClassName("card card_a");		//获取所有的A面图
   arrCardB = document.getElementsByClassName("card card_b");		//获取所有的B面图
   arrCardTitle = document.getElementsByClassName("card card_title");	//获取所有的标题

   aVisible?showA():showB();
   //aVisible?turnToB():turnToA();

   inSignal=setInterval(function(){					//开启定时更新
      if(!bPause)
         aVisible?turnToB():turnToA();
   },nSpeed);
 
}
///////////////////////////////////////////////////////////////

function showA() {
   //if (!aVisible) {
      for(var i=0;i<arrCardA.length;i++)			//更新所有A面的图的信息
      {
         if(nLast==nTotal-1) bNeedUpdate=true;
         nLast=(nLast<nTotal-1)?(++nLast):0;
         let path=arrFiles[nLast].split("/");
         arrCardTitle[i].innerText=path[path.length-1];		//更新A面图的标题
         arrCardA[i].children[0].src=arrFiles[nLast];	//更新A面的图片
         arrCardA[i].style.display = "block";
         arrCardB[i].style.display = "none";
      }
      aVisible = true;
      parent.nLast=nLast;
   //}
}

function showB() {
//   if (aVisible) {
      for(var i=0;i<arrCardB.length;i++)			//更新所有B面的图的信息
      {
         if(nLast==nTotal-1) bNeedUpdate=true;
         nLast=(nLast<nTotal-1)?(++nLast):0;
         let path=arrFiles[nLast].split("/");
         arrCardTitle[i].innerText=path[path.length-1];		//更新B面图的标题
         arrCardB[i].children[0].src=arrFiles[nLast];	//更新B面的图片
         arrCardB[i].style.display = "block";
         arrCardA[i].style.display = "none";
      }
      aVisible = false;

      parent.nLast=nLast;
  // }
}

function turnFromTo(arrFrom, arrTo) {
   if (!playing) {
      playing = true;
      var widthPrecent = 100;
      var speed = widthPrecent / 20;

      setTimeout(function(){				//翻转后需要停顿nSpeed毫秒
      let   inFlap1 = setInterval(function () {		//翻转特效

      if(!bPause)
      {
            widthPrecent -= speed;
            for(var i=0;i<arrFrom.length;i++)
            {
               arrFrom[i].style.width = widthPrecent + "%";//对整个DIV设置宽度，是向中心翻转；只对图设置宽度，是从左到右抽拉。
            }
            if (widthPrecent < 0) {			//第一面翻转结束
               clearInterval(inFlap1);
               for(var j=0;j<arrTo.length;j++)
               {
                  arrTo[j].style.width ="0";
               }

               if (aVisible) {
                  showB();
               } else {
                  showA();
               }

               let inFlap2 = setInterval(function () {	//翻转特效

      if(!bPause)
      {
                  widthPrecent += speed;
                  if (widthPrecent > 100) {
                     clearInterval(inFlap2);		//第二面翻转结束
                     widthPrecent = 100 + "%";
                     playing = false;
                  }
                  for(var k=0;k<arrTo.length;k++)
                  {
                     arrTo[k].style.width =widthPrecent + "%";
                  }
       }
               }, 20);
            }
         }
         }, 20);
      },nSpeed);
   }
}

function turnToA() {						//从A面翻到B面
   turnFromTo(arrCardB, arrCardA);
}

function turnToB() {						//从B面翻到A面
   turnFromTo(arrCardA, arrCardB);
}

function init() {
   nSpeed=parent.nSpeed;
   bType=!parent.bType;
   nLast=parent.nLast;
   setView(bType);
   inSignal=setInterval(function(){				//开启定时更新
      if(!bPause)
         aVisible?turnToB():turnToA();
   },nSpeed);
}


setInterval(function(){
   if(bNeedUpdate==true && !bPause) getWorks();
},5000);

</script>