// pages/weishi/operate.js
var hasClick = false
var ins = {}
var Card = []
var Money = []
var Book = []
var Else = []
var aboutMe = []
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * inAboutMe只能在关于我的页面有提示
     */
    inAboutMe:false,
    session_key:"",
    infor: [],
    category:[],
    type: ["primary", "default", "default", "default", "default"],
    savedFilePath: "/pages/img/FB454FA2-B18D-4316-AFD9-75F565A0CB2A.jpeg",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.openid);
  },
  /**
   * 查看失物详细信息
   */
  comein: function (e) {
    // console.log(e)
    // console.log(this.data.category[e.currentTarget.dataset.index])
    if(app.globalData.power){
        wx.setStorageSync('infor', this.data.category[e.currentTarget.dataset.index]    )
        wx.navigateTo({
          url: 'detail',
        })
    }else{
      wx.showToast({
        title: '请授权',
        icon: 'none',
      })
    }
  },
  onReady: function () {
  },
  onShow: function () {
    var that = this
    wx.request({
      url: 'http://127.0.0.1:8081/msg',
      method: 'GET',
      success: function (res) {//连接成功运行
        console.log(res.data)
        if (res.statusCode === 200) {
          that.setData({
            infor: res.data
          })
          for (var i = 0; i < that.data.infor.length; i++) {
            if (that.data.infor[i].category == "证件") {
              Card.push(that.data.infor[i])
            } else if (that.data.infor[i].category == "书本") {
              Book.push(that.data.infor[i])
            } else if (that.data.infor[i].category == "钱包") {
              Money.push(that.data.infor[i])
            } else if (that.data.infor[i].category == "其他") {
              Else.push(that.data.infor[i])
            }
            if (that.data.infor[i].identity == app.globalData.openid){
              aboutMe.push(that.data.infor[i])
            }
          }
          /**
           * 因为app.globalData.category是json包
           */
          /**
           * 调用此函数使标签栏颜色正常
           */
          that.category(app.globalData.category);
        } else {
          console.log("error")
        }
        
      },
      fail: function (res) {//连接失败执行
        wx.showToast({ title: '系统错误' })
      },
      complete: function (res) {//都执行
      },
    })
  },
  /**
   * 进入新页面后初始化数据
   */
  onHide:function(){
    Card = []
    Money = []
    Book = []
    Else = []
    aboutMe = []
  },
  /**
   * 返回就页面初始化数据
   */
  onUnload:function(){
    Card = []
    Money = []
    Book = []
    Else = []
    aboutMe = []
  },
  onPullDownRefresh: function () {
  },
  comeinadd: function () {
    wx.navigateTo({
      url: 'upload',
    })
  },
  /**
   * 根据显示不同内容使相应标签变色并给category赋值
   */
  category:function(res){
    if(res.currentTarget.id == "0"){
      var newType = ["primary", "default", "default", "default", "default"]
      this.setData({
        type: newType,
        category:Card,
        inAboutMe: false,
      })
    } else if (res.currentTarget.id == "1"){
      var newType = ["default", "primary", "default", "default", "default"]
      this.setData({
        type: newType,
        category:Book,
        inAboutMe: false,
      })
    } else if (res.currentTarget.id == "2") {
      var newType = ["default", "default", "primary", "default", "default"]
      this.setData({
        type: newType,
        category:Money,
        inAboutMe: false,
      })
    } else if (res.currentTarget.id == "3") {
      var newType = ["default", "default", "default", "primary" ,"default"]
      this.setData({
        type: newType,
        category:Else,
        inAboutMe:false,
      })
    } else if (res.currentTarget.id == "4") {
      var newType = ["default", "default", "default", "default","primary"]
      this.setData({
        type: newType,
        category: aboutMe,
        inAboutMe:true
      })
    }
  },
  searcH:function(){
    wx.showToast({
      title: '404-not found',
      icon:"none"
    })
  }
})