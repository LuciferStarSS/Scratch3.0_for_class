<?php
ini_set('memory_limit','1024M');
set_time_limit(0);

$data=file_get_contents("../../../../projects/editor/js/projects.bundle.js");
echo strlen($data)."<br>";

$data=str_replace("https://./static/asset","./static/asset",$data);
echo strlen($data)."<br>";

$data=str_replace("\\\"/get/\\\"","\\\"\\\"",$data);
echo strlen($data)."<br>";

$data=str_replace("concat(this.assetHost, \\\"/internalapi/asset/\\\")","concat(\\\"./\\\", \\\"./asset/\\\")",$data);
echo strlen($data)."<br>";

$data=str_replace("concat(basePath, \\\"static/blocks-media/\\\")","concat(\\\"./\\\", \\\"static/blocks-media/\\\")",$data);
echo strlen($data)."<br>";


$data=str_replace("module.exports = \\\"/static/assets/","module.exports = \\\"./static/assets/",$data);
echo strlen($data)."<br>";

file_put_contents("../../../../projects/editor/js/projects.bundle.js",$data);