import {
  Base
} from '../../utils/base.js';

class Home extends Base {

  /**
   * 构造函数
   */
  constructor() {
    // 调用基类的构造函数
    super();
  }

  /**
   * 获取首页轮播图数据 
   */
  getBannerData(id, callback) {
    var params = {
      url: 'banner/' + id,
      sCallback: function(res) {
        callback && callback(res.items);
      }
    }
    this.request(params);
  }

  /**
   * 获取首页主题数据
   */
  getThemeData(callback) {
    var param = {
      url: 'theme?ids=1,2,3',
      sCallback: function(data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }

  /**
   * 获取首页最近新品数据
   */
  getProductsData(callback) {
    var param = {
      url: 'product/recent',
      sCallback: function(data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }


}

/**
 * 导出
 */
export {
  Home
};