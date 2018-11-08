//app.js
App({

  time : new Date().toLocaleDateString().split("/").join("-"),
  onLaunch: function () {
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
        }
      }
    })
    wx.login({
      success: res => {
        var result = res
        //获取token
        wx.request({
          url: that.globalData.domain + '/token',
          success: function (res) {
            console.log(res)
            that.globalData.header.token = res.data.token,
            that.globalData.header.sessionId = res.data.session
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
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
                /**
                * 判断用户是否为管理员
                */
                wx.request({
                  url: that.globalData.domain + '/manager/' + that.globalData.openid,
                  method: 'POST',
                  header: that.globalData.header,
                  success: function (res) {
                    console.log(res.data)
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
  },
  globalData: {
    domain:"http://127.0.0.1:8080",
    session_key:'',
    userInfo: null,
    openid:null,
    power:false,
    category:null,
    checked:null,
    isManager:false,
    infoLostCss: { time: "丢失时间", place: "丢失地点" },
    infoFindCss: { time: "拾取时间", place: "拾取地点" },
    header:{
      'token':'',
      'sessionId':'',
      "content-type": "application/json",
    }
  },
})