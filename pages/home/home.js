// pages/home/home.js

/**
 * 引入类
 */
import {Home} from 'home-model.js';

/**
 * 实例化类
 */
var home = new Home();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载(初始化)
   */
  onLoad: function() {
    this._loadData();
  },

  _loadData: function () {
    var id = 1;
    home.getBannerData(id,(res)=>{
      // 异步回调函数
      // 数据绑定
      this.setData({
        'bannerArr':res
      });
    });

    home.getThemeData((res)=>{
      this.setData({
        'themeArr':res
      });
    });

    home.getProductsData((data)=>{
      this.setData({
        productsArr: data
      });
    });

  },

  onProductsItemTap: function (event) {
    var id = home.getDataSet(event, 'id');
    // 页面跳转
    wx.navigateTo({
      url: '../product/product?id='+id,
    })
  },

  onThemesItemTap: function (event) {
    var id = home.getDataSet(event, 'id');
    var name = home.getDataSet(event, 'name');
    wx.navigateTo({
      url: '../theme/theme?id=' + id + '&name=' + name,
    })
  }

})