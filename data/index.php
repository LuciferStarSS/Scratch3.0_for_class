<?php
if(!file_exists("./lesson"))  		mkdir("./lesson");//换课记录
if(!file_exists("./config"))  		mkdir("./config");//分组管理
if(!file_exists("./names"))   		mkdir("./names");//名单
if(!file_exists("./pickup"))  		mkdir("./pickup");//暂存盘
if(!file_exists("./progress")) 		mkdir("./progress");//学生进度截屏
if(!file_exists("./scripts")) 		mkdir("./scripts");//同组分享
if(!file_exists("./task"))    		mkdir("./task");//任务
if(!file_exists("./whiteboard"))    	mkdir("./whiteboard");//小白板
if(!file_exists("./diagram"))    	mkdir("./diagram");//流程图/小图板
header("Location: ../");