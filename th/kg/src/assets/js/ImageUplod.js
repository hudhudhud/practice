/**
 *
 *
 * @param {Object} evt event对象
 * @param {Fucntion} progressCb 回调函数
 */
const uploadProgress = (evt, progressCb) => {
  if (evt.lengthComputable) {
    const percentComplete = Math.round((evt.loaded * 100) / evt.total)
    const percent = percentComplete / 100
    if (typeof progressCb === 'function') {
      progressCb(percent)
    }
  } else {
    console.warn('upload progress unable to compute')
  }
}

/**
 *
 *
 * @param {Object}
 */
const ajax = ({formData, method, url, progressCb, successCb, errorCb}) => {
  let xhr = null
  xhr = new XMLHttpRequest()
  if (url) {
    if (method === 'get') {
      url += '?' + formData + '&_t=' + new Date().getTime()
    }
  }
  xhr.upload.addEventListener('progress', (evt) => uploadProgress(evt, progressCb), false)
  xhr.open(method, url, true)
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (typeof successCb === 'function') {
          const d = JSON.parse(xhr.response)
          successCb(d)
        }
      } else {
        if (typeof errorCb === 'function') {
          errorCb(xhr)
        }
      }
    }
  }
  if (method === 'get') {
    xhr.send(null)
  } else if (method === 'post') {
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(formData)
  }
}

/**
 *
 *
 * @param {Object} {files, size, method, url, progressCb, successCb, errorCb} {上传的图片对象类数组, 图片最大尺寸, 数据传递方法post或get, 上传地址, 进度, 成功回调, 失败回调}
 */
export default ({files, size, method, url, progressCb, successCb, errorCb}) => {
  if (!files.length) {
    return
  }
  if (window.FileReader) {
    for (let i = 0, len = files.length; i < len; i++) {
      const file = files[i]
      if (file.size >= (1024 * 1024 * size)) {
        window.alert(`你选择的文件过大,当前文件大小: ${(file.size / (1024 * 1024)).toFixed(0)}MB,请选择小于${size}MB文件!`)
        return false
      }
      const formData = new FormData()
      formData.append('file', file)
      ajax({
        formData,
        method,
        url,
        progressCb,
        successCb,
        errorCb
      })
    }
  }
}
