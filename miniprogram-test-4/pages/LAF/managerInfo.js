// pages/LAF/managerInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //举报失物信息
    kind:'',
    name:'',
    infoo:'',
    category:'',
    picPath:'',
    valuable:'',
    date:"",
    place:'',
    phone:'',
    num:"",
    id:0,
    check:false,
    isCard:false,
    code:false,
    showType:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var infor = wx.getStorageSync("info");
    var type = wx.getStorageSync("showType")
    this.setData({
      showType:type
    })
    wx.removeStorageSync("info");
    wx.removeStorageSync("showType");
    console.log(infor.infomation)
    if(infor.category == "证件"){
      this.setData({
        isCard:true,
        num: infor.infomation.split("+")[1],
      })
    }
    this.setData({
      kind: infor.kind,
      name: infor.theme,
      infoo: infor.infomation.split("+")[0],
      category: infor.category,
      picPath: infor.picPath,
      valuable: infor.valuable,
      date: infor.time,
      place: infor.place,
      phone: infor.contactWay.split("+")[1],
      id:infor.id
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
  //更新管理员formid
  getFormId: function (e) {
    console.log
    wx.request({
      url: app.globalData.domain + '/addManagerFormId',
      method: 'POST',
      header: app.globalData.header,
      data: {
        openid: app.globalData.openid,
        formId: e,
      },
      success: function (res) {
      }
    })
  },
  //管理员决定
  infoReport: function (e) {
    var that = this
    this.getFormId(e.detail.formId)
    var util = require('../../utils/util.js')
    this.hideModal("close");
    var decide = this.data.code
    wx.request({
      url: app.globalData.domain + '/process',
      method: 'GET',
      data:{
        decide:decide,
        id:this.data.id,
        operator: app.globalData.userinfo.num,
        time: util.formatTime(new Date),
        openid:app.globalData.openid,
      },
      header: app.globalData.header,
      success: function (res) {//连接成功运行
        console.log(res.data)
        if (that.data.remind == "你的操作将会删除该信息"){
          app.globalData.isChangeInfo = true
        }
        wx.showToast({
          title: res.data,
          duration:1500,
          success:function(){
            wx.navigateBack({
              delta:1
            })
          }
        })
      },
      fail: function (res) {//连接失败执行
        wx.showToast({ title: '系统错误' })
      },
      complete: function (res) {//都执行
      },
    })
  },
  //审核举报物品
  showModal(e){
    if(e.target.id == "0"){
      this.setData({
        modalName: "agree",
        code: false,
        remind:"你的操作不会删除该信息"
      })
    }else{
      this.setData({
        modalName: "agree",
        code: true,
        remind: "你的操作将会删除该信息"
      })
    }
  },
  //审核贵重物品
  showModal1(e) {
    if (e.target.id == "0") {
      this.setData({
        modalName: "show",
        code: false,
        remind: "该信息将被置为普通信息"
      })
    } else {
      this.setData({
        modalName: "show",
        code: true,
        remind: "该信息将被置为贵重信息"
      })
    }
  },
  valuableCheck:function(e){
    console.log(e)
    this.hideModal("close");
    var formid = e.detail.formId
    var res = this.data.code
    var id = this.data.id
    console.log(res)
    var that = this
    wx.request({
      url: app.globalData.domain + '/check/' + id + "/" + res + "/" + formid + "/" + app.globalData.openid + "/" + app.globalData.userinfo.num,
      header: app.globalData.header,
      method: 'PUT',
      success: function (res) {
        if (res.statusCode == 200) {
          console.log(res);
          wx.showToast({
            title: res.data.msg,
            duration: 1500,
            success: function () {
              app.globalData.isChangeInfo = true;
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      }
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
})