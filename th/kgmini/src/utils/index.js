import { baseUrl } from "../service/config";
import { defaultOptions } from "../service/httpRequest";

function formatNumber(n) {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
}

export function formatTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const t1 = [year, month, day].map(formatNumber).join("/");
  const t2 = [hour, minute, second].map(formatNumber).join(":");

  return `${t1} ${t2}`;
}

export function isPhone(phone) {
  return /^1\d{10}$/.test(phone + "");
}

// 微信临时路径 转 服务器图片url
export function tempFileToImageUrl(tempUrl) {
  if(!/https?:\/\/tmp/i.test(tempUrl)){
    return Promise.resolve(tempUrl);
  }
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: baseUrl + "/file/upload",
      filePath: tempUrl,
      name: "file",
      header: {
        "randomKey":defaultOptions.header.randomKey
      },
      success: (res) => {
        let data = res.data;
        if(typeof data === 'string'){
          data = JSON.parse(data);
        }
        if (data.status === 0&&data.data) {
          resolve(data.data.qiniuName);
        } else {
          wx.showToast({
            title: data.msg,
            icon: "none",
            duration: 2000
          });
          reject();
        }
        //do something
      },
      error: () => {
        reject();
      }
    });
  });
}

/**
 * file转 url链接
 * @param file 文件流
 * @param type  001（用户头像），002（身份证），
 * @returns {Promise<any>}
 */
export async function uploadImg(file) {
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
          resolve(res.data.qiniuName);
        }
        else {
          reject();
        }
      }
    };
    let form = new FormData(); // FormData 对象
    form.append("file", data); // 文件对象
    xmlhttp.open("POST", baseUrl + '/file/upload', true);
    xmlhttp.send(form);

  });
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

export default {
  formatNumber,
  formatTime,
  isPhone,
  uploadImg
};
