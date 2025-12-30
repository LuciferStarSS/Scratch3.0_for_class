./lesson
        ./$room.inc.php                临时换课记录。<?php $dinfo=Array("YYYYWW","D","N");  //Y:year  W:week  D: day  N:lesson number


./task
      ./$room_$gradeid.inc.php          Scratch项目名：Scratch项目名


./config
        ./$room
               ./$classid.bdpos.dat	白板数据

               ./$classid.group.dat     学生分组信息：姓名,组别;姓名,组别;

               ./$classid.member.dat    组员信息：[[姓名,姓名,姓名],[姓名,姓名,姓名]]

               ./$classid_$grouptype.pos.dat  组员坐标

               ./$classid_group.conf    分组类型。4:四人一组  3:三人一组


./scripts
        ./$room
               /MD5()                    Scratch项目的部分脚本数据，JSON格式。