<?php
exit();
if(isset($_POST['n']) && $_POST['n']!="")
{
//echo "<pre>";

   $data= $_POST['c']."=>Array(\r\n";

   $arr=explode("\r\n",$_POST['n']);
   foreach($arr as $value)
   {
      if($value)
         $data.= '"'.$value.'",'."\r\n";
   }
   $data.= "),\r\n";

   file_put_contents("n.inc.php",file_get_contents("n.inc.php").$data);
}
?>
<form method=post action=names.php>
<input type=text name=c >

<textarea name=n cols=10></textarea>
<input type=submit>
</form>