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
    imgHeight:0,
    imgWidth:0,
    contact:"",
    contactWay:"",
    contactList: ['/pages/img/QQ.png ',
                  '/pages/img/WeChat.png',
                  '/pages/img/number.png'],
    isHasFind:'未找到失主',
  },
  /**
   * 返回
   */
  back:function(){
    wx:wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 自动显示对应样式
   */
  onLoad: function (options) {
    this.setData({
      detailInfo: wx.getStorageSync("infor")
    })
    if (this.data.detailInfo.kind == "遗失" ){
      if (this.data.detailInfo.confirm || this.data.detailInfo.timeOut != null ){
        this.setData({
          isHasFind: "失物已被找到"
        })
      }else {
        this.setData({
          isHasFind: "失物未被找到"
        })
      }
    } else if (this.data.detailInfo.kind == "招领" ){
      if (this.data.detailInfo.confirm || this.data.detailInfo.timeOut != null) {
        this.setData({
          isHasFind: "已找到失主"
        })
      } else {
        this.setData({
          isHasFind: "未找到失主"
        })
      }
    }
    /**
     * 改变联系方式样式
     */
    var StrList = this.data.detailInfo.contactWay.split("+");
    console.log(this.data.contactList[parseInt(StrList[0])])
    this.setData({
      contactWay:this.data.contactList[parseInt(StrList[0])],
      contact:StrList[1]
    })
    /**
     * 图片名格式 height width timestamp openid.type
     * 调整图片大小
     * 默认图片名字无大小信息，并且不会显示，所以不符合正则表达式就不显示
     */
    var height = this.data.detailInfo.picPath.substr(26,3);
    var width = this.data.detailInfo.picPath.substr(30, 3);
    var RegExp = /^\d{3}$/
    if(RegExp.test(height) && RegExp.test(width)){
      this.setData({
        imgHeight: parseInt(height),
        imgWidth: parseInt(width)
      })
    } 
    if (this.data.detailInfo.confirm != null){
      if (app.globalData.openid == this.data.detailInfo.identity) {
        /**
         * 删除标记标记
         */
        console.log("sadsd")
        this.remind(false);
        this.setData({
          isshow: false,
          confirm: true
        })
      }
    }
  },
  /**
   * 一键复制联系方式
   */
  copy:function(){
    wx.setClipboardData({
      data: this.data.contact,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
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
  onShareAppMessage: function (res) {
    console.log(res)
    if(res.from == 'button'){
      console.log(res)
    }
    return {
      title:"失物详细信息",
      path:'/pages/LAF/index'
    }
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
            url: app.globalData.domain +'/finish/' + that.data.detailInfo.id,
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
      url: app.globalData.domain +'/get_access_token',
      method: "GET",
      header: app.globalData.header,
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
      url: app.globalData.domain +'/confirm/' + this.data.detailInfo.id,
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
      url: app.globalData.domain +'/sendTemplateInfo',
      method:'GET',
      header: app.globalData.header,
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