// pages/weishi/operate.js
var hasClick = false
var ins = {}
var Card = []
var Money = []
var Book = []
var Else = []
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    session_key:"",
    infor: [],
    category:[],
    valuable:[],
    imgList:[],
    infoCss:{},
    inforCss:[],
    count:1,
    type: ["default", "default", "default", "default", "default"],
    savedFilePath: "/pages/img/FB454FA2-B18D-4316-AFD9-75F565A0CB2A.jpeg",
  },

  /**
   * 生命周期函数--监听页面加载
   * 获取重要信息及第一页信息
   */
  onLoad: function (options) {
    console.log(app.globalData.openid);
    console.log(app.globalData.info)
    console.log(app.globalData.valuable)
    if (app.globalData.valuable.length > 0 || app.globalData.info.length > 0)    {
      this.setData({
        valuable: app.globalData.valuable,
        imgList: app.globalData.imgList,
      })
      this.classify(app.globalData.info)
    }
  },
  /**
   * 查看失物详细信息
   */
  comein: function (e) {
    console.log(e)
    // console.log(this.data.category[e.currentTarget.dataset.index])
    if(app.globalData.power){
        wx.setStorageSync('infor', this.data.category[e.currentTarget.dataset.index])
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
    this.data.type[app.globalData.category] = "primary"
  },
  /**
   * app.globalData.isChangeInfo作用是检测在detail中数据是否被更新
   * 如果更新，在本页面也进行数据更新，否则数据不变
   */
  onShow: function () {
    if(app.globalData.isChangeInfo){
      app.globalData.isChangeInfo = false
      Card = []
      Money = []
      Book = []
      Else = []
      this.data.valuable = []
      this.data.imgList = []
      this.setData({
        valuable: app.globalData.valuable,
        imgList: app.globalData.imgList,
      })
      this.classify(app.globalData.info)
    }
  },
  /**
   * 获取贵重信息
   */
  getValuable:function(){
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
        count: that.data.count
      },
      success: function (res) {
        console.log(res)
        console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          that.data.valuable.unshift(res.data[i]);
          that.data.imgList.push('https://yuigahama.xyz/icon/wxc8c90d2d684c76a0.o6zAJs263NmdprVcUBgFb2i-nBmM.GdtfZS12NqUF254c4b5b884095adb13a1a52905b6ca6.png')
        }
        /**
         * 重要信息标志
         */
        that.setData({
          imgList: that.data.imgList,
        })
        console.log(that.data.imgList)
        /**
        * 因为app.globalData.category是json包
        */
        that.getInfo()
      },
      fail: function (res) {//连接失败执行
        console.log(res)
        wx.showToast({ title: '网络错误' })
      },
    })
  },
  /**
   * 信息分类
   */
  classify: function (res) {
    var that = this
      if (res.length > 0) {
        this.setData({
          infor: res
        })
        console.log(that.data.infor)
        for (var i = 0; i < that.data.infor.length; i++) {
          if (that.data.infor[i].category == "证件") {
            Card.unshift(that.data.infor[i])
          } else if (that.data.infor[i].category == "学习") {
            Book.unshift(that.data.infor[i])
          } else if (that.data.infor[i].category == "电子") {
            Money.unshift(that.data.infor[i])
          } else if (that.data.infor[i].category == "生活") {
            Else.unshift(that.data.infor[i])
          }
        }
        // /**
        //  * 当第一页的证件类不足四条信息，则无法触发下拉到底部事件，若第二页
        //  * 有证件类信息就不能正常显示，由此推广，如果第一页只要有一种长度小
        //  * 于四条信息就会自动再翻一页。
        //  */
        // if (Card.length + that.data.valuable.length <= 4) {
        //   that.addInformation()
        // } else if (Else.length + that.data.valuable.length <= 4) {
        //   that.addInformation()
        // } else if (Book.length + that.data.valuable.length <= 4) {
        //   that.addInformation()
        // } else if (Money.length + that.data.valuable.length <= 4) {
        //   that.addInformation()
        // }
        /**
         *app.globalData.category 调用此函数使标签栏颜色正常
         */
        that.category(app.globalData.category);
        //没有信息且不是第一页，不能出现到底了提示。
      } else if (res.length == 0 && that.data.count > 1) {
        wx.showToast({
          title: '到底了',
          icon: 'none'
        })
        //结束最后一条，返回信息长度为0，但要更新视图层数据
      } else {
        that.category(app.globalData.category);
      }
  },
  getInfo:function(count){
    var that = this
    /**
     * 获取非重要信息
     * unshift数组头插
     */
    wx.request({
      url: app.globalData.domain +'/service/info',
      method: 'GET',
      header: app.globalData.header,
      data: {
        confirm:false,
        count:that.data.count
      },
      success: function (res) {//连接成功运行
        console.log(res.data)
        app.globalData.info=app.globalData.info.concat(res.data);
        console.log(app.globalData.info)
        that.classify(res.data);
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
  },
  /**
   * 返回旧页面初始化数据
   * service->index
   */
  onUnload:function(){
    Card = []
    Money = []
    Book = []
    Else = []
    this.data.valuable = []
    this.data.count = 0;
    this.data.imgList = []
  },
  onPullDownRefresh: function () {
  },
  /**
   * 根据显示不同内容使相应标签变色并给category赋值
   * 重要信息不分种类，全部显示，并且都在排序在前面
   */
  category:function(res){
    /**
     * 因为执行wx.navigateBack命令由detail返回service界面执行onshow（）方法，所以
     * 要时时记录标签的值，返回时正确跳转到之前的标签，不变化app.globalData.category
     * 的话。 从detail返回service界面标签永远是从index进入service的标签。
     * inAboutMe 这能在我的界面显示提醒图标
     */
    app.globalData.category = res
    if(res.currentTarget.id == "0"){
      var newType = ["primary", "default", "default", "default", "default"]
      this.data.category=Card
      this.setData({
        type: newType,
      })
    } else if (res.currentTarget.id == "1"){
      var newType = ["default", "primary", "default", "default", "default"]
      this.data.category =Book
      this.setData({
        type: newType,
      })
    } else if (res.currentTarget.id == "2") {
      var newType = ["default", "default", "primary", "default", "default"]
      this.data.category=Money
      this.setData({
        type: newType,
      })
    } else if (res.currentTarget.id == "3") {
      var newType = ["default", "default", "default", "primary" ,"default"]
      this.data.category = Else
      this.setData({
        type: newType,
      })
    }
    /**
     * 将重要与非重要连接
     */
    this.data.category = app.globalData.valuable.concat(this.data.category);
    
    this.setData({
      category:this.data.category,
    })
  },
  /**
   * count 为页数，一页50条信息
   * 下拉到底触发事件翻页
   */
  addInformation:function(res){
    this.data.count++
    console.log(this.data.count)
    this.getInfo();
  }
})