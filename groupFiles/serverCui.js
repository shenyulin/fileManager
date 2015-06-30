var http = require('http');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var util=require('util');

http.createServer(function (req, res) {
    process.on('uncaughtException', function (err) {
        res.end(util.inspect(err));
    })
    var pathname = path.normalize(req.url).substr(1);
    console.log(pathname);

    if (pathname.toLowerCase().indexOf('c:') != -1) {

        res.end('禁止访问');
    }
    fs.exists(pathname, function (exists) {
        if (exists) {
            res.writeHead(200,{'Content-Type':'text/html'})

            var status = fs.statSync(pathname);
            if (status.isFile()) {
                res.writeHead(200, {'Content-Type': mime.lookup(path.basename(pathname))});
                fs.readFile(pathname, function (err, data) {
                    if(err){
                        res.end(util.inspect(err));
                    }else{
                        res.end(data);
                    }
                })
            } else if (status.isDirectory()) {
                fs.readdir(pathname, function (err, files) {
                    if (err) {

                        res.writeHead(500, {'Content-Type': 'text/plain'})
                        res.end('服务器错误');
                    } else {

                        res.write('<ul>')
                        for (var fileIndex in files) {
                            var status = fs.statSync(path.join(pathname, files[fileIndex]));
                            var subPathName = path.join(pathname, files[fileIndex]);
                            if (status.isDirectory()) {

                                res.write('<li><a href="/'+subPathName+'"><font color="green">' + subPathName  + '</font></a></li>');

                            } else if (status.isFile()) {
                                res.write('<li><a href="/'+subPathName+'">' + subPathName + '</a></li>');
                            }
                        }
                        res.end('</ul>')
                    }


                })
            }
        } else {

            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write('<head><meta http-equiv="Content-Type" content="text/html;charset=utf-8"/></head>');
            res.end('资源未找到');
        }
    })

}).listen(3000).setMaxListeners(3);
