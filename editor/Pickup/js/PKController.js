
/////////////////////////////////////////////////////////////暂存盘控制
var bPICKUPVIEW=false;
var listPICKUPX=null;
var tabPICKUP=null;

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


//暂存盘显示与隐藏控制
function showPICKUP()
{
   if(listPICKUPX)
   {
      document.getElementById("REMOVE0").style.display="none";	//隐藏删除按钮
      document.getElementById("REMOVE1").style.display="none";
      document.getElementById("REMOVE2").style.display="none";

      listPICKUPX.style.visibility=bPICKUPVIEW?"hidden":"visible";
      bPICKUPVIEW=!bPICKUPVIEW;
   }
   if(bPICKUPVIEW)
   {
      loadPICKUP();
      tabPICKUP.children[0].children[0].style.background="white";
   }
   else
      tabPICKUP.children[0].children[0].style.background="";
}

//加载暂存盘数据
function loadPICKUP( nTYPE=-1 )	//默认加载全部
{
   $.post("./Pickup/loadPICKUPS.php?t=" + Math.random(), { "T":nTYPE }, function(data)
   {

      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
      if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

      if(data=="") return;
      jsonData=JSON.parse(data);
      //var PVType=Array("个人","班级","年级");
      //var listPICKUP=listPICKUPX;

      for(j=0;j<3;j++)			//三种类型的暂存盘
      {
         //if(jsonData[j].length==0 && nTYPE==-1) continue;		//换班级时，需要清除旧班级的数据
         if(nTYPE!=-1 && nTYPE!=j) continue;
         var listPICKUP=document.getElementById("PICKUPVIEW"+''+j);

         if(listPICKUP)  listPICKUP.innerHTML="";

         if(jsonData[j].length>0)						//按需显示删除按钮
            document.getElementById("REMOVE"+j).style.display="inline";
         else
            document.getElementById("REMOVE"+j).style.display="none";

         for(i=0;i<jsonData[j].length;i++)
         {
            let selector=document.createElement("div");
            selector.className='sprite-selector_sprite-wrapper_1C5Mq';
            if(j>0)
               selector.title="分享者："+jsonData[j][i][0][1]+"\n点赞数："+jsonData[j][i][0][6]+"\n分享时间：\n"+jsonData[j][i][2]+"\n备注信息：\n"+jsonData[j][i][0][5];//targetSPRITE.sprite.name;
            else
               selector.title="备注信息：\n"+jsonData[j][i][0][5]+"\n暂存时间：\n"+jsonData[j][i][2];//targetSPRITE.sprite.name;

            selector.style=" top: 2px;position: relative;";

            let div_21WnR=document.createElement("div");
            div_21WnR.className='react-contextmenu-wrapper sprite-selector_sprite_21WnR sprite-selector-item_sprite-selector-item_kQm-i';
            div_21WnR.style.background="white";

            var div_Xs0wN=document.createElement("div");
            div_Xs0wN.className='sprite-selector-item_sprite-image-outer_Xs0wN';
            div_Xs0wN.innerHTML="<div class='sprite-selector-item_sprite-image-inner_3oSwi'><img class='sprite-selector-item_sprite-image_2QWuK' draggable='false' src='../data/pickup/img/"+jsonData[j][i][0][3]+"."+jsonData[j][i][0][4]+"'></div>";

            let div_I0i_=document.createElement("div");
            div_I0i_.className='sprite-selector-item_sprite-info_-I0i_';
            div_I0i_.style.maxWidth="72px";
            div_I0i_.innerHTML="<div class='sprite-selector-item_sprite-name_1PXjh' style='max-width:60px;'>"+jsonData[j][i][0][5]+"</div>";

            let div_Delete=document.createElement("div");
            div_Delete.className='delete-button_delete-button_2Nzko sprite-selector-item_delete-button_1rkFW';
            div_Delete.style="position: absolute;left: -10px;visibility:hidden";
            div_Delete.innerHTML="<div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;position: absolute;left: 6px;' onclick='loadPICKUPData("+j+",\""+jsonData[j][i][0][2]+"\",\"COSTUME\");'><img title='提取造型到当前角色' class='delete-button_delete-icon_3b8wH' src='./img/costumes.svg'></div>\
               <div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;position: relative;left: 1px;' onclick='loadPICKUPData("+j+",\""+jsonData[j][i][0][2]+"\",\"CODE\");'><img title='提取代码到当前角色' class='delete-button_delete-icon_3b8wH' src='./img/codes.svg'></div>\
               <div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;position: absolute;right: 4px;' onclick='loadPICKUPData("+j+",\""+jsonData[j][i][0][2]+"\",\"SOUND\");'><img title='提取声音到当前角色' class='delete-button_delete-icon_3b8wH' src='./img/sounds.svg'></div>\
               <div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;position: absolute;top: 25px;left: 30px;' onclick='loadPICKUPData("+j+",\""+jsonData[j][i][0][2]+"\",\"WHOLE\");'><img title='作为新角色添加到当前项目' class='delete-button_delete-icon_3b8wH' src='./img/clouddown.svg'></div>";

            if(uid==jsonData[j][i][0][0]  || admin )//个人只能修改自己的数据，教师可以修改所有数据
            {
               div_Delete.innerHTML+="\
                  <div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;position: absolute;top: 25px;left: 6px;' onclick='setPICKUPData(this,"+j+",\""+jsonData[j][i][0][2]+"\");'><img title='修改备注' class='delete-button_delete-icon_3b8wH' src='./img/talk.svg'></div>\
                  <div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;top: 25px; right: 4px;position: absolute;' onclick='delPICKUPData(this,"+j+",\""+jsonData[j][i][0][2]+"\");'><img title='删除' class='delete-button_delete-icon_3b8wH' src='./img/del.svg'></div>";
            }
            if(j<1)// && (uid==jsonData[j][i][0]  || admin ))
            {
               if(admin)//((uid==jsonData[j][i][0][0]) || admin )
                  div_Delete.innerHTML+="                     <div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;position: absolute;top: 50px;left: 6px;' onclick='setSHAREData(\"SHARETOC\",\""+jsonData[j][i][0][2]+"\");'><img title='分享给班级' class='delete-button_delete-icon_3b8wH' src='./img/sharec.svg'></div>";
               else if(uid!=jsonData[j][i][0][0])// if(admin)
                  div_Delete.innerHTML+="                     <div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;position: absolute;top: 50px;left: 30px;' onclick='setLIKEData(\"LIKE\",\""+jsonData[j][i][0][2]+"\");'><img title='给赞' class='delete-button_delete-icon_3b8wH' src='./img/"+(jsonData[j][i][1]==1?"star2":"star")+".svg'></div>";
            }

            if(j<2)
            {
               if(admin)//(uid==jsonData[j][i][0][0])  || admin )
                  div_Delete.innerHTML+="                     <div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;top: 50px; right: 4px;position: absolute;' onclick='setSHAREData(\"SHARETOG\",\""+jsonData[j][i][0][2]+"\");'><img title='分享给年级' class='delete-button_delete-icon_3b8wH' src='./img/shareg.svg'></div>";
               else if(uid!=jsonData[j][i][0][0])
                  div_Delete.innerHTML+="                     <div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;position: absolute;top: 50px;left: 30px;' onclick='setLIKEData("+j+",\"LIKE\",\""+jsonData[j][i][0][2]+"\");'><img title='给赞' class='delete-button_delete-icon_3b8wH' src='./img/"+(jsonData[j][i][1]==1?"star2":"star")+".svg'></div>";
            }

            if(j>0)
            {
               if((uid!=jsonData[j][i][0][0])  || admin )
                  div_Delete.innerHTML+="                     <div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;position: absolute;top: 50px;left: 30px;' onclick='setLIKEData("+j+",\"LIKE\",\""+jsonData[j][i][0][2]+"\");'><img title='给赞' class='delete-button_delete-icon_3b8wH' src='./img/"+(jsonData[j][i][1]==1?"star2":"star")+".svg'></div>";
            }

            div_Delete.setAttribute("aria-label","Delete");
            div_Delete.setAttribute("role","button");
            div_Delete.setAttribute("tabindex",'0');
            div_21WnR.appendChild(div_Xs0wN);
            div_21WnR.appendChild(div_I0i_);
            div_21WnR.appendChild(div_Delete);

            selector.appendChild(div_21WnR);
            selector.onmouseover=function(){
              this.children[0].children[2].style.visibility="visible";
            };
            selector.onmouseout=function(){
              this.children[0].children[2].style.visibility="hidden";
            };

            listPICKUP.appendChild(selector);
         }
      }
   });
}

