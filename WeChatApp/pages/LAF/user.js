// pages/LAF/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:"",
    userPic:'',
    showNotFinish:false,
    labelNot:'〉',
    showHasFinish: false,
    labelHas:'〉',
    showAboutMe:false,
    labelMe:'〉',
    showAdvice:false,
    labelAdvice:'〉',
    replyNum:0,
    aboutNum:0,
    systemNum:0,
    reply:false,
    about:false,
    system:false,
  },
  toService: function () {
    wx.switchTab({
      url: 'service',
    })
  },
  toUpload: function () {
    wx.switchTab({
      url: 'upload',
    })
  },
  toIndex: function () {
    wx.switchTab({
      url: 'index',
    })
  },
  /**
   * 显示未完成信息
   */
  showNotFinish:function(e){
    console.log(e.currentTarget.id)
    wx.setStorageSync('index', e.currentTarget.id)
    wx.navigateTo({
      url: 'showInfo',
    })
    console.log(this.data.showNotFinish)
  },
  /**
   * 显示已结束信息
   */
  showInfo: function (e) {
    console.log(e.currentTarget.id)
    wx.setStorageSync('index', e.currentTarget.id)
    wx.navigateTo({
      url: 'showInfo',
    })
    console.log(this.data.showHasFinish)
  },
  /**
   * 显示关于失物招领
   */
  showAboutMe: function (e) {
    console.log(e.currentTarget.id)
    wx.setStorageSync('index', e.currentTarget.id)
    wx.navigateTo({
      url: 'showInfo',
    })
    console.log(this.data.showAboutMe)
  },
  /**
   * 显示我的建议
   */
  showAdvice: function (e) {
    console.log(e.currentTarget.id)
    wx.setStorageSync('index', e.currentTarget.id)
    wx.navigateTo({
      url: 'showInfo',
    })
    // if (this.data.showAdvice) {
    //   this.setData({
    //     showAdvice: false,
    //     labelAdvice: '〉'
    //   })
    // } else {
    //   this.setData({
    //     showAdvice: true,
    //     labelAdvice: '﹀'
    //   })
    // }
    console.log(this.data.showAdvice)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      username: app.globalData.userInfo.nickName,
      userPic: app.globalData.userInfo.avatarUrl,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.request({
      url: app.globalData.domain + '/msg',
      method: 'GET',
      header: app.globalData.header,
      success: function (res) {//连接成功运行
        console.log(res)
      },
      fail: function (res) {//连接失败执行
        wx.showToast({ title: '网络错误' })
      },
      complete: function (res) {//都执行
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.request({
      url: app.globalData.domain + '/getPersonComment',
      method: 'GET',
      header: app.globalData.header,
      data: {
        openid: app.globalData.openid,
      },
      success: function (res) {
        console.log(res)
      }
    })
    if(app.globalData.comment != null){
      if (app.globalData.comment.replyNum > 0){
        this.setData({
          replyNum: app.globalData.comment.replyNum,
          reply: true,
        })
      }
      if (app.globalData.comment.infoNum > 0){
        this.setData({
          aboutNum: app.globalData.comment.infoNum,
          about: true
        })
      }
    }
  },
  //@我消息
  reply:function(e){
    wx.setStorageSync('index', e.currentTarget.id)
    wx.request({
      url: app.globalData.domain + '/changePersonComment/'+app.globalData.openid+"/"+this.data.replyNum+'/0',
      method: 'POST',
      header: app.globalData.header,
      success:function(res){
      }
    })
    app.globalData.comment.replyNum = 0;
    wx.navigateTo({
      url: 'showInfo',
    })
  },
  //关于评论
  about: function (e) {
    wx.setStorageSync('index', e.currentTarget.id)
    wx.request({
      url: app.globalData.domain + '/changePersonComment/' + app.globalData.openid + "/" + this.data.aboutNum + '/1',
      method: 'POST',
      header: app.globalData.header,
      success: function (res) {
      }
    })
    app.globalData.comment.aboutNum = 0;
    wx.navigateTo({
      url: 'showInfo',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("页面隐藏")
    this.setData({
      replyNum: 0,
      aboutNum: 0,
      reply: false,
      about: false,
    })
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

  }
})