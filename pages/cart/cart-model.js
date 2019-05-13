import {
  Base
} from '../../utils/base.js';

class Cart extends Base {
  constructor() {
    super();
    this._storageKeyName = 'cart';
  }

  /**
   * 加入购物车(本地缓存)
   * 如果之前没有这样的商品, 则直接添加一条新的记录, 数量为counts
   * 如果有, 则只将相应数量 + counts
   * @params:
   * item - {obj} 商品对象
   * counts - {int} 商品数目
   */
  add(item, counts) {
    var cartData = this.getCartDataFromLocal();

    var isHasInfo = this._isHasThatOne(item.id, cartData);
    if (isHasInfo.index == -1) {
      item.counts = counts;
      item.selectStatus = true; // 设置选中状态
      cartData.push(item);
    } else {
      cartData[isHasInfo.index].counts += counts;
    }

    wx.setStorageSync(this._storageKeyName, cartData);
  }

  /**
   * 从缓存中读取购物车数据
   */
  getCartDataFromLocal() {
    var res = wx.getStorageSync(this._storageKeyName);
    if (!res) {
      res = [];
    }

    return res;
  }

  /**
   * 计算购物车内商品总数量
   */
  getCartTotalCounts() {
    var data = this.getCartDataFromLocal();
    var counts = 0;
    for (let i = 0; i < data.length; i++) {
      counts += data[i].counts;
    }

    return counts;
  }

  /**
   * 判断某个商品是否已经被添加到购物车中, 
   * 并且返回这个商品的数据以及所在数组中的序号
   */
  _isHasThatOne(id, arr) {
    var item,
      result = {
        index: -1
      };
    for (let i = 0; i < arr.length; i++) {
      item = arr[i];
      if (item.id == id) {
        result = {
          index: i,
          data: item
        };
        break;
      }
    }

    return result;
  }

}

export {
  Cart
};