//暂存盘中数据的导入
function loadPICKUPData(nTYPE,strID,strTYPE)
{
   if(strID && strTYPE)
   {
      $.ajax({								//同步请求，将数据暂存到服务器
         type:"POST",
         url:"./Pickup/loadPICKUP.php?t=" + Math.random(),
         data: { "F":strID,"T":strTYPE ,"NT":nTYPE},
         success: function (data) 
	 {

            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

            if(data=="") return;
            var jsonData=JSON.parse(data);
            switch(jsonData[0])
            {
               case "WHOLE":		//作为新角色添加到当前项目
                  var jsonSprite=JSON.parse(jsonData[1]); 


                  if(JSON.stringify(jsonSprite)=="{}") return;		//数据为空

                  if(jsonSprite.isStage==true) {

/*
                  var currentTarget=oVMM.props.vm.runtime.targets[0];	//获取当前角色
                  var wholeData=JSON.parse(jsonData[1]);
                  var j=wholeData.blocks;						//积木数据
                  var dKeys=Object.keys(j);
                  for(var i=0;i<dKeys.length;i++)				//遍历所有积木数据
                  {
                     j[dKeys[i]].id=dKeys[i];
                     if(JSON.stringify(j[dKeys[i]])!="{}")
                     {
                        currentTarget.blocks.createBlock(j[dKeys[i]]);		//创建积木块
                     }
                  }
*/
/*
                  var oCostumes=jsonSprite.costumes;					//造型数据
                  for(var i=0;i<oCostumes.length;i++)				//遍历所有造型数据
                  {
                     var dCostume=oCostumes[i];
                     var dData=((typeof dCostume.asset.data.data) == 'object') ?
                                dCostume.asset.data.data   :			//位图
                                dCostume.asset.data;				//矢量图
                     var dkeys=Object.keys(dData);
                     var dataArray=new Uint8Array(dkeys.length);
                     for(var x=0;x<dkeys.length;x++)				//将Array数据，装入Uint8Array
                     {
                        dataArray[x]=dData[dkeys[x]];
                     }

                     var asset= new oVMM.props.vm.runtime.storage.Asset(	//构建Asset对象
                        dCostume.asset.assetType,
                        dCostume.asset.assetId,
                        dCostume.asset.dataFormat,
                        dataArray,						//造型、声音数据强制用Uint8Array
                        []
                     );
                     dCostume.asset=asset;
                     dCostume.assetId=asset.assetId;
                     dCostume.md5=asset.assetId+"."+asset.dataFormat;
                     currentTarget.addCostume(dCostume,0);

                     //oVMM.props.vm.addCostume(dCostume.md5,dCostume);		//插入造型
                  }
*/

/*

                  var dSounds=jsonSprite.sounds;					//声音数据
                  for(var i=0;i<dSounds.length;i++)				//遍历所有声音数据
                  {
                     var dkeys=Object.keys(dSounds[i].asset.data);
                     var dataArray=new Uint8Array(dkeys.length);
                     for(var x=0;x<dkeys.length;x++)				//将Array数据，装入Uint8Array
                     {
                        dataArray[x]=dSounds[i].asset.data[dkeys[x]];
                     }
                     var asset= new oVMM.props.vm.runtime.storage.Asset(	//构建Asset对象
                        dSounds[i].asset.assetType,
                        dSounds[i].asset.assetId,
                        dSounds[i].asset.dataFormat,
                        dataArray,						//造型、声音数据强制Uint8Array
                        []
                     );
                     dSounds[i].asset=asset;
                     dSounds[i].assetId=asset.assetId;
                     dSounds[i].md5=asset.assetId+"."+asset.dataFormat;
                     dSounds[i].clean=false;

                     oVMM.props.vm.addSound(dSounds[i]);				//插入声音
                  }



                  oVMM.props.vm.refreshWorkspace();		//刷新工作区
                  Blockly.getMainWorkspace().cleanUp();				//积木插入后，需要整理一下积木
*/

                     alert("此为舞台角色，请先切换到舞台，然后按需提取造型、代码或声音等数据。");
                     return;
                  }
;
                  var sprite={						//构建一个完整的角色所需要的数据结构
                     "name":		jsonSprite.name,
                     "tags":		[],
                     "isStage":		false,
                     "blocks":		jsonSprite.blocks,		//积木数据
                     "variables":	jsonSprite.variables,		//仅适用于当前角色的变量
                     "costumes":	[],				//造型数据待装配
                     "sounds":		[]			//声音数据待装配
                  };

                  var costumes=jsonSprite.costumes;			//构建造型
                  for(var j=0;j<costumes.length;j++)
                  {
                     var dCostume=costumes[j];
                     var dData=((typeof dCostume.asset.data.data) == 'object') ?
                                dCostume.asset.data.data   :			//位图
                                dCostume.asset.data;				//矢量图

                     var dkeys=Object.keys(dData);
                     var dataArray=new Uint8Array(dkeys.length);
                     for(var x=0;x<dkeys.length;x++)
                     {
                        dataArray[x]=dData[dkeys[x]];
                     }
                     var asset= new oVMM.props.vm.runtime.storage.Asset(	//构建造型图片的Asset对象
                        dCostume.asset.assetType,
                        dCostume.asset.assetId,
                        dCostume.asset.dataFormat,
                        dataArray,
                        []
                     );
                     dCostume.asset=asset;
                     dCostume.assetId=asset.assetId;
                     dCostume.md5=asset.assetId+"."+asset.dataFormat;
                     sprite.costumes.push(dCostume);
                  }

                  var sounds=jsonSprite.sounds;   			//构建声音
                  for(var j=0;j<sounds.length;j++)
                  {
                     var dKeys=Object.keys(sounds[j].asset.data);
                     var dataArray=new Uint8Array(dKeys.length);
                     for(var x=0;x<dKeys.length;x++)
                     {
                        dataArray[x]=sounds[j].asset.data[dKeys[x]];
                     }
                     var asset= new oVMM.props.vm.runtime.storage.Asset(
                        sounds[j].asset.assetType,
                        sounds[j].asset.assetId,
                        sounds[j].asset.dataFormat,
                        dataArray,
                        []
                     );
                     var dSound={						//构建声音文件的Asset对象
                        "asset": 	asset,
                        "assetId":	sounds[j].assetId,
                        "name":		sounds[j].name,
                        "dataFormat":	sounds[j].dataFormat,
                        "format":	sounds[j].format,
                        "rate":		sounds[j].rate,
                        "sampleCount":	sounds[j].sampleCount,
                        "md5ext":	sounds[j].md5
                     };
                     sprite.sounds.push(dSound);
                  }

                  oVMM.props.vm.addSprite(sprite); 		//添加角色
                  oVMM.props.vm.refreshWorkspace();		//刷新工作区
                  Blockly.getMainWorkspace().cleanUp();		//积木插入后，需要整理一下积木
               break;

               case "CODE":	//提取代码到当前角色
                  var currentTarget=oVMM.props.vm.runtime.getEditingTarget();	//获取当前角色
                  var j=jsonData[1];						//积木数据
                  var dKeys=Object.keys(j);
                  for(var i=0;i<dKeys.length;i++)				//遍历所有积木数据
                  {
                     if(JSON.stringify(j[dKeys[i]])!="{}")
                        currentTarget.blocks.createBlock(j[dKeys[i]]);		//创建积木块
                  }
                  oVMM.props.vm.refreshWorkspace();				//刷新工作区
                  Blockly.getMainWorkspace().cleanUp();				//积木插入后，需要整理一下积木
               break;

               case "COSTUME":	//提取造型到当前角色
                  var currentTarget=oVMM.props.vm.runtime.getEditingTarget();	//获取当前角色
                  var oCostumes=jsonData[1];					//造型数据
                  for(var i=0;i<oCostumes.length;i++)				//遍历所有造型数据
                  {
                     var dCostume=oCostumes[i];
                     var dData=((typeof dCostume.asset.data.data) == 'object') ?
                                dCostume.asset.data.data   :			//位图
                                dCostume.asset.data;				//矢量图
                     var dkeys=Object.keys(dData);
                     var dataArray=new Uint8Array(dkeys.length);
                     for(var x=0;x<dkeys.length;x++)				//将Array数据，装入Uint8Array
                     {
                        dataArray[x]=dData[dkeys[x]];
                     }

                     var asset= new oVMM.props.vm.runtime.storage.Asset(	//构建Asset对象
                        dCostume.asset.assetType,
                        dCostume.asset.assetId,
                        dCostume.asset.dataFormat,
                        dataArray,						//造型、声音数据强制用Uint8Array
                        []
                     );
                     dCostume.asset=asset;
                     dCostume.assetId=asset.assetId;
                     dCostume.md5=asset.assetId+"."+asset.dataFormat;
                     oVMM.props.vm.addCostume(dCostume.md5,dCostume);		//插入造型
                  }
                  oVMM.props.vm.refreshWorkspace();				//刷新工作区
               break;

               case "SOUND":	//提取声音到当前角色
                  var dSounds=jsonData[1];					//声音数据
                  for(var i=0;i<dSounds.length;i++)				//遍历所有声音数据
                  {
                     var dkeys=Object.keys(dSounds[i].asset.data);
                     var dataArray=new Uint8Array(dkeys.length);
                     for(var x=0;x<dkeys.length;x++)				//将Array数据，装入Uint8Array
                     {
                        dataArray[x]=dSounds[i].asset.data[dkeys[x]];
                     }
                     var asset= new oVMM.props.vm.runtime.storage.Asset(	//构建Asset对象
                        dSounds[i].asset.assetType,
                        dSounds[i].asset.assetId,
                        dSounds[i].asset.dataFormat,
                        dataArray,						//造型、声音数据强制Uint8Array
                        []
                     );
                     dSounds[i].asset=asset;
                     dSounds[i].assetId=asset.assetId;
                     dSounds[i].md5=asset.assetId+"."+asset.dataFormat;
                     dSounds[i].clean=false;

                     oVMM.props.vm.addSound(dSounds[i]);				//插入声音
                  }
                  oVMM.props.vm.refreshWorkspace();		//刷新工作区
               break;
            }
         },
         async:false
      });
   }
}

