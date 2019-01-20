var apiPage = {
  baseUrl: function () {
    let uri = location.href;
	
    if (uri.indexOf('api.chinakeguan.cn') > -1) {
      uri = 'http://api.chinakeguan.cn/';
    } else if (uri.indexOf('.keguanzhongxin.com') > -1) {
      uri = 'http://api.keguanzhongxin.com/';
    } else {
      uri = 'http://api.chinakeguan.cn/';
      //uri = 'http://localhost:8090/';
    }
	
    return uri;
  }(),
  version: 'R181115',
  baseDomain: function () {
    let uri = location.href;
    
    if (uri.indexOf('-test.keguanzhongxin.com') > -1) {
      uri = 'http://img-test.keguanzhongxin.com/';
    } else if (uri.indexOf('.keguanzhongxin.com') > -1) {
      uri = 'http://img-prod.keguanzhongxin.com/';
    } else {
      uri = 'http://img-test.keguanzhongxin.com/';
    }
    
    return uri;
  }()
}

module.exports = apiPage;