//app.js
App({

  time : new Date().toLocaleDateString().split("/").join("-"),
  onLaunch: function (ops) {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    console.log(this.globalData.Custom)
    if (ops.scene == 1044) {
      console.log(ops.shareTicket)
    }
    var that = this
    /**
    * 判断用户是否已经授权
    */
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框 
          this.globalData.power = true;
          console.log("zxc" + this.globalData.power)
        }else{
          this.globalData.power = false;
        }
      }
    })
    wx.login({
      success: res => {
        var result = res
        wx.request({
          url: that.globalData.domain + '/getUserInfo',
          method: 'GET',
          header: that.globalData.header,
          data: {
            code: result.code
          },
          success: function (res) {
            console.log('231')
            console.log(res.data)
            that.globalData.openid = res.data.openid;
            that.globalData.session_key = res.data.session_key;
            //获取token
            wx.request({
              url: that.globalData.domain + '/token',
              data:{
                openid:res.data.openid,
              },
              success: function (res) {
                console.log(res)
                that.globalData.header.token = res.data.token,
                  that.globalData.header.openid = res.data.openid
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                  url: that.globalData.domain + '/openid1/' + that.globalData.openid,
                  method: 'GET',
                  header: that.globalData.header,
                  success: function (res) {
                    console.log(res.data)
                    if (res.data.length > 0) {
                      that.globalData.power = true;
                      that.globalData.userinfo = res.data[0];
                    }
                    /**
                    * 判断用户是否为管理员
                    */
                    wx.request({
                      url: that.globalData.domain + '/manager/' + that.globalData.openid,
                      method: 'POST',
                      header: that.globalData.header,
                      success: function (res) {
                        console.log(res.data)
                        that.globalData.finish = true;
                        if (res.data) {
                          that.globalData.isManager = res.data;
                        }
                      }
                    })
                  }
                })
              }
            })
          }
        })
        
      }
    })
  },
  globalData: {
    domain:"http://localhost:8080",
    // domain:'https://api.yuigahama.xyz',
    notice:false,
    finish:false,
    isChangeInfo:false,
    session_key:'',
    userInfo: null,
    status:"普通用户",
    pushCount:0,//推送信息，
    informCount:0,//系统通知数
    name:"请在首页填写",
    perosninfo:null,
    userinfo:null,
    openid:null,
    power:null,
    info:[],//一般物品信息
    valuable:[],//贵重物品
    school:false,//校园用户
    normal:false,//普通用户
    customer:false,//游客
    comment:null,//评论
    imgList:[],
    checked:null,
    isManager:false,
    infoLostCss: { time: "丢失时间", place: "丢失地点" },
    infoFindCss: { time: "拾取时间", place: "拾取地点" },
    category:[],//物品显示类型
    header:{
      'token':null,
      'openid':null,
      "content-type": "application/json",
    }
  },
})