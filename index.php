<?php
include("./include/config.inc.php");
 
//管理员需要预设学生账号。数据保存在文件：./include/names.inc.php
include("./include/names.inc.php");

$classid=isset($_POST['classid'])?$_POST['classid']:"";	//班级ID
$stname=isset($_POST['sname'])?$_POST['sname']:"";	//学生姓名
$stpsd=isset($_POST['spsd'])?$_POST['spsd']:"";		//学生密码

$crc=count($class_room);
$msg="";
if($classid>=0 && isset($names[$classid]) && $stname!="" &&isset($names[$classid][$stname]) && $stpsd!="")
{
//print_r($_POST);
   if($stpsd==$names[$classid][$stname])      //echo "正确登录。";
   {
      setCookie("CLASSID",$classid,time()+3600*8,$site_path);
      setCookie("USERNAME",$stname,time()+3600*8,$site_path);
      setCookie("DD",date("Y-m-d"),time()+3600*8,$site_path);

      if($classid>0 && isset($grades[$classid-1]))//教师不区分年级
         setCookie("GRADEID",$grades[$classid-1],time()+3600,$site_path);
      else
         setCookie("GRADEID",0,time()+3600*8,$site_path);

      if(!file_exists("./".$student_works)) mkdir("./".$student_works);
      if(isset($classname[$classid-1]) && !file_exists("./".$student_works.$classname[$classid-1])) mkdir("./".$student_works.$classname[$classid-1]);

      header("Location: ".$site_path."editor/");
      exit();
   }
   else $msg="密码错误，请重新尝试。";
}
?>
<html>
<head><meta http-equiv="content-type" content="text/html;charset=UTF-8">
<title>Scratch3.0在线版——登录</title>
<link id="skin_style" href="./css/ui.css" type="text/css" rel="stylesheet" charset="UTF-8" /> 
<style type="text/css">
<!--
.STYLE2 {color: #FF0000}
.STYLE4 {font-size: 24px}
-->
</style>
</head>
<body>
<div align=center height=400 style="width: 100%  height: 100%">
<form action=index.php method=POST>
<table width="300" height=200 border="0">
  <tr>
    <th colspan="3" scope="col"  class=new><span class="STYLE4">登录</span></th>
  </tr>
  <tr>
    <th width="80" scope="row"  class=new >班级</th>
    <td width="80"  class=new >
       <select id=classid name=classid style='width:150px;height:40px;font-size:20px;' onchange=submit()>
	  <option value="0">请选择班级</option>
<?php
     if($crc>0)//班级名称列表
     {
        for($i=0;$i<$crc;$i++)
        {
           echo "	  <option value=".$class_room[$i]." ".(($classid==$class_room[$i])?"selected":"") .">".$classname[$class_room[$i]-1]."</option>";
        }
      }
?>
    </select></td>
    <td width="20"  class=new ><span class="STYLE2">&nbsp;*</span></td>
  </tr>
  <tr>
    <th scope="row"  class=new >姓名</th>
<?php
   if(isset($names[$classid]))//该班级存在预设账号
   {
      $cnamec=count($names[$classid]);
      $cnames=array_keys($names[$classid]);

      echo "<td  class=new ><select id=sname name=sname style='width:150px;height:40px;font-size:20px;'>";
      echo "<option value=>请选择姓名</option>";
      for($i=0;$i<$cnamec;$i++)
      {
         echo "<option value='".$cnames[$i]."'>".$cnames[$i]."</option>";
      }
      echo "</select></td>";
   }
   else
   {
?>
    <td  class=new ><input style='width:150px;height:40px;font-size:20px;' id=sname name=sname /></td>
<?php
   }
?>
    <td  class=new ><span class="STYLE2">&nbsp;*</span></td>
  </tr>
  <tr>
    <th  scope="row"  class=new >密码</th>
    <td  class=new ><input name=spsd id=spsd style='width:150px;height:40px;font-size:20px;' type=password></td>
    <td  class=new ><span class="STYLE2">&nbsp;*</span></td>
  </tr>
  <tr>
    <th colspan="3" scope="row"><input type=submit  style='width:100px;height:40px;font-size:20px;' value="提交"></th>
  </tr>
</table>
<?php
   if($msg)
      echo "<font color=red>$msg</font>";
?>
</form>

</div>

<?php
//$release=@file_get_contents("./include/release.txt");
$release="";//trim($release,"\r\n");
if($release!="")
{
?>
<hr>
<div align=center><h1>佳作欣赏</h1></div>
<div class=page>
<ul class=lists><?php
   $r=explode("\n",$release);
   foreach($r as $value)
   {
      $r_arr=explode("|",$value);
//print_r($r_arr);
      if(isset($r_arr[1]) && $r_arr[1]!="" && $r_arr[0]!="")
      {
         $data=base64_decode($r_arr[0]);
         if($data!="")
         {
            $data_arr=explode("|",$data);
            $value=str_replace("+","-",$r_arr[0]);
            echo '
  <li class=list>
    <div class=proj>
      <a href="viewp.php?p='.$value.'" target=_blank><img src="./img/snap/'.md5($data_arr[0].$data_arr[1].$data_arr[2]).'.png"></a>
      <div class=link><a href="viewp.php?p='.$value.'" target=_blank>'.$data_arr[0]."&nbsp;".$data_arr[1]."&nbsp;".$data_arr[2].'</a></div>
    </div>
  </li>';
         }
      }
   }
?>
</ul>
</div>
<?php
}
?>
<script>
function showinfo()
{
   var o=document.getElementById("aboutinfo");
   o.style.display="block";
}

function hideinfo()
{
   var o=document.getElementById("aboutinfo");
   o.style.display="none";
}
</script>

</body>
</html>