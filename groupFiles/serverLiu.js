var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require('url');
http.createServer(function(req, res) {
    //icon请求忽略
    if( req.url == '/favicon.ico'){
        res.end(''); return ;
    }
    //网站跟目录
    var filePath = path.resolve();

    //访问请求的文件地址
    var requestPath = url.parse(req.url,true).pathname.replace(/\//g,path.sep);

    //文件在磁盘中的真实地址
    filePath = path.join(filePath,requestPath);
    //判断文件是否存在
    var isExists = fs.existsSync(filePath);
    if(isExists){
        //读取路径是文件还是目录
        var stat = fs.statSync(filePath);
        if(stat.isFile()){
            console.log('this is file');
        }else{
            console.log('this is dir');
        }
        res.end(filePath);
    }else{
        //找不到就返回404
        res.writeHead(404, {
            "Content-Type": "text/html"
        });
        res.end('Not Found');
    }
    //为了方便调试,直接退出,省得ctrl+c
    process.exit(0);
}).listen(88);