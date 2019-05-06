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
    simpleList:[
      {
        grade:100,
        name:"信誉分"
      },
      {
        grade: 3,
        name: "发布"
      },
      {
        grade: 2,
        name: "找回"
      },
    ],
    msgList:[
      {
      icon: '/pages/img/reply.png',
      id : 4,
      badge: 0,
      name: '@我的',
      bind:'reply'
    }, {
      icon: '/pages/img/about.png',
      id: 5,
      badge: 0,
      name: '关于我的',
      bind:'about'
    }, {
      icon: '/pages/img/system.png',
      id: 6,
      badge: 0,
      name: '系统通知',
      bind:"showAboutMe"
    }],
    sevList: [
      {
        icon: '/pages/img/suggestion.png',
        id: 2,
        badge: 0,
        name: '意见反馈',
        bind: 'reply'
      }, {
        icon: '/pages/img/help.png',
        id: 3,
        badge: 0,
        name: '帮助',
        bind: 'about'
      }, {
        icon: '/pages/img/LAF.png',
        id: 8,
        badge: 0,
        name: '失物招领',
        bind: "system"
      }],
    infoList: [
      {
        icon: '/pages/img/editing.png',
        id: 0,
        badge: 0,
        name: '正在发布',
        bind: 'reply'
      }, {
        icon: '/pages/img/finishInfo.png',
        id: 1,
        badge: 0,
        name: '已完成',
        bind: 'about'
      }, {
        icon: '/pages/img/collect.png',
        id: 10,
        badge: 0,
        name: '已收藏',
        bind: "system"
      }]
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
    if(e.currentTarget.id == 6){
      this.data.msgList[2].badge = 0,
      this.setData({
        msgList: this.data.msgList
      })
    }
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
    console.log(this.data.showAdvice)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.msgList[2].badge = app.globalData.informCount
    this.setData({
      username: app.globalData.userinfo.nickName,
      userPic: app.globalData.userinfo.avatarUrl,
      name: app.globalData.name,
      status: app.globalData.status,
      pushCount:app.globalData.pushCount,
      msgList:this.data.msgList
    })
    var that = this
    wx.request({
      url: app.globalData.domain + '/infoCount',
      method: 'GET',
      header: app.globalData.header,
      data:{
        openid:app.globalData.openid,
      },
      success: function (res) {//连接成功运行
        console.log(res)
        that.data.simpleList[1].grade = res.data.info;
        that.data.simpleList[2].grade = res.data.finish
        that.setData({
          simpleList: that.data.simpleList
        })
      },
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
        this.data.msgList[0].badge = app.globalData.comment.replyNum
      }
      if (app.globalData.comment.infoNum > 0){
        this.data.msgList[1].badge = app.globalData.comment.infoNum
      }
      this.setData({
        msgList: this.data.msgList,
        about: true
      })
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
  showPush:function(){
    wx.setStorageSync('index', 9)
    wx.navigateTo({
      url: 'showInfo',
    })
    console.log(this.data.showHasFinish)
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
      pushCount:0,
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
    console.log("下滑事件")
    wx.switchTab({
      url: 'index',
    })
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