//设置暂存盘中数据的备注信息
function setPICKUPData(o,nTYPE,strID)
{
   if(strID)
   {
      var strMEMO=o.parentElement.parentElement.children[1].innerText;//"请设置备注信息";
      if ((strMEMO = prompt("请设置备注信息，以方便浏览。", strMEMO)) != null) 
      {
         if (strMEMO == "") 
         {
            newInfo("数据不能为空。",false);
            return;
         }

         $.ajax({								//同步请求，将数据暂存到服务器
            type:"POST",
            url:"./Pickup/loadPICKUP.php?t=" + Math.random(),
            data: { "F":strID,"T":"MEMO" ,"M":strMEMO,"NT":nTYPE},
            success: function (data) 
	    {
               bSelfShow=true;
               sendMsg({'content': '["MEMOCHANGED",'+nTYPE+']', 'type': 'user'});

               //o.parentElement.parentElement.parentElement.title=strMEMO;
               //o.parentElement.parentElement.children[1].innerHTML="<div class='sprite-selector-item_sprite-name_1PXjh' style='max-width:60px;'>"+strMEMO+"</div>";;
            },
            async:false
         });
      }
   }
}

//删除暂存盘中数据
function delPICKUPData(o,nTYPE,strID)
{
   if(strID)
   {
      if (confirm("注意！\n此操作不可撤销，您确认要删除此数据("+o.parentElement.parentElement.children[1].children[0].innerText+")？")) 
      {
         $.ajax({								//同步请求，将数据暂存到服务器
            type:"POST",
            url:"./Pickup/loadPICKUP.php?t=" + Math.random(),
            data: { "F":strID,"T":"DELETE","NT":nTYPE},
            success: function (data) 
	    {
               bSelfShow=true;
               sendMsg({'content': '["STHREMOVED",'+nTYPE+']', 'type': 'user'});
               //o.parentElement.parentElement.parentElement.parentElement.removeChild( o.parentElement.parentElement.parentElement);
            },
            async:false
         });
      }
   }
}

