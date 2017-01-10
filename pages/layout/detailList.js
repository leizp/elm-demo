//logs.js
var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    topList:{},
    shopList:[],
    current:0,
    navTap: [{
        id:0,
        active:true,
        name:"商品"
      },{
        id:1,
        active:false,
        name:"商家"
    }],
  selected:0,
  top:0,
  sumPrice:0,
  },
  onLoad: function (option) {
    var _this = this;
    var id = Number(option.id);
    _this.fnGetTopData(option)
    _this.fnGetData(option.id);
  },
  fnGetTopData:function(obj){
    var _this = this;
    wx.request({
      url: 'https://mainsite-restapi.ele.me/shopping/restaurant/'+obj.id+'?extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics&latitude='+obj.latitude+'&longitude='+obj.longitude,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        console.log(res.data);

        //图片地址处理
         if(res.data.image_path){
            var img_url = res.data.image_path;
            var first = img_url.substring(0,3).charAt(0)+'/'+img_url.substring(1,3)+'/';            
            img_url = img_url.replace(img_url.substring(0,3),first);
            if(img_url.charAt(img_url.length-2) === 'n'){
              res.data.image_path = img_url + '.png';
            }else{
              res.data.image_path = img_url + '.jpeg';
            };
          }else{
            res.data.image_path = '';
          }
          _this.setData({
            topList:res.data
          })
      }
    });
  },
  fnGetData:function(id){
    var _this = this;
    wx.request({
      url: 'https://mainsite-restapi.ele.me/shopping/v2/menu?restaurant_id='+id,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        for(var i  = 0 ; i < res.data.length ; i++){

          if(i>0){
            res.data[i].foodsNum = res.data[i-1].foods.length;
            res.data[i].top = 112*res.data[i].foodsNum+res.data[i-1].top+27;
          }else{
            res.data[0].foodsNum = 0;
            res.data[0].top = 0;
          }
          
          for(var j = 0 ; j < res.data[i].foods.length ; j++){
            if(res.data[i].foods[j].image_path){
              var img_url = res.data[i].foods[j].image_path;
              var first = img_url.substring(0,3).charAt(0)+'/'+img_url.substring(1,3)+'/';            
              img_url = img_url.replace(img_url.substring(0,3),first);
              if(img_url.charAt(img_url.length-2) === 'n'){
                res.data[i].foods[j].image_path = img_url + '.png';
              }else{
                res.data[i].foods[j].image_path = img_url + '.jpeg';
              };
            }else{
              res.data[i].foods[j].image_path = '';
            }
          };           
        }
        
        _this.setData({
          shopList:res.data,
          selected:res.data[0].id
        });
        // console.log(_this.data.shopList)
      }

    });
  },
  tap:function(e){
    console.log("执行了此函数");
    var tabs = this.data.navTap;
    var current = 0;
    for(var i = 0;i < tabs.length;i++ ) {
      if( e.currentTarget.id == tabs[ i ].id ) {
        tabs[i].active = true;
        current = i;
      }else{
        tabs[i].active = false;
      }
    };
    this.setData({
      navTap: tabs,
      current: current
    });
    /*console.log(this.data.navTap);*/
  },
  tabchange:function(e){
    console.log("要实现左右滑动");
    var tabs = this.data.navTap;
    for(var i = 0;i < tabs.length;i++ ) {
      tabs[i].active = e.detail.current == i;
    }
    this.setData( {
      navTap: tabs
    })
  },
  //楼梯商品列表选择
  fnSelect:function(e){
    var _this = this;
    var selectID = e.currentTarget.id;
    var obj = this.data.shopList;
    for(var item in obj){
      if(selectID == obj[item].id){
        var top = -obj[item].top*2;
        /*console.log(top);*/
      }
    }
    _this.setData({
      selected:selectID,
      top:top
    }) 
  },
  fnMoveTop:function(e){
    console.log(e.currentTarget)
  }
})
