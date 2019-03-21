// pages/LAF/showInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showInfo: false,
    showInfo: false,
    showAboutMe: false,
    showAdvice: false,
    title:"",
    category:[],
    count:0,
    confirm:false,
    comment:[],
  },
  /**
  * 查看失物详细信息
  */
  comein: function (e) {
    // console.log(e)
    // console.log(this.data.category[e.currentTarget.dataset.index])
    if (app.globalData.power) {
      wx.setStorageSync('infor', this.data.category[e.currentTarget.dataset.index])
      wx.navigateTo({
        url: 'detail',
      })
    } else {
      wx.showToast({
        title: '请授权',
        icon: 'none',
      })
    }
  },
  getInfo: function (res) {
    var that = this
    /**
     * 获取非重要信息
     * unshift数组头插
     */
    wx.request({
      url: app.globalData.domain + res,
      method: 'GET',
      header: app.globalData.header,
      data: {
        openid : app.globalData.openid
      },
      success: function (res) {//连接成功运行
        console.log(res.data)
        if (res.statusCode === 200) {
          that.setData({
            category:res.data
          })
        }
      },
      fail: function (res) {//连接失败执行
        wx.showToast({ title: '网络错误' })
      },
      complete: function (res) {//都执行
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var index = wx.getStorageSync('index')
    if (index == 0) {
      this.setData({
        showInfo: true,
      })
      wx.setNavigationBarTitle({
        title: '未结束信息',
      })
      this.getInfo("/aboutMeNot")
    } else if (index == 1) {
      this.setData({
        showInfo: true,
      })
      wx.setNavigationBarTitle({
        title: '已结束信息',
      })
      this.getInfo("/aboutMeHas")
    } else if (index == 2) {
      this.setData({
        showAdvice: true,
      })
      wx.setNavigationBarTitle({
        title: '意见反馈',
      })
    } else if (index == 3) {
      this.setData({
        showAboutMe: true,
      })
      wx.setNavigationBarTitle({
        title: '帮助',
      })
    } else if (index == 4) {
      this.setData({
        showComment: true,
      })
      wx.setNavigationBarTitle({
        title: '@我的',
      })
      this.showComment(index)
    } else if (index == 5) {
      this.setData({
        showComment: true,
      })
      wx.setNavigationBarTitle({
        title: '关于我的',
      })
      this.showComment(index)
    } else if (index == 6) {
      this.setData({
        showSystem: true,
      })
      wx.setNavigationBarTitle({
        title: '系统通知',
      })
    } else if (index == 7) {
      this.setData({
        showInfo: true,
      })
      wx.setNavigationBarTitle({
        title: '已过期信息',
      })
      this.getInfo("/timeout")
    } else if (index == 8) {
      this.setData({
        showLAF: true,
      })
      wx.setNavigationBarTitle({
        title: '失物招领',
      })
    }
  },
  showComment:function(index){
    if (index == 4) {
      this.data.comment = app.globalData.comment.reply;
      for (var i = 0; i < this.data.comment.length; i++) {
        this.data.comment[i].commentInfo.toName = '@' + this.data.comment[i].commentInfo.toName + "："
      }
    } else if (index == 5) {
      this.data.comment = app.globalData.comment.info;
      for (var i = 0; i < this.data.comment.length; i++) {
        if (this.data.comment[i].commentInfo.toUid == "noUid") {
          this.data.comment[i].commentInfo.toName = '';
        } else {
          this.data.comment[i].commentInfo.toName = '@' + this.data.comment[i].commentInfo.toName + "："
        }
      }
    }
    this.setData({
      comment: this.data.comment
    })
  },
  comeIntoInfo:function(res){
    var index = res.currentTarget.dataset.index
    console.log(res);
    wx.setStorageSync("infor", this.data.comment[index].dataInfo);
    wx.navigateTo({
      url: 'detail',
    })
  },
  formSubmit:function(res){
    console.log(res)
    if(res.detail.value.advice == ""){
      wx.showToast({
        title: '建议不能为空',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
    }else {
      var date = new Date();
      wx.request({
        url: app.globalData.domain + '/suggestion',
        header: app.globalData.header,
        method: "POST",
        data: {
          nickName: app.globalData.userInfo.nickName,
          openId: app.globalData.openid,
          suggestion: res.detail.value.advice,
          contactWay: res.detail.value.contactWay,
          date: date.toLocaleString()
        },
        success: function (res) {
          wx.showToast({
            title: '提交成功',
            duration:1500,
            success:function(){
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      })
    }
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
    this.data.category = []
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