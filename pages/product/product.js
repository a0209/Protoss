// pages/product/product.js
import {
  Product
} from 'product-model.js';
import {
  Cart
} from '../cart/cart-model.js';

var product = new Product();
var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    productCount: 1,
    currentTabsIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    this.data.id = id;
    this._loadData();
  },

  _loadData: function() {
    product.getDetailInfo(this.data.id, (data) => {
      this.setData({
        cartTotalCounts: cart.getCartTotalCounts(),
        product: data
      });
    });
  },

  /**
   * 显示选择的数量
   */
  bindPickerChange: function(event) {
    var index = event.detail.value;
    // 获取picker选择器绑定数组选定的索引
    var selectedCount = this.data.countsArray[index];
    this.setData({
      productCount: selectedCount
    })
  },

  /**
   * [商品详情][产品参数][售后保障]的切换
   */
  onTabsItemTap: function(event) {
    var index = product.getDataSet(event, 'index');
    this.setData({
      currentTabsIndex: index
    });
  },

  /**
   * 商品加入购物车
   */
  onAddingToCartTap: function(event) {
    this.addToCart();
    var counts = this.data.cartTotalCounts + this.data.productCount;
    this.setData({
      cartTotalCounts: counts,
    });
  },

  addToCart: function() {
    var tempObj = {};
    var keys = ['id', 'name', 'main_img_url', 'price'];
    for (var key in this.data.product) {
      if (keys.indexOf(key) >= 0) {
        tempObj[key] = this.data.product[key];
      }
    }

    cart.add(tempObj, this.data.productCount);
  },

  /**
   * 跳转购物车
   */
  onCartTap: function(event) {
    wx.switchTab({
      url: '/pages/cart/cart',
    });
  }

})