// pages/LAF/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['名称', '时间', '地点', '详情'],
    labelList: ['学生证', '身份证', '公交卡', '洗澡卡', '水杯', '雨伞', '手机', '钥匙','眼镜','大物','高数'],
    storyList: ['蓝色的小钱包','黑色的双肩背包','红色透明的水杯'],
    infoList:[],
    InfoList:[],
    index:0,
    show:true,
  },
  /**
   * 查看失物详细信息
   */
  comein: function (e) {
    // console.log(e)
    // console.log(this.data.category[e.currentTarget.dataset.index])
      wx.setStorageSync('infor', this.data.InfoList[e.currentTarget.dataset.index])
      wx.navigateTo({
        url: 'detail',
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.openid)
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
    wx,wx.request({
      url: 'http://127.0.0.1:8081/search/history/'+app.globalData.openid,
      header: {
        'content-type':"application/json"
      },
      method: 'GET',
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
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
   * 选择搜索类型
   */
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 点击搜索获取用户搜索字符串
   */
  search2:function(res){
    if (res.detail.value.text==""){
      wx.showToast({
        title: '请输入搜索内容',
        icon:'none'
      })
    }else{
      this.data.storyList.unshift(res.detail.value.text)
      console.log(this.data.storyList)
      if (this.data.storyList.length > 10) {
        this.data.storyList.splice(9, 1)
      }
      wx.request({
        url: 'http://127.0.0.1:8081/search/history',
        method: "PUT",
        header: {
          'content-type': 'application/json',
        },
        data: {
          openid: app.globalData.openid,
          historyList: this.data.history
        },
        success: function (res) {
          console.log(res)
        }
      })
      this.search(res.detail.value.text)
    }
  },
  /**
   * 点击键盘搜索获取用户搜索字符串
   */
  search1: function (res) {
    if (res.detail.value == "") {
      wx.showToast({
        title: '请输入搜索内容',
        icon:'none'
      })
    } else {
      this.data.storyList.unshift(res.detail.value.text)
      console.log(this.data.storyList)
      if (this.data.storyList.length > 10){
        this.data.storyList.splice(9,1)
      }
      wx.request({
        url: 'http://127.0.0.1:8081/search/history',
        method:"PUT",
        header:{
          'content-type':'application/json',
        },
        data:{
          openid:app.globalData.openid,
          historyList:this.data.storyList
        },
        success:function(res){
          console.log(res)
        }
      })
      this.search(res.detail.value)
    }
  },
  /**
   * 搜索方法
   */
  search: function (res) {
    var that = this
    wx.request({
     url: 'http://127.0.0.1:8081/search/'+that.data.index+'/'+res,
     method:'GET',
     success:function(res){
       if(res.data.length == 0){
         wx.showToast({
           title: '未找到该内容',
           icon:"none"
         })
       }else{
         that.setData({
           show:false,
           InfoList : res.data
         })
         that.data.infoList = res.data
         that.infoCss();
       }
     }
   })
  },
  infoCss: function () {
    for (var i = 0; i < this.data.infoList.length; i++) {
      if (this.data.infoList[i].kind == "招领") {
        this.data.infoList[i].place = "拾取地点:" + this.data.infoList[i].place
        this.data.infoList[i].time = "拾取时间:" + this.data.infoList[i].time
      } else if (this.data.infoList[i].kind == "遗失") {
        this.data.infoList[i].place = "丢失地点:" + this.data.infoList[i].place
        this.data.infoList[i].time = "丢失时间:" + this.data.infoList[i].time
      }
    }
    this.setData({
      infoList: this.data.infoList
    })
  },
  fastSearch:function(res){
    this.search(this.data.labelList[res.currentTarget.dataset.index])
  }
})