//设置暂存盘中数据的备注信息
function setSHAREData(strTYPE,strID)
{
   if(strID)
   {
      $.ajax({								//同步请求，将数据暂存到服务器
         type:"POST",
         url:"./Pickup/loadPICKUP.php?t=" + Math.random(),
         data: { "F":strID,"T":strTYPE},
         success: function (data) 
	 {
            //loadPICKUP();
            bSelfShow=true;
            sendMsg({'content': '["'+strTYPE+'",1]', 'type': 'user'});
         },
         async:false
      });
   }
}


//设置暂存盘中数据的备注信息
function setLIKEData(nTYPE,strTYPE,strID)
{
   if(strID)
   {
      $.ajax({								//同步请求，将数据暂存到服务器
         type:"POST",
         url:"./Pickup/loadPICKUP.php?t=" + Math.random(),
         data: { "F":strID,"T":strTYPE , "NT":nTYPE},
         success: function (data) 
	 {
            loadPICKUP();
            //bSelfShow=true;
            //sendMsg({'content': '["'+strTYPE+'",1]', 'type': 'user'});
            newInfo("点赞完毕，对方需要手动刷新才能看到最新数据。");
         },
         async:false
      });
   }
}

//UInt8Array转Base64图片
function uint8ArrayToBase64(strType,u8Array) {
    let binaryString = '';
    for (let i = 0; i < u8Array.length; i++){
       binaryString += String.fromCharCode(u8Array[i]);
    }
    const base64 = btoa(binaryString);
    return 'data:'+strType+';base64,' + base64;
}

