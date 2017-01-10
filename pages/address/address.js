//index.js
//获取应用实例
var app = getApp();
//五秒广告及时也
Page({
  data: {
    hotcity:[],
    locationObj:{},
    address:{},
    titWord:[],
  },
  onLoad: function (option) {
    var _this = this;
    var id = option.id;
    _this.fnProgress();
    _this.fnGetLocation();
    _this.fnJumpLink();
  },
  onReady:function(){
  },
  onShow:function(){
    var _this = this;
    _this.fnGetHotCity();
    _this.loadData();
    
  },
  //获取当前位置
  fnGuessLocity:function(res){
    var _this = this;
    wx.request({
      url: 'https://mainsite-restapi.ele.me/v1/cities?type=guess',
      data: {
        latitude:res.latitude,
        longitude:res.longitude
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data);
      }
    });
  },
  fnGetHotCity:function(){
    var _this = this;
    wx.request({
      url: 'https://mainsite-restapi.ele.me/v1/cities?type=hot',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        _this.setData({
          hotcity:res.data
        })
      }
    });
  },
  //获取数据
  loadData:function(){
      var _this = this;
      wx.request({
        url: 'https://mainsite-restapi.ele.me/v1/cities?type=group',
        data: {},
        header: {
          'Content-Type': 'application/json'
        },
        method: 'GET',
        success: function(res) {
          //数组排序
          var titWord = [];
          for(var i in res.data){
            titWord.push(i)
          }
          titWord = titWord.sort();
          var address = {};
          for(var i = 0 ; i < titWord.length; i++){
            address[titWord[i]] = res.data[titWord[i]];
          }
          console.log(titWord)
          //数据渲染
          _this.setData({
            address:address,
            titWord:titWord
          })
        }
      });      
  },
  //获取经纬度函数
  fnGetLocation:function(){
    var _this = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var locObj={};
        locObj.latitude = res.latitude;
        locObj.longitude = res.longitude;
        locObj.speed = res.speed;
        locObj.accuracy = res.accuracy;
        console.log(locObj);
        //刷新数据
        _this.setData({
          locationObj:locObj
        });
        _this.fnGuessLocity(res);
        //找城市定位置
      }
    })
  },
  //显示位置
  fnJumpLink:function(){
    var latitude =  this.data.locationObj.latitude;
    var longitude = this.data.locationObj.longitude;
     wx.request({
      url: 'https://mainsite-restapi.ele.me/v2/index_entry?geohash=wx4eh8h59ec1fub4pwyskv&group_type=1&flags[]=F', //图片接口
      data: {},
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
      },
      error:function(){
        console.log("后端出错")
      }
    })
  },
  //跳转
  chose:function(e){
    var _this = this;
    var id = e.currentTarget.id;
    var obj = this.data.address;
    for(var item in obj){
      for(var i = 0 ; i < obj[item].length ; i++){
        if( id == obj[item][i].id){
          var latitude =  obj[item][i].latitude;
          var longitude = obj[item][i].longitude;
          wx.switchTab({
            url: '/pages/index/index?latitude='+latitude+'&longitude='+longitude
          })
        }
      }
    }
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
  onShareAppMessage: function () {
    return {
      title: '饿了吗',
      desc: '还有详情页和首付款页面',
      path: '/page/address/address'
    }
  }
})
