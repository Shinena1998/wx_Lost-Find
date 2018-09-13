Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailInfo:{},
    message:"",
    access_token:'',
    formId:'',
    nickName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      detailInfo: wx.getStorageSync("infor")
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
  back: function () {
    wx.navigateBack({
      url: 'service',
    })
  },
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  onCancel:function(){
    this.setData({
      showModal: false
    })
  },
  /**
   * 失主确认找到失物
   */
  affirm:function(){
    this.showDialogBtn();
  },
  onGotUserInfo: function (e) {
    var that = this
    
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res.code)
         
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxc8c90d2d684c76a0&secret=7f24acb9cb4cf67e2fd57993032de4dc&js_code=' + res.code + '&grant_type=authorization_code',
            method: 'GET',
            success: function (res) {
              console.log(res)
              that.setData({
                session_key: res.data.session_key,
                openId: res.data.openid
              })
              
              wx.request({
                url: 'http://127.0.0.1:8081/openid/' + res.data.openid,
                method: "GET",
                complete: function (res) {
                  console.log(res.data)
                  that.setData({
                    decode: res.data
                  })
                 
                  if (that.data.decode) {
                    console.log("decondesd" + that.data.decode)
                    wx.request({
                      url: 'http://localhost:8081/identity?encryptedData=' + e.detail.encryptedData + '&session_key=' + that.data.session_key + '&iv=' + e.detail.iv,
                      header: {
                        'content-type': 'application/json'
                      },
                      method: 'GET',
                      success: function (res) {
                        that.setData({
                          nickName: res.data.nickName,
                        })
                        wx.request({
                          url: 'http://127.0.0.1:8081/user',
                          method: "POST",
                          header: {
                            'content_type': "applocation/json"
                          },
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
                            that.writeInfo();
                          }
                        })
                      },
                    })
                  } else {
                    that.writeInfo();
                  }
                }
              })
            },
            fail: function (res) {
              console.log("f" + res)
            },
            complete: function (res) {

            },
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
    console.log(this.data.decode)

  },

  /**
   * 发送物品信息到后端
   */
  writeInfo: function () {
    var that = this;
    var time = new Date();
    var current = time.toLocaleDateString() + time.toLocaleTimeString();
    wx.request({
      url: 'http://127.0.0.1:8081/msg',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        category: that.data.category,
        current: current,
        time: that.data.time,
        picPath: that.data.picPath,
        contactWay: that.data.contactWay,
        place: that.data.place,
        infomation: that.data.information,
        aBoolean: true,
        identity: that.data.openId
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.code == 12) {
            console.log("asd" + that.data.openId)
            wx.showToast({
              title: "网络错误,获取用户表示失败",
              icon: "none",
            })
          } else if (res.data.code == 0) {
            wx.showToast({
              title: res.data.msg,
              duration: 5000,
              success: function () {
              }
            })
          }
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 失主留言
   */
  message:function(res){
    var message = res.detail.value
    if(message==""){
      message="谢谢"
    }
    this,setData({
      message:message
    })
  },
  /**
   * 获取formId以及access_token
   */
  get_access_token:function(res){
    console.log(res)
    this.setData({
      formId:res.detail.formId
    })
    var that = this
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxc8c90d2d684c76a0&secret=7f24acb9cb4cf67e2fd57993032de4dc',
      method:"GET",
      success:function(res){
        that.setData({
          access_token:res.data.access_token
        })
        that.sendMessage();
      }
    })
  },
  /**
   * 发送模板信息
   */
  sendMessage:function(){
    var that = this
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
        "emphasis_keyword": "keyword1.DATA"
      },
      success:function(res){
        console.log(res)
      }
    })
  },
})