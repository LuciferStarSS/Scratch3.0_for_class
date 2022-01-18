<video width="100%" height="480" id="myVideo"></video>
</div>
<script src=./js/jquery.js></script>
<button onclick="videolz()" type="button"  class="btn btn-danger" style="width: 100%; font-size: 32px"><span class="glyphicon glyphicon-facetime-video" aria-hidden="true" id="videostr">视频描述</span></button>
<script>
//  判断浏览器
var root ="./";
var aa = '' ; //防止两次上传
var mediaRecorder ;
var index=1;//定时加1 	        
var dingshi;
var mediaConstraints = { audio: true, video: { width: 1280, height: 720 } }; 

function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
}
function onMediaError(e) {
   
}
function onMediaSuccess(stream) {
	 var video = document.querySelector('video');
	      //  赋值 video 并开始播放
	      video.srcObject = stream;
	      video.onloadedmetadata = function(e) {
	        video.play();
	      };
	      mediaRecorder = new MediaStreamRecorder(stream);
	      mediaRecorder.stream = stream;
	     /*    //  录像api的调用 */
	            mediaRecorder.mimeType = 'video/mp4';
	          dingshi = window.setInterval(function(){ 
	        	$("#videostr").html("保存视频"+index+"秒");
	        	index++;
	        }
	        ,1000);  
	         
	        mediaRecorder.start(12000000000);
	        //  停止录像以后的回调函数
	      
	        mediaRecorder.ondataavailable = function (blob) {
	            if(aa == ""){
	            	 var file = new File([blob], 'msr-' + (new Date).toISOString().replace(/:|\./g, '-') + '.mp4', {
	                     type: 'video/mp4'
	                 });
	                 var formData = new FormData();
	                 formData.append('file', file);
	                 console.log(formData);

	            	
	            aa = blob;
	            }
	        };
}

	       function videolz(){
	        	if( $("#videostr").text()=="视频描述"){
	        	$("#videostr").html("保存视频");
	        	$("#videostr").removeClass("glyphicon-facetime-video");
	        	$("#videostr").addClass("glyphicon-pause")
	        	/* $("#videos").append("<video width=\"100%\" height=\"320px\" id=\"myVideo\"></video>") */
	        	 //  开始录像
	        	 $("#myVideo").show();
	        	captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

	        	}else{
	        	$("#videostr").html("视频描述");
	        	$("#videostr").addClass("glyphicon-facetime-video");
	        	$("#videostr").removeClass("glyphicon-pause") 
	        	/*  $("#myVideo").remove();  */
	       //  停止录像
	 	         /*  mediaRecorder.stop(); */
	         // mediaRecorder.stream.stop();
	        	/*  $("#myVideo").unbind(); */
	 	      
 	 	      	index=1;
 	        	window.clearInterval(dingshi); 
	        	}
	   
	        }
 	        


</script>