import {
  Config
} from '../utils/config.js';

class Base {
  constructor() {
    this.baseRequestUrl = Config.restUrl;
  }

  request(params) {
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

        //与上面等同
        params.sCallback && params.sCallback(res.data);
      },
      fail: function(err) {
        console.log(err);
      }
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