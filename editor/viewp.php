<?php
$p=isset($_GET['p'])?$_GET['p']:"";
$p2=str_replace("-","+",$p);
$p2=base64_decode($p2);

$data=Array();
if($p2!="")
{
   $data=explode("|",$p2);
}

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en"> 
   <head>
        <title>Scratch2.0 Flash版—<?php echo $data[0]."_".$data[1]."_".$data[2];?></title>
        <meta name="google" value="notranslate" />         
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!-- Include CSS to eliminate any default margins/padding and set the height of the html element and 
             the body element to 100%, because Firefox, or any Gecko based browser, interprets percentage as 
             the percentage of the height of its parent container, which has to be set explicitly.  Fix for
             Firefox 3.6 focus border issues.  Initially, don't display flashContent div so it won't show 
             if JavaScript disabled.
        -->
        <style type="text/css" media="screen"> 
            html, body  { height:100%; }
            body { margin:0; padding:0; overflow:auto; text-align:center; 
                   background-color: #ffffff; }   
            object:focus { outline:none; }
            #flashContent { display:none; }
        </style>
        
        <!-- Enable Browser History by replacing useBrowserHistory tokens with two hyphens -->
        <!-- BEGIN Browser History required section -->
        <link rel="stylesheet" type="text/css" href="./scratch/css/history.css" />
        <script type="text/javascript" src="./scratch/js/history.js"></script>
        <!-- END Browser History required section -->  
            
        <script type="text/javascript" src="./scratch/js/swfobject.js"></script>
        <script type="text/javascript">
            // For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection. 
            var swfVersionStr = "11.1.0";
            // To use express install, set to playerProductInstall.swf, otherwise the empty string. 
            var xiSwfUrlStr = "playerProductInstall.swf";
            var flashvars = {};
            var params = {};
            params.quality = "high";
            params.bgcolor = "#ffffff";
            params.allowscriptaccess = "sameDomain";
            params.allowfullscreen = "true";
	    params.wmode = "opaque";
            
            var attributes = {};
            attributes.id = "scratch";
            attributes.name = "scratch";
            attributes.align = "middle";
            swfobject.embedSWF(
                "./scratch/swf/scratch.swf", "flashContent", 
                "100%", "100%", 
                swfVersionStr, xiSwfUrlStr, 
                flashvars, params, attributes);
            swfobject.createCSS("#flashContent", "display:block;text-align:left;");




/***********************************************************
检测SWF文件的加载进度
***********************************************************/
function checkLoaded(flash){
   try{
      return Math.floor(flash.PercentLoaded()) == 100
   }catch(e){
      return false;
   }
}

/************************************************************
加载已有的Scratch项目
************************************************************/
function init()
{
    scratch=document.getElementById("scratch");
    var flash = scratch;
    var intervalID = setInterval(function(){
      if(checkLoaded(flash)){
        clearInterval(intervalID);
        intervalID = null;

        scratch.autoLoadProject("getfile.php?SB2="+"<?php echo $p;?>"+"&t="+Math.random(),"1","1");
      }	
    },60)
}
	

        </script>
<script src="./scratch/js/jquery.js"></script>
<script>
var strCurrentUser="<?php echo (isset($_COOKIE['USERNAME'])?$_COOKIE['USERNAME']:"NONE");?>";
</script>

    </head>
    <body   topmargin="0" leftmargin="0" marginwidth="0" marginheight="0" onLoad="init();">
<style>
#about:hover
{ 
   background-color:yellow;
}
</style>

<div name=swf id=swf style="position:absolute; left: 0px; width: 100%; height:100%; top: 0px; background-color: #999999; layer-background-color: #999999; border: 1px none #000000;">
 <object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" width="100%" height="100%" align="center"> 
   <param name="allowScriptAccess" value="sameDomain" /> 
   <param name="movie" value="./scratch/swf/scratch.swf" /> 
   <param name="wmode" value="transparent"> 
   <param name="quality" value="high" /> 
   <param name="bgcolor" value="#ffffff" /> 
   <embed wmode="transparent" src="./scratch/swf/scratch.swf" quality="high" bgcolor="#ffffff" width="100%" height="100%" name="scratch" id=scratch align="center" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /> 
</object>
</div>
    </body>
</html>
