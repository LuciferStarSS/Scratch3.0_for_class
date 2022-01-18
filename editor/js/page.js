function drag(elementToDrag, event) {
    var startX = event.clientX, startY = event.clientY;

    var origX = elementToDrag.parentElement.offsetLeft, origY = elementToDrag.parentElement.offsetTop;
    var deltaX = startX - origX, deltaY = startY - origY;
    if (document.addEventListener) {
        document.addEventListener("mousemove", moveHandler, true);
        document.addEventListener("mouseup", upHandler, true);
    }
    else {
            elementToDrag.parentElement.setCapture();
            elementToDrag.parentElement.attachEvent("onmousemove", moveHandler);
            elementToDrag.parentElement.attachEvent("onmouseup", upHandler);
            elementToDrag.parentElement.attachEvent("onlosecapture", upHandler);
    }
    if (event.stopPropagation) event.stopPropagation();
    else event.cancelBubble = true;
    if (event.preventDefault) event.preventDefault();
    else event.returnValue = false;

    function moveHandler(e) {
        if (!e) e = window.event;
        elementToDrag.parentElement.style.left = (e.clientX - deltaX) + "px";
        elementToDrag.parentElement.style.top = (e.clientY - deltaY) + "px";
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
    }
    function upHandler(e) {
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

        saveGroupInfo();
    }
}

function saveGroupInfo()
{
   savePos();			//保存姓名标签位置
   saveMember();		//保存组成员信息
}

//将当前学生姓名标签的坐标保存到文件
function savePos()
{
  var posStr= new Array();
  for(var i=1;i<=48;i++)
  {
      posStr.push(Array($("#div"+i).css("left"),$("#div"+i).css("top")));
  }

  $.post("savePos.php?t=" + Math.random(), { "pg":pergroup, "pos": posStr.join(",") });//
}


//将当前分组情况保存到文件
function saveMember()
{
   var strGroupMembers= new Array();
   var strMemberGroups= "";

   for(var g=0;g<Math.ceil(48/parent.nCurrentGroup);g++)
   {
      var main_div=document.getElementById("divx"+(g+1));
      var child_div=document.getElementsByClassName("circles");
      var child=Array();
      for(i=0;i<child_div.length;i++)
      {
         if(main_div.offsetLeft <= child_div[i].offsetLeft && main_div.offsetLeft+main_div.offsetWidth >= child_div[i].offsetLeft && main_div.offsetTop <= child_div[i].offsetTop && main_div.offsetTop+main_div.offsetHeight >= child_div[i].offsetTop ) child.push(child_div[i]);
      }

      if(strGroupMembers[g]===undefined) strGroupMembers[g]=Array();
      for(i=0;i<child.length;i++)//[组别]=Array{座位号_姓名,座位号_姓名,座位号_姓名,座位号_姓名}
      {
         try{//有些学生未登录，所以可能出现空项，访问children会出错。
            var nID=parseInt(child[i].children[0].children[0].innerText);
            if(child[i].children[0].children[1].innerText!=' ')							//奇怪的空格
            {
               if(strGroupMembers[g][i]===undefined) strGroupMembers[g][i]=Array();				//如果后面的innerText为空，则不需要初始化
               strGroupMembers[g][i]= child[i].children[0].children[1].innerText;
            }
         }
         catch(err){}//忽略不处理
      }
      
      for(i=0;i<child.length;i++)//座位号_姓名,组别;座位号_姓名,组别;座位号_姓名,组别;座位号_姓名,组别;
      {
         try{//有些学生未登录，所以可能出现空项，访问children会出错。
            var nID=parseInt(child[i].children[0].children[0].innerText);
            if(child[i].children[0].children[1].innerText!=' ')
               strMemberGroups= strMemberGroups+ child[i].children[0].children[1].innerText+","+g+";";
         }
         catch(err){}//忽略不处理
      }
   }
   $.post("saveMember.php?t=" + Math.random(), { "member": JSON.stringify(strGroupMembers), "group":strMemberGroups });

   var content="[\"GROUP\",3]";	
   var msg = {'content': content, 'type': 'user'};
   parent.sendMsg(msg);
}

function  addgroup(group)
{
   var main_div=document.getElementById("divx"+group);
   var child_div=document.getElementsByClassName("circles");
   var child=Array();
   for(i=0;i<child_div.length;i++)
   {
      if(main_div.offsetLeft <= child_div[i].offsetLeft && main_div.offsetLeft+main_div.offsetWidth >= child_div[i].offsetLeft && main_div.offsetTop <= child_div[i].offsetTop && main_div.offsetTop+main_div.offsetHeight >= child_div[i].offsetTop ) child.push(child_div[i]);
   }
   //alert(child);
   for(i=0;i<child.length;i++)
   {
      try{//有些学生未登录，所以可能出现空项，访问children会出错。
         child[i].children[0].children[2].children[3].value=parseInt(child[i].children[0].children[2].children[3].value)+1;
      }
      catch(err){}//忽略不处理
   }
   submitForm();
}

