var zipper = require("zip-local");
var fs = require("fs");
var path = require('path')

function deleteall(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteall(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
var copyFile = function (srcPath, tarPath, cb) {
    var rs = fs.createReadStream(srcPath)
    rs.on('error', function (err) {
        if (err) {
            console.log('read error', srcPath)
        }
        cb && cb(err)
    })

    var ws = fs.createWriteStream(tarPath)
    ws.on('error', function (err) {
        if (err) {
            console.log('write error', tarPath)
        }
        cb && cb(err)
    })
    ws.on('close', function (ex) {
        cb && cb(ex)
    })

    rs.pipe(ws)
}
var copyFolder = function (srcDir, tarDir, cb) {
    fs.readdir(srcDir, function (err, files) {
        var count = 0
        var checkEnd = function () {
            ++count == files.length && cb && cb()
        }

        if (err) {
            checkEnd()
            return
        }

        files.forEach(function (file) {
            var srcPath = path.join(srcDir, file)
            var tarPath = path.join(tarDir, file)

            fs.stat(srcPath, function (err, stats) {
                if (stats.isDirectory()) {
                    console.log('mkdir', tarPath)
                    fs.mkdir(tarPath, function (err) {
                        if (err) {
                            console.log(err)
                            return
                        }

                        copyFolder(srcPath, tarPath, checkEnd)
                    })
                } else {
                    copyFile(srcPath, tarPath, checkEnd)
                }
            })
        })

        //为空时直接回调
        files.length === 0 && cb && cb()
    })
}

function after(api) {
    let list = process.argv;
    let copy = false;
    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i] === 'copy') {
            copy = true;
            break;
        }
    }
    return new Promise((resolve, reject) => {
        let name = 'dist';
        switch (api) {
            case 'local':
                name = '';
                break;
            case 'test':
                name = '测试';
                break;
            case 'prod':
                name = '线上';
                break;
        }
        if(name){
            zipper.sync.zip("dist").compress().save("dist/"+name+".zip");
        }
        if (copy||api === 'local') {
            // 删除 dist2
            try {
                deleteall('dist2');
            } catch (e) {
                console.log('删除文件报错');
                console.log(e);
                return;
            }
            // 创建dist2 文件夹
            fs.mkdir("dist2", function (err) {
                if (err) {
                    reject();
                    return console.error(err);
                }
                // 拷贝文件至dist2
                copyFolder('dist', 'dist2', function (err) {
                    if (err) {
                        reject();
                        return
                    }
                    resolve();
                })
            });

        } else {
            resolve()
        }
    })
}

exports.run = after;
