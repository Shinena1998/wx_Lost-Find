const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detailInfo:{},
    message:"",
    access_token:'',
    formId:'',
    nickName:'',
    infoCss:{},
    confirm:null,
    isshow:true,
    showModal:false,
  },

  /**
   * 自动显示对应样式
   */
  onLoad: function (options) {
    this.setData({
      detailInfo: wx.getStorageSync("infor")
    })
    if (this.data.detailInfo.kind == "遗失"){
      this.setData({
        infoCss:app.globalData.infoLostCss
      })
    } else if (this.data.detailInfo.kind == "招领"){
      this.setData({
        infoCss: app.globalData.infoFindCss
      })
    }
    /**
     * 删除标记标记
     */
    this.remind(false);
    if(app.globalData.openid == this.data.detailInfo.identity){
      this.setData({
        isshow:false,
        confirm:true
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
   * 发布信息者结束事件
   */
  finish:function(){
    var that = this
    wx.showModal({
      title: '操作确认',
      content: '是否确定',
      confirmColor:'green',
      success:function(res){
        if(res.confirm){
          wx.request({
            url: 'http://localhost:8080/finish/' + that.data.detailInfo.id,
            method: 'DELETE',
            header: app.globalData.header,
            success: function (res) {
              wx.showToast({
                title: '删除成功',
                icon:'success',
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
  /**
   * 失主留言
   */
  message:function(res){
    console.log("ads")
    console.log(this.data.detailInfo)
    this.data.message = app.globalData.userInfo.nickName+":"+res.detail.value
    this.setData({

    })
  },
  /**
   * 获取formId以及access_token用于发送模板
   */
  get_access_token:function(res){
    var that = this
    that.setData({
      formId: res.detail.formId
    })
    wx.request({
      url: 'http://localhost:8080/get_access_token',
      method: "GET",
      success: function (res) {
        that.setData({
          access_token: res.data.access_token
        })
        //加标记
        that.remind(true);
        //发模板信息
        that.sendMessage();
      }
    })
       
  },
  /**
   * 提醒拾取人失主找到失物，待确认
   */
  remind:function(res){
    console.log(res)
    wx.request({
      url: 'http://localhost:8080/confirm/' + this.data.detailInfo.id,
      method: 'PUT',
      header: app.globalData.header,
      data: {
        confirm: res
      },
      success: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 发送模板信息
   */
  sendMessage:function(){
    wx.showToast({
      title: '正在发送',
      icon: 'loading',
      duration: 1500,
    })
    if (this.data.message == "") {
      this.setData({
        message: app.globalData.userInfo.nickName + ":谢谢"
      })
    }
    var that = this
    console.log(that.data.detailInfo.id)
    /**
     * 添加标记
     */
    that.remind(true);
    var time = new Date();
    var current = time.toLocaleDateString() + time.toLocaleTimeString();
    wx.request({
      url: 'http://localhost:8080/sendTemplateInfo',
      method:'GET',
      data:{
        accessToken:that.data.access_token,
        openid:that.data.detailInfo.identity,
        formId:that.data.formId,
        category: that.data.detailInfo.category,
        current:current,
        nickName:app.globalData.userInfo.nickName,
        message:that.data.message
      },
      success:function(res){
        console.log(res)
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 1000,
          success:function(){
            setTimeout(function(){
              wx.navigateBack({
                delta: 1,
              })
            },1000) 
          }
        }) 
      }
    })
    
  },
  affirm:function(){

  }
  })