//暂存盘角色
function insertPICKUP(targetSPRITE,strID)
{
   var selector=document.createElement("div");
   selector.className='sprite-selector_sprite-wrapper_1C5Mq';
   selector.title=targetSPRITE.sprite.name;
   selector.style=" top: 2px;position: relative;";
   var div_21WnR=document.createElement("div");
   div_21WnR.className='react-contextmenu-wrapper sprite-selector_sprite_21WnR sprite-selector-item_sprite-selector-item_kQm-i';
   div_21WnR.style.background="white";
   //div_21WnR.style.direction="ltr";
   var div_Xs0wN=document.createElement("div");
   div_Xs0wN.className='sprite-selector-item_sprite-image-outer_Xs0wN';
   div_Xs0wN.innerHTML="<div class='sprite-selector-item_sprite-image-inner_3oSwi'><img class='sprite-selector-item_sprite-image_2QWuK' draggable='false' src='"+uint8ArrayToBase64(targetSPRITE.sprite.costumes_[0].asset.assetType.contentType,targetSPRITE.sprite.costumes_[0].asset.data)+"'></div>";

   var div_I0i_=document.createElement("div");
   div_I0i_.className='sprite-selector-item_sprite-info_-I0i_';
   div_I0i_.style.maxWidth="72px";
   div_I0i_.innerHTML="<div class='sprite-selector-item_sprite-name_1PXjh' style='max-width:60px;'>"+targetSPRITE.sprite.name+"</div>";

   var div_Delete=document.createElement("div");
   div_Delete.className='delete-button_delete-button_2Nzko sprite-selector-item_delete-button_1rkFW';
   div_Delete.style="position: absolute;left: -10px;visibility:hidden";
   div_Delete.innerHTML="<div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;position: absolute;left: 6px;' onclick='loadPICKUPData(\""+strID+"\",\"COSTUME\");'><img title='提取造型到当前角色' class='delete-button_delete-icon_3b8wH' src='./img/costumes.svg'></div>\
      <div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;position: relative;left: 1px;' onclick='loadPICKUPData(\""+strID+"\",\"CODE\");'><img title='提取代码到当前角色' class='delete-button_delete-icon_3b8wH' src='./img/codes.svg'></div>\
      <div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;position: absolute;right: 4px;' onclick='loadPICKUPData(\""+strID+"\",\"SOUND\");'><img title='提取声音到当前角色' class='delete-button_delete-icon_3b8wH' src='./img/sounds.svg'></div>\
      <div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;position: absolute;top: 27px;left: 6px;' onclick='setPICKUPData(this,\""+strID+"\");'><img title='修改备注' class='delete-button_delete-icon_3b8wH' src='./img/edit2.svg'></div>\
      <div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;position: absolute;top: 27px;left: 30px;' onclick='loadPICKUPData(\""+strID+"\",\"WHOLE\");'><img title='作为新角色添加到当前项目' class='delete-button_delete-icon_3b8wH' src='./img/add.svg'></div>\
      <div class='delete-button_delete-button-visible_kym6v' style='width: 22px;height: 22px;top: 27px; right: 4px;position: absolute;' onclick='delPICKUPData(this,\""+strID+"\");'><img title='删除' class='delete-button_delete-icon_3b8wH' src='./img/del.svg'></div>";
   div_Delete.setAttribute("aria-label","Delete");
   div_Delete.setAttribute("role","button");
   div_Delete.setAttribute("tabindex",'0');
   div_21WnR.appendChild(div_Xs0wN);
   div_21WnR.appendChild(div_I0i_);
   div_21WnR.appendChild(div_Delete);
   selector.appendChild(div_21WnR);
   selector.onmouseover=function(){				//鼠标移入，显示控制按钮
       div_Delete.style.visibility="visible";
       //div_21WnR.className='react-contextmenu-wrapper sprite-selector_sprite_21WnR sprite-selector-item_sprite-selector-item_kQm-i sprite-selector-item_is-selected_24tQj';
   };
   selector.onmouseout=function(){				//鼠标移出，隐藏控制按钮
       div_Delete.style.visibility="hidden";
       //div_21WnR.className='react-contextmenu-wrapper sprite-selector_sprite_21WnR sprite-selector-item_sprite-selector-item_kQm-i';
   };

   var view=document.getElementById("PICKUPVIEW");
   if(view)
      view.appendChild(selector);
}

