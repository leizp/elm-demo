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
    longitude:0
  },
  onLoad: function (option) {
    var _this = this;
    _this.fnLoadTopData();
    _this.fnLoadMainData(0,20);
    console.log(option)
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
  fnLoadTopData:function(){
    var _this = this;
    //请求数据
    wx.request({
      url: 'https://mainsite-restapi.ele.me/v2/index_entry?geohash=wx4eh8h59ec1fub4pwyskv&group_type=1&flags[]=F', //图片接口
      data: {},
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        //接口调用成功显示加载动画
        _this.fnProgress();
        // console.log(res.data);
        var len = res.data;
        var shopList1 = [];
        var shopList2 = [];
        //数据分批处理
        for(var i = 0 ; i < 8 ; i++){
          shopList1.push(len[i]);
          if(shopList1[i].link){
            var str = shopList1[i].link;
            str = str.split('_')[5]
            str = decodeURIComponent(str);
            var id = str.slice(3,6);
            shopList1[i].id = id;   
          }
        }
        for(var i = 8 ; i < len.length ; i++){
          shopList2.push(len[i]);
       }
        //刷新视图
        _this.setData({
          topList1:shopList1,
          topList2:shopList2
        }) 
      },
      error:function(){
        console.log("后端出错")
      }
    })
  },
  fnLoadMainData:function(start,end){
    var _this = this;
    var latitude=0;
    var longitude=0;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        latitude = res.latitude;
        longitude = res.longitude;

      wx.request({
          url: 'https://mainsite-restapi.ele.me/shopping/restaurants?latitude='+latitude+'&longitude='+longitude+'&offset='+start+'&limit='+end+'&extras[]=activities', //图片接口
          data: {},
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
  //获取经纬度函数
  fnGetLocation:function(){
    var _this = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        _this.setData({
           latitude:res.latitude,
           longitude:res.longitude
        })
      }
    })
  },
})
