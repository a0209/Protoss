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
   * 本地缓存 保存/更新
   */
  execSetStorageSync(data) {
    wx.setStorageSync(this._storageKeyName, data);
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
   * flag true 考虑商品选择状态
   */
  getCartTotalCounts(flag) {
    var data = this.getCartDataFromLocal();
    var counts = 0;
    for (let i = 0; i < data.length; i++) {
      if (flag) {
        if (data[i].selectStatus) {
          count += data[i].counts;
        }
      } else {
        counts += data[i].counts;
      }
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

  /**
   * 修改商品数量
   * params:
   * id - {int} 商品id
   * counts - {int} 数量
   */
  _changeCounts(id, counts) {
    var cartData = this.getCartDataFromLocal(),
      hasInfo = this._isHasThatOne(id, cartData);
    if (hasInfo.index != -1) {
      if (hasInfo.data.counts > 1) {
        cartData[hasInfo.index].counts += counts;
      }
    }
    //更新本地缓存
    wx.setStorageSync(this._storageKeyName, cartData);
  }

  /**
   * 增加商品数量(购物车)
   */
  addCounts(id) {
    this._changeCounts(id, 1);
  }

  /**
   * 减少商品数量(购物车)
   */
  cutCounts(id) {
    this._changeCounts(id, -1);
  }

  /**
   * 购物车删除商品(可批量)
   */
  delete(ids) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }
    var cartData = this.getCartDataFromLocal();
    for (let i = 0; i < ids.length; i++) {
      var hasInfo = this._isHasThatOne(ids[i], cartData);
      if (hasInfo.index != -1) {
        cartData.splice(hasInfo.index, 1);
      }
    }

    wx.setStorageSync(this._storageKeyName, cartData);
  }

}

export {
  Cart
};