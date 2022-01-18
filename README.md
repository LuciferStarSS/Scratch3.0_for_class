# Scratch3.0_for_class

    本项目的Scratch3.0编辑器，脱胎于scratch-www(https://github.com/LLK/scratch-www)，
而课堂管理功能，则建立在websocket(https://github.com/zhenbianshu/websocket)的基础之上。

    系统需求：Apache2.3+PHP7.5 64位。
    不需要数据库。

    当前项目，目录结构如下：
    ./
       editor/         从scratch-www的Node.JS中剥离出来的Scratch编辑器                
       include/        配置数据
       data/           班级管理数据
            config/    存放班级分组功能需要的数据
                    1/ 班级ID
                    2/
                    3/
            scripts/   存放同组分享功能中的数据
                    1/
                    2/
                    3/
       student_works/                                                               学生作品
                     三（1）班/                                                      班级
                              2022-01-17/                                           日期
                                          backup/                                   超级备份功能数据
                                                 IP_学生名_项目名/时间戳1.SB3         备份数据
                                                 IP_学生名_项目名/时间戳2.SB3         备份数据
                                                 IP_学生名_项目名/时间戳3.SB3         备份数据
                                          IP_学生名_项目名.SB3                       正式提交的数据
                              2022-01-18/
                     六（1）班/
       top/                                                                         作品排行榜
           1/ 班级ID
           2/
           3/
           
未完待续
