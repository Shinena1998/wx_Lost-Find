// //index.js
// //获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    image_show: false,
    showModal: false,
    showModal2:false,
    showIndex:true,
    suggestion:"",
    logoLeft: "/pages/img/logo.png",
    logoRight:"/pages/img/2014062374843457.png",
    remind:"申明：无论您是拾者还是失主，请务必认真阅读以下须知谨慎待之",
    userInfo:{},
    docode:true,
    hasUserInfo: false,
    encryptedData:"",
    openid:"",
    session_key:"",
    iv:"",
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  search: function (e) {
    wx.navigateTo({
      url: 'search',
    })
  },
  show_image:function(){
    this.setData({
      image_show:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var remindList = ["申明：无论您是拾者还是失主，请务必认真阅读以下须知谨慎待之","本平台只负责信息传递，失物的保管及完整性由当事人（拾物者）自行负责", "发布失物或寻物信息请注意您的个人信息泄漏，由此造成的手机骚扰等损失本平台不负任何责任", "当有失主已确认失物时，双方自行商讨归还失物，发布消息者及时结束消息", "信息的真实性由发布者自行负责，本平台不负任何责任","通过本平台发布的信息发生任何意外均与本平台无关"]
    var count = 0
    if(app.globalData.power == false){
      that.setData({
        showModal: true,
      })
    }
    setInterval(function () {
        count = (count + 1)%6
        that.setData({
          remind:remindList[count]
        })
      }, 2500)
    /**
    * 获取用户session_key,以及判断用户是否已经登录过
    */
    wx.getUserInfo({
      success: res => {
        /**
         * 记录用户基本信息
         */
        app.globalData.userInfo = res.userInfo
        console.log(res)
        that.data.encryptedData = res.encryptedData
        that.data.iv = res.iv;

        //可以将 res 发送给后台解码出 unionId
        that.setData({
          showModal: false,
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
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
  onShareAppMessage: function () {
    
  },
  /**
   * 用户授权
   */
 getUserInfo: function (e) {
    var that = this
    that.data.encryptedData = e.detail.encryptedData;
    that.data.iv = e.detail.iv;
    /**
    * 判断用户是否为新用户
    */
   wx.request({
     url: app.globalData.domain +'/openid/' + app.globalData.openid,
     method: "GET",
     header: app.globalData.header,
     complete: function (res) {
       /**
        * 用户为新用户，则将用户写入数据库
        */
       if (res.data) {
         that.decodeEncryptedData()
       }
     }
   })
    app.globalData.userInfo = e.detail.userInfo
    if(e.detail.userInfo != null){
      app.globalData.power = true;
    }
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.hideModal();
  },
  /**
   * 进入查看界面
   */
  toService: function (e) {
    e.currentTarget.id = 0;
    /**
     * 这里将json包赋值给app.globalData.category而不是e.currentTarget.id
     * 是为了配合service.js里面的category()函数的参数一致
     */
    app.globalData.category = e;
    wx.navigateTo({
      url: 'service',
    })
  },
  /**
   * 进入发布信息界面
   */
  toUpload: function (e) {
    console.log(e.currentTarget.id);
    /**
     * 因为发布信息种类只是一个raido-group，所以我们只需要把数组对应位置记录就行了
     */
    app.globalData.checked = e.currentTarget.id;
    if(app.globalData.power){
      wx.navigateTo({
        url: 'upload',
      })
    }else {
      wx.showToast({
        title: '请授权',
        icon:"none"
      })
    }  
  },
    /**
   * 
   * 对话框确认按钮点击事件
   * 获取用户详细信息
   * 将用户信息发送到后端
   */
  decodeEncryptedData:function(){
      var that = this;
      wx.request({
        url: app.globalData.domain +'/identity?encryptedData=' + that.data.encryptedData + '&session_key=' + app.globalData.session_key + '&iv=' + that.data.iv,
        header: app.globalData.header,
        method: 'GET',
        success: function (res) {
          console.log(res)
          wx.request({
            url: app.globalData.domain +'/user',
            method: "POST",
            header: app.globalData.header,
            data: {
              nickName: res.data.nickName,
              avatarUrl: res.data.avatarUrl,
              country: res.data.country,
              gender: res.data.gender,
              language: res.data.language,
              openId: res.data.openId,
              city: res.data.city,
              province: res.data.province
            },
            success: function (res) {
            }
          })
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
  showDialogBtn2: function () {
    this.setData({
      showModal2: true
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
  hideModal2: function () {
    this.setData({
      showModal2: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  onCancel2: function () {
    this.hideModal2();
  },
  /**
   * 接收用户建议
   */
  suggestion:function(res){
    console.log(res)
    this.data.suggestion = res.detail.value;
  },
  /**
   * 因为接收用户建议使用bindlur触发的时间，当用户点击完成确定此时使用bindtap触发发送信
   * 息事件，两事件处于竞争状态，不能确定两者先后次序，但这里需求是要先记录用户建议在发送
   * ，所以在发送信息事件用setTimeout延迟执行1s写入操作，保证先得到用户建议后写入后端
   */
  sendSuggestion:function(){
    this.setData({
      showModal2:false
    })
    var that = this
    setTimeout(function(){
      
    },1000)
  },
  toManager:function(){
    if (!app.globalData.isManager){
      wx.navigateTo({
        url: 'manager',
      })
    }else{
      wx.navigateTo({
        url: 'user',
      })
    }
  }
})