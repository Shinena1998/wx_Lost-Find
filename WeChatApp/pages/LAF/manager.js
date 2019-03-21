// pages/LAF/manager.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category:[],
    infor:[],
    suggestion:[],
    reportInfo:[],
    reportComment:[],
    showCheck:true,
    showReport:false,
    shwoAdvice:false,
    //顶部tabar栏显示
    fontColor: ["#69c0ff", "rgb(112, 110, 110)", 'rgb(112, 110, 110)', 'rgb(112, 110, 110)'],
    borderB: ['5rpx solid #69c0ff', '', '', ''],
    code: false,
    remind:"",
    id:0,
  },
  category: function (res) {
    /**
     * 因为执行wx.navigateBack命令由detail返回service界面执行onshow（）方法，所以
     * 要时时记录标签的值，返回时正确跳转到之前的标签，不变化app.globalData.category
     * 的话。 从detail返回service界面标签永远是从index进入service的标签。
     * inAboutMe 这能在我的界面显示提醒图标
     */
    var id =  res.currentTarget.id
    if (id == "0") {
      this.setData({
        fontColor: ["#69c0ff", "rgb(112, 110, 110)", 'rgb(112, 110, 110)', 'rgb(112, 110, 110)'],
        borderB: ['5rpx solid #69c0ff', '', '', '']
      })
      this.setData({
        showCheck: true,
        showReport:false,
        showAdvice:false
      })
    } else if (id == "1") {
      this.setData({
        fontColor: ["rgb(112, 110, 110)", "#69c0ff", 'rgb(112, 110, 110)', 'rgb(112, 110, 110)'],
        borderB: ['', '5rpx solid #69c0ff', '', '']
      })
      this.setData({
        showCheck: false,
        showReport: true,
        showAdvice: false
      })
      this.report()
    } else if (id == "2") {
      this.setData({
        fontColor: ["rgb(112, 110, 110)", 'rgb(112, 110, 110)', "#69c0ff", 'rgb(112, 110, 110)'],
        borderB: ['', '', '5rpx solid #69c0ff', '']
      })
      this.setData({
        showCheck:false,
        showReport: false,
        showAdvice: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 获取重要事件数据
   */
  search:function(){
    this.data.category=[]
    var that = this
    wx.request({
      url: app.globalData.domain +'/valuable',
      method: 'GET',
      header: app.globalData.header,
      data:{
        confirm:true,
      },
      success: function (res) {//连接成功运行
        console.log(res.data)
        that.setData({
          category: res.data,
        })
        console.log(that.data.category)
      },
      fail: function (res) {//连接失败执行
        wx.showToast({ title: '系统错误' })
      },
      complete: function (res) {//都执行
      },
    })  
  },
  //管理员处理贵重信息
  comeIntoValuable: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index;
    wx.setStorageSync("info", this.data.category[index])
    wx.setStorageSync("showType", false)
    wx.navigateTo({
      url: 'managerInfo',
    })
  },
  //获取举报信息
  report:function(){
    var that = this
    wx.request({
      url: app.globalData.domain + '/getReport',
      method: 'GET',
      header: app.globalData.header,
      success: function (res) {//连接成功运行
        console.log(res.data)
        that.setData({
          reportInfo: res.data,
        })
      },
      fail: function (res) {//连接失败执行
        wx.showToast({ title: '系统错误' })
      },
      complete: function (res) {//都执行
      },
    })
  },
  //管理员处理举报信息
  comeIntoInfo:function(e){
    console.log(e)
    var index = e.currentTarget.dataset.index;
    wx.setStorageSync("info", this.data.reportInfo[1][index])
    wx.setStorageSync("showType",true)
    wx.navigateTo({
      url: 'managerInfo',
    })
  },
  
  //获取举报评论
  reportComment: function () {
    var that = this
    wx.request({
      url: app.globalData.domain + '/getReportComment',
      method: 'GET',
      header: app.globalData.header,
      success: function (res) {//连接成功运行
        console.log(res.data)
        that.setData({
          reportComment: res.data,
        })
      },
      fail: function (res) {//连接失败执行
        wx.showToast({ title: '系统错误' })
      },
      complete: function (res) {//都执行
      },
    })
  },
  //管理员决定举报评论
  commentReport: function (e) {
    this.hideModal("close");
    var that = this
    var decide = this.data.code
    var commentid = this.data.reportComment[0][this.data.id].reportId
    wx.request({
      url: app.globalData.domain + '/processComment',
      method: 'GET',
      data: {
        decide: decide,
        id: commentid,
        operator: app.globalData.userinfo.num
      },
      header: app.globalData.header,
      success: function (res) {//连接成功运行
        console.log(res.data)
        wx.showToast({
          title: res.data,
          duration: 1500,
          success: function () {
            that.onShow();
          }
        })
      },
      fail: function (res) {//连接失败执行
        wx.showToast({ title: '系统错误' })
      },
      complete: function (res) {//都执行
      },
    })
  },
  showModal1(e) {
    console.log(e);
    this.setData({
      modalName: "agree",
      code: false,
      remind: "你的操作不会删除该信息",
      id:e.target.id
    })
  },
  showModal2(e){
    this.setData({
      modalName: "agree",
      code: true,
      remind: "你的操作将会删除该信息",
      id: e.target.id
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
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
    this.search();
    this.getSuggestion();
    this.report();
    this.reportComment()
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
   * 提交审核情况
   */
  checked:function(res,id){
    console.log(res)
    var that =this
    wx.request({
      url: app.globalData.domain +'/check/' + id + "/" + res,
      header: app.globalData.header,
      method:'PUT',
      success:function(res){
        if(res.statusCode == 200){
          console.log(res);
          //更新
          that.search()
        }
      }
    })
  },
  
  /**
   * 同意审核
   */
  agree:function(e){
    console.log(e)
    var id = this.data.category[e.currentTarget.id].id
    this.checked(true,id);
  },
  /**
  * 不同意审核
  */
  disagree: function (e) {
    console.log(e)
    var id = this.data.category[e.currentTarget.id].id
    this.checked(false, id);
  },
  /**
   * 获取用户建议
   */
  getSuggestion:function(){
    var that = this
    wx.request({
      url: app.globalData.domain +'/getSuggestion',
      method:"GET",
      header:app.globalData.header,
      success:function(res){
        that.setData({
          suggestion:res.data
        })
        console.log(res.data)
      }
    })
  },
  toUser:function(){
    wx.navigateTo({
      url: 'user',
    })
  }
})