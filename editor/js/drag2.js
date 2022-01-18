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
        savepos();
        savemember();
    }
}


//将当前学生姓名标签的坐标保存到文件
function savepos()
{
  var posStr= new Array();
  for(var i=1;i<=48;i++)
  {
      posStr.push(Array($("#div"+i).css("left"),$("#div"+i).css("top")));
  }

  $.post("savePos.php?t=" + Math.random(), { "pf":pf, "pos": posStr.join(",") })
}


//将当前分组情况保存到文件
function savemember()
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

      for(i=0;i<child.length;i++)//[组别]=Array{座位号_姓名,座位号_姓名,座位号_姓名,座位号_姓名}
      {
         if(strGroupMembers[g]===undefined) strGroupMembers[g]=Array();
         if(strGroupMembers[g][i]===undefined) strGroupMembers[g][i]=Array();

         try{//有些学生未登录，所以可能出现空项，访问children会出错。
            var nID=parseInt(child[i].children[0].children[0].innerText);
            strGroupMembers[g][i]= (nID<10?('0'+nID):nID) +"_"+child[i].children[0].children[1].innerText;
         }
         catch(err){}//忽略不处理
      }
      
      for(i=0;i<child.length;i++)//座位号_姓名,组别;座位号_姓名,组别;座位号_姓名,组别;座位号_姓名,组别;
      {
         try{//有些学生未登录，所以可能出现空项，访问children会出错。
            var nID=parseInt(child[i].children[0].children[0].innerText);
            strMemberGroups= strMemberGroups+ (nID<10?('0'+nID):nID) +"_"+child[i].children[0].children[1].innerText+","+g+";";
         }
         catch(err){}//忽略不处理
      }

   }
   $.post("saveMember.php?t=" + Math.random(), { "pf":pf, "member": JSON.stringify(strGroupMembers), "group":strMemberGroups });

   var content="[\"GROUP\",3]";	
   var msg = {'content': content, 'type': 'user'};
   parent.sendMsg(msg);
}
