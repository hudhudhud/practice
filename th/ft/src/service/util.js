
export function isPhone(phone) {
    return /^1\d{10}$/.test(phone + '');
}

export function formatDate(date, fmt) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}


export function getCurrentImg(dom) {
    return new Promise((resolve, reject) => {
        const w = dom.clientWidth;
        const h = dom.clientHeight;
        try {
            const canvas = document.createElement('canvas');
            canvas.width = w * 2;
            canvas.height = h * 2;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            const context = canvas.getContext('2d');
            context.scale(2, 2);
            html2canvas(dom, {
                canvas: canvas,
                //  allowTaint: true, //允许污染
                //   taintTest: true, //在渲染前测试图片(没整明白有啥用)
             //   useCORS: true, //使用跨域(当allowTaint为true时这段代码没什么用,下面解释)
            }).then(function (canvas) {
                const imgUri = canvas.toDataURL();  //  获取生成的图片的url
                resolve(imgUri);
            });
        } catch (e) {
            resolve();
        }
    })

}


/**
 * file转 url链接
 * @param file 文件流
 * @param type  001（用户头像），002（身份证），
 * @returns {Promise<any>}
 */
export async function uploadImg(file, type) {
    let data;
    if (file.size > 1024 * 512) {
        data = await fileResizetoFile(file, .7, file.type);
    } else {
        data = file;
    }
    return new Promise((resolve, reject) => {
        let xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4) {// 4 = "loaded"
                if (xmlhttp.status == 200) {// 200 = OK

                    let res = JSON.parse(xmlhttp.response);
                    resolve(res.url);
                }
                else {
                    reject();
                }
            }
        };
        let form = new FormData(); // FormData 对象
        form.append("fileToType", type); // 文件对象
        form.append("uploadFile", data); // 文件对象
        xmlhttp.open("POST", process.env.VUE_APP_BASE_API + '/filenet/upload', true);
        xmlhttp.send(form);

    });
}

/**
 * 获得 省市区数据
 * @param id 省份的id  或 市的id  没有则获取省列表
 * @returns {Array}
 */
export function getAreaList(id) {
    // console.log(areasKeys);
    let str = ',' + areasKeys + ',';
    if (id) {
        let reg = new RegExp(',' + id + '_\\d+\(\?=,\)', 'g');
        let data = str.match(reg);
        if (data) {
            return data.map(i => {
                let key = i.slice(1);
                return {id: key, name: areas[key]};
            });
        } else {
            return [{id: id, name: areas[id]}];
        }

    } else {
        return str.match(/,\d+(?=,)/g).map(i => {
            let key = i.slice(1);
            return {id: key, name: areas[key]};
        });
    }
}


export function fileResizetoFile(file, quality, imgType) {
    return new Promise(resolve => {
        filetoDataURL(file, function (dataurl) {
            dataURLtoImage(dataurl, function (image) {
                canvasResizetoFile(imagetoCanvas(image), quality, resolve, imgType);
            })
        })
    })

}

export function srcToBase64(src) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = function(){
            let base64 = getBase64Image(this);
            resolve(base64);
        }
        image.onerror = function () {
            reject();
        }
        image.src = src;
    })
}

function getBase64Image(img) {
    return imagetoCanvas(img).toDataURL();
}

function imagetoCanvas(image) {
    var cvs = document.createElement("canvas");
    var ctx = cvs.getContext('2d');
    cvs.width = image.width;
    cvs.height = image.height;
    ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
    return cvs;
}

function filetoDataURL(file, fn) {
    var reader = new FileReader();
    reader.onloadend = function (e) {
        fn(e.target.result);
    };
    reader.readAsDataURL(file);
}

function dataURLtoImage(dataurl, fn) {
    var img = new Image();
    img.onload = function () {
        fn(img);
    };
    img.src = dataurl;
}

function canvasResizetoFile(canvas, quality, fn, type) {
    canvas.toBlob(function (blob) {
        fn(blob);
    }, type || 'image/jpeg', quality);
}

