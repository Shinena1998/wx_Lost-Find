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
    confirm:null,
    isshow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      detailInfo: wx.getStorageSync("infor")
    })
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
            url: 'http://127.0.0.1:8081/finish/' + that.data.detailInfo.id,
            method: 'PUT',
            success: function (res) {
              wx.navigateBack({
                delta:1
              })
            }
          })
        }
      }
    })
  },
  /**
   * 失主留言(未实现)
   */
  message:function(res){
    console.log(app.globalData.userInfo.nickName)
    this.data.message = app.globalData.userInfo.nickName+":res.detail.value"
  },
  /**
   * 获取formId以及access_token用于发送模板
   */
  get_access_token:function(res){
    var that = this
    wx.showModal({
      title: '操作确认',
      content: '是否确定',
      confirmColor: 'green',
      success: function (e) {
        if (e.confirm) {
          that.setData({
            formId: res.detail.formId
          })

          wx.request({
            url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxc8c90d2d684c76a0&secret=7f24acb9cb4cf67e2fd57993032de4dc',
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
        }
      }
    })
  },
  /**
   * 提醒拾取人失主找到失物，待确认
   */
  remind:function(res){
    console.log(res)
    wx.request({
      url: 'http://127.0.0.1:8081/confirm/' + this.data.detailInfo.id,
      method: 'PUT',
      header: {
        'content-type': 'application/json'
      },
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
      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='+that.data.access_token,
      method:'POST',
      data:{
        "touser": that.data.detailInfo.identity,
        "template_id": "RxgaGC2KYvrcsD_ZviRM3pXonDsQUPUrXDPKOrIeESo",
        "form_id": that.data.formId,
        "data": {
          "keyword1": {
            "value": that.data.category,
          },
          "keyword2": {
            "value": "已找到失主"
          },
          "keyword3": {
            "value": that.data.nickName
          },
          "keyword4": {
            "value": current
          },
          "keyword5": {
            "value": that.data.message
          },
          "keyword6": {
            "value": "请您去小程序内确认"
          }
        },
      },
      success:function(res){
        console.log(res)
        wx.navigateBack({
          delta:1,
        })
      }
    })
  },
  affirm:function(){

  }
  })