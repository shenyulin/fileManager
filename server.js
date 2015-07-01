var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");
var mime = require('mime');   //文件的类型
var server = http.createServer(function (req, res) {

    //获取文件的路径
    var filePath = path.resolve();

    //icon请求忽略
    if (req.url == '/favicon.ico') {
        res.end();
        return;
    }

    //系统份文件分隔符
    //var sep=path.sep;

    //访问请求的文件地址标准化
    var reqPath = path.normalize(req.url);

    // var reqPath =req.url;


    //获取当文件的路径
    var pathname = path.join(filePath, reqPath);

    //判断文件是否存在
    fs.exists(pathname, function (exists) {

        //文件存在
        if (exists) {

            //判断是否是目录
            if (fs.statSync(pathname).isDirectory()) {
                var addStr = '<link rel="stylesheet" href="/public/css/index.css"/>';
                addStr += '<h1>FileManager system directory</h1>';
                addStr += '<ul>';

                //遍历文件
                fs.readdir(pathname, function (err, files) {
                    res.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});

                    if (err) {
                        console.log(err);
                    } else {
                        files.forEach(function (file) {
                            if (pathname != filePath) {
                                pathname = pathname.replace(filePath, "");
                            }
                            filePath1 = path.join(pathname, file).replace(/\\/g, "/");

                            if (path.extname(file)) {
                                addStr += '<li class="gray"><a href="' + filePath1 + '" style="">' + file + ' </a></li>';
                            } else {
                                addStr += '<li ><a href="' + filePath1 + '" style="">' + file + '</a></li>';
                            }
                        });
                    }
                    res.end(addStr + "</ul><p>提示：以上目录列表，蓝色是文件夹，可点击继续进入下一节。</p>");
                });
            } else if (fs.statSync(pathname).isFile()) {

                //当访问的是文件时，判断文件类型，并读文件
                res.writeHead(200, {'Content-Type': mime.lookup(path.basename(pathname)) + ';charset=utf-8'});
                fs.readFile(pathname, {flag: "r"}, function (err, data) {
                    if (err) {
                        res.end(err);
                    } else {
                        res.end(data);
                    }
                });
            }
        } else {
            res.writeHead(404, {"Content-Type": "text/html"});
            res.write('<span style="color:red">"' + pathname + '"</span> was not found on this server.');
            res.end();
        }
    });

});
server.listen(8080);
