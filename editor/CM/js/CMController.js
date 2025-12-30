/**********************************************
*
**   同组分享
**   功能：
**       组成员间，可以把自己的角色（包含脚本、造型等全部信息）和舞台背景，分享给其他人。
*
***********************************************/
function sendSEV()
{
   document.getElementById("SEVMENU").style.display="inline-block";
   add("[\"SHOWSELFEVALUATION\",\"\"]");

   showSEV();

}

var bSEV=false;
function showSelfEvaluationMenu()		//显示/隐藏互帮互助菜单
{
   if(bSEV==false) showSEV();
   else hideSEV();
   //hideHelp();
   //bSEV=!bSEV;
}

function hideSEV()		//隐藏同组分享菜单
{
   document.getElementById("evaluation").style.display="none";
   document.getElementById("SEVMENU").style.backgroundColor="hsla(215, 100%, 65%, 1)";


   //updateMenu();

   bSEV=false;
}

function showSEV()		//显示同组分享菜单
{
   document.getElementById("evaluation").style.display="block";
   document.getElementById("SEVMENU").style.backgroundColor="mediumvioletred";
   document.getElementById("evaluation").style.left= document.getElementById("SEVMENU").offsetLeft+"px";//(document.getElementById("sharemenu").offsetLeft+document.getElementById("topmenu").offsetLeft)+"px";
   document.getElementById("evaluation").style.top= (document.getElementById("SEVMENU").offsetTop+document.getElementById("SEVMENU").offsetHeight)+"px";//(document.getElementById("sharemenu").offsetLeft+document.getElementById("topmenu").offsetLeft)+"px";

   //updateMenu();
   bSEV=true;

   //getSprites("spritestoshare");
   //updateGroupMember(nCurrentGroup);

}

/*******************************
关于
*******************************/

var bAbout=false;
function showAboutMenu()		//显示/隐藏互帮互助菜单
{
   if(bAbout==false) showAbout();
   else hideAbout();
   //hideShare();
   bAbout!=bAbout;
}

function hideAbout()		//隐藏互帮互助菜单
{
   //var m=document.getElementById("moretohelp");
   //m.innerHTML="互帮互助";
   //m.parentElement.style.backgroundColor="hsla(215, 100%, 65%, 1)";
   document.getElementById("about").style.visibility="hidden";
   document.getElementById("aboutmenu").style.backgroundColor="hsla(215, 100%, 65%, 1)";

   //updateMenu();

   bAbout=false;
}

function showAbout()		//显示互帮互助菜单
{
   //var m=document.getElementById("moretohelp");
   //m.innerHTML="互帮互助";
   //m.parentElement.style.backgroundColor="firebrick";
   document.getElementById("aboutmenu").style.backgroundColor="black";
   document.getElementById("about").style.visibility="visible";
   //document.getElementById("about").style.left= document.getElementById("aboutmenu").offsetLeft+"px";//(document.getElementById("helpmenu").offsetLeft+document.getElementById("topmenu").offsetLeft)+"px";
   //updateMenu();

   bAbout=true;
}


function test()
{
   var options = {};
   if (typeof MediaRecorder.isTypeSupported == 'function') {
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
         options.mimeType = 'video/webm;codecs=vp8';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
         options.mimeType = 'video/webm;codecs=vp9';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
         options.mimeType = 'video/webm;codecs=h264';
   }
}


//舞台录制
var recorder = {
    chunks: [],
    start: function (options) {
        var canvas = $("canvas")[0];
        if (!canvas) {
            console.info("canvas is needed!")
            return false;
        }
        this.chunks = [];
        this.stream = canvas.captureStream(60);
        this.mediaRecorder = new MediaRecorder(this.stream);
        this.mediaRecorder.onstop = this.stopHandler;
        this.mediaRecorder.ondataavailable = this.dataHandler;

        if (options.music) {
            this.attachAudio(music);
            this.audio.play();
        }
        this.mediaRecorder.start();
        return true;
    },
    stop: function () {
        this.mediaRecorder.stop();
        if (this.audio) {
            this.audio.currentTime = 0;
            this.audio.pause();
        }
    },
    attachAudio: function (music) {
        var audioCtx = new AudioContext();
        // create a stream from our AudioContext
        var dest = audioCtx.createMediaStreamDestination();
        var audioStream = dest.stream;

        this.audio = document.createElement('audio');
        this.audio.crossOrigin = "anonymous";
        this.audio.loop = "loop";
        this.audio.src = music.url;

        // connect our audio element's output to the stream
        var sourceNode = audioCtx.createMediaElementSource(this.audio);
        sourceNode.connect(dest)
        sourceNode.connect(audioCtx.destination);

        this.stream.addTrack(audioStream.getAudioTracks()[0]);
    },
    dataHandler: function (e) {
        recorder.chunks.push(e.data);
    },
    stopHandler: function () {
        if (recorder.chunks.length) {
            var blob = new Blob(recorder.chunks, {type: "video/webm"})
            var downloadUrl = window.URL.createObjectURL(blob);

            var link = document.createElement('a');
            link.style.display = 'none';
            link.href = downloadUrl;
            link.download = 'media.webm';
            link.disabled = false;
            link.click();
        } else {
            console.info("no data saved");
        }
    }
};
}
/*
//弃用
function R()
{
   const canvas = document.querySelector('canvas');
   const ctx = canvas.getContext('2d',{willReadFrequently:true});
   const {width, height} = canvas;

   const stream = canvas.captureStream();
   const recorder = new MediaRecorder(stream, { mimeType: 'video/mp4' });

   const data = [];

   recorder.ondataavailable = function (event)
   {
  
    if (event.data && event.data.size) {

      data.push(event.data);
  }

   };

   recorder.onstop = () => {

     const url = URL.createObjectURL(new Blob(data, { type: 'video/webm' }));

     document.querySelector("#videoContainer").style.display = "block";

     document.querySelector("video").src = url;

   };

   recorder.start();


   setTimeout(() => {
 recorder.stop();
}, 6000);
}*/



//恢复异常文件
function recoveryFile()
{
   var date=document.getElementById("d").value;
   var file=document.getElementById("f").value;
   window.open ("./CM/recoveryFile.php?f="+arrBKFiles[nBKFileIndex]+"&d="+date+"&p="+file);
}



/**********************************************
*
**   互帮互助
**   功能：
**       整班级别的大团队互助。
*
***********************************************/

var strHelper='';
var bHelped=false;
var bQuizStopped=false;
/***********
*
** 删除之前的求助
** 当checkbox的checked属性为true时，发送帮助请求。该操作两次间至少要等十秒。
*
**********/
function cancelHelp(o)
{
   if(o.checked==true)
   {
      var d= new Date();
      var nTime= d.getTime();

      if((nTime-nLastHelpRequest)<10*1000){ o.checked=false;alert("请求过于频繁，请10秒后再试。");}
      else
      {
         nLastHelpRequest=nTime;
         var content="[\"HELP\",\""+uname+"\"]";			//发出求助
         var msg = {'content': content, 'type': 'user'};
         sendMsg(msg);
      }
   }
   else
   {
      var content="[\"HELP\",\""+uname+"\",\""+uname+"\"]";	//将自己的名字作为帮助者和求助者发出，可以清除之前的请求记录。
      var msg = {'content': content, 'type': 'user'};
      sendMsg(msg);
   }
}


/***********
*
** 向同学请求帮助。没有人应答的话，可以一直点。页面刷新后，请求数据会消失，重点才会被看见。
** 为防止频繁请求堵塞通道，限定发出请求操作两次间至少要间隔10秒；取消操作可即时执行。
*
**********/
var nLastHelpRequest=0;

function helpme()
{
   var d= new Date();
   var nTime= d.getTime();

   if((nTime-nLastHelpRequest)<10*1000) alert("请求过于频繁，请10秒后再试。");
   else
   {
      nLastHelpRequest=nTime;
      bHelped=false;
      document.getElementById("check").checked=true;		//勾选，表示之前发出过帮助请求
      var content="[\"HELP\",\""+uname+"\"]";
      var msg = {'content': content, 'type': 'user'};
      sendMsg(msg);
   }
}

/***********
*
** 收到了求助者的求助信息。同一人的求助会多次出现，所以需要检测。
*
**********/
function helpneeded(strUser)
{
   var h=document.getElementById("helplist");
   var bFound=false;

   for(var n=1;n<h.children.length;n++)//检测是否已存在求助菜单
   {
      if(h.children[n].innerHTML==strUser){
         bFound=true;
         break;
      }
   }
   if(bFound==false)
   {
      var li=document.createElement("li");
      li.innerHTML=strUser+" 正在寻求帮助";
      li.style.fontSize="14px";
      li.className="menu_menu-item_3EwYA menu_hoverable_3u9dt menu_menu-section_2U-v6";
      li.onclick=function(){gohelping(this);};
      h.appendChild(li);
      //showHelp();			//有新人求助时，弹出菜单。可能稍微有点扰民。换成下面的红*后，就好了。红*会在菜单点击后被覆盖掉。
      document.getElementById("moretohelp").innerHTML="互帮互助<font color=red>★</font>";
   }
}

/***********
*
** 对帮助者点赞，后台更新得分。
*
**********/
function goodhelping(o)
{
   if(confirm("你的问题解决了么？")==1)
   {
      document.getElementById("check").style.display="block";
      document.getElementById("txt").innerHTML="谁来帮帮我！";
      document.getElementById("txt").style.left="16px";

      document.getElementById("txt").onclick=function(){helpme();};

      //给帮助者加分。
      $.post("./CM/helperScore.php?t=" + Math.random(), { "S": strHelper}, function (data) {
         if(data.length>0){ 
            alert("太好了！"+data);
            var content='[\"SCORE\",\"'+uname+'\",\"'+strHelper+'\",\"1\"]';
            var msg = {'content': content, 'type': 'user'};
            sendMsg(msg);
         }
      });
   }
   else
   {
      document.getElementById("check").style.display="block";
      document.getElementById("txt").innerHTML="谁来帮帮我！";
      document.getElementById("txt").style.left="16px";

      document.getElementById("txt").onclick=function(){helpme();};
      if(confirm("对方没有来，是虚假帮助？")==1)
      {
         //给虚假帮助者扣分。
         $.post("./CM/fhelperScore.php?t=" + Math.random(), { "S": strHelper}, function (data) {
            if(data.length>0){ 
               alert("好了，"+data);
               var content='[\"SCORE\",\"'+uname+'\",\"'+strHelper+'\",\"-1\"]';
               var msg = {'content': content, 'type': 'user'};
               sendMsg(msg);
            }
         });
      }
      else
      {
         alert("真是很遗憾啊。要不你重新发起求助吧？");
      }
   }

   if(bHelpAllowed==false)//互帮互助已关闭
   {
      setJSCookie("BG",0,1);
      document.getElementById("waiting").style.visibility="hidden";
      document.getElementById("waiting").style.zIndex="990";
   }
}

/***********
*
** 帮助者去帮忙前，要通知被帮助者我来了，同时通知其他人，删掉求助者的求助信息。
*
**********/
function gohelping(o)
{
   if(confirm("你完成了自己的任务么？\r\n注意：不要频繁地去点击求助者，万一有多人同意你去帮助，而你又忙不过来，则很可能会被求助者判定为虚假帮助，最后反而被扣分。")==1)
   {
      var h=document.getElementById("helplist");		//如果对方不同意，就不要再申请了，所以还是应该删除
      var strName=o.innerHTML.split(" ")
      var content="[\"ACK\",\""+uname+"\",\""+strName[0]+"\"]";//["HELP","帮助者","求助者"];
      var msg = {'content': content, 'type': 'user'};
      sendMsg(msg);
      h.removeChild(o);
   }
}

var bHelp=false;
function showHelpMenu()		//显示/隐藏互帮互助菜单
{
   if(bHelp==false) showHelp();
   else hideHelp();
   hideShare();
   bHelp!=bHelp;
}

function hideHelp()		//隐藏互帮互助菜单
{
   var m=document.getElementById("moretohelp");
   if(m==undefined) return;
   m.innerHTML="互帮互助";
   m.parentElement.style.backgroundColor="hsla(215, 100%, 65%, 1)";
   document.getElementById("help").style.visibility="hidden";

   updateMenu();

   bHelp=false;
}

function showHelp()		//显示互帮互助菜单
{
   var m=document.getElementById("moretohelp");
   if(m==undefined) return;
   m.innerHTML="互帮互助";
   m.parentElement.style.backgroundColor="firebrick";
   document.getElementById("help").style.visibility="visible";
   document.getElementById("help").style.left= document.getElementById("helpmenu").offsetLeft+"px";//(document.getElementById("helpmenu").offsetLeft+document.getElementById("topmenu").offsetLeft)+"px";
   updateMenu();

   bHelp=true;
}

/**********************************************
*
**   同组分享
**   功能：
**       组成员间，可以把自己的角色（包含脚本、造型等全部信息）和舞台背景，分享给其他人。
*
***********************************************/

var bShare=false;
function showShareMenu()		//显示/隐藏互帮互助菜单
{
   if(bShare==false) showShare();
   else hideShare();
   hideHelp();
   bShare!=bShare;
}

function hideShare()		//隐藏同组分享菜单
{
   var m=document.getElementById("moretoshare");
   if(m==undefined) return;
   m.innerHTML="同组分享";
   m.parentElement.style.backgroundColor="hsla(215, 100%, 65%, 1)";
   var members=document.getElementById("memberstoshare");
   if(members.length>0) members.length=0;

   document.getElementById("share").style.visibility="hidden";
   //document.getElementById("share").style.left= document.getElementById("sharemenu").offsetLeft+"px";//(document.getElementById("sharemenu").offsetLeft+document.getElementById("topmenu").offsetLeft)+"px";

   updateMenu();

   bShare=false;
}

function showShare()		//显示同组分享菜单
{
   var m=document.getElementById("moretoshare");
   if(m==undefined) return;
   m.innerHTML="同组分享";
   m.parentElement.style.backgroundColor="mediumvioletred";
   document.getElementById("share").style.visibility="visible";
   document.getElementById("share").style.left=document.getElementById("sharemenu").offsetLeft+"px";// (document.getElementById("sharemenu").offsetLeft+document.getElementById("topmenu").offsetLeft)+"px";

   updateMenu();
   bShare=true;
   getSprites("spritestoshare");
   updateGroupMember(nCurrentGroup);

}


/*******************************
*
** 收到被分享的角色/舞台背景，创建接收菜单。
*
*******************************/
function shareComing(strUser,strSpriteName,strSpriteID,strSpriteIMG)
{
   var h=document.getElementById("sharelist");
   var bFound=false;

   for(var n=1;n<h.children.length;n++)//检测是否已存在求助菜单
   {
      if(h.children[n].innerHTML==strUser){
         bFound=true;
         break;
      }
   }
   if(bFound==false)
   {
      var li=document.createElement("li");
      var myDate = new Date();
      li.innerHTML="点击接收<u>"+strUser+"</u>分享的<input style='width:85px;color:black' value='"+strSpriteName+"'> ("+myDate.getHours()+":"+myDate.getMinutes()+")";
      li.style="font-size: 14px; position: relative;  left: 0px;  right: 19px;  min-width: 350px;";
      li.className="menu_menu-item_3EwYA menu_hoverable_3u9dt menu_menu-section_2U-v6";
      li.onclick=function(){ addSharedSprite(this,strSpriteID);};
      var img=document.createElement("img");
      img.src="../data/scripts/"+strSpriteIMG;
      img.style="width: 21px;  height: 21px;   left: 10px;    top: 7px;    position: relative;";
      li.appendChild(img);
      h.appendChild(li);


      //showHelp();			//有新人求助时，弹出菜单。可能稍微有点扰民。换成下面的红*后，就好了。红*会在菜单点击后被覆盖掉。
      document.getElementById("moretoshare").innerHTML="同组分享<font color=red>★</font>";
   }
}

