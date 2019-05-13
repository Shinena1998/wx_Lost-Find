// pages/LAF/showInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showInfo: false,
    showInfo: false,
    showAboutMe: false,
    showAdvice: false,
    title:"",
    category:[],
    count:0,
    confirm:false,
    comment:[],
    id:[],
    systemInfo:[],
    count:0,
    formId:'',
  },
  /**
  * 查看失物详细信息
  */
  comein: function (e) {
    // console.log(e)
    // console.log(this.data.category[e.currentTarget.dataset.index])
    var that = this
    if (wx.getStorageSync('index') == 9) {
      var id = this.data.id[e.currentTarget.dataset.index]
      console.log(this.data.category)
      console.log(id)
      wx.request({
        url: app.globalData.domain + "/writePush",
        method: 'POST',
        header: app.globalData.header,
        data: {
          id: id
        },
        success: function (res) {//连接成功运行
          // that.data.category = that.data.category.splice(e.currentTarget.dataset.index,1)
          // that.setData({
          //   category:that.data.category
          // })
          that.getPushInfo()
        }
      })
    }
    if (app.globalData.power) {
      wx.setStorageSync('infor', this.data.category[e.currentTarget.dataset.index])
      wx.navigateTo({
        url: 'detail',
      })
    } else {
      wx.showToast({
        title: '请授权',
        icon: 'none',
      })
    }
    
  },
  getInfo: function (res) {
    var that = this
    /**
     * 获取非重要信息
     * unshift数组头插
     */
    wx.request({
      url: app.globalData.domain + res,
      method: 'GET',
      header: app.globalData.header,
      data: {
        openid : app.globalData.openid
      },
      success: function (res) {//连接成功运行
        console.log(res.data)
        if (res.statusCode === 200) {
          that.setData({
            category:res.data
          })
        }
      },
      fail: function (res) {//连接失败执行
        wx.showToast({ title: '网络错误' })
      },
      complete: function (res) {//都执行
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var index = wx.getStorageSync('index')
    if (index == 0) {
      this.setData({
        showInfo: true,
      })
      wx.setNavigationBarTitle({
        title: '未结束信息',
      })
      this.getInfo("/aboutMeNot")
    } else if (index == 1) {
      this.setData({
        showInfo: true,
      })
      wx.setNavigationBarTitle({
        title: '已结束信息',
      })
      this.getInfo("/aboutMeHas")
    } else if (index == 2) {
      this.setData({
        showAdvice: true,
      })
      wx.setNavigationBarTitle({
        title: '意见反馈',
      })
    } else if (index == 3) {
      this.setData({
        showAboutMe: true,
      })
      wx.setNavigationBarTitle({
        title: '帮助',
      })
    } else if (index == 4) {
      this.setData({
        showComment: true,
      })
      wx.setNavigationBarTitle({
        title: '@我的',
      })
      this.showComment(index)
    } else if (index == 5) {
      this.setData({
        showComment: true,
      })
      wx.setNavigationBarTitle({
        title: '关于我的',
      })
      this.showComment(index)
    } else if (index == 6) {
      this.setData({
        showSystem: true,
      })
      this.getSysteminfo()
      wx.setNavigationBarTitle({
        title: '系统通知',
      })
    } else if (index == 7) {
      this.setData({
        showInfo: true,
      })
      wx.setNavigationBarTitle({
        title: '已过期信息',
      })
      this.getInfo("/timeout")
    }else if (index == 8) {
      this.setData({
        showLAF: true,
      })
      wx.setNavigationBarTitle({
        title: '失物招领',
      })
    } else if (index == 9) {
      this.setData({
        showInfo: true,
      })
      wx.setNavigationBarTitle({
        title: '推送信息',
      })
      this.getPushInfo()
    } else if (index == 10) {
      this.setData({
        showInfo: true,
      })
      wx.setNavigationBarTitle({
        title: '已收藏',
      })
      this.getCollectInfo()
    } else if (index == 11) {
      this.setData({
        showPerson: true,
      })
      wx.setNavigationBarTitle({
        title: '个人信息',
      })
      this.getPersonInfo()
    }
  },
  back:function(){
    wx.navigateBack({
      url: 'detail',
    })
  },
  depart: function (e) {
    if (e.detail.value != "") {
      this.data.depart = e.detail.value
    } else {
      wx.showToast({
        title: '院系不能为空',
        icon: 'none'
      })
    }
  },
  classes: function (e) {
    if (e.detail.value != "") {
      this.data.classes = e.detail.value
    } else {
      wx.showToast({
        title: '班级不能为空',
        icon: 'none'
      })
    }
  },
  num: function (e) {
    var num = /^\d{10}$/
    if (num.test(e.detail.value)) {
      this.data.num = e.detail.value
    } else {
      wx.showToast({
        title: '请检查学号是否正确',
        icon: 'none'
      })
    }
  },
  name: function (e) {
    if (e.detail.value != "") {
      this.data.name = e.detail.value
    } else {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
    }
  },
  phone: function (e) {
    var phone = /^1\d{10}$/
    if (phone.test(e.detail.value)) {
      this.data.phone = e.detail.value
    } else {
      wx.showToast({
        title: '请检查电话是否正确',
        icon: 'none'
      })
    }
  },
  submitInfo: function () {
    this.setData({
      depart: this.data.depart,
      classes: this.data.classes,
      num: this.data.num,
      phone: this.data.phone,
      name: this.data.name
    })
    var that = this
    setTimeout(function () {
      if (that.data.depart == "" || that.data.classes == "" ||
        that.data.num == "" || that.data.name == "" ||
        that.data.phone == "") {
        wx.showToast({
          title: '请填全信息',
          icon: 'none'
        })
      } else {
        wx.request({
          url: app.globalData.domain + '/writePersonInfo',
          method: 'POST',
          header: app.globalData.header,
          data: {
            user: app.globalData.userinfo,
            depart: that.data.depart,
            classes: that.data.classes,
            num: that.data.num,
            phone: that.data.phone,
            name: that.data.name
          },
          success: function (res) {
            if (res.statusCode == 200) {
              wx.showToast({
                title: '填写成功',
                success: function () {
                  that.back();
                }
              })
              app.globalData.name = that.data.name
              app.globalData.school = true
            }
          }
        })
      }
    }, 100)
  },
  getPersonInfo: function () {
    var that = this
    wx.request({
      url: app.globalData.domain + '/getPersonInfo',
      method: 'GET',
      header: app.globalData.header,
      data: {
        id: app.globalData.userinfo.num,
      },
      success: function (res) {
        console.log("personInfo")
        console.log(res)
        if (res.data.name != null) {
          that.setData({
            PersonInfo: false,
            depart: res.data.depart,
            classes: res.data.classes,
            num: res.data.num,
            phone: res.data.phone,
            name: res.data.name
          })
          app.globalData.name = res.data.name
        }
      }
    })
  },
  personInfo: function (res) {
    this.data.formId = this.data.formId + res.detail.formId + '+'
    this.submitInfo()
    var that = this
    wx.request({
      url: app.globalData.domain + '/writeFormId',
      method: 'POST',
      header: app.globalData.header,
      data: {
        id: app.globalData.userinfo.num,
        formId: this.data.formId
      },
      success: function (res) {
      }
    })
  },
  formSubmit1: function (res) {
    this.data.count = this.data.count + 1;
    if (this.data.count < 5) {
      this.data.formId = this.data.formId + res.detail.formId + '+'
    } else {
      this.data.formId = res.detail.formId + '+';
      this.data.count = 1
    }
    console.log(this.data.formId)
  },
  getSysteminfo:function(){
    var that = this
    wx.request({
      url: app.globalData.domain + '/getSystemInfo',
      method: 'GET',
      header: app.globalData.header,
      data: {
        id: app.globalData.userinfo.num,
        reported:app.globalData.openid,
      },
      success: function (res) {
        that.setData({
          systemInfo:res.data
        })
        var mark = []
        for (var i = 0; i < app.globalData.informCount ; i++){
          mark.push(res.data[i].id)
        }
        if(mark.length > 0){
          wx.request({
            url: app.globalData.domain + '/hasLookInfo',
            method: 'GET',
            header: app.globalData.header,
            data: {
              mark: mark,
            },
            success: function (res) {
            }
          })
        }
      }
    })
   
  },
  getCollectInfo:function(){
    var that = this
    wx.request({
      url: app.globalData.domain + '/collectInfos',
      method: 'GET',
      header: app.globalData.header,
      data: {
        num: app.globalData.userinfo.num,
      },
      success: function (res) {
        console.log(res)
        that.setData({
          category: res.data
        })
      }
    })
  },
  getPushInfo:function(){
    var that = this
    wx.request({
      url: app.globalData.domain + '/getPushInfo',
      method: 'GET',
      header: app.globalData.header,
      data: {
        name: app.globalData.name,
        look: false
      },
      success: function (res) {
        console.log("推送信息")
        console.log(res)
        that.data.id = []
        that.data.category = []
        for(var i = 0 ; i < res.data.length ; i ++){
          that.data.id.push(res.data[i].id)
          that.data.category.push(res.data[i].info)
        }
        that.setData({
          category: that.data.category
        })
      }
    })
  },
  showComment:function(index){
    if (index == 4) {
      this.data.comment = app.globalData.comment.reply;
      for (var i = 0; i < this.data.comment.length; i++) {
        this.data.comment[i].commentInfo.toName = '@' + this.data.comment[i].commentInfo.toName + "："
      }
    } else if (index == 5) {
      this.data.comment = app.globalData.comment.info;
      for (var i = 0; i < this.data.comment.length; i++) {
        if (this.data.comment[i].commentInfo.toUid == "noUid") {
          this.data.comment[i].commentInfo.toName = '';
        } else {
          this.data.comment[i].commentInfo.toName = '@' + this.data.comment[i].commentInfo.toName + "："
        }
      }
    }
    this.setData({
      comment: this.data.comment
    })
  },
  comeIntoInfo:function(res){
    var index = res.currentTarget.dataset.index
    console.log(res);
    wx.setStorageSync("infor", this.data.comment[index].dataInfo);
    wx.navigateTo({
      url: 'detail',
    })
  },
  formSubmit:function(res){
    console.log(res)
    if(res.detail.value.advice == ""){
      wx.showToast({
        title: '建议不能为空',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
    }else {
      var date = new Date();
      wx.request({
        url: app.globalData.domain + '/suggestion',
        header: app.globalData.header,
        method: "POST",
        data: {
          nickName: app.globalData.userinfo.nickName,
          openId: app.globalData.openid,
          suggestion: res.detail.value.advice,
          contactWay: res.detail.value.contactWay,
          date: date.toLocaleString()
        },
        success: function (res) {
          wx.showToast({
            title: '提交成功',
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
    this.data.category = []
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

  }
})