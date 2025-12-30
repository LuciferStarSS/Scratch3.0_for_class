<?php
   set_time_limit(0);
   error_reporting(E_ALL);

   include "./board/sb32c.class.php";
   $SBFILE="demo4.sb3";


   function readFileFromZip($zipPath, $fileName) {
      $zip = new ZipArchive();
    
      if ($zip->open($zipPath) !== TRUE) {
         return false;
      }
    
      $content = $zip->getFromName($fileName);
      $zip->close();
    
      return $content;
   }

   /**
    * 检查ZIP中是否存在指定文件
    * @param string $zipPath ZIP文件路径
    * @param string $fileName 要检查的文件名
    * @return bool
    */
   function fileExistsInZip($zipPath, $fileName) {
      $zip = new ZipArchive();
    
      if ($zip->open($zipPath) !== TRUE) {
         return false;
      }
    
      $exists = ($zip->locateName($fileName) !== FALSE);
      $zip->close();
    
      return $exists;
   }


   $targets=NULL;

   function getTargets($strData)
   {

//print_r(json_decode($strData)->{'targets'});
      return json_decode($strData)->{'targets'};
   }


   function getScripts($nSprite)
   {
      global $targets;

      $blocks=$targets[$nSprite]->{'blocks'};
print_r($blocks);

      $arrBlocks=Array();

      foreach($blocks as $key=>$arr)
      {
//print_r($arr);
         $arr->{'id'}=$key;
         $arrBlocks[$key]=$arr;
      }


      $d=json_encode($arrBlocks);

//echo $d;
      $scratch= new Scratch3ToC($d,'{}');
      $scratch->compileSB3();
      $arr=$scratch->getCodeInC();

      $data='
             <div class="content '.($nSprite==0?'active':'').'" id="'.$targets[$nSprite]->{'name'}.'">
                <h2>角色名字：</h2>
                <p>'.$targets[$nSprite]->{'name'}.'</p>
                <h2>角色造型：</h2>
                <p>暂无</p>
                <h2>角色代码：</h2>
                <div class="code-block"><pre>
                    '.implode("",$arr).'</pre>
                </div>
            </div>';


      return $data;
   }


   // 使用示例
   $zipFile = 'archive.zip';
   $targetFile = 'project.json';

   // 检查文件是否存在
   if(fileExistsInZip($SBFILE, $targetFile)) {
      // 读取文件内容
      $content = readFileFromZip($SBFILE, $targetFile);

      if ($content !== false) {
         //echo "文件内容：\n";
         //echo $content;
         $targets=getTargets($content);
      }
   } 
   else {
      echo "文件不存在于ZIP中\n";
   }

?>



<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>标签式内容切换页面</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: #333;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            width: 100%;
            max-width: 900px;
            background-color: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            overflow: hidden;
        }
        
        .tabs-container {
            display: flex;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            padding: 0 20px;
            overflow-x: auto;
        }
        
        .tab {
            padding: 15px 25px;
            cursor: pointer;
            font-weight: 600;
            color: #6c757d;
            border-bottom: 3px solid transparent;
            transition: all 0.3s ease;
            white-space: nowrap;
            position: relative;
        }
        
        .tab:hover {
            color: #495057;
            background-color: rgba(0, 0, 0, 0.03);
        }
        
        .tab.active {
            color: #0d6efd;
            border-bottom-color: #0d6efd;
        }
        
        .tab.active::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 3px;
            background-color: #0d6efd;
        }
        
        .content-container {
            padding: 30px;
            height: 600px; /* 固定高度 */
            overflow-y: auto; /* 内容过多时显示滚动条 */
            position: relative;
        }
        
        .content {
            position: absolute;
            top: 30px;
            left: 30px;
            right: 30px;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.4s ease, transform 0.4s ease;
            pointer-events: none;
        }
        
        .content.active {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
        }
        
        h2 {
            color: #0d6efd;
            margin-bottom: 15px;
            font-size: 1.8rem;
        }
        
        p {
            line-height: 1.6;
            margin-bottom: 15px;
            color: #495057;
        }
        
        .feature-list {
            list-style-type: none;
            margin: 20px 0;
        }
        
        .feature-list li {
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            align-items: center;
        }
        
        .feature-list li:before {
            content: "✓";
            color: #0d6efd;
            font-weight: bold;
            margin-right: 10px;
            font-size: 1.2rem;
        }
        
        .code-block {
            background-color: #f8f9fa;
            border-left: 4px solid #0d6efd;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 5px 5px 0;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
        }
        
        .stats {
            display: flex;
            justify-content: space-around;
            margin: 25px 0;
            text-align: center;
        }
        
        .stat-item {
            flex: 1;
            padding: 15px;
        }
        
        .stat-value {
            font-size: 2.5rem;
            font-weight: bold;
            color: #0d6efd;
            display: block;
        }
        
        .stat-label {
            color: #6c757d;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .tabs-container {
                padding: 0 10px;
            }
            
            .tab {
                padding: 12px 15px;
                font-size: 0.9rem;
            }
            
            .content-container {
                padding: 20px;
                height: 500px; /* 在移动设备上增加高度以容纳更多内容 */
            }
            
            .content {
                top: 20px;
                left: 20px;
                right: 20px;
            }
            
            .stats {
                flex-direction: column;
            }
        }
        
        /* 滚动条样式 */
        .content-container::-webkit-scrollbar {
            width: 8px;
        }
        
        .content-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        
        .content-container::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
        }
        
        .content-container::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="tabs-container">
<?php
if($targets){
      $nTargetLength=count($targets);
      for($i=0;$i<$nTargetLength;$i++)
      {
         echo '            <div class="tab '.($i==0?'active':'').'" data-tab="'.$targets[$i]->{'name'}.'">'.$targets[$i]->{'name'}.'</div>'.PHP_EOL;
      }
}
?>
        </div>
        
        <div class="content-container">

<?php

if($targets){
      $nTargetLength=count($targets);
      for($i=0;$i<$nTargetLength;$i++)
      {
         echo getScripts($i);

      }
}
?>           
       
        </div>
    </div>

    <script>
        // 切换标签功能
        function switchTab(tabId) {
            // 隐藏所有内容
            document.querySelectorAll('.content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 移除所有标签的激活状态
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // 显示选中内容并激活对应标签
            document.getElementById(tabId).classList.add('active');
            event.currentTarget.classList.add('active');
        }
        
        // 为所有标签添加点击事件监听器
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                switchTab(this.getAttribute('data-tab'));
            });
        });
    </script>
</body>
</html>