/*******************************
*
** 向当前项目添加被分享的角色/舞台
*
*******************************/
function  addSharedSprite(o,strSpriteID)
{
   if(confirm("你是否愿意接收此条共享数据？")==1){
      if(strSpriteID.length==32){
         $.post("./CM/loadScript.php?t=" + Math.random(), { "S":strSpriteID }, (function(o){ return function(data){ //共享数据保存在文件中。
            if(data=="") return;
            var jsondata=JSON.parse(data); 
 
            if(JSON.stringify(jsondata)=="{}") return;

            if(jsondata.isStage==false){           		//接收分享过来的角色
               jsondata["name"]=o.children[0].innerText+"的"+o.children[1].value;
               for(var i=0;i<jsondata.costumes.length;i++)
               {
                  if(jsondata.costumes[i].asset.data.type!=undefined)
                     jsondata.costumes[i].asset.data=jsondata.costumes[i].asset.data.data;
               }
               oVMM.props.vm.addSprite(jsondata); 				//执行角色添加操作（包括了角色的所有信息：造型、脚本、声音等资源）
            }
            else{						//接收分享过来的舞台
               if(jsondata.blocks!=null){				//接收分享过来的积木数据
                  if(confirm("是否接收分享过来的舞台脚本？")==1)
                  {
                     $.each(jsondata.blocks,function (id,item){			//此处最好把index改一下，否则接收时，如果存在该ID，则不会被添加。
                        var newItem={ 				//item在这里是引用，要让目标有新的积木块，必须构建新的数据结构。
                           "fields":	item.fields,
                           "id":	item.id,
                           "inputs":	item.inputs,
                           "next":	item.next,
                           "opcode":	item.opcode,
                           "parent":	item.parent,
                           "shadow":	item.shadow,
                           "topLevel":	item.topLevel,
                           "x":		item.x,
                           "y":		item.y
                        };
                        oVMM.props.vm.runtime.targets[0].blocks.createBlock(newItem); //创建积木
  
                     });
                  }
               }
               for(i=0;i<jsondata.costumes.length;i++){			//接收分享过来的舞台背景数据
                  var dCostume=jsondata.costumes[i];

                  if(jsondata.costumes[i].asset.data.type==undefined)//矢量图
                  {
                     var dkeys=Object.keys(jsondata.costumes[i].asset.data);

                     var dataArray=new Uint8Array(dkeys.length);
                     for(var x=0;x<dkeys.length;x++)				//将Array数据，装入Uint8Array
                     {
                        dataArray[x]=jsondata.costumes[i].asset.data[dkeys[x]];
                     }

	
                     var asset= new oVMM.props.vm.runtime.storage.Asset(		//构建Asset对象
                        jsondata.costumes[i].asset.assetType,
                        jsondata.costumes[i].asset.assetId,
                        jsondata.costumes[i].asset.dataFormat,
                        dataArray,							//舞台背景强制Uint8Array，角色无所谓。
                        []
                     );
                     dCostume.asset=asset;
                     dCostume.assetId=asset.assetId;				//ID最好也改一下，防止跟当前资源冲突。
                     dCostume.md5=asset.assetId+"."+asset.dataFormat;
                  }
                  else if((typeof jsondata.costumes[i].asset.data.data) == 'object')//非矢量图
                  {
                     var dkeys=Object.keys(jsondata.costumes[i].asset.data.data);

                     var dataArray=new Uint8Array(dkeys.length);
                     for(var x=0;x<dkeys.length;x++)				//将Array数据，装入Uint8Array
                     {
                        dataArray[x]=jsondata.costumes[i].asset.data.data[dkeys[x]];
                     }

	
                     var asset= new oVMM.props.vm.runtime.storage.Asset(		//构建Asset对象
                        jsondata.costumes[i].asset.assetType,
                        jsondata.costumes[i].asset.assetId,
                        jsondata.costumes[i].asset.dataFormat,
                        dataArray,							//舞台背景强制Uint8Array，角色无所谓。
                        []
                     );
                     dCostume.asset=asset;
                     dCostume.assetId=asset.assetId;				//ID最好也改一下，防止跟当前资源冲突。
                     dCostume.md5=asset.assetId+"."+asset.dataFormat;
                  }
                  else		//可丢弃					//矢量图的处理
                  {
                     var dataArray_t=jsondata.costumes[i].asset.data.split(",");	//直接从字符串拆分为普通数组
                     var dataArray=new Uint8Array(dataArray_t.length);		//构建Uint8Array
                     for(var x=0;x<dataArray_t.length;x++)				//将Array数据，装入Uint8Array
                     {
                        dataArray[x]=dataArray_t[x];
                     }
                     var asset= new oVMM.props.vm.runtime.storage.Asset(		//构建Asset对象
                        jsondata.costumes[i].asset.assetType,
                        jsondata.costumes[i].asset.assetId,
                        jsondata.costumes[i].asset.dataFormat,
                        dataArray,							//舞台背景强制Uint8Array，角色无所谓。
                        []
                     );
                     dCostume.asset=asset;
                     dCostume.assetId=asset.assetId;				//ID最好也改一下，防止跟当前资源冲突。
                     dCostume.md5=asset.assetId+"."+asset.dataFormat;
                  }
                  //else
                  //{
                  //   alert("图像数据异常，无法解析。");
                  //}
                  oVMM.props.vm.addBackdrop(dCostume.md5,dCostume);		//执行背景添加操作（暂只能添加造型）
               }
             }
           }
        })(o));
      }
   }
   o.parentElement.removeChild(o);  
}



//分组管理
function showgsetting()
{
   var g=document.getElementById("groupsetup");
   var o=document.getElementById("groupwindow");
   if(g.style.visibility=="visible")
   {
      g.style.visibility="hidden";
      o.contentWindow.stopInterTimer();
   }
   else
   {
      showControlPanel();
      g.style.visibility="visible";
      if(o.src==undefined || o.src=='')
      {
         o.src="./CM/gSetting.php?pos="+nCurrentGroup+"&t="+Math.random();
      }
      else
      {
         o.contentWindow.startInterTimer();
      }
   }
}



function showgroupsetting(n)
{
   var nCurrentGroup=0;
   var g=document.getElementById("groupsetup");
   var gk=document.getElementById("groupbk");
   var o=document.getElementById("groupwindow");
   if(n==3)
   {
      g.style.width="880px";
      g.style.height="590px";
      g.style.visibility="visible";
      gk.style.width="880px";
      gk.style.height="590px";
      if(nCurrentGroup==0)
      {
         nCurrentGroup=3;
         o.src="./CM/gSetting.php?pos="+nCurrentGroup+"&t="+Math.random();//+"&W=<?php echo $week;?>&D=<?php echo $day;?>&L=<?php echo $lesson;?>";
      }
      else if(o.src!="" && nCurrentGroup!=n) alert("已存在其它分组，要启用新分组，请先解散原有分组。");
   }
   else if(n==4)
   {
      g.style.width="895px";
      g.style.height="550px";
      g.style.visibility="visible";      
      gk.style.width="895px";
      gk.style.height="550px";
      if(nCurrentGroup==0)
      {
         nCurrentGroup=4;
         o.src="./CM/gSetting.php?pos="+nCurrentGroup+"&t="+Math.random();//+"&W=<?php echo $week;?>&D=<?php echo $day;?>&L=<?php echo $lesson;?>";
      }
      else if(o.src!="" && nCurrentGroup!=n) alert("已存在其它分组，要启用新分组，请先解散原有分组。");
   }
   else if(n==1)
   {
      g.style.width="895px";
      g.style.height="550px";
      g.style.visibility="visible";      
      gk.style.width="895px";
      gk.style.height="550px";
      if(nCurrentGroup==0)
      {
         nCurrentGroup=1;
         o.src="./CM/gSetting.php?pos="+nCurrentGroup+"&t="+Math.random();//+"&W=<?php echo $week;?>&D=<?php echo $day;?>&L=<?php echo $lesson;?>";
      }
      else if(o.src!="" && nCurrentGroup!=n) alert("已存在其它分组，要启用新分组，请先解散原有分组。");
   }
   else if(n==48)
   {
      g.style.width="895px";
      g.style.height="550px";
      g.style.visibility="visible";      
      gk.style.width="895px";
      gk.style.height="550px";
      if(nCurrentGroup==0)
      {
         nCurrentGroup=48;
         o.src="./CM/gSetting.php?pos="+nCurrentGroup+"&t="+Math.random();//+"&W=<?php echo $week;?>&D=<?php echo $day;?>&L=<?php echo $lesson;?>";
      }
      else if(o.src!="" && nCurrentGroup!=n) alert("已存在其它分组，要启用新分组，请先解散原有分组。");
   }
   else
   {
      g.style.visibility="hidden";
      o.src="./CM/gSetting.php?pos=0&t="+Math.random();
      nCurrentGroup=0;
      //o.src="about:blank";
   }
}



//投屏

var arrInvited=Array();			//已被邀请人员名单

//显示当前学生名单
function showRacers()
{
   var racers= document.getElementById("racerlist");
   racers.innerHTML="";
   racers.style.visibility="visible";
   if(arrUsers.length>0)
   {
      for(var i=0;i<arrUsers.length-1;i++)
      {
         if(strTeacher==arrUsers[i]) continue;

         var d=document.createElement("div");
         //d.style="margin:10px 5px 10px 5px;display: inline-block;";
         d.setAttribute("class","USERLIST");
         var c=document.createElement("input");
         c.setAttribute("type","radio");
         c.id=arrUsers[i];
         c.value=c.id;
         if(arrInvited.indexOf(c.id)!=-1){
            c.checked=true;
         }
         c.onclick=function(){inviteMe(this.id);};		//单击即可发出邀请
         d.appendChild(c);
         var label=document.createElement("label");
         label.style="cursor: grab;color:brown;";
         label.setAttribute("for",c.id);
         label.innerText=c.id;
         d.appendChild(label);
         if(arrInvited.indexOf(c.id)!=-1){
            d.style.background="gray";
         }
         racers.appendChild(d);
      }
   }

   var br=document.createElement("input");
   br.setAttribute("type","button");
   br.style="position: absolute; bottom: 20px; left: 200px;";
   br.value="随机选择5人";
   br.onclick=function(){invite5();};				//随机选5人
   racers.appendChild(br);

   var b=document.createElement("input");
   b.setAttribute("type","button");
   b.style="position: absolute; bottom: 20px; left: 390px;";
   b.value="收起";
   b.onclick=function(){document.getElementById('racerlist').style.visibility='hidden';};	//隐藏名单
   racers.appendChild(b);

   var bs=document.createElement("input");
   bs.setAttribute("type","button");
   bs.style="position: absolute; bottom: 20px; left: 500px;";
   bs.value="重置";
   bs.onclick=function(){ if(confirm("您确定要重置已邀请人员名单么？此操作不可撤销。")==1) {arrInvited.length=0;showRacers();}};	//重置已被邀请人员名单，并刷新名单
   racers.appendChild(bs);
}


//指定人员的邀请
function inviteMe(id)
{
   if(arrInvited.indexOf(id)==-1)					//防止重复发送邀请
   {
      document.getElementById(id).parentElement.style.background="green";

      arrInvited.push(id);
      var strInvitation="[\"INVITATION\",\"\"]";
      var msg =  { 'content': strInvitation , 'type': 'user'  ,'to':id};
      sendMsg(msg);
   }
   else if(confirm("已对此人发过邀请，是否需要重发？")==1)		//的确需要重选的情况
   {
      document.getElementById(id).parentElement.style.background="green";
      var strInvitation="[\"INVITATION\",\"\"]";
      var msg =  { 'content': strInvitation , 'type': 'user'  ,'to':id};
      sendMsg(msg);
   }
}

//同台竞技投屏，随机邀请5人
function invite5()
{
   var s=document.getElementById("user_list");

   //var racers= document.getElementById("racerlist");

   var strInvitation="[\"INVITATION\",\"\"]";
   var msg =  { 'content': strInvitation , 'type': 'user'  ,'to':'Stage'};
   sendMsgPlay(msg);

   if(arrInvited)
   {
      for(var n=0;n<arrInvited.length;n++)		//过滤教师。经过sort排序后，教师账号在最后一个。
      {
         document.getElementById(arrInvited[n]).parentElement.style.background="gray";
      }
   }


   var arrRacers=Array();
   for(var n=0;n<arrUsers.length;n++)		//过滤教师。经过sort排序后，教师账号在最后一个。
   {
      if(strTeacher==arrUsers[n]) continue;
      if(!document.getElementById(arrUsers[n]).checked)
         arrRacers.push(arrUsers[n]);
   }

   var nTotal=arrRacers.length;
   var nCurrent=0;

   if(nTotal<5)					//人员不足5个，询问是否全员参与
   {
      if(nTotal>0)
      {
         if(confirm("当前还有"+nTotal+"位候选人，是否全选？")==1)
         {
            var inX1 = setInterval(function()			//用定时器，是为了防止连续发送太快，导致学生端来不及处理而造成丢包。
            {
               if(nCurrent<nTotal){
                  var strInvitation="[\"INVITATION\",\"\"]";
                  var msg =  { 'content': strInvitation , 'type': 'user'  ,'to':arrRacers[nCurrent]};
                  sendMsg(msg);
                  arrInvited.push(arrRacers[nCurrent]);
                  document.getElementById(arrRacers[nCurrent]).checked=true;
                  document.getElementById(arrRacers[nCurrent]).parentElement.style.background="green";

                  nCurrent++;
               }
               else clearInterval(inX1);
            },500);
         }
      }
      else alert("当前无人参加。");
   }
   else						//随机抽选5人
   {
      var inX2 = setInterval(function()
      {
         if(nCurrent<5){
            var i=parseInt((Math.random()*100) % arrRacers.length);	//根据实际大小生成随机数
            arrInvited.push(arrRacers[i]);

            var strInvitation="[\"INVITATION\",\"\"]";
            var msg =  { 'content': strInvitation , 'type': 'user'  ,'to':arrRacers[i]};
            sendMsg(msg);
            document.getElementById(arrRacers[i]).checked=true;
            document.getElementById(arrRacers[i]).parentElement.style.background="green";

            arrRacers.splice(i,1);					//抽一个删一个，避免重复
            nCurrent++;
         }
         else clearInterval(inX2);
      },500);
   }
}

//重置舞台
function resetStage()
{
   //var strInvitation="[\"INVITATION\",\"\"]";
   //var msg =  { 'content': strInvitation , 'type': 'user'  ,'to':'Stage'};
   //sendMsgPlay(msg);
   var pg=document.getElementById("playground");
   pg.src="./play.php";
}

function setRaceStage()
{
   hideRaceCostume();
   //获取舞台背景数据
  //$.post("./race/getSTList.php?t=" + Math.random(), {}, function (data) 
  //{
  //   if(data.length>0){ 
  //      document.getElementById("subStage").innerHTML=data;
        document.getElementById("subStage").style.visibility="visible";
  //   }
  //});
}


function hideRaceStage()
{
   //获取舞台背景数据
   //$.post("./race/getSTList.php?t=" + Math.random(), {}, function (data) 
   //{
   //  if(data.length>0){ 
   //     document.getElementById("subStage").innerHTML=data;
        document.getElementById("subStage").style.visibility="hidden";
   //  }
  //});
}