function  minusgroup(group)
{
   var main_div=document.getElementById("divx"+group);
   var child_div=document.getElementsByClassName("circles");
   var child=Array();
   for(i=0;i<child_div.length;i++)
   {
      if(main_div.offsetLeft <= child_div[i].offsetLeft && main_div.offsetLeft+main_div.offsetWidth >= child_div[i].offsetLeft && main_div.offsetTop <= child_div[i].offsetTop && main_div.offsetTop+main_div.offsetHeight >= child_div[i].offsetTop ) child.push(child_div[i]);
   }
   //alert(child);
   for(i=0;i<child.length;i++)
   {
      try{
         child[i].children[0].children[2].children[3].value=parseInt(child[i].children[0].children[2].children[3].value)-1;
      }
      catch(err){}
   }
   submitForm();
}

function  autoalign(group)
{
   var main_div=document.getElementById("divx"+group);
   var alignstyle=main_div.getAttribute("alignstyle");
   var child_div=document.getElementsByClassName("circles");
   var child=Array();

   if(alignstyle++>=1) alignstyle=0;
   main_div.setAttribute("alignstyle",alignstyle);

   for(i=0;i<child_div.length;i++)
   {
      if(main_div.offsetLeft <= child_div[i].offsetLeft && main_div.offsetLeft+main_div.offsetWidth >= child_div[i].offsetLeft && main_div.offsetTop <= child_div[i].offsetTop && main_div.offsetTop+main_div.offsetHeight >= child_div[i].offsetTop ) child.push(child_div[i]);
   }

   //alert(child);
   for(i=0;i<child.length;i++)
   {
      try{
         if(alignstyle==0)//阶梯
         {
            child[i].style.left=parseInt(main_div.offsetLeft)+(parseInt(main_div.offsetWidth-5)-parseInt(child[i].offsetWidth))/child.length*i+10;
         }
         else//直列
         {
            child[i].style.left=parseInt(main_div.offsetLeft)+(parseInt(main_div.offsetWidth)-parseInt(child[i].offsetWidth))/2;
         }
         child[i].style.top=parseInt(main_div.offsetTop)+(parseInt(main_div.offsetHeight-10)/(child.length))*i+10/child.length;
      }
      catch(err){}
   }

   saveGroupInfo();
}

function submitForm()
{
   var o=document.getElementById("form_group");
   o.submit();
}

function addone(n,id)
{
   var x=Number(n);					//参数n为两位，可能有前导数据0，所以需要处理一下。
   if($("#"+x).val()=="") $("#"+x).val(1);
   else $("#"+x).val(parseInt($("#"+x).val())+1);

   $("#onescore").attr("src","../update.php?S="+ $("#"+x).val() +"&ID="+id+"&W="+week+"&t=" + Math.random());
}

function minusone(n,id)
{
   var x=Number(n);					//参数n为两位，可能有前导数据0，所以需要处理一下。
   if($("#"+x).val()=="") $("#"+x).val(1);
   else $("#"+x).val(parseInt($("#"+x).val())-1);

   $("#onescore").attr("src","../update.php?S="+ $("#"+x).val() +"&ID="+id+"&W="+week+"&t=" + Math.random());
}

function resetall(n)
{
   if(n)
   {
      for(var i=1;i<=12;i++)
      {
          $("#"+(i+(n-1)*12)).val(0);
      }
   }
   else
   {
      for(var i=1;i<=48;i++)
      {
          $("#"+i).val(0);
      }
   }
}

function addall(n)
{
   if(n)
   {
      for(var i=1;i<=12;i++)
      {
          if($("#"+(i+(n-1)*12)).val()=="") $("#"+(i+(n-1)*12)).val(1);
          else $("#"+(i+(n-1)*12)).val(parseInt($("#"+(i+(n-1)*12)).val())+1);
      }
   }
   else
   {
      for(var i=1;i<=48;i++)
      {
         if($("#"+i).val()=="") $("#"+i).val(1);
         else $("#"+i).val(parseInt($("#"+i).val())+1);
      }
   }
}

function suball(n)
{
   if(n)
   {
      for(var i=1;i<=12;i++)
      {
          if($("#"+(i+(n-1)*12)).val()=="") $("#"+(i+(n-1)*12)).val(-1);
          else $("#"+(i+(n-1)*12)).val(parseInt($("#"+(i+(n-1)*12)).val())-1);
      }
   }
   else
   {
      for(var i=1;i<=48;i++)
      {
         if($("#"+i).val()=="") $("#"+i).val(-1);
         else $("#"+i).val(parseInt($("#"+i).val())-1);
      }
   }
}

