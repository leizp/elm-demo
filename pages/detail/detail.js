//index.js
//获取应用实例
var app = getApp();
//五秒广告及时也
Page({
  data: {
    topList1:[],
    topList2:[],
    mainShopList:[],
    index:0,
    latitude:0,
    longitude:0,
    id:0
  },
  onLoad: function (option) {
    var _this = this;
    _this.fnLoadMainData(0,20,option.id);
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
    console.log("已经上拉到底部");
    this.fnProgress();
    var startIndex = this.data.index;
    var endIndex = startIndex+20;
    this.fnLoadMainData(startIndex,endIndex);
    this.setData({
      index:endIndex
    })
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
fnLoadMainData:function(start,end,id){
    var _this = this;
    var latitude=0;
    var longitude=0;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        latitude = res.latitude;
        longitude = res.longitude;
        wx.request({
          url: 'https://mainsite-restapi.ele.me/shopping/restaurants?latitude='+latitude+'&longitude='+longitude+'&keyword=&offset=0&limit=20&extras[]=activities&restaurant_category_ids[]='+id, 
          data: {
          },
          header: {
              'content-type': 'application/json'
          },

          success: function(res) {
              var data = res.data;
              // 图片地址格式处理
              if(data.length != 0 ){
                  for(var j = 0 ; j < data.length ; j++){
                    if(data[j].image_path){
                      var img_url = data[j].image_path;
                      var first = img_url.substring(0,3).charAt(0)+'/'+img_url.substring(1,3)+'/';            
                      img_url = img_url.replace(img_url.substring(0,3),first);
                      if(img_url.charAt(img_url.length-2) === 'n'){
                        data[j].image_path = img_url + '.png';
                      }else{
                        data[j].image_path = img_url + '.jpeg';
                      };
                    }else{
                      data[j].image_path = '';
                    }
                  };
                  var index = _this.data.index + 20;
                  _this.setData({
                    mainShopList:data,
                    index:index
                  })
              }else{
                wx.showModal({
                  title: '提示',
                  content: '已经到最后一页,是否返回首页',
                  success: function(res) {
                    if (res.confirm) {
                      _this.setData({
                        index:0
                      })
                    }
                  }
                });
              }
        },
          error:function(){
              console.log("后端服务器报错");
           }
        })
      }
    })
  },

})
