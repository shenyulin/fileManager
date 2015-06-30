var http = require("http");
var fs = require("fs");
var path = require("path");
var server = http.createServer(function (req, res) {
    //获取文件的路劲
    var filePath = path.resolve();

    //系统份文件分隔符
    var sep=path.sep;
    //console.log( "系统份文件分隔符"+path.sep);

    //获取请求的url
    if(req.url=="/"){
        // console.log(req.url);
    }else{
        filePath=filePath+"/"+req.url;
    }

    console.log(filePath);

    //判断文件是否存在
    fs.exists(filePath,function(exists){

        //文件存在
        if(exists){

            //遍历文件
            fs.readdir(filePath,function(err,files){
                if(err){
                    res.end(err);
                }else{
                    var  addStr="";
                    files.forEach(function(file){

                        //获取当文件的路劲
                        var pathname = path.join(filePath, file);


                        var relPath=path.relative(filePath,file);
                        console.log("相对路径"+relPath.toString())


                        //extname获取文件后缀名
                        //console.log("extname"+path.extname(__filename));

                        //判断是文件夹还是文件
                        if (fs.statSync(pathname).isDirectory()) {
                            addStr+='<a href="/'+file+'">'+file+'</a><br/>';
                        }
                        else{
                            //判断文件的类型
                            res.writeHead(200, {"Content-Type": "text/html"});
                            // console.log("文件名称："+file);


                            //打开文件
                            //fs.open(file,"r","0666",function(err,fd){
                            //     console.log(fd);
                            //});
                        }
                    });
                    res.end(addStr);
                }
            });

        }else{
            res.writeHead(404, {"Content-Type": "text/html"});
            res.write('<span style="color:red">"'+filePath + '"</span> was not found on this server.');
            res.end();
        }
    });



});
server.listen(8080);
