//index.js
//获取应用实例
var app = getApp();
//五秒广告及时也
Page({
  data: {
  },
  onLoad: function (option) {
    var _this = this;
    var id = option.id;
    debugger
  },
  onReady:function(){
    //页面渲染完成
  },
  onShow:function(){
    //页面显示。
    //console.log("页面显示");
  },
  onReachBottom:function(){
    //监听页面上拉触底事件的处理函数
  },
  //加载动画
  fnProgress:function(){
      var _this = this
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration:10000,
        mask:false
      });
      setTimeout(function(){
        wx.hideToast()
      },2000);
  },
  //加载数据函数

})
