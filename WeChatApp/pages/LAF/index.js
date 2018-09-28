// //index.js
// //获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showModal: true,
    logoLeft: "/pages/img/logo.png",
    logoRight:"/pages/img/2014062374843457.png",
    motto: 'Hello World',
    userInfo:{},
    docode:true,
    hasUserInfo: false,
    encryptedData:"",
    openid:"",
    session_key:"",
    iv:"",
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
      /**
   * 获取用户session_key,以及判断用户是否已经登录过
   */
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxc8c90d2d684c76a0&secret=7f24acb9cb4cf67e2fd57993032de4dc&js_code=' + res.code + '&grant_type=authorization_code',
          method: 'GET',
          success: function (res) {
            console.log(res.data)
            app.globalData.openid = res.data.openid;
            that.data.openid=res.data.openid;
            that.data.session_key=res.data.session_key;
           
            /**
             * 判断用户是否为管理员
             */
            wx.request({
              url: 'http://127.0.0.1:8081/manager/' + that.data.openid,
              method: 'POST',
              success: function (res) {
                if(res.data){
                  app.globalData.isManager = res.data;
                }
              }
            })
          }
        })
      }
    })
    //获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框 
          app.globalData.power = true;         
          wx.getUserInfo({
            success: res => {
              
              /**
               * 记录用户基本信息
               */
              app.globalData.userInfo = res.userInfo
              console.log(res)
              that.data.encryptedData = res.encryptedData
              that.data.iv = res.iv;
              //可以将 res 发送给后台解码出 unionId
              that.setData({
                showModal:false,
                userInfo: res.userInfo,
                hasUserInfo: true,
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  /**
   * 用户授权
   */
 getUserInfo: function (e) {
    var that = this
    that.data.encryptedData = e.detail.encryptedData;
    that.data.iv = e.detail.iv;
    /**
    * 判断用户是否为新用户
    */
   wx.request({
     url: 'http://127.0.0.1:8081/openid/' + that.data.openid,
     method: "GET",
     complete: function (res) {
       /**
        * 用户为新用户，则将用户写入数据库
        */
       if (res.data) {
         that.decodeEncryptedData()
       }
     }
   })
    app.globalData.userInfo = e.detail.userInfo
    if(e.detail.userInfo != null){
      app.globalData.power = true;
    }
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.hideModal();
  },
  /**
   * 进入查看界面
   */
  toService: function (e) {
    console.log(e.currentTarget.id);
    /**
     * 这里将json包赋值给app.globalData.category而不是e.currentTarget.id
     * 是为了配合service.js里面的category()函数的参数一致
     */
    app.globalData.category = e;
    wx.navigateTo({
      url: 'service',
    })
  },
  /**
   * 进入发布信息界面
   */
  toUpload: function (e) {
    console.log(e.currentTarget.id);
    /**
     * 因为发布信息种类只是一个raido-group，所以我们只需要把数组对应位置记录就行了
     */
    app.globalData.checked = e.currentTarget.id;
    if(app.globalData.power){
      wx.navigateTo({
        url: 'upload',
      })
    }else {
      wx.showToast({
        title: '请授权',
        icon:"none"
      })
    }  
  },
    /**
   * 
   * 对话框确认按钮点击事件
   * 获取用户详细信息
   * 将用户信息发送到后端
   */
  decodeEncryptedData:function(){
      var that = this;
      wx.request({
        url: 'http://127.0.0.1:8081/identity?encryptedData=' + that.data.encryptedData + '&session_key=' + that.data.session_key + '&iv=' + that.data.iv,
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success: function (res) {
          that.setData({
            openId: res.data.openId,
          })
          wx.request({
            url: 'http://127.0.0.1:8081/user',
            method: "POST",
            header: {
              'content_type': "applocation/json"
            },
            data: {
              nickName: res.data.nickName,
              avatarUrl: res.data.avatarUrl,
              country: res.data.country,
              gender: res.data.gender,
              language: res.data.language,
              openId: res.data.openId,
              city: res.data.city,
              province: res.data.province
            },
            success: function (res) {
            }
          })
        }
      })
    },
  /**
   * 显示模态对话框
   */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
  * 隐藏模态对话框
  */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  toManager:function(){
    console.log(this.data.openid)
    wx.navigateTo({
      url: 'user',
    })
  }
})