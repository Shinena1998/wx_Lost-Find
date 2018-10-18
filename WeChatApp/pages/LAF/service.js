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
    valuable:[],
    infoCss:{},
    inforCss:[],
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
    /**
     * 获取非重要信息
     * unshift数组头插
     */
    wx.request({
      url: 'http://127.0.0.1:8081/service/info',
      method: 'GET',
      header: app.globalData.header,
      data:{
        confirm:false,
      },
      success: function (res) {//连接成功运行
        console.log(res.data)
        if (res.statusCode === 200) {
          that.setData({
            infor: res.data
          })
          for (var i = 0; i < that.data.infor.length; i++) {
            if (that.data.infor[i].category == "证件") {
              Card.unshift(that.data.infor[i])
            } else if (that.data.infor[i].category == "书本") {
              Book.unshift(that.data.infor[i])
            } else if (that.data.infor[i].category == "钱包") {
              Money.unshift(that.data.infor[i])
            } else if (that.data.infor[i].category == "其他") {
              Else.unshift(that.data.infor[i])
            }
            if (that.data.infor[i].identity == app.globalData.openid){
              aboutMe.unshift(that.data.infor[i])
            }
          }
          /**
          * 获取重要信息
          */
          wx.request({
            url: 'http://127.0.0.1:8081/service/info',
            method: 'GET',
            header: app.globalData.header,
            data: {
              confirm: true,
            },
            success: function (res) {
              console.log(res)
              for(var i = 0 ; i < res.data.length ; i++){
                that.data.valuable.unshift(res.data[i]);
              }
              /**
              * 因为app.globalData.category是json包
              */
              /**
               * 调用此函数使标签栏颜色正常
               */
              that.category(app.globalData.category);
            },
            fail: function (res) {//连接失败执行
            console.log(res)
              wx.showToast({ title: '网络错误' })
            },
          })
        } else {
          console.log("error")
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
   * 进入新页面后初始化数据
   * service->detail
   */
  onHide:function(){
    Card = []
    Money = []
    Book = []
    Else = []
    aboutMe = []
    this.data.valuable=[]
  },
  /**
   * 返回就页面初始化数据
   * service->index
   */
  onUnload:function(){
    Card = []
    Money = []
    Book = []
    Else = []
    aboutMe = []
    this.data.valuable = []
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
   * 重要信息不分种类，全部显示，并且都在排序在前面
   */
  category:function(res){
    /**
     * 因为执行wx.navigateBack命令由detail返回service界面执行onshow（）方法，所以要时
     * 时记录标签的值，返回时正确跳转到之前的标签，不变化app.globalData.category的话。
     * 从detail返回service界面标签永远是从index进入service的标签。
     */
    app.globalData.category = res
    if(res.currentTarget.id == "0"){
      var newType = ["primary", "default", "default", "default", "default"]
      this.data.category=Card
      this.setData({
        type: newType,
        inAboutMe: false,
      })
    } else if (res.currentTarget.id == "1"){
      var newType = ["default", "primary", "default", "default", "default"]
      this.data.category =Book
      this.setData({
        type: newType,
        inAboutMe: false,
      })
    } else if (res.currentTarget.id == "2") {
      var newType = ["default", "default", "primary", "default", "default"]
      this.data.category=Money
      this.setData({
        type: newType,
        inAboutMe: false,
      })
    } else if (res.currentTarget.id == "3") {
      var newType = ["default", "default", "default", "primary" ,"default"]
      this.data.category = Else
      this.setData({
        type: newType,
        inAboutMe:false,
      })
    } else if (res.currentTarget.id == "4") {
      var newType = ["default", "default", "default", "default","primary"]
      this.data.category=aboutMe,
      this.setData({
        type: newType,
        inAboutMe:true
      })
    }
    /**
     * 将重要与非重要连接
     */
    this.data.category = this.data.valuable.concat(this.data.category);
    
    var InforCss = []
    for (var i = 0; i < this.data.category.length; i++) {
      if(this.data.category[i].kind == '招领'){
        InforCss.push(['拾取地点','拾取时间'])
      } else if (this.data.category[i].kind == '遗失') {
        InforCss.push(['丢失地点', '丢失时间'])
      }
    }
    this.setData({
      category:this.data.category,
      inforCss:InforCss
    })
  },
  search:function(e){
  wx.navigateTo({
    url: 'search',
  })
  }
})