function setRaceCostume()
{
   hideRaceStage();
   //获取舞台背景数据
  //$.post("./race/getSTList.php?t=" + Math.random(), {}, function (data) 
  //{
  //   if(data.length>0){ 
  //      document.getElementById("subStage").innerHTML=data;
        document.getElementById("subCostume").style.visibility="visible";
  //   }
  //});
}

function hideRaceCostume()
{
   //获取舞台背景数据
   //$.post("./race/getSTList.php?t=" + Math.random(), {}, function (data) 
   //{
   //  if(data.length>0){ 
   //     document.getElementById("subStage").innerHTML=data;
        document.getElementById("subCostume").style.visibility="hidden";
   //  }
  //});
}

function setStageDrop(o)
{
   //if(o.value!="")
   //{

   if(o.value!=""){ 
      //bSelfShow=true;
      add("[\"BACKDROP\",\""+o.value+"\"]");
   }
   //   var msg =  { 'content': "[\"BACKDROP2\",\""+o.value+"\"]" , 'type': 'user'  ,'to':''} ;
   //   sendMsgPlay(msg); 
   //   sendMsg(msg);
   //}
}

//清理舞台
function cleanStage()
{
   var strInvitation="[\"INVITATION\",\"\"]";
   var msg =  { 'content': strInvitation , 'type': 'user'  ,'to':'Stage'};
   sendMsgPlay(msg);
   //var pg=document.getElementById("playground");
   //pg.src="./play.php";
}

function showgroup(n)
{
   //if(classid==0)				//教师暂未选择班级，需要强制提醒
   //{
   //   if (fileshow == false) showfiles();
   //   document.getElementById("c").focus();
   //   alert("请先选择班级。");return;
   //}
   var o=document.getElementById("groupx");
   var content="[\"GROUP\","+n+"]";			//分组信息
   bSelfShow=true;
   if(n==3)
   {
      if(nCurrentGroup==0)
      {
         nCurrentGroup=3;
         o.src="./CM/setGroup.php?pg="+nCurrentGroup+"&t="+Math.random();//+"&W=<?php echo $week;?>&D=<?php echo $day;?>&L=<?php echo $lesson;?>";
      }
      else if(o.src!="" && nCurrentGroup!=n) alert("已存在其它分组，要启用新分组，请先解散原有分组。");
      document.getElementById("G3").style.display="none";
      document.getElementById("G4").style.display="none";
      document.getElementById("G1").style.display="none";
      document.getElementById("G48").style.display="none";
      document.getElementById("GC").value="解散三人分组";
      document.getElementById("GC").style.display="inline";
      document.getElementById("G").style.display="inline";

      showControlPanel();
   }
   else if(n==4)
   {
      if(nCurrentGroup==0)
      {
         nCurrentGroup=4;
         o.src="./CM/setGroup.php?pg="+nCurrentGroup+"&t="+Math.random();//+"&W=<?php echo $week;?>&D=<?php echo $day;?>&L=<?php echo $lesson;?>";
      }
      else if(o.src!="" && nCurrentGroup!=n) alert("已存在其它分组，要启用新分组，请先解散原有分组。");
      document.getElementById("G3").style.display="none";
      document.getElementById("G4").style.display="none";
      document.getElementById("G1").style.display="none";
      document.getElementById("G48").style.display="none";
      document.getElementById("GC").value="解散四人分组";
      document.getElementById("GC").style.display="inline";
      document.getElementById("G").style.display="inline";
      showControlPanel();
   }
   else if(n==1)
   {
      if(nCurrentGroup==0)
      {
         nCurrentGroup=1;
         o.src="./CM/setGroup.php?pg="+nCurrentGroup+"&t="+Math.random();//+"&W=<?php echo $week;?>&D=<?php echo $day;?>&L=<?php echo $lesson;?>";
      }
      else if(o.src!="" && nCurrentGroup!=n) alert("已存在其它分组，要启用新分组，请先解散原有分组。");
      document.getElementById("G3").style.display="none";
      document.getElementById("G4").style.display="none";
      document.getElementById("G1").style.display="none";
      document.getElementById("G48").style.display="none";
      document.getElementById("GC").value="解散大组";
      document.getElementById("GC").style.display="inline";
      document.getElementById("G").style.display="inline";
      showControlPanel();
   }
   else if(n==48)
   {
      if(nCurrentGroup==0)
      {
         nCurrentGroup=48;
         o.src="./CM/setGroup.php?pg="+nCurrentGroup+"&t="+Math.random();//+"&W=<?php echo $week;?>&D=<?php echo $day;?>&L=<?php echo $lesson;?>";
      }
      else if(o.src!="" && nCurrentGroup!=n) alert("已存在其它分组，要启用新分组，请先解散原有分组。");
      document.getElementById("G3").style.display="none";
      document.getElementById("G4").style.display="none";
      document.getElementById("G1").style.display="none";
      document.getElementById("G48").style.display="none";
      document.getElementById("GC").value="解散独立组";
      document.getElementById("GC").style.display="inline";
      document.getElementById("G").style.display="inline";
      showControlPanel();
   }
   else
   {
      content="[\"GROUP\",0]";			//分组信息

      o.src="./CM/setGroup.php?pg=0&t="+Math.random();
      nCurrentGroup=0;
      document.getElementById("G3").style.display="inline";
      document.getElementById("G4").style.display="inline";
      document.getElementById("G1").style.display="inline";
      document.getElementById("G48").style.display="inline";
      document.getElementById("GC").style.display="none";
      document.getElementById("G").style.display="none";

   }
 
   showgroupsetting(n);

   var msg = {'content': content, 'type': 'user'};
   sendMsg(msg);
   hideShare();
}


function sendMsgPlay(msg)
{
   var pg=document.getElementById("playground");
   if(pg.contentWindow)
   {
      var strInvitation="[\"INVITATION\",\"\"]";
      var msg =  { 'content': strInvitation , 'type': 'user'  ,'to':'Stage'};
      pg.contentWindow.sendMsgPlay(msg);
   }
}

//同台竞技投屏，清理舞台
function openStage()
{
   //var strWebSocketPlayURL="ws://<?php echo $WSSERVER;?>:<?php echo (8090+$room);?>";		//同屏竞技
   initPlay(strWebSocketPlayURL,uname);

   var p=document.getElementById("play");
   p.style.visibility="visible";
   var pg=document.getElementById("playground");
   if(pg.src=="")
      pg.src="./play.php";

   var s=document.getElementById("user_list");
   var arrSend=Array();

   var strInvitation="[\"INVITATION\",\"\"]";
   var msg =  { 'content': strInvitation , 'type': 'user'  ,'to':'Stage'};
   sendMsgPlay(msg);

   showtasks();
}


//同台竞技投屏，关闭舞台
function shutdownStage()
{
   document.getElementById("play").style.visibility="hidden";
   document.getElementById("racerlist").style.visibility="hidden";

}

