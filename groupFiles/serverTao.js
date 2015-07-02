var fs = require('fs');
var http = require('http');
var path = require('path');
var server = http.createServer(function(req,res){
    res.writeHead(200,{"Content-type":"text/html;charset=utf-8"});//设置头部信息
    var url = req.url;//读取访问的url
    console.log(url);
    var pro = process.cwd();//读取当前程序绝对路径
    var msg = "";//输出字符串
    var urlParam;
    if(url == '/'){
        url = '';
    }
    urlParam = decodeURIComponent( pro + url );//转义
    if(fs.existsSync(urlParam)){//判断文件是否存在
        fs.stat(urlParam,function(err,stats){//如果存在，则判断文件状态是文件夹还是文件
            if(stats.isFile()){//如果是文件，则把文件输出出来
                fs.readFile(urlParam,'utf-8',function(err,data){
                    if(err){
                        res.end('读取出错');
                    }else{
                        res.end(data + "<br><a href='/'>返回根目录</a>");
                    }
                })
            }else if(stats.isDirectory()){//如果是文件夹，则读取文件夹目录
                fs.readdir(urlParam,function(err,arr){
                    if(err){
                        res.end('读取文件出错');
                    }else{
                        msg += "<ul>";
                        arr.forEach(function(a,b){
                            msg += "<li><a href=" + url + '/' + a + ">" + a + "</a></li>";
                        });
                        msg += "<li><a href='/' style='color:darkred'>返回根目录</a></li>";
                        msg += "</ul>";
                    }
                    res.end(msg);
                })
            }
        });
    }else{
        msg += "你访问的文件不存在<br><a href='/'>返回根目录</a>";
        res.end(msg);
    };
}).listen('8080','localhost');