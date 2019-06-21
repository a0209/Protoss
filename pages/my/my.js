import {
  Address
} from '../../utils/address.js';
import {
  Order
} from '../order/order-model.js';
import {
  My
} from '../my/my-model.js';

var address = new Address();
var order = new Order();
var my = new My();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadData();
    this._getAddressInfo();
  },

  /**
   * 获取用户头像 昵称 订单
   */
  _loadData: function() {
    my.getUserInfo((data) => {
      this.setData({
        userInfo: data
      });
    });

    this._getOrders();  // 获取历史订单
  },

  /**
   * 获取用户地址
   */
  _getAddressInfo: function() {
    address.getAddress((addressInfo) => {
      this._bindAddressInfo(addressInfo);
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
   * 获取用户的所有订单
   */
  _getOrders: function() {
    order.getOrders(this.data.pageIndex, (res) => {
      var data = res.data;

      this.setData({
        orderArr: data
      });
    });
  }

})