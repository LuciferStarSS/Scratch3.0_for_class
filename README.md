# Scratch3.0_for_class

这是该项目的第二版（V2）
主分支main停更，接下来主要维护V2这个分支。

之前版本，在增加功能的时候没有考虑目录结构，导致很多数据交织在了一起，要修改的话比较麻烦。

此版本将多个功能互相独立开来，比如课堂管理CM，如果不需要，可以直接改名或者删除整个目录。

与此类似的有：积木与文本代码互转功能ScratchToText, 流程图Diagram, 小白板WhiteBoard,暂存盘Pickup。

下图可点击后观看老版本的功能演示。新版本在这个基础上有调整。
[![Watch the video](wiki_resource/%E5%8A%9F%E8%83%BD.png)](https://github.com/LuciferStarSS/Scratch3.0_for_class/raw/main/wiki_resource/demo.mp4)

下图是新版本的界面效果：
<img src=wiki_resource/demo2.png>

<img src=wiki_resource/demo3.png>

本项目的Scratch3.0编辑器，

脱胎于scratch-www( https://github.com/LLK/scratch-www )，当前版本只需要PHP+HTML5，不需要Node.js。

课堂管理功能，是建立在websocket广播服务( https://github.com/zhenbianshu/websocket )的基础上。


注：此版本的用户管理没有使用数据库，班级的配置信息在./include/config.inc.php里，学生的配置信息在./include/names.inc.php里。
           
后续说明，

将逐步在wiki（ https://github.com/LuciferStarSS/Scratch3.0_for_class/wiki ）中发布。


由于开始遵循“BSD 3-Clause "New" or "Revised" License”，所以，我需要逐步地将Scratch字样，从项目中剥离了。

今后，Scratch3.0内核（projects.bundle.js）的更新，将由 https://github.com/LuciferStarSS/scratch3_projects_bundle_js_editor 来完成，

积木与类C语言互转的更新则在此项目中：https://github.com/LuciferStarSS/ScratchToText
