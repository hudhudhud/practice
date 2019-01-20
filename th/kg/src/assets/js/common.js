var commonPage = {
    getmsg: function(self,fun,url,params,status){
        let uri = cfg.baseUrl + url;
        axios.get(uri, {params})
        .then(function(res){
            let resData = res.data;
            if(res.data.status == 0) {
                self[fun](resData.data);
            }else if(res.data.status == 1){
                if(status == 1){
                    let msg = {error: resData.msg};
                    self[fun](msg);
                }
            }
        })
        .catch(function(error){
            console.log(error);
        })
    },
    handleNum: function(items,type){         // 设置数值的类型，正整数
        let myNum = this;
        let numLen = items.length;
        let reg = /\D/g;
        if(type == 'double'){
            reg = /[^\d\.]/g;
        }
        for(let i = 0; i < numLen - 1; i++){
            myNum = myNum[items[i]];
        }
        if(myNum[items[numLen-1]].length==1 && type!=='zero'){
            myNum[items[numLen-1]]=myNum[items[numLen-1]].replace(/[^1-9]/g,'');
        }else{
            myNum[items[numLen-1]]=myNum[items[numLen-1]].replace(reg,'');
        }
    },
    // handleNum: function(item,item1){
    //     if(this[item][item1].length==1){
    //         this[item][item1]=this[item][item1].replace(/[^1-9]/g,'');
    //     }else{
    //         this[item][item1]=this[item][item1].replace(/\D/g,'');
    //     }
    // },
    formatNum: function (str){
        var newStr = "";
        var count = 0;
        if(str){
            str = str.toString();
            if(str.indexOf(".")==-1){
           for(var i=str.length-1;i>=0;i--){
                if(count % 3 == 0 && count != 0){
                    newStr = str.charAt(i) + "," + newStr;
                }else{
                    newStr = str.charAt(i) + newStr;
                }
                count++;
            }
            str = newStr + ".00"; //自动补小数点后两位
        }else{
           for(var i = str.indexOf(".")-1;i>=0;i--){
                if(count % 3 == 0 && count != 0){
                    newStr = str.charAt(i) + "," + newStr;
                }else{
                    newStr = str.charAt(i) + newStr; //逐个字符相接起来
                }
                count++;
            }
            str = newStr + (str + "00").substr((str + "00").indexOf("."),3);
        }
        return str;
        }
        
    }


}
import axios from 'axios'
import cfg from '../../config/config'

export default commonPage;