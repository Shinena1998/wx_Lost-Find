// pages/weishi/operate.js
var hasClick = false
var ins = {}
var Card = []
var Money = []
var Book = []
var Else = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    session_key:"",
    infor: [],
    categoryInfo:[],
    type: ["primary", "default", "default", "default"],
    savedFilePath: "/pages/img/FB454FA2-B18D-4316-AFD9-75F565A0CB2A.jpeg",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  comein: function (e) {
    // console.log(e)
    // console.log(this.data.category[e.currentTarget.dataset.index])
    wx.setStorageSync('infor', this.data.category[e.currentTarget.dataset.index]    )
    wx.navigateTo({
      url: 'detail',
    })
  },
  onReady: function () {
  },
  onShow: function () {
    var that = this
    wx.request({
      url: 'http://localhost:8081/msg',
      method: 'GET',
      success: function (res) {//连接成功运行

        if (res.statusCode === 200) {
          that.setData({
            infor: res.data
          })
          for (var i = 0; i < that.data.infor.length; i++) {
            if (that.data.infor[i].category == "card") {
              Card.push(that.data.infor[i])
            } else if (that.data.infor[i].category == "book") {
              Book.push(that.data.infor[i])
            } else if (that.data.infor[i].category == "money") {
              Money.push(that.data.infor[i])
            } else if (that.data.infor[i].category == "else") {
              Else.push(that.data.infor[i])
            }
          }
          that.setData({
            category: Card,
          })
          console.log(Card);
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
    wx.getSavedFileList({
      success: function (res) {
        console.log(res.fileList)
      }
    })
  },
  onHide:function(){
    Card = []
    Money = []
    Book = []
    Else = []
  },
  onPullDownRefresh: function () {
  },
  comecar: function () {
    var buycar = wx.getStorageSync("buyCC");
    console.log(buycar)
    console.log(this.data.buyInfo)
    for (var i = 0; i < this.data.buyInfo.length; i++) {
      for (var j = 0; j < buycar.length; j++) {
        if (this.data.buyInfo[i].name == buycar[j].name) {
          this.data.buyInfo[i].num = this.data.buyInfo[i].num + buycar[j].num;
          this.data.buyInfo[i].money = this.data.buyInfo[i].money + buycar[j].money;
          buycar.splice(j, 1);
        }
      }
    }
    console.log(buycar)

    for (var i = 0; i < buycar.length; i++) {
      this.data.buyInfo.push(buycar[i])
    }
    console.log(this.data.buyInfo)
    wx.setStorageSync("buyc", this.data.buyInfo)
    wx.redirectTo({
      url: 'car',
    })
  },
  comeinadd: function () {
    wx.navigateTo({
      url: 'upload',
    })
  },
  category:function(res){
    if(res.currentTarget.id == "0"){
      var newType = ["primary", "default", "default", "default"]
      this.setData({
        type: newType,
        category:Card
      })
    } else if (res.currentTarget.id == "1"){
      var newType = ["default", "primary",  "default", "default"]
      this.setData({
        type: newType,
        category:Book
      })
    } else if (res.currentTarget.id == "2") {
      var newType = ["default", "default", "primary", "default"]
      this.setData({
        type: newType,
        category:Money
      })
    } else if (res.currentTarget.id == "3") {
      var newType = ["default", "default", "default", "primary"]
      this.setData({
        type: newType,
        category:Else
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