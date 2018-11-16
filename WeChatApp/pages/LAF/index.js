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
    console.log('asd'+app.globalData.power)
    /**
     * 因为在开发者工具上是先执行app，然后在执行index
     * 但在手机上是并发执行，两个页面的请求互相竞争，所以有时就会token
     * 还没在app页面生成，这边发送相应请求。所以使用循环定时器没50毫秒验证一次是否
     * 对应数据是否改变
     * 之所以不用setTimeout是因为请求完毕和网速有关系，所以花费时间不确定，直接设置
     * 估计值有可能偏差太大，而循环定时器只会有小于等于50ms的延迟
     */
    var id = setInterval(function(){
      if (app.globalData.power != null) {
        that.setData({
          showModal: !app.globalData.power,
        })
        clearInterval(id)
      }
    },50) 
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
    // wx.request({
    //   url: app.globalData.domain + '/manager',
    //   method: 'GET',
    //   header: app.globalData.header,
    //   success:function(res){
    //     console.log("page")
    //     console.log(res)
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { 
    var that =this
    app.globalData.valuable = []
    app.globalData.category = []
    app.globalData.imgList = []
    /**
     * 需等待获取token后才可发送请求
     */
    var id = setInterval(function () {
      if(app.globalData.header.token != ''){
        that.getValuable()
        clearInterval(id)
      }
    }, 50) 
  },

  /**
   * 优化思路，在index界面获取物品信息，可以减少用户进入service界面是信息加载时间
   * index界面只获得所有重要物品以及一页普通物品数据，其他则继续在service界面获取
   * 从数据库获取信息只会在本页面和service翻页时进行，其他所有操作均直接操作app中的
   * info以及valuable，对内存直接操作，不在从新到数据库获取新数据。
   */
  getValuable: function () {
    var that = this
    /**
    * 获取重要信息
    */
    wx.request({
      url: app.globalData.domain + '/service/info',
      method: 'GET',
      header: app.globalData.header,
      data: {
        confirm: true,
        count: 0
      },
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          app.globalData.valuable.unshift(res.data[i]);
        /**
         * 重要信息标志
         */
          app.globalData.imgList.push('https://yuigahama.xyz/icon/wxc8c90d2d684c76a0.o6zAJs263NmdprVcUBgFb2i-nBmM.GdtfZS12NqUF254c4b5b884095adb13a1a52905b6ca6.png')
        }
        console.log("asd")
        console.log(app.globalData.valuable)
        /**
        * 因为app.globalData.category是json包
        */
        that.getInfo()
      },
      fail: function (res) {//连接失败执行
        wx.showToast({ title: '网络错误' })
      },
    })
  },
  getInfo: function (count) {
    var that = this
    /**
     * 获取非重要信息
     * unshift数组头插
     */
    wx.request({
      url: app.globalData.domain + '/service/info',
      method: 'GET',
      header: app.globalData.header,
      data: {
        confirm: false,
        count: 0
      },
      success: function (res) {//连接成功运行
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.length > 0) {
            app.globalData.info = res.data
            //没有信息且是第一页，不能出现到底了提示。
          } 
        } else {
          console.log("error")
        }
        console.log(app.globalData.category)
      },
      fail: function (res) {//连接失败执行
        wx.showToast({ title: '网络错误' })
      },
      complete: function (res) {//都执行
      },
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
    if (app.globalData.isManager){
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