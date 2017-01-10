//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var _this = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              _this.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(_this.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    hasLogin: false
  },
  getShortData:function( len ){
    var data = [{
      id:0,
      src:"../../img/zanhua.png",
      name:"测试0",
      text:"介绍0",
      text2:"说明0"
    },{
      id:1,
      src:"../../img/bank.png",
      name:"测试1",
      text:"介绍1",
      text2:"说明1"
    },{
      id:2,
      src:"../../img/a.png",
      name:"测试2",
      text:"介绍2",
      text2:"说明2"
    },{
      src:"../../img/b.png",
      name:"测试3",
      text:"介绍3",
      text2:"说明3"
    },{
      id:4,
      src:"../../img/like.png",
      name:"测试4",
      text:"介绍4",
      text2:"说明"
    }];
    var tmp = [];
    for(var ndx = 0;ndx <= data.length;ndx++ ) {
      if(len == data[ndx].id){
        var item = data[ndx];
         tmp.push( item );
         console.log(tmp);
         return tmp;
      }
    }
  },
  advertisement:function(){
    wx.navigateTo({
      url: '../../pages/layout/advertisement'
    });
  },
  indexIn:function(){
    wx.navigateTo({
      url: '../../pages/index/index'
    });
  }
})