/////////////////////////////////////////////////////////////暂存盘控制





//舞台右键响应，实现将舞台数据添加到暂存盘的操作
function scratch_pickupStage(target)
{
   if(target.srcElement.parentElement.id=='')	//加入流程图后，就变得复杂了。流程图页面，此数据为'myPaletteDiv'和'myDiagramDiv'
   {
      if(confirm("你想把舞台放入暂存盘么？")==1)
      {
      var sprite=oVMM.props.vm.runtime.getTargetForStage();
      var s=oVMM.props.vm.toJSON();				//要添加整个角色，则blocks和variables必须是从toJSON()中获取
      var sArr=JSON.parse(s);					//单个单个地添加积木、造型和声音，则可以用target中获取。
      var xID=0;
      var blocks=sArr.targets[xID].blocks;			//积木和变量单独发送，数据从toJSON()里获取
      var variables=sArr.targets[xID].variables;
      $.ajax({
         type:"POST",
         url:"./Pickup/savePICKUP.php?t=" + Math.random(),
         data: { "S":JSON.stringify(sprite),"B":JSON.stringify(blocks),"V":JSON.stringify(variables) },
         success: function (data)
         {

            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

            if(data.length==32) loadPICKUP();				//insertPICKUP(sprite,data);
            else newInfo("操作异常，此数据可能已存在。");
         },
         async:false
      });
      }
   }
}


