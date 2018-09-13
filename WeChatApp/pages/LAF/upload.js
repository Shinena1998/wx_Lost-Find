
Page({
  /**
   * 页面的初始数据
   */
  data: {
    decode:true,
    msg: [],
    savedFilePath: "/pages/img/FB454FA2-B18D-4316-AFD9-75F565A0CB2A.jpeg",
    category:"",
    time:"",
    picPath:"",
    contactWay:"",
    place:"",
    information:"",
    question:"",
    anwer:"",
    openId:"",
    aBoolean:false,
    showModal:false,
    items: [
      { name: '证件', value: '证件' },
      { name: '钱包', value: '钱包' },
      { name: '书本', value: '书本' },
      { name: '其他', value: '其他' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 获取用户session_key,以及判断用户是否已经登录过
   */
  onReady: function () {
  },
  onShow: function () {
  },
  onPullDownRefresh: function () {
  },
 /**
 *获取物品照片 
 */
  uploadImg: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType:'compressed',
      success: function (res) {
        console.log("a"+res)
        that.setData({
          /**
           * 1.在视图界面显示上传图片
           * 2.记录上传图片的临时文件路径，以便后面上传至服务器
           */
          savedFilePath: res.tempFilePaths[0]
        })
      }
    })
  },
  /**
   * 提交用户填写的失物数据
   */
  formSubmit: function (e) {
    var that = this;
    console.log(e.detail)
    var value = e.detail.value
    this.setData({
      contactWay:value.contactWay,
      information:value.info,
      place:value.place,
      time:value.time
    })
    console.log(value.place+this.data.category)
    if (this.data.category == "" || this.data.information == "" 
      || this.data.time == "" || this.data.place == ""
      || this.data.contactWay == ""){
        wx.showToast({
              title: "填完内容",
              icon: "none",
            })
      }else {
        this.showDialogBtn();
      }
  },
  back:function(){
    wx.navigateBack({
      delta:1
    })
  },
  /**
   * 获取失物类型
   */
  radioChange:function(e){
    this.data.category = e.detail.value;
  },

  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },

  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
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
   * 获取用户session_key,以及判断用户是否已经登录过
   * 对话框确认按钮点击事件
   * 获取用户详细信息
   * 将用户信息发送到后端
   */
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
                          openId: res.data.openId,
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
                      fail: function (res) {
                        console.log("fail" + res)
                      },
                      complete: function (res) {
                        console.log("asd" + that.data.category)
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
  writeInfo:function(){
    var that = this;
    var time = new Date();
    var current = time.toLocaleDateString() + time.toLocaleTimeString();
    /**
    * 上传图片，最大10M
    */
    wx.uploadFile({
      url: 'http://localhost:8081/uploadImage',
      filePath: that.data.savedFilePath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      success: function (res) {
        that.setData({
          picPath: res.data
        })
        /**
         * 将所有信息写进数据库
         */
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
                    that.hideModal();
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              }
            }
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
    })
   
  
  },

})