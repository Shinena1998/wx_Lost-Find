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
    labelAdvice:'〉'
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
    // if(this.data.showNotFinish){
    //   this.setData({
    //     showNotFinish:false,
    //     labelNot:'〉'
    //   })
    // }else {
    //   this.setData({
    //     showNotFinish: true,
    //     labelNot:'﹀'
    //   })
    // }
    console.log(this.data.showNotFinish)
  },
  /**
   * 显示已结束信息
   */
  showHasFinish: function (e) {
    console.log(e.currentTarget.id)
    wx.setStorageSync('index', e.currentTarget.id)
    wx.navigateTo({
      url: 'showInfo',
    })
    // if (this.data.showHasFinish) {
    //   this.setData({
    //     showHasFinish: false,
    //     labelHas: '〉'
    //   })
    // } else {
    //   this.setData({
    //     showHasFinish: true,
    //     labelHas: '﹀'
    //   })
    // }
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
    // if (this.data.showAboutMe) {
    //   this.setData({
    //     showAboutMe: false,
    //     labelMe: '〉'
    //   })
    // } else {
    //   this.setData({
    //     showAboutMe: true,
    //     labelMe: '﹀'
    //   })
    // }
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

  }
})