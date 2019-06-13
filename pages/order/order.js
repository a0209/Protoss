// pages/order/order.js

import {
  Cart
} from '../cart/cart-model.js';
import {
  Order
} from '../order/order-model.js';
import {
  Address
} from '../../utils/address.js';

var cart = new Cart();
var order = new Order();
var address = new Address();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var productsArr;
    this.data.account = options.accounts;

    productsArr = cart.getCartDataFromLocal(true);

    this.setData({
      productsArr: productsArr,
      account: options.account,
      orderStatus: 0
    });

    // 显示收获地址
    address.getAddress((res) => {
      this._bindAddressInfo(res);
    });
  },

  /**
   * 添加/修改 地址
   */
  editAddress: function(event) {
    var that = this;
    wx.chooseAddress({
      success: function(res) {
        console.log(res);
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        }

        that._bindAddressInfo(addressInfo);

        // 保存地址
        address.submitAddress(res, (flag) => {
          if (!flag) {
            that.showTips('操作提示', '地址信息更新失败');
          }
        });
      }
    })
  },

  /**
   * 提示窗口
   * params:
   * title - {string}标题
   * content - {string}内容
   * flag - {bool}是否跳转到 "我的页面"
   */
  showTips: function(title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function(res) {
        if (flag) {
          wx.switchTab({
            url: '/pages/my/my'
          });
        }
      }
    });
  },

  /**
   * 绑定地址信息
   */
  _bindAddressInfo: function(addressInfo) {
    this.setData({
      addressInfo: addressInfo
    });
  },

  /**
   * 下单和付款
   */
  pay: function() {
    if (!this.data.addressInfo) {
      this.showTips('下单提示', '请填写您的收货地址');
      return;
    }

    if (this.data.orderStatus == 0) {
      this._firstTimePay();
    } else {
      this._oneMoresTimePay();
    }
  },

  // 第一次支付(从购物车支付)
  _firstTimePay: function() {
    var orderInfo = [],
      productInfo = this.data.productsArr,
      order = new Order();

    for (let i = 0; i < productInfo.length; i++) {
      orderInfo.push({
        product_id: productInfo[i].id,
        count: productInfo[i].counts
      });
    }

    var that = this;
    // 支付分两步, 第一部步是生成订单号, 然后根据订单号支付
    order.doOrder(orderInfo, (data) => {
      // 订单生成成功
      if (data.pass) {
        // 更新订单状态
        var id = data.order_id;
        that.data.id = id;
        // that.data.fromCartFlag = false;

        // 开始支付
        that._execPay(id);
      } else {
        that._orderFail(data); //下单失败
      }
    });
  },

  /**
   * 开始支付
   * params:
   * id - {int}订单id
   */
  _execPay: function(id) {
    var that = this;

    order.execPay(id, (statusCode) => {

      if (statusCode != 0) {
        // 将已将下单的商品从购物车删除
        that.deleteProducts();
        var flag = statusCode == 2;
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id +
            '&flag=' + flag + '&from=order',
        });
      }
    });
  },

  /**
   * 下单失败
   * params:
   * data - {obj} 订单结果信息
   */
  _orderFail: function(data) {
    var nameArr = [],
      name = '',
      str = '',
      pArr = data.pStatusArray;
    for (let i = 0; i < pArr.length; i++) {
      if (!pArr[i].haveStock) {
        name = pArr[i].name;
        if (name.length > 15) {
          name = name.substr(0, 12) + '...';
        }
        nameArr.push(name);
        if (nameArr.length >= 2) {
          break;
        }
      }
    }
    str += nameArr.join('、');
    if (nameArr.length > 2) {
      str += '等';
    }
    str += '缺货';
    wx.showModal({
      title: '下单失败',
      content: str,
      showCancel: false,
      success: function(res) {

      }
    });
  },

  // 将已将下单的商品从购物车删除
  deleteProducts: function() {
    var ids = [],
      arr = this.data.productsArr;
    for (let i = 0; i < arr.length; i++) {
      ids.push(arr[i].id);
    }
    cart.delete(ids);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})