function dealCommand(jsonCOMMAND)//接收到广播数据后，判断该执行什么操作。
{
   if(jsonCOMMAND.length>1)
   {
      var Sprite=null;
      switch(jsonCOMMAND[0])
      {

      case "MSG":
            newInfo(jsonCOMMAND[1]+'||'+jsonCOMMAND[2],false);

         break;

      case "GROUP"://收到分组控制指令
         if(jsonCOMMAND[1]==0) 
         {
            bGroup=false;
         }//刷新文件列表
         else
         {
            bGroup=true;
            if(document.getElementById("sharemenu").style.visibility=="visible")      
               showShare();
         }
         loadFolder(classid);//更新文件列表中数据（显示或隐藏组员已交作业）。现在已经实现了角色级别的共享，这个文件级别的似乎不需要了。
         break;

      case "HELP":						//1.求助指令：["HELP","求助者"] 	2.帮助指令：["HELP","帮助者","求助者"]
/*
HELP,求助者	
求助者：鼠标点击主动发出
其他人：被动接收，菜单添加

HELP，求助者，求助者
求助者：鼠标点击主动发出
帮助者：忽略
其他人：删除求助者的菜单

ACK1，帮助者，求助者
帮助者：鼠标点击主动发出
求助者：弹窗确认是否接受帮助
       接受帮助，则发送ACK指令
其他人：忽略

ACK2，帮助者，求助者
帮助者：弹窗，提醒去帮忙
求助者：对方正在赶来
其他人：删除求助者的菜单
*/
         if(jsonCOMMAND[1]!=uname)				//jsonCOMMAND[1]不是自己，则表示是别人的求助，或者是帮助者的应答。
         {
            if(jsonCOMMAND[2]==undefined)			//如第三个参数未定义，则此条是求助信息。
            {
               helpneeded(jsonCOMMAND[1]);
            }
            else						//否则就是帮助者的应答
            {
               if(jsonCOMMAND[1]==jsonCOMMAND[2])		//否则，表示跟自己无关，但需要从列表中删除求助者信息，因为有人去帮忙了。
               {
                  var h=document.getElementById("helplist");
                  for(var n=1;n<h.children.length;n++)
                  {
                     let strName=h.children[n].innerHTML.split(" ");//XXX 正在寻求帮助
                     if(strName[0]==jsonCOMMAND[2]) {h.removeChild(h.children[n]);break;}
                  }
               }
            }
         }
         break;

      case "ACK2":						//申请帮助：["ACK1","帮助者","求助者"]
         if(jsonCOMMAND[1]==uname)				//jsonCOMMAND[1]不是自己，则表示是别人的求助，或者是帮助者的应答。
         {
             alert(jsonCOMMAND[2]+ " 已同意，赶紧过去看看吧。");
         }
         else
         {
             var h=document.getElementById("helplist");
             for(var n=1;n<h.children.length;n++)
             {
                let strName=h.children[n].innerHTML.split(" ");//XXX 正在寻求帮助
                if(strName[0]==jsonCOMMAND[2]) {h.removeChild(h.children[n]);break;}
             }
         }
         break;

      case "ACK3":						//申请帮助：["ACK1","帮助者","求助者"]
         if(jsonCOMMAND[1]==uname)				//jsonCOMMAND[1]不是自己，则表示是别人的求助，或者是帮助者的应答。
         {
             alert("很遗憾，"+jsonCOMMAND[2]+ " 拒绝了你的请求。");
         }
         break;

      case "ACK":						//受邀应答：["ACK","帮助者","求助者"]
         if(jsonCOMMAND[2]==uname)				//帮助者收到受邀应答，可以去帮忙了。
         {
            if(bHelped==false)				//当前处于无人帮助状态
            {
               if(confirm("你是否愿意让 "+jsonCOMMAND[1]+ " 来帮你？")==true)
               {
                  bHelped=true;				//先来先到，阻止其他人的帮助
                  strHelper=jsonCOMMAND[1];
                  content="[\"ACK2\",\""+jsonCOMMAND[1]+"\",\""+jsonCOMMAND[2]+"\"]";//帮助者如收到此指令，就可以出发了。
                  var msg = {'content': content, 'type': 'user'};
                  sendMsg(msg);
                  document.getElementById("check").style.display="none";
                  document.getElementById("check").checked=false;
                  document.getElementById("txt").innerHTML=jsonCOMMAND[1]+" 同学帮到你了么？";
                  document.getElementById("txt").style.left="0px";
                  document.getElementById("txt").onclick=function(){goodhelping(this);};
               }
               else
               {
                  strHelper=jsonCOMMAND[1];
                  content="[\"ACK3\",\""+jsonCOMMAND[1]+"\",\""+jsonCOMMAND[2]+"\"]";//拒绝对方的帮助请求。
                  var msg = {'content': content, 'type': 'user'};
                  sendMsg(msg);
               }

            }
         }
         break;


      case "NEWCHAR":						//是否允许添加角色：["NEWCHAR","1|0"]
         var d=new Date();
         if(jsonCOMMAND[1]=="1")
         {
            setJSCookie("CHAR",1,1);
            //document.cookie="CHAR=1; expires="+(d+3600);
            setNewControl();//./js/control.js
         }
         else
         {
            setJSCookie("CHAR",0,1);
            //document.cookie="CHAR=0; expires="+(d+3600);
            setNewControl();
         }
         break;

      case "NEWBD":						//是否允许添加舞台背景：["NEWBD","1|0"]

         if(jsonCOMMAND[1]=="1")
         {
            setJSCookie("BD",1,1);
            //document.cookie="BD=1";
            setNewControl();
         }
         else
         {
            setJSCookie("BD",0,1);
            //document.cookie="BD=0";
            setNewControl();
         }
         break;

      case "PROJECT":
         if(jsonCOMMAND[1]!="0")
         {
            oVMM.props.vm.downloadProjectId(jsonCOMMAND[1]);						//通过URL打开文件
            bCodeViewableFile = true;
            updateScreenMode();
            saveOnline(true);//执行一次保存

         }
         else
         {
            createNew();
            bCodeViewableFile = true;
            updateScreenMode();
         }
         break;

      case "BACKDROP":						//添加资源库中背景图片的指令：["BACKDROP","Arctic"]
         switch(jsonCOMMAND[1])
         {
         case "Arctic":
            var vmBackdrop = {name: "Arctic", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oVMM.props.vm.addBackdrop("67e0db3305b3c8bac3a363b1c428892e.png",vmBackdrop);//只有图片文件在./editor/static/asset/下才可正常访问。
            break;

         case "Race0":
            var vmBackdrop = {name: "RaceDrop0", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oVMM.props.vm.addBackdrop("9cede097207106da21dffe23c9df5697.png",vmBackdrop);
            break;

         case "Race1":
            var vmBackdrop = {name: "RaceDrop1", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oVMM.props.vm.addBackdrop("a1d8253c6ca4fd8444396e19cbe71f16.png",vmBackdrop);
            break;
         
         case "Race2":
            var vmBackdrop = {name: "RaceDrop2", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oVMM.props.vm.addBackdrop("0fc9051769c12f34562e0d04d611fb58.png",vmBackdrop);
            break;

         case "Race3":
            var vmBackdrop = {name: "RaceDrop3", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oVMM.props.vm.addBackdrop("0c340990dcb577abcaea44c3f7154922.png",vmBackdrop);
            break;

         case "Race4":
            var vmBackdrop = {name: "RaceDrop4", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oVMM.props.vm.addBackdrop("8f83c1427874dbbed970182f3bc7b364.png",vmBackdrop);
            break;

         }
         break;

      case "BACKDROP2":						//添加URL中图片为背景的指令：["BACKDROP","./fileurl"]
         $.get("./CM/addBackdrop.php?f="+jsonCOMMAND[1]+"&t=" + Math.random(), function (data)//获取文件URL
         {
            //var vmBackdrop = {name: "Arctic", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oVMM.props.vm.addBackdrop(jsonCOMMAND[1],$.parseJSON(data));
         });
         break;


      case "SPRITEX":						//他人共享过来的角色：["SPRITEX","Script File MD5"]
         if(jsonCOMMAND[3].length==32)
         {
            shareComing(jsonCOMMAND[1],jsonCOMMAND[2],jsonCOMMAND[3],jsonCOMMAND[4]);
         }
         break;

      case "SPRITE":						//添加资源库中角色的指令：["SPRITE","Amon"]
         switch(jsonCOMMAND[1])
         {
         case "Abby":
             Sprite="{\"name\":\"Abby\",\"tags\":[\"people\",\"person\",\"drawing\"],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"809d9b47347a6af2860e7a3a35bce057\",\"name\":\"abby-a\",\"bitmapResolution\":1,\"md5ext\":\"809d9b47347a6af2860e7a3a35bce057.svg\",\"dataFormat\":\"svg\",\"rotationCenterX\":31,\"rotationCenterY\":100},{\"assetId\":\"920f14335615fff9b8c55fccb8971984\",\"name\":\"abby-b\",\"bitmapResolution\":1,\"md5ext\":\"920f14335615fff9b8c55fccb8971984.svg\",\"dataFormat\":\"svg\",\"rotationCenterX\":31,\"rotationCenterY\":100},{\"assetId\":\"34a175600dc009a521eb46fdbbbeeb67\",\"name\":\"abby-c\",\"bitmapResolution\":1,\"md5ext\":\"34a175600dc009a521eb46fdbbbeeb67.svg\",\"dataFormat\":\"svg\",\"rotationCenterX\":32,\"rotationCenterY\":100},{\"assetId\":\"45de34b47a2ce22f6f5d28bb35a44ff5\",\"name\":\"abby-d\",\"bitmapResolution\":1,\"md5ext\":\"45de34b47a2ce22f6f5d28bb35a44ff5.svg\",\"dataFormat\":\"svg\",\"rotationCenterX\":32,\"rotationCenterY\":101}],\"sounds\":[{\"assetId\":\"83a9787d4cb6f3b7632b4ddfebf74367\",\"name\":\"pop\",\"dataFormat\":\"wav\",\"format\":\"\",\"rate\":44100,\"sampleCount\":1032,\"md5ext\":\"83a9787d4cb6f3b7632b4ddfebf74367.wav\"}],\"blocks\":{}}";
             break;

         case "Amon":
             Sprite="{\"name\":\"Amon\",\"tags\":[\"people\",\"dance\"],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"60f720956ab1840431dcf0616ce98f14\",\"name\":\"amon\",\"bitmapResolution\":2,\"md5ext\":\"60f720956ab1840431dcf0616ce98f14.png\",\"dataFormat\":\"png\",\"rotationCenterX\":174,\"rotationCenterY\":162}],\"sounds\":[{\"assetId\":\"83a9787d4cb6f3b7632b4ddfebf74367\",\"name\":\"pop\",\"dataFormat\":\"wav\",\"format\":\"\",\"rate\":44100,\"sampleCount\":1032,\"md5ext\":\"83a9787d4cb6f3b7632b4ddfebf74367.wav\"}],\"blocks\":{}}";
             break;

         case "Car1":
             Sprite = "{\"name\":\"Car\",\"tags\":[\"people\",\"drawing\"],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"48668e557594bc148a7d353fbd13878a\",\"name\":\"Car\",\"bitmapResolution\":1,\"md5ext\":\"48668e557594bc148a7d353fbd13878a.png\",\"dataFormat\":\"png\",\"rotationCenterX\":100,\"rotationCenterY\":50}],\"sounds\":[],\"blocks\":{}}";
             break;

         case "Car2":
             Sprite = "{\"name\":\"Car\",\"tags\":[\"people\",\"drawing\"],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"7d25141fd5d55013c14982eebf810e29\",\"name\":\"Car\",\"bitmapResolution\":1,\"md5ext\":\"7d25141fd5d55013c14982eebf810e29.png\",\"dataFormat\":\"png\",\"rotationCenterX\":100,\"rotationCenterY\":50}],\"sounds\":[],\"blocks\":{}}";
             break;
         }
         if(Sprite!=null)
            oVMM.props.vm.addSprite(Sprite);
            break;

      case "SPRITE2":						//添加URL中图片为角色的指令：["SPRITE2","/PICTURE_URL"]
         $.get("./CM/addSprite.php?f="+jsonCOMMAND[1]+"&t=" + Math.random(), function (data)//获取文件URL
         {
            oVMM.props.vm.addSprite(data);	
         });
         break;

      case "SHARETOC":
            loadPICKUP(1);
         break;

      case "SHARETOG":
            loadPICKUP(2);
         break;

      case "STHREMOVED":
            loadPICKUP(jsonCOMMAND[1]);
         break;

      case "MEMOCHANGED":
            loadPICKUP(jsonCOMMAND[1]);
         break;
      }
   }
}

function Quiz2(jsonDATA)//单选、多选窗口的控制
{
   if(jsonDATA.length>1)
   {
      if(jsonDATA[1][0]==0)						//单个选项，主要用于发出提示或提醒
      {
         document.getElementById("quiz").style.visibility="hidden";	//隐藏窗口 
      }
      else
      {
         var msg_buttons=document.getElementById("msg_keys");
         msg_buttons.innerHTML='';

         if(jsonDATA[1][0]==1)						//单个选项，主要用于发出提示或提醒
         {
              var button1 = document.createElement("input");
              button1.type="button";
              button1.value="确定";
              button1.style.width="50px";
              button1.style.height="30px";
              button1.style.marginLeft="20px";
              button1.onclick=function(){ checkAnswer('确定');}
              msg_buttons.appendChild(button1);
         }
         else								//正常显示A选项
         {
              var button1 = document.createElement("input");
              button1.type="button";
              button1.value="A";
              button1.style.width="40px";
              button1.style.height="30px";
              button1.style.marginLeft="20px";
              button1.onclick=function(){ checkAnswer('A');}
              msg_buttons.appendChild(button1);
         }

         if(jsonDATA[1][0]>1)						//有多个选项时，显示B选项
         {
              var button2 = document.createElement("input");
              button2.type="button";
              button2.value="B";
              button2.style.width="40px";
              button2.style.height="30px";
              button2.style.marginLeft="20px";
              button2.onclick=function(){ checkAnswer('B');}
              msg_buttons.appendChild(button2);
         }

         if(jsonDATA[1][0]>2)						//如果有第三个，则显示C选项
         {
              var button3 = document.createElement("input");
              button3.type="button";
              button3.value="C";
              button3.style.width="40px";
              button3.style.height="30px";
              button3.style.marginLeft="20px";
              button3.onclick=function(){ checkAnswer('C');}
              msg_buttons.appendChild(button3);
         }

         if(jsonDATA[1][0]>3)						//最多显示4个选项，其它的忽略。
         {
              var button4 = document.createElement("input");
              button4.type="button";
              button4.value="D";
              button4.style.width="40px";
              button4.style.height="30px";
              button4.style.marginLeft="20px";
              button4.onclick=function(){ checkAnswer('D');}
              msg_buttons.appendChild(button4);
         }
         document.getElementById("msg_text").innerHTML=jsonDATA[1][1];	//提示信息
      }
   }
}
//同组分享开关
var shareIntval=null;
function setSHARE(o)
{
   sharecontrol=o.checked==true?1:0;

   setJSCookie("SHARE",(o.checked==true?1:0),1);
   var msg = {'content': "[\"SHAREALLOWED\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
   sendMsg(msg);
   if(shareIntval==null)
   {
      shareIntval=setInterval(function(){
         var msg = {'content': "[\"SHAREALLOWED\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
         sendMsg(msg);
      }, 30000+Math.random()*20);
   }

   document.getElementById("sharemenu").style.display=(o.checked==true?"inline-block":"none");
   if(o.checked==false) hideShare();
   else
   {
      updateMenu();
   }
}
//互帮互助开关
var helpIntval=null;
function setHELP(o)
{
   helpcontrol=o.checked==true?1:0;

   setJSCookie("HELP",(o.checked==true?1:0),1);
   var msg = {'content': "[\"HELPALLOWED\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
   sendMsg(msg);
   if(helpIntval==null)
   {
      helpIntval=setInterval(function(){
         var msg = {'content': "[\"HELPALLOWED\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
         sendMsg(msg);
      }, 30000+Math.random()*20);
   }

   document.getElementById("helpmenu").style.display=(o.checked==true?"inline-block":"none");
   if(o.checked==false)
   {
      hideHelp();
   }
   else
   {
      updateMenu();
   }
}

//屏蔽操作区域开关
var bgIntval=null;
function setBG(o)
{
   setJSCookie("BG",(o.checked==true?1:0),1);
   var msg = {'content': "[\"FORCE\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
   sendMsg(msg);
   if(bgIntval==null)
   {
      bgIntval=setInterval(function(){
         var msg = {'content': "[\"FORCE\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
         sendMsg(msg);
      }, 30000+Math.random()*20);
   }
}

//屏蔽角色插入开关
var charIntval=null;
function setCHAR(o)
{
   bSelfShow=true;
   setJSCookie("CHAR",(o.checked==true?1:0),1);
   var msg = {'content': "[\"NEWCHAR\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
   sendMsg(msg);
   if(charIntval==null)
   {
      charIntval=setInterval(function(){
         var msg = {'content': "[\"NEWCHAR\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
         sendMsg(msg);
      }, 30000+Math.random()*20);
   }
}
//屏蔽背景插入开关

var bdIntval=null;
function setBD(o)
{
   bSelfShow=true;
   setJSCookie("BD",(o.checked==true?1:0),1);
   var msg = {'content': "[\"NEWBD\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
   sendMsg(msg);
   if(bdIntval==null)
   {
      bdIntval=setInterval(function(){
         var msg = {'content': "[\"NEWBD\",\""+(o.checked==true?1:0)+"\"]", 'type': 'user'};
         sendMsg(msg);
      }, 30000+Math.random()*20);
   }
}

//速问速答试题数据
var QuizData=Array(
   //"[\"QUIZ\",[\"选项数量\",\"标题<hr>题目征文<hr>1.选项1<br>2.选项2<br>3.选项3\"]]",

   "[\"QUIZ\",[\"4\",\"复习1：代码段作用<hr><div style='position: relative;'><img width=280px src='./quiz/car/s_car_header.png'></div><div style='position: fixed;top: 77px;left: 310px;width: 400px;'>左图这段代码，在赛车的整个程序中的作用为：<hr><br>A:初始化赛车的起始坐标。<p>B:初始化计时器的控制信号。<p>C:初始化赛车的朝向和大小。<p>D:以上都对。</div>\"]]",
   "[\"QUIZ\",[\"4\",\"复习2：计时器归零<hr><div style='position: relative;'><img width=141px src='./quiz/car/s_car.png'><br><img width=370px src='./quiz/car/s_car_start_timing.png'></div><div style='position: fixed;top: 77px;left: 390px;width: 320px;'>左下图的这段代码的作用是：<hr><br>A:在碰到蓝色时执行“计时器归零”操作。<p>B:在变量“开始”为0时执行“计时器归零”操作。<p>C:在碰到蓝色的那一刻，如果变量“开始”为0，则执行“计时器归零”操作，并设变量“开始”的值为1。<p>D:以上都对。</div>\"]]",
   "[\"QUIZ\",[\"4\",\"复习3：停止脚本<hr><div style='position: relative;'><img width=134px src='./quiz/car/s_car_stop1.png'><br><img width=280px src='./quiz/car/s_car_stop.png'></div><div style='position: fixed;top: 77px;left: 300px;width:400px;'>左下图这段代码的作用是：<hr><br>A:在碰到红色时，报时间，并停止当前角色的全部脚本。<p>B:在碰到红色时，报时间，并停止当前角色的当前脚本。<p>C:在碰到红色时，报时间，并停止所有角色的全部脚本。<p>D:以上都对。</div>\"]]",
   "[\"QUIZ\",[\"2\",\"复习4：转向1<hr><div style='position: relative;'><img width=141px src='./quiz/car/s_car.png'><div style='position: relative;'><div style='position: fixed;top: 77px;left: 250px;width:400px;'>下面哪图是当赛车左边跑出赛道时应执行的操作：<hr><br>A:<img width=280px src='./quiz/car/s_car_turn_right2.png'><p>B:<img width=280px src='./quiz/car/s_car_turn_right.png'></div>\"]]",
   "[\"QUIZ\",[\"2\",\"复习5：转向2<hr><div style='position: relative;'><img width=141px src='./quiz/car/s_car.png'><div style='position: relative;'><div style='position: fixed;top: 77px;left: 250px;width: 400px;'>下面哪图是当赛车右边跑出赛道时应执行的操作：<hr><br>A:<img width=280px src='./quiz/car/s_car_turn_left2.png'><p>B:<img width=280px src='./quiz/car/s_car_turn_left.png'></div>\"]]",
   "[\"QUIZ\",[\"4\",\"复习6：转向3<hr><div style='position: relative;'><img width=170px src='./quiz/car/s_car2.png'><div style='position: relative;'><div style='position: fixed;top: 77px;left: 200px;width:500px;'>下面哪图是正确的转向操作？：<hr><br>A:<img width=230px src='./quiz/car/s_car_turn_rightx.png'>B:<img width=230px src='./quiz/car/s_car_turn_leftx.png'><br>C:<img width=230px src='./quiz/car/s_car_turn_right2.png'>D:<img width=230px src='./quiz/car/s_car_turn_right.png'></div>\"]]",
   "[\"QUIZ\",[\"3\",\"复习7：转向4<hr><div style='position: relative;'><img width=290px src='./quiz/car/s_car_turn.png'></div><div style='position: fixed;top: 77px;left: 320px;width: 380px;'>给赛车加了这段代码后，车辆还是在拐弯处笔直地冲出了跑道，可能的原因是：<hr><br>A:四个颜色没有设置准确。<p>B:左右转向角度相同，又在瞬间前后发生，所以转向操作互相抵消了。<p>C:以上都对。</div>\"]]",

   //"[\"QUIZ\",[\"1\",\"=============一人一课：赛车游戏==============\"]]",


/*造型设计*/
/*
   "[\"QUIZ\",[\"3\",\"造型设计界面1<hr>什么时候会出现“删除”操作按钮？<hr>1.选择了“选择”或“变形”工具后。<br>2.选择了“橡皮擦”工具后。<br>3.选择了“画笔”工具后。\"]]",
   "[\"QUIZ\",[\"3\",\"造型设计界面2<hr>“填充”工具不能对下面哪个对象进行填充操作？<hr>1.被设置为透明的图形。<br>2.已经设定了某个颜色的图形。<br>3.透明的背景。\"]]",
   "[\"QUIZ\",[\"2\",\"造型设计界面3<hr>造型设计界面默认为：<hr>1.矢量图编辑模式。<br>2.位图编辑模式。\"]]",
   "[\"QUIZ\",[\"3\",\"造型设计界面4<hr>下面哪个说法是不正确的？<hr>1.在矢量图模式下制作的图，切换到位图模式后，可以继续绘制，也可局部删除。<br>2.在位图模式下制作的图，切换到矢量图模式后，可以继续修改，也可局部删除，只能整体删除。<br>3.从矢量图模式切换到位图模式，会造成图像质量的下降，最明显的表现就是图形边缘出现锯齿化。\"]]",
*/
/*顶部问题，下方四个图片选项一行横向的排列*/
/*
   "[\"QUIZ\",[\"1\",\"=============一人一课：点名==============\"]]",


   "[\"QUIZ\",[\"3\",\"任务一：五人点名<hr>1.添加五个人物角色，当绿旗被点击时，给每个角色设定坐标、大小和编号；<br>2.当接收到与自己编号相同的消息时，完成“出列、报数和入列”操作。<br>3.在舞台设置脚本，当绿旗被点击时，询问“你要召唤几号队员？”，并向全体队员发送广播指令“报数”。\"]]",


   "[\"QUIZ\",[\"3\",\"任务二：一人五角<hr>1.选定一个角色为本体，在它的造型中，添加其它四个角色的造型（共5个角色，每个角色各两个造型）；<br>2.修改本体中“当绿旗被点击”的脚本，实现本体与克隆体的横向排列；<br>3.修改“当接收到‘报数’”消息的代码，调整角色的造型显示策略（造型与编号相对应）。\"]]",


//   "[\"QUIZ\",[\"1\",\"任务三：裁员<hr>由于剧组经费不足，无法承担五位演员的盒饭，所以需要砍掉四个，让一位演员一人分饰五个角色。<p>提示：克隆。<p>完成之后，请点确定按钮。\"]]",


   "[\"QUIZ\",[\"1\",\"=============关于克隆==============\"]]",

   "[\"QUIZ\",[\"4\",\"克隆1<hr>关于克隆，如下叙述，哪个描述是错误的？<p>A:角色可以克隆自己，舞台不能克隆自己。<p>B:克隆操作只能在角色的脚本里执行，在舞台的脚本里不可以执行克隆操作。<p>C:在角色中，可以克隆自己，也可以克隆其它角色。<p>D:在舞台的脚本中，可以克隆其它角色。\"]]",
   "[\"QUIZ\",[\"4\",\"克隆2<hr>克隆操作执行后，会：<p>A:复制当前角色的脚本。<p>B:复制当前角色的变量。<p>C:复制当前角色的坐标。<p>D:以上都是。\"]]",
   "[\"QUIZ\",[\"2\",\"克隆3<hr>克隆操作执行后，本体如修改“仅适用于当前角色”的变量，则在克隆体内，该变量将<p>A:保持克隆前的数值不变。<p>B:随本体一起改变。\"]]",
*/
/*
   "[\"QUIZ\",[\"1\",\"=============关于基本操作==============\"]]",

   "[\"QUIZ\",[\"4\",\"表达1<hr><div style='position: fixed;top: 77px;left: 25px;width: 660px;'>有一个三位数，个位上为A，十位上为B，百位上为C，则这个数的十进制表达为：<hr>"+
	   		       "<div style='position: relative;'>A.&nbsp;<img src='/online2/s/30/4.png'></div>"+
			       "<div style='position: relative;'>B:&nbsp;<img src='/online2/s/30/3.png'></div>"+
			       "<div style='position: relative;'>C:&nbsp;<img src='/online2/s/30/2.png'></div>"+
			       "<div style='position: relative;'>D:&nbsp;<img src='/online2/s/30/1.png'></div>\"]]",

   "[\"QUIZ\",[\"4\",\"表达2<hr><div style='position: fixed;top: 77px;left: 25px;width: 660px;'>有一个三位数，个位上为A，十位上为B，百位上为C，每一位上的数各不相同。下面哪个表达是正确的：<hr>"+
	   		       "<div style='position: relative;'>A.&nbsp;<img src='/online2/s/31/1.png'></div>"+
			       "<div style='position: relative;'>B:&nbsp;<img src='/online2/s/31/3.png'></div>"+
			       "<div style='position: relative;'>C:&nbsp;<img src='/online2/s/31/2.png'></div>"+
			       "<div style='position: relative;'>D:&nbsp;<img src='/online2/s/31/4.png'></div>\"]]",
*/
/*左一个图片问题，右侧选项的排列*/
/*
   "[\"QUIZ\",[\"4\",\"循环1<hr><div style='position: relative;'><img width=250px src='/online2/s/32/1.png'></div><div style='position: fixed;top: 77px;left: 300px;width: 335px;'>当此段程序被执行后，变量“编”的值为：<hr><p>A:9<p>B:10<p>C:11<p>D:不确定</div>\"]]",
   "[\"QUIZ\",[\"2\",\"循环2<hr><div style='position: relative;'><img width=411px src='/online2/s/33/1.png'></div><div style='position: fixed;top: 77px;left: 430px;width: 280px;'>这两段代码：<hr><br>A:所用积木块一样多，所以效果一样。<p>B:由于自增位置不同，所以效果不同。</div>\"]]",
   "[\"QUIZ\",[\"2\",\"循环3<hr><div style='position: relative;'><img width=411px src='/online2/s/33/1.png'>"+
			"</div><div style='position: fixed;top: 77px;left: 430px;width: 280px;'>对于代码片段一，分析正确的是：<hr><br>A:变量“编”一进入第一个循环，就先自增1了，它在后续的循环中永不可能为“0”。<p>"+
																   "B:反正在循环中要自增的，晚增不如早增，所以放在这里很合适。</div>\"]]",
   "[\"QUIZ\",[\"2\",\"循环4<hr><div style='position: relative;'><img width=411px src='/online2/s/33/1.png'>"+
			"</div><div style='position: fixed;top: 77px;left: 430px;width: 280px;'>对于代码片段二，分析正确的是：<hr><br>A:变量“编”在第二个循环结束后，才自增1，使得在第二个循环里，“编”这个变量完整地走完了“0-10”这些数。<p>"+
																   "B:变量“编”在第二个循环结束后，才自增1，使得在第二个循环里，“编”这个变量完整地走完了“0-9”这些数。。</div>\"]]",

   "[\"QUIZ\",[\"1\",\"=========计算=================\"]]",


   "[\"QUIZ\",[\"4\",\"循环1<hr><div style='position: relative;'><img width=211px src='/online2/s/1/1.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当此段程序被执行后，变量“循环计数器”的值为：<hr><br>A:8<p>B:9<p>C:10<p>D:不确定</div>\"]]",
   "[\"QUIZ\",[\"4\",\"循环2<hr><div style='position: relative;'><img width=211px src='/online2/s/2/1.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当此段程序被执行后，变量“循环计数器”的值为：<hr><br>A:0<p>B:9<p>C:10<p>D:不确定</div>\"]]",
   "[\"QUIZ\",[\"4\",\"循环3<hr><div style='position: relative;'><img width=211px src='/online2/s/2/1.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当此段程序被执行后，变量“循环计算器”的值为：<hr><br>A:8<p>B:9<p>C:10<p>D:不确定</div>\"]]",
   "[\"QUIZ\",[\"4\",\"循环4<hr><div style='position: relative;'><img width=211px src='/online2/s/3/1.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当此段程序被执行后，变量“循环计算器”和“循环计数器”的值分别为：<hr><br>A:10,0<p>B:0,10<p>C:10,10<p>D:不确定</div>\"]]",
   "[\"QUIZ\",[\"4\",\"循环5<hr><div style='position: relative;'><img width=211px src='/online2/s/4/1.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当此段程序被执行后，变量“循环计算器”和“循环计数器”的值分别为：<hr><br>A:10,5<p>B:5,10<p>C:10,10<p>D:5,5</div>\"]]",

*/
/*顶部问题，下方四个图片选项两行横向的排列*/

/*
   "[\"QUIZ\",[\"4\",\"循环6<hr><div style='position: fixed;top: 77px;left: 25px;width: 660px;'>下面哪段代码可以准确地画出一个矩形？<hr>"+
	   		       "<div style='position: relative;'>A.<br><img src='/online2/s/5/1.png'></div>"+
			       "<div style='position: absolute;left: 170px;top: 43px;'>B:<br><img src='/online2/s/5/2.png'></div>"+
			       "<div style='position: absolute;left: 340px;top: 43px;'>C:<br><img src='/online2/s/5/3.png'></div>"+
			       "<div style='position: absolute;left: 510px;top: 43px;'>D:<br><img src='/online2/s/5/4.png'></div>\"]]",

   "[\"QUIZ\",[\"1\",\"===========循环==================\"]]",

   "[\"QUIZ\",[\"4\",\"判断1<hr><div style='position: fixed;top: 77px;left: 25px;width: 660px;'>下面哪段代码永远都赢不了？<hr>"+
	   		       "<div style='position: relative;'>A.<br><img src='/online2/s/12/1.png'></div>"+
			       "<div style='position: absolute;left: 320px;top: 40px;'>B:<br><img src='/online2/s/12/3.png'></div>"+
			       "<div style='position: absolute;left: 0px;top: 180px;'>C:<br><img src='/online2/s/12/2.png'></div>"+
			       "<div style='position: absolute;left: 320px;top: 180px;'>D:<br><img src='/online2/s/12/4.png'></div>\"]]",

   "[\"QUIZ\",[\"4\",\"判断2<hr><div style='position: fixed;top: 77px;left: 25px;width: 660px;'>下面哪段代码永远都能赢？<hr>"+
	   		       "<div style='position: relative;'>A.<br><img src='/online2/s/13/1.png'></div>"+
			       "<div style='position: absolute;left: 320px;top: 43px;'>B:<br><img src='/online2/s/13/2.png'></div>"+
			       "<div style='position: absolute;left: 0px;top: 170px;'>C:<br><img src='/online2/s/13/3.png'></div>"+
			       "<div style='position: absolute;left: 320px;top: 170px;'>D:<br><img src='/online2/s/13/4.png'></div>\"]]",


   "[\"QUIZ\",[\"1\",\"============逻辑判断===============\"]]",

   "[\"QUIZ\",[\"4\",\"拆分数字1<hr><div style='position: relative;'><img height=413px width=354px src='quiz/1.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当N1为1034，执行“按位逆拆分数1（N1）”后，“拆分后的数1”中的结果为：<hr><br>A:{1,0,3,4}<p>B:{4,3,0,1}<p>C:{1,3}<p>D:{3,1}</div>\"]]",
   "[\"QUIZ\",[\"4\",\"拆分数字2<hr><div style='position: relative;'><img height=413px width=354px  src='quiz/1.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当N1为1030，执行“按位逆拆分数1（N1）”后，<hr>A:最先被拆出来的是个位，放在列表最顶部。<br>B:最先被拆出来的是个位，放在列表最底部。<br>C:最先被拆出来的是千位，放在列表最顶部。<br>D:最先被拆出来的是千位，放在列表最底部。</div>\"]]",
   "[\"QUIZ\",[\"4\",\"拆分数字3<hr><div style='position: relative;'><img height=429px width=345px src='quiz/2.png'></div><div style='position: fixed;top: 77px;left:377px;width: 335px;'>当“拆分后的数2”中的值为“{1,2,4,3,5}”时，它会克隆几次？<hr>A:2次<p>B:3次<p>C:4次<p>D:5次</div>\"]]",
   "[\"QUIZ\",[\"4\",\"拆分数字4<hr><div style='position: relative;'><img height=429px width=345px  src='quiz/2.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当“拆分后的数2”中的值为“{1,4,3,5}”时，它第一个克隆的角色，显示的是哪个数字？<hr>A:1<p>B:4<p>C:3<p>D:5</div>\"]]",
   "[\"QUIZ\",[\"4\",\"拆分数字5<hr><div style='position: relative;'><img height=429px width=345px  src='quiz/2.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>当“拆分后的数2”中的值为“{1,4,3,5}”时，它第二个克隆的角色，显示的是哪一位？<hr>A:个位<p>B:十位<p>C:百位<p>D:千位</div>\"]]",
   "[\"QUIZ\",[\"4\",\"拆分数字6<hr><div style='position: relative;'><img height=429px width=345px  src='quiz/2.png'></div><div style='position: fixed;top: 77px;left: 377px;width: 335px;'>“位置2”是用来控制坐标的。该角色克隆的第三个角色，相对于本体，实际执行了如下移动操作：<hr>A:向左移动60<p>B:向右移动60<p>C:向左移动120<p>D:向左移动180</div>\"]]",
   "[\"QUIZ\",[\"1\",\"=============数字拆分==============\"]]",

   "[\"QUIZ\",[\"1\",\"任务一<hr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编写程序，让赛车从起点出发，在赛道上，自动行驶，一路向右，遇到终点线才停止。\"]]",
   "[\"QUIZ\",[\"1\",\"任务二<hr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;修改程序，让赛车从起点出发，在直角赛道上，自动行驶，遇到终点线才停止。\"]]",
   "[\"QUIZ\",[\"1\",\"任务三<hr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;尝试修改程序，让赛车从起点出发，在弧形赛道上，自动行驶，遇到终点线才停止。能成功么？\"]]",
   "[\"QUIZ\",[\"1\",\"任务四<hr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;改装车辆，给赛车安装左右两个传感器（需要设置为不同的颜色），并修改程序：将<img src=./res/car/touch1.png>改为<img src=./res/car/touch2.png>。注意转弯的方向：左边碰到要右转，右边碰到要左转。\"]]",
   "[\"QUIZ\",[\"1\",\"额外任务<hr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;改装车辆，或修改程序，让赛车以最短的时间，以及最安全的方式，冲向终点。\"]]",

   "[\"QUIZ\",[\"2\",\"两个“碰到”模块的前者<hr><img src=./res/car/touch1.png>与<img src=./res/car/touch2.png><br>A:前者可以判断当前角色的前部是否碰到了其它角色或背景上的指定颜色。<BR>B:前者可以判断当前角色的任何部位是否碰到了其它角色或背景上的指定颜色。\"]]",
   "[\"QUIZ\",[\"2\",\"两个“碰到”模块的后者<hr><img src=./res/car/touch1.png>与<img src=./res/car/touch2.png><br>A:后者可以判断当前角色的指定颜色的部位是否碰到了其它角色或背景上的指定颜色。<BR>B:后者可以判断当前角色的任何部位是否碰到了指定的颜色。\"]]",
   "[\"QUIZ\",[\"2\",\"两个“碰到”模块<hr><img src=./res/car/touch1.png>与<img src=./res/car/touch2.png><br>A:前者如使用得当，能判断角色的前后左右具体部位的碰撞事件。<BR>B:后者如使用得当，能判断角色的前后左右具体部位的碰撞事件。\"]]",
   "[\"QUIZ\",[\"3\",\"遇障碍后转弯<hr>前方遇到障碍，需要转弯时，我们应该：<BR>A:立刻180°大掉头。<BR>B:90°直角向右，永远正确。<BR>C:根据实际情况适度微调。\"]]",
   "[\"QUIZ\",[\"2\",\"前进步数问题<hr>每次重复执行循环中，前进步数有讲究：<BR>A:一开始就应该调成一个很大的值，一冲到底。<BR>B:一开始宜慢速启动，安全第一。\"]]",
   "[\"QUIZ\",[\"4\",\"车辆冲出跑道<hr>我的车冲出跑道了，<BR>A:单次循环内前进步数过大。<BR>B:遇到障碍时转弯角度过大。<BR>C:车头灯太小，碰撞识别不稳定。<BR>D:以上都对。\"]]",

   "[\"QUIZ\",[\"3\",\"今天的课<hr>今天的课，我感觉：<BR>A:完全没听懂。<BR>B:有点意思。<BR>C:很有趣。\"]]",
   "[\"QUIZ\",[\"1\",\"课后思考<hr>今天这节课所学的知识，在日常生活中，有没有可以适用的场景呢？\"]]",

*/
/*
   "[\"QUIZ\",[\"2\",\"太大了？？？？？<hr>角色的造型太大了，应该如何调整？<br>A:角色的造型太大，操作肯定在角色区附近，让我找找。<BR>B:我眼神不好，不找了。\"]]",
   "[\"QUIZ\",[\"2\",\"100？50？<hr>角色区的大小里的数值100表示什么意思？<BR>A:100%，原始大小。<BR>A:图片的长和宽都为100。\"]]",
   "[\"QUIZ\",[\"\",\"自动驾驶<hr>在执行时，不需要人进行额外的干预，程序会根据当前状况，按照预设的规则进行判断和处理。\"]]",
   "[\"QUIZ\",[\"2\",\"无路可走？<hr>如何判断前方直行方向无路可走了？<br>A:精确计算好从起点到车道尽头的距离，当实际行驶的路程达到这个距离的值时，转弯。<BR>B:用侦测里的“碰到颜色(A)？”来判断是否碰到了绿色。<BR>\"]]",
   "[\"QUIZ\",[\"2\",\"计时器<hr>计时器从打开Scratch程序，就已经开始工作了。我们可以用它来：<br>A:得到电脑当前的时间。<BR>B:得到当前程序已经运行的秒数。<BR>\"]]",
   "[\"QUIZ\",[\"2\",\"何时加？<hr>我们可以用计时器来记录车子从起点到终点一共花了多少时间。应该在哪里加“计时器归零”呢？<br>A:当绿旗被点击时立刻执行。<BR>B:碰到起点线时立刻执行<BR>C:为什么要归零？\"]]",
   "[\"QUIZ\",[\"3\",\"赛道小调查<hr>在这个新赛道里，你的车子跑丢了没？<br>A:没有，一切正常。<BR>B:跑出赛道了，但最后又跑回来了。<BR>C:跑出赛道，彻底失控了。\"]]",
   "[\"QUIZ\",[\"2\",\"复杂赛道<hr>这里有一个更复杂的赛道，你想挑战一下自己么？<br>A:算了，算了。<BR>B:来吧，来吧！\"]]",
   "[\"QUIZ\",[\"2\",\"满意么？<hr>车子一路上虽然磕磕绊绊，但最后还是到达了终点。对此，你满意么？<br>A:满意，好歹是到了终点了。<BR>B:不满意，我想改进一下。\"]]",
   "[\"QUIZ\",[\"2\",\"哪里不对？<hr>车子在某些地方会原处打转，你觉得在那个地方，它应该往哪个方向转会比较好？<br>A:右转。<BR>B:左转。\"]]",
   "[\"QUIZ\",[\"3\",\"关于左转<hr>该在何时控制车辆左转？<br>A:左边空时左转。<BR>B:右边没路时左转。<BR>C:以上都对。\"]]",
   "[\"QUIZ\",[\"2\",\"判断左右<hr>如何用侦测里的“颜色(A)碰到(B)？”来区分左右？<br>A:没区别。<BR>B:车头车灯处设置不同的颜色。\"]]",
   "[\"QUIZ\",[\"1\",\"急速前进<hr>尝试调整各类参数，使小车能以最快速度冲向终点。\"]]",
*/
);

var binited=false
function initMenuController()
{
   if(binited==true) return;
   binited=true;
   var s=document.getElementById("S");

   //s.removeAll();
   //var e=document.createElement("OPTION");
   //e.value="";
   //e.innerText="请选择试题";
   //s.appendChild(e);

   for(var i=0;i<QuizData.length;i++)
   {
      var j=$.parseJSON(QuizData[i]);
      var str=j[1][1].split("<hr>");
      var o=document.createElement("OPTION");
      o.value=(i+1);
      o.innerText=str[0];
      s.appendChild(o);
   }
}

function setQuiz(o)//预设的问题
{
   if(o.value>0)
   {
      document.getElementById("status").innerHTML='待发送';
      document.getElementById("msg_box").value=QuizData[o.value-1];
   }
}

function viewQuiz()//显示答题结果界面
{
   document.getElementById("msg_list").style.display="none";
   document.getElementById("msg_scorehistory").style.display="none";
   document.getElementById("msg_scorehistory").style.border="";
   document.getElementById("msg_score").style.display="block";
}

function viewLog()//显示系统日志界面
{
   document.getElementById("msg_list").style.display="block";
   document.getElementById("msg_scorehistory").style.display="block";
   document.getElementById("msg_scorehistory").style.border="1px solid gray;";
   document.getElementById("msg_score").style.display="none";
}

function viewArg(o)//参数显示
{
   if(o.value=="采集参数")
   {
      o.value="关闭采集"; 
      dataCollecting=true;
      //document.getElementById("msg_list").style.display="none";
      //document.getElementById("msg_scorehistory").style.display="none";
      //document.getElementById("msg_scorehistory").style.border="";
      document.getElementById("msg_argviewer").style.display="block";
      //document.getElementById("msg_argviewer").style.border="";
      //document.getElementById("msg_score").style.display="block";
   }
   else
   {
      o.value="采集参数";
      dataCollecting=false;
      //var msg = {'content': 'DATACOLLECTINGEND', 'type': 'user'};//定向发送给老师
      //sendMsg(msg);

      //document.getElementById("msg_list").style.display="block";
      //document.getElementById("msg_scorehistory").style.display="block";
      //document.getElementById("msg_scorehistory").style.border="";
      document.getElementById("msg_argviewer").style.display="none";
      //document.getElementById("msg_argviewer").style.border="";
      //document.getElementById("msg_score").style.display="block";
   }
}


function viewArg2(o)//参数显示
{
   if(o.value=="采集参数2")
   {
      o.value="关闭采集2"; 
      dataCollecting=true;
      document.getElementById("msg_argviewer2").style.display="block";
   }
   else
   {
      o.value="采集参数2";
      dataCollecting=false;
      document.getElementById("msg_argviewer2").style.display="none";
   }
}


function showAttachment(o)//推送显示隐藏的附件
{
   if(o.value!="")
   {
      add("[\"ATTACHMENT\",\""+o.value+"\"]");
      document.getElementById(o.value).style.visibility="visible";//本地同步显示
      setJSCookie(o.value,"true",1);
      //document.cookie=o.value+"=true";
      //hideAllMenu();
   }
}

var bSelfShow=false;
function insertSprite(o)//推送插入素材库中的角色
{
   if(o.value!=""){ 
      bSelfShow=true;
      add("[\"SPRITE\",\""+o.value+"\"]");
      hideRaceCostume();
   }
}

//给他人发送背景
function sendBackdrop(o)
{
   if(o.value!="")
   {
      bSelfShow=false;
      add("[\"BACKDROPX\",\""+uname+"\",\""+o.options[o.selectedIndex].text+"\",\""+o.value+"\"]");
   }
}

//给他人发送角色
function sendSprite(o)
{
   if(o.value!="")
   {
      bSelfShow=false;
      add("[\"SPRITEX\",\""+uname+"\",\""+o.options[o.selectedIndex].text+"\",\""+o.value+"\",\""+o.options[o.selectedIndex].getAttribute("img")+"\"]");
   }
}

function insertSprite2(o)//推送插入URL的图片
{
   if(o.value!=""){ 
      bSelfShow=true;
      add("[\"SPRITE2\",\""+o.value+"\"]");
   }
}

function insertBackdrop(o)//推送插入素材库中的背景
{
   if(o.value!=""){ 
      bSelfShow=true;
      add("[\"BACKDROP\",\""+o.value+"\"]");
      hideRaceStage();
   }
}

function remoteOpenProject(o)//推送项目
{
   if(o.value!="")
   {
      bSelfShow=true;
      if(o.value=="0")
         add("[\"PROJECT\",\"0\"]");
      else
         add("[\"PROJECT\",\"../data/preset/projects/"+o.value+"\"]");
   }
}

var bControl=false;
function showControlPanel()//显示/隐藏控制面板
{
   if(bControl==false) showControlP();
   else hideControlP();
   bControl!=bControl;
}

function hideControlP()//隐藏控制面板
{
   var m=document.getElementById("morectrl");
   //m.innerHTML="上课管理↓";
   m.parentElement.style.backgroundColor="hsla(215, 100%, 65%, 1)";
   document.getElementById("ControlPanel").style.visibility="hidden";
   bControl=false;
}

//var bSpriteListLoaded=false;
function showControlP()//显示控制面面板
{
   var m=document.getElementById("morectrl");
   //m.innerHTML="上课管理↑";

   document.getElementById("ControlPanel").style.visibility="visible";
   bControl=true;
   initMenuController();

   //if(!bSpriteListLoaded)
   //{
      getSprites("sprites");	//上课管理里的角色列表
      getBackdrops();		//上课管理里的舞台背景列表
   //}
   //getSprites("spritestoshare");

}




var bQuizshow=false;
var nQuziType=0;
var bHelpAllowed=false;
var bPlayer=false;

function showInvitation()
{
   reconnectPlay.lockreconnectPlay=false;
   if(!wsPlay)
   {
      //var strWebSocketPlayURL="ws://<?php echo $WSSERVER;?>:<?php echo (8090+$room);?>";		//同屏竞技
      initPlay(strWebSocketPlayURL,uname);
   }

   getSprites("spritestoshare");
   var o=document.getElementById("invitation");
   o.style.visibility="visible";

   var sprites=document.getElementById("spritestoshare");
   var spritetofight=document.getElementById("spritetofight");
   if(spritetofight.length>0) spritetofight.length=0;
   for(var i=0;i<sprites.length;i++)
   {
      if(i!=1)
         spritetofight.add(new Option(sprites[i].text,sprites[i].value));
   }


}

function hideInvitation()
{
   var o=document.getElementById("invitation");
   if(o!=undefined)
      o.style.visibility="hidden";
}

function choosetofight()
{
   var spritetofight=document.getElementById("spritetofight");
   if(spritetofight.options[spritetofight.selectedIndex].value!="")
   {
      if(confirm("你确定要指派“"+spritetofight.options[spritetofight.selectedIndex].text+"”参加比赛么？\r\n\r\n一旦选定，将无法更改。\r\n\r\n提交后，请耐心等待老师的下一步指令。")==1)
      {
         strInvited=spritetofight.options[spritetofight.selectedIndex].text;						//指定Scratch要上报坐标等参数的角色名。实际作用于scratch-gui.js
         hideInvitation();
/*
         //保存第一个角色造型
         var arrCostumes=oVMM.props.vm.runtime.targets[1].getCostumes();
         //此处需要调整，将图片等资源，跟数据共享一样处理：以文件的形式保存下来，且不用POST这种异步方式。//下一个处理位置，请去play.php页面查看：NP
         for(i=0;i<arrCostumes.length;i++)//保存所有的造型到服务器
         {
            $.post("./CM/saveSprite.php?t=" + Math.random(), { "S":arrCostumes[i].asset.encodeDataURI(),"N":arrCostumes[i].md5}, function (data) {});
         }
         //alert("您已受邀参加公开赛，请点击确定按钮后，停止一切操作，耐心等待比赛的开始。");
	 //向播放器注册当前用户
         var content="[\"NP\",\""+uname+
	  	          "\",["+oVMM.props.vm.runtime.targets[1].x+","+oVMM.props.vm.runtime.targets[1].y+","+oVMM.props.vm.runtime.targets[1].direction+","+oVMM.props.vm.runtime.targets[1].size+"],\""+
			  oVMM.props.vm.runtime.targets[1].getCurrentCostume().md5+"\"]";		//收到邀请后，注册信息。
*/

         
         var content="[\"NP\",\""+uname+"\",0,\""+spritetofight.options[spritetofight.selectedIndex].value+"\"]";
         var msg = {'content':content, 'type': 'user', 'to':'Stage'};		//定向发送给Stage
         sendMsgPlay(msg);
      }
   }
}




function dealCommand(jsonCOMMAND)//接收到广播数据后，判断该执行什么操作。
{
   if(jsonCOMMAND.length>0)
   {
      var Sprite=null;
      switch(jsonCOMMAND[0])
      {

      case "MSG":
            newInfo(jsonCOMMAND[1]+'||'+jsonCOMMAND[2],false);

         break;

      case "GROUP"://收到分组控制指令
         if(jsonCOMMAND[1]==0)//关闭分组
         {
            bGroup=false;
            hideShare();

         }//刷新文件列表
         else
         {
            bGroup=true;
            newInfo("老师刚调整了部分小组的成员名单。");
            if(document.getElementById("sharemenu").style.visibility=="visible")      
               showShare();
         }
         loadFolder(classid);
         nCurrentGroup=jsonCOMMAND[1];
         setJSCookie("GROUP",nCurrentGroup,1);
         //document.cookie="GROUP="+nCurrentGroup;
         updateGroupMember(nCurrentGroup);
         break;

      case "INVITATION"://邀请加入投屏。Chrome浏览器不用确认alert，Edge必须确认后才表示邀请成功。
         //bInvited=true;							//已被邀请，可以在control.js:updateNP()里向Stage发送数据了。
         oVMM.props.vm.runtime.stopAll();

         showInvitation();
         break;

      case "GREENFLAG"://远程激发绿旗点击事件
         hideInvitation();
         oVMM.props.vm.setCompatibilityMode(true);		//true:兼容模式，每秒30帧；false:非兼容模式，每秒60帧。
         oVMM.props.vm.setTurboMode(false);			//true:加速模式；false:正常模式。
         oVMM.props.vm.runtime.greenFlag();
         bREPORTING=true;
         break;

      case "STOPALL"://关闭投屏
         oVMM.props.vm.runtime.stopAll();
         bREPORTING=false;
         //bInvited=false;
         strInvited="";
         reconnectPlay.lockreconnectPlay=false;
         wsPlay=null;


         break;

      case "SETBGCOLOR":						//远程控制小白板背景色
         document.getElementById('WB').style.background=jsonCOMMAND[1];
         break;

      case "BDUPDATED":						//强制更新学生端小白板数据
         updateBOARD();
         break;


      case "LATEST"://显示上一个版本
         cancelit();
         break;

      case "PROJECT":
         if(jsonCOMMAND[1]!="0")
         {
            if(jsonCOMMAND[1].indexOf("_NOSHOW_")==0) return ;		//_NOWSHOW_：学生端无动作

            oVMM.props.vm.downloadProjectId(jsonCOMMAND[1]);		//通过URL打开文件
            if(jsonCOMMAND[1].indexOf("_EDITABLE_")===0)		//_EDITABLE_:学生端可编辑。否则只能播放。
               bCodeViewableFile = true;
            else
               bCodeViewableFile = false;
            updateScreenMode();						//文档打开后，更新界面控制。
         }
         else								//新建文档
         {
            createNew("0");
            bCodeViewableFile = true;
            updateScreenMode();
         }
         break;
      case "BACKDROP":						//添加资源库中背景图片的指令：["BACKDROP","Arctic"]
         switch(jsonCOMMAND[1])
         {
         case "Arctic":
            var vmBackdrop = {name: "Arctic", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oVMM.props.vm.addBackdrop("67e0db3305b3c8bac3a363b1c428892e.png",vmBackdrop);//只有图片文件在./editor/static/asset/下才可正常访问。
            break;

         case "Race0":
            var vmBackdrop = {name: "RaceDrop0", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oVMM.props.vm.addBackdrop("9cede097207106da21dffe23c9df5697.png",vmBackdrop);
            break;

         case "Race1":
            var vmBackdrop = {name: "RaceDrop1", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oVMM.props.vm.addBackdrop("a1d8253c6ca4fd8444396e19cbe71f16.png",vmBackdrop);
            break;
         
         //case "Race2":
         //   var vmBackdrop = {name: "RaceDrop2", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
         //   oVMM.props.vm.addBackdrop("fc4bbac80c039a906ddb98f35738aef3.png",vmBackdrop);
         //   break;

         case "Race2":
            var vmBackdrop = {name: "RaceDrop3", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oVMM.props.vm.addBackdrop("0fc9051769c12f34562e0d04d611fb58.png",vmBackdrop);
            break;

         case "Race3":
            var vmBackdrop = {name: "RaceDrop4", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oVMM.props.vm.addBackdrop("0c340990dcb577abcaea44c3f7154922.png",vmBackdrop);
            break;
         
         case "Race4":
            var vmBackdrop = {name: "RaceDrop5", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oVMM.props.vm.addBackdrop("8f83c1427874dbbed970182f3bc7b364.png",vmBackdrop);
            break;
         }
         break;

      case "BACKDROP2":						//添加URL中图片为背景的指令：["BACKDROP","./fileurl"]
         $.get("./CM/addBackdrop.php?f="+jsonCOMMAND[1]+"&t=" + Math.random(), function (data)//获取文件URL
         {
            //var vmBackdrop = {name: "Arctic", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
            oVMM.props.vm.addBackdrop(jsonCOMMAND[1],$.parseJSON(data));
         });
         break;

      case "BACKDROPX":						//他人共享过来的角色：["SPRITEX","Script File MD5"]
         if(jsonCOMMAND[3].length==32)
         {
            $.post("./CM/loadScript.php?t=" + Math.random(), { "S":jsonCOMMAND[3] }, (function(o){ return function(data){ //共享数据保存在文件中。
               var jsondata=JSON.parse(data); 

               if(JSON.stringify(jsondata)=="{}") return;

               for(i=0;i<jsondata.costumes.length;i++){			//接收分享过来的舞台背景数据
                  dCostume=jsondata.costumes[i];

                  if(jsondata.costumes[i].asset.data.type==undefined)//矢量图
                  {
                     var dkeys=Object.keys(jsondata.costumes[i].asset.data);

                     var dataArray=new Uint8Array(dkeys.length);
                     for(var x=0;x<dkeys.length;x++)				//将Array数据，装入Uint8Array
                     {
                        dataArray[x]=jsondata.costumes[i].asset.data[dkeys[x]];
                     }

	
                     var asset= new oVMM.props.vm.runtime.storage.Asset(		//构建Asset对象
                        jsondata.costumes[i].asset.assetType,
                        jsondata.costumes[i].asset.assetId,
                        jsondata.costumes[i].asset.dataFormat,
                        dataArray,							//舞台背景强制Uint8Array，角色无所谓。
                        []
                     );
                     dCostume.asset=asset;
                     dCostume.assetId=asset.assetId;				//ID最好也改一下，防止跟当前资源冲突。
                     dCostume.md5=asset.assetId+"."+asset.dataFormat;
                  }
                  else if((typeof jsondata.costumes[i].asset.data.data) == 'object')//非矢量图
                  {
                     var dkeys=Object.keys(jsondata.costumes[i].asset.data.data);

                     var dataArray=new Uint8Array(dkeys.length);
                     for(var x=0;x<dkeys.length;x++)				//将Array数据，装入Uint8Array
                     {
                        dataArray[x]=jsondata.costumes[i].asset.data.data[dkeys[x]];
                     }

	
                     var asset= new oVMM.props.vm.runtime.storage.Asset(		//构建Asset对象
                        jsondata.costumes[i].asset.assetType,
                        jsondata.costumes[i].asset.assetId,
                        jsondata.costumes[i].asset.dataFormat,
                        dataArray,							//舞台背景强制Uint8Array，角色无所谓。
                        []
                     );
                     dCostume.asset=asset;
                     dCostume.assetId=asset.assetId;				//ID最好也改一下，防止跟当前资源冲突。
                     dCostume.md5=asset.assetId+"."+asset.dataFormat;
                  }

                  if(jsonCOMMAND[2]==dCostume.name)
                  {
                     dCostume.name=jsonCOMMAND[1]+"的"+jsonCOMMAND[2];
                     oVMM.props.vm.addBackdrop(dCostume.md5,dCostume);		//执行背景添加操作（暂只能添加造型）
                  }
               }
            }(o);}));


         }
         break;

      case "SPRITEX":						//他人共享过来的角色：["SPRITEX","Script File MD5"]
         if(jsonCOMMAND[3].length==32)
         {
            shareComing(jsonCOMMAND[1],jsonCOMMAND[2],jsonCOMMAND[3],jsonCOMMAND[4]);
            newInfo("有人给你分享了一份数据。");
         }
         break;

      case "SPRITE":						//添加资源库中角色的指令：["SPRITE","Amon"]
         switch(jsonCOMMAND[1])
         {
         case "Abby":
             Sprite="{\"name\":\"Abby\",\"tags\":[\"people\",\"person\",\"drawing\"],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"809d9b47347a6af2860e7a3a35bce057\",\"name\":\"abby-a\",\"bitmapResolution\":1,\"md5ext\":\"809d9b47347a6af2860e7a3a35bce057.svg\",\"dataFormat\":\"svg\",\"rotationCenterX\":31,\"rotationCenterY\":100},{\"assetId\":\"920f14335615fff9b8c55fccb8971984\",\"name\":\"abby-b\",\"bitmapResolution\":1,\"md5ext\":\"920f14335615fff9b8c55fccb8971984.svg\",\"dataFormat\":\"svg\",\"rotationCenterX\":31,\"rotationCenterY\":100},{\"assetId\":\"34a175600dc009a521eb46fdbbbeeb67\",\"name\":\"abby-c\",\"bitmapResolution\":1,\"md5ext\":\"34a175600dc009a521eb46fdbbbeeb67.svg\",\"dataFormat\":\"svg\",\"rotationCenterX\":32,\"rotationCenterY\":100},{\"assetId\":\"45de34b47a2ce22f6f5d28bb35a44ff5\",\"name\":\"abby-d\",\"bitmapResolution\":1,\"md5ext\":\"45de34b47a2ce22f6f5d28bb35a44ff5.svg\",\"dataFormat\":\"svg\",\"rotationCenterX\":32,\"rotationCenterY\":101}],\"sounds\":[{\"assetId\":\"83a9787d4cb6f3b7632b4ddfebf74367\",\"name\":\"pop\",\"dataFormat\":\"wav\",\"format\":\"\",\"rate\":44100,\"sampleCount\":1032,\"md5ext\":\"83a9787d4cb6f3b7632b4ddfebf74367.wav\"}],\"blocks\":{}}";
             break;

         case "Amon":
             Sprite="{\"name\":\"Amon\",\"tags\":[\"people\",\"dance\"],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"60f720956ab1840431dcf0616ce98f14\",\"name\":\"amon\",\"bitmapResolution\":2,\"md5ext\":\"60f720956ab1840431dcf0616ce98f14.png\",\"dataFormat\":\"png\",\"rotationCenterX\":174,\"rotationCenterY\":162}],\"sounds\":[{\"assetId\":\"83a9787d4cb6f3b7632b4ddfebf74367\",\"name\":\"pop\",\"dataFormat\":\"wav\",\"format\":\"\",\"rate\":44100,\"sampleCount\":1032,\"md5ext\":\"83a9787d4cb6f3b7632b4ddfebf74367.wav\"}],\"blocks\":{}}";
             break;

         case "Car1":
             Sprite = "{\"name\":\"Car\",\"tags\":[\"people\",\"drawing\"],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"48668e557594bc148a7d353fbd13878a\",\"name\":\"Car\",\"bitmapResolution\":1,\"md5ext\":\"48668e557594bc148a7d353fbd13878a.png\",\"dataFormat\":\"png\",\"rotationCenterX\":100,\"rotationCenterY\":50}],\"sounds\":[],\"blocks\":{}}";
             break;

         case "Car2":
             Sprite = "{\"name\":\"Car\",\"tags\":[\"people\",\"drawing\"],\"isStage\":false,\"variables\":{},\"costumes\":[{\"assetId\":\"7d25141fd5d55013c14982eebf810e29\",\"name\":\"Car\",\"bitmapResolution\":1,\"md5ext\":\"7d25141fd5d55013c14982eebf810e29.png\",\"dataFormat\":\"png\",\"rotationCenterX\":100,\"rotationCenterY\":50}],\"sounds\":[],\"blocks\":{}}";
             break;
         }
         if(Sprite!=null)
            oVMM.props.vm.addSprite(Sprite);
            break;

      case "SPRITE2":						//添加URL中图片为角色的指令：["SPRITE2","/PICTURE_URL"]
         $.get("./CM/addSprite.php?f="+jsonCOMMAND[1]+"&t=" + Math.random(), function (data)//获取文件URL
         {
            oVMM.props.vm.addSprite(data);	
         });
         break;

      case "ATTACHMENT":					//显示被隐藏的附件的指令：["ATTACHMENT","ATTACHMENT_ID"]
         //hideAllMenu();
         if(document.getElementById(jsonCOMMAND[1]).style.visibility!="visible")
         {
            setJSCookie(jsonCOMMAND[1],"true",1);
            //document.cookie=jsonCOMMAND[1]+"=true";
            //alert("有新附件来了。");
            //document.getElementById("NEWMESSAGE").innerHTML="任务里来<br>新附件了。";
            document.getElementById("moretask").innerHTML="任务<font color=red>*</font>";
         }
         document.getElementById(jsonCOMMAND[1]).style.visibility="visible";
         break;

      case "MENU":						//隐藏所有菜单，只开启任务窗口的指令：["MENU",0]
         hideAllMenu();
         break;

      case "QUIZ":						//速问速答指令：["QUIZ","[\"TYPE\"],[\"DATA\"],[\"CHOOSE\"],[\"KEY\"]"]
         Quiz(jsonCOMMAND[1]);
         break;

      case "FORCE":						//强制开启背景：["FORCE","1|0"]
         if(jsonCOMMAND[1]=="1")
         {
            bHelpAllowed=true;
            setJSCookie("BG",1,1);
            //document.cookie="BG=1";
            document.getElementById("waiting").style.visibility="visible";
            document.getElementById("waiting").style.zIndex="1000";
            hideAll();
         }
         else
         {
            bHelpAllowed=false;
            if(bHelped==true)//正在被帮助
            {
               alert("互助功能已经关闭，请尽快完成当前帮助操作。");
            }
            else
            {
               setJSCookie("BG",0,1);
               //document.cookie="BG=0";
               document.getElementById("waiting").style.visibility="hidden";
               document.getElementById("waiting").style.zIndex="990";
            }
         }
         break;

      case "NEWCHAR":						//是否允许添加角色：["NEWCHAR","1|0"]
         if(jsonCOMMAND[1]=="1")
         {
            setJSCookie("CHAR",1,1);
            //document.cookie="CHAR=1";
            setNewControl();//./js/control.js
            if(bInfoStatus[0]==false)
            {
               bInfoStatus[0]=true;
               newInfo("新建角色操作已开启。");
            }
         }
         else
         {
            setJSCookie("CHAR",0,1);
            //document.cookie="CHAR=0";
            setNewControl();
            if(bInfoStatus[0]==true)
            {
               bInfoStatus[0]=false;
               newInfo("新建角色操作已关闭。");
            }
         }
         break;

      case "NEWBD":						//是否允许添加舞台背景：["NEWBD","1|0"]

         if(jsonCOMMAND[1]=="1")
         {
            setJSCookie("BD",1,1);
            //document.cookie="BD=1";
            setNewControl();
            if(bInfoStatus[1]==false)
            {
               bInfoStatus[1]=true;
               newInfo("新建背景操作已开启。");
            }
         }
         else
         {
            setJSCookie("BD",0,1);
            //document.cookie="BD=0";
            setNewControl();
            if(bInfoStatus[1]==true)
            {
               bInfoStatus[1]=false;
               newInfo("新建背景操作已关闭。");
            }
         }
         break;

      case "HELPALLOWED":					//允许互帮互助：["FORCE","1|0"]
         if(jsonCOMMAND[1]=="1")
         {
            helpcontrol=1;
            setJSCookie("HELP",1,1);
            //document.cookie="HELP=1";
            document.getElementById("helpmenu").style.display="inline-block";
            if(bInfoStatus[2]==false)
            {
               bInfoStatus[2]=true;
               newInfo("互帮互助已开启。");
            }
         }
         else
         {
            helpcontrol=0;
            setJSCookie("HELP",0,1);
            //document.cookie="HELP=0";
            document.getElementById("helpmenu").style.display="none";
            hideHelp();
            if(bInfoStatus[2]==true)
            {
               bInfoStatus[2]=false;
               newInfo("互帮互助已关闭。");
            }
         }
         updateMenu();
         break;

      case "SHAREALLOWED":					//允许互帮互助：["FORCE","1|0"]
         if(jsonCOMMAND[1]=="1")
         {
            sharecontrol=1;
            setJSCookie("SHARE",1,1);
            //document.cookie="SHARE=1";
            document.getElementById("sharemenu").style.display="inline-block";
            if(bInfoStatus[3]==false)
            {
               bInfoStatus[3]=true;
               newInfo("同组分享已开启。");
            }
         }
         else
         {
            sharecontrol=0;
            setJSCookie("SHARE",0,1);
            //document.cookie="SHARE=0";
            document.getElementById("sharemenu").style.display="none";
            hideShare();
            if(bInfoStatus[3]==true)
            {
               bInfoStatus[3]=false;
               newInfo("同组分享已关闭。");
            }
         }
         updateMenu();
         break;

      case "ACK2":						//申请帮助：["ACK1","帮助者","求助者"]
         if(jsonCOMMAND[1]==uname)				//jsonCOMMAND[1]不是自己，则表示是别人的求助，或者是帮助者的应答。
         {
             alert(jsonCOMMAND[2]+ " 已同意，赶紧过去看看吧。");
         }
         else
         {
             var h=document.getElementById("helplist");
             for(var n=1;n<h.children.length;n++)
             {
                let strName=h.children[n].innerHTML.split(" ");//XXX 正在寻求帮助
                if(strName[0]==jsonCOMMAND[2]) {h.removeChild(h.children[n]);break;}
             }
         }
         break;

      case "ACK3":						//申请帮助：["ACK1","帮助者","求助者"]
         if(jsonCOMMAND[1]==uname)				//jsonCOMMAND[1]不是自己，则表示是别人的求助，或者是帮助者的应答。
         {
             alert("很遗憾，"+jsonCOMMAND[2]+ " 拒绝了你的请求。");
         }
         else
         {
             var h=document.getElementById("helplist");
             for(var n=1;n<h.children.length;n++)
             {
                let strName=h.children[n].innerHTML.split(" ");//XXX 正在寻求帮助
                if(strName[0]==jsonCOMMAND[2]) {h.removeChild(h.children[n]);break;}
             }
         }
         break;

      case "ACK":						//受邀应答：["ACK","帮助者","求助者"]
         if(jsonCOMMAND[2]==uname)				//帮助者收到受邀应答，可以去帮忙了。
         {
            if(bHelped==false)				//当前处于无人帮助状态
            {
               if(confirm("你是否愿意让 "+jsonCOMMAND[1]+ " 来帮你？")==true)
               {
                  bHelped=true;				//先来先到，阻止其他人的帮助
                  strHelper=jsonCOMMAND[1];
                  content="[\"ACK2\",\""+jsonCOMMAND[1]+"\",\""+jsonCOMMAND[2]+"\"]";//帮助者如收到此指令，就可以出发了。
                  var msg = {'content': content, 'type': 'user'};
                  sendMsg(msg);
                  document.getElementById("check").style.display="none";
                  document.getElementById("check").checked=false;
                  document.getElementById("txt").innerHTML=jsonCOMMAND[1]+" 同学帮到你了么？";
                  document.getElementById("txt").style.left="0px";
                  document.getElementById("txt").onclick=function(){goodhelping(this);};
               }
               else
               {
                  strHelper=jsonCOMMAND[1];
                  content="[\"ACK3\",\""+jsonCOMMAND[1]+"\",\""+jsonCOMMAND[2]+"\"]";//帮助者如收到此指令，就可以出发了。
                  var msg = {'content': content, 'type': 'user'};
                  sendMsg(msg);
               }

            }
         }
         break;

      case "SHARETOC":
            loadPICKUP(1);
         break;

      case "SHARETOG":
            loadPICKUP(2);
         break;

      case "STHREMOVED":
            loadPICKUP(jsonCOMMAND[1]);
         break;

      case "MEMOCHANGED":
            loadPICKUP(jsonCOMMAND[1]);
         break;

      case "DATACOLLECTINGBEGIN":
            bREPORTING=true;
         break;

      case "DATACOLLECTINGEND":
            bREPORTING=false;
         break;

      case "SAVESNAPSHOT":
            setJSCookie("CSS",1,1);
            oVMM.props.vm.renderer.requestSnapshot();
         break;

      case "SAVEFILE":
         saveOnline(true);
         //alert("吴老师刚来执行了远程收作业操作。\r\n\r\n如果你的任务还没完成，可以继续修改。修改后，请手动点击“文件”菜单中的“上传文件到服务器”按钮。");
         newInfo("老师刚执行了远程收作业操作。如果你的任务还没完成，请在完成后再执行一次作业上交操作。",false);
         break;
      case "HELP":						//1.求助指令：["HELP","求助者"] 	2.帮助指令：["HELP","帮助者","求助者"]
/*
HELP,求助者	
求助者：鼠标点击主动发出
其他人：被动接收，菜单添加

HELP，求助者，求助者
求助者：鼠标点击主动发出
帮助者：忽略
其他人：删除求助者的菜单

ACK1，帮助者，求助者
帮助者：鼠标点击主动发出
求助者：弹窗确认是否接受帮助
       接受帮助，则发送ACK指令
其他人：忽略

ACK2，帮助者，求助者
帮助者：弹窗，提醒去帮忙
求助者：对方正在赶来
其他人：删除求助者的菜单
*/
         if(jsonCOMMAND[1]!=uname)				//jsonCOMMAND[1]不是自己，则表示是别人的求助，或者是帮助者的应答。
         {
            if(jsonCOMMAND[2]==undefined)			//如第三个参数未定义，则此条是求助信息。
            {
               helpneeded(jsonCOMMAND[1]);
            }
            else						//否则就是帮助者的应答
            {
               if(jsonCOMMAND[1]==jsonCOMMAND[2])		//否则，表示跟自己无关，但需要从列表中删除求助者信息，因为有人去帮忙了。
               {
                  var h=document.getElementById("helplist");
                  for(var n=1;n<h.children.length;n++)
                  {
                     let strName=h.children[n].innerHTML.split(" ");//XXX 正在寻求帮助
                     if(strName[0]==jsonCOMMAND[2]) 
                     {
                        h.removeChild(h.children[n]);
                        break;
                     }
                  }
                  if(h.children.length==1) 
                        document.getElementById("moretohelp").innerHTML="互帮互助"+((bHelp==false)?"↓":"↑");
               }
            }
         }
         break;
      }
   }
}

function loadBG(n)
{
   switch(n)
   {
   case "1":
      var vmBackdrop = {name: "RaceDrop1", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
      oVMM.props.vm.addBackdrop("a1d8253c6ca4fd8444396e19cbe71f16.png",vmBackdrop);
      break;
        
   case "2":
      var vmBackdrop = {name: "RaceDrop2", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
      oVMM.props.vm.addBackdrop("0fc9051769c12f34562e0d04d611fb58.png",vmBackdrop);
      break;

   case "3":
      var vmBackdrop = {name: "RaceDrop4", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
      oVMM.props.vm.addBackdrop("0c340990dcb577abcaea44c3f7154922.png",vmBackdrop);
      break;
         
   case "4":
      var vmBackdrop = {name: "RaceDrop5", rotationCenterX: 480,rotationCenterY: 360, bitmapResolution: 2, skinId: null};
      oVMM.props.vm.addBackdrop("8f83c1427874dbbed970182f3bc7b364.png",vmBackdrop);
      break;

   case "g":
      oVMM.props.vm.downloadProjectId("bean_eater.SB3");
      bCodeViewableFile = false;
      updateScreenMode();
      break;

   case "x":
      oVMM.props.vm.downloadProjectId("_EDITABLE_start.sb3");
      break;
   }
}

function Quiz(jsonDATA)//单选、多选窗口的控制
{
   if(jsonDATA.length>1)
   {
      if(jsonDATA[0]==='0')						//单个选项，主要用于发出提示或提醒
      {
         document.getElementById("quiz").style.visibility="hidden";	//隐藏窗口 
      }
      else  if(jsonDATA[0]==='')						//单个选项，主要用于发出提示或提醒
      {
         var msg_buttons=document.getElementById("msg_keys");
         msg_buttons.innerHTML='';
         document.getElementById("msg_text").innerHTML=jsonDATA[1];	//提示信息
         document.getElementById("quiz").style.visibility="visible";	//隐藏窗口 
      }
      else
      {
         var msg_buttons=document.getElementById("msg_keys");
         msg_buttons.innerHTML='';

         if(jsonDATA[0]==1)						//单个选项，主要用于发出提示或提醒
         {
              resizeQuiz(1);
              var button1 = document.createElement("input");
              button1.type="button";
              button1.value="确定";
              button1.style.width="50px";
              button1.style.height="30px";
              button1.style.marginLeft="20px";
              button1.onclick=function(){ Answer('确定');}
              msg_buttons.appendChild(button1);
         }
         else								//正常显示A选项
         {
              resizeQuiz(0);
              var button1 = document.createElement("input");
              button1.type="button";
              button1.value="A";
              button1.style.width="40px";
              button1.style.height="30px";
              button1.style.marginLeft="20px";
              button1.onclick=function(){ Answer('A');}
              msg_buttons.appendChild(button1);
         }

         if(jsonDATA[0]>1)						//有多个选项时，显示B选项
         {
              resizeQuiz(0);
              var button2 = document.createElement("input");
              button2.type="button";
              button2.value="B";
              button2.style.width="40px";
              button2.style.height="30px";
              button2.style.marginLeft="20px";
              button2.onclick=function(){ Answer('B');}
              msg_buttons.appendChild(button2);
         }

         if(jsonDATA[0]>2)						//如果有第三个，则显示C选项
         {
              resizeQuiz(0);
              var button3 = document.createElement("input");
              button3.type="button";
              button3.value="C";
              button3.style.width="40px";
              button3.style.height="30px";
              button3.style.marginLeft="20px";
              button3.onclick=function(){ Answer('C');}
              msg_buttons.appendChild(button3);
         }

         if(jsonDATA[0]>3)						//最多显示4个选项，其它的忽略。
         {
              resizeQuiz(0);
              var button4 = document.createElement("input");
              button4.type="button";
              button4.value="D";
              button4.style.width="40px";
              button4.style.height="30px";
              button4.style.marginLeft="20px";
              button4.onclick=function(){ Answer('D');}
              msg_buttons.appendChild(button4);
         }
         document.getElementById("msg_text").innerHTML=jsonDATA[1];	//提示信息
         document.getElementById("quiz").style.visibility="visible";	//显示窗口
      }
   }
}

function resizeQuiz(bType)
{
   if(bType==1)
   {
      $("#quiz")[0].style.width="402px";
      $("#quiz")[0].style.height="300px";//整框

      $("#quizinfo").children()[0].style.width="400px";//quizinfo下第一个div
      $("#quizinfo").children()[0].style.height="300px";//quizinfo下第一个div

      $("#quizinfo").children(0).children(0)[0].style.width="400px";//整框
      $("#quizinfo").children(0).children(0)[0].style.height="300px";//整框

      //速问速答
      $("#quizinfo").children().children().children(0).children()[1].style.width="400px";//宽度
      $("#quizinfo").children().children().children(0).children()[1].style.height="30px";//高度

      $("#quizinfo").children().children().children(1)[1].style.width="382px";//msg frame
      $("#quizinfo").children().children().children(1)[1].style.height="210px";//msg frame

      //$("#quizinfo").children().children().children(0).children()[2].style.height="300px";

      //msg_text
      $("#quizinfo").children().children().children(0).children()[2].style.width="382px";
      $("#quizinfo").children().children().children(0).children()[2].style.height="210px";

      //msg_key
      $("#quizinfo").children().children().children(0).children()[3].style.width="382px";
      $("#quizinfo").children().children().children(0).children()[3].style.height="20px";
   }
   else
   {
      $("#quiz")[0].style.width="742px";
      $("#quiz")[0].style.height="465px";//整框

      $("#quizinfo").children()[0].style.width="740px";//quizinfo下第一个div
      $("#quizinfo").children()[0].style.height="472px";//quizinfo下第一个div

      $("#quizinfo").children(0).children(0)[0].style.width="740px";//整框
      $("#quizinfo").children(0).children(0)[0].style.height="462px";//整框

      //速问速答
      $("#quizinfo").children().children().children(0).children()[1].style.width="730px";//宽度
      $("#quizinfo").children().children().children(0).children()[1].style.height="30px";//高度

      $("#quizinfo").children().children().children(1)[1].style.width="720px";//msg frame
      $("#quizinfo").children().children().children(1)[1].style.height="376px";//msg frame

      //msg_text
      $("#quizinfo").children().children().children(0).children()[2].style.width="720px";
      $("#quizinfo").children().children().children(0).children()[2].style.height="376px";

      //msg_key
      $("#quizinfo").children().children().children(0).children()[3].style.width="720px";
      $("#quizinfo").children().children().children(0).children()[3].style.height="20px";
   }

}

function Quiz(jsonDATA)//单选、多选窗口的控制
{
   if(jsonDATA.length>1)
   {
      if(jsonDATA[0]==='0')						//单个选项，主要用于发出提示或提醒
      {
         document.getElementById("quiz").style.visibility="hidden";	//隐藏窗口 
      }
      else  if(jsonDATA[0]==='')						//单个选项，主要用于发出提示或提醒
      {
         var msg_buttons=document.getElementById("msg_keys");
         msg_buttons.innerHTML='';
         document.getElementById("msg_text").innerHTML=jsonDATA[1];	//提示信息
         document.getElementById("quiz").style.visibility="visible";	//隐藏窗口 
      }
      else
      {
         var msg_buttons=document.getElementById("msg_keys");
         msg_buttons.innerHTML='';

         if(jsonDATA[0]==1)						//单个选项，主要用于发出提示或提醒
         {
              var button1 = document.createElement("input");
              button1.type="button";
              button1.value="确定";
              button1.style.width="50px";
              button1.style.height="30px";
              button1.style.margin="auto 20";
              button1.onclick=function(){ Answer('确定');}
              msg_buttons.appendChild(button1);
         }
         else								//正常显示A选项
         {
              var button1 = document.createElement("input");
              button1.type="button";
              button1.value="A";
              button1.style.width="40px";
              button1.style.height="30px";
              button1.style.margin="auto 20";
              button1.onclick=function(){ Answer('A');}
              msg_buttons.appendChild(button1);
         }

         if(jsonDATA[0]>1)						//有多个选项时，显示B选项
         {
              var button2 = document.createElement("input");
              button2.type="button";
              button2.value="B";
              button2.style.width="40px";
              button2.style.height="30px";
              button2.style.margin="auto 20";
              button2.onclick=function(){ Answer('B');}
              msg_buttons.appendChild(button2);
         }

         if(jsonDATA[0]>2)						//如果有第三个，则显示C选项
         {
              var button3 = document.createElement("input");
              button3.type="button";
              button3.value="C";
              button3.style.width="40px";
              button3.style.height="30px";
              button3.style.margin="auto 20";
              button3.onclick=function(){ Answer('C');}
              msg_buttons.appendChild(button3);
         }

         if(jsonDATA[0]>3)						//最多显示4个选项，其它的忽略。
         {
              var button4 = document.createElement("input");
              button4.type="button";
              button4.value="D";
              button4.style.width="40px";
              button4.style.height="30px";
              button4.style.margin="auto 20";
              button4.onclick=function(){ Answer('D');}
              msg_buttons.appendChild(button4);
         }
         document.getElementById("msg_text").innerHTML=jsonDATA[1];	//提示信息
         document.getElementById("quiz").style.visibility="visible";	//显示窗口
      }
   }
}

function showQuiz()//问卷的显示与关闭
{
   if(bQuizshow==false) showQuiz();
   else hideQuiz();
   bQuizshow!=bQuizshow;
}

function hideWindow()//已废弃
{
   document.getElementById("sysinfo").style.visibility="hidden";
}

function showWindow()//已废弃
{
   document.getElementById("sysinfo").style.visibility="visible";
}

function Question(str)//已废弃
{
   document.getElementById("msg_text").innerHTML=str;
   document.getElementById("quiz").style.visibility="visible";
}

function Answer(str)//学生答题
{
   content=str;
   var msg = {'content': "QUIZKEY_"+content, 'type': 'user', 'lastID':lastID};//lastID用于标记答题情况，防止已答题者刷新页面，重新获得答题权限。

   sendMsg(msg);
   document.getElementById("quiz").style.visibility="hidden";
   setJSCookie("QuizID",lastID,1);
   //document.cookie="QuizID="+lastID;
}

var nInfoDivWidth="480px";
var arrHelpSender=new Array();								//在清理请求前，只能显示一次。
function newInfo(strText,bAutoDelete=true,bAlert=false)
{
   var info_list=document.getElementById(bAutoDelete==true?"infolist":"infolistx");//需要确定的消息在infolistx,自动消失的消息在infolist
   info_list.style.visibility="visible";
   var info=document.createElement("li");
   var arrText=strText.split("||");		//消息中可以包含发送者信息：消息信息||发送者
   if(arrText.length==2)
   {
      if(arrHelpSender.indexOf(arrText[1])>-1) return;
      arrHelpSender.push(arrText[1]);
      var d=new Date();
      info.textContent=arrText[0]+'('+d.toLocaleTimeString()+')';//添加求助的时间戳
      info.title=arrText[1];
   }
   else
      info.textContent=strText;
   //info.innerHTML=strText;
   
   info.style="display: inline-block;position: relative;margin: 1px 2px;right:0px;width:100%;"+ (bAlert==false? "background-color: rgb(33 150 243 / 79%);color: ghostwhite;" : "background-color: rgb(240 10 10 / 79%);color: orange;") +" padding-left:4px;padding-right:4px;font-size: 12px;";

   if(!bAutoDelete)
   {
       var p=document.createElement("p");
       info.appendChild(p);

       var confirm_button=document.createElement("button");
       confirm_button.type="button";
       confirm_button.innerText="确定";
       confirm_button.style="right: 0px;background: lightblue;position: absolute;bottom: 0px;height: 25px;border:solid 1px gray;font-size: 13px;color:black";

       if(arrText.length==2)
       {
          confirm_button.onclick=function(){ 
             info_list.removeChild(info);
             arrHelpSender.splice(arrHelpSender.indexOf(arrText[1]),1);			//清理请求
             var msg = {'content': '["MSG","收到，请稍等。","'+strCurrentUser+'"]' , 'type': 'user','to':arrText[1]};

             sendMsg(msg);
          };
       }
       else
       {
          confirm_button.onclick=function(){
             info_list.removeChild(info);
          };
       }
       info.appendChild(confirm_button);
   }

   info_list.insertBefore(info, info_list.firstChild);

   if(bAutoDelete)
   {
      setTimeout(function(){
         info.classList.add('fade-out');

         info.addEventListener('transitionend', function() {
            if (!info.classList.contains('hidden')) {
               return;
            }
            info_list.removeChild(info);
         });
         info.classList.add('hidden');//3秒后添加hidden
      },3000);
   }
}