/**************************************
更新座位表中姓名、得分、平均分等信息。
**************************************/
var bUpdateClass=false;
var bUpdateDate=false;
function setValue(item,nIndex)
{
   if(Object.keys(item).length==8)					//更新上课登记签到信息（姓名，得分，作业上交数量）
   {
      var seat=seatOffset==0?((nIndex-1)<10?'0'+(nIndex-1):(nIndex-1)):item['SEAT'];
      //var name=$("#name_"+item['SEAT']);				//显示学生姓名
      var name=$("#name_"+seat);
      if(name.html()=="&nbsp;" || bUpdateClass==true)			//当从未显示时，更新显示姓名和文件数量状态
      {
         name.html("<font color='black'>"+item['NAME']);
         name.attr("class","text-gradient"+item['COLOR']);
      }
      else 								//只更新文件数量状态
      {
         name.attr("class","text-gradient"+item['COLOR']);
      }
      if(seatOffset==0)
      {
         var seatno=$("#seatno_"+seat);
         seatno.html("<font color='black'>"+item['SEAT']);
      }
//      nameno.attr("class","text-gradient"+item['COLOR']);

      //var score=$("#score_"+item['SEAT']);				//显示学生得分
      var score=$("#score_"+seat);				//显示学生得分
      if(score.html()=="&nbsp;" || bUpdateClass==true)			//当从未显示时，更新显示姓名和文件数量状态
      {
         score.html("<input type=hidden name='ID[]' value='"+item['ID']+"'><input type=hidden name='WEEK[]' value='"+item['WEEK']+"'><a style='color:dodgerblue; position: relative; left: -14px;top:8px; font-size: 20px; z-index:99;' onclick=minusone('"+seat+"','"+item['ID']+"')>&nbsp;-&nbsp;</a><INPUT  class=in  style='position:relative; left:-2px; top:-22px;' id='"+Number(seat)+"'  name='scores[]' size=1 VALUE='"+item['SCORE']+"'><a style='color: dodgerblue;position: relative; right: -11px; font-size: 20px; top:-42px;' onclick=addone('"+seat+"','"+item['ID']+"')>&nbsp;+&nbsp;</a>");
      }
      else								//当在其他终端修改了学生的分数后，以红色突出显示。
      {
          var scoreinput=$("#"+Number(seat));

          if(scoreinput.val()!=item['SCORE'])   scoreinput.attr("class","in_CHANGED");//两者不一致，只标红，不更新数据，防止有效数据覆盖丢失。
          else if(scoreinput.val()<0)   scoreinput.attr("class","in_CHANGED");//两者不一致，只标红，不更新数据，防止有效数据覆盖丢失。
          else scoreinput.attr("class","in");
      }
   }
   else									//更新平均分信息
   {
      if(item['DATE'])
      { 
         $("#CDATE").html(item['DATE']);     date=item['DATE'];
      }
      else if(item['CLASSNAME'])    
      {
         cname=item['CLASSNAME'];
         if($("#CNAME").html()==cname) bUpdateClass=false;
         else
         {
            bUpdateClass=true;removeOldRecord();
            //$("#comment").attr("src","comment.php?id="+cname+"/"+date);
         }

         $("#CNAME").html(cname);
      }
      else if(item['AVERAGE'])      $("#AVG").html(item['AVERAGE']);
   }
}

function removeOldRecord()
{
   for(i=1;i<=48;i++)
   {
      $("#name_"+(i>9?i:('0'+i))).html("&nbsp;");//
      $("#name_"+(i>9?i:('0'+i))).attr("class","new");//


      $("#score_"+(i>9?i:('0'+i))).html("&nbsp;");//
      $("#score_"+(i>9?i:('0'+i))).attr("class","new");//
   }
}

var bFirstSaved=false;
/***************************************
从服务器获取当前班级的学生姓名、得分、平均分、上传作业数量等信息。
***************************************/
function refreshPage()
{
   $.post("../getScore.php",{"W":week,"D":day,"L":lesson,"F":forced }, function(data){
       data= eval(data);
       if(data)
       {
          $("#TOTAL").html(Object.keys(data).length-3);				//更新当前班级的实际人数。由于数据中多了一个平均分、班级名字和日期，所以需要减3。
          data.forEach(setValue);
          if(bFirstSaved==false)
          {
             saveGroupInfo();
             parent.updateGroupMember();
             bFirstSaved=true;
          }
       }
   });
}