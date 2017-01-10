Page({
    data: {
        showTopTips: false,
        showView:1,
        veriCode:'',
        telNum:'',
        validate_token:'',
        getCode:'获取验证码',
        errMesg:'',
        balance:'',
        gift_acoument:'',
        point:'',
        user:'',
        imgurl:''

    },
    //切换登录方式
    changePage:function(e){
      var num = e.currentTarget.id;
      this.setData({
          showView:num
      })    
    },
    //获取手机号码
    getTelNum:function(e){
      var tel = e.detail.value;
      //正则判断手机号是正确
      this.fnJudgeTel(tel);
      this.setData({
        telNum:tel
      })
    },
    //倒计时发送消息
    countDown:function(){
      var _this = this;
      var timer = null;
      var time = 30;
      timer = setInterval(function(){
            _this.setData({
              getCode:time
            })
          if(time >= 0){
            time--;
          }else{ 
            _this.setData({
              getCode:"重新获取"
            })
            clearInterval(timer);
          }
        },1000);    
    },
    //正则判断手机号是否正确
    fnJudgeTel:function(tel){
      var reg = /[1][3-8]+\d{9}/;
      if(reg.test(tel) == false){
         this.setData({
          errMesg:'手机号不正确',
          showTopTips:true
         })
      }else{
        this.setData({
          showTopTips:false
         })
      }
    },
    //获取验证码
    getMesCode:function(e){
      var _this = this;
      var telNum = _this.data.telNum;
      //倒计时
      _this.countDown();
      //发送请求获得短信验证码
      wx.request({
        url: 'https://mainsite-restapi.ele.me/v4/mobile/verify_code/send', //请求地址
        data: {
          mobile:telNum,
          scene:"login",
          type:"sms"
        },
        method:'POST',
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res.data.validate_token);
          _this.setData({
            validate_token:res.data.validate_token
          })
          console.log("获取短信成功!");
        },
        fail:function(){
          console.log("获取短信失败！");
        }
      })
      
    },
    //获取验证码
    fnGetCode:function(e){
      var _this = this;
      var code = e.detail.value;
      _this.setData({
        veriCode:code
      })
    },
    //提交数据---登录成功
    showTopTips: function(e){
      var _this = this;
      wx.request({
        url: 'https://mainsite-restapi.ele.me/v1/login/app_mobile',
        data: {
          mobile:_this.data.telNum,
          validate_token:_this.data.validate_token,
          code:_this.data.veriCode,
          name:'12334'
        },
        header: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        success: function(res) {
          console.log(res.data);
          console.log("登陆成功");
          //跳转页面,渲染页面
          if(res.data.user_id){
            _this.setData({
              showView:3,
              balance:res.data.balance,
              gift_acoument:res.data.gift_amount,
              point:res.data.point,
              user:res.data.username,
              telNum:res.data.mobile,
              imgurl:res.data.game_image_hash
            })            
          }else{
            _this.setData({
              showView:1
            })            
          }

        }
      });
    },
    formSubmit: function(e) {
      var obj = e.detail.value;
      //取得用户名和密码
      console.log(obj);

    },
});