var process = require('child_process');

var before = require('./before');
var after = require('./after');
async function main() {
    try {
        // 修改api域名
       const api = await before.run();
        // 打包编译
        await new Promise((resolve, reject) => {
            process.exec('npm run build',function (error, stdout, stderr) {
                if (error !== null) {
                    reject();
                    console.log('exec error: ' + error);
                }
                resolve();
                console.log(stdout);
            });
        });
        // 压缩成zip， || copy到dist2
        await after.run(api);
    }catch (e) {
        console.log('报错了');
        console.log(e);
    }



}
main();