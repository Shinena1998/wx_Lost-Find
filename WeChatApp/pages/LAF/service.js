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
    showImg:[],//图片占位
    userInfo:{},
    session_key:"",
    infor: [],
    category: [],
    valuable:[],
    imgList:[],
    infoCss:{},
    inforCss:[],
    count:0,
    type: ["default", "default", "default", "default", "default"],
    savedFilePath: "/pages/img/FB454FA2-B18D-4316-AFD9-75F565A0CB2A.jpeg",
    //顶部tabar栏显示
    fontColor: ["#69c0ff", "rgb(112, 110, 110)", 'rgb(112, 110, 110)','rgb(112, 110, 110)'],
    borderB: ['1px solid #69c0ff','','','']
  },
  toUpload: function () {
    wx.switchTab({
      url: 'upload',
    })
  },
  toUser: function () {
    wx.switchTab({
      url: 'user',
    })
  }, 
  toIndex: function () {
    wx.switchTab({
      url: 'index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   * 获取重要信息及第一页信息
   */
  onLoad: function (options) {
    console.log(app.globalData.normal)
    
    this.setData({
      userInfo: app.globalData.userInfo
    })
    console.log("onLoad")
    this.getInfo();
  },
  /**
   * 查看失物详细信息
   */
  comein: function (e) {
    console.log(e)
    // console.log(this.data.category[e.currentTarget.dataset.index])
    if(app.globalData.school){
        wx.setStorageSync('infor', this.data.category[e.currentTarget.dataset.index])
        wx.navigateTo({
          url: 'detail',
        })
    }else{
      wx.showModal({
        title: '请补全信息',
        content: '点击首页图像右下侧',
        showCancel: false,
        success: function () {
          wx.switchTab({
            url: 'index',
          })
        }
      })
    }
  },
  onReady: function () {
    console.log("onReady")
    this.data.type[app.globalData.category] = "primary"
  },
  /**
   * app.globalData.isChangeInfo作用是检测在detail中数据是否被更新
   * 如果更新，在本页面也进行数据更新，否则数据不变
   */
  onShow: function () {
    console.log("onShow")
    if (!app.globalData.normal) {
      wx.showModal({
        title: '请授权',
        content: '点击首页正上方按钮',
        showCancel: false,
        success: function () {
          wx.switchTab({
            url: 'index',
          })
        }
      })
    }
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
  // getValuable:function(){
  //   var that = this
  //   /**
  //   * 获取重要信息
  //   */
  //   wx.request({
  //     url: app.globalData.domain + '/service/info',
  //     method: 'GET',
  //     header: app.globalData.header,
  //     data: {
  //       confirm: true,
  //       count: that.data.count
  //     },
  //     success: function (res) {
  //       console.log(res)
  //       console.log(res)
  //       for (var i = 0; i < res.data.length; i++) {
  //         app.globalData.valuable.unshift(res.data[i]);
  //         that.data.imgList.push('https://yuigahama.xyz/icon/wxc8c90d2d684c76a0.o6zAJs263NmdprVcUBgFb2i-nBmM.GdtfZS12NqUF254c4b5b884095adb13a1a52905b6ca6.png')
  //       }
  //       /**
  //        * 重要信息标志
  //        */
  //       that.setData({
  //         imgList: that.data.imgList,
  //       })
  //       console.log(that.data.imgList)
  //       /**
  //       * 因为app.globalData.category是json包
  //       */
  //       that.getInfo()
  //     },
  //     fail: function (res) {//连接失败执行
  //       console.log(res)
  //       wx.showToast({ title: '网络错误' })
  //     },
  //   })
  // },
  
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
    console.log("refresh")
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
    var id = null
    if (res.currentTarget == null){
      id = res;
    }else{
      id = res.currentTarget.id
    }
    app.globalData.category = res
    if(id == "0"){
      this.data.category=Card
      this.setData({
        fontColor: ["#69c0ff", "rgb(112, 110, 110)", 'rgb(112, 110, 110)', 'rgb(112, 110, 110)'],
        borderB: ['1px solid #69c0ff', '', '', '']
      })
    } else if (id == "1"){
      this.data.category =Book
      this.setData({
        fontColor: ["rgb(112, 110, 110)", "#69c0ff", 'rgb(112, 110, 110)', 'rgb(112, 110, 110)'],
        borderB: ['', '1px solid #69c0ff', '', '']
      })
    } else if (id == "2") {
      this.data.category=Money
      this.setData({
        fontColor: ["rgb(112, 110, 110)", 'rgb(112, 110, 110)', "#69c0ff",'rgb(112, 110, 110)'],
        borderB: ['', '', '1px solid #69c0ff', '']
      })
    } else if (id == "3") {
      this.data.category = Else
      this.setData({
        fontColor: ["rgb(112, 110, 110)", 'rgb(112, 110, 110)', 'rgb(112, 110, 110)',"#69c0ff"],
        borderB: ['', '', '', '1px solid #69c0ff']
      })
    }
    this.data.showImg = []
    //默认照片则不显示
    var picture =  ["/pages/img/199FA2CA-7177-4640-A2F3-B8F7C5FC117E.png",
      "/pages/img/27C36CF5-7208-4527-B3BA-70333A1B09CF.png",
      "/pages/img/87911B73-D05B-4A54-AFAF-BC667C6E4964.png",
      "/pages/img/3758617A-1DC9-46C4-B092-D49545B70020.png",]
    for (var i = 0; i < this.data.category.length; i++) {
      if (this.data.category[i].picPath == picture[1] || this.data.category[i].picPath == picture[1] || this.data.category[i].picPath == picture[2] || this.data.category[i].picPath == picture[3]){
        this.data.showImg[i] =false
      }else{
        this.data.showImg[i] = true
      }
      if(this.data.category[i].infomation.length > 34){
        this.data.category[i].infomation = this.data.category[i].infomation.substr(0,34) + "..."
      }
    }
    console.log(this.data.category)
    console.log(this.data.showImg)
    /*
     * 将重要与非重要连接
     */
    //this.data.category = app.globalData.valuable.concat(this.data.category);
    this.setData({
      category: this.data.category,
      showImg: this.data.showImg,
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
  },
  refresh:function(){
    console.log("asd");
  }
})
// {
//   time: "2019-01-18", kind: "遗失", infomation: 'QdakjdAajd卡的开始能打开呢看快递那上课看的看书看看到卡死你打开看到卡少女打卡卡死你大可是你的卡萨诺看到卡少女的爱上你看到静安寺肯德基阿萨德你看', place: '地狱狗', picPath: 'noImage'
// }