Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    showModal1:false,
    items: [
      { name: '证件', value: 'card' },
      { name: '钱包', value: 'money' },
      { name: '书本', value: 'book' },
      { name: '其他', value: 'else' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  onReady: function () {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res.code)
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxc8c90d2d684c76a0&secret=7f24acb9cb4cf67e2fd57993032de4dc&js_code=' + res.code + '&grant_type=authorization_code',
            method: 'GET',
            success: function (res) {
              that.setData({
                session_key: res.data.session_key
              })
            },
            fail: function (res) {
              console.log("f" + res)
            },
            complete: function (res) { },
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  onShow: function () {
  },
  onPullDownRefresh: function () {
  },
  uploadImg: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        that.setData({
          tempFilePath: res.tempFilePaths[0]
        })
        wx.saveFile({
            tempFilePath: that.data.tempFilePath,
            success: function (res) {
            //  console.log(this.tempFilePath+"asd")
              that.setData({
                savedFilePath: res.savedFilePath,
                picPath: res.savedFilePath
              })
              console.log(res.savedFilePath)
              // wx.getFileInfo({
              //   filePath: res.savedFilePath,
              //   success(res) {
              //     console.log(res.size)
              //     console.log(res.digest)
              //   },
              //   fail(res) {
              //     console.log(res)
              //   }
              // })
            },
          })
      }
    })
  },
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
        this.showDialogBtn1();
      }
  },
  back:function(){
    wx.navigateBack({
      delta:1
    })
  },
  radioChange:function(e){
    this.data.category = e.detail.name;
  },
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  showDialogBtn1: function () {
    this.setData({
      showModal1: true
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
  Cancel:function(){
    this.setData({
      showModal1: false
    })
    this.showDialogBtn();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    var that = this;
    wx.request({
      url: 'http://127.0.0.1:8081/msg',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        category: this.data.category,
        time: this.data.time,
        picPath: this.data.picPath,
        contactWay: this.data.contactWay,
        place: this.data.place,
        infomation: this.data.information,
        aBoolean:false,
        question: this.data.question,
        anwer:this.data.anwer,
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.code == 12) {
            wx.showToast({
              title: res.data.msg,
              icon: "none",
            })
          } else if (res.data.code == 0) {
            wx.showToast({
              duration: 5000,
              title: res.data.msg,             
              success: function () {
                that.hideModal();
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }
        } 
      }
    })
  },
  bindquestion:function(e){
    this.setData({
      question: e.detail.value,
    })
  },
  bindanwer: function (e) {
    this.setData({
      anwer: e.detail.value,
    })
  },
  onGotUserInfo: function (e) {
    console.log(e)
    var that = this
    var res = e
    wx.request({
      url: 'http://localhost:8081/identity?encryptedData=' + res.detail.encryptedData + '&session_key=' + that.data.session_key + '&iv=' + res.detail.iv,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log("sad"+res.data.openId)
        that.setData({
          openId:res.data.openId,
        })
        console.log("sad" + that.data.openId)
      },
      fail: function (res) { },
      complete: function (res) { 
        wx.request({
          url: 'http://127.0.0.1:8081/msg',
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          data: {
            category: that.data.category,
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
          }
        })
      },
    })
  }
})