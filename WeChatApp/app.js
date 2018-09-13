//app.js
App({
  data:{
    userInfo:"asda",
    decode: true,
    msg: [],
    savedFilePath: "/pages/img/FB454FA2-B18D-4316-AFD9-75F565A0CB2A.jpeg",
    category: "",
    time: "",
    picPath: "",
    contactWay: "",
    place: "",
    information: "",
    question: "",
    anwer: "",
    openId: "",
  },
  onLaunch: function () {
    var that = this
    that.globalData.session_key="ada"
    //console.log(that.globalData.session_key)
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    // 获取用户信息
    wx.getSetting({
      success:res=>{
        console.log("ASD"+res.authSetting['scope.userInfo'])
        if (res.authSetting['scope.userInfo']) {
          console.log("ccvb")
         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
      //         this.globalData.userInfo = res.userInfo
      //         // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      //         // 所以此处加入 callback 以防止这种情况
      //         if (this.userInfoReadyCallback) {
      //           this.userInfoReadyCallback(res)
      //         }
              wx.login({
                success: function (res) {
                  if (res.code) {
                    console.log("tyu" + res.code)



                    wx.request({
                      url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxc8c90d2d684c76a0&secret=7f24acb9cb4cf67e2fd57993032de4dc&js_code=' + res.code + '&grant_type=authorization_code',
                      method: 'GET',
                      success: function (res) {
                        console.log(res)
                        that.globalData.session_key = res.data.session_key,
                          that.globalData.openId = res.data.openid




                        wx.request({
                          url: 'http://127.0.0.1:8081/openid1/' + res.data.openid,
                          method: "GET",
                          success: function (res) {
                            console.log("qwe" + res)

                          },
                          complete: function (res) {
                            console.log(res.data.id)
                            that.data.userInfo = res.data
                            that.data.decode = false;




                            if (that.data.decode) {
                              console.log("decondesd" + that.data.decode)
                              // wx.request({
                              //   url: 'http://localhost:8081/identity?encryptedData=' + e.detail.encryptedData + '&session_key=' + that.data.session_key + '&iv=' + e.detail.iv,
                              //   header: {
                              //     'content-type': 'application/json'
                              //   },
                              //   method: 'GET',
                              //   success: function (res) {
                              //     that.setData({
                              //       openId: res.data.openId,
                              //     })



                              //     // wx.request({
                              //     //   url: 'http://127.0.0.1:8081/user',
                              //     //   method: "POST",
                              //     //   header: {
                              //     //     'content_type': "applocation/json"
                              //     //   },
                              //     //   data: {
                              //     //     nickName: res.data.nickName,
                              //     //     avatarUrl: res.data.avatarUrl,
                              //     //     country: res.data.country,
                              //     //     gender: res.data.gender,
                              //     //     language: res.data.language,
                              //     //     openId: res.data.openId,
                              //     //     city: res.data.city,
                              //     //     province: res.data.province
                              //     //   },
                              //     //   success: function (res) {
                              //     //     that.writeInfo();
                              //     //   }
                              //     // })
                              //   },
                              //   fail: function (res) {
                              //     console.log("fail" + res)
                              //   },
                              //   complete: function (res) {
                              //     console.log("asd" + that.data.category)
                              //   },
                              // })
                            } else {

                            }
                          }
                        })
                      },
                      fail: function (res) {
                        console.log("f" + res)
                      },
                      complete: function (res) {

                      },
                    })
                  } else {
                    console.log('登录失败！' + res.errMsg)
                  }
                }
                })
            }
          })
        }
      }
    })


  },
  globalData: {
    userInfo: null,
    session_key:null
  }
})