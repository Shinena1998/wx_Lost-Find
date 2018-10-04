// pages/LAF/manager.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category:[],
    infor:[],
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
      url: 'http://127.0.0.1:8081/valuable',
      method: 'GET',
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
      url: 'http://127.0.0.1:8081/check/' + id,
      header:{
        'content-type':'application/json'
      },
      method:'PUT',
      data:{
        confirm:res,
      },
      success:function(res){
        console.log(res);
        //更新
        that.search()
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
})