//暂存盘UI注入
function injectPICKUP()
{
   var d=document.getElementsByClassName("gui_tabs_AgmuP");
   if(d==undefined) return;

   var newTABDIV1=document.getElementById("NEWTAB1");	//顶部控制标签
   var newTABDIV2=document.getElementById("NEWTAB2");	//存放暂存盘数据
   if(newTABDIV1==undefined)
   {
      var newTabDiv=document.createElement("DIV");
      newTabDiv.style="    position: absolute;   right: 0px;  display: flex; ";
      newTabDiv.id="NEWTAB1";
      d[0].appendChild(newTabDiv);
      newTABDIV1=newTabDiv;
   }

   if(newTABDIV2==undefined)
   {
      var newTabDiv=document.createElement("DIV");
      newTabDiv.style="    position: absolute;   right: 0px;  min-width:400px;    display: flex; ";
      newTabDiv.id="NEWTAB2";
      d[0].appendChild(newTabDiv);
      newTABDIV2=newTabDiv;
   }

   var viewCheck=document.getElementById("PICKUPVIEWX");	//暂存盘数据存放处
   if(viewCheck==undefined)
   {
      tabPICKUP=document.createElement("div");						//标签
      tabPICKUP.style="position: relative;";//right:0px;";
      tabPICKUP.title="要想将舞台加入暂存盘，请右击舞台任意处。";
      var ul=document.createElement("ul");

      ul.className="react-tabs_react-tabs__tab-list_17Wee gui_tab-list_87TYM";

      ul.style.width="84px";
      var li=document.createElement("li");

      li.className="react-tabs_react-tabs__tab_3Nn-X gui_tab_27Unf";
      li.setAttribute("role","tab");
      var span=document.createElement("span");


      span.innerHTML="暂存盘";

      li.appendChild(span);
      ul.appendChild(li);
      tabPICKUP.appendChild(ul);
      tabPICKUP.onclick=function(){
         showPICKUP();
      }
      newTABDIV1.appendChild(tabPICKUP);

      listPICKUPX=document.createElement("div");						//容器
      listPICKUPX.style="visibility:hidden;position: absolute; right: 0px; top: 44px; min-width: 84px; max-width: 373px; min-height:84px;  background: mediumaquamarine; border:1px solid lightsteelblue;z-index:30;border-bottom-left-radius: 3%;";
      listPICKUPX.id="PICKUPVIEWX";

      var divTitle=document.createElement("div");
      divTitle.innerText="个人";
      divTitle.style="background: ghostwhite; text-align: center; font-size: 14px;";

      var buttonRemoveAll=document.createElement("IMG");
      buttonRemoveAll.id="REMOVE0";
      buttonRemoveAll.src="./img/del.png";
      buttonRemoveAll.title="清空个人暂存盘内数据";
      buttonRemoveAll.style="position: relative;   top: 3px;";
      buttonRemoveAll.onclick=function(){
         //要删除，可循环调用：
         var c=document.getElementById("PICKUPVIEW0");
         for(i=c.childElementCount-1;i>=0;i--)
         {
            c.children[i].children[0].children[2].children[5].children[0].click();
         }
      };
      divTitle.appendChild(buttonRemoveAll);
      listPICKUPX.appendChild(divTitle);

      var listContent=document.createElement("div");
      listContent.className="sprite-selector_items-wrapper_4bcOj box_box_2jjDp";
      listContent.style="overflow: overlay;  max-height: 170px; border: 0px solid rgb(200, 200, 200);";
      listContent.id="PICKUPVIEW0";
      listContent.name="PICKUPVIEW0";
      listPICKUPX.appendChild(listContent);

      var divTitle=document.createElement("div");
      divTitle.innerText="班级";
      divTitle.title="点击刷新数据并查看班级共享盘中点赞情况";
      divTitle.style="background: ghostwhite ; text-align: center; font-size: 14px;";
      divTitle.onclick=function(){
         loadPICKUP(2);
         $.post("./Pickup/PICKUPinfo.php?t=" + Math.random(), { "T":1 }, function(data)
         {

            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

            if(data.length>0)
            {
               jsonData=JSON.parse(data);
               var strList='';
               var strKeys=Object.keys(jsonData);
               for(i=0;i<strKeys.length;i++)
                  strList+=strKeys[i]+":"+jsonData[strKeys[i]]+"\n";
               alert(strList);
            }
         });
      };

      var buttonRemoveAll=document.createElement("IMG");
      buttonRemoveAll.id="REMOVE1";
      buttonRemoveAll.src="./img/del.png";
      buttonRemoveAll.title="清空班级共享盘内数据";
      buttonRemoveAll.style="position: relative;   top: 3px;";
      buttonRemoveAll.onclick=function(){
         //要删除，可循环调用：
         var c=document.getElementById("PICKUPVIEW1");
         for(i=c.childElementCount-1;i>=0;i--)
         {
            c.children[i].children[0].children[2].children[5].children[0].click();
         }
      };
      divTitle.appendChild(buttonRemoveAll);
      listPICKUPX.appendChild(divTitle);

      var listContent=document.createElement("div");
      listContent.className="sprite-selector_items-wrapper_4bcOj box_box_2jjDp";
      listContent.style="overflow: overlay;  max-height: 170px; border: 0px solid rgb(200, 200, 200);";
      listContent.id="PICKUPVIEW1";
      listContent.name="PICKUPVIEW1";
      listPICKUPX.appendChild(listContent);

      var divTitle=document.createElement("div");
      divTitle.innerText="年级";
      divTitle.title="点击刷新数据并查看年级共享盘中点赞情况";
      divTitle.style="background:  ghostwhite; text-align: center; font-size: 14px;";
      divTitle.onclick=function(){
         loadPICKUP(2);
         $.post("./Pickup/PICKUPinfo.php?t=" + Math.random(), { "T":2 }, function(data)
         {

            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
            if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

            if(data.length>0)
            {
               jsonData=JSON.parse(data);
               var strList='';
               var strKeys=Object.keys(jsonData);
               for(i=0;i<strKeys.length;i++)
                  strList+=strKeys[i]+":"+jsonData[strKeys[i]]+"\n";
               alert(strList);
            }
         });
      };

      var buttonRemoveAll=document.createElement("IMG");
      buttonRemoveAll.id="REMOVE2";
      buttonRemoveAll.src="./img/del.png";
      buttonRemoveAll.title="清空年级共享盘内数据";
      buttonRemoveAll.style="position: relative;   top: 3px;";
      buttonRemoveAll.onclick=function(){
         //要删除，可循环调用：
         var c=document.getElementById("PICKUPVIEW2");
         for(i=c.childElementCount-1;i>=0;i--)
         {
            c.children[i].children[0].children[2].children[5].children[0].click();
         }
      };
      divTitle.appendChild(buttonRemoveAll);
      listPICKUPX.appendChild(divTitle);

      var listContent=document.createElement("div");
      listContent.className="sprite-selector_items-wrapper_4bcOj box_box_2jjDp";
      listContent.style="overflow: overlay;  max-height: 170px; border: 0px solid rgb(200, 200, 200);";
      listContent.id="PICKUPVIEW2";
      listContent.name="PICKUPVIEW2";
      listPICKUPX.appendChild(listContent);

      newTABDIV2.appendChild(listPICKUPX);
   }
}



