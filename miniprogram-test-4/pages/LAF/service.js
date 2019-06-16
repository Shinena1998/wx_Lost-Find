// pages/weishi/operate.js
var hasClick = false
var ins = {}
var Card = [] //证件
var Money = [] // 电子
var Book = [] //学习
var Else = [] //生活
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pass:true,
    initimg:false,//信息未加载号不显示刷新加载动态图
    initinfo:true,//下拉加载有信息不回弹
    init:true,//控制上拉刷新不隐藏底部tabbar
    weizhi:40,
    weizhic:0,
    r1:0,
    r2:0,
    status1:'pausd',
    personFormat:[false,false,false,true,false],
    // modalName:"person",
    loginInfo:"初次进入小程序，请登录",
    endload:true,
    notice: false,
    endload: true,
    showModal: false,
    showModal2: false,
    showIndex: true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    TabCur: 1,
    scrollLeft: 0,
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
    showMenu:false,
    operating:0,
    upingMenu:0,
    reportUp:null,
    deleteUp:null,
    savedFilePath: "/pages/img/FB454FA2-B18D-4316-AFD9-75F565A0CB2A.jpeg",
    //顶部tabar栏显示
    fontColor: ["#69c0ff", "rgb(112, 110, 110)", 'rgb(112, 110, 110)','rgb(112, 110, 110)'],
    borderB: ['5rpx solid #69c0ff','','',''],
    scrollTop: 5,
    reportReason: ["垃圾广告","话题不相关","色情", "人身攻击", "违法信息", "其他",],
    reason:"",
  },
  toUpload: function () {
    if (!app.globalData.school) {
      wx.showModal({
        title: '请填写个人信息',
        content: '点击左上角图片',
        showCancel: false,
        success: function () {
          
        }
      })
    }else{
      if (!this.data.spring) {
        this.data.spring = true
        this.setData({
          rotate: 135,
          r1: 90,
          r2: 160,
        })
      } else {
        this.data.spring = false
        this.setData({
          rotate: 0,
          r1: 0,
          r2: 0
        })
      }
    }
  },
  other:function(){
    wx.navigateTo({
      url: 'upload?type=other',
    })
    this.toUpload()
  },
  acard:function(){
    wx.navigateTo({
      url: 'upload?type=acard',
    })
    this.toUpload()
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
  //预览图片
  previewImage: function (e) {
    console.log(e)
    var id = e.currentTarget.id
    var list = []
    list.push(this.data.category[id].picPath)
    wx.previewImage({
      current: this.data.category[id].picPath, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   * 获取重要信息及第一页信息
   */
  onLoad: function (options) {
    this.setData({
      test:"哈哈\n\n啦啦"
    })
    if(this.data.init){
      this.data.init=false
      wx.hideTabBar()
    }
    var that = this;
    wx.getSystemInfo({
      success: e => {
        let custom = wx.getMenuButtonBoundingClientRect();
        let bar = custom.bottom + 8;
        let height = custom.bottom - custom.top+8+20;
        if(bar < height){
          bar = height;
        }
        let width = e.windowWidth - custom.left
        console.log(width)
        var a = 100 - bar / e.windowHeight * 100 - 6.5;
        that.setData({
          bar: bar,
          infoHeight: a ,
          CustomWidth : width
        })
        console.log("高度为"+a)
        console.log(custom)
        that.data.windowWidth = e.windowWidth;
      }
    })
    wx.getSystemInfo({
      success(res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
       
        that.data.windowWidth = res.windowWidth;
      }
    })
    /**
     * 因为在开发者工具上是先执行app，然后在执行index
     * 但在手机上是并发执行，两个页面的请求互相竞争，所以有时就会token
     * 还没在app页面生成，这边发送相应请求。所以使用循环定时器没50毫秒验证一次是否
     * 对应数据是否改变
     * 之所以不用setTimeout是因为请求完毕和网速有关系，所以花费时间不确定，直接设置
     * 估计值有可能偏差太大，而循环定时器只会有小于等于50ms的延迟
     */
    var ids = 0;
    var id = setInterval(function () {
      if (app.globalData.userinfo != null && app.globalData.finish) {
        clearInterval(id)
        clearInterval(ids)
        that.getPersonComment();
        that.getPersonInfo();
        that.getInformCount();
        that.getValuable()
        that.setData({
          userInfo: app.globalData.userinfo
        })
      }
    }, 50)
    setTimeout(function () {
      ids = setInterval(function () {
        if (app.globalData.power == false && app.globalData.finish) {
          clearInterval(ids)
          that.showLogin()
        }
      }, 50)
      if (app.globalData.power){
        wx.showTabBar()
      }
      //initimg为false说明信息没有加载好，因此需要显示loading
      //并且此时需要用户已经授权才能，不然授权窗口会和loading重叠
      if (!that.data.initimg && app.globalData.userinfo != null){
        wx.showLoading({
          title: '加载中...',
        })
      }
      that.setData({
        endload: false,
        indexView: true
      })
      that.addManagerFormId();
    }, 2000)
    console.log("onLoad")
  },
  addManagerFormId:function(){
    console.log(app.globalData.formId)
    if(app.globalData.formId == "needAdd"){
      wx.hideTabBar()
      this.setData({
        modalName:"addFormid"
      })
    }
  },
  getFormId:function(e){
    this.setData({
      modalName:null
    })
    var formid = e.detail.formId
    wx.request({
      url: app.globalData.domain + '/addManagerFormId',
      method: 'POST',
      header: app.globalData.header,
      data: {
        openid: app.globalData.openid,
        formId: formid,
      },
      success: function (res) {
        wx.showTabBar()
        console.log(res)
        app.globalData.formId = res.data
        wx.showToast({
          title: '添加成功',
        })
      }
    })
  },
  getInformCount: function () {
    var that = this
    wx.request({
      url: app.globalData.domain + '/getSystemCount',
      method: 'GET',
      header: app.globalData.header,
      data: {
        id: app.globalData.userinfo.num,
        reported: app.globalData.openid,
      },
      success: function (res) {
        console.log(res.data)
        app.globalData.informCount = res.data;
        if (res.data > 0) {
          that.setData({
            notice: true,
          })
        }
      }
    })
  },
  getPersonComment: function () {
    var that = this
    wx.request({
      url: app.globalData.domain + '/getPersonComment',
      method: 'GET',
      header: app.globalData.header,
      data: {
        openid: app.globalData.openid,
      },
      success: function (res) {
        console.log(res)
        app.globalData.comment = res.data;
        if (res.data.infoNum + res.data.replyNum > 0) {
          that.setData({
            notice: true,
          })
        }
      }
    })
  },
  //获得用户私人信息
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
        if (res.data.name != null) {
          console.log(res)
          that.data.personFormat =  [true, true, true, true, true]
          that.setData({
            depart: res.data.depart,
            classes: res.data.classes,
            num: res.data.num,
            phone: res.data.phone,
            name: res.data.name
          }) 
          app.globalData.personinfo = res.data
          app.globalData.name = res.data.name
          that.getPushContent()
          that.getLevel(res.data.name)
        }
        // else {
        //   that.setData({
        //     status: "游客"
        //   })
        //   app.globalData.customer = true
        // }
      }
    })
  },
  getPushContent: function () {
    var that = this
    wx.request({
      url: app.globalData.domain + '/getPushCount',
      method: 'GET',
      header: app.globalData.header,
      data: {
        name: app.globalData.name,
        look: false
      },
      success: function (res) {
        console.log("推送信息")
        console.log(res)
        if (res.data > 0) {
          app.globalData.pushCount = res.data
          that.setData({
            notice: true,
          })
        }
      }
    })
  },
  getLevel: function (openid) {
    var that = this
    //不用else if原因是确定权限等级，if顺序是为了保证显示当前用户最大身份
    if (app.globalData.power) {
      that.setData({
        status: "普通用户"//仅授权
      })
      app.globalData.normal = true
    }
    if (openid != null) {
      that.setData({
        status: "校园用户"//填写校园信息
      })
      app.globalData.school = true;
    }
    if (app.globalData.isManager) {
      that.setData({
        status: "管理员"
      })
      app.globalData.school = true;
    }
    app.globalData.status = that.data.status;
  },
  getUserInfo: function (e) {
    var that = this
    if (e.detail.rawData != null) {
      that.data.encryptedData = e.detail.encryptedData;
      that.data.iv = e.detail.iv;
      that.decodeEncryptedData();
      app.globalData.normal = true
      console.log("普通用户")
      that.setData({
        status: "普通用户"
      })
      if (e.detail.userInfo != null) {
        app.globalData.power = true;
      }
      //授权完成后，还未加载好信息，则显示loading
      if(that.data.initimg){
        wx.showLoading({
          title: '加载中...',
        })
      }
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      this.hideLogin1()
      this.remind()
      wx.showTabBar()
    }else{
      this.hideLogin()
    }
  },
  //提醒用户填写私人信息
  remind:function(){
    this.setData({
      modalName:"person"
    })
  },
  /**
 * 
 * 对话框确认按钮点击事件
 * 获取用户详细信息
 * 将用户信息发送到后端
 */
  decodeEncryptedData: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/identity?encryptedData=' + that.data.encryptedData + '&session_key=' + app.globalData.session_key + '&iv=' + that.data.iv,
      header: app.globalData.header,
      method: 'GET',
      success: function (res) {
        console.log(res)
        var util = require('../../utils/util.js')
        wx.request({
          url: app.globalData.domain + '/user',
          method: "POST",
          header: app.globalData.header,
          data: {
            nickName: res.data.nickName,
            avatarUrl: res.data.avatarUrl,
            country: res.data.country,
            gender: res.data.gender,
            language: res.data.language,
            openId: res.data.openId,
            city: res.data.city,
            province: res.data.province,
            time: util.formatTime(new Date)
          },
          success: function (res) {
            app.globalData.userinfo = res.data.data
          }
        })
      }
    })
  },
  getValuable: function () {
    var that = this
    /**
    * 获取重要信息
    */
    wx.request({
      url: app.globalData.domain + '/getValuable',
      method: 'GET',
      header: app.globalData.header,
      success: function (res) {
        console.log(res)
        app.globalData.info = app.globalData.info.concat(res.data)
        // for (var i = 0; i < res.data.length; i++) {
        //   that.data.valuable.push(res.data[i]);
        //   /**
        //    * 重要信息标志
        //    */
        //   that.data.imgList.push('https://yuigahama.xyz/icon/wxc8c90d2d684c76a0.o6zAJs263NmdprVcUBgFb2i-nBmM.GdtfZS12NqUF254c4b5b884095adb13a1a52905b6ca6.png')
        // }
        console.log(app.globalData.valuable)
        /**
        * 因为app.globalData.category是json包
        */

        that.setData({
          valuable: that.data.valuable,
          imgList: that.data.imgList,
        })
        that.getInfo()
      },
      fail: function (res) {//连接失败执行
        wx.showToast({ title: '网络错误' })
      },
    })
  },
  /**
  /**
   * 查看失物详细信息
   */
  comein: function (e) {
    console.log(e)
    var that = this;
    // console.log(this.data.category[e.currentTarget.dataset.index])
    wx.setStorageSync('infor', this.data.category[e.currentTarget.id])
    wx.request({
      url: app.globalData.domain + '/addCount',
      method: 'POST',
      header: app.globalData.header,
      data: {
        id: this.data.category[e.currentTarget.id].id,
      },
      success: function (res) {//连接成功运行
        console.log(res)
        that.changeCount(e.currentTarget.id,res.data)
      },
      fail: function (res) {//连接失败执行
        wx.showToast({ title: '网络错误' })
      },
      complete: function (res) {//都执行
      },
    })
    wx.navigateTo({
      url: 'detail',
    })
  },
  changeCount:function(index,count){
    if(app.globalData.category == '0'){
      Card[index].count = count;
    } else if (app.globalData.category == '1'){
      Book[index].count = count;
    } else if (app.globalData.category == '2') {
      Money[index].count = count;
    } else if (app.globalData.category == '3' ) {
      Else[index].count = count;
    } 
    this.data.category[index].count = count;
    this.setData({
      category: this.data.category
    })
  },
  onReady: function () {
    console.log("onReady")
  },
  search: function (e) {
    wx.navigateTo({
      url: 'search',
    })
  },
  /**
   * app.globalData.isChangeInfo作用是检测在detail中数据是否被更新
   * 如果更新，在本页面也进行数据更新，否则数据不变
   */
  onShow: function () {
    console.log("onShow")
    if(app.globalData.isChangeInfo){
      app.globalData.isChangeInfo = false
      this.refresh();
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
        app.globalData.info = app.globalData.info.concat(res.data);
        console.log(app.globalData.info)

        if (res.data.length > 0 && res.data[res.data.length - 1].category == "最爱") {
          that.data.occupat = res.data[res.data.length - 1];
        }
        //第一次普通信息和贵重信息
        if(that.data.count == 0){
          that.classify(app.globalData.info);
        }else{
          //之后新信息
          that.classify(res.data);
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
    * 信息分类
    */
  classify: function (res) {
    console.log("信息分类")
    console.log(res)
    var that = this
    if (res.length > 0) {
      this.setData({
        infor: res
      })
      console.log(that.data.infor)
      for (var i = 0; i < that.data.infor.length; i++) {
        if (that.data.infor[i].category == "证件") {
          Card.push(that.data.infor[i])
        } else if (that.data.infor[i].category == "学习") {
          Book.push(that.data.infor[i])
        } else if (that.data.infor[i].category == "电子") {
          Money.push(that.data.infor[i])
        } else if (that.data.infor[i].category == "生活") {
          Else.push(that.data.infor[i])
        }
      }
      if (app.globalData.category == "") {
        that.category(0);
      } else {
        that.category(app.globalData.category);
      }
      /**
       *app.globalData.category 调用此函数使标签栏颜色正常
       */
      //没有信息且不是第一页，不能出现到底了提示。
    } else if (res.length == 0 && that.data.count > 0) {
      console.log("到底了")
      that.data.load = false
      setTimeout(function () {
        console.log("到底了")
        let index = that.data.category.length - 3
        wx.hideLoading()
        wx.showToast({
          title: '到底了',
          icon: 'none'
        })
        that.setData({
          moveid: 'id' + index
        })
      },500)
      //结束最后一条，返回信息长度为0，但要更新视图层数据
    } else {
      if (app.globalData.category == "") {
        that.category(0);
      }else{
        that.category(app.globalData.category);
      }
    }
    if(this.data.load){
      this.data.load = false
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    }
    if(this.data.initinfo){
      this.data.initinfo=false
      this.setData({
        weizhi:40
      })
    }
    if(this.data.pull){
      this.data.pull = false
      setTimeout(function () {
        // complete
        wx.hideLoading()
        that.setData({
          weizhi: 40
        })
      },500);
    }
  },
  /**
   * 进入新页面后初始化数据
   * service->detail
   */
  onHide:function(){
    this.hideModal1()
    app.globalData.notice = false
    this.setData({
      notice:false
    })
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
    this.data.category = []
    this.data.valuable = []
    this.data.count = 0;
    this.data.imgList = []
    app.globalData.info = []
  },
  refresh:function(e){
    var that = this
    this.data.pull = true
    wx.showLoading({
      title: '刷新中...',
      mask:true
    })
    // wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onUnload()
    this.onLoad()
    this.data.weizhic++
    console.log("下拉刷新" + this.data.weizhic)
  },
  onPullDownRefresh: function () {
    this.data.pull = true
    wx.showLoading({
      title: '刷新中...',
    })
    // wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onUnload()
    this.onLoad()
  },
  /**
   * 根据显示不同内容使相应标签变色并给category赋值
   * 重要信息不分种类，全部显示，并且都在排序在前面
   */
  category:function(res){
    console.log(res)
    /**
     * 因为执行wx.navigateBack命令由detail返回service界面执行onshow（）方法，所以
     * 要时时记录标签的值，返回时正确跳转到之前的标签，不变化app.globalData.category
     * 的话。 从detail返回service界面标签永远是从index进入service的标签。
     * inAboutMe 这能在我的界面显示提醒图标
     */
    var id = null
    if (res.currentTarget == null){ //从其他地方切换失物种类
      id = res;
    }else{ //点击bindtap事件切换
      id = res.currentTarget.id
      this.setData({
        moveid: 'id0'
      })
    }
    app.globalData.category = id
    if(id == "0"){
      this.data.category=Card
      this.setData({
        fontColor: ["#69c0ff", "rgb(112, 110, 110)", 'rgb(112, 110, 110)', 'rgb(112, 110, 110)'],
        borderB: ['5rpx solid #69c0ff', '', '', '']
      })
    } else if (id == "1"){
      this.data.category =Book
      this.setData({
        fontColor: ["rgb(112, 110, 110)", "#69c0ff", 'rgb(112, 110, 110)', 'rgb(112, 110, 110)'],
        borderB: ['', '5rpx solid #69c0ff', '', '']
      })
    } else if (id == "2") {
      this.data.category=Money
      this.setData({
        fontColor: ["rgb(112, 110, 110)", 'rgb(112, 110, 110)', "#69c0ff",'rgb(112, 110, 110)'],
        borderB: ['', '', '5rpx solid #69c0ff', '']
      })
    } else if (id == "3") {
      this.data.category = Else
      this.setData({
        fontColor: ["rgb(112, 110, 110)", 'rgb(112, 110, 110)', 'rgb(112, 110, 110)',"#69c0ff"],
        borderB: ['', '', '', '5rpx solid #69c0ff']
      })
    }
    this.data.category = this.data.valuable.concat(this.data.category)
    this.data.showImg = []
    //默认照片则不显示
    var picture =  ["/pages/img/199FA2CA-7177-4640-A2F3-B8F7C5FC117E.png",
      "/pages/img/27C36CF5-7208-4527-B3BA-70333A1B09CF.png",
      "/pages/img/87911B73-D05B-4A54-AFAF-BC667C6E4964.png",
      "/pages/img/3758617A-1DC9-46C4-B092-D49545B70020.png",]
    for (var i = 0; i < this.data.category.length; i++) {
      //照片是否显示
      if (this.data.category[i].picPath == picture[0] || this.data.category[i].picPath == picture[1] || this.data.category[i].picPath == picture[2] || this.data.category[i].picPath == picture[3]){
        this.data.showImg[i] =false
      }else{
        this.data.showImg[i] = true
      }
      //显示关键词
      //当关键词为null或者长度为0都直接赋值空数组
      //长度为0包括字符串长度和数组长度两种情况
      if (this.data.category[i].keyWord == null || this.data.category[i].keyWord.length == 0 ){
        this.data.category[i].keyWord = []
      //当关键词为字符串代表还没处理为字符数组，因此处理为字符数组
      //成为字符数组后不再处理，因为这里都是引用，进行赋值后所有引用都会变
      } else if (this.data.category[i].keyWord.constructor==String){
        this.data.category[i].keyWord = this.data.category[i].keyWord.split("+");
        //最后一位为空，需删除,pop弹出最后一位
        this.data.category[i].keyWord.pop();
      }

      // if(this.data.category[i].infomation.length > 34){
      //   this.data.category[i].infomation = this.data.category[i].infomation.substr(0,34) + "..."
      // }
    }
    console.log(this.data.category)
    console.log(this.data.showImg)
    while(this.data.category.length < 3){
      this.data.category.push(this.data.occupat)
      this.data.showImg.push(true)
    }
    //initimg为false说明是初次加载即将完成，因此需要关闭loading
    if(!this.data.initimg){
      wx.hideLoading()
    }
    /*
     * 将重要与非重要连接
     */
    //this.data.category = app.globalData.valuable.concat(this.data.category);
    this.setData({
      category: this.data.category,
      showImg: this.data.showImg,
      initimg:true, //在加载好信息是，显示gif图
    })
  },
  /**
   * count 为页数，一页50条信息
   * 下拉到底触发事件翻页
   */
  addInformation:function(res){
    console.log(res)
    this.data.load = true
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    this.data.count++
    console.log(this.data.count)
    this.getInfo();
  },
 
  openMenu: function (res) {
    wx.hideTabBar()
    console.log(res)
    this.setData({
      showMenu: true,
      operating: res.currentTarget.id
    })
    if (this.data.category[res.currentTarget.id].identity == app.globalData.openid) {
      // this.showDeleteMenu()
      this.showMenu("delete")
      this.setData({
        upingMenu: '0'
      })
    } else {
      this.showMenu("report")
      this.setData({
        upingMenu: '1'
      })
    }
  },
  //上拉删除菜单
  showMenu: function (res) {
    console.log(res)
    var animation = wx.createAnimation({
      duration: 300,
      delay: 0,
      timingFunction: 'linear'
    })
    animation.translate(0, -175).step({ duration: 300 });
    if (res == "delete") {
      this.setData({
        deleteUp: animation.export(),
      })
    } else if (res == "report") {
      this.setData({
        reportUp: animation.export(),
      })
    }
  },
  //下拉菜单
  closeMenu: function (res) {

    wx.showTabBar()
    console.log(res)
    this.setData({
      showMenu: false,
    })
    var animation = wx.createAnimation({
      duration: 300,
      delay: 0,
      timingFunction: 'linear'
    })
    animation.translate(0, 175).step({ duration: 300 });
    if (res.currentTarget.id == "0") {
      this.setData({
        deleteUp: animation.export(),
      })
    } else if (res.currentTarget.id == "1") {
      this.setData({
        reportUp: animation.export(),
      })
    }
  },
  deleteInfo:function(res){
    console.log("asdasd")
    res.currentTarget.id = "0"
    this.closeMenu(res)
    var that = this
    var id = that.data.category[that.data.operating].id
    wx.request({
      url: app.globalData.domain + '/deleteInfo',
      method: 'DELETE',
      header: app.globalData.header,
      data:{id:id},
      success: function (res) {
       console.log(res)
       wx.showToast({
         title: '删除成功',
       })
       that.refresh()
      }
    })
  },
  reportInfo:function(res){
    var that = this
    if(this.data.reason == ""){
      wx.showToast({
        title: '请选择举报理由',
        icon:"none"
      })
    }else{
      console.log(res)
      this.hideModal(res)
      var id = this.data.category[this.data.operating].id;
      var openid = app.globalData.userinfo.num;
      var reason = this.data.reason;
      wx.request({
        url: app.globalData.domain + '/report',
        method: 'POST',
        header: app.globalData.header,
        data: {
          reportid: id,
          userid: openid,
          reason:reason,
        },
        success: function (res) {
          wx.showToast({
            title: res.data,
          })
        }
      })
    }
  },
  reportReasonChange: function (e) {
    console.log(e);
    this.data.reason = e.detail.value;
  },
  showModal(e) {
    this.setData({
      modalName: "report"
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
    e.currentTarget.id  = 1;
    this.closeMenu(e)
  },
  showLogin(e) {
    this.setData({
      login: "login"
    })
  },
  hideLogin(e){
    this.setData({
      loginInfo:"授权信息仅为图像，昵称等基本信息，并不涉及私人信息，请您放心授权。"
    })
  },
  hideLogin1(e) {
    this.setData({
      login: null
    })
  },
  showModal1(e) {
    this.setData({
      modalName: "viewModal",
      pass:false
    })
  },
  hideModal1(e) {
    this.setData({
      modalName: null,
      pass:true
    })
  },
  depart: function (e) {
    if (e.detail.value != "") {
      this.data.depart = e.detail.value
      this.data.personFormat[0] = true
    } else {
      this.data.personFormat[0] = false
      wx.showToast({
        title: '院系不能为空',
        icon: 'none'
      })
    }
  },
  classes: function (e) {
    if (e.detail.value != "") {
      this.data.classes = e.detail.value
      this.data.personFormat[1] = true
    } else {
      this.data.personFormat[1] = false
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
      this.data.personFormat[2] = true
    } else {
      this.data.personFormat[2] = false
      wx.showToast({
        title: '请检查学号是否正确',
        icon: 'none'
      })
    }
  },
  phone: function (e) {
    var phone = /^1\d{10}$/
    if (phone.test(e.detail.value) || e.detail.value == "") {
      this.data.phone = e.detail.value
      this.data.personFormat[3] = true
    } else {
      this.data.personFormat[3] = false
      wx.showToast({
        title: '请检查电话是否正确',
        icon: 'none'
      })
    }
  },
  name: function (e) {
    if (e.detail.value != "") {
      this.data.name = e.detail.value
      this.data.personFormat[4] = true
    } else {
      this.data.personFormat[4] = false
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
    }
  },
  
  submitInfo: function () {
    var that = this
    setTimeout(function () {
      if (that.data.personFormat[4] == false || that.data.personFormat[3] == false || that.data.personFormat[2] == false || that.data.personFormat[1] == false ||that.data.personFormat[0] == false) {
        wx.showToast({
          title: '您填写的信息有误，请检查',
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
                  that.hideModal1();
                }
              })
              app.globalData.personinfo = res.data
              app.globalData.name = that.data.name
              app.globalData.school = true
            }
          }
        })
      }
    }, 100)
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
        app.globalData.status = "校园用户"
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
  toManager: function () {
    if (app.globalData.isManager) {
      wx.navigateTo({
        url: 'manager',
      })
    } else {
      wx.switchTab({
        url: 'user',
      })
    }
  },
})