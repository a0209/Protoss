import {
  Config
} from 'config.js';
import {
  Token
} from 'token.js';

class Base {
  constructor() {
    this.baseRequestUrl = Config.restUrl;
  }

  // 当noRefetch为true, 不做未授权重试机制
  request(params, noRefetch) {
    var that = this;
    var url = this.baseRequestUrl + params.url;

    if (!params.type) {
      params.type = 'GET';
    }

    /**
     * 构造请求基类
     */
    wx.request({
      url: url,
      data: params.data,
      method: params.type,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function(res) {
        // 异步回调函数
        // if(params.sCallBack){
        //   params.sCallBack(res);
        // }

        var code = res.statusCode.toString();
        var startChar = code.charAt(0);

        if (startChar == '2') {
          //与上面等同
          params.sCallback && params.sCallback(res.data);
        } else {
          if (code == '401') {
            // token.getTokenFromServer
            // base.request
            if (!noRefetch) {
              that._refetch(params);
            }
          }
          if(noRefetch){
            params.eCallback && params.eCallback(res.data);
          }
        }
      },
      fail: function(err) {
        console.log(err);
      }
    });
  }

  _refetch(params) {
    var token = new Token();
    token.getTokenFromServer((token) => {
      this.request(params, true);
    });
  }

  /**
   * 获得元素上的绑定值
   */
  getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  }

}

export {
  Base
};