//自Scratch GUI内部对外部的调用
//所有类似操作准备整合到一个函数定义中
function scratch_call(strTYPE,xVal)
{
   switch(strTYPE)
   {
      case "PICKUP":						//角色右键菜单响应，实现将角色数据添加到暂存盘的操作
         var sprite=oVMM.props.vm.runtime.getTargetById(xVal);
         var s=oVMM.props.vm.toJSON();				//当要把数据作为一个完整角色添加入项目时，blocks和variables必须从toJSON()中获取
         var sArr=JSON.parse(s);				//从target中获取的数据，只能被应用于独立的导入积木、造型和声音的操作中。
         var xID=0;
         for(i=1;i<oVMM.props.vm.runtime.targets.length;i++)	//toJSON()中没有ID数据，而右键菜单中获取的与角色有关的数据是ID，所以需要遍历查询一下。
         {
            if(oVMM.props.vm.runtime.targets[i].id==xVal){
               xID=i;
               break;
            }
         }
         if(xID>0)
         {
            var blocks=sArr.targets[xID].blocks;		//积木和变量单独发送，数据从toJSON()里获取
            var variables=sArr.targets[xID].variables;
            $.ajax({
               type:"POST",
               url:"./Pickup/savePICKUP.php?t=" + Math.random(),
               data: { "S":JSON.stringify(sprite),"B":JSON.stringify(blocks),"V":JSON.stringify(variables) },
               success: function (data)
               {

                  if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);//去掉可能存在的BOM头，等算法定型后，就不需要了。
                  if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);		//消除BOM头
                  if(data.charCodeAt(0) === 0xFEFF) data=data.slice(1);

                  if(data.length==32) loadPICKUP();			//insertPICKUP(sprite,data);
                  else newInfo("操作异常，此数据可能已存在。");
               },
               async:false
            });
         }
      break;
   }
}

