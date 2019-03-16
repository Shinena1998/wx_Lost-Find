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
    showCheck:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.search();
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
  showCheck:function(){
    this.setData({
      showCheck:true
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
    this.setData({
      showCheck:false
    })
    var that = this
    wx.request({
      url: app.globalData.domain +'/suggestion',
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