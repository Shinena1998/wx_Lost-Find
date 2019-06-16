// //index.js
// //获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    stop:0,
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 30,
    size: 15,
    interval: 20, // 时间间隔
    notice:false,
    indexView:false,
    endload:true,
    date:null,
    image_show: false,
    showModal: false,
    showModal2:false,
    showIndex:true,
    suggestion:"",
    logoLeft: "/pages/img/logo.png",
    logoRight:"/pages/img/2014062374843457.png",
    remind:"申明：无论您是拾者还是失主，请务必认真阅读以下须知谨慎待之    本平台只负责信息传递，失物的保管及完整性由当事人（拾物者）自行负责     发布失物或寻物信息请注意您的个人信息泄漏，由此造成的手机骚扰等损失本平台不负任何责任    当有失主已确认失物时，双方自行商讨归还失物，发布消息者及时结束消息    信息的真实性由发布者自行负责，本平台不负任何责任     通过本平台发布的信息发生任何意外均与本平台无关",
    userInfo:{},
    docode:true,
    hasUserInfo: false,
    encryptedData:"",
    openid:"",
    session_key:"",
    iv:"",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //评价
    evaluate:false,
    openEva: 'icon-right',//评价图片转化
    uiList: ['icon--star', 'icon--star', 'icon--star', 'icon--star', 'icon--star'],
    feelList: ['icon--star', 'icon--star', 'icon--star', 'icon--star', 'icon--star'],
    useList: ['icon--star', 'icon--star', 'icon--star', 'icon--star', 'icon--star'],
    loadList: ['icon--star', 'icon--star', 'icon--star', 'icon--star', 'icon--star'],
    ui:' ',
    feel:' ',
    use:' ',
    load:'',
    level:['非常差','较差','一般','较好','非常好'],
    //补全信息
    status:'',
    PersonInfo:true,
    showInfo:false,
    depart:"",
    classes:'',
    num:'',
    name:'',
    phone:'',
    toIndex:'a',
    windowWidth:null,
    valuable:[],//贵重信息
    showValuable:true,//展示
    imgList:[],//显示贵重背景图片
  }, 
  //补全信息
  Write_userinfo:function(){
    wx.navigateTo({
      url: 'showInfo',
    })
    wx.setStorageSync("index", 11)
  },
  //评价
  openEva:function(){
    if (this.data.evaluate){
      this.setData({
        evaluate:false,
        openEva:'icon-right'
      })
    }else{
      this.setData({
        evaluate: true,
        openEva: 'icon-unfold'
      })
    }
  },
  ui:function(e){
    var index = null;
    if (e.currentTarget != null){
      this.submitEva(0, e.currentTarget.dataset.index);
      index = e.currentTarget.dataset.index;
    } else{
      index = e;
    }
    for (var i = 0; i <= index; i++) {
      this.data.uiList[i] = 'icon--star-active';
    }
    for (var i = index + 1; i < 5; i++) {
      this.data.uiList[i] = 'icon--star';
    }
    this.setData({
      uiList: this.data.uiList,
      ui: this.data.level[index]
    }) 
  },
  feel: function (e) {
    var index = null;
    if (e.currentTarget != null) {
      this.submitEva(1, e.currentTarget.dataset.index);
      index = e.currentTarget.dataset.index;
    } else {
      index = e;
    }
    for (var i = 0; i <= index; i++) {
      this.data.feelList[i] = 'icon--star-active';
    }
    for (var i = index + 1; i < 5; i++) {
      this.data.feelList[i] = 'icon--star';
    }
    this.setData({
      feelList: this.data.feelList,
      feel: this.data.level[index]
    })

  },
  use: function (e) {
    var index = null;
    if (e.currentTarget != null) {
      this.submitEva(2, e.currentTarget.dataset.index);
      index = e.currentTarget.dataset.index;
    } else {
      index = e;
    }
    for (var i = 0; i <= index; i++) {
      this.data.useList[i] = 'icon--star-active';
    }
    for (var i = index + 1; i < 5; i++) {
      this.data.useList[i] = 'icon--star';
    }
    this.setData({
      useList: this.data.useList,
      use: this.data.level[index]
    })
  },
  load: function (e) {
    var index = null;
    if (e.currentTarget != null) {
      this.submitEva(3, e.currentTarget.dataset.index);
      index = e.currentTarget.dataset.index;
    } else {
      index = e;
    }
    for (var i = 0; i <= index; i++) {
      this.data.loadList[i] = 'icon--star-active';
    }
    for (var i = index + 1; i < 5; i++) {
      this.data.loadList[i] = 'icon--star';
    }
    this.setData({
      loadList: this.data.loadList,
      load: this.data.level[index]
    })
  },
  submitEva:function(id,index){
    console.log(id + "" + app.globalData.openid+" "+index)
    wx.request({
      url: app.globalData.domain + '/writeEvaluate/' + id + '/' + app.globalData.userinfo.num+"/"+index,
      method: 'POST',
      header: app.globalData.header,
      success:function(res){
        console.log(res)
      }
    })
  },
  search: function (e) {
    wx.navigateTo({
      url: 'search',
    })
  },
  show_image:function(){
    this.setData({
      image_show:false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var remindList = ["申明：无论您是拾者还是失主，请务必认真阅读以下须知谨慎待之","本平台只负责信息传递，失物的保管及完整性由当事人（拾物者）自行负责", "发布失物或寻物信息请注意您的个人信息泄漏，由此造成的手机骚扰等损失本平台不负任何责任", "当有失主已确认失物时，双方自行商讨归还失物，发布消息者及时结束消息", "信息的真实性由发布者自行负责，本平台不负任何责任","通过本平台发布的信息发生任何意外均与本平台无关"]
    var count = 0
    console.log('asd'+app.globalData.power)
    
    this.getEvaluate();
  },
  scrolltxt: function () {
    var that = this;
    var length = that.data.length;//滚动文字的宽度
    var windowWidth = that.data.windowWidth;//屏幕宽度
    if (length > windowWidth) {
      var interval = setInterval(function () {
        var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        }
        else {
          //console.log("替换");
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
      that.data.stop = interval;
    }
    else {
      that.setData({ marquee_margin: "1000" });//只显示一条不滚动右边间距加大，防止重复显示
    }
  },
  
  getEvaluate:function(){
    var that = this
    wx.request({
      url: app.globalData.domain + '/getEvaluate',
      method: 'GET',
      header: app.globalData.header,
      data: {
        openid: app.globalData.userinfo.num,
      },
      success: function (res) {
        console.log(res)
        if (res.data != "") {
          if (res.data.uiL > -1) {
            that.ui(res.data.uiL);
          }
          if (res.data.useL > -1) {
            that.use(res.data.useL);
          }
          if (res.data.feelL > -1) {
            that.feel(res.data.feelL);
          }
          if (res.data.loadL > -1) {
            that.load(res.data.loadL);
          }
        }
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var date = new Date();
    this.setData({
      date: date.toLocaleString(),
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { 
    var that =this    
    if (app.globalData.school) {
      that.setData({
        status: "校园用户",//填写校园信息,
        PersonInfo: false,
      })
    }
    if (app.globalData.isManager) {
      that.setData({
        status: "管理员"
      })
    }
    var length = that.data.remind.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    //console.log(length,windowWidth);
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    that.scrolltxt();// 第一个字消失后立即从右边出现
  },

  /**
   * 优化思路，在index界面获取物品信息，可以减少用户进入service界面是信息加载时间
   * index界面只获得所有重要物品以及一页普通物品数据，其他则继续在service界面获取
   * 从数据库获取信息只会在本页面和service翻页时进行，其他所有操作均直接操作app中的
   * info以及valuable，对内存直接操作，不在从新到数据库获取新数据。
   */
  onHide: function () {
    app.globalData.notice = this.data.notice
    console.log("index隐藏")
    console.log(this.data.stop)
    //防止页面被隐藏后，还在循环，切换回来造成卡顿，所以隐藏停止轮询
    clearInterval(this.data.stop);
    // this.scrolltxt();
  },
  toThanks:function(){
    wx.navigateTo({
      url: 'thanks',
    })
  },
  toNews: function () {
    wx.navigateTo({
      url: 'news',
    })
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
    console.log("下拉刷新")
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
  /**
   * 用户授权
   */
 
  /**
   * 显示模态对话框
   */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  showDialogBtn2: function () {
    this.setData({
      showModal2: true
    })
  },
  /**
  * 隐藏模态对话框
  */
  hideModal2: function () {
    this.setData({
      showModal2: false
    });
  },
  showModal(e) {
    this.setData({
      modalName: "login"
    })
  },
  hideModal:function(e) {
    console.log(e)
    this.setData({
      modalName:"asda"
    })
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  onCancel2: function () {
    this.hideModal2();
  },
  /**
   * 接收用户建议
   */
  suggestion:function(res){
    console.log(res)
    this.data.suggestion = res.detail.value;
  },
  /**
   * 因为接收用户建议使用bindlur触发的时间，当用户点击完成确定此时使用bindtap触发发送信
   * 息事件，两事件处于竞争状态，不能确定两者先后次序，但这里需求是要先记录用户建议在发送
   * ，所以在发送信息事件用setTimeout延迟执行1s写入操作，保证先得到用户建议后写入后端
   */
  sendSuggestion:function(){
    this.setData({
      showModal2:false
    })
    var that = this
    setTimeout(function(){
    },1000)
  },
  toManager:function(){
    if (app.globalData.isManager){
      wx.navigateTo({
        url: 'manager',
      })
    }else{
      wx.switchTab({
        url: 'user',
      })
    }
  },
})