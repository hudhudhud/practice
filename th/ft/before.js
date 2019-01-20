var fs = require("fs");
function before() {
   return new Promise((resolve, reject) => {
       let list = process.argv;
       let api = '';
       for (let i = list.length - 1; i >= 0; i--) {
           if (list[i] === 'test') {
               api = 'test';
               break;
           }
           if (list[i] === 'prod') {
               api = 'prod';
               break;
           }
           if (list[i] === 'local') {
               api = 'local';
               break;
           }
       }
       if(api){
           console.log(api + '环境');
       }
       let apiUrl = '';
       switch (api) {
           case 'local':
               apiUrl = '/api';
               break;
           case 'test':
               apiUrl = 'http://apptest.tofire.cn:8085/zhiyou-mobile';
               //  apiUrl = 'http://192.168.5.20:8085/zhiyou-mobile';
               break;
           case 'prod':
               apiUrl = 'http://api.tofire.cn/zhiyou-mobile';
               break;
       }
       if (apiUrl) {
           fs.writeFile('.env.production', 'VUE_APP_BASE_API=\''+apiUrl+'\'', function(err) {
               if (err) {
                   reject();
                   return console.error(err);
               }
               resolve(api);
           });
       } else {
           resolve(api);
       }
   })
}
exports.run = before;
