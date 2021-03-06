import {
  Base
} from '../../utils/base.js';

class My extends Base {
  constructor() {
    super();
  }

  /**
   * 得到用户信息
   */
  getUserInfo(cb) {
    var that = this;
    wx.login({
      success: function() {
        wx.getUserInfo({
          success: function(res) {
            typeof cb == "function" && cb(res.userInfo);
          },
          fail: function(res) {
            typeof cb == "function" && cb({
              avatarUrl: '../../imgs/icon/user@default.png',
              nickName: '零食小贩'
            });
          }
        });
      },
    })
  }

}

export {
  My
};