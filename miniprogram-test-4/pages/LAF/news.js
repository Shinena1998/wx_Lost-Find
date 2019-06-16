// pages/LAF/news.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNews()
  },
  back:function(){
      wx.navigateBack({
        delta:1
      })
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getNews: function () {
    var that = this
    wx.request({
      url: app.globalData.domain + '/getNews',
      method: 'GET',
      header: app.globalData.header,
      success: function (res) {//连接成功运行
        console.log(res.data)
        that.data.news = res.data
        that.data.count = 0;
        that.data.length = res.data.length - 1;//在倒数第二页才能翻页
        that.setData({
          path: res.data[0].path,
          time:res.data[0].time
        })
        that.showImg(res.data[0].path)
      }
    })
  },
  left:function(){
    if (this.data.count > 0){
      this.showImg(this.data.news[--this.data.count].path)
      this.setData({
        path: this.data.news[this.data.count].path,
        time: this.data.news[this.data.count].time
      })
    } else {
      wx.showToast({
        title: '到首页了',
        icon: 'none'
      })
    }
  },
  right:function(){
    if (this.data.count < this.data.length){
      this.showImg(this.data.news[++this.data.count].path)
      this.setData({
        path: this.data.news[this.data.count].path,
        time: this.data.news[this.data.count].time
      })
    }else{
      wx.showToast({
        title: '到底了',
        icon:'none'
      })
    }
  },
  showImg:function(info){
    var that = this
    wx.getSystemInfo({
      success(res) {
        console.log(res.windowWidth)
        that.data.windowWidth = res.windowWidth;
        var size = info.split("+")
        //默认照片不会被切分，所以长度为1
        if (size.length > 2) {
          console.log(size)
          var height = parseInt(size[1])
          var width = size[2]
          /**
           * 如果宽适应屏幕长度，高等比例变化
           */
          var a = width / that.data.windowWidth
          width = that.data.windowWidth
          height = height / a
          if (height != null & width != null) {
            that.setData({
              imgHeight: height,
              imgWidth: width
            })
          }
        }
      }
    })
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