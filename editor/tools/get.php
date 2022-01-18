<?php
ini_set('memory_limit','1024M');
set_time_limit(0);

$path="./static/asset/";

$d=dir($path);

$strAssets="";
$strRaw="";

$id=1481;
while (($file = $d->read()) !== false)
{
   if($file!="." && $file!="..")
   {
      $f=explode(".",$file);

      if($f[1]=="svg" || $f[1]=="wav" || $f[1]=="png")
      {      
         $id++;
         if($f[1]=="svg")
         {
            $strAssets.="\n}, {\n  type: AssetType.ImageVector,\n  format: DataFormat.SVG,\n  id: null,\n  data: new Buffer(__webpack_require__(".$id.") // eslint-disable-line global-require\n  )";
         }
         else if($f[1]=="wav") 
         {
            $strAssets.="\n}, {\n  type: AssetType.Sound,\n  format: DataFormat.WAV,\n  id: null,\n  data: new Buffer(__webpack_require__(".$id.") // eslint-disable-line global-require\n  )";
         }
         else if($f[1]=="png") 
         {
            $strAssets.="\n}, {\n  type: AssetType.ImageBitmap,\n  format: DataFormat.PNG,\n  id: null,\n  data: new Buffer(__webpack_require__(".$id.") // eslint-disable-line global-require\n  )";
         }

         $strRaw.=",\n/* ".$id." */\n/***/ (function(module, exports, __webpack_require__){\n\nmodule.exports = __webpack_require__(14)(\"".base64_encode(file_get_contents("./static/asset/".$file))."\")\n\n/***/ })";
      }
   }
}
$d->close();

echo "//ҳ����������ݣ�ȫ������scratch-gui.js��DefaultAssets�raw.txt������ݣ�ҲҪ׷�ӵ�scratch-gui.js�С�\r\n\r\n\r\n";
echo $strAssets;

file_put_contents("raw.txt",$strRaw);
exit;


$f=Array(
   Array("809d9b47347a6af2860e7a3a35bce057","svg"),
   Array("920f14335615fff9b8c55fccb8971984","svg"),
   Array("34a175600dc009a521eb46fdbbbeeb67","svg"),
   Array("45de34b47a2ce22f6f5d28bb35a44ff5","svg"),
   Array("83a9787d4cb6f3b7632b4ddfebf74367","wav"),
);

$c=count($f);
$id="1482";//$_GET['id'];

$strID="";
for($i=0;$i<$c;$i++)
{
   //���ڱ��������������ֿ�ͷ����MD5ֵ�кܴ������0-9��ʼ�ģ����Ը�����ǿ�Ƽ�ǰ����"_"��
   //�ٷ������ϸ����ֵģ�����ǿ��ȫ�ӡ�
   $strID.= "var _".$f[$i][0]." = __webpack_require__(".($id+$i).");\r\nvar _".$f[$i][0]."_default = /*#__PURE__*/__webpack_require__.n(_".$f[$i][0].");\r\n";
}
file_put_contents("1id.txt",$strID);

echo "\r\n\r\n\r\n";

$strDefault="";
for($i=0;$i<$c;$i++)
{
   //����GIF,JPG,PNG��Ҫ����
   if($f[$i][1]=="svg")
   {
      $strDefault.="
  }, {
    id: '".$f[$i][0]."',
    assetType: 'ImageVector',
    dataFormat: 'SVG',
    data: encoder.encode(_".$f[$i][0]."_default.a)";
   }
   else if($f[$i][1]=="wav") 
   {
      $strDefault.="
  }, {
    id: '".$f[$i][0]."',
    assetType: 'Sound',
    dataFormat: 'WAV',
    data: new Uint8Array(_".$f[$i][0]."_default.a)";

   }
}
file_put_contents("2default.txt",$strDefault);


echo "\r\n\r\n\r\n";
$strRaw="";
for($i=0;$i<$c;$i++)
{
   //SVG���ı��ļ���JPG,PNG,GIF��WAV�ļ��Ƕ������ļ�����Ҫ���֡�
   if($f[$i][1]=="svg")
      $strRaw.=",\n
/* ".($id+$i)." */\n/***/ (function(module, exports){\n\nmodule.exports = \"".str_replace("\n",'\n',addslashes(file_get_contents("./static/asset/".$f[$i][0].".".$f[$i][1])))."\";\n\n/***/ })";
   else
      $strRaw.=",\n
/* ".($id+$i)." */\n/***/ (function(module, exports, __webpack_require__){\n\nmodule.exports = __webpack_require__(14)(\"".base64_encode(file_get_contents("./static/asset/".$f[$i][0].".".$f[$i][1]))."\")\n\n/***/ })";
}

file_put_contents("3raw.txt",$strRaw);

?>